/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import IPoolNode from "../../vox/base/IPoolNode";
import PoolNodeBuilder from "../../vox/base/PoolNodeBuilder";
import RPOUnit from "../../vox/render/RPOUnit";
import RenderShader from '../../vox/render/RenderShader';
import {RPOUnitBuilder} from "../../vox/render/RPOUnitBuilder";
import RPONodeBuilder from "../../vox/render/RPONodeBuilder";
import IRenderResource from "../../vox/render/IRenderResource";
import ROVertexResource from "../../vox/render/ROVertexResource";
import RenderProcess from "../../vox/render/RenderProcess";

export default class RenderProcessBuider extends PoolNodeBuilder
{
    private m_shader:RenderShader;
    private m_rpoNodeBuilder:RPONodeBuilder;
    private m_rpoUnitBuilder:RPOUnitBuilder;
    private m_vtxResource:ROVertexResource;
    private m_batchEnabled:boolean;
    private m_fixedState:boolean;
    
    setCreateParams(shader:RenderShader,rpoNodeBuilder:RPONodeBuilder,rpoUnitBuilder:RPOUnitBuilder,vtxResource:IRenderResource, batchEnabled:boolean,fixedState:boolean):void
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