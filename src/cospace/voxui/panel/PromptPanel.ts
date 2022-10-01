import { IUIEntity } from "../entity/IUIEntity";
import { UIEntityContainer } from "../entity/UIEntityContainer";
import { ICoMaterial } from "../../voxmaterial/ICoMaterial";

import { ICoRScene } from "../../voxengine/ICoRScene";
import { IButton } from "../button/IButton";

import { ClipColorLabel } from "../entity/ClipColorLabel";
import { ColorLabel } from "../entity/ColorLabel";
import { ClipLabel } from "../entity/ClipLabel";
import { Button } from "../button/Button";
import { IPromptPanel } from "./IPromptPanel";
import IColor4 from "../../../vox/material/IColor4";
import ITransformEntity from "../../../vox/entity/ITransformEntity";
import { ICoUIScene } from "../scene/ICoUIScene";
import { TextLabel } from "../entity/TextLabel";

declare var CoRScene: ICoRScene;
declare var CoMaterial: ICoMaterial;
class PromptPanel extends UIEntityContainer implements IPromptPanel {

	private m_scene: ICoUIScene;
	private m_rpi: number;
	private m_bgColor: IColor4;
	private m_confirmBtn: IButton;
	private m_cancelBtn: IButton;
	private m_bgLabel: ColorLabel;
	private m_textLabel: TextLabel;
	private m_panelW: number = 17;
	private m_panelH: number = 130;
	private m_btnW: number = 90;
	private m_btnH: number = 50;
	private m_confirmNS: string;
	private m_cancelNS: string;
	private m_isOpen = false;
	private m_confirmFunc: () => void = null;
	private m_cancelFunc: () => void = null;

	layoutXFactor: number = 0.7;
	layoutYFactor: number = 0.9;

	constructor() { super(); }

	setBGColor(c: IColor4): this {
		this.m_bgColor.copyFrom(c);
		if (this.m_bgLabel != null) {
			this.m_bgLabel.setColor(c);
		}
		return this;
	}
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
	open(): void {
		if (!this.m_isOpen) {

			this.m_scene.addEntity( this, this.m_rpi );
			this.addEvt();
			this.layout();

			this.m_isOpen = true;
			this.setVisible(true);
		}
	}
	isOpen(): boolean {
		return this.m_isOpen;
	}
	close(): void {

		if (this.m_isOpen) {

			this.m_scene.removeEntity( this );

			this.m_isOpen = false;
			this.setVisible(false);
			this.removeEvt();
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
	private m_building = true;
	protected updateScene(): void {
		let sc = this.getScene();
		if (sc != null && this.m_building) {
			
			this.m_building = false;

			let pw = this.m_panelW;
			let ph = this.m_panelH;

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
			textLabel.initialize("Hi, ...", sc);
			this.m_textLabel = textLabel;
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
			this.createBG(pw, ph);


			px = (pw - textLabel.getWidth()) * 0.5;
			py = ph - py - textLabel.getHeight();
			textLabel.setXY(px,py);
			this.addEntity(textLabel);

			this.setVisible(this.m_isOpen);
			if (this.m_isOpen) {
				this.addEvt();
				this.layout();
			}
		}
	}
	private addEvt(): void {
		let sc = this.getScene();
		if (sc != null) {
			let st = sc.getStage();
			let EB = CoRScene.EventBase;
			st.addEventListener(EB.RESIZE, this, this.resize);
		}
	}
	private removeEvt(): void {
		let sc = this.getScene();
		if (sc != null) {
			let st = sc.getStage();
			let EB = CoRScene.EventBase;
			st.removeEventListener(EB.RESIZE, this, this.resize);
		}
	}
	private createBG(pw: number, ph: number): void {
		let sc = this.getScene();
		let bgLabel = new ColorLabel();
		bgLabel.depthTest = true;
		bgLabel.initialize(pw, ph);
		bgLabel.setZ(-0.1);
		bgLabel.setColor( this.m_bgColor );
		this.m_bgLabel = bgLabel;
		// colorLabel.getREntities()[0].mouseEnabled = true;
		this.initializeEvent(bgLabel.getREntities()[0]);
		this.addEntity(bgLabel);
	}

	private initializeEvent(entity: ITransformEntity): void {

		const me = CoRScene.MouseEvent;
		let dpc = CoRScene.createMouseEvt3DDispatcher();
		dpc.currentTarget = this;
		dpc.uuid = "prompt plane";
		dpc.addEventListener(me.MOUSE_OVER, this, this.mouseOverListener);
		dpc.addEventListener(me.MOUSE_OUT, this, this.mouseOutListener);
		entity.setEvtDispatcher(dpc);
		entity.mouseEnabled = true;
	}
	private mouseOverListener(evt: any): void {
		// console.log("mouseOverListener() ...");
	}
	private mouseOutListener(evt: any): void {
		// console.log("mouseOutListener() ...");
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
	private resize(evt: any): void {
		this.layout();
	}
	private layout(): void {
		let sc = this.getScene();
		if (sc != null) {
			let st = sc.getStage();
			let rect = sc.getRect();
			// let bounds = this.getGlobalBounds();

			let px = rect.x + (rect.width - this.getWidth()) * 0.5;
			let py = rect.y + (rect.height - this.getHeight()) * 0.5;
			this.setXY(px, py);
			this.update();
		}
	}
}
export { PromptPanel };
