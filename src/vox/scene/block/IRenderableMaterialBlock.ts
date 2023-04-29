/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2023 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import { IShaderLib } from "../../../vox/material/IShaderLib";
import { IMaterialPipeline } from "../../material/pipeline/IMaterialPipeline";
import { IMaterialDecorator } from "../../../vox/material/IMaterialDecorator";
import { ISimpleMaterialDecorator } from "../../../vox/material/ISimpleMaterialDecorator";
import { ISimpleMaterial } from "../../../vox/material/ISimpleMaterial";
import { IMaterial } from "../../../vox/material/IMaterial";

interface IRenderableMaterialBlock {
    
    initialize(): void;
    createMaterial(decorator: IMaterialDecorator): IMaterial;
    createSimpleMaterial(decorator: ISimpleMaterialDecorator): ISimpleMaterial;
    createMaterialPipeline(shaderLib: IShaderLib): IMaterialPipeline;
}

export { IRenderableMaterialBlock }