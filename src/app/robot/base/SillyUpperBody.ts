/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import Vector3D from "../../../vox/math/Vector3D";
import DisplayEntity from "../../../vox/entity/DisplayEntity";
import DisplayEntityContainer from "../../../vox/entity/DisplayEntityContainer";
import RendererScene from "../../../vox/scene/RendererScene";
import IAttackDst from "../../../app/robot/attack/IAttackDst";
import DegreeTween from "../../../vox/utils/DegreeTween";;
import {CampType} from "../../../app/robot/camp/Camp";
import IRbtModule from "../../../app/robot/base/IRbtModule";

export default class SillyUpperBody implements IRbtModule
{
    private m_sc:RendererScene = null;
    private m_time:number = 0;
    private m_attPos:Vector3D = new Vector3D();
    private m_pos:Vector3D = new Vector3D();
    private m_tempV:Vector3D = new Vector3D();

    private m_container:DisplayEntityContainer = null;
    
    degreeTween:DegreeTween = new DegreeTween();
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
    
    setRotationY(rotation:number):void
    {
        this.m_container.setRotationY(rotation);
    }
    getRotationY():number
    {
        return this.m_container.getRotationY();
    }
    initialize(sc:RendererScene,renderProcessIndex:number,box:DisplayEntity,offsetPos:Vector3D = null):void
    {
        if(this.m_sc == null)
        {
            this.m_sc = sc;
            sc.addContainer(this.m_container,renderProcessIndex);
            this.m_container.addEntity(box);

            //  let axis:Axis3DEntity = new Axis3DEntity();
            //  axis.initialize(30.0);
            //  axis.setXYZ(100,130,0.0);
            //  this.m_container.addEntity(axis);
            //  
            //  this.m_testAxis = axis;

            //  axis = new Axis3DEntity();
            //  axis.initialize(200.0);
            //  axis.setXYZ(0,30,0.0);
            //  this.m_container.addEntity(axis);


            let pv:Vector3D = new Vector3D();
            if(offsetPos != null)
            {
                pv.addBy(offsetPos);
            }

            this.degreeTween.bindTarget(this.m_container);                    
            
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
    }
    resetPose():void
    {
    }
    resetNextOriginPose():void
    {
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
        
    }
    update():void
    {
        this.m_container.update();
    }
    isResetFinish():boolean
    {
        return true;
    }
    isPoseRunning():boolean
    {
        return true;
    }
    runToReset():void
    {
    }
}