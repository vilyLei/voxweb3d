import { ICoMaterial } from "../../voxmaterial/ICoMaterial";

import { ICoRScene } from "../../voxengine/ICoRScene";
import { IButton } from "../button/IButton";
import { IPromptPanel } from "./IPromptPanel";
import { ICoUIScene } from "../scene/ICoUIScene";
import { TextLabel } from "../entity/TextLabel";
import { UIPanel } from "./UIPanel";
import { ButtonBuilder, ITextParam } from "../button/ButtonBuilder";
import IColor4 from "../../../vox/material/IColor4";

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
		let tta = sc.transparentTexAtlas;

		px = this.layoutXFactor * gapW;
		py = this.layoutYFactor * gapH;

		let ME = CoRScene.MouseEvent;
		let textParam: ITextParam = {
			text: this.m_confirmNS,
			textColor: CoMaterial.createColor4(),
			fontSize: 30,
			font: ""
		};
		
		let colors: IColor4[] = [
			CoMaterial.createColor4().setRGB3Bytes(80, 80, 80),
			CoMaterial.createColor4().setRGB3Bytes(110, 110, 110),
			CoMaterial.createColor4().setRGB3Bytes(90, 90, 90)
		];
		// let confirmBtn = this.createBtn(this.m_confirmNS, px, py, "confirm");
		let builder = ButtonBuilder;
		let confirmBtn = builder.createTextButton(
			this.m_btnW,
			this.m_btnH,
			"confirm",
			tta,
			textParam,colors
			);
		confirmBtn.setXY(px, py);
		confirmBtn.addEventListener(ME.MOUSE_UP, this, this.btnMouseUpListener);

		px = pw - px - btnW;
		textParam.text = this.m_cancelNS;
		let cancelBtn = builder.createTextButton(
			this.m_btnW,
			this.m_btnH,
			"cancel",
			tta,
			textParam,colors
			);
		cancelBtn.setXY(px, py);
		cancelBtn.addEventListener(ME.MOUSE_UP, this, this.btnMouseUpListener);
		// let cancelBtn = this.createBtn(this.m_cancelNS, px, py, "cancel");

		this.addEntity(cancelBtn);
		this.addEntity(confirmBtn);

		px = (pw - textLabel.getWidth()) * 0.5;
		py = ph - py - textLabel.getHeight();
		textLabel.setXY(px, py);
		this.addEntity(textLabel);
		sc.addEventListener(ME.MOUSE_DOWN, this, this.stMouseDownListener);
	}
	private stMouseDownListener(evt: any): void {
		console.log("stMouseDownListener...");

		let px = evt.mouseX;
		let py = evt.mouseY;
		let pv = this.m_v0;
		pv.setXYZ(px, py, 0);
		this.globalToLocal(pv);
		if(pv.x < 0 || pv.x > this.m_panelW || pv.y < 0 || pv.y > this.m_panelH) {
			this.close();
		}
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
