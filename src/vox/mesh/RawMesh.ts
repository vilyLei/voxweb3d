/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2023 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import IVector3D from "../../vox/math/IVector3D";
import ROVertexBuffer from "../../vox/mesh/ROVertexBuffer";
import VtxBufConst from "../../vox/mesh/VtxBufConst";
import MeshBase from "../../vox/mesh/MeshBase";
import IRawMesh from "./IRawMesh";
import ITestRay from "./ITestRay";
import AABB from "../geom/AABB";

/**
 * rawMesh
 */
export default class RawMesh extends MeshBase implements IRawMesh {
	private m_dataList: Float32Array[] = [];
	private m_rayTester: ITestRay = null;
	autoBuilding: boolean = true;
	ivsEnabled: boolean = true;
	aabbEnabled: boolean = true;
    constructor(bufDataUsage: number = VtxBufConst.VTX_STATIC_DRAW) {
        super(bufDataUsage);
    }
	
	setRayTester(rayTester: ITestRay): void {
		this.m_rayTester = rayTester;
	}
    reset(): void {
		this.m_dataList = [];
		ROVertexBuffer.Reset();
	}
	addFloat32Data(fs32: Float32Array, step: number, status: number = VtxBufConst.VTX_STATIC_DRAW): void {
		this.m_dataList.push(fs32);
        ROVertexBuffer.AddFloat32Data(fs32, step, status);
	}
	setIVS(ivs: Uint16Array | Uint32Array): void {
		this.m_ivs = ivs;
	}
	getVS(): Float32Array {
		return this.m_dataList[0];
	}
	getUVS(): Float32Array {
		return this.m_dataList.length > 1 ? this.m_dataList[1] : null;
	}
	getNVS(): Float32Array {
		return this.m_dataList.length > 2 ? this.m_dataList[2] : null;
	}
    initialize(): void {

		if(this.getBufSortFormat() < 1) {
			console.warn("bufSortFormat is zero!");
		}
		const vs = this.m_dataList[0];

		this.m_ivs = this.m_ivs;
		let rvb = ROVertexBuffer;
        rvb.vbWholeDataEnabled = this.vbWholeDataEnabled;
		if(this.aabbEnabled && this.autoBuilding && this.m_dataList.length > 0) {
            if(this.bounds == null) {
                this.bounds = new AABB();
            }
			if (this.m_transMatrix != null) {
				this.m_transMatrix.transformVectorsSelf(vs, vs.length);
			}
            this.bounds.addFloat32Arr(vs);
            this.bounds.updateFast();
		}
		if(this.ivsEnabled) {
			this.vtCount = this.m_ivs.length;
			if(this.autoBuilding) {
				this.vtCount = this.m_ivs.length;
			}
		}else {
			this.vtCount = 0;
		}
		ROVertexBuffer.vbWholeDataEnabled = this.vbWholeDataEnabled;
		if (this.m_vbuf != null) {
			rvb.UpdateBufData(this.m_vbuf);
		} else {
			let u = this.getBufDataUsage();
			let f = this.getBufSortFormat();
			if (this.vbWholeDataEnabled) {
				this.m_vbuf = rvb.CreateBySaveData(u, f);
			} else {
				this.m_vbuf = rvb.CreateBySaveDataSeparate( u );
			}
		}
		if(this.ivsEnabled) {
			this.m_vbuf.setIVSDataAt( this.crateROIvsData().setData(this.m_ivs) );
		}

        this.buildEnd();
    }
	setBufData4fAt(vertexI: number, attribI: number, px: number, py: number, pz: number, pw: number): void {
        if (this.m_vbuf != null) {
            this.m_vbuf.setData4fAt(vertexI, attribI, px, py, pz, pw);
        }
    }
    setBufData3fAt(vertexI: number, attribI: number, px: number, py: number, pz: number): void {
        if (this.m_vbuf != null) {
            this.m_vbuf.setData3fAt(vertexI, attribI, px, py, pz);
        }
    }
    setBufData2fAt(vertexI: number, attribI: number, px: number, py: number): void {
        if (this.m_vbuf != null) {
            this.m_vbuf.setData2fAt(vertexI, attribI, px, py);
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
		if(this.m_rayTester != null) {
			return this.m_rayTester.testRay(rlpv, rltv, outV, boundsHit);
		}
        return -1;
    }
    __$destroy(): void {
		if(this.m_dataList != null) {
			this.m_dataList = [];
		}
		if(this.m_rayTester != null) {
			this.m_rayTester.destroy();
			this.m_rayTester = null;
		}
        super.__$destroy();
    }
}
