/***************************************************************************/
/*                                                                         */
/*  Copyright 2019-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import * as IPoolNodeT from "../../vox/base/IPoolNode";
import * as PoolNodeBuilderT from "../../vox/base/PoolNodeBuilder";
import * as RPOUnitT from "../../vox/render/RPOUnit";

import IPoolNode = IPoolNodeT.vox.base.IPoolNode;
import PoolNodeBuilder = PoolNodeBuilderT.vox.base.PoolNodeBuilder;
import RPOUnit = RPOUnitT.vox.render.RPOUnit;

export namespace vox
{
    export namespace render
    {
        // 这个类的实例，和每一个RPOUnit或者RODisplay关联(通过唯一的uid)
        export class RCRPObj
        {
            public static readonly RenerProcessMaxTotal:number = 16;
            constructor()
            {
            }
            // 这里假定最多有 16 个 RenerProcess, 每一个数组元素存放的是 RPONode 的uid, 数组的序号对应的是RenerProcess 的uid
            idsFlag:number = 0x0;
            count:number = 0;
            // 如果只有加入一个process的时候则有效
            rprocessUid = -1;
            reset():void
            {
                this.idsFlag = 0;
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
                return (this.m_rcpoList[dispRUid].idsFlag & (1<<rprocessUid)) > 0;
            }
            testRPNodeNotExists(dispRUid:number,rprocessUid:number):boolean
            {
                return (this.m_rcpoList[dispRUid].idsFlag & (1<<rprocessUid)) < 1;
            }
            setRPNodeParam(dispRUid:number,rprocessUid:number,rponodeUid:number):number
            {
                let po:RCRPObj = this.m_rcpoList[dispRUid];
                let flag:number = (1<<rprocessUid);
                if(rponodeUid > -1)
                {
                    if((po.idsFlag & flag) < 1)
                    {
                        ++ po.count;
                        po.rprocessUid = rprocessUid;
                        po.idsFlag = po.idsFlag | flag;
                    }
                }
                else
                {
                    if((po.idsFlag & flag) > 0)
                    {
                        -- po.count;
                        po.idsFlag = po.idsFlag & (~flag);
                    }
                }
                return po.count;
            }
            getRCRPObj(dispRUid:number):RCRPObj
            {
                return this.m_rcpoList[dispRUid];
            }
        }
        
    }
}