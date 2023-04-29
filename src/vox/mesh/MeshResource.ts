/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2023 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import ROVertexBuffer from "../../vox/mesh/ROVertexBuffer";

export default class MeshResource
{
    /**
     * 放在帧循环中自动定时清理资源 system memory mesh data
     */
    static ClearTest():void
    {
        ROVertexBuffer.ClearTest();
    }
}