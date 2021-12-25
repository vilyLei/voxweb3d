/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import MathConst from "../../vox/math/MathConst";
import Vector3D from "../../vox/math/Vector3D";
import AABB from "../../vox/geom/AABB";
import SurfaceNormalCalc from "../../vox/geom/SurfaceNormalCalc";
import VtxBufConst from "../../vox/mesh/VtxBufConst";
import ROVertexBuffer from "../../vox/mesh/ROVertexBuffer";
import { VtxNormalType } from "../../vox/mesh/VtxBufConst";
import MeshBase from "../../vox/mesh/MeshBase";
import Box3DMesh from "../../vox/mesh/Box3DMesh";

export default class IdBoxGroupMesh extends MeshBase {
    private m_posList: number[][] = [null, null, null, null, null, null, null, null];

    boxMesh: Box3DMesh = null;
    constructor(bufDataUsage: number = VtxBufConst.VTX_STATIC_DRAW) {
        super(bufDataUsage);
    }
    normalType: number = VtxNormalType.FLAT;

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
        this.boxMesh.setBufSortFormat(layoutBit);
    }
    initialize(total: number = 1, idStep: number = 3): void {
        this.setBufSortFormat
        this.vtxTotal = 24;
        //
        let i: number = 0;
        let baseI: number = 0;
        let k: number = 0;

        let newBuild: boolean = (this.m_ivs == null);
        



        this.m_vs = this.boxMesh.getVS();
        this.m_uvs = this.boxMesh.getUVS();
        this.m_nvs = this.boxMesh.getNVS();
        this.m_ivs = this.boxMesh.getIVS();

        ROVertexBuffer.Reset();
        let stepSize: number = 24 * 4;
        let size: number = stepSize * total;
        let base_fs: Float32Array = new Float32Array(size);
        
        let k0: number = 0;
        let k1: number = 0;
        for (i = 0; i < 24; ++i) {
            base_fs[k1] = this.m_vs[k0];
            base_fs[k1 + 1] = this.m_vs[k0 + 1];
            base_fs[k1 + 2] = this.m_vs[k0 + 2];
            base_fs[k1 + 3] = 0;
            k0 += 3;
            k1 += 4;
        }
        for (i = 1; i < total; ++i) {
            base_fs.copyWithin(i * stepSize, 0, stepSize);
        }
        let id: number = 0;
        for (k0 = 1; k0 < total; ++k0) {
            k1 = stepSize * k0;
            id += idStep;
            for (i = 0; i < 24; ++i) {
                base_fs[k1 + 3] = id;
                k1 += 4;
            }
        }
        this.m_vs = base_fs;

        if(this.bounds == null) {
            this.bounds = new AABB();
            this.bounds.addXYZFloat32Arr(this.m_vs, 4);
            this.bounds.updateFast();
        }

        ROVertexBuffer.AddFloat32Data(this.m_vs, 4);

        if (this.isVBufEnabledAt(VtxBufConst.VBUF_UVS_INDEX)) {
            this.m_uvs = this.buildGroupData(this.boxMesh.getUVS(), total, 2);
        }

        if (this.isVBufEnabledAt(VtxBufConst.VBUF_NVS_INDEX)) {
            
            this.m_nvs = this.buildGroupData(this.boxMesh.getNVS(), total, 3);
        }
        if (this.isVBufEnabledAt(VtxBufConst.VBUF_CVS_INDEX)) {
            this.m_cvs = this.buildGroupData(this.boxMesh.getCVS(), total, 3);
        }
        
        ROVertexBuffer.vbWholeDataEnabled = this.vbWholeDataEnabled;
        if (newBuild) {
            stepSize = this.m_ivs.length;
            let base_ivs: Uint16Array = new Uint16Array(stepSize * total);
            base_ivs.set(this.m_ivs, 0);
            let ivsStep: number = 24;
            for (k0 = 1; k0 < total; ++k0) {
                ivsStep = k0 * 24;
                i = stepSize * k0;
                base_ivs.set(this.m_ivs, i);
                k1 = i + stepSize;
                for (; i < k1; ++i) {
                    base_ivs[i] += ivsStep;
                }
            }
            this.m_ivs = base_ivs;
            this.m_vbuf = ROVertexBuffer.CreateBySaveData(this.getBufDataUsage());
            this.m_vbuf.setUint16IVSData(this.m_ivs);
            this.vtCount = this.m_ivs.length;
            this.trisNumber = 12 * total;
            this.buildEnd();
        }
        else {
            ROVertexBuffer.UpdateBufData(this.m_vbuf);
        }
    }
    
    private buildGroupData(src: Float32Array, total: number, bufStep: number): Float32Array {
        let srcLength = this.m_uvs.length;
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
            this.boxMesh = null;
            this.m_vs = null;
            this.m_uvs = null;
            this.m_nvs = null;
            this.m_cvs = null;
            super.__$destroy();
        }
    }
}