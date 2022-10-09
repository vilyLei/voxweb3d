import { IUIEntity } from "../../../voxui/entity/IUIEntity";
import { UIEntityContainer } from "../../../voxui/entity/UIEntityContainer";
import { ICoMaterial } from "../../../voxmaterial/ICoMaterial";

import { ICoRScene } from "../../../voxengine/ICoRScene";
import { IButton } from "../../../voxui/button/IButton";

import { ClipColorLabel } from "../../../voxui/entity/ClipColorLabel";
import { ColorLabel } from "../../../voxui/entity/ColorLabel";
import { ClipLabel } from "../../../voxui/entity/ClipLabel";
import { Button } from "../../../voxui/button/Button";
import IColor4 from "../../../voxui/../../vox/material/IColor4";
import ITransformEntity from "../../../../vox/entity/ITransformEntity";
import { ICoUIScene } from "../../../voxui/scene/ICoUIScene";
import { TextLabel } from "../../../voxui/entity/TextLabel";
import { UIPanel } from "../../../voxui/panel/UIPanel";

declare var CoRScene: ICoRScene;
declare var CoMaterial: ICoMaterial;
// class NormalPptPanel extends UIEntityContainer {

class NormalPptPanel extends UIPanel {

	private m_confirmBtn: IButton;
	private m_cancelBtn: IButton;
	
	private m_btnW: number = 90;
	private m_btnH: number = 50;

	constructor() { super(); }

	setBGColor(c: IColor4): this {
		this.m_bgColor.copyFrom(c);
		if (this.m_bgLabel != null) {
			this.m_bgLabel.setColor(c);
		}
		return this;
	}
	initialize(scene: ICoUIScene, rpi: number, panelW: number, panelH: number, btnH: number): void {
		if (this.isIniting()) {
			this.init();

			this.m_scene = scene;
			this.m_rpi = rpi;

			this.m_panelW = panelW;
			this.m_panelH = panelH;

			this.m_btnH = btnH;

			this.m_bgColor = CoMaterial.createColor4();
		}
	}
	// setListener(confirmFunc: () => void, cancelFunc: () => void): void {
	// 	this.m_confirmFunc = confirmFunc;
	// 	this.m_cancelFunc = cancelFunc;
	// }
	destroy(): void {
		super.destroy();

		if (this.m_confirmBtn != null) {

			this.m_confirmBtn.destroy();
			this.m_cancelBtn.destroy();
			this.m_bgLabel.destroy();

			this.m_confirmBtn = null;
			this.m_cancelBtn = null;
			this.m_bgLabel = null;
		}
	}

	protected buildPanel(pw: number, ph: number): void {
		let sc = this.getScene();
		let btnW = this.m_btnW;
		let btnH = this.m_btnH;

		let startX = 10;
		let startY = this.m_panelH - 10 - this.m_btnH;
		let disX = 5;
		let disY = 5;

		let px = startX;
		let py = (ph - btnH) * 0.5;

		let disW = btnW * 2.0;


		let disH = btnH;

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

		let textLabel = new TextLabel();
		textLabel.depthTest = true;
		textLabel.transparent = true;
		textLabel.premultiplyAlpha = true;
		textLabel.initialize("show normal line", sc);
		textLabel.setXY(startX, startY - this.m_btnH - disY - textLabel.getHeight() + 20);
		this.addEntity(textLabel);
		
		//Difference
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

		let colorClipLabel = new ClipColorLabel();
		colorClipLabel.initializeWithoutTex(pw, ph, 4);
		colorClipLabel.getColorAt(0).setRGB3Bytes(80, 80, 80);
		colorClipLabel.getColorAt(1).setRGB3Bytes(110, 110, 110);
		colorClipLabel.getColorAt(2).setRGB3Bytes(90, 90, 90);

		let tta = sc.transparentTexAtlas;
		let iconLable = new ClipLabel();
		iconLable.depthTest = true;
		iconLable.transparent = true;
		iconLable.premultiplyAlpha = true;
		iconLable.initialize(tta, [ns]);
		iconLable.setColor(CoMaterial.createColor4(0.8, 0.8, 0.8));

		let btn = new Button();
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
