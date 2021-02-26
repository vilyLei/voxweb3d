/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import * as ROVertexBufferT from "../../vox/mesh/ROVertexBuffer";

import ROVertexBuffer = ROVertexBufferT.vox.mesh.ROVertexBuffer;

export namespace vox
{
    export namespace mesh
    {
        export class MeshResource
        {
            /**
             * 放在帧循环中自动定时清理资源 system memory mesh data
             */
            static ClearTest():void
            {
                ROVertexBuffer.ClearTest();
            }
        }
    }
}
