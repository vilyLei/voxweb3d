/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import SurfaceNormalCalc from "../../vox/geom/SurfaceNormalCalc";
import VtxBufConst from "../../vox/mesh/VtxBufConst";
import ROVertexBuffer from "../../vox/mesh/ROVertexBuffer";
import AABB from "../../vox/geom/AABB";
import MeshBase from "../../vox/mesh/MeshBase";
import MeshVertex from "../../vox/mesh/MeshVertex";
import VtxNormalType from "../../vox/mesh/VtxNormalType";
import Vector3D from "../../vox/math/Vector3D";
export default class Cone3DMesh extends MeshBase {
	constructor(bufDataUsage: number = VtxBufConst.VTX_STATIC_DRAW) {
		super(bufDataUsage);
	}

	private m_vs: Float32Array = null;
	private m_uvs: Float32Array = null;
	private m_nvs: Float32Array = null;
	private m_cvs: Float32Array = null;

	inverseUV = false;
	uScale = 1.0;
	vScale = 1.0;
	// normalType = VtxNormalType.FLAT;
	normalType = VtxNormalType.GOURAND;

	getVS(): Float32Array {
		return this.m_vs;
	}
	getUVS(): Float32Array {
		return this.m_uvs;
	}
	getNVS(): Float32Array {
		return this.m_nvs;
	}
	getCVS(): Float32Array {
		return this.m_cvs;
	}
	getIVS(): Uint16Array | Uint32Array {
		return this.m_ivs;
	}

