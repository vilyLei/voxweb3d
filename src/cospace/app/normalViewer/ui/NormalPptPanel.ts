import { ICoMaterial } from "../../../voxmaterial/ICoMaterial";

import { ICoRScene } from "../../../voxengine/ICoRScene";
import { IButton } from "../../../voxui/button/IButton";

// import { ClipColorLabel } from "../../../voxui/entity/ClipColorLabel";
// import { ColorLabel } from "../../../voxui/entity/ColorLabel";
// import { ClipLabel } from "../../../voxui/entity/ClipLabel";
// import { Button } from "../../../voxui/button/Button";
import IColor4 from "../../../voxui/../../vox/material/IColor4";

import { ICoUIScene } from "../../../voxui/scene/ICoUIScene";
import { ITextLabel } from "../../../voxui/entity/ITextLabel";
import { UIPanel } from "../../../voxui/panel/UIPanel";
import { IFlagButton } from "../../../voxui/button/IFlagButton";

import { ICoUI } from "../../../voxui/ICoUI";

declare var CoUI: ICoUI;

declare var CoRScene: ICoRScene;
declare var CoMaterial: ICoMaterial;
class NormalPptPanel extends UIPanel {

	private m_normalVisiBtn: IFlagButton;
	private m_modelVisiBtn: IFlagButton;

	private m_btnW: number = 90;
	private m_btnH: number = 50;

	constructor() { super(); }

	initialize(scene: ICoUIScene, rpi: number, panelW: number, panelH: number, btnH: number): void {

		if (this.isIniting()) {
			this.init();

			this.m_scene = scene;
			this.m_rpi = rpi;

			this.m_panelW = panelW;
			this.m_panelH = panelH;

			this.m_btnH = btnH;
		}
	}
	destroy(): void {
		super.destroy();

		if (this.m_bgLabel != null) {

			this.m_bgLabel.destroy();
			this.m_bgLabel = null;

			this.m_normalVisiBtn = null;
			this.m_modelVisiBtn = null;
		}
	}

	protected buildPanel(pw: number, ph: number): void {

		let sc = this.getScene();

		let startX = 10;
		let startY = this.m_panelH - 10 - this.m_btnH;
		let disX = 5;
		let disY = 5;

		let px = startX;
		let py = 0;

		this.m_btnW = 90;
		let localBtn = this.createBtn("Local", startX, startY, "local");
		px = px + this.m_btnW + disX;
		this.m_btnW = 90;
		let globalBtn = this.createBtn("Global", px, startY, "global");
		px = px + this.m_btnW + disX;
		this.m_btnW = 150;
		let differenceBtn = this.createBtn("Difference", px, startY, "difference");

		this.addEntity(localBtn);
		this.addEntity(globalBtn);
		this.addEntity(differenceBtn);

		let btnSize = 28;

		py = startY - this.m_btnH - disY + 20;
		let textLabel = this.createText("normal line visible", startX + btnSize + disX, py);

		px = startX;
		py = textLabel.getY();
		this.m_normalVisiBtn = this.createFlagBtn(btnSize, px, py, "normal");

		textLabel = this.createText("model visible", startX + btnSize + disX, py - 10);
		py = textLabel.getY();
		this.m_normalVisiBtn = this.createFlagBtn(btnSize, px, py, "model");

		textLabel = this.createText("normal line length:", startX, py - 15);
		px = startX;
		py = textLabel.getY();
		this.createProgressBtn(px + 5, py - 25, 200);

		// Difference
	}

	private selectVisibleFunc(evt: any): void {
		switch (evt.uuid) {
			case "normal":
				break;
			case "model":
				break;
			default:
				break;
		}
		console.log("selectVisibleFunc, evt.flag: ", evt.flag, ", evt.uuid: ", evt.uuid);
	}
	private createFlagBtn(size: number, px: number, py: number, uuid: string = "model"): IFlagButton {

		let sc = this.getScene();
		// let flagBtn = new FlagButton();
		let flagBtn = CoUI.createFlagButton();
		flagBtn.uuid = uuid;
		flagBtn.initializeWithSize(sc.texAtlas, size, size);
		flagBtn.setXY(px, py);
		flagBtn.addEventListener(CoRScene.SelectionEvent.SELECT, this, this.selectVisibleFunc);
		this.addEntity(flagBtn);
		return flagBtn;
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
		this.addEntity(textLabel);
		return textLabel;
	}
	private m_dragBar: IButton;
	private m_dragging: boolean = false;
	private m_dragMinX = 0;
	private m_dragMaxX = 0;
	private m_progressLen = 0;

