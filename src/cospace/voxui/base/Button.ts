import ITransformEntity from "../../../vox/entity/ITransformEntity";
import IEvtDispatcher from "../../../vox/event/IEvtDispatcher";
import ICanvasTexAtlas from "../../voxtexture/atlas/ICanvasTexAtlas";
import { IUIEntity } from "../entity/IUIEntity";
import IVector3D from "../../../vox/math/IVector3D";
import { ButtonLable } from "./ButtonLable";

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

	private m_dispatcher: IEvtDispatcher;
	private m_lable: ButtonLable = null;

	initialize(atlas: ICanvasTexAtlas, idnsList: string[]): void {

		if (this.m_lable == null && atlas != null && idnsList != null) {
			if (idnsList.length != 4) {
				throw Error("Error: idnsList.length != 4");
			}
			this.m_lable = new ButtonLable();
			this.m_lable.initialize(atlas, idnsList);
			this.initializeEvent();
		}
	}

	private initializeEvent(): void {

		if (this.m_dispatcher == null) {
			const me = CoRScene.MouseEvent;
			let dispatcher = CoRScene.createMouseEvt3DDispatcher();
			dispatcher.addEventListener(me.MOUSE_DOWN, this, this.mouseDownListener);
			dispatcher.addEventListener(me.MOUSE_UP, this, this.mouseUpListener);
			dispatcher.addEventListener(me.MOUSE_OVER, this, this.mouseOverListener);
			dispatcher.addEventListener(me.MOUSE_OUT, this, this.mouseOutListener);
			this.m_lable.getREntity().setEvtDispatcher(dispatcher);
			this.m_dispatcher = dispatcher;
		}
		this.m_lable.getREntity().mouseEnabled = true;
	}

	addEventListener(type: number, listener: any, func: (evt: any) => void, captureEnabled: boolean = true, bubbleEnabled: boolean = false): void {
		this.m_dispatcher.addEventListener(type, listener, func, captureEnabled, bubbleEnabled);
	}
	removeEventListener(type: number, listener: any, func: (evt: any) => void): void {
		this.m_dispatcher.removeEventListener(type, listener, func);
	}
	protected mouseOverListener(evt: any): void {
		console.log("Button::mouseOverListener() ...");
		this.m_lable.setPartIndex(1);
	}
	protected mouseOutListener(evt: any): void {
		console.log("Button::mouseOutListener() ...");
		this.m_lable.setPartIndex(0);
	}

	protected mouseDownListener(evt: any): void {
		console.log("Button::mouseDownListener() ...");
		this.m_lable.setPartIndex(2);
	}
	protected mouseUpListener(evt: any): void {
		console.log("Button::mouseUpListener() ...");
		this.m_lable.setPartIndex(3);
	}

	getWidth(): number {
		return this.m_lable.getWidth();
	}
	getHeight(): number {
		return this.m_lable.getHeight();
	}
	setX(x: number): void {
		this.m_lable.setX(x);
	}
	setY(y: number): void {
		this.m_lable.setY(y);
	}
	setZ(z: number): void {
		this.m_lable.setZ(z);
	}
	getX(): number {
		return this.m_lable.getX();
	}
	getY(): number {
		return this.m_lable.getY();
	}
	getZ(): number {
		return this.m_lable.getZ();
	}
	setXY(px: number, py: number): void {
		this.m_lable.setXY(px, py);
	}
	setPosition(pv: IVector3D): void {
		this.m_lable.setPosition(pv);
	}
	getPosition(pv: IVector3D): void {
		this.m_lable.getPosition(pv);
	}
	setRotation(r: number): void {
		this.m_lable.setRotation(r);
	}
	setScaleXY(sx: number, sy: number): void {
		this.m_lable.setScaleXY(sx, sy);
	}
	/**
	 * get renderable entity for renderer scene
	 * @returns ITransformEntity instance
	 */
	getREntity(): ITransformEntity {
		return this.m_lable.getREntity();
	}
	update(): void {
		this.m_lable.update();
	}
	destroy(): void {
		if (this.m_lable != null) {
			this.m_lable.destroy();
			this.m_lable = null;
		}
		if (this.m_dispatcher != null) {
			this.m_dispatcher.destroy();
			this.m_dispatcher = null;
		}
	}
}
export { Button };
