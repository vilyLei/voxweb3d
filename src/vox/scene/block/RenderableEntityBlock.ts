/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

// import VtxBufConst from "../../../vox/mesh/VtxBufConst";
import IRenderEntity from "../../../vox/render/IRenderEntity";
import DisplayEntity from "../../../vox/entity/DisplayEntity";
// import Vector3D from "../../../vox/math/Vector3D";
// import Box3DMesh from "../../../vox/mesh/Box3DMesh";
// import RectPlaneMesh from "../../../vox/mesh/RectPlaneMesh";
import { VtxBufRenderData } from "../../../vox/mesh/VtxBufRenderData";
import { IRenderableEntityBlock } from "./IRenderableEntityBlock";
import { IDataMesh } from "../../mesh/IDataMesh";
import DataMesh from "../../mesh/DataMesh";

class RenderableEntityBlock implements IRenderableEntityBlock {
    
    private m_initFlag: boolean = true;

    readonly screenPlane: DisplayEntity = new DisplayEntity();
    readonly unitXOYPlane: DisplayEntity = new DisplayEntity();
    readonly unitXOZPlane: DisplayEntity = new DisplayEntity();
    readonly unitBox: DisplayEntity = new DisplayEntity();

    constructor() {}

    initialize(): void {

        if(this.m_initFlag) {
            this.m_initFlag = false;

            let vtxData = new VtxBufRenderData();

            
            let vs = new Float32Array([1, -1, 1, 1, -1, -1, -1, -1, -1, -1, -1, 1, 1, 1, 1, 1, 1, -1, -1, 1, -1, -1, 1, 1, 1, 1, 1, 1, 1, -1, 1, -1, -1, 1, -1, 1, 1, 1, -1, -1, 1, -1, -1, -1, -1, 1, -1, -1, -1, 1, 1, -1, 1, -1, -1, -1, -1, -1, -1, 1, 1, 1, 1, -1, 1, 1, -1, -1, 1, 1, -1, 1]);
            for(let i = 0; i < vs.length; ++i){vs[i] *= 0.5;}
            let uvs = new Float32Array([0, 0, 1, 0, 1, 1, 0, 1, 0, 0, 1, 0, 1, 1, 0, 1, 0, 0, 1, 0, 1, 1, 0, 1, 0, 0, 1, 0, 1, 1, 0, 1, 0, 0, 1, 0, 1, 1, 0, 1, 0, 0, 1, 0, 1, 1, 0, 1]);
            let nvs = new Float32Array([0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1]);
            let ivs = new Uint16Array([3, 2, 1, 3, 1, 0, 6, 7, 4, 6, 4, 5, 11, 10, 9, 11, 9, 8, 15, 14, 13, 15, 13, 12, 18, 19, 16, 18, 16, 17, 22, 23, 20, 22, 20, 21]);
            
            let dm = new DataMesh();
            dm.setVS( vs ).setUVS( uvs ).setNVS( nvs ).setIVS( ivs ).setVtxBufRenderData( vtxData );
            // dm.setUVS( uvs );
            // dm.setNVS( nvs );
            // dm.setIVS( ivs );
            // dm.setVtxBufRenderData( vtxData );
            dm.vbWholeDataEnabled = true;
            dm.initialize();
            this.unitBox.setMesh( dm );
            
            // let planeMesh: RectPlaneMesh;

            // planeMesh = new RectPlaneMesh();
            // planeMesh.axisFlag = 0;
            // planeMesh.setVtxBufRenderData( vtxData );
            // planeMesh.initialize(-1, -1, 2.0, 2.0);
            // this.screenPlane.setMesh( planeMesh );
            
            vs = new Float32Array([-1, -1, 0, 1, -1, 0, 1, 1, 0, -1, 1, 0]);
            uvs = new Float32Array([0, 0, 1, 0, 1, 1, 0, 1]);
            nvs = new Float32Array([0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1]);            
            ivs = new Uint16Array([0, 1, 2, 0, 2, 3]);

            dm = new DataMesh();
            dm.setVS( vs ).setUVS( uvs ).setNVS( nvs ).setIVS( ivs ).setVtxBufRenderData( vtxData );
            dm.vbWholeDataEnabled = true;
            dm.initialize();
            this.screenPlane.setMesh( dm );
            
            


            // planeMesh = new RectPlaneMesh();
            // planeMesh.axisFlag = 0;
            // planeMesh.setVtxBufRenderData( vtxData );
            // planeMesh.initialize(-0.5, -0.5, 1.0, 1.0);
            // this.unitXOYPlane.setMesh( planeMesh );
            

            // vs = new Float32Array([-0.5, -0.5, 0, 0.5, -0.5, 0, 0.5, 0.5, 0, -0.5, 0.5, 0]);
            // uvs = new Float32Array([]);
            // nvs = new Float32Array([]);
            // ivs = new Uint16Array([]);

            for(let i = 0; i < vs.length; ++i){vs[i] *= 0.5;}
            dm = new DataMesh();
            dm.setVS( vs ).setUVS( uvs ).setNVS( nvs ).setIVS( ivs ).setVtxBufRenderData( vtxData );
            dm.vbWholeDataEnabled = true;
            dm.initialize();
            this.unitXOYPlane.setMesh( dm );


            // planeMesh = new RectPlaneMesh();
            // planeMesh.axisFlag = 1;
            // planeMesh.setVtxBufRenderData( vtxData );
            // planeMesh.initialize(-0.5, -0.5, 1.0, 1.0);
            // this.unitXOZPlane.setMesh( planeMesh );

            
            // console.log("----------------------------------");
            // console.log(planeMesh.getVS());
            // console.log(planeMesh.getUVS());
            // console.log(planeMesh.getNVS());
            // console.log(planeMesh.getIVS());

            vs = new Float32Array([0.5, 0, -0.5, -0.5, 0, -0.5, -0.5, 0, 0.5, 0.5, 0, 0.5]);
            // uvs = new Float32Array([0, 0, 1, 0, 1, 1, 0, 1]);
            nvs = new Float32Array([0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0]);
            // ivs = new Uint16Array([0, 1, 2, 0, 2, 3]);
            dm = new DataMesh();
            dm.setVS( vs ).setUVS( uvs ).setNVS( nvs ).setIVS( ivs ).setVtxBufRenderData( vtxData );
            dm.vbWholeDataEnabled = true;
            dm.initialize();
            this.unitXOZPlane.setMesh( dm );
        }
    }
    createEntity(): IRenderEntity {
        return new DisplayEntity();
    }
    createMesh(): IDataMesh {
        return new DataMesh();
    }
}

export { RenderableEntityBlock }