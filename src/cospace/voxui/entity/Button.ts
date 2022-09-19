import ITransformEntity from "../../../vox/entity/ITransformEntity";
import IEvtDispatcher from "../../../vox/event/IEvtDispatcher";
import ICanvasTexAtlas from "../../voxtexture/atlas/ICanvasTexAtlas";
import { IButton } from "./IButton";
import IVector3D from "../../../vox/math/IVector3D";
import { ClipLabel } from "./ClipLabel";
import { IClipEntity } from "./IClipEntity";

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

class Button implements IButton {
	private m_dp: IEvtDispatcher;
	private m_lb: IClipEntity = null;
	private m_entity: ITransformEntity = null;
	uuid = "btn";
	
	enable(): void {
		if(this.m_entity != null) {
			this.m_entity.mouseEnabled = true;
		}
	}
	disable(): void {

		if(this.m_entity != null) {
			this.m_entity.mouseEnabled = false;
		}
	}
	isEnable(): boolean {
		return this.m_entity != null && this.m_entity.mouseEnabled;
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
			dpc.uuid = this.uuid;
			dpc.addEventListener(me.MOUSE_DOWN, this, this.mouseDownListener);
			dpc.addEventListener(me.MOUSE_UP, this, this.mouseUpListener);
			dpc.addEventListener(me.MOUSE_OVER, this, this.mouseOverListener);
			dpc.addEventListener(me.MOUSE_OUT, this, this.mouseOutListener);
			this.m_lb.getREntity().setEvtDispatcher(dpc);
			this.m_dp = dpc;
		}
		this.m_entity = this.m_lb.getREntity();
		this.m_entity.mouseEnabled = true;
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
		this.m_entity = null;
	}
}
export { Button };
