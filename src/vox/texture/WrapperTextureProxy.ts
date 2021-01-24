/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import * as TextureProxyT from "../../vox/texture/TextureProxy";
import * as RenderProxyT from "../../vox/render/RenderProxy";

import TextureProxy = TextureProxyT.vox.texture.TextureProxy;
import RenderProxy = RenderProxyT.vox.render.RenderProxy;
export namespace vox
{
    export namespace texture
    {
        export class WrapperTextureProxy extends TextureProxy
        {
            private m_tex:TextureProxy = null;
            constructor(texList:TextureProxy[], texWidth:number,texHeight:number,powerof2Boo:boolean = false)
            {
                super(texList,texWidth,texHeight,powerof2Boo)
            }
            isDirect():boolean
            {
                return false;
            }
            attachTex(tex:TextureProxy):void
            {
                if(tex != null && tex != this)
                {
                    this.m_tex = tex;
                }
            }
            detachTex():void
            {
                this.m_tex = null;
            }
            
            dataEnough():boolean
            {
                return this.m_tex.dataEnough();
            }
            __$gpuBuf():any
            {
                return this.m_tex.__$gpuBuf();
            }
            __$use(gl:any):void
            {
                this.m_tex.__$use(gl);
            }
            isGpuEnabled():boolean
            {
                return this.m_tex.isGpuEnabled();
            }
            getSamplerType():number
            {
                return this.m_tex.getSamplerType();
            }
            // TextureConst.TEXTURE_2D or TextureConst.TEXTURE_CUBE or TextureConst.TEXTURE_3D
            getTargetType():number
            {
                return this.m_tex.getTargetType();
            }
            __$setUpdateStatus(s:number):void
            {
                this.m_tex.__$setUpdateStatus(s);
            }
            __$getUpdateStatus():number
            {
                return this.m_tex.__$getUpdateStatus();
            }
            // sub class override
            __$updateToGpu(rc:RenderProxy):void
            {
                this.m_tex.__$updateToGpu(rc);
            }
            //  sub class can not override!!!!
            upload(rc:RenderProxy):void
            {
                this.m_tex.upload(rc);
            }
            
            toString():string
            {
                return "[WrapperTextureProxy(name:"+this.name+",uid="+this.getUid()+",width="+this.getWidth()+",height="+this.getHeight()+")]";
            }
            __$disposeGpu(rc:RenderProxy):void
            {
                this.m_tex.__$disposeGpu(rc);
            }
        }
    }
}