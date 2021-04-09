/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import * as MathConstT from "../../vox/math/MathConst";
import * as Vector3T from "../../vox/math/Vector3D";
import * as IEntityTransformT from "../../vox/entity/IEntityTransform";

import MathConst = MathConstT.vox.math.MathConst;
import Vector3D = Vector3T.vox.math.Vector3D;
import IEntityTransform = IEntityTransformT.vox.entity.IEntityTransform;

export namespace vox
{
    export namespace utils
    {
        export class DegreeTween
        {
            private m_target:IEntityTransform = null;
            private m_degreeChanged:boolean = true;
            private m_preDegree:number = 1000.0;
            private m_dis:number = 0.0;
            private m_pv:Vector3D = new Vector3D();
            
            constructor(){}
            bindTarget(target:IEntityTransform):void
            {
                this.m_target = target;
            }
            isDegreeChanged():boolean
            {
                return this.m_degreeChanged;
            }
            isEnd():boolean
            {
                return this.m_dis < 1.0;
            }
            isRunning():boolean
            {
                return this.m_dis >= 1.0;
            }
            runRotYByDstPos(dstPv:Vector3D):void
            {
                if(this.m_target != null)
                {
                    this.m_target.getPosition(this.m_pv);
                    let degree:number = 180 + MathConst.GetDegreeByXY(this.m_pv.x - dstPv.x, dstPv.z - this.m_pv.z);
                    this.runRotY(degree);
                }
            }
            runRotY(degree:number):void
            {
                if(this.m_target != null)
                {
                    this.m_target.getRotationXYZ(this.m_pv);
                    let degreeDis:number = MathConst.GetMinDegree(degree, this.m_pv.y);
                    this.m_dis = Math.abs(degreeDis);
                    if(this.m_dis >= 1.0)degree = this.m_pv.y - degreeDis * 0.2;
                    this.m_degreeChanged = Math.abs(this.m_preDegree - degree) > MathConst.MATH_MIN_POSITIVE;
                    if(this.m_degreeChanged)
                    {
                        this.m_preDegree = degree;
                        this.m_target.setRotationXYZ(0.0,degree,0.0);
                    }
                }
            }
            destroy():void
            {
                this.m_target = null;
            }
        }
    }
}