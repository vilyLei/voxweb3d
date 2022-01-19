/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import { IMaterialDecorator } from "./IMaterialDecorator";
import { UniformComp } from "../../vox/material/component/UniformComp";
import IRenderMaterial from "../render/IRenderMaterial";

interface IMaterial extends IRenderMaterial {
    
    vertUniform: UniformComp;
    setDecorator(decorator: IMaterialDecorator): void;
    getDecorator(): IMaterialDecorator;
}
export { IMaterial }