/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import { ISimpleMaterialDecorator } from "./ISimpleMaterialDecorator";
import { UniformComp } from "../../vox/material/component/UniformComp";
import IRenderMaterial from "../render/IRenderMaterial";

interface ISimpleMaterial extends IRenderMaterial {
    
    vertUniform: UniformComp;
    setDecorator(decorator: ISimpleMaterialDecorator): void;
    getDecorator(): ISimpleMaterialDecorator;
    destroy(): void;
}
export { ISimpleMaterial }