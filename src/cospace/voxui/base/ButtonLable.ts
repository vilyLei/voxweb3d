import ITransformEntity from "../../../vox/entity/ITransformEntity";
import ICanvasTexObject from "../../voxtexture/atlas/ICanvasTexObject";
import ICanvasTexAtlas from "../../voxtexture/atlas/ICanvasTexAtlas";
import { IUIEntity } from "../entity/IUIEntity";
import IVector3D from "../../../vox/math/IVector3D";
import IRawMesh from "../../../vox/mesh/IRawMesh";

import { ICoMesh } from "../../voxmesh/ICoMesh";
declare var CoMesh: ICoMesh;
import { ICoMaterial } from "../../voxmaterial/ICoMaterial";
declare var CoMaterial: ICoMaterial;
import { ICoMath } from "../../math/ICoMath";
declare var CoMath: ICoMath;
import { ICoEntity } from "../../voxentity/ICoEntity";
declare var CoEntity: ICoEntity;

class ButtonLable implements IUIEntity {
	private m_width = 0;
	private m_height = 0;
	private m_sizes: number[] = null;
	private m_index = 0;
	private m_total = 0;
	private m_step = 0;
	private m_vtCount = 0;
	private m_pos: IVector3D;
	private m_entity: ITransformEntity = null;

	private m_rotation: number = 0;
	private m_sx: number = 1;
	private m_sy: number = 1;

	private createVS(startX: number, startY: number, pwidth: number, pheight: number): number[] {
		let minX: number = startX;
		let minY: number = startY;
		let maxX: number = startX + pwidth;
		let maxY: number = startY + pheight;
		let pz: number = 0.0;
		return [minX, minY, pz, maxX, minY, pz, maxX, maxY, pz, minX, maxY, pz];
	}
	private createMesh(atlas: ICanvasTexAtlas, idnsList: string[]): IRawMesh {

		let obj = atlas.getTexObjFromAtlas(idnsList[0]);
			let partVtxTotal = 4;
			let pivs = [0, 1, 2, 0, 2, 3];

			const n = this.m_total;
			let ivs = new Uint16Array(n * 6);
			let vs = new Float32Array(n * 12);
			let uvs = new Float32Array(n * 8);
			this.m_sizes = new Array(n * 2);

			this.m_step = 6;

			let k = 0;
			for (let i = 0; i < n; ++i) {

				obj = atlas.getTexObjFromAtlas(idnsList[i]);
				ivs.set(pivs, i * pivs.length);
				vs.set(this.createVS(0, 0, obj.getWidth(), obj.getHeight()), i * 12);
				uvs.set(obj.uvs, i * 8);

				for (let j = 0; j < pivs.length; ++j) {
					pivs[j] += partVtxTotal;
				}
				this.m_sizes[k++] = obj.getWidth();
				this.m_sizes[k++] = obj.getHeight();
			}
			let mesh = CoMesh.createRawMesh();
			mesh.reset();
			mesh.setIVS(ivs);
			mesh.addFloat32Data(vs, 3);
			mesh.addFloat32Data(uvs, 2);
			mesh.initialize();
			return mesh;
	}
	initialize(atlas: ICanvasTexAtlas, idnsList: string[]): void {

		if (this.m_entity == null && atlas != null && idnsList != null && idnsList.length > 0) {

			this.m_pos = CoMath.createVec3();

			this.m_total = idnsList.length;
			let obj = atlas.getTexObjFromAtlas(idnsList[0]);
			let mesh = this.createMesh(atlas, idnsList);
			this.m_vtCount = mesh.vtCount;
			let material = CoMaterial.createDefaultMaterial();
			material.setTextureList([obj.texture]);
			let et = this.m_entity = CoEntity.createDisplayEntity();
			et.setMaterial(material);
			et.setMesh(mesh);
			et.setIvsParam(0, this.m_step);

			this.setPartIndex(0);
		}
	}

	setPartIndex(i: number): void {
		if (i >= 0 && i < this.m_total) {
			this.m_index = i;
			this.m_entity.setIvsParam(i * this.m_step, this.m_step);
			this.m_width = this.m_sizes[i << 1];
			this.m_height = this.m_sizes[(i << 1) + 1];
		}
	}
	getPartIndex(): number {
		return this.m_index;
	}
	getPartsTotal(): number {
		return this.m_total;
	}

	getWidth(): number {
		return this.m_width;
	}
	getHeight(): number {
		return this.m_height;
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
		this.m_sizes = null;
		if (this.m_entity != null) {
			this.m_entity.destroy();
			this.m_entity = null;
		}
	}
}
export { ButtonLable };
