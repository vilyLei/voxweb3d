import ITransformEntity from "../../../vox/entity/ITransformEntity";
import IDefault3DMaterial from "../../../vox/material/mcase/IDefault3DMaterial";
import ICanvasTexObject from "../../voxtexture/atlas/ICanvasTexObject";
import ICanvasTexAtlas from "../../voxtexture/atlas/ICanvasTexAtlas";
import { IClipColorLabel } from "./IClipColorLabel";
import IVector3D from "../../../vox/math/IVector3D";
import IRawMesh from "../../../vox/mesh/IRawMesh";
import IColor4 from "../../../vox/material/IColor4";

import { ICoMesh } from "../../voxmesh/ICoMesh";
declare var CoMesh: ICoMesh;
import { ICoMaterial } from "../../voxmaterial/ICoMaterial";
declare var CoMaterial: ICoMaterial;
import { ICoMath } from "../../math/ICoMath";
declare var CoMath: ICoMath;
import { ICoEntity } from "../../voxentity/ICoEntity";
declare var CoEntity: ICoEntity;

class ClipColorLabel implements IClipColorLabel {
	private m_width = 0;
	private m_height = 0;
	private m_fixSize: boolean = true;
	private m_colors: IColor4[] = null;
	private m_index = 0;
	private m_total = 0;
	private m_pos: IVector3D;
	private m_entity: ITransformEntity = null;
	private m_material: IDefault3DMaterial = null;
	private m_rotation: number = 0;
	private m_sx: number = 1;
	private m_sy: number = 1;
	private m_hasTex: boolean = false;

	private createVS(startX: number, startY: number, pwidth: number, pheight: number): number[] {
		let minX: number = startX;
		let minY: number = startY;
		let maxX: number = startX + pwidth;
		let maxY: number = startY + pheight;
		let pz: number = 0.0;
		return [minX, minY, pz, maxX, minY, pz, maxX, maxY, pz, minX, maxY, pz];
	}
	private createMesh(atlas: ICanvasTexAtlas, idns: string): IRawMesh {

		let ivs = new Uint16Array([0, 1, 2, 0, 2, 3]);
		let vs = new Float32Array(this.createVS(0, 0, this.m_width, this.m_height));

		let mesh = CoMesh.createRawMesh();
		mesh.reset();
		mesh.setIVS(ivs);
		mesh.addFloat32Data(vs, 3);

		if(idns != "" && atlas != null) {
			let obj = atlas.getTexObjFromAtlas(idns);
			let uvs = new Float32Array(obj.uvs);
			mesh.addFloat32Data(uvs, 2);
		}
		mesh.initialize();
		return mesh;
	}
	hasTexture(): boolean {
		return this.m_hasTex;
	}
	initialize(atlas: ICanvasTexAtlas, idns: string, colorsTotal: number): void {

		if (this.m_entity == null && colorsTotal > 0) {
			this.m_hasTex = false;
			let material = CoMaterial.createDefaultMaterial();
			if(idns != "" && atlas != null) {
				let obj = atlas.getTexObjFromAtlas(idns);
				if(this.m_fixSize) {
					this.m_width = obj.getWidth();
					this.m_height = obj.getHeight();
				}
				this.m_hasTex = true;
				material.setTextureList([obj.texture]);
			}
			let mesh = this.createMesh(atlas, idns);
			let et = (this.m_entity = CoEntity.createDisplayEntity());
			et.setMaterial(material);
			et.setMesh(mesh);
			this.m_material = material;
			this.m_pos = CoMath.createVec3();
			let colors = new Array(colorsTotal);
			for (let i = 0; i < colorsTotal; ++i) {
				colors[i] = CoMaterial.createColor4();
			}
			this.m_colors = colors;
			this.m_total = colorsTotal;
			this.setClipIndex(0);
		}
	}
	initializeWithoutTex(width: number, height: number, colorsTotal: number): void {
		this.m_width = width;
		this.m_height = height;
		this.m_fixSize = false;
		this.initialize(null, "", colorsTotal);
	}
	initializeWithSize(width: number, height: number, atlas: ICanvasTexAtlas, idns: string, colorsTotal: number): void {
		if(width > 0 && height > 0) {
			this.m_width = width;
			this.m_height = height;
			this.m_fixSize = false;
			this.initialize(atlas, idns, colorsTotal);
		}
	}
	initializeWithLable(srcLable: IClipColorLabel): void {
		if (this.m_entity == null && srcLable != null && srcLable != this) {
			if (srcLable.getClipsTotal() < 1) {
				throw Error("Error: srcLable.getClipsTotal() < 1");
			}
			let entity = srcLable.getREntity();
			let mesh = entity.getMesh();

			this.m_pos = CoMath.createVec3();

			let tex = entity.getMaterial().getTextureAt(0);
			let n = (this.m_total = srcLable.getClipsTotal());
			let src = srcLable.getColors();

			let colors: IColor4[] = new Array(n);
			for (let i = 0; i < n; ++i) {
				colors[i] = CoMaterial.createColor4();
				colors[i].copyFrom(src[i]);
			}
			this.m_colors = colors;
			this.m_width = srcLable.getWidth();
			this.m_height = srcLable.getHeight();
			let material = CoMaterial.createDefaultMaterial();
			material.setTextureList([tex]);
			let et = (this.m_entity = CoEntity.createDisplayEntity());
			et.setMaterial(material);
			et.setMesh(mesh);
			this.m_material = material;
			this.setClipIndex(0);
		}
	}
	displaceFromLable(srcLable: IClipColorLabel): void {
		if (srcLable != null && srcLable != this) {
			if (srcLable.getClipsTotal() < 1) {
				throw Error("Error: srcLable.getClipsTotal() < 1");
			}
			if (this.m_entity == null) {
				this.initializeWithLable(srcLable);
			} else if (this.m_entity.isRFree()) {
			}
		}
	}

