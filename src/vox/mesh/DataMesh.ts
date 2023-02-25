/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import IVector3D from "../../vox/math/IVector3D";
import VtxBufConst from "../../vox/mesh/VtxBufConst";
import MeshBase from "../../vox/mesh/MeshBase";
import ROVertexBuffer from "../../vox/mesh/ROVertexBuffer";
import IDataMesh from "../../vox/mesh/IDataMesh";
import AABB from "../geom/AABB";
import IGeometry from "../../vox/mesh/IGeometry";
import SurfaceNormalCalc from "../geom/SurfaceNormalCalc";
import ITestRay from "./ITestRay";

export default class DataMesh extends MeshBase implements IDataMesh {

	private m_boundsChanged = true;
	private m_ils: (Uint16Array | Uint32Array)[] = new Array(2);
	private m_ls: Float32Array[] = new Array(10);

	private m_rayTester: ITestRay = null;
	private m_boundsVersion = -2;

	autoBuilding = true;
	// v,u,n,c,t, v2,u2,n2,c2,t2
	private m_strides = new Uint8Array([
		3, 2, 3, 3, 3,
		3, 2, 3, 3, 3
	]);

	constructor(bufDataUsage: number = VtxBufConst.VTX_STATIC_DRAW) {
		super(bufDataUsage);
		this.m_ls.fill(null);
	}
	setRayTester(rayTester: ITestRay): void {
		this.m_rayTester = rayTester;
	}
	
	/**
	 * set vertex position data
	 * @param vs vertex position buffer Float32Array
	 */
	setVS(vs: Float32Array, stride: number = 3): DataMesh {
		this.m_ls[0] = vs;
		this.m_strides[0] = stride;
		this.m_boundsChanged = true;
		return this;
	}
	/**
	 * set second  vertex position data
	 * @param vs vertex position buffer Float32Array
	 */
	setVS2(vs: Float32Array, stride: number = 3): DataMesh {
		this.m_ls[5] = vs;
		this.m_strides[5] = stride;
		this.m_boundsChanged = true;
		return this;
	}
	/**
	 * @returns vertex position buffer Float32Array
	 */
	getVS(): Float32Array {
		return this.m_ls[0];
	}
	/**
	 * @returns vertex position buffer Float32Array
	 */
	getVS2(): Float32Array {
		return this.m_ls[5];
	}
	/**
	 * set vertex uv data
	 * @param uvs vertex uv buffer Float32Array
	 */
	setUVS(uvs: Float32Array, stride: number = 2): DataMesh {
		this.m_ls[1] = uvs;
		this.m_strides[1] = stride;
		return this;
	}
	/**
	 * set second vertex uv data
	 * @param uvs vertex uv buffer Float32Array
	 */
	setUVS2(uvs: Float32Array, stride: number = 2): DataMesh {
		this.m_ls[6] = uvs;
		this.m_strides[6] = stride;
		return this;
	}
	/**
	 * @returns vertex uv buffer Float32Array
	 */
	getUVS(): Float32Array {
		return this.m_ls[1];
	}
	/**
	 * @returns second vertex uv buffer Float32Array
	 */
	getUVS2(): Float32Array {
		return this.m_ls[6];
	}
	/**
	 * set vertex normal data
	 * @param vs vertex normal buffer Float32Array
	 */
	setNVS(nvs: Float32Array, stride: number = 3): DataMesh {
		this.m_ls[2] = nvs;
		this.m_strides[2] = stride;
		return this;
	}
	/**
	 * @returns vertex normal buffer Float32Array
	 */
	getNVS(): Float32Array {
		return this.m_ls[2];
	}

	/**
	 * set vertex color(r,g,b) data
	 * @param vs vertex color(r,g,b) buffer Float32Array
	 */
	setCVS(cvs: Float32Array, stride: number = 3): DataMesh {
		this.m_ls[3] = cvs;
		this.m_strides[3] = stride;
		return this;
	}
	/**
	 * @returns vertex color(r,g,b) data
	 */
	getCVS(): Float32Array {
		return this.m_ls[3];
	}
	/**
	 * set vertex tangent data
	 * @param vs vertex tangent buffer Float32Array
	 */
	setTVS(tvs: Float32Array, stride: number = 3): DataMesh {
		this.m_ls[4] = tvs;
		this.m_strides[4] = stride;
		return this;
	}
	/**
	 * @returns vertex tangent buffer Float32Array
	 */
	getTVS(): Float32Array {
		return this.m_ls[4];
	}

	initializeFromGeometry(geom: IGeometry): void {
		
		this.setVS(geom.getVS());
		this.setUVS(geom.getUVS());
		this.setNVS(geom.getNVS());
		this.setCVS(geom.getCVS());
		this.setTVS(geom.getTVS());
		this.setIVSAt(geom.getIVS());

		this.m_boundsChanged = true;
		this.initialize();
	}
	private addFloat32Data(data: Float32Array, type: number, stride: number, info: string = ""): void {
		let free = this.getBufSortFormat() < 1;
		free = this.isVBufEnabledAt(type) || (free && data != null);
		// console.log("DataMesh::addFloat32Data(), info: ", info, ", free: ", free, ", data: ", data);
		if (free) {
			ROVertexBuffer.AddFloat32Data(data, stride);
		}
	}

