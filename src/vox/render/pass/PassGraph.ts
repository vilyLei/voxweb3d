/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import IPassRNode from "./IPassRNode";
import IPassGraph from "./IPassGraph";
export default class PassGraph implements IPassGraph {
    constructor(){}
    addNode(node: IPassRNode): void {
    }
    initialize(): void {
    }
    destroy(): void {
    }
}
export { PassGraph }