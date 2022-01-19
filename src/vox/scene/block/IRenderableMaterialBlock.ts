/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import { IShaderLib } from "../../../vox/material/IShaderLib";
import { IMaterialPipeline } from "../../material/pipeline/IMaterialPipeline";
import { IMaterial } from "../../../vox/material/IMaterial";

interface IRenderableMaterialBlock {
    
    initialize(): void;
    createMaterial(): IMaterial;
    createMaterialPipeline(shaderLib: IShaderLib): IMaterialPipeline;
}

export { IRenderableMaterialBlock }