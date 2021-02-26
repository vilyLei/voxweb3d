/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import * as IRenderResourceT from '../../vox/render/IRenderResource';
import * as RenderProxyT from "../../vox/render/RenderProxy"
import * as TextureProxyT from "../../vox/texture/TextureProxy"
import * as IRenderBufferT from "../../vox/render/IRenderBuffer";
import * as ITextureSlotT from "../../vox/texture/ITextureSlot";
import * as ROBufferUpdaterT from "../../vox/render/ROBufferUpdater";

import IRenderResource = IRenderResourceT.vox.render.IRenderResource;
import RenderProxy = RenderProxyT.vox.render.RenderProxy;
import TextureProxy = TextureProxyT.vox.texture.TextureProxy;
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
            private m_texResource:IRenderResource = null;
            private m_bufferUpdater:ROBufferUpdater = null;
            private m_textureTotal:number = 0;
            private m_textureMap:Map<number,TextureProxy> = new Map();
            private m_freeMap:Map<number,number> = new Map();
            constructor()
            {
            }
            addTexture(texture:TextureProxy):void
            {
                if(texture != null && !this.m_textureMap.has(texture.getUid()))
                {
                    texture.__$setSlot(this);
                    this.m_textureMap.set(texture.getUid(), texture);
                    this.m_textureTotal ++;
                }
            }
            getTextureByUid(uid:number):TextureProxy
            {
                return this.m_textureMap.get(uid);
            }
            hasTextureByUid(uid:number):boolean
            {
                return this.m_textureMap.has(uid);
            }
            removeTextureByUid(uid:number):TextureProxy
            {
                if(this.m_textureMap.has(uid))
                {
                    let tex:TextureProxy = this.m_textureMap.get(uid);
                    if(tex.getAttachCount() < 1)
                    {
                        tex.__$destroy();
                        this.m_textureTotal --;
                        this.m_textureMap.delete(uid);
                        return tex;
                    }
                }
                return null;
            }
            /**
             * @returns get runtime all textures amount
             */
            getTextureTotal():number
            {
                return this.m_textureTotal;
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
            getFreeResUidMap():Map<number,number>
            {
                return this.m_freeMap;
            }

            isGpuEnabledByResUid(resUid:number):boolean
            {
                return this.m_texResource.hasResUid(resUid);
            }
            // 先使用map hash拦截的方式,来决定buf和renderer context避免重复的单次关联
            addRenderBuffer(buf:IRenderBuffer,bufResUid:number):void
            {
                if(this.m_bufferUpdater != null)
                {
                    this.m_bufferUpdater.__$addBuf(buf, bufResUid);
                }
            }
            addFreeUid(uid:number):void
            {
                this.m_freeMap.set(uid,0);
            }
            removeFreeUid(uid:number):void
            {
                if(this.m_freeMap.has(uid))
                {
                    this.m_freeMap.delete(uid);
                }
            }
        }
    }
}