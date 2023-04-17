import RendererDevice from "../../vox/render/RendererDevice";
import MouseEvent from "../../vox/event/MouseEvent";

import SelectionBar from "../../orthoui/button/SelectionBar";
import ProgressBar from "../../orthoui/button/ProgressBar";
import ProgressDataEvent from "../../vox/event/ProgressDataEvent";
import CanvasTextureTool from "../../orthoui/assets/CanvasTextureTool";
import SelectionEvent from "../../vox/event/SelectionEvent";
import RGBColorPanel, { RGBColoSelectEvent } from "../../orthoui/panel/RGBColorPanel";
import Color4 from "../../vox/material/Color4";
import Vector3D from "../../vox/math/Vector3D";
import MathConst from "../../vox/math/MathConst";
import Plane3DEntity from "../../vox/entity/Plane3DEntity";

import { CtrlInfo, ItemCallback, CtrlItemParam, CtrlItemObj } from "./ctrlui/CtrlItemObj";
import IRendererScene from "../../vox/scene/IRendererScene";
import EventBase from "../../vox/event/EventBase";
import SelectionBarStyle from "../button/SelectionBarStyle";
import ProgressBarStyle from "../button/ProgressBarStyle";
import AABB2D from "../../vox/geom/AABB2D";

export default class ParamCtrlUI {
	private m_rscene: IRendererScene = null;
	private m_closeBtnFlag = true;
	ruisc: IRendererScene = null;
	rgbPanel: RGBColorPanel;

	readonly fontColor: Color4 = new Color4(1.0, 1.0, 1.0, 1.0);
	readonly fontBgColor: Color4 = new Color4(1.0, 1.0, 1.0, 0.3);

	proBarBGBarAlpha = 0.3;
	proBarBGPlaneAlpha = 0.25;
	syncStageSize = true;
	selectPlaneEnabled = true;
	btnSize = 30;
	processTotal = 3;
	bounds = new AABB2D();

	constructor(closeBtnFlag: boolean = true) {
		this.m_closeBtnFlag = closeBtnFlag;
	}

	initialize(rscene: IRendererScene, buildDisplay: boolean = true): void {
		if (this.m_rscene == null) {
			this.m_rscene = rscene;

			this.m_rscene.addEventListener(MouseEvent.MOUSE_BG_DOWN, this, this.mouseBgDown);

			CanvasTextureTool.GetInstance().initialize(this.m_rscene);
			CanvasTextureTool.GetInstance().initializeAtlas(1024, 1024, new Color4(1.0, 1.0, 1.0, 0.0), true);
			this.initUIScene(buildDisplay);
		}
	}
	close(): void {
		if (this.m_menuBtn) {
			this.menuCtrl(false);
			this.m_menuBtn.select(false);
			if (this.m_selectPlane) this.m_selectPlane.setVisible(false);
		}
	}
	open(): void {
		if (this.m_menuBtn) {
			this.menuCtrl(true);
			this.m_menuBtn.deselect(true);
		}
	}
	isOpen(): boolean {
		return this.m_menuBtn && !this.m_menuBtn.isSelected();
	}
	private initUIScene(buildDisplay: boolean): void {
		let rparam = this.m_rscene.createRendererParam();
		rparam.cameraPerspectiveEnabled = false;
		rparam.setCamProject(45.0, 0.1, 3000.0);
		rparam.setCamPosition(0.0, 0.0, 1500.0);

		this.m_rscene.addEventListener(EventBase.RESIZE, this, this.resize);

		let subScene = this.m_rscene.createSubScene();
		subScene.initialize(rparam, this.processTotal);
		subScene.enableMouseEvent(true);
		this.ruisc = subScene;

		this.resize(null);

		if (buildDisplay) {
			this.initUI();
		}
	}
	viewX = 0;
	viewY = 0;
	viewWidth = 0;
	viewHeight = 0;
	private resize(evt: any): void {
		let stage = this.m_rscene.getStage3D();
		// console.log("ParamCtrlUI(), stage.stageHalfWidth: ", stage.stageHalfWidth);
		if (this.syncStageSize) {
			if (this.viewWidth > 0) {
				this.ruisc.setViewPort(this.viewX, this.viewY, this.viewWidth, this.viewHeight);
			} else {
				this.ruisc.setViewPort(0, 0, stage.stageWidth, stage.stageHeight);
			}
		}
		if (this.m_selectPlane) {
			this.m_selectPlane.setVisible(false);
		}
		this.ruisc.getCamera().translationXYZ(stage.stageHalfWidth, stage.stageHalfHeight, 1500.0);
		this.ruisc.getCamera().update();
	}
	private initUI(): void {
		this.initCtrlBars();
	}
	private m_bgLength = 200.0;
	private m_btnPX = 122.0;
	private m_btnPY = 10.0;
	private m_btnYSpace = 4.0;
	private m_pos = new Vector3D();
	private m_selectPlane: Plane3DEntity = null;

