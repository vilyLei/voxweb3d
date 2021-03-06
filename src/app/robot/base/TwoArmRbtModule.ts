/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import Vector3D from "../../../vox/math/Vector3D";
import MathConst from "../../../vox/math/MathConst";
import DisplayEntity from "../../../vox/entity/DisplayEntity";
import Axis3DEntity from "../../../vox/entity/Axis3DEntity";
import DisplayEntityContainer from "../../../vox/entity/DisplayEntityContainer";
import RendererScene from "../../../vox/scene/RendererScene";
import TwoArmBone from "../../../app/robot/base/TwoArmBone";
import IPartStore from "../../../app/robot/IPartStore";
import IAttackDst from "../../../app/robot/attack/IAttackDst";
import DegreeTween from "../../../vox/utils/DegreeTween";
import TriggerClock from "../../../vox/utils/TriggerClock";
import WeapMoudle from "../../../app/robot/WeapMoudle";
import {CampType} from "../../../app/robot/camp/Camp";
import IRbtModule from "../../../app/robot/base/IRbtModule";

// tow arms
export default class TwoArmRbtModule implements IRbtModule
{
    private m_sc:RendererScene = null;
    private m_time:number = 0;
    private m_attPos:Vector3D = new Vector3D();
    private m_pos:Vector3D = new Vector3D();
    private m_tempV:Vector3D = new Vector3D();

    private m_bone:TwoArmBone = new TwoArmBone();
    private m_container:DisplayEntityContainer = null;
    private m_containerL:DisplayEntityContainer = new DisplayEntityContainer();
    private m_containerR:DisplayEntityContainer = new DisplayEntityContainer();
    private m_partStore:IPartStore = null;
    
    private m_timeSpeed:number = 3.0;
    private m_nextTime:number = 0;
    private m_testAxis:Axis3DEntity;

    private m_attackClock:TriggerClock = new TriggerClock();
    degreeTween:DegreeTween = new DegreeTween();
    weap:WeapMoudle = null;
    campType:CampType = CampType.Blue;
    constructor(container:DisplayEntityContainer = null)
    {
        if(container == null)
        {
            this.m_container = new DisplayEntityContainer();
        }
        else
        {
            this.m_container = container;
        }
    }
    getContainer():DisplayEntityContainer
    {
        return this.m_container;
    }
    
    setVisible(boo:boolean):void
    {
        this.m_container.setVisible(boo);
    }
    getVisible():boolean
    {
        return this.m_container.getVisible();
    }
    
    setAngleDirec(bgAngleDirec:number,sgAngleDirec:number):void
    {
        this.m_bone.setAngleDirec(bgAngleDirec, sgAngleDirec);
    }
    
