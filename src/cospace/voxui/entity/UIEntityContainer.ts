import ITransformEntity from "../../../vox/entity/ITransformEntity";
import IDisplayEntityContainer from "../../../vox/entity/IDisplayEntityContainer";
import ICanvasTexObject from "../../voxtexture/atlas/ICanvasTexObject";
import ICanvasTexAtlas from "../../voxtexture/atlas/ICanvasTexAtlas";
import { IClipLabel } from "./IClipLabel";
import IVector3D from "../../../vox/math/IVector3D";
import IRawMesh from "../../../vox/mesh/IRawMesh";
import { ClipLabelBase } from "./ClipLabelBase";
import { IUIEntity } from "./IUIEntity";

import { ICoRScene } from "../../voxengine/ICoRScene";
declare var CoRScene: ICoRScene;
import { ICoMesh } from "../../voxmesh/ICoMesh";
declare var CoMesh: ICoMesh;
import { ICoMaterial } from "../../voxmaterial/ICoMaterial";
declare var CoMaterial: ICoMaterial;
import { ICoMath } from "../../math/ICoMath";
declare var CoMath: ICoMath;
import { ICoEntity } from "../../voxentity/ICoEntity";
import IDefault3DMaterial from "../../../vox/material/mcase/IDefault3DMaterial";
import IColor4 from "../../../vox/material/IColor4";
declare var CoEntity: ICoEntity;

class UIEntityContainer implements IUIEntity {

	private m_width = 0;
	private m_height = 0;
	private m_sx = 1.0;
	private m_sy = 1.0;
	private m_rotation = 0.0;

	private m_pos: IVector3D;

	private m_entities: IUIEntity[] = [];
	private m_container: IDisplayEntityContainer = null;

	premultiplyAlpha: boolean = false;
	transparent: boolean = false;
	info: string = "container";

	constructor() { }

	initialize(): void {
		if (this.m_container == null) {
			this.m_container = CoRScene.createDisplayEntityContainer();
		}
	}
	addUIEntity(entity: IUIEntity): void {
		if (entity != null) {
			let i = 0;
			for (; i < this.m_entities.length; ++i) {
				if (this.m_entities[i] == entity) break;
			}
			if (i >= this.m_entities.length) {
				this.m_entities.push(entity);
				entity.update();
				let container = entity.getRContainer();
				if (container != null) {
					this.m_container.addChild(container);
				}
				let ls = entity.getREntities();
				for (let k = 0; k < ls.length; ++k) {
					this.m_container.addEntity(ls[k]);
				}
			}
		}
	}
	removeUIEntity(entity: IUIEntity): void {
		if (entity != null) {
			let i = 0;
			for (; i < this.m_entities.length; ++i) {
				if (this.m_entities[i] == entity) {
					this.m_entities.splice(i, 1);
					let container = entity.getRContainer();
					if (container != null) {
						this.m_container.removeChild(container);
					}
					let ls = entity.getREntities();
					for (let k = 0; k < ls.length; ++k) {
						this.m_container.removeEntity(ls[k]);
					}
					break;
				}
			}
		}
	}
	getWidth(): number {
		let bounds = this.m_container.getGlobalBounds();
		return bounds.getWidth();
	}
	getHeight(): number {
		let bounds = this.m_container.getGlobalBounds();
		return bounds.getHeight();
	}
	setPosition(pv: IVector3D): void {

		let ls = this.m_entities;
		for (let i = 0; i < ls.length; ++i) {
			ls[i].setPosition(this.m_pos);
		}
	}
	setX(x: number): void {
		this.m_pos.x = x;
		this.setPosition(this.m_pos);
	}
	setY(y: number): void {
		this.m_pos.y = y;
		this.setPosition(this.m_pos);
	}
	setZ(z: number): void {
		this.m_pos.z = z;
		this.setPosition(this.m_pos);
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
		this.setPosition(this.m_pos);
	}
	getPosition(pv: IVector3D): void {
		pv.copyFrom(this.m_pos);
	}
	setRotation(r: number): void {
		this.m_rotation = r;
		let ls = this.m_entities;
		for (let i = 0; i < ls.length; ++i) {
			ls[i].setRotation(r);
		}
	}
	getRotation(): number {
		return this.m_rotation;
	}
	setScaleXYZ(sx: number, sy: number, sz: number): void {
		let ls = this.m_entities;
		for (let i = 0; i < ls.length; ++i) {
			ls[i].setScaleXY(sx, sy);
		}
	}
	setScaleXY(sx: number, sy: number): void {
		this.m_sx = sx;
		this.m_sy = sy;
		this.setScaleXYZ(sx, sy, 1.0);
	}
	setScaleX(sx: number): void {
		this.m_sx = sx;
		this.setScaleXYZ(this.m_sx, this.m_sy, 1.0);
	}
	setScaleY(sy: number): void {
		this.m_sy = sy;
		this.setScaleXYZ(this.m_sx, this.m_sy, 1.0);
	}
	getScaleX(): number {
		return this.m_sx;
	}
	getScaleY(): number {
		return this.m_sy;
	}
	getREntities(): ITransformEntity[] {
		return null;
	}
	getRContainer(): IDisplayEntityContainer {
		return this.m_container;
	}

	copyTransformFrom(src: IUIEntity): void {

	}
	update(): void {
		let ls = this.m_entities;
		for (let i = 0; i < ls.length; ++i) {
			ls[i].update();
		}
	}
	destroy(): void {

		let ls = this.m_entities;
		if (ls != null) {
			for (let i = 0; i < ls.length; ++i) {
				ls[i].update();
			}
		}
	}
	//*/
}
export { UIEntityContainer };
