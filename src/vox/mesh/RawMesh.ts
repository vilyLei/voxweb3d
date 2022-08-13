/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import ROVertexBuffer from "../../vox/mesh/ROVertexBuffer";
import VtxBufConst from "../../vox/mesh/VtxBufConst";
import MeshBase from "../../vox/mesh/MeshBase";
import IRawMesh from "./IRawMesh";

/**
 * rawMesh
 */
export default class RawMesh extends MeshBase implements IRawMesh {
	private m_dataList: Float32Array[] = [];
	autoBuilding: boolean = true;
    constructor(bufDataUsage: number = VtxBufConst.VTX_STATIC_DRAW) {
        super(bufDataUsage);
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
		this.m_ivs = ivs
	}
    initialize(): void {

        ROVertexBuffer.vbWholeDataEnabled = this.vbWholeDataEnabled;

        this.vtCount = this.m_ivs.length;
		if(this.autoBuilding) {
			this.updateWireframeIvs();
			this.vtCount = this.m_ivs.length;
		}

		if (this.m_vbuf != null) {
			ROVertexBuffer.UpdateBufData(this.m_vbuf);
		} else {
			let u = this.getBufDataUsage();
			let f = this.getBufSortFormat();
			this.m_vbuf = ROVertexBuffer.CreateBySaveData(u, f);
			if (this.vbWholeDataEnabled) {
				this.m_vbuf = ROVertexBuffer.CreateBySaveData(u, f);
			} else {
				this.m_vbuf = ROVertexBuffer.CreateBySaveDataSeparate( u );
			}
		}
		this.m_vbuf.setUintIVSData(this.m_ivs);

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
    __$destroy(): void {
		if(this.m_dataList != null) {
			this.m_dataList = [];
		}
        super.__$destroy();
    }
}
