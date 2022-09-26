import IAABB from "../../../vox/geom/IAABB";
import IVector3D from "../../../vox/math/IVector3D";
import IRenderEntity from "../../../vox/render/IRenderEntity";
import IRendererScene from "../../../vox/scene/IRendererScene";

import { ICoMesh } from "../../voxmesh/ICoMesh";
import { ICoEntity } from "../../voxentity/ICoEntity";
import { ICoMaterial } from "../../voxmaterial/ICoMaterial";
import { ICoMath } from "../../math/ICoMath";
import ITransformEntity from "../../../vox/entity/ITransformEntity";

declare var CoMesh: ICoMesh;
declare var CoMaterial: ICoMaterial;
declare var CoEntity: ICoEntity;
declare var CoMath: ICoMath;

class FloorLineGrid {

	private m_rscene: IRendererScene;
	private m_entity: ITransformEntity = null;
	constructor() {
	}

	initialize(rscene: IRendererScene, rpi: number, minV: IVector3D, maxV: IVector3D, stepsTotal: number = 10) {

		if (this.m_entity == null) {

			if(rpi < 0) rpi = 0;
			if(stepsTotal < 1) stepsTotal = 1;
			
			this.m_rscene = rscene;
			this.m_entity = CoEntity.createDisplayEntity();

			let dv = CoMath.createVec3().subVecsTo(maxV, minV);

			dv.scaleBy(1.0 / stepsTotal);
			let rn = stepsTotal + 1;
			let cn = stepsTotal + 1;

			let pv0 = minV.clone();
			let pv1 = maxV.clone();

			// CoMesh.line.dynColorEnabled = true;
			// let material = CoMaterial.createLineMaterial(CoMesh.line.dynColorEnabled);
			// CoMesh.line.setBufSortFormat(material.getBufSortFormat());
			// let mesh = CoMesh.line.createRectXOY(0, 0, 1, 1);
			// this.m_entity.setMaterial(material);
			// this.m_entity.setMesh(mesh);
			// this.m_entity.setXYZ(80, 80, 0);
			// rscene.addEntity(this.m_entity);			
		}
	}
	setVisible(v: boolean): void {
		if (this.m_entity != null) {
			this.m_entity.setVisible(v);
		}
	}
}

export { FloorLineGrid }
