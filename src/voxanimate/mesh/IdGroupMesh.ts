/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import AABB from "../../vox/geom/AABB";
import VtxBufConst from "../../vox/mesh/VtxBufConst";
import ROVertexBuffer from "../../vox/mesh/ROVertexBuffer";
import MeshBase from "../../vox/mesh/MeshBase";
import { GeometryMerger } from "../../vox/mesh/GeometryMerger";
import Vector3D from "../../vox/math/Vector3D";

class IdGroupMesh extends MeshBase {

    srcMesh: MeshBase = null;
    constructor(bufDataUsage: number = VtxBufConst.VTX_STATIC_DRAW) {
        super(bufDataUsage);
    }
    private m_vs: Float32Array = null;
    private m_uvs: Float32Array = null;
    private m_nvs: Float32Array = null;
    private m_cvs: Float32Array = null;

    getVS() { return this.m_vs; }
    getUVS() { return this.m_uvs; }
    getNVS() { return this.m_nvs; }
    getCVS() { return this.m_cvs; }
    /**
     * @param layoutBit vertex shader vertex attributes layout bit status.
     *                  the value of layoutBit comes from the material shdder program.
     */
    setBufSortFormat(layoutBit: number): void {
        super.setBufSortFormat(layoutBit);
        this.srcMesh.setBufSortFormat(layoutBit);
    }
    initialize(boxesTotal: number = 1, idStep: number = 3, groupPsitions: Vector3D[] = null): void {
        
        let i: number = 0;
        let total: number = boxesTotal;
        let newBuild: boolean = (this.m_ivs == null);
        
        this.m_vs = this.srcMesh.getVS();
        this.m_uvs = this.srcMesh.getUVS();
        this.m_nvs = this.srcMesh.getNVS();
        this.m_ivs = this.srcMesh.getIVS();

        ROVertexBuffer.Reset();
        let stepSize: number = 24 * 4;
        
        let groupsTotal = groupPsitions != null ? groupPsitions.length : 1;
        let groupDataSize: number = stepSize * boxesTotal;        
        let fs: Float32Array = new Float32Array(groupDataSize * groupsTotal);
        
        let k0: number = 0;
        let k1: number = 0;
        let pos: Vector3D = groupPsitions != null ? groupPsitions[0] : new Vector3D();
        
        let vs: Float32Array = this.srcMesh.getVS();
        for(let j: number = 0; j < groupsTotal; ++j) {
            pos = groupPsitions != null ? groupPsitions[j] : new Vector3D();
            k0 = 0;
            k1 = j * groupDataSize;
            for (i = 0; i < 24; ++i) {
                fs[k1] = vs[k0] + pos.x;
                fs[k1 + 1] = vs[k0 + 1] + pos.y;
                fs[k1 + 2] = vs[k0 + 2] + pos.z;
                fs[k1 + 3] = 0;
                k0 += 3;
                k1 += 4;
            }
            k1 = j * groupDataSize;
            for (i = 1; i < total; ++i) {
                k0 = i * stepSize + k1;
                fs.copyWithin(k0, k1, k1 + stepSize);
            }
            let id: number = 0;
            k1 = j * groupDataSize;
            for (let k: number = 1; k < total; ++k) {
                k0 = stepSize * k + k1;
                id += idStep;
                for (i = 0; i < 24; ++i) {
                    fs[k0 + 3] = id;
                    k0 += 4;
                }
            }
        }

        this.m_vs = fs;

        if(this.bounds == null) {
            this.bounds = new AABB();
            this.bounds.addFloat32Arr(this.m_vs, 4);
            this.bounds.updateFast();
        }

        ROVertexBuffer.AddFloat32Data(this.m_vs, 4);

        total *= groupsTotal;

        if (this.isVBufEnabledAt(VtxBufConst.VBUF_UVS_INDEX)) {
            this.m_uvs = this.buildGroupData(this.srcMesh.getUVS(), total, 2);
        }

        if (this.isVBufEnabledAt(VtxBufConst.VBUF_NVS_INDEX)) {
            this.m_nvs = this.buildGroupData(this.srcMesh.getNVS(), total, 3);
        }
        if (this.isVBufEnabledAt(VtxBufConst.VBUF_CVS_INDEX)) {
            this.m_cvs = this.buildGroupData(this.srcMesh.getCVS(), total, 3);
        }
        
        ROVertexBuffer.vbWholeDataEnabled = this.vbWholeDataEnabled;
        if (newBuild) {
            this.m_ivs = GeometryMerger.MergeSameIvs(this.srcMesh.getIVS(), this.m_vs, 4, total);
            this.m_vbuf = ROVertexBuffer.CreateBySaveData(this.getBufDataUsage());
            this.m_vbuf.setIVSDataAt( this.crateROIvsData().setData(this.m_ivs) );
            this.vtCount = this.m_ivs.length;
            this.trisNumber = 12 * total;
            this.buildEnd();
        }
        else {
            ROVertexBuffer.UpdateBufData(this.m_vbuf);
        }
    }
    
    private buildGroupData(src: Float32Array, total: number, bufStep: number): Float32Array {
        let srcLength = src.length;
        let new_fs = new Float32Array(srcLength * total);
        for (let i: number = 0; i < total; ++i) {
            new_fs.set(src, 0);
            new_fs.copyWithin(i * srcLength, 0, srcLength);
        }
        ROVertexBuffer.AddFloat32Data(new_fs, bufStep);
        return new_fs;
    }
    __$destroy(): void {
        if (this.isResFree()) {
            this.bounds = null;
            this.srcMesh = null;
            this.m_vs = null;
            this.m_uvs = null;
            this.m_nvs = null;
            this.m_cvs = null;
            super.__$destroy();
        }
    }
}
export {IdGroupMesh};