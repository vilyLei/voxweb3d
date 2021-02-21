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
import * as RenderProcessT from "../../vox/render/RenderProcess";

import IPoolNode = IPoolNodeT.vox.utils.IPoolNode;
import PoolNodeBuilder = PoolNodeBuilderT.vox.utils.PoolNodeBuilder;
import RPOUnit = RPOUnitT.vox.render.RPOUnit;
import MaterialShader = MaterialShaderT.vox.material.MaterialShader;
import RPOUnitBuilder = RPOUnitBuilderT.vox.render.RPOUnitBuilder;
import RPONodeBuilder = RPONodeBuilderT.vox.render.RPONodeBuilder;
import RenderProcess = RenderProcessT.vox.render.RenderProcess;

export namespace vox
{
    export namespace render
    {
        export class RenderProcessBuider
        {

            private static S_FLAG_BUSY:number = 1;
            private static S_FLAG_FREE:number = 0;
            private static m_processListLen:number = 0;
            private static m_processList:RenderProcess[] = [];
            private static m_processFlagList:number[] = [];
            private static m_freeIdList:number[] = [];
        
            static GetFreeId():number
            {
                if(RenderProcessBuider.m_freeIdList.length > 0)
                {
                    return RenderProcessBuider.m_freeIdList.pop();
                }
                return -1; 
            }
            static GetNodeByUid(index:number):RenderProcess
            {
                if(index > -1 && index < RenderProcessBuider.m_processListLen)
                {
                    return RenderProcessBuider.m_processList[index];
                }
                return null;
            }
            static RejoinRunitForTro(runit:RPOUnit):void
            {
                RenderProcessBuider.m_processList[runit.__$rprouid].rejoinRunitForTro(runit);
            }

            static m_shader:MaterialShader;
            static m_rpoNodeBuilder:RPONodeBuilder;
            static m_rpoUnitBuilder:RPOUnitBuilder;
            static m_batchEnabled:boolean;
            static m_fixedState:boolean;
            static SetCreateParams(shader:MaterialShader,rpoNodeBuilder:RPONodeBuilder,rpoUnitBuilder:RPOUnitBuilder, batchEnabled:boolean,fixedState:boolean):void
            {
                RenderProcessBuider.m_shader = shader;
                RenderProcessBuider.m_rpoNodeBuilder = rpoNodeBuilder;
                RenderProcessBuider.m_rpoUnitBuilder = rpoUnitBuilder;
                RenderProcessBuider.m_batchEnabled = batchEnabled;
                RenderProcessBuider.m_fixedState = fixedState;
            }
            //static Create(shader:MaterialShader,rpoNodeBuilder:RPONodeBuilder,rpoUnitBuilder:RPOUnitBuilder, batchEnabled:boolean,fixedState:boolean):RenderProcess
            static Create():RenderProcess
            {
                let process:RenderProcess = null;
                let index:number = RenderProcessBuider.GetFreeId();
                if(index >= 0)
                {
                    process = RenderProcessBuider.m_processList[index];
                    process.uid = index;
                    RenderProcessBuider.m_processFlagList[index] = RenderProcessBuider.S_FLAG_BUSY;
                }
                else
                {
                    // create a new processIndex
                    process = new RenderProcess(
                        RenderProcessBuider.m_shader,
                        RenderProcessBuider.m_rpoNodeBuilder,
                        RenderProcessBuider.m_rpoUnitBuilder,
                        RenderProcessBuider.m_batchEnabled,
                        RenderProcessBuider.m_fixedState
                        );
                    RenderProcessBuider.m_processList.push( process );
                    RenderProcessBuider.m_processFlagList.push(RenderProcessBuider.S_FLAG_BUSY);
                    process.uid = RenderProcessBuider.m_processListLen;
                    RenderProcessBuider.m_processListLen++;
                }
                return process;
            }
            static Restore(p:RenderProcess):void
            {
                if(p != null && p.uid >= 0 && RenderProcessBuider.m_processFlagList[p.uid] == RenderProcessBuider.S_FLAG_BUSY)
                {
                    RenderProcessBuider.m_freeIdList.push(p.uid);
                    RenderProcessBuider.m_processFlagList[p.uid] = RenderProcessBuider.S_FLAG_FREE;
                    p.reset();
                }
            }
        }
    }
}