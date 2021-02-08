/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import * as ROTextureResourceT from '../../vox/render/ROTextureResource';
import * as RenderProxyT from "../../vox/render/RenderProxy"
import * as IRenderBufferT from "../../vox/render/IRenderBuffer";
import * as ITextureSlotT from "../../vox/texture/ITextureSlot";
import * as ROBufferUpdaterT from "../../vox/render/ROBufferUpdater";

import ROTextureResource = ROTextureResourceT.vox.render.ROTextureResource;
import RenderProxy = RenderProxyT.vox.render.RenderProxy;
import IRenderBuffer = IRenderBufferT.vox.render.IRenderBuffer;
import ITextureSlot = ITextureSlotT.vox.texture.ITextureSlot;
import ROBufferUpdater = ROBufferUpdaterT.vox.render.ROBufferUpdater;

export namespace vox
{
    export namespace texture
    {
        export class TextureSlot implements ITextureSlot
        {
            private m_renderProxy:RenderProxy = null;
            private m_texResource:ROTextureResource = null;
            private m_bufferUpdater:ROBufferUpdater = null;
            constructor()
            {

            }
            setRenderProxy(renderProxy:RenderProxy):void
            {
                this.m_renderProxy = renderProxy;
                this.m_texResource = renderProxy.Texture;
            }
            setBufferUpdater(bufferUpdater:ROBufferUpdater):void
            {
                this.m_bufferUpdater = bufferUpdater;
            }
            isGpuEnabledByResUid(resUid:number):boolean
            {
                return this.m_texResource.hasTextureRes(resUid);
            }
            // 先使用map hash拦截的方式,来决定buf和renderer context避免重复的单次关联
            addRenderBuffer(buf:IRenderBuffer,bufResUid:number):void
            {
                this.m_bufferUpdater.__$addBuf(buf, bufResUid);
            }
            addFreeResUid(resUid:number):void
            {

            }
        }
    }
}