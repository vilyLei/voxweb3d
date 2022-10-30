import { ICoMaterial } from "../../../voxmaterial/ICoMaterial";

import { ICoRScene } from "../../../voxengine/ICoRScene";
import { IButton } from "../../../voxui/button/IButton";

import IColor4 from "../../../voxui/../../vox/material/IColor4";

import { ICoUIScene } from "../../../voxui/scene/ICoUIScene";
import { ITextLabel } from "../../../voxui/entity/ITextLabel";
import { UIPanel } from "../../../voxui/panel/UIPanel";
import { IFlagButton } from "../../../voxui/button/IFlagButton";

import { IUIPanel } from "../../../voxui/panel/IUIPanel";
import IVector3D from "../../../../vox/math/IVector3D";
import IAABB from "../../../../vox/geom/IAABB";
import { ISelectButtonGroup } from "../../../voxui/button/ISelectButtonGroup";
import { IColorClipLabel } from "../../../voxui/entity/IColorClipLabel";
import IEvtDispatcher from "../../../../vox/event/IEvtDispatcher";
import ISelectionEvent from "../../../../vox/event/ISelectionEvent";

import { ITextParam, ICoUI } from "../../../voxui/ICoUI";
import IProgressDataEvent from "../../../../vox/event/IProgressDataEvent";
declare var CoUI: ICoUI;

declare var CoRScene: ICoRScene;
declare var CoMaterial: ICoMaterial;
class NormalCtrlPanel {

	private m_normalVisiBtn: IFlagButton;
	private m_modelVisiBtn: IFlagButton;
	private m_diffBtn: IFlagButton;
	private m_normalFlipBtn: IFlagButton;

	private m_btnW: number = 90;
	private m_btnH: number = 50;
	private m_scene: ICoUIScene = null;
	private m_rpi: number;
	private m_panelW: number;
	private m_panelH: number;
	private m_v0: IVector3D;
	private m_panel: IUIPanel = null;

	private m_btnGroup: ISelectButtonGroup;

	private m_selectDispatcher: IEvtDispatcher;
	private m_progressDispatcher: IEvtDispatcher;
	private m_progressEvt: IProgressDataEvent;
	private m_normalScale = 0.0;

	autoLayout: boolean = true;

	constructor() { }

	getScene(): ICoUIScene {
		return this.m_scene;
	}

	setBGColor(c: IColor4): void {
		if (this.m_panel == null) this.m_panel = CoUI.createUIPanel();
		this.m_panel.autoLayout = false;
		this.m_panel.setBGColor(c);
	}

	initialize(scene: ICoUIScene, rpi: number, panelW: number, panelH: number, btnH: number): void {

		if (this.m_scene == null) {

			this.m_scene = scene;
			this.m_rpi = rpi;

			this.m_panelW = panelW;
			this.m_panelH = panelH;
			this.m_btnH = btnH;

			this.m_v0 = CoRScene.createVec3();
			if (this.m_panel == null) this.m_panel = CoUI.createUIPanel();
			this.m_panel.autoLayout = false;
			this.m_panel.setUIscene(scene);
			this.m_panel.setSize(panelW, panelH);

			this.buildPanel(panelW, panelH);
		}
	}
	destroy(): void {

		this.m_scene = null;

		if (this.m_selectDispatcher != null) {

			this.m_selectDispatcher.destroy();
			this.m_progressDispatcher.destroy();

			this.m_selectDispatcher = null;
			this.m_progressDispatcher = null;

		}
		
		this.m_progressEvt = null;
		this.m_modelVisiBtn = null;
		this.m_normalVisiBtn = null;
		this.m_diffBtn = null;
		this.m_normalFlipBtn = null;

		if (this.m_panel != null) {

			this.m_panel.destroy();
			this.m_panel = null;
		}
	}
	open(scene: ICoUIScene = null, rpi: number = -1): void {

		this.m_panel.open(scene);
		if (this.autoLayout) {
			this.addLayoutEvt();
			this.layout();
		}
	}
	isOpen(): boolean {
		return this.m_panel.isOpen();
	}
	close(): void {
		this.removeLayoutEvt();
		this.m_panel.close();
	}

