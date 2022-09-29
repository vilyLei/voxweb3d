import { IUIEntity } from "../entity/IUIEntity";
import { UIEntityContainer } from "../entity/UIEntityContainer";
import { ICoMaterial } from "../../voxmaterial/ICoMaterial";

import { ICoRScene } from "../../voxengine/ICoRScene";
import { IButton } from "../button/IButton";
import { ICoUI } from "../ICoUI";
import { ClipColorLabel } from "../entity/ClipColorLabel";
import { ColorLabel } from "../entity/ColorLabel";
import { ClipLabel } from "../entity/ClipLabel";
import { Button } from "../button/Button";

declare var CoRScene: ICoRScene;
declare var CoMaterial: ICoMaterial;
declare var CoUI: ICoUI;
class PromptPanel extends UIEntityContainer implements IUIEntity {

	private m_confirmBtn: IButton;
	private m_cancelBtn: IButton;
	private m_bgLabel: ColorLabel;
	private m_panelW: number = 17;
	private m_panelH: number = 130;
	private m_btnW: number = 90;
	private m_btnH: number = 50;
	private m_confirmationNS = "confirm";
	private m_cancelNS = "cancel";
	private m_isOpen = true;
	private m_confirmFunc: () => void = null;
	private m_cancelFunc: () => void = null;

	factor: number = 0.3;
	constructor() { super(); }

	getBGLabel(): ColorLabel {
		return this.m_bgLabel;
	}
	initialize(panelW: number, panelH: number, btnW: number, btnH: number, confirmationNS: string = "confirm", cancelNS: string = "cancel"): void {
		if (this.isIniting()) {
			this.init();

			this.m_panelW = panelW;
			this.m_panelH = panelH;

			this.m_btnW = btnW;
			this.m_btnH = btnH;

			this.m_confirmationNS = confirmationNS;
			this.m_cancelNS = cancelNS;
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
	setListener(confirmFunc: () => void, cancelFunc: () => void): void {
		this.m_confirmFunc = confirmFunc;
		this.m_cancelFunc = cancelFunc;
	}
	destroy(): void {
		super.destroy();
		this.m_confirmFunc = null;
		this.m_cancelFunc = null;
	}
	protected updateScene(): void {
		let sc = this.getScene();
		if (sc != null) {

			let pw = this.m_panelW;
			let ph = this.m_panelH;

			let btnW = this.m_btnW;
			let btnH = this.m_btnH;

			let px = 0;
			let py = (ph - btnH) * 0.5;

			let dis = btnW * 2.0;
			let gapW = pw - dis;


			px = this.factor * gapW;
			let confirmBtn = this.createBtn(this.m_confirmationNS, px, py, "confirm");
			px = pw - px - btnW;
			let cancelBtn = this.createBtn(this.m_cancelNS, px, py, "cancel");
			(cancelBtn.getREntities()[0] as any).name = "cancelBtn";
			(confirmBtn.getREntities()[0] as any).name = "confirmBtn";
			this.createBG(pw, ph);
			this.addEntity(cancelBtn);
			this.addEntity(confirmBtn);
		}
	}
	private createBG(pw: number, ph: number): void {
		let sc = this.getScene();
		let colorLabel = new ColorLabel();
		colorLabel.depthTest = true;
		colorLabel.initialize(pw, ph);
		(colorLabel.getREntities()[0] as any).name = "planeBG";
		this.m_bgLabel = colorLabel;
		this.addEntity(colorLabel);
	}
	private createBtn(ns: string, px: number, py: number, idns: string): IButton {
		let sc = this.getScene();
		let tta = sc.transparentTexAtlas;

		let pw = this.m_btnW;
		let ph = this.m_btnH;

		let fontColor = CoMaterial.createColor4().setRGB3Bytes(170, 170, 170);
		let bgColor = CoMaterial.createColor4(1, 1, 1, 0);
		let img = tta.createCharsCanvasFixSize(pw, ph, ns, 30, fontColor, bgColor);
		tta.addImageToAtlas(ns, img);

		return this.crateABtn(ns, pw, ph, px, py, idns);
	}

	private crateABtn(ns: string, pw: number, ph: number, px: number, py: number, idns: string): IButton {

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

		let btn = new Button();
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
				this.close();
				if (this.m_confirmFunc != null) {
					this.m_confirmFunc();
				}
				break;
			case "cancel":
				this.close();
				if (this.m_cancelFunc != null) {
					this.m_cancelFunc();
				}
				break;
			default:
				break;
		}
	}
}
export { PromptPanel };
