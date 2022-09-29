import { IUIEntity } from "../entity/IUIEntity";
import { UIEntityContainer } from "../entity/UIEntityContainer";
import { ICoMaterial } from "../../voxmaterial/ICoMaterial";

import { ICoRScene } from "../../voxengine/ICoRScene";
import { IButton } from "../entity/IButton";
import { ICoUI } from "../ICoUI";

declare var CoRScene: ICoRScene;
declare var CoMaterial: ICoMaterial;
declare var CoUI: ICoUI;
class PromptPanel extends UIEntityContainer implements IUIEntity {

	// private m_confirmBtn: IButton;
	// private m_cancelBtn: IButton;
	private m_confirmationNS = "confirm";
	private m_cancelNS = "cancel";
	private m_isOpen = true;
	constructor() { super(); }

	initialize(panelW: number, panelH: number, btnW: number, btnH: number, confirmationNS: string = "confirm", cancelNS: string = "cancel"): void {
		if (this.isIniting()) {
			this.init();

		}
	}
	open(): void {
		this.m_isOpen = true;
		this.setVisible(true);
	}
	isOpen(): boolean {
		return this.m_isOpen;
	}
	close(): void {
		this.m_isOpen = false;
		this.setVisible(false);
	}

	protected updateScene(): void {
		let sc = this.getScene();
		if (sc != null) {

			let confirmBtn = this.createBtn(this.m_confirmationNS, 10, 10, "confirm");
			let cancelBtn = this.createBtn(this.m_cancelNS, 100, 10, "cancel");

			this.addUIEntity(cancelBtn);
			this.addUIEntity(confirmBtn);
		}
	}
	private createBG(pw: number, ph: number): void {

	}
	private createBtn(ns: string, px: number, py: number, idns: string): IButton {
		let sc = this.getScene();
		let tta = sc.transparentTexAtlas;

		let pw = 90;
		let ph = 40;

		let fontColor = CoMaterial.createColor4().setRGB3Bytes(170, 170, 170);
		let bgColor = CoMaterial.createColor4(1, 1, 1, 0);
		let img = tta.createCharsCanvasFixSize(pw, ph, ns, 30, fontColor, bgColor);
		tta.addImageToAtlas(ns, img);

		return this.crateABtn(ns, pw, ph, px, py, idns);
	}

	private crateABtn(ns: string, pw: number, ph: number, px: number, py: number, idns: string): IButton {

		let sc = this.getScene();

		let colorClipLabel = CoUI.createClipColorLabel();
		colorClipLabel.initializeWithoutTex(pw, ph, 4);
		colorClipLabel.getColorAt(0).setRGB3Bytes(40, 40, 40);
		colorClipLabel.getColorAt(1).setRGB3Bytes(50, 50, 50);
		colorClipLabel.getColorAt(2).setRGB3Bytes(40, 40, 60);

		let tta = sc.transparentTexAtlas;
		let iconLable = CoUI.createClipLabel();
		iconLable.transparent = true;
		iconLable.premultiplyAlpha = true;
		iconLable.initialize(tta, [ns]);

		let btn = CoUI.createButton();
		btn.uuid = idns;
		// btn.info = CoUI.createTipInfo().alignBottom().setContent(info);
		btn.addLabel(iconLable);
		btn.initializeWithLable(colorClipLabel);
		btn.setXY(px, py);
		btn.addEventListener(CoRScene.MouseEvent.MOUSE_UP, this, this.btnMouseUpListener);

		return btn;
	} private btnMouseUpListener(evt: any): void {

		console.log("PromptPanel::btnMouseUpListener(), evt.currentTarget: ", evt.currentTarget);
		let uuid = evt.uuid;
		switch (uuid) {

			case "confirm":

				break;
			case "cancel":

				break;
			default:
				break;
		}
	}
}
export { PromptPanel };
