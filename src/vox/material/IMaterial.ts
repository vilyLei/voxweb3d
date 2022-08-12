/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import { IMaterialDecorator } from "./IMaterialDecorator";
import IRenderMaterial from "../render/IRenderMaterial";

interface IMaterial extends IRenderMaterial {
    
    setDecorator(decorator: IMaterialDecorator): void;
    getDecorator(): IMaterialDecorator;
    destroy(): void;
}
export { IMaterial }