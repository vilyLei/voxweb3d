/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import * as IRenderTexResourceT from "../../vox/render/IRenderTexResource";
import * as IRenderMaterialT from "../../vox/render/IRenderMaterial";
import * as MaterialShaderT from "../../vox/material/MaterialShader";
import * as RODataBuilderT from "../../vox/render/RODataBuilder";

import IRenderTexResource = IRenderTexResourceT.vox.render.IRenderTexResource;
import IRenderMaterial = IRenderMaterialT.vox.render.IRenderMaterial;
import MaterialShader = MaterialShaderT.vox.material.MaterialShader;
import RODataBuilder = RODataBuilderT.vox.render.RODataBuilder;

export namespace vox
{
    export namespace render
    {
        export class RenderMaterialProxy
        {
            private m_dispBuilder:RODataBuilder = null;
            private m_shader:MaterialShader = null;
            private m_texRes:IRenderTexResource = null;
            
            setDispBuilder(builder:RODataBuilder):void
            {
                if(this.m_dispBuilder == null)
                {
                    this.m_dispBuilder = builder;
                    this.m_shader = builder.getMaterialShader();
                }
            }
            setTexResource(texRes:IRenderTexResource):void
            {
                this.m_texRes = texRes;
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
            reset():void
            {
                this.m_shader.renderBegin();
                this.m_texRes.renderBegin();
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
    
            toString():string
            {
                return "RenderMaterialProxy()";
            }
        }

    }
}
