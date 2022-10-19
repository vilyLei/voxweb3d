import IAABB from "../../../vox/geom/IAABB";
import IVector3D from "../../../vox/math/IVector3D";
import IRenderEntity from "../../../vox/render/IRenderEntity";
import IRendererScene from "../../../vox/scene/IRendererScene";

import { ICoMesh } from "../../voxmesh/ICoMesh";
import { ICoEntity } from "../../voxentity/ICoEntity";
import { ICoMaterial } from "../../voxmaterial/ICoMaterial";
import { ICoMath } from "../../math/ICoMath";
import ITransformEntity from "../../../vox/entity/ITransformEntity";
import IColor4 from "../../../vox/material/IColor4";
import IColorMaterial from "../../../vox/material/mcase/IColorMaterial";

declare var CoMesh: ICoMesh;
declare var CoMaterial: ICoMaterial;
declare var CoEntity: ICoEntity;
declare var CoMath: ICoMath;

class BoxLine3D {

	private m_rscene: IRendererScene;
	private m_entity: ITransformEntity = null;
	private m_material: IColorMaterial = null;
	constructor() {
	}

	initializeWithAABB(rscene: IRendererScene, rpi: number, aabb: IAABB, color: IColor4 = null): void {
		this.initialize(rscene, rpi, aabb.min, aabb.max, color);
	}

	initialize(rscene: IRendererScene, rpi: number, minV: IVector3D, maxV: IVector3D, color: IColor4 = null): void {

		if (this.m_entity == null) {

			if (rpi < 0) rpi = 0;
			if (color == null) color = CoMaterial.createColor4(0.3, 0.3, 0.3, 1.0);

			this.m_rscene = rscene;
			this.m_entity = CoEntity.createDisplayEntity();

			let posarr = [
				// bottom frame plane: -y, first pos: (+x,-y,+z), plane positions wrap mode: CCW
				minV.x, minV.y, minV.z, minV.x, minV.y, maxV.z,
				minV.x, minV.y, minV.z, maxV.x, minV.y, minV.z,
				minV.x, minV.y, maxV.z, maxV.x, minV.y, maxV.z,
				maxV.x, minV.y, minV.z, maxV.x, minV.y, maxV.z,
				// wall frame
				minV.x, minV.y, minV.z, minV.x, maxV.y, minV.z,
				minV.x, minV.y, maxV.z, minV.x, maxV.y, maxV.z,
				maxV.x, minV.y, minV.z, maxV.x, maxV.y, minV.z,
				maxV.x, minV.y, maxV.z, maxV.x, maxV.y, maxV.z,
				// top frame plane: +y
				minV.x, maxV.y, minV.z, minV.x, maxV.y, maxV.z,
				minV.x, maxV.y, minV.z, maxV.x, maxV.y, minV.z,
				minV.x, maxV.y, maxV.z, maxV.x, maxV.y, maxV.z,
				maxV.x, maxV.y, minV.z, maxV.x, maxV.y, maxV.z
			];

			let pvs = new Float32Array(posarr);
			CoMesh.line.dynColorEnabled = true;
			this.m_material = CoMaterial.createLineMaterial(CoMesh.line.dynColorEnabled);
			this.m_material.initializeByCodeBuf(false);
			this.m_material.setColor(color);
			CoMesh.line.setBufSortFormat(this.m_material.getBufSortFormat());
			let mesh = CoMesh.line.createLinesWithFS32(pvs);
			this.m_entity.setMaterial(this.m_material);
			this.m_entity.setMesh(mesh);
			rscene.addEntity(this.m_entity, rpi);
		}
	}
	setVisible(v: boolean): void {
		if (this.m_entity != null) {
			this.m_entity.setVisible(v);
		}
	}
	isVisible(): boolean {
		if (this.m_entity != null) {
			return this.m_entity.getVisible();
		}
		return false;
	}
	setPosition(pv: IVector3D): void {
		if (this.m_entity != null) {
			this.m_entity.setPosition( pv );
		}
	}
	setXYZ(px: number, py: number, pz: number): void {
		if (this.m_entity != null) {
			this.m_entity.setXYZ( px, py, pz );
		}
	}
	update(): void {
		if (this.m_entity != null) {
			this.m_entity.update();
		}
	}
	destroy(): void {
		if (this.m_entity != null) {
			this.m_entity.destroy();
			this.m_entity = null;
		}
		this.m_rscene = null;
	}
}

export { BoxLine3D }