	private m_visiBtns: (SelectionBar | ProgressBar)[] = [];
	private m_btns: (SelectionBar | ProgressBar)[] = [];
	private m_menuBtn: SelectionBar = null;
	private m_minBtnX = 10000;
	setYSpace(dis: number): void {
		this.m_btnYSpace = dis;
	}
	private createSelectBtn(
		ns: string,
		uuid: string,
		selectNS: string,
		deselectNS: string,
		flag: boolean,
		visibleAlways: boolean = false,
		style: SelectionBarStyle = null,
		layout: boolean = true
	): SelectionBar {
		let selectBar = new SelectionBar();
		selectBar.style = style;
		selectBar.fontColor.copyFrom(this.fontColor);
		selectBar.fontBgColor.copyFrom(this.fontBgColor);
		selectBar.uuid = uuid;
		selectBar.initialize(this.ruisc, ns, selectNS, deselectNS, this.btnSize);
		selectBar.addEventListener(SelectionEvent.SELECT, this, this.selectChange);
		if (flag) {
			selectBar.select(false);
		} else {
			selectBar.deselect(false);
		}
		// selectBar.setXY(this.m_btnPX, this.m_btnPY);
		// this.m_btnPY += this.btnSize + this.m_btnYSpace;
		if (!visibleAlways) this.m_visiBtns.push(selectBar);

		if (layout) {
			this.m_btns.push(selectBar);
		}

		// let minX = this.m_btnPX + selectBar.getRect().x;
		// if (minX < this.m_minBtnX) {
		// 	this.m_minBtnX = minX;
		// }
		return selectBar;
	}
	private createProgressBtn(
		ns: string,
		uuid: string,
		progress: number,
		visibleAlways: boolean = false,
		style: ProgressBarStyle = null,
		layout: boolean = true
	): ProgressBar {
		let proBar = new ProgressBar();
		proBar.style = style;
		proBar.fontColor.copyFrom(this.fontColor);
		proBar.fontBgColor.copyFrom(this.fontBgColor);
		proBar.bgBarAlpha = this.proBarBGBarAlpha;
		proBar.bgPlaneAlpha = this.proBarBGPlaneAlpha;
		proBar.uuid = uuid;
		proBar.initialize(this.ruisc, ns, this.btnSize, this.m_bgLength);
		proBar.setProgress(progress, false);
		proBar.addEventListener(ProgressDataEvent.PROGRESS, this, this.valueChange);

		// proBar.setXY(this.m_btnPX, this.m_btnPY);
		// this.m_btnPY += this.btnSize + this.m_btnYSpace;

		if (!visibleAlways) this.m_visiBtns.push(proBar);
		if (layout) {
			this.m_btns.push(proBar);
		}

		// let minX = this.m_btnPX + proBar.getRect().x;
		// if (minX < this.m_minBtnX) {
		// 	this.m_minBtnX = minX;
		// }
		return proBar;
	}