	addEventListener(type: number, listener: any, func: (evt: any) => void, captureEnabled: boolean = true, bubbleEnabled: boolean = false): void {
		if (type == CoRScene.SelectionEvent.SELECT) {
			this.m_selectDispatcher.addEventListener(type, listener, func, captureEnabled, bubbleEnabled);
		} else if (type == CoRScene.ProgressDataEvent.PROGRESS) {
			this.m_progressDispatcher.addEventListener(type, listener, func, captureEnabled, bubbleEnabled);
		}
	}
	removeEventListener(type: number, listener: any, func: (evt: any) => void): void {
		if (type == CoRScene.SelectionEvent.SELECT) {
			this.m_selectDispatcher.removeEventListener(type, listener, func);
		} else if (type == CoRScene.ProgressDataEvent.PROGRESS) {
			this.m_progressDispatcher.removeEventListener(type, listener, func);
		}
	}
	protected buildPanel(pw: number, ph: number): void {

		this.m_selectDispatcher = CoRScene.createEventBaseDispatcher();
		this.m_progressDispatcher = CoRScene.createEventBaseDispatcher();
		// this.m_flagEvt = CoRScene.createSelectionEvent();
		this.m_progressEvt = CoRScene.createProgressDataEvent();

		let sc = this.m_scene;

		let startX = 10;
		let startY = this.m_panelH - 10 - this.m_btnH;
		let disX = 5;
		let disY = 5;

		let px = startX;
		let py = 0;

		this.m_btnW = 90;
		// let localBtn = this.createBtn("Local", startX, startY, "local");

		let tta = sc.transparentTexAtlas;

		let ME = CoRScene.MouseEvent;
		let textParam: ITextParam = {
			text: "Local",
			textColor: CoMaterial.createColor4(),
			fontSize: 30,
			font: ""
		};
		let fc4 = CoMaterial.createColor4;
		let colors: IColor4[] = [
			fc4().setRGB3Bytes(80, 80, 80),
			fc4().setRGB3Bytes(110, 110, 110),
			fc4().setRGB3Bytes(90, 90, 90),
			fc4().setRGB3Bytes(110, 110, 110)
		];
		let localBtn = CoUI.createTextButton(
			this.m_btnW, this.m_btnH, "local",
			tta, textParam, colors
		);
		localBtn.setXY(startX, startY);

		px = px + this.m_btnW + disX;
		this.m_btnW = 90;
		textParam.text = "Global";
		// let globalBtn = this.createBtn("Global", px, startY, "global");
		let globalBtn = CoUI.createTextButton(
			this.m_btnW, this.m_btnH, "global",
			tta, textParam, colors
		);
		globalBtn.setXY(px, startY);

		px = px + this.m_btnW + disX;
		this.m_btnW = 100;		
		textParam.text = "Color";
		// let differenceBtn = this.createBtn("Difference", px, startY, "difference");
		let modelColorBtn = CoUI.createTextButton(
			this.m_btnW, this.m_btnH, "modelColor",
			tta, textParam, colors
		);
		modelColorBtn.setXY(px, startY);

		let pl = this.m_panel;
		pl.addEntity(localBtn);
		pl.addEntity(globalBtn);
		pl.addEntity(modelColorBtn);

		let btnSize = 28;

		py = startY - this.m_btnH - disY + 20;
		let textLabel = this.createText("Normal line visible", startX + btnSize + disX, py);

		px = startX;
		py = textLabel.getY();
		this.m_normalVisiBtn = this.createFlagBtn(btnSize, px, py, "normal");

		textLabel = this.createText("Model visible", startX + btnSize + disX, py - 10);
		py = textLabel.getY();
		this.m_modelVisiBtn = this.createFlagBtn(btnSize, px, py, "model");
		
		textLabel = this.createText("Normal difference", startX + btnSize + disX, py - 10);
		py = textLabel.getY();
		this.m_diffBtn = this.createFlagBtn(btnSize, px, py, "difference");

		textLabel = this.createText("Normal flip", startX + btnSize + disX, py - 10);
		py = textLabel.getY();
		this.m_normalFlipBtn = this.createFlagBtn(btnSize, px, py, "normalFlip");

		textLabel = this.createText("Normal line length:", startX, py - 15);
		px = startX;
		py = textLabel.getY();
		this.m_dragBar = this.createProgressBtn(px + 5, py - 25, 200);

		py = this.m_dragBar.getY();
		textLabel = this.createText("Normal line color:", startX, py - 10);
		px = startX;
		py = textLabel.getY();
		let colors1 = [
			fc4().setRGB3Bytes(210, 0, 210),
			fc4().setRGB3Bytes(240, 0, 240),
			fc4().setRGB3Bytes(220, 0, 220),
			fc4().setRGB3Bytes(240, 0, 240)
		];
		let normalLineColorBtn = this.createColorBtn(22, 22, "normalLineColor", colors1);
		normalLineColorBtn.setXY(startX + textLabel.getWidth() + disX, py);
		pl.addEntity(normalLineColorBtn);

		px = startX;
		py = textLabel.getY() - disY;
		this.m_btnW = 90;		
		textParam.text = "Test";
		// let differenceBtn = this.createBtn("Difference", px, startY, "difference");
		let normalTestBtn = CoUI.createTextButton(
			this.m_btnW, this.m_btnH, "normalTest",
			tta, textParam, colors
		);
		normalTestBtn.update();
		normalTestBtn.setXY(px, py - normalTestBtn.getHeight());
		pl.addEntity(normalTestBtn);

		//let ME = CoRScene.MouseEvent;
		localBtn.addEventListener(ME.MOUSE_UP, this, this.normalDisplaySelect);
		globalBtn.addEventListener(ME.MOUSE_UP, this, this.normalDisplaySelect);
		modelColorBtn.addEventListener(ME.MOUSE_UP, this, this.normalDisplaySelect);
		normalTestBtn.addEventListener(ME.MOUSE_UP, this, this.normalDisplaySelect);
		normalLineColorBtn.addEventListener(ME.MOUSE_UP, this, this.normalLineColorSelect);

		let group = this.m_btnGroup = CoUI.createSelectButtonGroup();

		group.addButton(localBtn);
		group.addButton(globalBtn);
		group.addButton(modelColorBtn);
		group.setSelectedFunction(
			(btn: IButton): void => {
				let label: IColorClipLabel;

				label = btn.getLable() as IColorClipLabel;
				label.getColorAt(0).setRGB3Bytes(71, 114, 179);
				label.setClipIndex(0);
			},
			(btn: IButton): void => {
				let label: IColorClipLabel;

				label = btn.getLable() as IColorClipLabel;
				label.getColorAt(0).setRGB3Bytes(80, 80, 80);
				label.setClipIndex(0);
			}
		);
		this.m_btnGroup.select(globalBtn.uuid);
	}
	private normalDisplaySelect(evt: any): void {
		this.sendSelectionEvt(evt.uuid, true);
	}
	private normalLineColorSelect(evt: any): void {
		console.log("color select...");
	}

