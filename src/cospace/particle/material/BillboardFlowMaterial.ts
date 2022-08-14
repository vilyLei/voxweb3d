/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import { BillboardFlowDcr } from "./BillboardFlowDcr";

import { ICoRScene } from "../../voxengine/ICoRScene";
declare var CoRScene: ICoRScene;

class BillboardFlowMaterial {
	
    constructor() {
    }
	initialize(): void {
        let mb = CoRScene.getRendererScene().materialBlock;
        let drc = new BillboardFlowDcr();

        let material = mb.createMaterial(drc);
    }

}
export { BillboardFlowMaterial };
