/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import * as MathConstT from "../../vox/math/MathConst";
import * as Vector3T from "../../vox/math/Vector3D";
import * as RendererSceneT from "../../vox/scene/RendererScene";
import * as AttackDataPoolT from "../../app/robot/AttackDataPool";
import * as TriggerDataT from "../../app/robot/TriggerData";
import * as CampTypeT from "../../app/robot/Camp";

import MathConst = MathConstT.vox.math.MathConst;
import Vector3D = Vector3T.vox.math.Vector3D;
import RendererScene = RendererSceneT.vox.scene.RendererScene;
import AttackDataPool = AttackDataPoolT.app.robot.AttackDataPool;
import TriggerData = TriggerDataT.app.robot.TriggerData;
import CampType = CampTypeT.app.robot.CampType;

export namespace app
{
    export namespace robot
    {
        export class CampMoudle
        {
            private m_rsc:RendererScene = null;
            constructor()
            {
            }
            initialize(rsc:RendererScene):void
            {
                this.m_rsc = rsc;
            }
            run():void
            {
                let tdatas:TriggerData[] = AttackDataPool.GetInstance().dataList;
                let len:number = tdatas.length;
                if(len > 0)
                {
                    let tdata:TriggerData;
                    for(;len>0;)
                    {
                        tdata = tdatas.pop();
                        console.log("tdata.campType != CampType.Red: ",tdata.campType != CampType.Red);
                        // 可以产生各种效果和相关动作了
                        --len;
                    }
                }
            }
        }
    }
}