	getColorAt(i: number): IColor4 {
		if (i >= 0 && i < this.m_total) {
			return this.m_colors[i];
		}
	}
	setClipIndex(i: number): void {
		if (i >= 0 && i < this.m_total) {
			this.m_index = i;
			this.m_material.setColor(this.m_colors[i]);
		}
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

	getColors(): IColor4[] {
		return this.m_colors;
	}

	getClipWidth(): number {
		return this.m_width;
	}
	getClipHeight(): number {
		return this.m_height;
	}
	getWidth(): number {
		return this.m_width * this.m_sx;
	}
	getHeight(): number {
		return this.m_height * this.m_sy;
	}
	setX(x: number): void {
		this.m_pos.x = x;
		this.m_entity.setPosition(this.m_pos);
	}
	setY(y: number): void {
		this.m_pos.y = y;
		this.m_entity.setPosition(this.m_pos);
	}
	setZ(z: number): void {
		this.m_pos.z = z;
		this.m_entity.setPosition(this.m_pos);
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
		this.m_entity.setPosition(this.m_pos);
	}
	setPosition(pv: IVector3D): void {
		this.m_pos.copyFrom(pv);
		this.m_entity.setPosition(this.m_pos);
	}
	getPosition(pv: IVector3D): void {
		pv.copyFrom(this.m_pos);
	}
	setRotation(r: number): void {
		this.m_rotation = r;
		this.m_entity.setRotationXYZ(0, 0, r);
	}
	getRotation(): number {
		return this.m_rotation;
	}
	setScaleXY(sx: number, sy: number): void {
		this.m_sx = sx;
		this.m_sy = sy;
		this.m_entity.setScaleXYZ(sx, sy, 1.0);
	}
	setScaleX(sx: number): void {
		this.m_sx = sx;
		this.m_entity.setScaleXYZ(this.m_sx, this.m_sy, 1.0);
	}
	setScaleY(sy: number): void {
		this.m_sy = sy;
		this.m_entity.setScaleXYZ(this.m_sx, this.m_sy, 1.0);
	}
	getScaleX(): number {
		return this.m_sx;
	}
	getScaleY(): number {
		return this.m_sy;
	}
	/**
	 * get renderable entity for renderer scene
	 * @returns ITransformEntity instance
	 */
	getREntity(): ITransformEntity {
		return this.m_entity;
	}
	update(): void {
		this.m_entity.update();
	}
	destroy(): void {
		this.m_colors = null;
		this.m_total = 0;
		if (this.m_entity != null) {
			this.m_entity.destroy();
			this.m_entity = null;
		}
	}
}
export { ClipColorLabel };
