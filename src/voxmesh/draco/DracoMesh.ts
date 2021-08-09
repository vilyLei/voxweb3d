/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import VtxBufConst from "../../vox/mesh/VtxBufConst";
import VtxBufData from "../../vox/mesh/VtxBufData";
import ROVertexBuffer from "../../vox/mesh/ROVertexBuffer";
import AABB from "../../vox/geom/AABB";
import MeshBase from "../../vox/mesh/MeshBase";
import { RenderDrawMode } from "../../vox/render/RenderConst";

export default class DracoMesh extends MeshBase {
    constructor(bufDataUsage: number = VtxBufConst.VTX_STATIC_DRAW) {
        super(bufDataUsage);
    }
    moduleScale: number = 1.0;
    private m_vs: Float32Array = null;
    private m_uvs: Float32Array = null;
    private m_nvs: Float32Array = null;
    //
    getVS(): Float32Array { return this.m_vs; }
    getUVS(): Float32Array { return this.m_uvs; }
    getNVS(): Float32Array { return this.m_nvs; }
    initialize(list: any[], dataIsZxy: boolean = false): void {
        let module: any = list[0];
        this.m_vs = (module["position"]);
        this.m_uvs = (module["uv"]);
        this.m_nvs = (module["normal"]);
        this.m_ivs = (module["indices"]);
        if (this.bounds == null) this.bounds = new AABB();

        //this.vtCount = this.m_ivs.length;
        //this.vtxTotal = this.vtCount / 3;
        //this.trisNumber = this.m_vs.length / 3;
        this.drawMode = RenderDrawMode.ELEMENTS_TRIANGLES;

        let bufData: VtxBufData = new VtxBufData(3);

        let listLen: number = list.length;
        //listLen = 29;
        let indexOffset: number = 0;
        let j: number = 0;
        let subLen: number = 0;
        //console.log(">>> 0, 2",list[0].gbuf.attributes["index"].length, list[2].gbuf.attributes["index"].length);
        for (let p: number = 0; p < listLen; ++p) {
            module = list[p];
            let pvs: any = module["position"];
            let puvs: any = module["uv"];
            let pnvs: any = module["normal"];
            let pivs: any = module["indices"];

            
            pvs = pvs.subarray(1);
            puvs = puvs.subarray(1);
            pnvs = pnvs.subarray(1);

            subLen = pivs.length;
            this.bounds.addXYZFloat32Arr(pvs);
            //console.log("p: "+p,indexOffset,",subLen: "+subLen);
            //console.log(indexOffset,",A pivs: \n",pivs);
            if (indexOffset > 0) {
                for (j = 0; j < subLen; ++j) {
                    pivs[j] += indexOffset;
                }
            }
            //console.log("B pivs: \n",pivs);
            indexOffset += pvs.length / 3;
            bufData.addAttributeDataAt(0, pvs, 3);
            bufData.addAttributeDataAt(1, puvs, 2);
            bufData.addAttributeDataAt(2, pnvs, 3);
            bufData.addIndexData(pivs);
        }

        this.bounds.update();
        this.m_vbuf = ROVertexBuffer.CreateByBufDataSeparate(bufData, this.getBufDataUsage());
        this.vtCount = bufData.getIndexDataLengthTotal();
        this.vtxTotal = bufData.getVerticesTotal();
        this.trisNumber = bufData.getTrianglesTotal();

        console.log("vtCount: " + this.vtCount+", trisNumber: "+this.trisNumber);
        this.buildEnd();
    }

    initialize2(gbuf: any, dataIsZxy: boolean = false): void {
        let attri: any = gbuf.attributes;
        this.m_vs = (attri["position"]);
        //this.m_vs = new Float32Array([-10,10,20, -10,-10,20, 10,10,20, -10,-10,20, 10,-10,20, 10,10,20]);
        //this.m_vs = new Float32Array([-10,-10,20, 10,-10,20, 10,10,20, -10,10,20]);
        //console.log("\n vs length: \n"+this.m_vs.length);
        this.m_uvs = (attri["uv"]);
        this.m_nvs = (attri["normal"]);
        //  this.m_uvs = new Float32Array([-10,10, 20, -10, -10,20, -10,10, 20, -10, -10,20]);
        //  this.m_uvs = new Float32Array([-10,10, 20,-10, -10,20, -10,10]);
        //console.log("uvs length: \n"+this.m_uvs.length);
        //this.m_ivs = new Uint16Array(gbuf["index"]);
        this.m_ivs = (gbuf["index"]);
        //this.m_ivs = new Uint16Array([0,2,3,0,1,2]);
        //this.m_vs = new Float32Array([-10,-10,20, 10,-10,20, 10,10,20, -10,10,20]);
        if (this.bounds == null) this.bounds = new AABB();
        this.bounds.addXYZFloat32Arr(this.m_vs);
        this.bounds.updateFast();
        //console.log("this.bounds: "+this.bounds.toString());

        ROVertexBuffer.Reset();
        ROVertexBuffer.AddFloat32Data(this.m_vs, 3);
        ROVertexBuffer.AddFloat32Data(this.m_uvs, 2);
        ROVertexBuffer.AddFloat32Data(this.m_nvs, 3);

        ROVertexBuffer.vbWholeDataEnabled = this.vbWholeDataEnabled;
        //
        //this.m_vbuf = ROVertexBuffer.CreateBySaveData(this.getBufDataUsage());
        this.m_vbuf = ROVertexBuffer.CreateBySaveDataSeparate(this.getBufDataUsage());
        this.m_vbuf.setUintIVSData(this.m_ivs);
        this.vtCount = this.m_ivs.length;
        this.vtxTotal = this.vtCount / 3;
        this.trisNumber = this.vtCount / 3;
        this.drawMode = RenderDrawMode.ELEMENTS_TRIANGLES;

        this.buildEnd();
    }
    toString(): string {
        return "DracoMesh()";
    }
    __$destroy(): void {
        if (this.isResFree()) {
            this.bounds = null;

            this.m_vs = null;
            this.m_uvs = null;
            this.m_nvs = null;
            super.__$destroy();
        }
    }
}
