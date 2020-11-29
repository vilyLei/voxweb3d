/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2020 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/
// 真正位于高频运行的渲染管线中的被使用的渲染关键代理对象

import * as RAdapterContextT from "../../vox/render/RAdapterContext";
import RAdapterContext = RAdapterContextT.vox.render.RAdapterContext;
export namespace vox
{
    export namespace render
    {
        export class RenderFBOProxy
        {
            private static m_rc:any = null;
            private static m_COLOR_ATTACHMENT0:number = 0x0;
            private static m_drawBufsObj:any = null;
            private static m_webGLVer:number = 2;
            static Get_COLOR_ATTACHMENT0():number
            {
                return RenderFBOProxy.m_COLOR_ATTACHMENT0;
            }
            static GetWebglDrawBufsObj():any
            {
                return RenderFBOProxy.m_drawBufsObj;
            }
            static SetRenderer(pr:RAdapterContext,drawBufsObj:any):void
            {
                RenderFBOProxy.m_rc = pr.getRC();
                RenderFBOProxy.m_webGLVer = pr.getWebGLVersion();
                RenderFBOProxy.m_drawBufsObj = drawBufsObj;
                if(RenderFBOProxy.m_webGLVer == 1)
                {
                    //RenderFBOProxy.m_drawBufsObj = RenderFBOProxy.m_rc.getExtension('WEBGL_draw_buffers');
                    if (RenderFBOProxy.m_drawBufsObj != null)
                    {
                        //trace("Use WEBGL_draw_buffers Extension success!");
                        RenderFBOProxy.m_COLOR_ATTACHMENT0 = RenderFBOProxy.m_drawBufsObj.COLOR_ATTACHMENT0_WEBGL;
                    }
                    else
                    {
                        RenderFBOProxy.m_COLOR_ATTACHMENT0 = RenderFBOProxy.m_rc.COLOR_ATTACHMENT0;
                        //trace("WEBGL_draw_buffers Extension can not support!");
                    }
                }
                else
                {
                    RenderFBOProxy.m_COLOR_ATTACHMENT0 = RenderFBOProxy.m_rc.COLOR_ATTACHMENT0;
                }
            }
            static DrawBuffers(attachments:number[]):void
            {
                if(RenderFBOProxy.m_webGLVer == 2)
                {
                    RenderFBOProxy.m_rc.drawBuffers(attachments);
                }
                else if(RenderFBOProxy.m_drawBufsObj != null)
                {
                    RenderFBOProxy.m_drawBufsObj.drawBuffersWEBGL(attachments);
                }
            }    
            static SetRenderToBackBuffer():void
            {
                RenderFBOProxy.m_rc.bindFramebuffer(RenderFBOProxy.m_rc.FRAMEBUFFER,null);
            }
        }
    }
}