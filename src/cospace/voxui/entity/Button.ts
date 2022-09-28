import ITransformEntity from "../../../vox/entity/ITransformEntity";
import IDisplayEntityContainer from "../../../vox/entity/IDisplayEntityContainer";
import IEvtDispatcher from "../../../vox/event/IEvtDispatcher";
import ICanvasTexAtlas from "../../voxtexture/atlas/ICanvasTexAtlas";
import { IButton } from "./IButton";
import IVector3D from "../../../vox/math/IVector3D";
import { ClipLabel } from "./ClipLabel";
import { IClipEntity } from "./IClipEntity";
import { IUIEntity } from "./IUIEntity";

import { ICoRScene } from "../../voxengine/ICoRScene";
declare var CoRScene: ICoRScene;
import { ICoMath } from "../../math/ICoMath";
declare var CoMath: ICoMath;

class Button implements IButton {

	private m_enabled = true;
	private m_dp: IEvtDispatcher;
	private m_lb: IClipEntity = null;
	private m_lbs: IClipEntity[] = [];
	private m_entities: ITransformEntity[] = null;
	protected m_v0: IVector3D = null;

	premultiplyAlpha = false;
	transparent = false;
	uuid = "btn";
	info = "button";
	
	constructor() { }
	addLabel(label: IClipEntity): void {
		this.m_lbs.push(label);
	}
	enable(): IButton {

		if (this.m_dp != null) {
			this.m_dp.enabled = true;
		}
		this.m_enabled = true;
		return this;
	}
	disable(): IButton {

		if (this.m_dp != null) {
			this.m_dp.enabled = false;
		}
		this.m_enabled = false;
		return this;
	}
	isEnabled(): boolean {
		return this.m_enabled;
	}

	setMouseEnabled(enabled: boolean): void {
		if (this.m_entities != null) {
			this.m_entities[0].mouseEnabled = enabled;
		}
	}
	isMouseEnabled(): boolean {
		return this.m_entities != null && this.m_entities[0].mouseEnabled;
	}

	initialize(atlas: ICanvasTexAtlas, idnsList: string[]): IButton {

		if (this.m_lb == null && atlas != null && idnsList != null) {
			if (idnsList.length != 4) {
				throw Error("Error: idnsList.length != 4");
			}
			let lb = new ClipLabel();
			lb.initialize(atlas, idnsList);
			this.m_lb = lb;
			this.initializeEvent();
			this.m_lb.setClipIndex(0);
		}
		return this;
	}

	initializeWithLable(lable: IClipEntity): IButton {

		if (this.m_lb == null) {
			if (lable.getClipsTotal() < 1) {
				throw Error("Error: lable.getClipsTotal() < 1");
			}
			this.m_lb = lable;
			this.initializeEvent();
			this.m_lb.setClipIndex(0);
		}
		return this;
	}
	getLable(): IClipEntity {
		return this.m_lb;
	}
	private initializeEvent(): void {

		if (this.m_dp == null) {
			const me = CoRScene.MouseEvent;
			let dpc = CoRScene.createMouseEvt3DDispatcher();
			dpc.currentTarget = this;
			dpc.uuid = this.uuid;
			dpc.enabled = this.m_enabled;
			dpc.addEventListener(me.MOUSE_DOWN, this, this.mouseDownListener);
			dpc.addEventListener(me.MOUSE_UP, this, this.mouseUpListener);
			dpc.addEventListener(me.MOUSE_OVER, this, this.mouseOverListener);
			dpc.addEventListener(me.MOUSE_OUT, this, this.mouseOutListener);
			this.m_lb.getREntities()[0].setEvtDispatcher(dpc);
			this.m_dp = dpc;
		}
		this.m_entities = this.m_lb.getREntities().slice(0);
		this.m_entities[0].mouseEnabled = true;
	}

	addEventListener(type: number, listener: any, func: (evt: any) => void, captureEnabled: boolean = true, bubbleEnabled: boolean = false): IButton {

		this.m_dp.addEventListener(type, listener, func, captureEnabled, bubbleEnabled);
		return this;
	}
	removeEventListener(type: number, listener: any, func: (evt: any) => void): IButton {

		this.m_dp.removeEventListener(type, listener, func);
		return this;
	}
	protected mouseOverListener(evt: any): void {
		// console.log("Button::mouseOverListener() ...");
		if (this.m_enabled) {
			this.m_lb.setClipIndex(1);
			let ls = this.m_lbs;
			if (ls.length > 0) {
				for (let i = 0; i < ls.length; ++i) {
					ls[i].setClipIndex(1);
				}
			}
		}
	}
	protected mouseOutListener(evt: any): void {
		// console.log("Button::mouseOutListener() ...");
		if (this.m_enabled) {
			this.m_lb.setClipIndex(0);
			let ls = this.m_lbs;
			if (ls.length > 0) {
				for (let i = 0; i < ls.length; ++i) {
					ls[i].setClipIndex(0);
				}
			}
		}
	}

