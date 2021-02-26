/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import * as IPoolNodeT from "../../vox/utils/IPoolNode";
import * as PoolNodeBuilderT from "../../vox/utils/PoolNodeBuilder";
import * as RPOUnitT from "../../vox/render/RPOUnit";
import * as MaterialShaderT from '../../vox/material/MaterialShader';
import * as RPOUnitBuilderT from "../../vox/render/RPOUnitBuilder";
import * as RPONodeBuilderT from "../../vox/render/RPONodeBuilder";
import * as IRenderResourceT from "../../vox/render/IRenderResource";
import * as ROVertexResourceT from "../../vox/render/ROVertexResource";
import * as RenderProcessT from "../../vox/render/RenderProcess";

import IPoolNode = IPoolNodeT.vox.utils.IPoolNode;
import PoolNodeBuilder = PoolNodeBuilderT.vox.utils.PoolNodeBuilder;
import RPOUnit = RPOUnitT.vox.render.RPOUnit;
import MaterialShader = MaterialShaderT.vox.material.MaterialShader;
import RPOUnitBuilder = RPOUnitBuilderT.vox.render.RPOUnitBuilder;
import RPONodeBuilder = RPONodeBuilderT.vox.render.RPONodeBuilder;
import IRenderResource = IRenderResourceT.vox.render.IRenderResource;
import ROVertexResource = ROVertexResourceT.vox.render.ROVertexResource;
import RenderProcess = RenderProcessT.vox.render.RenderProcess;

export namespace vox
{
    export namespace render
    {
        export class RenderProcessBuider extends PoolNodeBuilder
        {
            
            private m_shader:MaterialShader;
            private m_rpoNodeBuilder:RPONodeBuilder;
            private m_rpoUnitBuilder:RPOUnitBuilder;
            private m_vtxResource:ROVertexResource;
            private m_batchEnabled:boolean;
            private m_fixedState:boolean;
            
            setCreateParams(shader:MaterialShader,rpoNodeBuilder:RPONodeBuilder,rpoUnitBuilder:RPOUnitBuilder,vtxResource:IRenderResource, batchEnabled:boolean,fixedState:boolean):void
            {
                this.m_shader = shader;
                this.m_rpoNodeBuilder = rpoNodeBuilder;
                this.m_rpoUnitBuilder = rpoUnitBuilder;
                this.m_vtxResource = vtxResource as ROVertexResource;
                this.m_batchEnabled = batchEnabled;
                this.m_fixedState = fixedState;
            }
            protected createNode():IPoolNode
            {
                return new RenderProcess(
                    this.m_shader,
                    this.m_rpoNodeBuilder,
                    this.m_rpoUnitBuilder,
                    this.m_vtxResource,
                    this.m_batchEnabled,
                    this.m_fixedState
                    );
            }
            rejoinRunitForTro(runit:RPOUnit):void
            {
                (this.getNodeByUid(runit.__$rprouid) as RenderProcess).rejoinRunitForTro(runit);
            }
            rejoinRunitForVro(runit:RPOUnit):void
            {
                (this.getNodeByUid(runit.__$rprouid) as RenderProcess).rejoinRunitForVro(runit);
            }
        }
    }
}