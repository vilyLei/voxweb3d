/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import * as RenderProxyT from "../../vox/render/RenderProxy";
import * as VertexRenderObjT from "../../vox/mesh/VertexRenderObj";
import * as ROVertexBufferT from "../../vox/mesh/ROVertexBuffer";

import RenderProxy = RenderProxyT.vox.render.RenderProxy;
import VertexRenderObj = VertexRenderObjT.vox.mesh.VertexRenderObj;
import ROVertexBuffer = ROVertexBufferT.vox.mesh.ROVertexBuffer;

export namespace vox
{
    export namespace render
    {
        export class RenderMeshProxy
        {
            private m_rc:RenderProxy = null;
            
            setRenderProxy(rc:RenderProxy):void
            {
                this.m_rc = rc;
            }
            reset():void
            {
                VertexRenderObj.RenderBegin();
                ROVertexBuffer.RenderBegin(this.m_rc);
            }
            toString():string
            {
                return "[RenderMeshProxy()]";
            }
        }

    }
}