	private createValueBtn(
		ns: string,
		uuid: string,
		value: number,
		minValue: number,
		maxValue: number,
		visibleAlways: boolean = false,
		style: ProgressBarStyle = null,
		layout: boolean = true
	): ProgressBar {
		let proBar = new ProgressBar();
		proBar.style = style;
		proBar.fontColor.copyFrom(this.fontColor);
		proBar.fontBgColor.copyFrom(this.fontBgColor);
		proBar.bgBarAlpha = this.proBarBGBarAlpha;
		proBar.bgPlaneAlpha = this.proBarBGPlaneAlpha;
		proBar.uuid = uuid;
		proBar.initialize(this.ruisc, ns, this.btnSize, this.m_bgLength);
		proBar.minValue = minValue;
		proBar.maxValue = maxValue;
		proBar.setValue(value, false);

		proBar.addEventListener(ProgressDataEvent.PROGRESS, this, this.valueChange);
		// proBar.setXY(this.m_btnPX, this.m_btnPY);
		// this.m_btnPY += this.btnSize + this.m_btnYSpace;

		if (!visibleAlways) this.m_visiBtns.push(proBar);
		if (layout) {
			this.m_btns.push(proBar);
		}

		// let minX = this.m_btnPX + proBar.getRect().x;
		// if (minX < this.m_minBtnX) {
		// 	this.m_minBtnX = minX;
		// }
		return proBar;
	}
	private moveSelectToBtn(btn: ProgressBar | SelectionBar): void {
		let rect = btn.getRect();
		if (this.m_selectPlane) {
			this.m_selectPlane.setXYZ(rect.x, rect.y, -1.0);
			this.m_selectPlane.setScaleXYZ(rect.width, rect.height, 1.0);
			this.m_selectPlane.update();
			this.m_selectPlane.setVisible(true);
		}
	}
	private initCtrlBars(): void {
		if (RendererDevice.IsMobileWeb()) {
			this.btnSize = 64;
			this.m_btnPX = 300;
			this.m_btnPY = 30;
		}
		if (RendererDevice.IsWebGL1()) {
			this.m_btnPX += 32;
			this.btnSize = MathConst.CalcCeilPowerOfTwo(this.btnSize);
		}
		if (this.m_closeBtnFlag) {
			this.m_menuBtn = this.createSelectBtn("", "menuCtrl", "Menu Open", "Menu Close", false, true);
		}

		if (this.selectPlaneEnabled) this.m_selectPlane = new Plane3DEntity();

		if (this.m_selectPlane) {
			this.m_selectPlane.vertColorEnabled = true;
			this.m_selectPlane.color0.setRGB3f(0.0, 0.3, 0.0);
			this.m_selectPlane.color1.setRGB3f(0.0, 0.3, 0.0);
			this.m_selectPlane.color2.setRGB3f(0.0, 0.5, 0.5);
			this.m_selectPlane.color3.setRGB3f(0.0, 0.5, 0.5);
			this.m_selectPlane.initializeXOY(0, 0, 1.0, 1.0);
			this.ruisc.addEntity(this.m_selectPlane);
			this.m_selectPlane.setVisible(false);
		}

		let flag = RendererDevice.IsMobileWeb();
		this.rgbPanel = new RGBColorPanel();
		this.rgbPanel.initialize(flag ? 64 : 32, 4);
		this.rgbPanel.addEventListener(RGBColoSelectEvent.COLOR_SELECT, this, this.selectColor);
		this.rgbPanel.setXY(this.m_btnPX, this.m_btnPY);
		this.rgbPanel.close();
		this.ruisc.addContainer(this.rgbPanel, 1);
	}
	private m_btnMap: Map<string, CtrlItemObj> = new Map();
	//"number_value"(数值调节按钮),"progress"(百分比调节按钮),"status_select"(状态选择按钮)
	addItem(param: CtrlItemParam, style: any = null, layout: boolean = true): void {
		let map = this.m_btnMap;
		if (!map.has(param.uuid)) {
			let obj = new CtrlItemObj();
			obj.param = param;
			obj.type = param.type;
			obj.uuid = param.uuid;
			let t = param;
			let visibleAlways = t.visibleAlways ? t.visibleAlways : false;
			t.colorPick = t.colorPick ? t.colorPick : false;
			style = style ? (style as ProgressBarStyle) : null;
			switch (param.type) {
				case "number_value":
				case "number":
					t.value = t.value ? t.value : 0.0;
					t.minValue = t.minValue ? t.minValue : 0.0;
					t.maxValue = t.maxValue ? t.maxValue : 10.0;
					obj.btn = this.createValueBtn(t.name, t.uuid, t.value, t.minValue, t.maxValue, false, style, layout);
					map.set(obj.uuid, obj);
					if (!t.colorPick) {
						obj.info = { type: param.type, uuid: param.uuid, values: [t.value], flag: t.flag };
						if (param.syncEnabled) {
							param.callback(obj.info);
						}
					}
					break;
				case "progress":
					t.progress = t.progress ? t.progress : 0.0;
					obj.btn = this.createProgressBtn(t.name, t.uuid, t.progress, visibleAlways, style, layout);
					map.set(obj.uuid, obj);
					if (!t.colorPick) {
						obj.info = { type: param.type, uuid: param.uuid, values: [t.progress], flag: t.flag };
						if (param.syncEnabled) {
							param.callback(obj.info);
						}
					}
					break;
				case "status":
				case "status_select":
					t.flag = t.flag ? t.flag : false;
					obj.btn = this.createSelectBtn(t.name, t.uuid, t.selectNS, t.deselectNS, t.flag, visibleAlways, style, layout);
					map.set(obj.uuid, obj);
					obj.info = { type: param.type, uuid: param.uuid, values: [], flag: t.flag };
					if (param.syncEnabled) {
						param.callback(obj.info);
					}
					break;
				default:
					break;
			}
		}
	}
	addItems(params: CtrlItemParam[]): void {
		for (let i = 0; i < params.length; ++i) {
			this.addItem(params[i]);
		}
	}
	getItemByUUID(uuid: string): CtrlItemObj {
		if (this.m_btnMap.has(uuid)) {
			return this.m_btnMap.get(uuid);
		}
		return null;
	}

