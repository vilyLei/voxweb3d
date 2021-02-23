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
        export class ROBufferUpdater
        {
            private m_bufs:IRenderBuffer[] = [];
            private m_uids:number[] = [];
            private m_bufsMap:Map<number, IRenderBuffer> = new Map();
            constructor()
            {

            }
            __$addBuf(buf:IRenderBuffer,resUid:number):void
            {
                if(!this.m_bufsMap.has(resUid))
                {
                    this.m_bufsMap.set(resUid,buf);

                    this.m_bufs.push(buf);
                    this.m_uids.push(resUid);
                }
            }
            __$update(rc:RenderProxy):void
            {
                let len:number = this.m_bufs.length;
                if(len > 0)
                {
                    let uid:number;
                    let bufs:IRenderBuffer[] = this.m_bufs;
                    let buf:IRenderBuffer = null;
                    len = Math.min(16,len);
                    while(len > 0)
                    {
                        uid = this.m_uids.pop();
                        this.m_bufsMap.delete(uid);
                        buf = bufs.pop();
                        buf.__$updateToGpu(rc);
                        --len;
                    }
                }
            }
        }
    }
}