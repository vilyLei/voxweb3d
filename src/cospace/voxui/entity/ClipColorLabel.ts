import ITransformEntity from "../../../vox/entity/ITransformEntity";
import IDefault3DMaterial from "../../../vox/material/mcase/IDefault3DMaterial";
import ICanvasTexObject from "../../voxtexture/atlas/ICanvasTexObject";
import ICanvasTexAtlas from "../../voxtexture/atlas/ICanvasTexAtlas";
import { IClipColorLabel } from "./IClipColorLabel";
import IVector3D from "../../../vox/math/IVector3D";
import IRawMesh from "../../../vox/mesh/IRawMesh";
import IColor4 from "../../../vox/material/IColor4";
import { ClipLabelBase } from "./ClipLabelBase";

import { ICoMesh } from "../../voxmesh/ICoMesh";
declare var CoMesh: ICoMesh;
import { ICoMaterial } from "../../voxmaterial/ICoMaterial";
declare var CoMaterial: ICoMaterial;
import { ICoMath } from "../../math/ICoMath";
declare var CoMath: ICoMath;
import { ICoEntity } from "../../voxentity/ICoEntity";
import IRenderTexture from "../../../vox/render/texture/IRenderTexture";
declare var CoEntity: ICoEntity;

class ClipColorLabel extends ClipLabelBase implements IClipColorLabel {

	private m_colors: IColor4[] = null;
	private m_material: IDefault3DMaterial = null;
	private m_fixSize: boolean = true;
	private m_hasTex: boolean = false;

	private createMesh(atlas: ICanvasTexAtlas, idns: string): IRawMesh {

		let ivs = new Uint16Array([0, 1, 2, 0, 2, 3]);
		let vs = new Float32Array(this.createVS(0, 0, this.m_width, this.m_height));

		let mesh = CoMesh.createRawMesh();
		mesh.reset();
		mesh.setIVS(ivs);
		mesh.addFloat32Data(vs, 3);

		if (idns != "" && atlas != null) {
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

		if (this.isIniting() && colorsTotal > 0) {
			this.init();
			this.m_hasTex = false;
			let tex: IRenderTexture = null;
			if (idns != "" && atlas != null) {
				let obj = atlas.getTexObjFromAtlas(idns);
				if (this.m_fixSize) {
					this.m_width = obj.getWidth();
					this.m_height = obj.getHeight();
				}
				this.m_hasTex = true;
				tex = obj.texture;
			}
			let material = this.createMaterial( tex );
			let mesh = this.createMesh(atlas, idns);
			let et = CoEntity.createDisplayEntity();
			et.setMaterial(material);
			et.setMesh(mesh);
			this.m_entities.push(et);

			this.m_material = material;
			
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
		if (width > 0 && height > 0) {
			this.m_width = width;
			this.m_height = height;
			this.m_fixSize = false;
			this.initialize(atlas, idns, colorsTotal);
		}
	}
	initializeWithLable(srcLable: IClipColorLabel): void {
		if (this.isIniting() && srcLable != null && srcLable != this) {
			if (srcLable.getClipsTotal() < 1) {
				throw Error("Error: srcLable.getClipsTotal() < 1");
			}
			let ls = srcLable.getREntities();
			for (let i = 0; i < ls.length; ++i) {
				let entity = ls[i];
				let mesh = entity.getMesh();

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
				let material = this.createMaterial( tex );
				let et = CoEntity.createDisplayEntity();
				et.setMaterial(material);
				et.setMesh(mesh);
				this.m_entities.push(et);
				if (this.m_material == null) this.m_material = material;
			}
			this.setClipIndex(0);
		}
	}
	displaceFromLable(srcLable: IClipColorLabel): void {
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

	getColorAt(i: number): IColor4 {
		if (i >= 0 && i < this.m_total) {
			return this.m_colors[i];
		}
	}
	setColorAt(i: number, color4: IColor4): void {
		if (i >= 0 && i < this.m_total && color4 != null) {
			this.m_colors[i].copyFrom(color4);
		}
	}
	setClipIndex(i: number): void {
		if (i >= 0 && i < this.m_total) {
			this.m_index = i;
			this.m_material.setColor(this.m_colors[i]);
		}
	}
	getColors(): IColor4[] {
		return this.m_colors;
	}
}
export { ClipColorLabel };