	protected mouseDownListener(evt: any): void {
		// console.log("Button::mouseDownListener() ...");
		if (this.m_enabled) {
			this.m_lb.setClipIndex(2);
			let ls = this.m_lbs;
			if (ls.length > 0) {
				for (let i = 0; i < ls.length; ++i) {
					ls[i].setClipIndex(2);
				}
			}
		}
	}
	protected mouseUpListener(evt: any): void {
		// console.log("Button::mouseUpListener() ...");
		if (this.m_enabled) {
			this.m_lb.setClipIndex(3);
			let ls = this.m_lbs;
			if (ls.length > 0) {
				for (let i = 0; i < ls.length; ++i) {
					ls[i].setClipIndex(3);
				}
			}
		}
	}
	setClipIndex(i: number): void {
		this.m_lb.setClipIndex(i);
	}
	getWidth(): number {
		return this.m_lb.getWidth();
	}
	getHeight(): number {
		return this.m_lb.getHeight();
	}
	setX(x: number): void {
		this.m_lb.setX(x);
	}
	setY(y: number): void {
		this.m_lb.setY(y);
	}
	setZ(z: number): void {
		this.m_lb.setZ(z);
	}
	getX(): number {
		return this.m_lb.getX();
	}
	getY(): number {
		return this.m_lb.getY();
	}
	getZ(): number {
		return this.m_lb.getZ();
	}
	setXY(px: number, py: number): void {
		this.m_lb.setXY(px, py);
	}
	setPosition(pv: IVector3D): void {
		this.m_lb.setPosition(pv);
	}
	getPosition(pv: IVector3D): void {
		this.m_lb.getPosition(pv);
	}
	setRotation(r: number): void {
		this.m_lb.setRotation(r);
	}
	getRotation(): number {
		return this.m_lb.getRotation();
	}
	setScaleXY(sx: number, sy: number): void {
		this.m_lb.setScaleXY(sx, sy);
	}
	setScaleX(sx: number): void {
		this.m_lb.setScaleX(sx);
	}
	setScaleY(sy: number): void {
		this.m_lb.setScaleX(sy);
	}
	getScaleX(): number {
		return this.m_lb.getScaleX();
	}
	getScaleY(): number {
		return this.m_lb.getScaleY();
	}

	copyTransformFrom(src: IUIEntity): void {
		if (src != null) {
			if (this.m_v0 == null) {
				this.m_v0 = CoMath.createVec3();
			}
			let sx = src.getScaleX();
			let sy = src.getScaleY();
			let r = src.getRotation();
			this.setScaleXY(sx, sy);
			this.setRotation(r);
			src.getPosition(this.m_v0);
			this.setPosition(this.m_v0);
		}
	}
	/**
	 * get renderable entity for renderer scene
	 * @returns ITransformEntity instance
	 */
	getREntities(): ITransformEntity[] {
		let es = this.m_lb.getREntities();
		let ls = this.m_lbs;
		if (ls.length > 0) {
			for (let i = 0; i < ls.length; ++i) {
				es = es.concat(ls[i].getREntities());
			}
			return es;
		}
		return es;
	}
	getRContainer(): IDisplayEntityContainer {
		return null;
	}
	update(): void {
		this.m_lb.update();
		let ls = this.m_lbs;
		if (ls.length > 0) {
			for (let i = 0; i < ls.length; ++i) {
				ls[i].copyTransformFrom(this.m_lb);
				ls[i].update();
			}
		}
	}
	destroy(): void {

		let b = this.m_lb;
		if (b != null) {
			b.destroy();
			b = null;
		}
		let ls = this.m_lbs;
		if (ls.length > 0) {
			for (let i = 0; i < ls.length; ++i) {
				ls[i].destroy();
			}
			this.m_lbs = [];
		}
		if (this.m_dp != null) {
			this.m_dp.destroy();
			this.m_dp = null;
		}
		this.m_entities = null;
	}
}
export { Button };
