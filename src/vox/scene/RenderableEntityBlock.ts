/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import IRenderEntity from "../../vox/render/IRenderEntity";
import DisplayEntity from "../entity/DisplayEntity";
import RectPlaneMesh from "../mesh/RectPlaneMesh";
import { VtxBufRenderData } from "../mesh/VtxBufRenderData";

class RendererableEntityBlock {
    
    private m_initFlag: boolean = true;

    readonly unitXOYPlane: DisplayEntity = new DisplayEntity();

    constructor() {}

    initialize(): void {

        if(this.m_initFlag) {
            this.m_initFlag = false;

            let vtxData = new VtxBufRenderData();
            let planeMesh = new RectPlaneMesh();
            planeMesh.axisFlag = 0;
            planeMesh.setVtxBufRenderData( vtxData );
            planeMesh.initialize(-0.5, -0.5, 1.0, 1.0);
            this.unitXOYPlane.setMesh( planeMesh );
        }
    }
    createEntity(): IRenderEntity {
        return new DisplayEntity();
    }
}

export { RendererableEntityBlock }