/***************************************************************************/
/*                                                                         */
/*  Copyright 2019-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/
// 真正被高频运行的渲染管线中的被执行对象

import * as RPOUnitT from "../../vox/render/RPOUnit";

import RPOUnit = RPOUnitT.vox.render.RPOUnit;
export namespace vox
{
    export namespace render
    {
        // 这个类的实例，和每一个RPOUnit或者RODisplay关联(通过唯一的uid)
        export class RCRPObj
        {
            private static s_rcids:Int16Array = new Int16Array(
                [
                    -1,-1,-1,-1,-1,-1,-1,-1
                    , -1,-1,-1,-1,-1,-1,-1,-1
                    , -1,-1,-1,-1,-1,-1,-1,-1
                    , -1,-1,-1,-1,-1,-1,-1,-1
                ]
            );
            public static readonly RenerProcessMaxTotal:number = 32;
            constructor()
            {
            }
            // 这里假定最多有 32个 RenerProcess, 每一个数组元素存放的是 RPONode 的uid, 数组的序号对应的是RenerProcess 的uid
            rcids:Int16Array = new Int16Array(RCRPObj.RenerProcessMaxTotal);
            count:number = 0;
            reset():void
            {
                this.rcids.set(RCRPObj.s_rcids,0);
            }
        }

        export class RPOUnitBuilder
        {    
            private static S_FLAG_BUSY:number = 1;
            private static S_FLAG_FREE:number = 0;
            private static m_unitFlagList:number[] = [];
            private static m_unitListLen:number = 0;
            private static m_unitList:RPOUnit[] = [];
            private static m_freeIdList:number[] = [];
            private static m_rcpoList:RCRPObj[] = [];
        
            private static GetFreeId():number
            {
                if(RPOUnitBuilder.m_freeIdList.length > 0)
                {
                    return RPOUnitBuilder.m_freeIdList.pop();
                }
                return -1;
            }
            static TestRPNodeExists(dispRUid:number,rprocessUid:number):boolean
            {
                return RPOUnitBuilder.m_rcpoList[dispRUid].rcids[rprocessUid] > -1;
            }
            static TestRPNodeNotExists(dispRUid:number,rprocessUid:number):boolean
            {
                //trace("testRPNodeNotExists(), m_rcpoList["+dispRUid+"].rcids: "+m_rcpoList[dispRUid].rcids);
                return RPOUnitBuilder.m_rcpoList[dispRUid].rcids[rprocessUid] < 0;
            }
            static SetRPNodeParam(dispRUid:number,rprocessUid:number,rponodeUid:number):number
            {
                let po:RCRPObj = RPOUnitBuilder.m_rcpoList[dispRUid];
                if(rponodeUid > -1)
                {
                    if(po.rcids[rprocessUid] < 0)
                    {
                        ++ po.count;
                        po.rcids[rprocessUid] = rponodeUid;
                    }
                }
                else
                {
                    if(po.rcids[rprocessUid] > -1)
                    {
                        -- po.count;
                        po.rcids[rprocessUid] = rponodeUid;
                    }
                }
                return po.count;
            }
            static GetRPONodeUid(dispRUid:number,rprocessUid:number):number
            {
                return RPOUnitBuilder.m_rcpoList[dispRUid].rcids[rprocessUid];
            }
            
            static GetNodeByUid(dispRUid:number):RPOUnit
            {
                return RPOUnitBuilder.m_unitList[dispRUid];
            }
            static GetRCRPObj(dispRUid:number):RCRPObj
            {
                return RPOUnitBuilder.m_rcpoList[dispRUid];
            }
            static Create():RPOUnit
            {
                let unit:RPOUnit = null;
                let index:number = RPOUnitBuilder.GetFreeId();
                if(index >= 0)
                {
                    unit = RPOUnitBuilder.m_unitList[index];
                    unit.uid = index;
                    RPOUnitBuilder.m_unitFlagList[index] = RPOUnitBuilder.S_FLAG_BUSY;
                }
                else
                {
                    // create a new unitIndex
                    let po:RCRPObj = new RCRPObj();
                    po.reset();                    
                    RPOUnitBuilder.m_rcpoList.push(po);
                    unit = new RPOUnit();

                    RPOUnitBuilder.m_unitList.push( unit );
                    RPOUnitBuilder.m_unitFlagList.push(RPOUnitBuilder.S_FLAG_BUSY);
                    unit.uid = RPOUnitBuilder.m_unitListLen;
                    RPOUnitBuilder.m_unitListLen++;
                }
                return unit;
            }
            static Restore(punit:RPOUnit):void
            {
                if(punit != null && RPOUnitBuilder.m_unitFlagList[punit.uid] == RPOUnitBuilder.S_FLAG_BUSY)
                {
                    let uid:number = punit.uid;
                    RPOUnitBuilder.m_rcpoList[uid].reset();
                    RPOUnitBuilder.m_freeIdList.push(uid);
                    RPOUnitBuilder.m_unitFlagList[uid] = RPOUnitBuilder.S_FLAG_FREE;
                    punit.reset();
                }
            }
            static ShowInfo():void
            {
                console.log("RPOUnitBuilder::ShowInfo(), freeIdList: "+RPOUnitBuilder.m_freeIdList);
            }
        }
    }
}