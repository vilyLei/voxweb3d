/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2023 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import VtxBufConst from "../../vox/mesh/VtxBufConst";
import VtxBufData from "../../vox/mesh/VtxBufData";
import ROVertexBuffer from "../../vox/mesh/ROVertexBuffer";
import AABB from "../../vox/geom/AABB";
import MeshBase from "../../vox/mesh/MeshBase";
import { RenderDrawMode } from "../../vox/render/RenderConst";
import SurfaceNormalCalc from "../../vox/geom/SurfaceNormalCalc";
import DivLog from "../../vox/utils/DivLog";

export default class DracoMesh extends MeshBase {
    
    constructor(bufDataUsage: number = VtxBufConst.VTX_STATIC_DRAW) {
        super(bufDataUsage);
    }
    private static s_dracoVtxTotal: number = 0;
    private static s_dracoTriTotal: number = 0;
    private m_vs: Float32Array = null;
    private m_uvs: Float32Array = null;
    private m_nvs: Float32Array = null;

    moduleScale: number = 1.0;

    getVS(): Float32Array { return this.m_vs; }
    getUVS(): Float32Array { return this.m_uvs; }
    getNVS(): Float32Array { return this.m_nvs; }
    
    initialize(list: any[], dataIsZxy: boolean = false): void {

        if(list != null) {

            let pmodule: any = list[0];
            
            let pvs: any = pmodule["position"];
            let puvs: any = pmodule["uv"];
            let pnvs: any = pmodule["normal"];
            let pivs: any = pmodule["indices"];
            
            pvs = pvs.subarray(1);
            puvs = puvs.subarray(1);
            
            if(pnvs == undefined) {
                console.warn("mesh origin normal is undefined.");
                pnvs = new Float32Array(pvs.length);
                SurfaceNormalCalc.ClacTrisNormal(pvs,pvs.length, pivs.length / 3, pivs, pnvs);
            }
            else {
                pnvs = pnvs.subarray(1);
            }
            this.m_vs = pvs;
            this.m_uvs = puvs;
            this.m_nvs = pnvs;
            this.m_ivs = pivs;

            if (this.bounds == null) this.bounds = new AABB();

            this.drawMode = RenderDrawMode.ELEMENTS_TRIANGLES;

            if (!this.isVBufEnabledAt(VtxBufConst.VBUF_UVS_INDEX)){
                console.warn("DracoMesh uvs apply failure.");
            }
            let bufData: VtxBufData = null;
            let arrtibuteTotal: number = 1;
            if (this.isVBufEnabledAt(VtxBufConst.VBUF_UVS_INDEX)){
                arrtibuteTotal++;
            }
            if (this.isVBufEnabledAt(VtxBufConst.VBUF_NVS_INDEX)){
                arrtibuteTotal++;
            }
            bufData = new VtxBufData( arrtibuteTotal );

            let listLen: number = list.length;
            //listLen = 29;
            let indexOffset: number = 0;
            let j: number = 0;
            let subLen: number = 0;
            //console.log(">>> 0, 2",list[0].gbuf.attributes["index"].length, list[2].gbuf.attributes["index"].length);
            for (let p: number = 0; p < listLen; ++p) {
                pmodule = list[p];
                let pvs: any = pmodule["position"];
                let puvs: any = pmodule["uv"];
                let pnvs: any = pmodule["normal"];
                let pivs: any = pmodule["indices"];
                
                pvs = pvs.subarray(1);
                puvs = puvs.subarray(1);
                
                if(pnvs == undefined) {
                    console.warn("mesh origin normal is undefined.");
                    pnvs = new Float32Array(pvs.length);
                    SurfaceNormalCalc.ClacTrisNormal(pvs,pvs.length, pivs.length / 3, pivs, pnvs);
                }
                else {
                    pnvs = pnvs.subarray(1);
                }
                
                subLen = pivs.length;
                this.bounds.addFloat32Arr(pvs);
                
                if (indexOffset > 0) {
                    for (j = 0; j < subLen; ++j) {
                        pivs[j] += indexOffset;
                    }
                }
                
                indexOffset += pvs.length / 3;
                bufData.addAttributeDataAt(0, pvs, 3);
                if (this.isVBufEnabledAt(VtxBufConst.VBUF_UVS_INDEX)){
                    bufData.addAttributeDataAt(1, puvs, 2);
                }
                if (this.isVBufEnabledAt(VtxBufConst.VBUF_NVS_INDEX)){
                    bufData.addAttributeDataAt(2, pnvs, 3);
                }
                bufData.addIndexData(pivs);
            }


            this.bounds.update();
            this.m_vbuf = ROVertexBuffer.CreateByBufDataSeparate(bufData, this.getBufDataUsage());
            this.vtCount = bufData.getIndexDataLengthTotal();
            this.vtxTotal = bufData.getVerticesTotal();
            this.trisNumber = bufData.getTrianglesTotal();

            DivLog.ShowLog("listLen: "+listLen+",this.trisNumber: "+this.trisNumber);

            DracoMesh.s_dracoVtxTotal += this.vtxTotal;
            DracoMesh.s_dracoTriTotal += this.trisNumber;
            console.log("vtCount: " + this.vtCount+", trisNumber: "+this.trisNumber);
            this.buildEnd();
            console.log("DracoMesh::initialize() draco vtCount: " + DracoMesh.s_dracoVtxTotal + ", draco trisNumber: "+ DracoMesh.s_dracoTriTotal);
        }
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
        this.bounds.addFloat32Arr(this.m_vs);
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
        this.m_vbuf.setIVSDataAt( this.crateROIvsData().setData(this.m_ivs) );
        this.vtCount = this.m_ivs.length;
        this.vtxTotal = this.vtCount / 3;
        this.trisNumber = this.vtCount / 3;
        this.drawMode = RenderDrawMode.ELEMENTS_TRIANGLES;

        this.buildEnd();
        console.log("DracoMesh::initialize2() draco this.vtxTotal: " + this.vtxTotal + ", draco trisNumber: "+ this.trisNumber);
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
