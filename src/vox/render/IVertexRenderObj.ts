/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2023 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import { ROIndicesRes } from "./vtx/ROIndicesRes";
interface IVertexRenderObj {
    indicesRes: ROIndicesRes;
    getMid(): number;
    getVtxUid(): number;
    run(): void;
    restoreThis(): void;
    __$attachThis(): void;
    __$detachThis(): void;
}
export default IVertexRenderObj;