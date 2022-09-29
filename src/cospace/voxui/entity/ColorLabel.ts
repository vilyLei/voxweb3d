import IDefault3DMaterial from "../../../vox/material/mcase/IDefault3DMaterial";
import { IColorLabel } from "./IColorLabel";
import IVector3D from "../../../vox/math/IVector3D";
import IRawMesh from "../../../vox/mesh/IRawMesh";
import IColor4 from "../../../vox/material/IColor4";
import { UIEntityBase } from "./UIEntityBase";

import { ICoMesh } from "../../voxmesh/ICoMesh";
declare var CoMesh: ICoMesh;
import { ICoMaterial } from "../../voxmaterial/ICoMaterial";
declare var CoMaterial: ICoMaterial;
import { ICoMath } from "../../math/ICoMath";
declare var CoMath: ICoMath;
import { ICoEntity } from "../../voxentity/ICoEntity";
declare var CoEntity: ICoEntity;

class ColorLabel extends UIEntityBase implements IColorLabel {

	private m_color: IColor4 = null;
	private m_material: IDefault3DMaterial = null;
	constructor(){ super(); }
	private createMesh(): IRawMesh {

		let ivs = new Uint16Array([0, 1, 2, 0, 2, 3]);
		let vs = new Float32Array(this.createVS(0, 0, this.m_width, this.m_height));

		let mesh = CoMesh.createRawMesh();
		mesh.reset();
		mesh.setIVS(ivs);
		mesh.addFloat32Data(vs, 3);
		mesh.initialize();
		return mesh;
	}

	initialize(width: number, height: number): void {

		if (this.isIniting()) {
			this.init();

			this.m_width = width;
			this.m_height = height;
			let material = CoMaterial.createDefaultMaterial();
			this.m_color = CoMaterial.createColor4();
			let mesh = this.createMesh();
			let et = CoEntity.createDisplayEntity();
			et.setMaterial(material);
			et.setMesh(mesh);
			this.applyRST(et);
			this.m_entities.push(et);

			this.m_material = material;
		}
	}
	setColor(c: IColor4): IColor4 {
		this.m_color.copyFrom(c);
		this.m_material.setColor(c);
		return c;
	}
	getColor(): IColor4 {
		return this.m_color;
	}
	destroy(): void {
		super.destroy();
		this.m_material
	}
}
export { ColorLabel };
