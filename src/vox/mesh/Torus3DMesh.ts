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

export default class Torus3DMesh extends MeshBase {
    constructor(bufDataUsage: number = VtxBufConst.VTX_STATIC_DRAW) {
        super(bufDataUsage);
    }

    private m_vs: Float32Array = null;
    private m_uvs: Float32Array = null;
    private m_nvs: Float32Array = null;
    private m_cvs: Float32Array = null;
    private m_boundsChanged: boolean = false;

    readonly geometry = new PipeGeometry();
    uScale = 1.0;
    vScale = 1.0;
    /**
     * axisType = 0 is XOY plane,
     * axisType = 1 is XOZ plane,
     * axisType = 2 is YOZ plane
     */
    axisType = 0;

    getCircleCenterAt(i: number, outV: Vector3D): void {
        this.geometry.getCenterAt(i, outV);
        this.m_boundsChanged = true;
    }
    transformCircleAt(i: number, mat4: Matrix4): void {
        this.geometry.transformAt(i, mat4);
        this.m_boundsChanged = true;
    }
    getVS(): Float32Array { return this.m_vs; }
    getUVS(): Float32Array { return this.m_uvs; }
    getNVS(): Float32Array { return this.m_nvs; }
    getCVS(): Float32Array { return this.m_cvs; }
    getIVS(): Uint16Array | Uint32Array { return this.m_ivs; }

    initialize(ringRadius: number, axisRadius: number, longitudeNumSegments: number, latitudeNumSegments: number, uvType: number = 1, alignYRatio: number = -0.5): void {

        if (this.m_vs == null) {

            let g = this.geometry;
            switch (this.axisType) {
                case 1:
                    g.axisType = 2;
                    break;
                case 2:
                    g.axisType = 0;
                    break;
                default:
                    g.axisType = 1;
                    break;
            }
            g.initialize(axisRadius, 0.0, longitudeNumSegments, latitudeNumSegments, uvType, alignYRatio);

            let nvFlag = this.isVBufEnabledAt(VtxBufConst.VBUF_NVS_INDEX);
            let vs = this.geometry.getVS();
            let uvs = this.geometry.getUVS();
            let ivs = this.geometry.getIVS();

            if (nvFlag) {
                this.m_nvs = new Float32Array(vs.length);
            }
            let nvs = this.m_nvs;

            let pi2 = 2.0 * Math.PI;
            let rad = 0.0;
            let pv = new Vector3D();
            let nv = new Vector3D();
            let mat4 = new Matrix4();
            for (let i = 0; i <= latitudeNumSegments; ++i) {

                mat4.identity();
                rad = pi2 * i / latitudeNumSegments;
                switch (this.axisType) {
                    case 1:
                        pv.x = Math.cos(rad) * ringRadius;
                        pv.z = Math.sin(rad) * ringRadius;
                        mat4.rotationY(-rad);
                        break;
                    case 2:
                        pv.y = Math.cos(rad) * ringRadius;
                        pv.x = Math.sin(rad) * ringRadius;
                        mat4.rotationZ(-rad);
                        break;
                    default:
                        pv.z = Math.cos(rad) * ringRadius;
                        pv.y = Math.sin(rad) * ringRadius;
                        mat4.rotationX(-rad);
                        break;
                }

                mat4.setTranslation(pv);
                g.transformAt(i, mat4);
                if (nvFlag) {
                    let cv = pv;
                    let range = g.getRangeAt(i);
                    let pvs = vs.subarray(range[0], range[1]);
                    let pnvs = nvs.subarray(range[0], range[1]);
                    let tot = pvs.length / 3;
                    let k = 0;
                    for (let j = 0; j < tot; ++j) {
                        k = j * 3;
                        nv.setXYZ(pvs[k], pvs[k + 1], pvs[k + 2]);
                        nv.subtractBy(cv);
                        nv.normalize();
                        pnvs[k] = nv.x;
                        pnvs[k + 1] = nv.y;
                        pnvs[k + 2] = nv.z;
                    }
                }
            }
            this.m_vs = vs;
            this.m_uvs = uvs;
            this.m_ivs = ivs;
            this.bounds = this.geometry.bounds;
            this.bounds.reset();
            this.bounds.addFloat32Arr(this.m_vs);
            this.bounds.update();

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
            this.bounds.addFloat32Arr(this.m_vs);
            this.bounds.updateFast();
        }
        this.m_boundsChanged = false;

        ROVertexBuffer.Reset();
        ROVertexBuffer.AddFloat32Data(this.m_vs, 3);
        if (this.isVBufEnabledAt(VtxBufConst.VBUF_UVS_INDEX)) {
            ROVertexBuffer.AddFloat32Data(this.m_uvs, 2);
        }
        if (this.isVBufEnabledAt(VtxBufConst.VBUF_NVS_INDEX)) {
            ROVertexBuffer.AddFloat32Data(this.m_nvs, 3);
        }

        if (this.isVBufEnabledAt(VtxBufConst.VBUF_TVS_INDEX)) {
            let tvs: Float32Array = new Float32Array(this.m_vs.length);
            let btvs: Float32Array = new Float32Array(this.m_vs.length);
            SurfaceNormalCalc.ClacTrisTangent(this.m_vs, this.m_vs.length, this.m_uvs, this.m_nvs, this.trisNumber, this.m_ivs, tvs, btvs);
            ROVertexBuffer.AddFloat32Data(tvs, 3);
            ROVertexBuffer.AddFloat32Data(btvs, 3);
        }
        
        if (newBuild) {
            ROVertexBuffer.vbWholeDataEnabled = this.vbWholeDataEnabled;
            this.m_vbuf = ROVertexBuffer.CreateBySaveData(this.getBufDataUsage());
            this.m_vbuf.setIVSDataAt( this.crateROIvsData().setData(this.m_ivs) );
            this.buildEnd();
        }
        else {
            if (this.forceUpdateIVS) {
                this.m_vbuf.setIVSDataAt( this.crateROIvsData().setData(this.m_ivs) );
            }
            //setIVSDataAt( this.crateROIvsData().setData(this.m_ivs) );
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
}