	private createProgressBtn(px: number, py: number, length: number): void {
		
		let sc = this.getScene();
		let color = CoMaterial.createColor4(0.1, 0.1, 0.1);
		// let bgBar = new ColorLabel();
		let bgBar = CoUI.createColorLabel();
		bgBar.depthTest = true;
		bgBar.initialize(length, 10);
		bgBar.setZ(-0.05);
		bgBar.setColor(color);
		bgBar.setXY(px, py);
		this.addEntity(bgBar);

		this.m_progressLen = length - 16;
		this.m_dragMinX = px;
		this.m_dragMaxX = px + this.m_progressLen;

		// let barLabel = new ClipColorLabel();
		let barLabel = CoUI.createClipColorLabel();
		barLabel.initializeWithoutTex(16, 16, 4);
		barLabel.getColorAt(0).setRGB3Bytes(130, 130, 130);
		barLabel.getColorAt(1).setRGB3f(0.2, 1.0, 0.2);
		barLabel.getColorAt(2).setRGB3f(1.0, 0.2, 1.0);

		// let dragBar = new Button();
		let dragBar = CoUI.createButton();
		dragBar.initializeWithLable(barLabel);
		dragBar.setXY(px, py - 3);
		this.addEntity(dragBar);

		dragBar.addEventListener(CoRScene.MouseEvent.MOUSE_DOWN, this, this.progressMouseDown);
		// dragBar.addEventListener(CoRScene.MouseEvent.MOUSE_UP, this, this.progressMouseUp);
		
		sc.addEventListener(CoRScene.MouseEvent.MOUSE_UP, this, this.progressMouseUp);
		this.m_dragBar = dragBar;
	}
	private progressMouseDown(evt: any): void {
		this.m_dragging = true;
		let sc = this.getScene();
		sc.addEventListener(CoRScene.MouseEvent.MOUSE_MOVE, this, this.progressMouseMove);
	}
	private progressMouseUp(evt: any): void {
		this.m_dragging = false;
		let sc = this.getScene();
		sc.removeEventListener(CoRScene.MouseEvent.MOUSE_MOVE, this, this.progressMouseMove);
	}
	private progressMouseMove(evt: any): void {
		let px = evt.mouseX;
		let py = evt.mouseY;

		let pv = this.m_v0;
		pv.setXYZ(px,py, 0);

		let container = this.m_rcontainer;
		// console.log("px,py: ", px,py);
		container.globalToLocal(pv);
		// console.log("pv.x, pv.y: ", pv.x, pv.y);
		
		px = pv.x;
		if(px < this.m_dragMinX) {
			px = this.m_dragMinX;
		}else if(px > this.m_dragMaxX) {
			px = this.m_dragMaxX;
		}
		this.m_dragBar.setX( px );
		this.m_dragBar.update();
		let f = (px - this.m_dragMinX) / this.m_progressLen;
		// console.log("f: ",f, (0.1 + f * 2.0));
		f = 0.1 + f * 3.0;
	}
	private createBtn(ns: string, px: number, py: number, idns: string): IButton {

		let sc = this.getScene();
		let tta = sc.transparentTexAtlas;

		let pw = this.m_btnW;
		let ph = this.m_btnH;

		let fontColor = CoMaterial.createColor4();
		let bgColor = CoMaterial.createColor4(1, 1, 1, 0);
		let img = tta.createCharsCanvasFixSize(pw, ph, ns, 30, fontColor, bgColor);
		tta.addImageToAtlas(ns, img);

		return this.crateCurrBtn(ns, pw, ph, px, py, idns);
	}

	private crateCurrBtn(ns: string, pw: number, ph: number, px: number, py: number, idns: string): IButton {

		let sc = this.getScene();

		// let colorClipLabel = new ClipColorLabel();
		let colorClipLabel = CoUI.createClipColorLabel();
		colorClipLabel.initializeWithoutTex(pw, ph, 4);
		colorClipLabel.getColorAt(0).setRGB3Bytes(80, 80, 80);
		colorClipLabel.getColorAt(1).setRGB3Bytes(110, 110, 110);
		colorClipLabel.getColorAt(2).setRGB3Bytes(90, 90, 90);

		let tta = sc.transparentTexAtlas;
		// let iconLable = new ClipLabel();
		let iconLable = CoUI.createClipLabel();
		iconLable.depthTest = true;
		iconLable.transparent = true;
		iconLable.premultiplyAlpha = true;
		iconLable.initialize(tta, [ns]);
		iconLable.setColor(CoMaterial.createColor4(0.8, 0.8, 0.8));

		// let btn = new Button();
		let btn = CoUI.createButton();
		btn.uuid = idns;
		// btn.info = CoUI.createTipInfo().alignBottom().setContent(info);
		btn.addLabel(iconLable);
		btn.initializeWithLable(colorClipLabel);
		btn.setXY(px, py);
		btn.addEventListener(CoRScene.MouseEvent.MOUSE_UP, this, this.btnMouseUpListener);

		return btn;
	}
	private btnMouseUpListener(evt: any): void {

		console.log("NormalPptPanel::btnMouseUpListener(), evt.currentTarget: ", evt.currentTarget);
		let uuid = evt.uuid;
		switch (uuid) {

			case "local":
				// this.close();

				break;
			case "global":
				// this.close();

				break;
			case "difference":
				// this.close();

				break;
			default:
				break;
		}
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
}
export { NormalPptPanel };
