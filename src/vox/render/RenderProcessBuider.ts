/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import * as RPOUnitT from "../../vox/render/RPOUnit";
import * as RenderProcessT from "../../vox/render/RenderProcess";

import RPOUnit = RPOUnitT.vox.render.RPOUnit;
import RenderProcess = RenderProcessT.vox.render.RenderProcess;

export namespace vox
{
    export namespace render
    {
        export class RenderProcessBuider
        {

            private static __S_FLAG_BUSY:number = 1;
            private static __S_FLAG_FREE:number = 0;
            private static m_processListLen:number = 0;
            private static m_processList:RenderProcess[] = [];
            private static m_processFlagList:number[] = [];
            private static m_processIndexPptFlagList:number[] = [];
            private static m_freeIdList:number[] = [];
        
            static GetFreeId():number
            {
                if(RenderProcessBuider.m_freeIdList.length > 0)
                {
                    return RenderProcessBuider.m_freeIdList.pop();
                }
                return -1; 
            }
            static GetProcess(index:number):RenderProcess
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
            static Create(batchEnabled:boolean,fixedState:boolean):RenderProcess
            {
                let process:RenderProcess = null;
                let index:number = RenderProcessBuider.GetFreeId();
                if(index >= 0)
                {
                    process = RenderProcessBuider.m_processList[index];
                    process.index = index;
                    RenderProcessBuider.m_processFlagList[index] = RenderProcessBuider.__S_FLAG_BUSY;
                }
                else
                {
                    // create a new processIndex
                    process = new RenderProcess(batchEnabled,fixedState);
                    RenderProcessBuider.m_processList.push( process );
                    RenderProcessBuider.m_processIndexPptFlagList.push(0);
                    RenderProcessBuider.m_processFlagList.push(RenderProcessBuider.__S_FLAG_BUSY);
                    process.index = RenderProcessBuider.m_processListLen;
                    RenderProcessBuider.m_processListLen++;
                }
                return process;
            }
            static Restore(p:RenderProcess):void
            {
                if(p != null && p.index >= 0 && RenderProcessBuider.m_processFlagList[p.index] == RenderProcessBuider.__S_FLAG_BUSY)
                {
                    RenderProcessBuider.m_freeIdList.push(p.index);
                    RenderProcessBuider.m_processFlagList[p.index] = RenderProcessBuider.__S_FLAG_FREE;
                    p.reset();
                }
            }
        }
    }
}