	private selectVisibleFunc(evt: any): void {
		this.sendSelectionEvt(evt.uuid, evt.flag);
	}
	private createFlagBtn(size: number, px: number, py: number, uuid: string = "model"): IFlagButton {

		let sc = this.getScene();
		// let flagBtn = new FlagButton();
		let flagBtn = CoUI.createFlagButton();
		flagBtn.uuid = uuid;
		flagBtn.initializeWithSize(sc.texAtlas, size, size);
		flagBtn.setXY(px, py);
		flagBtn.addEventListener(CoRScene.SelectionEvent.SELECT, this, this.selectVisibleFunc);
		this.m_panel.addEntity(flagBtn);
		return flagBtn;
	}
	getNormalScale(): number {
		return this.m_normalScale;
	}
	setNormalFlag(flag: boolean): void {
		console.log("setNormalFlag, flag: ", flag);
		this.m_normalVisiBtn.setFlag(flag);
	}
	setModelVisiFlag(flag: boolean): void {
		this.m_modelVisiBtn.setFlag(flag);
	}
	setDifferenceFlag(flag: boolean): void {
		this.m_diffBtn.setFlag(flag);
	}
	setNormalFlipFlag(flag: boolean): void {
		this.m_normalFlipBtn.setFlag(flag);
	}
	private sendProgressEvt(uuid: string, v: number): void {

		let e = this.m_progressEvt;
		e.target = this;
		e.status = 2;
		e.type = CoRScene.ProgressDataEvent.PROGRESS;
		e.minValue = 0.0;
		e.maxValue = 1.0;
		e.value = v;
		e.progress = v;
		e.phase = 1;
		e.uuid = uuid;
		this.m_progressDispatcher.dispatchEvt(e);
		e.target = null;
	}