	setUIItemVisible(ns: string, visible: boolean): void {
		let item = this.getItemByUUID(ns);
		if (item) {
			item.btn.setVisible(visible);
			item.updateParamToUI();
		}
	}
	setUIItemValue(ns: string, value: number, syncEnabled: boolean = true): void {
		let item = this.getItemByUUID(ns);
		if (item) {
			item.param.value = value;
			item.syncEnabled = syncEnabled;
			item.updateParamToUI();
		}
	}
	setUIItemFlag(ns: string, flag: boolean, syncEnabled: boolean = true): void {
		let item = this.getItemByUUID(ns);
		if (item) {
			item.param.flag = flag;
			item.syncEnabled = syncEnabled;
			item.updateParamToUI();
		}
	}
	private menuCtrl(flag: boolean): void {
		if (flag && !this.m_visiBtns[0].isOpen()) {
			for (let i: number = 0; i < this.m_visiBtns.length; ++i) {
				this.m_visiBtns[i].open();
			}
			if (this.m_menuBtn) this.m_menuBtn.getPosition(this.m_pos);
			this.m_pos.x = this.m_btnPX;
			if (this.m_menuBtn) this.m_menuBtn.setPosition(this.m_pos);
		} else if (this.m_visiBtns[0].isOpen()) {
			for (let i: number = 0; i < this.m_visiBtns.length; ++i) {
				this.m_visiBtns[i].close();
			}
			if (this.m_menuBtn) this.m_menuBtn.getPosition(this.m_pos);
			this.m_pos.x = 0;
			if (this.m_menuBtn) this.m_menuBtn.setPosition(this.m_pos);

			if (this.m_selectPlane) {
				this.m_selectPlane.setVisible(false);
			}
		}
		if (this.rgbPanel != null) this.rgbPanel.close();
	}
	getBodyHeight(force: boolean = false): number {
		let btns = force ? this.m_btns : this.m_visiBtns;
		let bodyHeight = 0;
		for (let i = 0; i < btns.length; ++i) {
			bodyHeight += btns[i].getRect().height;
		}
		return bodyHeight;
	}
	updateLayout(force: boolean = false, fixPos: Vector3D = null, distance: number = 5, height: number = 0): void {
		let pos = new Vector3D();
		let offsetV = new Vector3D();
		if (fixPos == null) {
			fixPos = new Vector3D();
		}
		let btns = force ? this.m_btns : this.m_visiBtns;
		let bounds = this.bounds;
		let py = 0;

		if (btns.length > 0) {
			btns[0].getPosition(pos);
			pos.y -= this.m_btnYSpace;
			py = pos.y;
			if (btns.length > 1 && height > 0) {
				let bodyH = this.getBodyHeight(force);
				this.m_btnYSpace = (height - bodyH) / (btns.length - 1);
			}
		}
		for (let i = 0; i < btns.length; ++i) {
			btns[i].getPosition(pos);
			pos.y = py;
			py += btns[i].getRect().height;
			btns[i].setPosition(pos);
			btns[i].update();
			bounds.union(btns[i].getRect());
			py += this.m_btnYSpace;
		}

		offsetV.x = fixPos.x - bounds.x;
		offsetV.y = fixPos.y - bounds.y;
		offsetV.x += distance;
		offsetV.y += distance;

		bounds.reset();
		for (let i = 0; i < btns.length; ++i) {
			btns[i].getPosition(pos);
			pos.addBy(offsetV);
			btns[i].setPosition(pos);
			btns[i].update();
			bounds.union(btns[i].getRect());
		}
		// bounds.update();
		if (this.rgbPanel) {
			this.rgbPanel.setXY(this.m_btnPX, this.m_btnPY);
		}
	}

