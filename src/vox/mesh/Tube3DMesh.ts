/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import Vector3D from "../../vox/math/Vector3D";
import Matrix4 from "../../vox/math/Matrix4";
import SurfaceNormalCalc from "../../vox/geom/SurfaceNormalCalc";
import VtxBufConst from "../../vox/mesh/VtxBufConst";
import ROVertexBuffer from "../../vox/mesh/ROVertexBuffer";
import MeshBase from "../../vox/mesh/MeshBase";
import PipeGeometry from "../../voxmesh/geometry/primitive/PipeGeometry";

export default class Tube3DMesh extends MeshBase {
    constructor(bufDataUsage: number = VtxBufConst.VTX_STATIC_DRAW) {
        super(bufDataUsage);
    }

    private m_vs: Float32Array = null;
    private m_uvs: Float32Array = null;
    private m_nvs: Float32Array = null;
    private m_cvs: Float32Array = null;
    private m_boundsChanged: boolean = false;

    geometry: PipeGeometry = new PipeGeometry();
    uScale: number = 1.0;
    vScale: number = 1.0;
    getCircleCenterAt(i: number, outV: Vector3D): void {
        this.geometry.getCircleCenterAt(i, outV);
        this.m_boundsChanged = true;
    }
    transformCircleAt(i: number, mat4: Matrix4): void {
        this.geometry.transformCircleAt(i, mat4);
        this.m_boundsChanged = true;
    }
    getVS(): Float32Array { return this.m_vs; }
    getUVS(): Float32Array { return this.m_uvs; }
    getNVS(): Float32Array { return this.m_nvs; }
    getCVS(): Float32Array { return this.m_cvs; }
    getIVS(): Uint16Array | Uint32Array { return this.m_ivs; }

    initialize(radius: number, height: number, longitudeNumSegments: number, latitudeNumSegments: number, uvType: number = 1, alignYRatio: number = -0.5): void {
        if (this.m_vs == null) {
            this.geometry.initialize(radius, height, longitudeNumSegments, latitudeNumSegments, uvType, alignYRatio);
            this.m_vs = this.geometry.getVS();
            this.m_uvs = this.geometry.getUVS();
            this.m_ivs = this.geometry.getIVS();

            if (this.wireframe) {
                this.updateWireframeIvs();
            }
            this.bounds = this.geometry.bounds;

            this.vtCount = this.geometry.vtCount;
            this.trisNumber = this.geometry.trisNumber;
            this.vtxTotal = this.m_vs.length / 3;
        }
        this.initializeBuf(true);
    }

    reinitialize(): void {
        if (this.m_vs != null) {
            this.initializeBuf(false);
        }
    }
    private initializeBuf(newBuild: boolean): void {
        if (this.m_transMatrix != null) {
            this.m_boundsChanged = true;
            this.m_transMatrix.transformVectorsSelf(this.m_vs, this.m_vs.length);
        }
        if (this.m_boundsChanged) {
            this.bounds.reset();
            this.bounds.addXYZFloat32Arr(this.m_vs);
            this.bounds.updateFast();
        }
        this.m_boundsChanged = false;

        ROVertexBuffer.Reset();
        ROVertexBuffer.AddFloat32Data(this.m_vs, 3);
        if (this.isVBufEnabledAt(VtxBufConst.VBUF_UVS_INDEX)) {
            ROVertexBuffer.AddFloat32Data(this.m_uvs, 2);
        }
        if (this.isVBufEnabledAt(VtxBufConst.VBUF_NVS_INDEX)) {
            if (this.m_nvs == null) this.m_nvs = new Float32Array(this.vtxTotal * 3);
            SurfaceNormalCalc.ClacTrisNormal(this.m_vs, this.m_vs.length, this.trisNumber, this.m_ivs, this.m_nvs);
            ROVertexBuffer.AddFloat32Data(this.m_nvs, 3);
        }

        if (this.isVBufEnabledAt(VtxBufConst.VBUF_TVS_INDEX)) {
            let tvs: Float32Array = new Float32Array(this.m_vs.length);
            let btvs: Float32Array = new Float32Array(this.m_vs.length);
            SurfaceNormalCalc.ClacTrisTangent(this.m_vs, this.m_vs.length, this.m_uvs, this.m_nvs, this.trisNumber, this.m_ivs, tvs, btvs);
            ROVertexBuffer.AddFloat32Data(tvs, 3);
            ROVertexBuffer.AddFloat32Data(btvs, 3);
        }
        this.updateWireframeIvs();
        if (newBuild) {
            ROVertexBuffer.vbWholeDataEnabled = this.vbWholeDataEnabled;
            this.m_vbuf = ROVertexBuffer.CreateBySaveData(this.getBufDataUsage());
            this.m_vbuf.setUintIVSData(this.m_ivs);
            this.buildEnd();
        }
        else {
            if(this.forceUpdateIVS) {
                this.m_vbuf.setUintIVSData(this.m_ivs);
            }
            ROVertexBuffer.UpdateBufData(this.m_vbuf);
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
    toString(): string {
        return "Tube3DMesh()";
    }
}