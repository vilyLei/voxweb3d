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
            public static __s_rcids:Int16Array = new Int16Array(
                [
                    -1,-1,-1,-1,-1,-1,-1,-1
                    , -1,-1,-1,-1,-1,-1,-1,-1
                    , -1,-1,-1,-1,-1,-1,-1,-1
                    , -1,-1,-1,-1,-1,-1,-1,-1
                ]
            );
            public static RenerProcessMaxTotal:number = 32;
            constructor()
            {
            }
            // 这里假定最多有 32个 RenerProcess, 每一个数组元素存放的是 RPONode 的uid, 数组的序号对应的是RenerProcess 的uid
            rcids:Int16Array = new Int16Array(RCRPObj.RenerProcessMaxTotal);
            count:number = 0;
        }

        export class RPOUnitBuider
        {    
            private static S_FLAG_BUSY:number = 1;
            private static S_FLAG_FREE:number = 0;
            private static m_unitFlagList:number[] = [];
            private static m_unitIndexPptFlagList:number[] = [];
            private static m_unitListLen:number = 0;
            private static m_unitList:RPOUnit[] = [];
            private static m_freeIdList:number[] = [];
            //private static m_dispList:RODisplay[] = [];            // 为了对应的存入和unit一一对应的uid相同的RODisplay
            private static m_rcpoList:RCRPObj[] = [];
        
            //static __$_S_flag:number = 0;
            private static GetFreeId():number
            {
                if(RPOUnitBuider.m_freeIdList.length > 0)
                {
                    return RPOUnitBuider.m_freeIdList.pop();
                }
                return -1;
            }
            static TestRPNodeExists(dispRUid:number,rprocessUid:number):boolean
            {
                return RPOUnitBuider.m_rcpoList[dispRUid].rcids[rprocessUid] > -1;
            }
            static TestRPNodeNotExists(dispRUid:number,rprocessUid:number):boolean
            {
                //trace("testRPNodeNotExists(), m_rcpoList["+dispRUid+"].rcids: "+m_rcpoList[dispRUid].rcids);
                return RPOUnitBuider.m_rcpoList[dispRUid].rcids[rprocessUid] < 0;
            }
            //  static SetDisplay(disp:RODisplay,rprocessUid:number,rponodeUid:number):void
            //  {
            //      //trace("SetDisplay(), m_rcpoList["+disp.__$ruid+"].rcids: "+m_rcpoList[disp.__$ruid].rcids+", rponodeUid: "+rponodeUid);
            //      RPOUnitBuider.m_dispList[disp.__$ruid] = disp;
            //      RPOUnitBuider.m_rcpoList[disp.__$ruid].rcids[rprocessUid] = rponodeUid;
            //  }
            static SetRPNodeParam(dispRUid:number,rprocessUid:number,rponodeUid:number):number
            {
                let po:RCRPObj = RPOUnitBuider.m_rcpoList[dispRUid];
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
                return RPOUnitBuider.m_rcpoList[dispRUid].rcids[rprocessUid];
            }
            static __$SynVisibleWithUid(dispRUid:number,visible:boolean):void
            {
                RPOUnitBuider.m_unitList[dispRUid].setVisible(visible);
            }
            static __$SynIvsParamWithUid(dispRUid:number,ivsIndex:number,ivsCount:number):void
            {
                RPOUnitBuider.m_unitList[dispRUid].setIvsParam(ivsIndex, ivsCount);
            }
            //setIvsParam
            static GetRPOUnit(dispRUid:number):RPOUnit
            {
                return RPOUnitBuider.m_unitList[dispRUid];
            }
            static GetRCRPObj(dispRUid:number):RCRPObj
            {
                return RPOUnitBuider.m_rcpoList[dispRUid];
            }
            static Create():RPOUnit
            {
                let unit:RPOUnit = null;
                let index:number = RPOUnitBuider.GetFreeId();
                if(index >= 0)
                {
                    unit = RPOUnitBuider.m_unitList[index];
                    //unit.uid = index;
                    RPOUnitBuider.m_unitFlagList[index] = RPOUnitBuider.S_FLAG_BUSY;
                }
                else
                {
                    // create a new unitIndex
                    let po:RCRPObj = new RCRPObj();
                    po.rcids.set(RCRPObj.__s_rcids,0);
                    //trace("po.rcids: "+po.rcids);
                    RPOUnitBuider.m_rcpoList.push(po);
                    RPOUnit.__$_S_flag = 1;
                    unit = new RPOUnit();
                    RPOUnit.__$_S_flag = 0;
                    RPOUnitBuider.m_unitList.push( unit );
                    RPOUnitBuider.m_unitIndexPptFlagList.push(RPOUnitBuider.S_FLAG_FREE);
                    RPOUnitBuider.m_unitFlagList.push(RPOUnitBuider.S_FLAG_BUSY);
                    //unit.uid = RPOUnitBuider.m_unitListLen;
                    RPOUnitBuider.m_unitListLen++;
                }
                return unit;
            }
            static Restore(punit:RPOUnit):void
            {
                if(punit != null && RPOUnitBuider.m_unitFlagList[punit.getUid()] == RPOUnitBuider.S_FLAG_BUSY)
                {
                    let uid:number = punit.getUid();
                    RPOUnitBuider.m_rcpoList[uid].rcids.set(RCRPObj.__s_rcids,0);
                    //RPOUnitBuider.m_dispList[uid] = null;
                    RPOUnitBuider.m_freeIdList.push(uid);
                    RPOUnitBuider.m_unitFlagList[uid] = RPOUnitBuider.S_FLAG_FREE;
                    punit.reset();
                }
            }
            static ShowInfo():void
            {
                console.log("RPOUnitBuider::ShowInfo(), freeIdList: "+RPOUnitBuider.m_freeIdList);
            }
        }
    }
}