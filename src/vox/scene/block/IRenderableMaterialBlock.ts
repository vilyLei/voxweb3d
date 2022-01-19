/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import { IShaderLib } from "../../../vox/material/IShaderLib";
import { IMaterialPipeline } from "../../material/pipeline/IMaterialPipeline";
import { IMaterial } from "../../../vox/material/IMaterial";
import { IMaterialDecorator } from "../../../vox/material/IMaterialDecorator";

interface IRenderableMaterialBlock {
    
    initialize(): void;
    createMaterial(decorator: IMaterialDecorator): IMaterial;
    createMaterialPipeline(shaderLib: IShaderLib): IMaterialPipeline;
}

export { IRenderableMaterialBlock }