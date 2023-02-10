import ITransformEntity from "../../../vox/entity/ITransformEntity";
import IDisplayEntityContainer from "../../../vox/entity/IDisplayEntityContainer";
import IVector3D from "../../../vox/math/IVector3D";
import { IUIEntity } from "./IUIEntity";
import IAABB from "../../../vox/geom/IAABB";
import { ITipInfo } from "../base/ITipInfo";
import IDefault3DMaterial from "../../../vox/material/mcase/IDefault3DMaterial";
import IRenderTexture from "../../../vox/render/texture/IRenderTexture";

import { ICoRScene } from "../../voxengine/ICoRScene";
declare var CoRScene: ICoRScene;
import { ICoMath } from "../../math/ICoMath";
declare var CoMath: ICoMath;
import { ICoMaterial } from "../../voxmaterial/ICoMaterial";
import { ICoUIScene } from "../scene/ICoUIScene";
declare var CoMaterial: ICoMaterial;

class UIEntityBase {

	private m_sc: ICoUIScene = null;
	private m_parent: IUIEntity = null;

	protected m_rotation = 0;
	protected m_visible = true;
	protected m_entities: ITransformEntity[] = [];
	protected m_width = 0;
	protected m_height = 0;
	protected m_pos: IVector3D;
	protected m_scaleV: IVector3D;
	protected m_v0: IVector3D = null;
	protected m_bounds: IAABB = null;
	protected m_rcontainer: IDisplayEntityContainer = null;

	premultiplyAlpha: boolean = false;
	transparent: boolean = false;
	info: ITipInfo = null;

	depthTest: boolean = false;
	constructor() { }

	protected init(): void {
		if (this.isIniting()) {
			this.m_pos = CoMath.createVec3();
			this.m_scaleV = CoMath.createVec3(1.0, 1.0, 1.0);
			this.m_v0 = CoMath.createVec3();
			this.m_bounds = CoMath.createAABB();
		}
	}
	isIniting(): boolean {
		return this.m_bounds == null;
	}
	protected createMaterial(tex: IRenderTexture = null): IDefault3DMaterial {
		let material = CoMaterial.createDefaultMaterial();
		material.premultiplyAlpha = this.premultiplyAlpha;
		if (tex != null) {
			material.setTextureList([tex]);
		}
		material.initializeByCodeBuf(tex != null);
		return material;
	}
	protected applyRST(entity: ITransformEntity): void {
		const RST = CoRScene.RendererState;
		if (this.transparent) {
			if (this.premultiplyAlpha) {
				// entity.setRenderState(RST.BACK_ALPHA_ADD_BLENDSORT_STATE);
				entity.setRenderState(RST.BACK_ALPHA_ADD_ALWAYS_STATE);
			} else {
				if(this.depthTest) {
					entity.setRenderState(RST.BACK_TRANSPARENT_STATE);
				}else {
					entity.setRenderState(RST.BACK_TRANSPARENT_ALWAYS_STATE);
				}
			}
		} else {
			if(this.depthTest) {
				entity.setRenderState(RST.NORMAL_STATE);
			}else {
				entity.setRenderState(RST.BACK_NORMAL_ALWAYS_STATE);
			}
		}
	}
	protected createVS(startX: number, startY: number, pwidth: number, pheight: number): number[] {

		let minX = startX;
		let minY = startY;
		let maxX = startX + pwidth;
		let maxY = startY + pheight;
		let pz = 0.0;
		return [minX, minY, pz, maxX, minY, pz, maxX, maxY, pz, minX, maxY, pz];
	}
	protected updateScene(): void {

	}
	protected updateParent(): void {

	}
	__$setScene(sc: ICoUIScene): void {
		if(this.m_sc != sc) {
			this.m_sc = sc;
			this.updateScene();
		}
	}
	getScene(): ICoUIScene {
		return this.m_sc;
	}
	
