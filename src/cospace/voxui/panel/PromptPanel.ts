import { ICoMaterial } from "../../voxmaterial/ICoMaterial";

import { ICoRScene } from "../../voxengine/ICoRScene";
import { IButton } from "../button/IButton";

import { ClipColorLabel } from "../entity/ClipColorLabel";
import { ClipLabel } from "../entity/ClipLabel";
import { Button } from "../button/Button";
import { IPromptPanel } from "./IPromptPanel";
import { ICoUIScene } from "../scene/ICoUIScene";
import { TextLabel } from "../entity/TextLabel";
import { UIPanel } from "./UIPanel";

declare var CoRScene: ICoRScene;
declare var CoMaterial: ICoMaterial;
class PromptPanel extends UIPanel implements IPromptPanel {

	private m_confirmBtn: IButton;
	private m_cancelBtn: IButton;
	private m_promptLabel: TextLabel = null;
	private m_prompt: string = "Hi,Prompt Panel.";
	private m_btnW: number = 90;
	private m_btnH: number = 50;
	private m_confirmNS: string;
	private m_cancelNS: string;
	private m_confirmFunc: () => void = null;
	private m_cancelFunc: () => void = null;

	layoutXFactor: number = 0.7;
	layoutYFactor: number = 0.9;

	constructor() { super(); }

	initialize(scene: ICoUIScene, rpi: number, panelW: number, panelH: number, btnW: number, btnH: number, confirmNS: string = "Confirm", cancelNS: string = "Cancel"): void {
		if (this.isIniting()) {
			this.init();

			this.m_scene = scene;
			this.m_rpi = rpi;

			this.m_panelW = panelW;
			this.m_panelH = panelH;

			this.m_btnW = btnW;
			this.m_btnH = btnH;

			this.m_confirmNS = confirmNS;
			this.m_cancelNS = cancelNS;

			this.m_bgColor = CoMaterial.createColor4();
		}
	}
	setPrompt(text: string): void {
		this.m_prompt = text;
		if (this.m_promptLabel != null) {
			this.m_promptLabel.setText(text);
			let px = (this.m_panelW - this.m_promptLabel.getWidth()) * 0.5;
			this.m_promptLabel.setX(px);
			this.m_promptLabel.update();
		}
	}
	setListener(confirmFunc: () => void, cancelFunc: () => void): void {
		this.m_confirmFunc = confirmFunc;
		this.m_cancelFunc = cancelFunc;
	}
	destroy(): void {
		super.destroy();

		this.m_confirmFunc = null;
		this.m_cancelFunc = null;

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

		let px = 0;
		let py = (ph - btnH) * 0.5;

		let disW = btnW * 2.0;
		let gapW = (pw - disW) * 0.5;


		let textLabel = new TextLabel();
		textLabel.depthTest = true;
		textLabel.transparent = true;
		textLabel.premultiplyAlpha = true;
		textLabel.initialize(this.m_prompt, sc);
		this.m_promptLabel = textLabel;
		let disH = btnH + textLabel.getHeight();
		let gapH = (ph - disH) * 0.5;

		console.log("textLabel.getHeight(): ", textLabel.getHeight());

		px = this.layoutXFactor * gapW;
		py = this.layoutYFactor * gapH;
		let confirmBtn = this.createBtn(this.m_confirmNS, px, py, "confirm");
		px = pw - px - btnW;
		let cancelBtn = this.createBtn(this.m_cancelNS, px, py, "cancel");


		this.addEntity(cancelBtn);
		this.addEntity(confirmBtn);

		px = (pw - textLabel.getWidth()) * 0.5;
		py = ph - py - textLabel.getHeight();
		textLabel.setXY(px, py);
		this.addEntity(textLabel);
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
		btn.addLabel(iconLable);
		btn.initializeWithLable(colorClipLabel);
		btn.setXY(px, py);
		btn.addEventListener(CoRScene.MouseEvent.MOUSE_UP, this, this.btnMouseUpListener);

		return btn;
	}
	private btnMouseUpListener(evt: any): void {

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
