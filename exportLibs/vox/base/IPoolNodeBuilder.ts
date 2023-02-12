/***************************************************************************/
/*                                                                         */
/*  Copyright 2019-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import IPoolNode from "../../vox/base/IPoolNode";

export default interface IPoolNodeBuilder {
    getFreeId(): number;
    getNodeByUid(uid: number): IPoolNode;
    create(): IPoolNode;
    restore(pnode: IPoolNode): boolean;
    restoreByUid(uid: number): boolean;
}
