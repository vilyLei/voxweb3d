/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2023 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import { ISimpleMaterialDecorator } from "./ISimpleMaterialDecorator";
import { IUniformComp } from "../../vox/material/component/IUniformComp";
import IRenderMaterial from "../render/IRenderMaterial";

interface ISimpleMaterial extends IRenderMaterial {
    
    vertUniform: IUniformComp;
    setDecorator(decorator: ISimpleMaterialDecorator): void;
    getDecorator(): ISimpleMaterialDecorator;
    destroy(): void;
}
export { ISimpleMaterial }