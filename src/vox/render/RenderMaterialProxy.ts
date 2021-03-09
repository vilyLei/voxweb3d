/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import * as IRenderTexResourceT from "../../vox/render/IRenderTexResource";
import * as IRenderMaterialT from "../../vox/render/IRenderMaterial";
import * as RenderShaderT from "../../vox/render/RenderShader";
import * as RODataBuilderT from "../../vox/render/RODataBuilder";

import IRenderTexResource = IRenderTexResourceT.vox.render.IRenderTexResource;
import IRenderMaterial = IRenderMaterialT.vox.render.IRenderMaterial;
import RenderShader = RenderShaderT.vox.render.RenderShader;
import RODataBuilder = RODataBuilderT.vox.render.RODataBuilder;

export namespace vox
{
    export namespace render
    {
        export class RenderMaterialProxy
        {
            private m_dispBuilder:RODataBuilder = null;
            private m_shader:RenderShader = null;
            private m_texRes:IRenderTexResource = null;
            
            setDispBuilder(builder:RODataBuilder):void
            {
                if(this.m_dispBuilder == null)
                {
                    this.m_dispBuilder = builder;
                    this.m_shader = builder.getRenderShader();
                    this.m_texRes = builder.getTextureResource();
                }
            }
            unlockMaterial():void
            {
                this.m_shader.unlock();
                this.m_texRes.unlocked = true;
            }
            lockMaterial():void
            {
                this.m_shader.lock();
                this.m_texRes.unlocked = false;
            }
            renderBegin():void
            {
                this.m_shader.renderBegin();
                this.m_texRes.renderBegin();
            }
            useGlobalMaterial(material:IRenderMaterial):void
            {
                this.m_dispBuilder.updateGlobalMaterial(material);
            }    
        }

    }
}
