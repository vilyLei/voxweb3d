/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import * as RenderProcessT from "../../vox/render/RenderProcess";
import * as RendererInstanceT from "../../vox/scene/RendererInstance";
import * as RendererStatusT from "../../voxprofile/entity/RendererStatus";

import RenderProcess = RenderProcessT.vox.render.RenderProcess;
import RendererInstance = RendererInstanceT.vox.scene.RendererInstance;
import RendererStatus = RendererStatusT.voxprofile.entity.RendererStatus;

export namespace voxprofile
{
    export namespace entity
    {
        export class ProfileInstance
        {
            private m_rprocess:RenderProcess = null;
            private m_renderer:RendererInstance = null;
            private m_status:RendererStatus = null;
            
            constructor()
            {
            }
            initialize(renderer:RendererInstance):void
            {
                if(this.m_renderer == null)
                {
                    this.m_renderer = renderer;
                    this.m_rprocess = this.m_renderer.createSeparatedProcess();
                    this.m_status = new RendererStatus();
                    this.m_status.initialize(this.m_renderer, this.m_rprocess);
                }
            }
            run():void
            {
                if(this.m_renderer != null)
                {
                    this.m_status.run();
                    this.m_renderer.runProcess( this.m_rprocess );
                }
            }
            toString():string
            {
                return "[ProfileInstance]";
            }
        }
    }
}
