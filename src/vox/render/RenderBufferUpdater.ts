/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import * as RenderProxyT from "../../vox/render/RenderProxy"
import * as IRenderBufferT from "../../vox/render/IRenderBuffer";

import RenderProxy = RenderProxyT.vox.render.RenderProxy;
import IRenderBuffer = IRenderBufferT.vox.render.IRenderBuffer;
export namespace vox
{
    export namespace render
    {
        export class RenderBufferUpdater
        {
            private m_bufs:IRenderBuffer[] = [];
            private constructor()
            {
            }
            __$addBuf(buf:IRenderBuffer):void
            {
                if(buf.__$getUpdateStatus() < 1)
                {
                    buf.__$setUpdateStatus(1);
                    this.m_bufs.push(buf);
                }
            }
            __$update(rc:RenderProxy):void
            {
                let len:number = this.m_bufs.length;
                if(len > 0)
                {
                    let bufs:IRenderBuffer[] = this.m_bufs;
                    let buf:IRenderBuffer = null;
                    while(len > 0)
                    {
                        buf = bufs.pop();
                        buf.__$updateToGpu(rc);
                        buf.__$setUpdateStatus(0);
                        --len;
                    }
                }
            }
            private static s_ins:RenderBufferUpdater = null;
            static GetInstance():RenderBufferUpdater
            {
              if(RenderBufferUpdater.s_ins != null)
              {
                return RenderBufferUpdater.s_ins;
              }
              RenderBufferUpdater.s_ins = new RenderBufferUpdater();
              return RenderBufferUpdater.s_ins;
            }


        }
    }
}