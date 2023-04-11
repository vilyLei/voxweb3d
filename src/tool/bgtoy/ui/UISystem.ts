import ScreenAlignPlaneEntity from "../../../vox/entity/ScreenAlignPlaneEntity";
import AABB2D from "../../../vox/geom/AABB2D";
import Color4 from "../../../vox/material/Color4";
import RendererState from "../../../vox/render/RendererState";
import IRendererScene from "../../../vox/scene/IRendererScene";
import IRendererSceneGraph from "../../../vox/scene/IRendererSceneGraph";

import RemoveBlackBGMaterial from "../../material/RemoveBlackBGMaterial";

import SelectionBarStyle from "../../../orthoui/button/SelectionBarStyle";
import { CtrlInfo, ItemCallback, CtrlItemParam, ParamCtrlUI } from "../../../orthoui/usage/ParamCtrlUI";

import { Background } from "./Background";
import Vector3D from "../../../vox/math/Vector3D";
import ProgressBarStyle from "../../../orthoui/button/ProgressBarStyle";
import { UIBuilder } from "./UIBuilder";
import MouseEvent from "../../../vox/event/MouseEvent";

class UISystem {
	private m_rscene: IRendererScene = null;
	private m_graph: IRendererSceneGraph = null;
	private m_uiBuilder = new UIBuilder();
	background = new Background();
	ctrlui = new ParamCtrlUI(false);
	position = new Vector3D(552, 80);
	constructor() {}

	initialize(graph: IRendererSceneGraph): void {
		if (this.m_graph == null && graph != null) {
			this.m_graph = graph;
			this.m_rscene = this.m_graph.getNodeAt(0).getRScene();
			this.init();
		}
	}
	private init(): void {
		let graph = this.m_graph;

		let bg = this.background;
		bg.initialize(this.m_rscene);

		this.initUI();
		this.m_uiBuilder.buildFinishCall = (): void => {
			console.log("VVVVVVVV oooooooooo");
			this.initUIItems();
		}
		this.m_uiBuilder.initialize( graph );
	}

	private m_currMaterial: RemoveBlackBGMaterial = null;
	private m_initUI = true;
	private m_bgColor = new Color4();
	private m_savingCall: ()=> void = null;
	setCurrMaterial(currMaterial: RemoveBlackBGMaterial): void {
		this.m_currMaterial = currMaterial;
	}
	setSavingListener(call: ()=> void): void {
		this.m_savingCall = call;
	}
	disable(): void {
		this.ctrlui.ruisc.disable();
		this.background.disable();
	}
	enable(): void {
		this.ctrlui.ruisc.enable();
		this.background.enable();
	}
	private initUI(): void {
		if (!this.m_initUI) {
			return;
		}
		this.m_initUI = false;

		let ui = this.ctrlui;
		ui.selectPlaneEnabled = false;
		ui.setYSpace(30);
		ui.syncStageSize = false;
		ui.fontBgColor.setRGBA4f(0.7,0.8,0.6, 0.6);
		ui.proBarBGBarAlpha = 0.9;
		ui.proBarBGPlaneAlpha = 0.7;
		ui.initialize(this.m_rscene, true);
		this.m_graph.addScene(ui.ruisc);
	}
	private initUIItems(): void {

		let ui = this.ctrlui;
		let selectBarStyle: SelectionBarStyle = null;
		selectBarStyle = new SelectionBarStyle();
		selectBarStyle.headFontBgColor.setRGBA4f(1.0,1.0,1.0, 0.0);
		selectBarStyle.bodyFontBgColor.setRGBA4f(1.0,1.0,1.0, 0.5);
		selectBarStyle.headAlignType = "left";
		selectBarStyle.headAlignPosValue = -270;
		selectBarStyle.headEnabled = false;

		let progressBarStyle: ProgressBarStyle = null;
		progressBarStyle = new ProgressBarStyle();
		progressBarStyle.headFontBgColor.setRGBA4f(1.0,1.0,1.0, 0.0);
		progressBarStyle.bodyFontBgColor.setRGBA4f(1.0,1.0,1.0, 0.5);
		progressBarStyle.headAlignType = "left";
		progressBarStyle.headAlignPosValue = selectBarStyle.headAlignPosValue;
		progressBarStyle.headEnabled = selectBarStyle.headEnabled;
		progressBarStyle.progressBarLength = 300;

		// ui.addStatusItem("保存", "save", "图片", "图片", true, (info: CtrlInfo): void => {
		// 	// this.m_savingImg = true;
		// 	if(this.m_savingCall) {
		// 		this.m_savingCall();
		// 	}
		// }, true, false, selectBarStyle);
		ui.addStatusItem("切换", "change_bg_color", "背景色", "背景色", false, (info: CtrlInfo): void => {
			this.m_bgColor.randomRGB(0.15);
			this.m_rscene.setClearRGBAColor4f(this.m_bgColor.r,this.m_bgColor.g, this.m_bgColor.b, 0.0);
		}, true, false, selectBarStyle);
		ui.addStatusItem("原图显示", "reset_init_img", "Yes", "No", false, (info: CtrlInfo): void => {
			if(this.m_currMaterial) {
				this.m_currMaterial.setParam3(info.flag?0.0:1.0);
			}
		}, true, false, selectBarStyle);
		ui.addStatusItem("反相剔除", "invert_discard", "Yes", "No", false, (info: CtrlInfo): void => {
			if(this.m_currMaterial) {
				this.m_currMaterial.setInvertDiscard(info.flag);
			}
		}, true, false, selectBarStyle);
		// ui.addStatusItem("恢复", "reset", "默认设置", "默认设置", true, (info: CtrlInfo): void => {
		// 	this.resetCtrlValue();
		// }, true, false, selectBarStyle);
		ui.addValueItem("透明度强度", "alpha_factor", 1.0, 0.0, 3.0, (info: CtrlInfo): void => {
			if(this.m_currMaterial) {
				this.m_currMaterial.setParam0(info.values[0]);
			}
		}, false, true, null, false, progressBarStyle);

		ui.addValueItem("颜色强度", "color_factor", 1.0, 0.0, 5.0, (info: CtrlInfo): void => {
			if(this.m_currMaterial) {
				this.m_currMaterial.setParam1(info.values[0]);
			}
		}, false, true, null, false, progressBarStyle);

		ui.addValueItem("透明度剔除比例", "alpha_discard_factor", 0.02, 0.0, 0.96, (info: CtrlInfo): void => {
			if(this.m_currMaterial) {
				this.m_currMaterial.setParam2(info.values[0]);
			}
		}, false, true, null, false, progressBarStyle);
		// 还可以设置: 更红，更绿，更蓝

		let resetBtn = this.m_uiBuilder.resetBtn;
		let saveBtn = this.m_uiBuilder.saveBtn;
		resetBtn.addEventListener(MouseEvent.MOUSE_DOWN, this, (evt: any):void=>{
			this.resetCtrlValue();
		});
		saveBtn.addEventListener(MouseEvent.MOUSE_DOWN, this, (evt: any):void=>{
			if(this.m_savingCall) {
				this.m_savingCall();
			}
		});
		ui.ruisc.addEntity(resetBtn);
		ui.ruisc.addEntity(saveBtn);

		this.updateLayout();
		this.initTextDiv();
	}

