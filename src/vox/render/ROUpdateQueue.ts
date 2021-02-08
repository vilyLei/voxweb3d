
/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import * as MaterialBaseT from "../../vox/material/MaterialBase";
import * as RenderAdapterT from "../../vox/render/RenderAdapter";
import * as RenderProxyT from "../../vox/render/RenderProxy";

import MaterialBase = MaterialBaseT.vox.material.MaterialBase;
import RenderAdapter = RenderAdapterT.vox.render.RenderAdapter;
import RenderProxy = RenderProxyT.vox.render.RenderProxy;

export namespace vox
{
    export namespace render
    {
        export class ROUpdateQueue
        {
            constructor()
            {
            }
            private m_texMaterials:MaterialBase[] = [];
            private m_bufs:any[] = [];
            
            addUpdateTexMaterial(m:MaterialBase):void
            {
                this.m_texMaterials.push(m);
            }
            addUpdateBuf(buf:any):void
            {
                if(buf != null && buf.updateUnlocked)
                {
                    buf.updateUnlocked = false;
                    this.m_bufs.push(buf);
                }
            }
            update(rc:RenderProxy):void
            {
            }
            private static __s_ins:ROUpdateQueue = null;
            static GetInstance():ROUpdateQueue
            {
                if(ROUpdateQueue.__s_ins != null)
                {
                    return ROUpdateQueue.__s_ins;
                }
                ROUpdateQueue.__s_ins = new ROUpdateQueue();
                return ROUpdateQueue.__s_ins;
            }
        }

    }
}