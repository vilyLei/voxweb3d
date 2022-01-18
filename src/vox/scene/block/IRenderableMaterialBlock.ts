/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import { IShaderLib } from "../../../vox/material/IShaderLib";
import { IMaterialPipeline } from "../../material/pipeline/IMaterialPipeline";
import IRenderMaterial from "../../../vox/render/IRenderMaterial";

interface IRenderableMaterialBlock {
    
    initialize(): void;
    createMaterial(): IRenderMaterial;
    createMaterialPipeline(shaderLib: IShaderLib): IMaterialPipeline;
}

export { IRenderableMaterialBlock }