	private resetCtrlValue(): void {

		let ui = this.ctrlui;

		console.log("resetCtrlValue() ...");
		ui.setUIItemValue("alpha_factor", 1.0);
		ui.setUIItemValue("color_factor", 1.0);
		ui.setUIItemValue("alpha_discard_factor", 0.02);
		ui.setUIItemFlag("reset_init_img", false);
		ui.setUIItemFlag("invert_discard", false);
	}
	updateLayout(rect: AABB2D = null): void {
		if(this.ctrlui) {
			let factor = this.m_rscene.getRenderProxy().getDevicePixelRatio();
			let pv = this.position.clone();
			pv.scaleBy( factor );
			this.ctrlui.updateLayout(true, pv);

			let bounds = this.ctrlui.bounds;

			factor = 1.0;
			let resetBtn = this.m_uiBuilder.resetBtn;
			let saveBtn = this.m_uiBuilder.saveBtn;
			resetBtn.setXY(bounds.x * factor, 20);
			saveBtn.setXY((bounds.getRight() - saveBtn.getWidth()) * factor, 20);
		}
	}

	private initTextDiv(): void {
		let div = document.createElement("div");
		div.style.color = "";
		let pdiv: any = div;
		pdiv.width = 256;
		pdiv.height = 64;
		pdiv.style.backgroundColor = "#112211";
		pdiv.style.left = 10 + "px";
		pdiv.style.top = 10 + "px";
		pdiv.style.zIndex = "99999";
		pdiv.style.position = "absolute";
		document.body.appendChild(pdiv);
		pdiv.innerHTML = "<font color='#eeee00'>将图片拖入任意区域, 去除黑色背景生成透明PNG</font>";
	}

	createDiv(px: number, py: number, pw: number, ph: number): HTMLDivElement {

		let div = document.createElement("div");
		div.style.width = pw + "px";
		div.style.height = ph + "px";
		document.body.appendChild(div);
		div.style.display = "bolck";
		div.style.left = px + "px";
		div.style.top = py + "px";
		div.style.position = "absolute";
		div.style.display = "bolck";
		div.style.position = "absolute";
		return div;
	}
}

export { UISystem };
