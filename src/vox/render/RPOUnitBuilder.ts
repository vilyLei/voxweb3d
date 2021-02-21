/***************************************************************************/
/*                                                                         */
/*  Copyright 2019-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/
// 真正被高频运行的渲染管线中的被执行对象

import * as IPoolNodeT from "../../vox/utils/IPoolNode";
import * as PoolNodeBuilderT from "../../vox/utils/PoolNodeBuilder";
import * as RPOUnitT from "../../vox/render/RPOUnit";

import IPoolNode = IPoolNodeT.vox.utils.IPoolNode;
import PoolNodeBuilder = PoolNodeBuilderT.vox.utils.PoolNodeBuilder;
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
        export class RPOUnitBuilder extends PoolNodeBuilder
        {
            private m_rcpoList:RCRPObj[] = [];
            /**
             * the sub class override this function, for real implement.
             */
            protected createNode():IPoolNode
            {
                let po:RCRPObj = new RCRPObj();
                po.reset();                    
                this.m_rcpoList.push(po);
                return new RPOUnit();
            }
            /**
             * the sub class override this function, for real implement.
             */
            protected restoreUid(uid:number):void
            {
                this.m_rcpoList[uid].reset();
            }

            testRPNodeExists(dispRUid:number,rprocessUid:number):boolean
            {
                return this.m_rcpoList[dispRUid].rcids[rprocessUid] > -1;
            }
            testRPNodeNotExists(dispRUid:number,rprocessUid:number):boolean
            {
                //trace("testRPNodeNotExists(), m_rcpoList["+dispRUid+"].rcids: "+m_rcpoList[dispRUid].rcids);
                return this.m_rcpoList[dispRUid].rcids[rprocessUid] < 0;
            }
            setRPNodeParam(dispRUid:number,rprocessUid:number,rponodeUid:number):number
            {
                let po:RCRPObj = this.m_rcpoList[dispRUid];
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
            getRPONodeUid(dispRUid:number,rprocessUid:number):number
            {
                return this.m_rcpoList[dispRUid].rcids[rprocessUid];
            }
            getRCRPObj(dispRUid:number):RCRPObj
            {
                return this.m_rcpoList[dispRUid];
            }
        }
        
    }
}