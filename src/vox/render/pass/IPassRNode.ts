/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import IRenderMaterial from "../IRenderMaterial";

interface IPassRItem {
    material: IRenderMaterial;
    rst: any;
    run(func: () => void): void;
    isEnabled(): boolean;
}
export default interface IPassRNode {
    
    addChild(node: IPassRNode): void;
    run(func: () => void): void;
    isEnabled(): boolean;
    destroy(): void;
}
export {IPassRItem, IPassRNode}