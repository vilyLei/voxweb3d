/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import MathConst from "../../../vox/math/MathConst";
import Vector3D from "../../../vox/math/Vector3D";
import {CampType,CampFindMode} from "../../../app/robot/camp/Camp";
import IRoleCamp from "../../../app/robot/IRoleCamp";
import IAttackDst from "../../../app/robot/attack/IAttackDst";
import IDstFinder from "../../../app/robot/attack/IDstFinder";

export default class FireCtrlRadar implements IDstFinder
{
    private m_currDst:IAttackDst = null;
    private m_position:Vector3D = new Vector3D();
    private m_delayTime:number = 3;
    private m_delay:number = 3;
    campType:CampType = CampType.Blue;
    srcRole:IAttackDst = null;
    dstCamp:IRoleCamp = null;

    constructor()
    {
    }
    resetState():void
    {
        this.m_currDst = null;
        this.m_delay = 0;
    }
    setDelayTime(delayTime:number):void
    {
        this.m_delayTime = delayTime >= 0 ? delayTime: 3;
    }
    testAttDst(direcDegree:number):IAttackDst
    {
        this.m_currDst = null;
        this.srcRole.getPosition(this.m_position);
        return this.dstCamp.testAttDst(
            this.m_position,
            this.srcRole.attackDis + this.srcRole.radius,
            CampFindMode.XOZ,
            this.campType,
            direcDegree,
            -1
        );
    }
    findAttDst(direcDegree:number):IAttackDst
    {
        if(this.m_delay < 1 || this.m_currDst != null && this.m_currDst.lifeTime < 1)
        {
            this.m_delay = this.m_delayTime;
            this.srcRole.getPosition(this.m_position);
            if(this.m_currDst == null || this.m_currDst.lifeTime < 1)
            {
                this.m_currDst = this.dstCamp.findAttDst(
                    this.m_position,
                    this.srcRole.attackDis + this.srcRole.radius,
                    CampFindMode.XOZ,
                    this.campType,
                    direcDegree,
                    -1
                    );
            }
            else
            {
                this.m_currDst = this.dstCamp.testSpecAttDst(
                    this.m_currDst,
                    this.m_position,
                    this.srcRole.attackDis + this.srcRole.radius,
                    CampFindMode.XOZ,
                    this.campType,
                    direcDegree,
                    -1
                    );
            }
            return this.m_currDst;
        }
        if(this.m_currDst != null)
        {
            this.m_currDst = this.dstCamp.testSpecAttDst(
                this.m_currDst,
                this.m_position,
                this.srcRole.attackDis + this.srcRole.radius,
                CampFindMode.XOZ,
                this.campType,
                direcDegree,
                -1
                );
            return this.m_currDst;
        }
        this.m_delay --;
        return null;
    }
    findNextDst():IAttackDst
    {
        return null;
    }
}