	private selectChange(evt: any): void {
		let selectEvt = evt as SelectionEvent;
		let flag = selectEvt.flag;
		let uuid = selectEvt.uuid;
		let map = this.m_btnMap;
		if (map.has(uuid)) {
			let obj = map.get(uuid);
			obj.sendFlagOut(flag);
			this.moveSelectToBtn(selectEvt.target);
		}
		if (this.rgbPanel != null) this.rgbPanel.close();
	}
	private m_currUUID = "";
	private selectColor(evt: any): void {
		let currEvt = evt as RGBColoSelectEvent;
		console.log("selectColor, currEvt: ", currEvt);
		let uuid = this.m_currUUID;
		let map = this.m_btnMap;
		if (map.has(uuid)) {
			let obj = map.get(uuid);
			let param = obj.param;
			if (param.colorPick) {
				obj.colorId = currEvt.colorId;
				obj.sendColorOut(currEvt.color);
			}
		}
	}
	private valueChange(evt: any): void {
		let progEvt = evt as ProgressDataEvent;
		let value = progEvt.value;
		let uuid = progEvt.uuid;
		let map = this.m_btnMap;
		let changeFlag = this.m_currUUID != uuid;
		this.m_currUUID = uuid;

		if (map.has(uuid)) {
			let obj = map.get(uuid);
			let param = obj.param;
			if (progEvt.status == 2) {
				obj.sendValueOut(value);

				if (this.rgbPanel != null && changeFlag) this.rgbPanel.close();
			} else if (progEvt.status == 0) {
				console.log("only select the btn");
				if (param.colorPick) {
					if (this.rgbPanel != null && this.rgbPanel.isClosed()) {
						this.rgbPanel.open();
					}
					if (obj.colorId >= 0) this.rgbPanel.selectColorById(obj.colorId);
				} else {
					if (this.rgbPanel != null) this.rgbPanel.close();
				}
			}
			this.moveSelectToBtn(progEvt.target);
		}
	}
	private mouseBgDown(evt: any): void {
		if (this.rgbPanel != null) this.rgbPanel.close();
	}

	addStatusItemWithParam(bparam: StatusItemBuildParam, callback: ItemCallback): void {
		let param: CtrlItemParam = {
			type: "status_select",
			name: bparam.name,
			uuid: bparam.uuid,
			selectNS: bparam.selectNS,
			deselectNS: bparam.deselectNS,
			flag: bparam.flag,
			visibleAlways: bparam.visibleAlways,
			syncEnabled: bparam.syncEnabled,
			callback: callback
		};

		this.addItem(param, bparam.style, bparam.layout);
	}
	addValueItemWithParam(bparam: ValueItemBuildParam, callback: ItemCallback): void {
		let param: CtrlItemParam = {
			type: "number_value",
			name: bparam.name,
			uuid: bparam.uuid,
			value: bparam.value,
			minValue: bparam.minValue,
			maxValue: bparam.maxValue,
			visibleAlways: bparam.visibleAlways,
			syncEnabled: bparam.syncEnabled,
			colorPick: bparam.colorPick,
			values: bparam.values,
			callback: callback
		};
		this.addItem(param, bparam.style, bparam.layout);
	}
	
