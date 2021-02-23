/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import * as MaterialBaseT from "../../vox/material/MaterialBase";
import * as RenderProxyT from "../../vox/render/RenderProxy";
import * as MaterialShaderT from "../../vox/material/MaterialShader";
import * as RODataBuilderT from "../../vox/render/RODataBuilder";

import MaterialBase = MaterialBaseT.vox.material.MaterialBase;
import RenderProxy = RenderProxyT.vox.render.RenderProxy;
import MaterialShader = MaterialShaderT.vox.material.MaterialShader;
import RODataBuilder = RODataBuilderT.vox.render.RODataBuilder;

export namespace vox
{
    export namespace render
    {
        export class RenderMaterialProxy
        {
            private m_rc:RenderProxy = null;
            private m_dispBuilder:RODataBuilder = null;
            private m_shader:MaterialShader = null;
            
            setDispBuilder(builder:RODataBuilder):void
            {
                if(this.m_dispBuilder == null)
                {
                    this.m_dispBuilder = builder;
                    this.m_shader = builder.getMaterialShader();
                }
            }
            setRenderProxy(rc:RenderProxy):void
            {
                this.m_rc = rc;
            }
            unlockMaterial():void
            {
                this.m_shader.unlock();
                this.m_rc.Texture.unlocked = true;
            }
            lockMaterial():void
            {
                this.m_shader.lock();
                this.m_rc.Texture.unlocked = false;
            }
            reset():void
            {
                this.m_shader.reset();
                this.m_rc.Texture.renderBegin();
            }
            renderBegin():void
            {
                this.m_shader.reset();
                this.m_rc.Texture.renderBegin();
            }
            useGlobalMaterial(material:MaterialBase):void
            {
                this.m_dispBuilder.updateGlobalMaterial(this.m_rc, material);
            }
    
            toString():string
            {
                return "RenderMaterialProxy()";
            }
        }

    }
}
