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

declare var CoMesh: ICoMesh;
declare var CoMaterial: ICoMaterial;
declare var CoEntity: ICoEntity;
declare var CoMath: ICoMath;

class FloorLineGrid {

	private m_rscene: IRendererScene;
	private m_entity: ITransformEntity = null;
	constructor() {
	}

	initialize(rscene: IRendererScene, rpi: number, minV: IVector3D, maxV: IVector3D, stepsTotal: number = 10, color: IColor4 = null): void {

		if (this.m_entity == null) {

			if(rpi < 0) rpi = 0;
			if(stepsTotal < 1) stepsTotal = 1;
			if(color == null) color = CoMaterial.createColor4(0.3,0.3,0.3, 1.0);
			
			this.m_rscene = rscene;
			this.m_entity = CoEntity.createDisplayEntity();
			// xoz
			let type = 1;
			let dv = CoMath.createVec3().subVecsTo(maxV, minV);
			if(dv.z < 0.1) {
				// xoy
				type = 0;
			} else if(dv.x < 0.1) {
				// yoz
				type = 2;
			}
			dv.scaleBy(1.0 / stepsTotal);
			let rn = stepsTotal + 1;
			let cn = stepsTotal + 1;

			let pv0 = minV.clone();
			let pv1 = maxV.clone();
			let pv2 = maxV.clone();
			let pvs: IVector3D[] = new Array(rn * 2);
			let j = 0;
			// xoz
			if(type == 1) {
				for(let i = 0; i < rn; ++i) {
					pv0.x = minV.x + dv.x * i;
					pv0.z = minV.z;
					pv1.copyFrom(pv0);
					pv1.z = maxV.z;
					pvs[j++] = pv0.clone();
					pvs[j++] = pv1.clone();
	
					pv2.copyFrom(pv0);
					pv0.x = pv1.z;
					pv0.z = pv1.x;
					pv1.x = pv2.z;
					pv1.z = pv2.x;
					pvs[j++] = pv0.clone();
					pvs[j++] = pv1.clone();
				}
			}
			else if(type == 2) {
				// yoz
				for(let i = 0; i < rn; ++i) {
					pv0.y = minV.y + dv.y * i;
					pv0.z = minV.z;
					pv1.copyFrom(pv0);
					pv1.z = maxV.z;
					pvs[j++] = pv0.clone();
					pvs[j++] = pv1.clone();
	
					pv2.copyFrom(pv0);
					pv0.y = pv1.z;
					pv0.z = pv1.y;
					pv1.y = pv2.z;
					pv1.z = pv2.y;
					pvs[j++] = pv0.clone();
					pvs[j++] = pv1.clone();
				}
			}
			else {
				// xoy
				for(let i = 0; i < rn; ++i) {
					pv0.x = minV.x + dv.x * i;
					pv0.y = minV.y;
					pv1.copyFrom(pv0);
					pv1.y = maxV.y;
					pvs[j++] = pv0.clone();
					pvs[j++] = pv1.clone();
	
					pv2.copyFrom(pv0);
					pv0.x = pv1.y;
					pv0.y = pv1.x;
					pv1.x = pv2.y;
					pv1.y = pv2.x;
					pvs[j++] = pv0.clone();
					pvs[j++] = pv1.clone();
				}
			}

			CoMesh.line.dynColorEnabled = true;
			let material = CoMaterial.createLineMaterial(CoMesh.line.dynColorEnabled);
			material.setColor( color );
			CoMesh.line.setBufSortFormat(material.getBufSortFormat());
			let mesh = CoMesh.line.createLines(pvs);
			this.m_entity.setMaterial(material);
			this.m_entity.setMesh(mesh);
			// this.m_entity.setXYZ(80, 80, 0);
			rscene.addEntity(this.m_entity,rpi);			
		}
	}
	setVisible(v: boolean): void {
		if (this.m_entity != null) {
			this.m_entity.setVisible(v);
		}
	}
}

export { FloorLineGrid }
