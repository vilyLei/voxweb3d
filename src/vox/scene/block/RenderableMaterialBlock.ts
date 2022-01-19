/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import { IShaderLib } from "../../../vox/material/IShaderLib";
import { IMaterialPipeline } from "../../material/pipeline/IMaterialPipeline";
import { MaterialPipeline } from "../../material/pipeline/MaterialPipeline";
import { IMaterial } from "../../../vox/material/IMaterial";
import { Material } from "../../material/Material";
import { IRenderableMaterialBlock } from "./IRenderableMaterialBlock";

class RenderableMaterialBlock implements IRenderableMaterialBlock {
    
    private m_initFlag: boolean = true;

    constructor() {}

    initialize(): void {

        if(this.m_initFlag) {
            this.m_initFlag = false;

        }
    }
    
    createMaterial(): IMaterial {
        return new Material();
    }
    createMaterialPipeline(shaderLib: IShaderLib): IMaterialPipeline {
        return new MaterialPipeline( shaderLib );
    }
}

export { RenderableMaterialBlock }