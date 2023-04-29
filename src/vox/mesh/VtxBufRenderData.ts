/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2023 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import { IVtxBufRenderData } from "../../vox/render/IVtxBufRenderData";

class VtxBufRenderData implements IVtxBufRenderData {
    constructor() { }

    getBufSortFormat(): number {
        return 0x7;
    }
    getBufTypeList(): number[] {
        return [1, 2, 3];
    }
    getBufSizeList(): number[] {
        return [3, 2, 3];
    }
}
export { VtxBufRenderData }