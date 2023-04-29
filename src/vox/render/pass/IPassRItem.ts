/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2023 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import IRenderMaterial from "../IRenderMaterial";
import IPassProcess from "./IPassProcess";

export default interface IPassRItem {
    material: IRenderMaterial;
    rst: any;
    initialize(): void;
    run(process: IPassProcess): void;
    enable(): IPassRItem;
    disable(): IPassRItem;
    isEnabled(): boolean;
    destroy(): void;
}