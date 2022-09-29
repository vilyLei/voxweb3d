import ITransformEntity from "../../../vox/entity/ITransformEntity";
import IDisplayEntityContainer from "../../../vox/entity/IDisplayEntityContainer";
import IVector3D from "../../../vox/math/IVector3D";
import { IUIEntity } from "./IUIEntity";
import { UIEntityBase } from "./UIEntityBase";

import { ICoRScene } from "../../voxengine/ICoRScene";
declare var CoRScene: ICoRScene;
import { ICoMath } from "../../math/ICoMath";
declare var CoMath: ICoMath;

class ClipLabelBase extends UIEntityBase {

	protected m_index = 0;
	protected m_total = 0;
	protected m_step = 6;
	protected m_vtCount = 0;
	protected m_sizes: number[] = null;

	uuid = "label";

	constructor() { super(); }
	protected createVS(startX: number, startY: number, pwidth: number, pheight: number): number[] {
		let minX = startX;
		let minY = startY;
		let maxX = startX + pwidth;
		let maxY = startY + pheight;
		let pz = 0.0;
		return [minX, minY, pz, maxX, minY, pz, maxX, maxY, pz, minX, maxY, pz];
	}

	setClipIndex(i: number): void {
	}
	setCircleClipIndex(i: number): void {
		i %= this.m_total;
		i += this.m_total;
		i %= this.m_total;
		this.setClipIndex(i);
	}
	getClipIndex(): number {
		return this.m_index;
	}
	getClipsTotal(): number {
		return this.m_total;
	}

	getClipWidthAt(i: number): number {
		if (this.m_sizes != null) {
			if (i >= 0 && i < this.m_total) {
				i = i << 1;
				return this.m_sizes[i];
			}
		} else {
			return this.m_width;
		}
	}
	getClipHeightAt(i: number): number {
		if (this.m_sizes != null) {
			if (i >= 0 && i < this.m_total) {
				i = i << 1;
				return this.m_sizes[i + 1];
			}
		} else {
			return this.m_height;
		}
	}

	getClipWidth(): number {
		return this.m_width;
	}
	getClipHeight(): number {
		return this.m_height;
	}
	/*
	getWidth(): number {
		return this.m_width * this.m_sx;
	}
	getHeight(): number {
		return this.m_height * this.m_sy;
	}

	setPosition(pv: IVector3D): void {
		this.m_pos.copyFrom(pv);
		let ls = this.m_entities;
		for (let i = 0; i < ls.length; ++i) {
			ls[i].setPosition(pv);
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
			ls[i].setRotationXYZ(0, 0, r);
		}
	}
	getRotation(): number {
		return this.m_rotation;
	}
	setScaleXYZ(sx: number, sy: number, sz: number): void {
		let ls = this.m_entities;
		for (let i = 0; i < ls.length; ++i) {
			ls[i].setScaleXYZ(sx, sy, sz);
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
	
	copyTransformFrom(src: IUIEntity): void {
		if(src != null) {
			if(this.m_v0 == null) {	
				this.m_v0 = CoMath.createVec3();
			}
			let sx = src.getScaleX();
			let sy = src.getScaleY();
			let r = src.getRotation();
			this.setScaleXY(sx, sy);
			this.setRotation(r);			
			src.getPosition( this.m_v0 );
			this.setPosition( this.m_v0 );
		}
	}
	// /**
	//  * get renderable entities for renderer scene
	//  * @returns ITransformEntity instance list
	//  */
	// getREntities(): ITransformEntity[] {
	// 	return this.m_entities.slice(0);
	// }

	// getRContainer(): IDisplayEntityContainer {
	// 	return null;
	// }
	// update(): void {
	// 	let ls = this.m_entities;
	// 	for (let i = 0; i < ls.length; ++i) {
	// 		ls[i].update();
	// 	}
	// }
	// destroy(): void {
	// 	this.m_sizes = null;
	// 	this.m_total = 0;
	// 	let ls = this.m_entities;
	// 	if (ls != null) {
	// 		for (let i = 0; i < ls.length; ++i) {
	// 			ls[i].update();
	// 		}
	// 	}
	// }
	destroy(): void {
		this.m_sizes = null;
		this.m_total = 0;
		super.destroy();
	}
}
export { ClipLabelBase };
