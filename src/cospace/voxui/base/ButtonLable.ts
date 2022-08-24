import ITransformEntity from "../../../vox/entity/ITransformEntity";
import ICanvasTexObject from "../../voxtexture/atlas/ICanvasTexObject";
import ICanvasTexAtlas from "../../voxtexture/atlas/ICanvasTexAtlas";
import { IUIEntity } from "../entity/IUIEntity";
import IVector3D from "../../../vox/math/IVector3D";

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
	private m_index = 0;
	private m_total = 0;
	private m_step = 0;
	private m_vtCount = 0;
	private m_pos: IVector3D;
	private m_entity: ITransformEntity = null;

	initialize(atlas: ICanvasTexAtlas, idnsList: string[]): void {
		//flare_core_01
		if (atlas != null && idnsList != null && idnsList.length > 0) {

			this.m_pos = CoMath.createVec3();

			this.m_total = idnsList.length;
			let obj = atlas.getTexObjFromAtlas(idnsList[0]);
			// let startX = 0;
			// let minX: number = startX;
			// let minY: number = startY;
			// let maxX: number = startX + pwidth;
			// let maxY: number = startY + pheight;
			// let pz: number = 0.0;
			CoMesh.planeMeshBuilder.uvs = obj.uvs;
			this.m_width = obj.getWidth();
			this.m_height = obj.getHeight();

			let mesh = CoMesh.planeMeshBuilder.createXOY(0,0, obj.getWidth(), obj.getHeight());
			let pivs = mesh.getIVS();
			let pvs = mesh.getVS();
			let puvs = obj.uvs;

			const n = this.m_total;
			let ivs = new Uint16Array(n * pivs.length);
			let vs = new Float32Array(n * pvs.length);
			let uvs = new Float32Array(n * puvs.length);
			this.m_step = pivs.length;

			let istep = 0;
			let k = 0;
			for(let i = 0; i < n; ++i) {

				ivs.set(pivs, i * pivs.length);
				for(let j = 0; j < pivs.length; ++j) {
					ivs[k++] += istep;
				}
				istep += 4;
				vs.set(pvs, i * pvs.length);
				obj = atlas.getTexObjFromAtlas(idnsList[i]);
				uvs.set(obj.uvs, i * puvs.length);
			}
			mesh = CoMesh.createRawMesh();
			mesh.reset();
			// mesh.setIVS(pivs);
			// mesh.addFloat32Data(pvs, 3);
			// mesh.addFloat32Data(puvs, 2);
			mesh.setIVS(ivs);
			mesh.addFloat32Data(vs, 3);
			mesh.addFloat32Data(uvs, 2);
			mesh.initialize();
			console.log("ButtonLable::initialize(), mesh: ",mesh, mesh.vtCount);
			this.m_vtCount = mesh.vtCount;
			let material = CoMaterial.createDefaultMaterial();
			material.setTextureList( [obj.texture] );
			let et = this.m_entity = CoEntity.createDisplayEntity();
			et.setMaterial( material );
			et.setMesh(mesh);
			et.setIvsParam(0, this.m_step);
			this.m_index = 0;
		}
	}

	setPartIndex(i:number): void {
		if(i >= 0 && i < this.m_total) {
			this.m_index = i;
			this.m_entity.setIvsParam(i * this.m_step, this.m_step);
		}
	}
	getPartIndex(): number {
		return this.m_index;
	}
	getPartsTotal(): number {
		return this.m_total;
	}
	// toOver(): void {}
	// toOut(): void {}
	// toDown(): void {}
	// toUp(): void {}
	getWidth(): number {
		return this.m_width;
	}
	getHeight(): number {
		return this.m_height;
	}
	setX(x: number): void {
		this.m_pos.x = x;
		this.m_entity.setPosition( this.m_pos );
	}
	setY(y: number): void {
		this.m_pos.y = y;
		this.m_entity.setPosition( this.m_pos );
	}
	setZ(z: number): void {
		this.m_pos.z = z;
		this.m_entity.setPosition( this.m_pos );
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
		this.m_entity.setPosition( this.m_pos );
	}
	setPosition(pv: IVector3D): void {
		this.m_pos.copyFrom( pv );
		this.m_entity.setPosition( this.m_pos );
	}
	getPosition(pv: IVector3D): void {
		pv.copyFrom( this.m_pos );
	}
	setRotation(r: number): void {
		this.m_entity.setRotationXYZ(0.0,0.0, r);
	}
	setScaleXY(sx: number, sy: number): void {
		this.m_entity.setScaleXYZ(sx,sy,1.0);
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
		if(this.m_entity != null) {
			this.m_entity.destroy();
			this.m_entity = null;
		}
	}
}
export { ButtonLable };
