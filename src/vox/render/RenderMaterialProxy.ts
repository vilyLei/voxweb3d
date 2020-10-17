/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import * as TextureStoreT from "../../vox/texture/TextureStore";
import * as MaterialBaseT from "../../vox/material/MaterialBase";
import * as TextureRenderObjT from "../../vox/texture/TextureRenderObj";
import * as RenderProxyT from "../../vox/render/RenderProxy";
import * as MaterialProgramT from "../../vox/material/MaterialProgram";
import * as RODispBuilderT from "../../vox/render/RODispBuilder";

import TextureStore = TextureStoreT.vox.texture.TextureStore;
import MaterialBase = MaterialBaseT.vox.material.MaterialBase;
import TextureRenderObj = TextureRenderObjT.vox.texture.TextureRenderObj;
import RenderProxy = RenderProxyT.vox.render.RenderProxy;
import MaterialProgram = MaterialProgramT.vox.material.MaterialProgram;
import RODispBuilder = RODispBuilderT.vox.render.RODispBuilder;

export namespace vox
{
    export namespace render
    {
        export class RenderMaterialProxy
        {
            private m_rc:RenderProxy = null;
            private m_dispBuilder:RODispBuilder = null;
            
            setDispBuilder(builder:RODispBuilder):void
            {
                if(this.m_dispBuilder == null)
                {
                    this.m_dispBuilder = builder;
                }
            }
            setRenderProxy(rc:RenderProxy):void
            {
                this.m_rc = rc;
            }
            unlockMaterial():void
            {
                MaterialProgram.Unlock();
                TextureRenderObj.Unlock();
            }
            lockMaterial():void
            {
                MaterialProgram.Lock();
                TextureRenderObj.Lock();
            }
            reset():void
            {
                MaterialProgram.Reset();
                TextureRenderObj.RenderBegin(this.m_rc);
                TextureStore.RenderBegin(this.m_rc);
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