	initialize(
		radius: number,
		height: number,
		longitudeNumSegments: number,
		latitudeNumSegments: number,
		uvType: number = 1,
		alignYRatio: number = -0.5
	) {
		if (this.vtxTotal < 1) {
			if (radius < 0.01) radius = 0.01;
			if (longitudeNumSegments < 2) longitudeNumSegments = 2;
			let latitudeNumSegments: number = 2;

			let i = 1;
			let j = 0;
			let trisTot = 0;
			let yRad = 0.0;
			let px = 0.0;
			let py = 0.0;
			radius = Math.abs(radius);
			height = Math.abs(height);
			let minY = alignYRatio * height;
			let vtx = new MeshVertex(0.0, minY, 0.0, trisTot);

			this.bounds = new AABB();
			this.bounds.min.setXYZ(-radius, minY, -radius);
			this.bounds.max.setXYZ(radius, minY + height, radius);
			this.bounds.updateFast();

			// 计算绕 y轴 的纬度线上的点
			let vtxVec: MeshVertex[] = [];
			let vtxRows: MeshVertex[][] = [];
			vtxRows.push([]);
			let vtxRow: MeshVertex[] = vtxRows[0];
            vtx.f = 0;
			vtx.u = 0.5;
			vtx.v = 0.5;
			vtx.nx = 0.0;
			vtx.ny = -1.0;
			vtx.nz = 0.0;

			for (j = 0; j < 1; ++j) {
				vtx.index = trisTot;
				++trisTot;
				vtxRow.push(vtx.cloneVertex());
				vtxVec.push(vtxRow[j]);
			}
			py = minY;
			let py2 = 0.499;
			for (; i < latitudeNumSegments; ++i) {
				yRad = (Math.PI * i) / latitudeNumSegments;
				vtx.y = py;

				vtxRows.push([]);
				let rowa: MeshVertex[] = vtxRows[i];
				for (j = 0; j < longitudeNumSegments; ++j) {
					yRad = (Math.PI * 2.0 * j) / longitudeNumSegments;

					px = Math.sin(yRad);
					py = Math.cos(yRad);
					vtx.x = px * radius;
					vtx.z = py * radius;
					vtx.index = trisTot;
					++trisTot;

					// calc uv
					px *= py2;
					py *= py2;
					vtx.u = 0.5 + px;
					vtx.v = 0.5 + py;
					vtx.nx = vtx.x;
					vtx.ny = 0.0;
					vtx.nz = vtx.z;
					vtx.f = 0;

					rowa.push(vtx.cloneVertex());
					vtxVec.push(rowa[j]);
				}

				rowa.push(rowa[0]);
			}
			vtxRows.push([]);
			let rowa: MeshVertex[] = vtxRows[vtxRows.length - 1];
			let rowb: MeshVertex[] = vtxRows[vtxRows.length - 2];
			for (j = 0; j < longitudeNumSegments; ++j) {
				
				let pv = rowb[j].cloneVertex();
                pv.f = 1;
                
				rowa.push(pv);

				rowa[j].index = trisTot;
				++trisTot;
				vtxVec.push(rowa[j]);
                                
                pv = rowb[j];
				pv.nx = 0.0;
				pv.ny = -1.0;
				pv.nz = 0.0;
			}
			rowa.push(rowa[0]);

            vtx.f = 0;
			vtx.x = 0.0;
			vtx.y = minY + height;
			vtx.z = 0.0;
			vtx.u = 0.5;
			vtx.v = 0.5;
            vtx.nx = 0.0;
            vtx.ny = 1.0;
            vtx.nz = 0.0;
			vtxRows.push([]);
			let lastRow: MeshVertex[] = vtxRows[vtxRows.length - 1];
			for (j = 0; j < longitudeNumSegments; ++j) {
				vtx.index = trisTot;
				++trisTot;
				lastRow.push(vtx.cloneVertex());
				vtxVec.push(lastRow[j]);
			}
			lastRow.push(lastRow[0]);
			let pvtx: MeshVertex = null;
			///////////////////////////   ///////////////////////////    ////////////////
			let pivs: number[] = [];

			i = 1;
			latitudeNumSegments += 1;
			for (; i <= latitudeNumSegments; ++i) {
				let rowa: MeshVertex[] = vtxRows[i - 1];
				let rowb: MeshVertex[] = vtxRows[i];
				for (j = 1; j <= longitudeNumSegments; ++j) {
					if (i == 1) {
						pivs.push(rowa[0].index);
						pivs.push(rowb[j].index);
						pivs.push(rowb[j - 1].index);
					} else if (i == latitudeNumSegments) {
						pivs.push(rowa[j].index);
						pivs.push(rowb[j].index);
						pivs.push(rowa[j - 1].index);
					}
				}
			}

			this.vtxTotal = vtxVec.length;

			this.m_vs = new Float32Array(this.vtxTotal * 3);
			i = 0;
			for (j = 0; j < this.vtxTotal; ++j) {
				pvtx = vtxVec[j];
				this.m_vs[i] = pvtx.x;
				this.m_vs[i + 1] = pvtx.y;
				this.m_vs[i + 2] = pvtx.z;
				//trace(pvtx.x+","+pvtx.y+","+pvtx.z);
				i += 3;
			}

			if (this.m_transMatrix != null) {
				this.m_transMatrix.transformVectorsSelf(this.m_vs, this.m_vs.length);
				this.bounds.addFloat32Arr(this.m_vs);
				this.bounds.updateFast();
			}

			ROVertexBuffer.Reset();
			ROVertexBuffer.AddFloat32Data(this.m_vs, 3);
			this.m_ivs = new Uint16Array(pivs);
			if (this.isVBufEnabledAt(VtxBufConst.VBUF_UVS_INDEX)) {
				this.m_uvs = new Float32Array(this.vtxTotal * 2);

				i = 0;
				for (j = 0; j < this.vtxTotal; ++j) {
					pvtx = vtxVec[j];
					this.m_uvs[i] = pvtx.u;
					this.m_uvs[i + 1] = pvtx.v;
					i += 2;
				}
				ROVertexBuffer.AddFloat32Data(this.m_uvs, 2);
			}
			if (this.isVBufEnabledAt(VtxBufConst.VBUF_NVS_INDEX)) {
				this.m_nvs = new Float32Array(this.vtxTotal * 3);
				// i = 0;
				// for (j = 0; j < this.vtxTotal; ++j) {
				//     pvtx = vtxVec[j];
				//     this.m_nvs[i] = pvtx.nx; this.m_nvs[i + 1] = pvtx.ny; this.m_nvs[i + 2] = pvtx.nz;
				//     i += 3;
				// }
				// let nvs = new Float32Array(vtxTotal * 3);
				let trisNumber = this.m_ivs.length / 3;
				if (this.normalType == VtxNormalType.FLAT) {
					SurfaceNormalCalc.ClacTrisNormal(this.m_vs, this.m_vs.length, trisNumber, this.m_ivs, this.m_nvs);
				} else {
					SurfaceNormalCalc.ClacTrisNormal(this.m_vs, this.m_vs.length, trisNumber, this.m_ivs, this.m_nvs);
					i = 0;
					let nv = new Vector3D();
					for (j = 0; j < this.vtxTotal; ++j) {
						pvtx = vtxVec[j];
						if (pvtx.f > 0) {
							nv.x = pvtx.nx + this.m_nvs[i];
							nv.y = pvtx.ny + this.m_nvs[i + 1];
							nv.z = pvtx.nz + this.m_nvs[i + 2];
                            nv.normalize();
							this.m_nvs[i] = nv.x;
							this.m_nvs[i + 1] = nv.y;
							this.m_nvs[i + 2] = nv.z;
						} else {
							this.m_nvs[i] = pvtx.nx;
							this.m_nvs[i + 1] = pvtx.ny;
							this.m_nvs[i + 2] = pvtx.nz;
						}
						i += 3;
					}
				}
				ROVertexBuffer.AddFloat32Data(this.m_nvs, 3);
			}

			if (this.isVBufEnabledAt(VtxBufConst.VBUF_TVS_INDEX)) {
				let numTriangles = this.m_ivs.length / 3;
				let tvs: Float32Array = new Float32Array(this.m_vs.length);
				let btvs: Float32Array = new Float32Array(this.m_vs.length);
				SurfaceNormalCalc.ClacTrisTangent(this.m_vs, this.m_vs.length, this.m_uvs, this.m_nvs, numTriangles, this.m_ivs, tvs, btvs);
				ROVertexBuffer.AddFloat32Data(tvs, 3);
				ROVertexBuffer.AddFloat32Data(btvs, 3);
			}
			
			ROVertexBuffer.vbWholeDataEnabled = this.vbWholeDataEnabled;
			if (this.m_vbuf == null) {
				this.m_vbuf = ROVertexBuffer.CreateBySaveData(this.getBufDataUsage());
				this.m_vbuf.setIVSDataAt(this.crateROIvsData().setData(this.m_ivs));
				this.buildEnd();
			} else {
				if (this.forceUpdateIVS) {
					this.m_vbuf.setIVSDataAt(this.crateROIvsData().setData(this.m_ivs));
				}
				ROVertexBuffer.UpdateBufData(this.m_vbuf);
			}
			this.vtCount = this.m_ivs.length;
			this.trisNumber = this.vtCount / 3;
		}
	}
	__$destroy(): void {
		if (this.isResFree()) {
			this.bounds = null;

			this.m_vs = null;
			this.m_uvs = null;
			this.m_nvs = null;
			this.m_cvs = null;
			super.__$destroy();
		}
	}
}
