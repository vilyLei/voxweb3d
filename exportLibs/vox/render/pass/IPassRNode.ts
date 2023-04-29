/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2023 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

// import IRenderMaterial from "../IRenderMaterial";
import IPassProcess from "./IPassProcess";
import IPassRItem from "./IPassRItem";

export default interface IPassRNode {
    addItem(item: IPassRItem): IPassRNode;
    addChild(node: IPassRNode): IPassRNode;
    run(process: IPassProcess): void;
    enable(): IPassRNode;
    disable(): IPassRNode;
    isEnabled(): boolean;
    destroy(): void;
}
export {IPassRItem, IPassRNode}