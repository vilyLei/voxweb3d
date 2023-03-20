/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import Vector3D from "../../vox/math/Vector3D";
import RadialLine from "../../vox/geom/RadialLine";
import AABB from "../../vox/geom/AABB";
import VtxBufConst from "../../vox/mesh/VtxBufConst";
import MeshBase from "../../vox/mesh/MeshBase";
import ROVertexBuffer from "../../vox/mesh/ROVertexBuffer";

import { RenderDrawMode } from "../../vox/render/RenderConst";

export default class DashedLineMesh extends MeshBase {
	private static s_pv0 = new Vector3D();
	private static s_pv1 = new Vector3D();
	constructor(bufDataUsage: number = VtxBufConst.VTX_STATIC_DRAW) {
		super(bufDataUsage);
	}
	private m_vsVer = 0;
	private m_cvsVer = 0;
	private m_vs: Float32Array = null;
	private m_cvs: Float32Array = null;
	private m_lsTotal = 0;

	// 用于射线检测
	public rayTestRadius = 2.0;
	getVS(): Float32Array {
		return this.m_vs;
	}

	setVSData(data: Float32Array | number[], offset: number = 0): void {
        if(data && this.m_vs != null && (data.length + offset) <= this.m_vs.length) {
            this.m_vs.set(data, offset);
            this.m_vsVer++;
        }
	}
	setVS(vs: Float32Array): void {
		this.m_vs = vs;
        this.m_vsVer++;
	}
	getCVS(): Float32Array {
		return this.m_cvs;
	}
	setCVS(cvs: Float32Array): void {
		this.m_cvs = cvs;
        this.m_cvsVer ++;
	}
    updateData(): void {
        if(this.m_vbuf != null) {

            const rvb = ROVertexBuffer;

			rvb.Reset();
			rvb.AddFloat32DataVer(this.m_vsVer);
			rvb.AddFloat32Data(this.m_vs, 3);

            if(this.m_cvs == null) {
                rvb.AddFloat32DataVer(this.m_cvsVer);
				rvb.AddFloat32Data(this.m_cvs, 3);
            }
            rvb.UpdateBufData(this.m_vbuf);

			this.buildEnd();
        }
    }
	initialize(posarr: number[], colors: number[] = null): void {
		if (this.m_vs != null || posarr.length >= 6) {
			if (this.m_vs == null || this.m_vs.length != posarr.length) {
				this.m_vs = new Float32Array(posarr);
			} else {
				if (posarr) {
					if(posarr.length <= this.m_vs.length) {
                        this.m_vs.set(posarr);
                    }else {
                        this.m_vs = new Float32Array(posarr);
                    }
				}
			}
			this.vtCount = Math.floor(this.m_vs.length / 3);
			this.m_lsTotal = Math.floor(this.vtCount / 2);

			if (this.bounds == null) {
				this.bounds = new AABB();
			}
			this.bounds.addFloat32Arr(this.m_vs);
			this.bounds.updateFast();

			const rvb = ROVertexBuffer;
			rvb.Reset();
			rvb.AddFloat32DataVer(++this.m_vsVer);
			rvb.AddFloat32Data(this.m_vs, 3);

			// console.log("this.m_vs: ",this.m_vs);
			// console.log("colors: ",colors);

			if (this.isVBufEnabledAt(VtxBufConst.VBUF_CVS_INDEX)) {
				if (this.m_cvs == null) {
					this.m_cvs = colors ? new Float32Array(colors) : new Float32Array(this.m_vs.length);
					rvb.AddFloat32DataVer(++this.m_vsVer);
				} else {
					if (colors) {
						rvb.AddFloat32DataVer(++this.m_cvsVer);
					} else {
						rvb.AddFloat32DataVer(this.m_cvsVer);
					}
				}
				rvb.AddFloat32Data(this.m_cvs, 3);
			}
			rvb.vbWholeDataEnabled = this.vbWholeDataEnabled;
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

			this.drawMode = RenderDrawMode.ARRAYS_LINES;
			this.buildEnd();
		}
	}
	setVSXYZAt(i: number, px: number, py: number, pz: number): void {
		if (this.m_vbuf) {
			// ++this.m_vsVer;
			this.m_vbuf.setData3fAt(i, 0, px, py, pz);
			this.m_vbuf.updateF32DataVerAt(0);
		}
	}
	isPolyhedral(): boolean {
		return false;
	}

	/**
	 * 射线和自身的相交检测(多面体或几何函数(例如球体))
	 * @rlpv            表示物体坐标空间的射线起点
	 * @rltv            表示物体坐标空间的射线朝向
	 * @outV            如果检测相交存放物体坐标空间的交点
	 * @boundsHit       表示是否包围盒体已经和射线相交了
	 * @return          返回值 -1 表示不会进行检测,1表示相交,0表示不相交
	 */
	testRay(rlpv: Vector3D, rltv: Vector3D, outV: Vector3D, boundsHit: boolean): number {
		let j = 0;
		let vs = this.m_vs;
		let flag = 0;
		let radius = this.rayTestRadius;
		let pv0 = DashedLineMesh.s_pv0;
		let pv1 = DashedLineMesh.s_pv1;
		for (let i = 0; i < this.m_lsTotal; ++i) {
			pv0.setXYZ(vs[j], vs[j + 1], vs[j + 2]);
			pv1.setXYZ(vs[j + 3], vs[j + 4], vs[j + 5]);
			flag = RadialLine.IntersectionLS(rlpv, rltv, pv0, pv1, outV, radius);
			if (flag > 0) {
				return 1;
			}
			j += 6;
		}
		return 0;
	}
	__$destroy(): void {
		if (this.isResFree()) {
			this.bounds = null;

			this.m_vs = null;
			this.m_cvs = null;
			super.__$destroy();
		}
	}
}
