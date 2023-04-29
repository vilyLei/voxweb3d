/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2023 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import { IShaderLib } from "../../../vox/material/IShaderLib";
import { IMaterialPipeline } from "../../material/pipeline/IMaterialPipeline";
import { MaterialPipeline } from "../../material/pipeline/MaterialPipeline";
import { IRenderableMaterialBlock } from "./IRenderableMaterialBlock";
import { IMaterialDecorator } from "../../../vox/material/IMaterialDecorator";
import { ISimpleMaterialDecorator } from "../../../vox/material/ISimpleMaterialDecorator";
import { ISimpleMaterial } from "../../../vox/material/ISimpleMaterial";
import { SimpleMaterial } from "../../material/SimpleMaterial";
import { IMaterial } from "../../../vox/material/IMaterial";
import { Material } from "../../material/Material";

class RenderableMaterialBlock implements IRenderableMaterialBlock {
    
    private m_initFlag: boolean = true;

    constructor() {}

    initialize(): void {

        if(this.m_initFlag) {
            this.m_initFlag = false;

        }
    }
    
    createMaterial(decorator: IMaterialDecorator): IMaterial {
        let m = new Material();
        m.setDecorator( decorator );
        return m;
    }
    createSimpleMaterial(decorator: ISimpleMaterialDecorator): ISimpleMaterial {
        let m = new SimpleMaterial();
        m.setDecorator( decorator );
        return m;
    }
    createMaterialPipeline(shaderLib: IShaderLib): IMaterialPipeline {
        return new MaterialPipeline( shaderLib );
    }
}

export { RenderableMaterialBlock }