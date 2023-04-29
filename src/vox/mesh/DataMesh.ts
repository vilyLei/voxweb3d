/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2023 by                                                 */
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
	private m_ils: (Uint16Array | Uint32Array)[] = new Array(1);
	private m_iverls: number[] = new Array(1);
	private m_iver1ls: number[] = new Array(1);
	private m_ists: boolean[][] = new Array(1);
	private m_ls: Float32Array[] = new Array(10);
	private m_verls: number[] = new Array(10);

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
		this.m_ils.fill(null);
		this.m_iverls.fill(0);
		this.m_iver1ls.fill(0);
		this.m_ists.fill([true, false]);
		this.m_verls.fill(0);
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
		this.m_verls[0] ++;
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
		this.m_verls[5] ++;
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
		this.m_verls[1] ++;
		return this;
	}
	/**
	 * set second vertex uv data
	 * @param uvs vertex uv buffer Float32Array
	 */
	setUVS2(uvs: Float32Array, stride: number = 2): DataMesh {

		this.m_ls[6] = uvs;
		this.m_strides[6] = stride;
		this.m_verls[6] ++;
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
		this.m_verls[2] ++;
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
		this.m_verls[3] ++;
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
		this.m_verls[4] ++;
		return this;
	}
	/**
	 * @returns vertex tangent buffer Float32Array
	 */
	getTVS(): Float32Array {
		return this.m_ls[4];
	}

	initializeFromGeometry(geom: IGeometry): DataMesh {
		
		this.setVS(geom.getVS());
		this.setUVS(geom.getUVS());
		this.setNVS(geom.getNVS());
		this.setCVS(geom.getCVS());
		this.setTVS(geom.getTVS());
		this.setIVSAt(geom.getIVS());

		this.m_boundsChanged = true;
		return this.initialize();
	}
	private addFloat32Data(data: Float32Array, type: number, stride: number, ver: number, info: string = ""): void {

		let free = this.getBufSortFormat() < 1;
		free = this.isVBufEnabledAt(type) || (free && data != null);
		// console.log("DataMesh::addFloat32Data(), info: ", info, ", free: ", free, ", ver: ", ver);
		if (free) {
			ROVertexBuffer.AddFloat32DataVer( ver );
			ROVertexBuffer.AddFloat32Data(data, stride);
		}
	}

	setIVS(ivs: Uint16Array | Uint32Array): IDataMesh {

		this.m_ivs = ivs;
		this.m_ils[0] = ivs;
		this.m_iverls[0] += 1;
		return this;
	}
    /**
     * @returns vertex indices buffer Uint16Array or Uint32Array
     */
    getIVS(): Uint16Array | Uint32Array { return this.m_ils[0]; }
	setIVSAt(ivs: Uint16Array | Uint32Array, index: number = 0, wireframe: boolean = false, shape: boolean = true): DataMesh {

		// console.log("DataMesh::setIVSAt(), index: ", index);
		if(index == 0) this.m_ivs = ivs;
		this.m_boundsChanged = true;
		if(index < this.m_ils.length) {
			this.m_ils[index] = ivs;
			this.m_iverls[index] += 1;
			let ls = this.m_ists[index];
			ls[0] = shape;
			ls[1] = wireframe;
		}else if(index == this.m_ils.length){
			this.m_ils.push( ivs );
			this.m_ists.push( [shape, wireframe] );
			this.m_iverls.push(1);
			this.m_iver1ls.push(0);
		}
		return this;
	}
	getIVSAt(index: number): Uint16Array | Uint32Array {
		return this.m_ils[index];
	}
	initialize(): DataMesh {

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

			const ils = this.m_ils;
			const ivs = ils[0];

			const verls = this.m_verls;
			const rvb = ROVertexBuffer;
			ROVertexBuffer.Reset();
			// console.log("XXXXXX vsStride: ", vsStride, ", vs: ", vs);
			rvb.AddFloat32DataVer( verls[0] );
			rvb.AddFloat32Data( vs, vsStride );

			const vc = VtxBufConst;
			const vcf = this.addFloat32Data.bind(this);

			vcf(ls[1], vc.VBUF_UVS_INDEX, ds[1], verls[1]);

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
				rvb.AddFloat32DataVer( verls[nvsIndex] );
				rvb.AddFloat32Data(nvs, ds[nvsIndex]);
			}

			vcf(ls[3], vc.VBUF_CVS_INDEX, ds[3], verls[3]);
			vcf(ls[4], vc.VBUF_TVS_INDEX, ds[4], verls[4]);
			vcf(ls[5], vc.VBUF_VS2_INDEX, ds[5], verls[5]);
			vcf(ls[6], vc.VBUF_UVS2_INDEX, ds[6], verls[6]);

			rvb.vbWholeDataEnabled = this.vbWholeDataEnabled;

			this.vtCount = ivs.length;
			this.vtxTotal = vs.length / vsStride;
			this.vtCount = ivs.length;
			this.trisNumber = this.vtCount / 3;

			if (this.m_vbuf != null) {
				rvb.UpdateBufData(this.m_vbuf);
			} else {
				let u = this.getBufDataUsage();
				let f = this.getBufSortFormat();
				if (this.vbWholeDataEnabled) {
					this.m_vbuf = rvb.CreateBySaveData(u, f);
				} else {
					this.m_vbuf = rvb.CreateBySaveDataSeparate(u);
				}
			}
			let sts = this.m_ists;
			let bls = sts[0];
			bls[0] = this.shape;
			bls[1] = this.wireframe;
			for(let i = 0; i < ils.length; ++i) {
				let ird = this.m_vbuf.getIvsDataAt(i);
				let flag = true;
				if(ird == null) {
					ird = this.crateROIvsData();
					bls = sts[i];
					ird.shape = bls[0];
					ird.wireframe = bls[1];
				}else {
					flag = this.m_iver1ls[i] != this.m_iverls[i];
				}
				this.m_iver1ls[i] = this.m_iverls[i];
				if(flag) {
					ird.setData(ils[i]);
					this.m_vbuf.setIVSDataAt(ird, i);
				}
			}

			this.buildEnd();
		}
		return this;
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

			this.m_iverls = [];
			this.m_iver1ls = [];
			this.m_ls = [];
			this.m_ils = [];

			super.__$destroy();
		}
	}
}
