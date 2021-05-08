/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import MathConst from "../../vox/math/MathConst";
import Vector3D from "../../vox/math/Vector3D";
import IEntityTransform from "../../vox/entity/IEntityTransform";

class DegreeTween
{
    private m_target:IEntityTransform = null;
    private m_degreeChanged:boolean = true;
    private m_degree:number = 0.0;
    private m_dis:number = 0.0;
    private m_pv:Vector3D = new Vector3D();
    
    syncDegreeUpdate:boolean = true;
    constructor(){}
    bindTarget(target:IEntityTransform):void
    {
        this.m_target = target;
    }
    isDegreeChanged():boolean
    {
        return this.m_degreeChanged;
    }
    testDegreeDis(pdis:number):boolean
    {
        return this.m_dis < pdis;
    }
    isEnd():boolean
    {
        return this.m_dis < 1.0;
    }
    isRunning():boolean
    {
        return this.m_dis >= 1.0;
    }
    getDegreeDis():number
    {
        return this.m_dis;
    }
    getDegree():number
    {
        return this.m_degree;
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
            let minDis:number = 2.0;
            if(this.m_dis >= minDis)
            {
                if(degreeDis < 0.0)
                {
                    degreeDis = this.m_dis * 0.2;
                    degreeDis = degreeDis > minDis ? degreeDis:minDis;
                    degree = this.m_pv.y + degreeDis;
                }
                else
                {
                    degreeDis = this.m_dis * 0.2;
                    degreeDis = degreeDis > minDis ? degreeDis:minDis;
                    degree = this.m_pv.y - degreeDis;
                }
            }
            this.m_degreeChanged = Math.abs(this.m_degree - degree) > MathConst.MATH_MIN_POSITIVE;
            if(this.m_degreeChanged)
            {
                this.m_degree = degree;
                if(this.syncDegreeUpdate)this.m_target.setRotationXYZ(0.0,degree,0.0);
            }
        }
    }
    destroy():void
    {
        this.m_target = null;
    }
}

export default DegreeTween;