	setIVS(ivs: Uint16Array | Uint32Array): IDataMesh {
		this.m_ils[0] = ivs;
		return this;
	}
    /**
     * @returns vertex indices buffer Uint16Array or Uint32Array
     */
    getIVS(): Uint16Array | Uint32Array { return this.m_ils[0]; }
	setIVSAt(ivs: Uint16Array | Uint32Array, index: number = 0): DataMesh {
		this.m_ivs = ivs;
		this.m_boundsChanged = true;
		this.m_ils[index] = ivs;
		return this;
	}
	getIVSAt(index: number): Uint16Array | Uint32Array {
		return this.m_ils[index];
	}
	initialize(): void {

		let ls = this.m_ls;
		if (ls[0] != null) {

			let ds = this.m_strides;
			let vs = ls[0];
			let vsStride = ds[0];
			if (this.autoBuilding) {

				if (this.bounds == null) {
					this.bounds = new AABB();
					this.bounds.addFloat32Arr(vs, vsStride);
					this.bounds.update();
				} else if (this.m_boundsChanged || this.m_boundsVersion == this.bounds.version) {
					this.bounds.reset();
					// 如果重新init, 但是版本号却没有改变，说明bounds需要重新计算
					this.bounds.addFloat32Arr(vs, vsStride);
					this.bounds.update();
				}
			}
			this.m_boundsVersion = this.bounds.version;
			this.m_boundsChanged = false;

			let ils = this.m_ils;
			let ivs = ils[0];

			const rvb = ROVertexBuffer;
			ROVertexBuffer.Reset();
			// console.log("XXXXXX vsStride: ", vsStride, ", vs: ", vs);
			rvb.AddFloat32Data(vs, vsStride);

			const vc = VtxBufConst;
			const vcf = this.addFloat32Data.bind(this);

			vcf(ls[1], vc.VBUF_UVS_INDEX, ds[1]);

			let nvsIndex = 2;
			let nvs = ls[nvsIndex];
			let free = this.getBufSortFormat() < 1;
			if (this.isVBufEnabledAt(VtxBufConst.VBUF_NVS_INDEX) || (free && nvs != null)) {
				if (nvs == null) {
					let trisNumber = ivs.length / 3;
					nvs = new Float32Array(vs.length);
					SurfaceNormalCalc.ClacTrisNormal(vs, vs.length, trisNumber, ivs, nvs);
					ls[nvsIndex] = nvs;
				}
				// console.log("XXXXXX vsStride: ", ds[nvsIndex], ", nvs: ", nvs);
				rvb.AddFloat32Data(nvs, ds[nvsIndex]);
			}

			vcf(ls[3], vc.VBUF_CVS_INDEX, ds[3]);
			vcf(ls[4], vc.VBUF_TVS_INDEX, ds[4]);
			vcf(ls[5], vc.VBUF_VS2_INDEX, ds[5]);
			vcf(ls[6], vc.VBUF_UVS2_INDEX, ds[6]);

			rvb.vbWholeDataEnabled = this.vbWholeDataEnabled;

			this.vtCount = ivs.length;
			if (this.autoBuilding) {
				this.vtxTotal = vs.length / vsStride;

				// this.toElementsLines();
				// let pivs = this.updateWireframeIvs(ivs);
				// if(this.wireframe && pivs != null) {
				// 	ivs = pivs;
				// }
				this.vtCount = ivs.length;
				this.trisNumber = this.vtCount / 3;
			}

			if (this.m_vbuf != null) {
				rvb.UpdateBufData(this.m_vbuf);
			} else {
				let u = this.getBufDataUsage();
				let f = this.getBufSortFormat();
				this.m_vbuf = rvb.CreateBySaveData(u, f);
				if (this.vbWholeDataEnabled) {
					this.m_vbuf = rvb.CreateBySaveData(u, f);
				} else {
					this.m_vbuf = rvb.CreateBySaveDataSeparate(u);
				}
			}
			
			let ird = this.crateROIvsData();
			ird.wireframe = this.wireframe;
			ird.shape = this.shape;
			ird.setData(ivs);
			this.m_vbuf.setIVSDataAt(ird);

			this.buildEnd();
		}
	}

	/**
	 * 射线和自身的相交检测(多面体或几何函数(例如球体))
	 * @rlpv            表示物体坐标空间的射线起点
	 * @rltv            表示物体坐标空间的射线朝向
	 * @outV            如果检测相交存放物体坐标空间的交点
	 * @boundsHit       表示是否包围盒体已经和射线相交了
	 * @return          返回值 -1 表示不会进行检测,1表示相交,0表示不相交
	 */
	testRay(rlpv: IVector3D, rltv: IVector3D, outV: IVector3D, boundsHit: boolean): number {
		if (this.m_rayTester != null) {
			return this.m_rayTester.testRay(rlpv, rltv, outV, boundsHit);
		}
		return -1;
	}

	__$destroy(): void {
		if (this.isResFree()) {
			this.bounds = null;

			if (this.m_rayTester != null) {
				this.m_rayTester.destroy();
				this.m_rayTester = null;
			}

			this.m_ls.fill(null);
			this.m_ils.fill(null);

			super.__$destroy();
		}
	}
}