    toPositive():void
    {
        this.m_bone.toPositive();
    }
    toNegative():void
    {
        this.m_bone.toNegative();
    }
    setRotationY(rotation:number):void
    {
        this.m_container.setRotationY(rotation);
    }
    getRotationY():number
    {
        return this.m_container.getRotationY();
    }
    initialize(sc:RendererScene,renderProcessIndex:number,partStore:IPartStore = null,offsetPos:Vector3D = null):void
    {
        if(this.m_sc == null && partStore != null)
        {
            this.m_timeSpeed = 3.0 * 0.7;
            this.m_sc = sc;
            this.m_partStore = partStore;
            sc.addContainer(this.m_container,renderProcessIndex);

            let halfW:number = partStore.getCoreWidth() * 0.5;

            let coreEntity:DisplayEntity = partStore.getEngityCore();
            let bgL:DisplayEntity = partStore.getEngityBGL();
            let bgR:DisplayEntity = partStore.getEngityBGR();
            let sgL:DisplayEntity = partStore.getEngitySGL();
            let sgR:DisplayEntity = partStore.getEngitySGR();
            this.m_container.addEntity(coreEntity);
            this.m_container.addChild(this.m_containerL);
            this.m_container.addChild(this.m_containerR);
            this.m_containerL.setZ(-halfW);
            this.m_containerR.setZ(halfW);
            this.m_containerL.addEntity(bgL);
            this.m_containerL.addEntity(sgL);
            this.m_containerR.addEntity(bgR);
            this.m_containerR.addEntity(sgR);
            /*
            let axis:Axis3DEntity = new Axis3DEntity();
            axis.initialize(30.0);
            axis.setXYZ(100,130,0.0);
            this.m_container.addEntity(axis);
            this.m_testAxis = axis;

            axis = new Axis3DEntity();
            axis.initialize(200.0);
            axis.setXYZ(0,30,0.0);
            this.m_container.addEntity(axis);
            //*/

            let pv:Vector3D = new Vector3D();
            pv.copyFrom(partStore.getCoreCenter());
            if(offsetPos != null)
            {
                pv.addBy(offsetPos);
            }
            this.m_bone.initialize(coreEntity, pv, 0.0);
            this.m_bone.setBG(bgL,bgR, partStore.getBGLong());
            this.m_bone.setSG(sgL,sgR);

            this.degreeTween.bindTarget(this.m_container);
            
            this.m_attackClock.setPeriod(12);
            this.m_attackClock.setTriggerTimeAt(0,6);
            this.m_attackClock.setTriggerTimeAt(1,3);
            this.weap = new WeapMoudle(sc);

        }
    }
    setXYZ(px:number,py:number,pz:number):void
    {
        this.m_container.setXYZ(px,py,pz);
    }
    setPosition(position:Vector3D):void
    {
        this.m_container.setPosition(position);
    }
    getPosition(position:Vector3D):void
    {
        this.m_container.getPosition(position);
    }
    getShootPosAt(index:number, outV:Vector3D,k:number):void
    {
        switch(index)
        {
            case 0:                        
                this.m_bone.getLEndPos(outV,k);
                break;
            case 1:                        
                this.m_bone.getREndPos(outV,k);
                break;
            default:
                break;

        }
    }
    setRecoilDegreeAt(index:number, degree:number):void
    {
        switch(index)
        {
            case 0:
                this.m_bone.setRecoilDegreeL(degree);
                break;
            case 1:
                this.m_bone.setRecoilDegreeR(degree);
                break;
            default:
                break;

        }
    }
    isAttackLock():boolean
    {
        return this.degreeTween.testDegreeDis(2.0);
    }
    direcByDegree(degree:number,finished:boolean):void
    {
        this.degreeTween.runRotY(degree);
        if(this.degreeTween.isDegreeChanged())
        {
            this.m_container.update();
        }
    }
    direcByPos(pos:Vector3D,finished:boolean):void
    {
        this.degreeTween.runRotYByDstPos(pos);
        if(this.degreeTween.isDegreeChanged())
        {
            this.m_container.update();
        }
    }
    private m_attackDst:IAttackDst = null;
    private m_dstDegree:number = 0;
    setDstDirecDegree(dstDegree:number):void
    {
        this.m_dstDegree = dstDegree;
    }
    setAttackDst(attackDst:IAttackDst):void
    {
        this.m_attackDst = attackDst;
        if(attackDst != null)this.m_attackDst.getHitPos(this.m_attPos);
    }
    setAttPos(position:Vector3D):void
    {
        this.m_attPos.copyFrom(position);
    }
    setAttPosXYZ(px:number,py:number,pz:number):void
    {
        this.m_attPos.setXYZ(px,py,pz);
    }
    getAttPos():Vector3D
    {
        return this.m_attPos;
    }
    private updateAttackPose():void
    {
        this.direcByPos(this.m_attPos,false);

        this.m_container.getInvMatrix().transformOutVector3(this.m_attPos, this.m_tempV);
        this.m_tempV.y = 0.0;
        let kf:number = this.m_tempV.dot(Vector3D.X_AXIS);
        if(kf > 50.0)
        {
            this.m_containerL.getPosition(this.m_pos);
            this.m_tempV.scaleVecTo(Vector3D.X_AXIS,kf);
            let degree:number = MathConst.GetDegreeByXY(this.m_pos.x - this.m_tempV.x, this.m_tempV.z - this.m_pos.z) + 180;

            this.m_containerL.setRotationY(degree);
            this.m_containerL.update();
            this.m_containerR.setRotationY(-degree);
            this.m_containerR.update();
            
            this.m_containerL.getInvMatrix().transformOutVector3(this.m_attPos, this.m_tempV);
            let py:number = this.m_tempV.y;
            this.m_tempV.y = 0.0;
            kf = this.m_tempV.dot(Vector3D.X_AXIS);
            if(kf > 15.0)
            {
                this.m_tempV.scaleVecTo(Vector3D.X_AXIS, kf);
                this.m_tempV.y = py;
                this.m_bone.setAttLPos(this.m_tempV);
            }

            this.m_containerR.getInvMatrix().transformOutVector3(this.m_attPos, this.m_tempV);
            //console.log("R m_tempV.y: "+this.m_tempV);
            py = this.m_tempV.y;
            this.m_tempV.y = 0.0;
            kf = this.m_tempV.dot(Vector3D.X_AXIS);
            if(kf > 15.0)
            {
                this.m_tempV.scaleVecTo(Vector3D.X_AXIS, kf);
                this.m_tempV.y = py;
                this.m_bone.setAttRPos(this.m_tempV);
            }
        }
    }
    resetPose():void
    {
        this.m_bone.resetPose();
        this.m_time = this.m_bone.getOriginTime();
    }
    resetNextOriginPose():void
    {
        this.m_nextTime = this.m_bone.getNextOriginTime(this.m_time);
    }
    private m_beginPos:Vector3D = new Vector3D();
    private attack():void
    {
        this.m_attackClock.run();
        if(this.isAttackLock())
        {
            let index:number = this.m_attackClock.getTriggerIndex();
            if(index > -1)
            {
                // attack 姿态控制
                this.getShootPosAt(index,this.m_beginPos,1.0);
                this.setRecoilDegreeAt(index, 8);
                this.weap.createAtt(0,this.m_beginPos,this.m_attPos, this.m_attackDst, this.campType);
            }
        }
    }
    run(moveEnabled:boolean):void
    {
        let attacking:boolean = this.m_attackDst != null;
        if(attacking)
        {
            this.updateAttackPose();
        }
        else
        {
            this.direcByDegree(this.m_dstDegree,false);
        }
        this.m_container.update();
        if(moveEnabled || this.degreeTween.isRunning())
        {
            this.m_bone.runAtt(this.m_time, true);
            this.m_time += this.m_timeSpeed;
        }
        else
        {
            this.m_bone.runAtt(this.m_time, false);
        }
        if(attacking)
        {
            this.attack();
        }
    }
    update():void
    {
        this.m_container.update();
    }
    isResetFinish():boolean
    {
        return this.m_time >= this.m_nextTime;
    }
    isPoseRunning():boolean
    {
        return true;
    }
    runToReset():void
    {
        if(this.m_time >= this.m_nextTime)
        {
            this.m_time = this.m_nextTime;
        }
        this.m_container.update();
        this.m_bone.run(this.m_time);
        this.m_time += this.m_timeSpeed;
    }
}