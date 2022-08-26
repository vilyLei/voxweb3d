import IDataMesh from "../../../vox/mesh/IDataMesh";
import IRawMesh from "../../../vox/mesh/IRawMesh";
import IColor4 from "../../../vox/material/IColor4";
import { IPlaneMeshBuilder } from "./IPlaneMeshBuilder";
import IVector3D from "../../../vox/math/IVector3D";
// import ITransformEntity from "../../../vox/entity/ITransformEntity";

import { ICoMath } from "../../math/ICoMath";
declare var CoMath: ICoMath;
import { ICoRScene } from "../../voxengine/ICoRScene";
declare var CoRScene: ICoRScene;

class LShapeGeometry {
	constructor() {}

	vtxColorEnabled = false;

	axisFlag: number = 0;

	vtxTotal = 4;
	trisNumber = 2;
	vtCount = 6;

	private m_ivs: Uint16Array = null;
	private m_vs: Float32Array = null;
	private m_uvs: Float32Array = null;
	getIVS(): Uint16Array | Uint32Array {
		return this.m_ivs;
	}
	getVS(): Float32Array {
		return this.m_vs;
	}
	getUVS(): Float32Array {
		return this.m_uvs;
	}
	private toVertical(inV: IVector3D, outV: IVector3D): void {

	}
	initialize(thickness: number ,posList: IVector3D[], offset: number = 6): void {
		if (this.m_vs != null) {
			return;
		}
		// 5, 4, 3
		// 0, 1, 2
		//
		this.m_ivs = new Uint16Array( [0,1,4, 0,4,5, 1,2,3, 1,3,4] );
		this.m_vs = new Float32Array(18);

		let z = 0;
		//let innerDis = 6;
		/*
		let x = 0,y = 0;
		x = width - innerDis;
		y = height - y;
		// top left top vtx
		this.m_vs.set([x,y,z], 0);

		// x = width - innerDis;
		y = height - innerDis;
		// mid left corner vtx
		this.m_vs.set([x,y,z], 0);

		x = offsetX;
		// y = height - innerDis;
		// left top corner vtx
		this.m_vs.set([x,y,z], 0);


		x = offsetX;
		// y = height - innerDis;
		// left top corner vtx
		this.m_vs.set([x,y,z], 0);
		//*/
		//
		this.vtxTotal = 6;
		this.trisNumber = 4;
		this.vtCount = 12;
	}
}

export { LShapeGeometry };
