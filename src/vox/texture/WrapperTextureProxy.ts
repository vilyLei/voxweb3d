/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import * as TextureConstT from "../../vox/texture/TextureConst";
import * as ITextureSlotT from "../../vox/texture/ITextureSlot";
import * as TextureProxyT from "../../vox/texture/TextureProxy";
import * as RenderProxyT from "../../vox/render/RenderProxy";

import TextureProxyType = TextureConstT.vox.texture.TextureProxyType;
import ITextureSlot = ITextureSlotT.vox.texture.ITextureSlot;
import TextureProxy = TextureProxyT.vox.texture.TextureProxy;
import RenderProxy = RenderProxyT.vox.render.RenderProxy;
export namespace vox
{
    export namespace texture
    {
        export class WrapperTextureProxy extends TextureProxy
        {
            private m_tex:TextureProxy = null;
            constructor(slot:ITextureSlot, texWidth:number,texHeight:number,powerof2Boo:boolean = false)
            {
                super(slot,texWidth,texHeight,powerof2Boo);
                this.m_type = TextureProxyType.Wrapper;
            }
            /**
             * @returns 返回自己的 纹理资源 unique id, 这个id会被对应的资源管理器使用, 此方法子类不可以覆盖
             */
            getResUid():number
            {
                return this.m_tex.getResUid();
            }
            /**
             * @returns 返回true, 表示当前纹理对象是渲染直接使用其对应的显存资源的对象
             *          返回false, 表示不能直接使用对应的显存资源
             */
            isDirect():boolean
            {
                return false;
            }
            attachTex(tex:TextureProxy):void
            {
                if(tex != null && tex != this)
                {
                    if(this.m_tex != tex)
                    {
                        tex.__$attachThis();
                    }
                    this.m_tex = tex;
                }
            }
            detachTex():void
            {
                if(this.m_tex != null)
                {
                    this.m_tex.__$detachThis();
                }
                this.m_tex = null;
            }
            /**
             * 被引用计数加一
             */
            __$attachThis():void
            {
                super.__$attachThis();
                if(this.m_tex != null)
                {
                    this.m_tex.__$attachThis();
                }
            }
            /**
             * 被引用计数减一
             */
            __$detachThis():void
            {
                super.__$detachThis();
                if(this.m_tex != null)
                {
                    this.m_tex.__$detachThis();
                }
            }
            /**
             * This function only be be called by the renderer inner system.
             */
            __$$use(rc:RenderProxy):void
            {
                this.m_tex.__$$use(rc);
            }
            /**
             * @returns the texture gpu resource is enabled or not.
             */
            isGpuEnabled():boolean
            {
                return this.m_tex.isGpuEnabled();
            }
            /**
             * @returns The fragment processor texture sampler type.
             */
            getSampler():number
            {
                return this.m_tex.getSampler();
            }
            
            __$setUpdateStatus(s:number):void
            {
                this.m_tex.__$setUpdateStatus(s);
            }
            __$getUpdateStatus():number
            {
                return this.m_tex.__$getUpdateStatus();
            }
            __$updateToGpu(rc:RenderProxy):void
            {
                this.m_tex.__$updateToGpu(rc);
            }
            /**
             * This function only be be called by the renderer inner system.
             * if sub class override this function, it must does call this function.
             */
            __$$upload(rc:RenderProxy):void
            {
                this.m_tex.__$$upload(rc);
            }
            
            __$destroy():void
            {
                if(this.getAttachCount() < 1)
                {
                    if(this.m_tex != null)
                    {
                        this.m_tex.__$detachThis();
                    }
                    this.m_tex = null;
                    super.__$destroy();
                }
            }

            /**
             * @returns the texture data is enough or not.
             */
            isDataEnough():boolean
            {
                return this.m_tex.isDataEnough();
            }
            /**
             * @returns return value is TextureConst.TEXTURE_2D or TextureConst.TEXTURE_CUBE or TextureConst.TEXTURE_3D
             */
            getTargetType():number
            {
                return this.m_tex.getTargetType();
            }
            toString():string
            {
                return "[WrapperTextureProxy(name:"+this.name+",uid="+this.getUid()+",width="+this.getWidth()+",height="+this.getHeight()+")]";
            }
        }
    }
}