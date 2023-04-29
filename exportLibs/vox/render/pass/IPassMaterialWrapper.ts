/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2023 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import IRenderMaterial from "../IRenderMaterial";
export default interface IPassMaterialWrapper {
    bindMaterial(m: IRenderMaterial): void;
    destroy(): void;
}