	addProgressItemWithParam(bparam: ProgressItemBuildParam, callback: ItemCallback): void {
		let param: CtrlItemParam = {
			type: "progress",
			name: bparam.name,
			uuid: bparam.uuid,
			progress: bparam.progress,
			visibleAlways: bparam.visibleAlways,
			colorPick: bparam.colorPick,
			syncEnabled: bparam.syncEnabled,
			callback: callback
		};
		this.addItem(param, bparam.style, bparam.layout);
	}

	addStatusItem(
		name: string,
		uuid: string,
		selectNS: string,
		deselectNS: string,
		flag: boolean,
		callback: ItemCallback,
		visibleAlways: boolean = true,
		syncEnabled: boolean = true,
		style: SelectionBarStyle = null
	): void {
		let param: CtrlItemParam = {
			type: "status_select",
			name: name,
			uuid: uuid,
			selectNS: selectNS,
			deselectNS: deselectNS,
			flag: flag,
			visibleAlways: visibleAlways,
			syncEnabled: syncEnabled,
			callback: callback
		};

		this.addItem(param, style);
	}
	addProgressItem(
		name: string,
		uuid: string,
		progress: number,
		callback: ItemCallback,
		colorPick?: boolean,
		visibleAlways: boolean = true,
		syncEnabled: boolean = true,
		style: SelectionBarStyle = null
	): void {
		let param: CtrlItemParam = {
			type: "progress",
			name: name,
			uuid: uuid,
			progress: progress,
			visibleAlways: visibleAlways,
			colorPick: colorPick,
			syncEnabled: syncEnabled,
			callback: callback
		};
		this.addItem(param, style);
	}

	addValueItem(
		name: string,
		uuid: string,
		value: number,
		minValue: number,
		maxValue: number,
		callback: ItemCallback,
		colorPick?: boolean,
		visibleAlways: boolean = true,
		values?: number[],
		syncEnabled: boolean = true,
		style: SelectionBarStyle = null
	): void {
		let param: CtrlItemParam = {
			type: "number_value",
			name: name,
			uuid: uuid,
			value: value,
			minValue: minValue,
			maxValue: maxValue,
			visibleAlways: visibleAlways,
			syncEnabled: syncEnabled,
			colorPick: colorPick,
			values: values,
			callback: callback
		};
		this.addItem(param, style);
	}
}


class ItemBuildParam {
	name: string;
	uuid: string;
	visibleAlways = true;
	syncEnabled = true;
	style: SelectionBarStyle = null;
	layout = true;
	colorPick?: boolean;
	constructor(){}
}

class StatusItemBuildParam extends ItemBuildParam {

	selectNS: string;
	deselectNS: string;
	flag: boolean;
	constructor(name: string, uuid: string, selectNS: string, deselectNS: string, flag: boolean, vals = true, syncEnabled = true) {
		super();
		this.name = name;
		this.uuid = uuid;
		this.selectNS = selectNS;
		this.deselectNS = deselectNS;
		this.flag = flag;
		this.visibleAlways = vals;
		this.syncEnabled = syncEnabled;
	}
}

class ValueItemBuildParam extends ItemBuildParam {

	value: number;
	minValue: number;
	maxValue: number;
	values?: number[];

	constructor(name: string, uuid: string, value: number, minValue: number, maxValue: number, vals = true, syncEnabled = true) {
		super();
		this.name = name;
		this.uuid = uuid;
		this.minValue = minValue;
		this.maxValue = maxValue;
		this.value = value;
		this.visibleAlways = vals;
		this.syncEnabled = syncEnabled;
	}
}

class ProgressItemBuildParam extends ItemBuildParam {

	progress: number;
	constructor(name: string, uuid: string, progress: number, vals = true, syncEnabled = true) {
		super();
		this.name = name;
		this.uuid = uuid;
		this.progress = progress;
		this.visibleAlways = vals;
		this.syncEnabled = syncEnabled;
	}
}

export { ProgressItemBuildParam, ValueItemBuildParam, StatusItemBuildParam, CtrlInfo, ItemCallback, CtrlItemParam, CtrlItemObj, ParamCtrlUI };
