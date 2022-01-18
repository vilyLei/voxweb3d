/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import IRenderEntity from "../../vox/render/IRenderEntity";
import DisplayEntity from "../entity/DisplayEntity";
import Vector3D from "../math/Vector3D";
import Box3DMesh from "../mesh/Box3DMesh";
import RectPlaneMesh from "../mesh/RectPlaneMesh";
import { VtxBufRenderData } from "../mesh/VtxBufRenderData";
import { IRenderableEntityBlock } from "./IRenderableEntityBlock";

class RendererableEntityBlock implements IRenderableEntityBlock {
    
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
            
            let planeMesh = new RectPlaneMesh();
            planeMesh.axisFlag = 0;
            planeMesh.setVtxBufRenderData( vtxData );
            planeMesh.initialize(-1.0, -1.0, 2.0, 2.0);
            this.screenPlane.setMesh( planeMesh );

            planeMesh = new RectPlaneMesh();
            planeMesh.axisFlag = 0;
            planeMesh.setVtxBufRenderData( vtxData );
            planeMesh.initialize(-0.5, -0.5, 1.0, 1.0);
            this.unitXOYPlane.setMesh( planeMesh );

            planeMesh = new RectPlaneMesh();
            planeMesh.axisFlag = 1;
            planeMesh.setVtxBufRenderData( vtxData );
            planeMesh.initialize(-0.5, -0.5, 1.0, 1.0);
            this.unitXOZPlane.setMesh( planeMesh );

            let boxMesh = new Box3DMesh();
            boxMesh.setVtxBufRenderData( vtxData );
            boxMesh.initialize(new Vector3D(-0.5, -0.5, -0.5), new Vector3D(0.5, 0.5, 0.5));
            this.unitBox.setMesh( boxMesh );

        }
    }
    createEntity(): IRenderEntity {
        return new DisplayEntity();
    }
}

export { RendererableEntityBlock }