	setParent(parent: IUIEntity): IUIEntity {
		if(parent != this) {
			this.m_parent = parent;
			this.updateParent();
		}
		return this;
	}
	getParent(): IUIEntity {
		return this.m_parent;
	}
	getGlobalBounds(): IAABB {
		return this.m_bounds;
	}
	setVisible(v: boolean): void {

		this.m_visible = v;
		let ls = this.m_entities;
		for (let i = 0; i < ls.length; ++i) {
			ls[i].setVisible(v);
		}
		if (this.m_rcontainer != null) {
			this.m_rcontainer.setVisible(v);
		}
	}
	isVisible(): boolean {
		return this.m_visible;
	}
	getWidth(): number {
		return this.m_bounds.getWidth();
	}
	getHeight(): number {
		return this.m_bounds.getHeight();
	}

	setPosition(pv: IVector3D): void {
		this.m_pos.copyFrom(pv);
	}
	setX(x: number): void {
		this.m_pos.x = x;
	}
	setY(y: number): void {
		this.m_pos.y = y;
	}
	setZ(z: number): void {
		this.m_pos.z = z;
	}
	getX(): number {
		return this.m_pos.x;
	}
	getY(): number {
		return this.m_pos.y;
	}
	getZ(): number {
		return this.m_pos.z;
	}
	setXY(px: number, py: number): void {
		this.m_pos.x = px;
		this.m_pos.y = py;
	}
	getPosition(pv: IVector3D): IVector3D {
		pv.copyFrom(this.m_pos);
		return pv;
	}
	setRotation(r: number): void {
		this.m_rotation = r;
	}
	getRotation(): number {
		return this.m_rotation;
	}
	protected setScaleXYZ(sx: number, sy: number, sz: number): void {
		this.m_scaleV.setXYZ(sx, sy, sz);
	}
	setScaleXY(sx: number, sy: number): void {
		this.setScaleXYZ(sx, sy, 1.0);
	}
	setScaleX(sx: number): void {
		this.m_scaleV.x = sx;
	}
	setScaleY(sy: number): void {
		this.m_scaleV.y = sy;
	}
	getScaleX(): number {
		return this.m_scaleV.x;
	}
	getScaleY(): number {
		return this.m_scaleV.y;
	}

	copyTransformFrom(src: IUIEntity): void {
		if (src != null) {

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
	 * get renderable entities for renderer scene
	 * @returns ITransformEntity instance list
	 */
	getREntities(): ITransformEntity[] {
		return this.m_entities.slice(0);
	}

	getRContainer(): IDisplayEntityContainer {
		return this.m_rcontainer;
	}
	private updateEntity(e: ITransformEntity | IDisplayEntityContainer): void {

		// console.log("XXXXX UIEntiyBase::this.m_pos: ", this.m_pos, e);

		e.setPosition(this.m_pos);
		e.setScale3(this.m_scaleV);
		e.setRotationXYZ(0.0, 0.0, this.m_rotation);
		e.update();
		this.m_bounds.union(e.getGlobalBounds());
	}
	update(): void {

		let ls = this.m_entities;
		let bs = this.m_bounds;
		this.m_bounds.reset();
		for (let i = 0; i < ls.length; ++i) {
			// let e = ls[i];
			// e.setPosition(this.m_pos);
			// e.setScale3(this.m_scaleV);
			// e.setRotationXYZ(0.0, 0.0, this.m_rotation);
			// e.update();
			// bs.union(e.getGlobalBounds());
			this.updateEntity(ls[i]);
		}
		if(this.m_rcontainer != null) {
			this.updateEntity(this.m_rcontainer);
		}
		bs.updateFast();
	}
	destroy(): void {
		let sc = this.m_sc;
		if(sc != null) {
			sc.removeEntity(this);
		}
		this.m_rcontainer = null;
		this.m_sc = null;
		this.m_parent = null;
		this.m_bounds = null;
		let ls = this.m_entities;
		for (let i = 0; i < ls.length; ++i) {
			ls[i].destroy();
		}
		ls = [];
	}
}
export { UIEntityBase };
