/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import Vector3D from "../../../vox/math/Vector3D";
import RendererScene from "../../../vox/scene/RendererScene";
import DisplayEntity from "../../../vox/entity/DisplayEntity";
import SillyLowerBody from "../../../app/robot/base/SillyLowerBody";
import SillyUpperBody from "../../../app/robot/base/SillyUpperBody";
import IAttackDst from "../../../app/robot/attack/IAttackDst";
import RbtRole from "../../../app/robot/base/RbtRole";

export default class SillyRole extends RbtRole implements IAttackDst
{
    private m_renderProcessIndex:number = 0;
    private m_legModule:SillyLowerBody = null;
    private m_armModule:SillyUpperBody = null;

    private m_lowerEntity:DisplayEntity = null;
    private m_upperrEntity:DisplayEntity = null;
    constructor()
    {
        super();
    }
    initializeFrom(srcRole:SillyRole):void
    {
        if(srcRole != null)
        {
            this.campType = srcRole.campType;
            this.lifeTime = srcRole.lifeTime;
            this.attackDis = srcRole.attackDis;
            this.radius = srcRole.radius;
            let lowerEntity:DisplayEntity = new DisplayEntity();
            lowerEntity.copyMeshFrom(srcRole.m_lowerEntity);
            lowerEntity.copyMaterialFrom(srcRole.m_lowerEntity);
            let upperrEntity:DisplayEntity = new DisplayEntity();
            upperrEntity.copyMeshFrom(srcRole.m_upperrEntity);
            upperrEntity.copyMaterialFrom(srcRole.m_upperrEntity);
            this.initialize(srcRole.getRendererScene(), srcRole.m_renderProcessIndex, lowerEntity, upperrEntity);
        }
    }
    initialize(sc:RendererScene,renderProcessIndex:number,lowerEntity:DisplayEntity,upperrEntity:DisplayEntity,dis:number = 100.0):void
    {
        if(this.m_rscene == null && sc != null)
        {
            this.m_rscene = sc;
            this.m_lowerEntity = lowerEntity;
            this.m_upperrEntity = upperrEntity;

            this.m_legModule = new SillyLowerBody();
            this.m_armModule = new SillyUpperBody();

            let offsetPos:Vector3D = new Vector3D(0.0,0.0,0.0);
            this.m_legModule.initialize(sc,renderProcessIndex, lowerEntity,offsetPos);
            offsetPos.y = dis;
            this.m_armModule.initialize(sc,renderProcessIndex, upperrEntity,offsetPos);

            this.m_moveModule.setSpeed(this.m_speed);
            this.m_moveModule.syncTargetUpdate = false;
            this.m_moveModule.syncDirecUpdate = false;
            this.m_moveModule.bindTarget(this.m_legModule.getContainer());
            this.m_moveModule.setVelocityFactor(0.02,0.03);

            this.m_motionModule = this.m_legModule;
            this.m_attackModule = this.m_armModule;
        }
    }
    wake():void
    {
        super.wake();
    }
    // 获得被击中位置
    getHitPos(outPos:Vector3D):void
    {
        outPos.copyFrom(this.position);
        outPos.y += 50;
    }
    // 获得被击毁位置
    getDestroyedPos(outPos:Vector3D):void
    {
        outPos.copyFrom(this.position);
        outPos.y += 30;
    }
    consume(power:number):void
    {
        this.lifeTime -= power;
        if(this.lifeTime < 1)
        {
            this.sleep();
        }
    }
    attackTest():boolean
    {
        return true;
    }
}