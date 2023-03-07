import ITransformEntity from "../../../vox/entity/ITransformEntity";
import ICanvasTexObject from "../../voxtexture/atlas/ICanvasTexObject";
import ICanvasTexAtlas from "../../voxtexture/atlas/ICanvasTexAtlas";
import { IClipLabel } from "./IClipLabel";
import IVector3D from "../../../vox/math/IVector3D";
import IRawMesh from "../../../vox/mesh/IRawMesh";
import { ClipLabelBase } from "./ClipLabelBase";
import IDefault3DMaterial from "../../../vox/material/mcase/IDefault3DMaterial";

import { ICoRScene } from "../../voxengine/ICoRScene";
declare var CoRScene: ICoRScene;
import { ICoMesh } from "../../voxmesh/ICoMesh";
declare var CoMesh: ICoMesh;
import { ICoMaterial } from "../../voxmaterial/ICoMaterial";
declare var CoMaterial: ICoMaterial;
import { ICoMath } from "../../math/ICoMath";
declare var CoMath: ICoMath;
import { ICoEntity } from "../../voxentity/ICoEntity";
import IColor4 from "../../../vox/material/IColor4";
declare var CoEntity: ICoEntity;

class ClipLabel extends ClipLabelBase implements IClipLabel {

	private m_material: IDefault3DMaterial = null;

	constructor(){super();}

	private createMesh(atlas: ICanvasTexAtlas, idnsList: string[]): IRawMesh {

		let partVtxTotal = 4;
		let pivs = [0, 1, 2, 0, 2, 3];

		const n = this.m_total;
		let ivs = new Uint16Array(n * 6);
		let vs = new Float32Array(n * 12);
		let uvs = new Float32Array(n * 8);
		this.m_sizes = new Array(n * 2);

		let k = 0;
		for (let i = 0; i < n; ++i) {

			const obj = atlas.getTexObjFromAtlas(idnsList[i]);
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
	hasTexture(): boolean {
		return true;
	}
	initialize(atlas: ICanvasTexAtlas, idnsList: string[]): void {

		if (this.isIniting() && atlas != null && idnsList != null && idnsList.length > 0) {

			this.init();

			this.m_pos = CoMath.createVec3();

			this.m_total = idnsList.length;
			let obj = atlas.getTexObjFromAtlas(idnsList[0]);
			let mesh = this.createMesh(atlas, idnsList);
			this.m_vtCount = mesh.vtCount;
			
			this.m_material = this.createMaterial(obj.texture);
			this.m_material.vtxInfo = CoRScene.createVtxDrawingInfo();
			let et = CoEntity.createDisplayEntity();
			et.setMaterial(this.m_material);
			et.setMesh(mesh);
			et.setIvsParam(0, this.m_step);
			this.m_entities.push(et);
			this.applyRST( et );

			this.setClipIndex(0);
		}
	}
	initializeWithLable(srcLable: IClipLabel): void {
		if (this.isIniting() && srcLable != null && srcLable != this) {
			if (srcLable.getClipsTotal() < 1) {
				throw Error("Error: srcLable.getClipsTotal() < 1");
			}

			this.init();

			let ls = srcLable.getREntities();
			for (let i = 0; i < ls.length; ++i) {

				let entity = ls[i];//srcLable.getREntity();
				let mesh = entity.getMesh();

				this.m_pos = CoMath.createVec3();

				let tex = entity.getMaterial().getTextureAt(0);
				let n = this.m_total = srcLable.getClipsTotal();
				this.m_sizes = new Array(n * 2);
				let k = 0;
				for (let i = 0; i < n; ++i) {
					this.m_sizes[k++] = srcLable.getClipWidthAt(i);
					this.m_sizes[k++] = srcLable.getClipHeightAt(i);

				}

				this.m_vtCount = mesh.vtCount;
				
				this.m_material = this.createMaterial(tex);
				this.m_material.vtxInfo = CoRScene.createVtxDrawingInfo();

				let et = CoEntity.createDisplayEntity();
				et.setMaterial(this.m_material);
				et.setMesh(mesh);
				et.setIvsParam(0, this.m_step);
				this.m_entities.push(et);

				this.applyRST( et );
			}
			this.setClipIndex(0);
		}
	}
	displaceFromLable(srcLable: IClipLabel): void {
		if (srcLable != null && srcLable != this) {
			if (srcLable.getClipsTotal() < 1) {
				throw Error("Error: srcLable.getClipsTotal() < 1");
			}
			// if (this.m_entities == null) {
			// 	this.initializeWithLable(srcLable);
			// } else if (this.m_entities[0].isRFree()) {
			// }
		}
	}
	setColor(color: IColor4): void {
		if (this.m_material != null) {
			this.m_material.setColor(color);
		}
	}
	getColor(color: IColor4): void {
		if (this.m_material != null) {
			this.m_material.getColor(color);
		}
	}
	setClipIndex(i: number): void {
		if (i >= 0 && i < this.m_total) {
			this.m_index = i;

			let ls = this.m_entities;
			for (let k = 0; k < ls.length; ++k) {
				ls[k].getMaterial().vtxInfo.setIvsParam(i * this.m_step, this.m_step);
			}

			i = i << 1;
			this.m_width = this.m_sizes[i];
			this.m_height = this.m_sizes[i + 1];
		}
	}
}
export { ClipLabel };