	private sendSelectionEvt(uuid: string, flag: boolean): void {

		let e = CoRScene.createSelectionEvent();
		// let e = this.m_flagEvt;
		e.uuid = uuid;
		e.target = this;
		e.type = CoRScene.SelectionEvent.SELECT;
		e.flag = flag;
		e.phase = 1;
		this.m_selectDispatcher.dispatchEvt(e);
		e.target = null;
	}

	private createText(text: string, px: number, py: number): ITextLabel {
		let sc = this.getScene();
		// let textLabel = new TextLabel();
		let textLabel = CoUI.createTextLabel();
		textLabel.depthTest = true;
		textLabel.transparent = true;
		textLabel.premultiplyAlpha = true;
		textLabel.initialize(text, sc);
		textLabel.setXY(px, py - textLabel.getHeight());
		textLabel.update();
		this.m_panel.addEntity(textLabel);
		return textLabel;
	}
	private m_dragBar: IButton;
	private m_dragging: boolean = false;
	private m_dragMinX = 0;
	private m_dragMaxX = 0;
	private m_progressLen = 0;
	private m_dragBgBar: IButton;
	private createProgressBtn(px: number, py: number, length: number): IButton {

		let sc = this.getScene();
		let color = CoMaterial.createColor4(0.1, 0.1, 0.1);
		// let bgBar = new ColorLabel();
			// let bgBar = CoUI.createColorLabel();
			// bgBar.depthTest = true;
			// bgBar.initialize(length, 10);
			// bgBar.setZ(-0.05);
			// bgBar.setColor(color);
		// bgBar.setXY(px, py);
		// this.m_panel.addEntity(bgBar);
		let barBgLabel = CoUI.createClipColorLabel();
		barBgLabel.initializeWithoutTex(length, 10, 4);
		barBgLabel.getColorAt(0).setRGB3Bytes(70, 70, 70);
		barBgLabel.getColorAt(1).setRGB3f(0.3, 0.3, 0.3);
		barBgLabel.getColorAt(2).setRGB3Bytes(70, 70, 70);
		barBgLabel.getColorAt(3).setRGB3Bytes(70, 70, 70);

		let dragBgBar = CoUI.createButton();
		dragBgBar.initializeWithLable(barBgLabel);
		dragBgBar.setZ(-0.05);
		dragBgBar.setXY(px, py);
		this.m_panel.addEntity(dragBgBar);
		this.m_dragBgBar = dragBgBar;
		
		dragBgBar.addEventListener(CoRScene.MouseEvent.MOUSE_DOWN, this, this.progressBgMouseDown);

		this.m_progressLen = length - 16;
		this.m_proBaseLen = this.m_progressLen;
		this.m_dragMinX = px;
		this.m_dragMaxX = px + this.m_progressLen;

		// let barLabel = new ClipColorLabel();
		let barLabel = CoUI.createClipColorLabel();
		barLabel.initializeWithoutTex(16, 16, 4);
		barLabel.getColorAt(0).setRGB3Bytes(130, 130, 130);
		barLabel.getColorAt(1).setRGB3f(0.2, 1.0, 0.2);
		barLabel.getColorAt(2).setRGB3f(0.2, 1.0, 1.0);

		// let dragBar = new Button();
		let dragBar = CoUI.createButton();
		dragBar.initializeWithLable(barLabel);
		dragBar.setXY(px, py - 3);
		this.m_panel.addEntity(dragBar);

		dragBar.addEventListener(CoRScene.MouseEvent.MOUSE_DOWN, this, this.progressMouseDown);
		// dragBar.addEventListener(CoRScene.MouseEvent.MOUSE_UP, this, this.progressMouseUp);

		sc.addEventListener(CoRScene.MouseEvent.MOUSE_UP, this, this.progressMouseUp);
		// this.m_dragBar = dragBar;
		return dragBar;
	}
	private progressMouseDown(evt: any): void {
		this.m_dragging = true;
		let sc = this.getScene();
		this.sendSelectionEvt("normalScaleBtnSelect", true);
		sc.addEventListener(CoRScene.MouseEvent.MOUSE_MOVE, this, this.progressMouseMove);
	}
	private progressMouseUp(evt: any): void {
		this.m_dragging = false;
		let sc = this.getScene();
		sc.removeEventListener(CoRScene.MouseEvent.MOUSE_MOVE, this, this.progressMouseMove);
	}
	private m_proBaseLen = 100;
	private progressBgMouseDown(evt: any): void {
		let px = evt.mouseX;
		let py = evt.mouseY;

		let pv = this.m_v0;
		pv.setXYZ(px, py, 0);

		// console.log("px,py: ", px,py);
		this.m_panel.globalToLocal(pv);
		// console.log("pv.x, pv.y: ", pv.x, pv.y);

		px = pv.x;
		if (px < this.m_dragMinX) {
			px = this.m_dragMinX;
		} else if (px > this.m_dragMaxX) {
			px = this.m_dragMaxX;
		}
		this.m_dragBar.setX(px);
		this.m_dragBar.update();
		this.m_proBaseLen = (px - this.m_dragMinX);

	}
	private progressMouseMove(evt: any): void {
		let px = evt.mouseX;
		let py = evt.mouseY;

		let pv = this.m_v0;
		pv.setXYZ(px, py, 0);

		// console.log("px,py: ", px,py);
		this.m_panel.globalToLocal(pv);
		// console.log("pv.x, pv.y: ", pv.x, pv.y);

		px = pv.x;
		if (px < this.m_dragMinX) {
			px = this.m_dragMinX;
		} else if (px > this.m_dragMaxX) {
			px = this.m_dragMaxX;
		}
		this.m_dragBar.setX(px);
		this.m_dragBar.update();
		// console.log("this.m_proBaseLen: ",this.m_proBaseLen, this.m_progressLen);
		// let f = (px - this.m_dragMinX) / this.m_progressLen;
		let f = (px - this.m_dragMinX) / this.m_proBaseLen;
		// console.log("f: ", f, px - this.m_dragMinX);
		// console.log("f: ",f, (0.1 + f * 2.0));
		// f = 0.1 + f * 3.0;
		this.m_normalScale = f;
		this.sendProgressEvt("normalScale", f);
	}

