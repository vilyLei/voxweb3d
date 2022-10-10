import ITransformEntity from "../../../vox/entity/ITransformEntity";
import IDisplayEntityContainer from "../../../vox/entity/IDisplayEntityContainer";
import IEvtDispatcher from "../../../vox/event/IEvtDispatcher";
import ICanvasTexAtlas from "../../voxtexture/atlas/ICanvasTexAtlas";
import { IButton } from "./IButton";
import { Button } from "./Button";
import IVector3D from "../../../vox/math/IVector3D";
import { ClipLabel } from "../entity/ClipLabel";
import { IClipEntity } from "../entity/IClipEntity";
import { IUIEntity } from "../entity/IUIEntity";
import { UIEntityBase } from "../entity/UIEntityBase";
import { ColorClipLabel } from "../entity/ColorClipLabel";

import { ICoRScene } from "../../voxengine/ICoRScene";
declare var CoRScene: ICoRScene;
import { ICoMath } from "../../math/ICoMath";
declare var CoMath: ICoMath;
import { ICoMaterial } from "../../voxmaterial/ICoMaterial";
import IColor4 from "../../../vox/material/IColor4";
import ISelectionEvent from "../../../vox/event/ISelectionEvent";
declare var CoMaterial: ICoMaterial;

class FlagButton extends Button implements IButton {

	
    private m_selectDispatcher: IEvtDispatcher;
    private m_currEvent: ISelectionEvent;

	private m_flagLb: ClipLabel = null;
	private m_pw: number = 32;
	private m_ph: number = 32;
	private m_borderWidth: number = 4;
	private m_dis: number = 4;
	constructor() { super(); this.uuid = "flagBtn"; }


	initializeWithSize(atlas: ICanvasTexAtlas, pw: number = 32, ph: number = 32, borderWidth: number = 4, dis: number = 4): IButton {

		if (this.isIniting() && atlas != null) {
			this.m_pw = pw;
			this.m_ph = ph;
			this.m_borderWidth = borderWidth;
			this.m_dis = dis;

			this.m_selectDispatcher = CoRScene.createEventBaseDispatcher();
    		this.m_currEvent = CoRScene.createSelectionEvent();

			this.createFlagBtn(atlas);
		}
		return this;
	}

	addEventListener(type: number, listener: any, func: (evt: any) => void, captureEnabled: boolean = true, bubbleEnabled: boolean = false): IButton {
		if(type == CoRScene.SelectionEvent.SELECT) {
			this.m_selectDispatcher.addEventListener(type, listener, func, captureEnabled, bubbleEnabled);
		}else {
			super.addEventListener(type, listener, func, captureEnabled, bubbleEnabled);
		}
		return this;
	}
	removeEventListener(type: number, listener: any, func: (evt: any) => void): IButton {
		if(type == CoRScene.SelectionEvent.SELECT) {
			this.m_selectDispatcher.removeEventListener(type, listener, func);
		}else {
			super.removeEventListener(type, listener, func);
		}
		return this;
	}
	private createFlagBtn(atlas: ICanvasTexAtlas): void {

		let texAtlas = atlas;
		let borderColor = CoMaterial.createColor4(0.7, 0.7, 0.7);
		let bgColor = CoMaterial.createColor4(0.3, 0.3, 0.3);
		let canvas = this.createFlagImg(texAtlas, borderColor, bgColor);
		texAtlas.addImageToAtlas("flagBtn_01", canvas);

		borderColor = CoMaterial.createColor4(0.7, 0.7, 0.7);
		bgColor = CoMaterial.createColor4(0.3, 0.3, 0.3);
		let flagColor = CoMaterial.createColor4(1.0, 1.0, 1.0);
		canvas = this.createFlagImg(texAtlas, borderColor, bgColor, flagColor, this.m_dis);
		texAtlas.addImageToAtlas("flagBtn_02", canvas);

		let urls = ["flagBtn_01", "flagBtn_02"];
		let csLable = new ClipLabel();
		csLable.initialize(texAtlas, urls);
		let clb = new ColorClipLabel();
		clb.initialize(csLable, 4);
		clb.getColorAt(0).setRGB3f(0.0, 0.8, 0.8);
		clb.getColorAt(1).setRGB3f(0.2, 1.0, 0.2);
		clb.getColorAt(2).setRGB3f(1.0, 0.2, 1.0);
		clb.setLabelClipIndex(0);
		this.m_flagLb = csLable;
		this.initializeWithLable(clb);
	}
	
    private sendSelectionEvt(): void {

        this.m_selectDispatcher.uuid = this.uuid;
        this.m_currEvent.target = this;
        this.m_currEvent.type = CoRScene.SelectionEvent.SELECT;
        this.m_currEvent.flag = this.m_flagLb.getClipIndex() == 1;
        this.m_currEvent.phase = 1;
        this.m_selectDispatcher.dispatchEvt(this.m_currEvent);
		this.m_currEvent.target = null;
    }
	protected mouseUpListener(evt: any): void {
		if (this.isEnabled()) {
			super.mouseUpListener(evt);
			this.selectListener();
		}
	}
	private selectListener(): void {
		if(this.m_flagLb.getClipIndex() == 1) {
			this.m_flagLb.setClipIndex(0);
		}else {
			this.m_flagLb.setClipIndex(1);
		}
		console.log("cccccccc selectListener ccccccc, this.m_flagLb.getClipIndex(): ", this.m_flagLb.getClipIndex());
		this.sendSelectionEvt()
	}
	private createFlagImg(texAtlas: ICanvasTexAtlas, borderColor: IColor4, bgColor: IColor4, flagColor: IColor4 = null, dis: number = 2): HTMLCanvasElement | HTMLImageElement {

		let pw = this.m_pw;
		let ph = this.m_ph;
		let borderWidth = this.m_borderWidth;
		let canvas = texAtlas.createCanvas(pw, ph, borderColor, false);
		let ctx2D = canvas.getContext("2d");
		ctx2D.fillStyle = bgColor.getCSSDecRGBAColor();
		ctx2D.fillRect(borderWidth, borderWidth, pw - 2 * borderWidth, ph - 2 * borderWidth - 1);
		if (flagColor != null) {
			ctx2D.fillStyle = flagColor.getCSSDecRGBAColor();
			ctx2D.fillRect(borderWidth + dis, borderWidth + dis, pw - 2 * (borderWidth + dis), ph - 2 * (borderWidth + dis) - 1);
		}

		return canvas;
	}
	destroy(): void {
		this.m_flagLb = null;
		super.destroy();
	}
}
export { FlagButton };
