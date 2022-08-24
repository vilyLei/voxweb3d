import ITransformEntity from "../../../vox/entity/ITransformEntity";
import IEvtDispatcher from "../../../vox/event/IEvtDispatcher";
import ICanvasTexAtlas from "../../voxtexture/atlas/ICanvasTexAtlas";
import { IUIEntity } from "./IUIEntity";
import IVector3D from "../../../vox/math/IVector3D";
import { ClipLable } from "./ClipLable";
import { IClipLable } from "./IClipLable";

import { ICoRScene } from "../../voxengine/ICoRScene";
declare var CoRScene: ICoRScene;
import { ICoMesh } from "../../voxmesh/ICoMesh";
declare var CoMesh: ICoMesh;
import { ICoMaterial } from "../../voxmaterial/ICoMaterial";
declare var CoMaterial: ICoMaterial;
import { ICoMath } from "../../math/ICoMath";
declare var CoMath: ICoMath;
import { ICoEntity } from "../../voxentity/ICoEntity";
declare var CoEntity: ICoEntity;

class Button implements IUIEntity {

	private m_dp: IEvtDispatcher;
	private m_lb: IClipLable = null;

	initialize(atlas: ICanvasTexAtlas, idnsList: string[]): void {

		if (this.m_lb == null && atlas != null && idnsList != null) {
			if (idnsList.length != 4) {
				throw Error("Error: idnsList.length != 4");
			}
			let lb = new ClipLable();
			lb.initialize(atlas, idnsList);
			this.m_lb = lb;
			this.initializeEvent();
		}
	}

	private initializeEvent(): void {

		if (this.m_dp == null) {
			const me = CoRScene.MouseEvent;
			let dpc = CoRScene.createMouseEvt3DDispatcher();
			dpc.addEventListener(me.MOUSE_DOWN, this, this.mouseDownListener);
			dpc.addEventListener(me.MOUSE_UP, this, this.mouseUpListener);
			dpc.addEventListener(me.MOUSE_OVER, this, this.mouseOverListener);
			dpc.addEventListener(me.MOUSE_OUT, this, this.mouseOutListener);
			this.m_lb.getREntity().setEvtDispatcher(dpc);
			this.m_dp = dpc;
		}
		this.m_lb.getREntity().mouseEnabled = true;
	}

	addEventListener(type: number, listener: any, func: (evt: any) => void, captureEnabled: boolean = true, bubbleEnabled: boolean = false): void {
		this.m_dp.addEventListener(type, listener, func, captureEnabled, bubbleEnabled);
	}
	removeEventListener(type: number, listener: any, func: (evt: any) => void): void {
		this.m_dp.removeEventListener(type, listener, func);
	}
	protected mouseOverListener(evt: any): void {
		console.log("Button::mouseOverListener() ...");
		this.m_lb.setClipIndex(1);
	}
	protected mouseOutListener(evt: any): void {
		console.log("Button::mouseOutListener() ...");
		this.m_lb.setClipIndex(0);
	}

	protected mouseDownListener(evt: any): void {
		console.log("Button::mouseDownListener() ...");
		this.m_lb.setClipIndex(2);
	}
	protected mouseUpListener(evt: any): void {
		console.log("Button::mouseUpListener() ...");
		this.m_lb.setClipIndex(3);
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
	/**
	 * get renderable entity for renderer scene
	 * @returns ITransformEntity instance
	 */
	getREntity(): ITransformEntity {
		return this.m_lb.getREntity();
	}
	update(): void {
		this.m_lb.update();
	}
	destroy(): void {
		if (this.m_lb != null) {
			this.m_lb.destroy();
			this.m_lb = null;
		}
		if (this.m_dp != null) {
			this.m_dp.destroy();
			this.m_dp = null;
		}
	}
}
export { Button };