	private createColorBtn(pw: number, ph: number, idns: string, colors: IColor4[]): IButton {

		let colorClipLabel = CoUI.createClipColorLabel();
		colorClipLabel.initializeWithoutTex(pw, ph, 4);
		colorClipLabel.setColors(colors);
		let btn = CoUI.createButton();
		btn.uuid = idns;
		btn.initializeWithLable(colorClipLabel);

		return btn;
	}
	protected addLayoutEvt(): void {
		if (this.autoLayout) {
			let sc = this.getScene();
			if (sc != null) {
				let EB = CoRScene.EventBase;
				sc.addEventListener(EB.RESIZE, this, this.resize);
			}
		}
	}
	protected removeLayoutEvt(): void {
		if (this.autoLayout) {
			let sc = this.getScene();
			if (sc != null) {
				let EB = CoRScene.EventBase;
				sc.removeEventListener(EB.RESIZE, this, this.resize);
			}
		}
	}
	private resize(evt: any): void {
		this.layout();
	}
	protected layout(): void {
		let sc = this.getScene();
		if (sc != null) {
			let width = this.getGlobalBounds().getWidth();
			let rect = sc.getRect();
			// let bounds = this.getGlobalBounds();

			let px = rect.width - width;
			let py = rect.y + (rect.height - this.getHeight()) * 0.5;
			this.setXY(px, py);
			this.update();
		}
	}
	setZ(pz: number): void {
		this.m_panel.setZ(pz);
	}
	setXY(px: number, py: number): void {
		this.m_panel.setXY(px, py);
	}
	getGlobalBounds(): IAABB {
		return this.m_panel.getGlobalBounds();
	}
	getWidth(): number {
		return this.m_panel.getWidth();
	}
	getHeight(): number {
		return this.m_panel.getHeight();
	}
	update(): void {
		this.m_panel.update();
	}
}
export { NormalCtrlPanel };
