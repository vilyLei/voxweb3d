/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import * as MathConstT from "../../../vox/math/MathConst";
import * as Vector3T from "../../../vox/math/Vector3D";
import * as IPosetureT from "../../../app/robot/poseture/IPoseture";
import * as DegreeTweenT from "../../../vox/utils/DegreeTween";

import MathConst = MathConstT.vox.math.MathConst;
import Vector3D = Vector3T.vox.math.Vector3D;
import IPoseture = IPosetureT.app.robot.poseture.IPoseture;
import DegreeTween = DegreeTweenT.vox.utils.DegreeTween;

export namespace app
{
    export namespace robot
    {
        export namespace poseture
        {
            export class TwoLegPostureCtrl
            {
                private m_target:IPoseture = null;
                private m_running:boolean = true;
                private m_resetPoseFlag:boolean = true;
                
                degreeTween:DegreeTween = new DegreeTween();
                constructor(){}
                bindTarget(target:IPoseture):void
                {
                    this.m_target = target;
                    
                    this.degreeTween.bindTarget(this.m_target.getContainer());
                }
                isRunning():boolean
                {
                    return this.m_running;
                }
                runByDegree(degree:number,finished:boolean):void
                {
                    if(this.m_target != null)
                    {
                        this.degreeTween.runRotY(degree);
                        this.runTest(finished);
                    }
                }
                private runTest(finished:boolean):void
                {
                    //if(finished && this.degreeTween.testDegreeDis(10.0))
                    if(finished && this.degreeTween.isEnd())
                    {
                        // 开始执行由走动到停止走动的动作转换
                        if(this.m_resetPoseFlag)
                        {
                            this.m_target.resetNextOriginPose();
                            this.m_resetPoseFlag = false;
                        }
                        if(this.m_target.isResetFinish())
                        {
                            this.m_running = false;
                            this.m_target.resetPose();
                        }
                        else
                        {
                            this.m_target.runToReset();
                        }
                    }
                    else
                    {
                        this.m_resetPoseFlag = true;
                        this.m_running = true;
                        // 执行走动动作
                        this.m_target.run();
                    }
                }
                runByPos(pos:Vector3D,finished:boolean):void
                {
                    if(this.m_target != null)
                    {
                        // 朝向目标位置
                        this.degreeTween.runRotYByDstPos(pos);
                        this.runTest(finished);                        
                    }
                }
            }
        }
    }
}