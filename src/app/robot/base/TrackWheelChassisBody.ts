/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import Vector3D from "../../../vox/math/Vector3D";
import Matrix4 from "../../../vox/math/Matrix4";
import TextureProxy from "../../../vox/texture/TextureProxy";
import DisplayEntity from "../../../vox/entity/DisplayEntity";
import Box3DEntity from "../../../vox/entity/Box3DEntity";
import DisplayEntityContainer from "../../../vox/entity/DisplayEntityContainer";
import RendererScene from "../../../vox/scene/RendererScene";
import WeapMoudle from "../../../app/robot/WeapMoudle";
import {CampType} from "../../../app/robot/camp/Camp";

export default class TrackWheelChassisBody
{
    private m_pos:Vector3D = new Vector3D();
    private m_entity01:DisplayEntity = null;
    private m_entity02:DisplayEntity = null;

    private m_parentContainer:DisplayEntityContainer = null;
    private m_container:DisplayEntityContainer = null;
    
    //private m_attackClock:TriggerClock = null;// ew TriggerClock();
    private m_weapType:number = 0;
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
    
    setRotationY(rotation:number):void
    {
        this.m_container.setRotationY(rotation);
    }
    getRotationY():number
    {
        return this.m_container.getRotationY();
    }
    private static m_box01:Box3DEntity = null;
    private static m_box02:Box3DEntity = null;
    initWeap01(tex0:TextureProxy):void{
        if(TrackWheelChassisBody.m_box01 == null)
        {
            TrackWheelChassisBody.m_box01 = new Box3DEntity();
            TrackWheelChassisBody.m_box01.initializeSizeXYZ(60.0,30,60,[tex0]);
            TrackWheelChassisBody.m_box01.setXYZ(0.0,70.0,0.0);
        }
        let twUpperBox:Box3DEntity = new Box3DEntity();
        twUpperBox.copyMeshFrom(TrackWheelChassisBody.m_box01);
        twUpperBox.initializeSizeXYZ(60.0,30,60,[tex0]);
        twUpperBox.setXYZ(0.0,70.0,0.0);
        this.m_entity01 = twUpperBox;
        this.m_weapType = 0;
    }
    initWeap02(tex0:TextureProxy):void{
        if(TrackWheelChassisBody.m_box01 == null)
        {
            let scale:number = 1.0;
            let box:Box3DEntity = new Box3DEntity();
            box.initializeSizeXYZ(80.0, 20, 60, [tex0]);
            box.setXYZ(0.0,70.0,0.0);
            box.setScaleXYZ(scale, scale, scale);
            let mat4:Matrix4 = new Matrix4();
            mat4.identity();
            mat4.setScaleXYZ(0.7,1.0,0.9);
            mat4.appendTranslationXYZ(-8.0,0.0,0.0);
            box.transformFaceAt(0,mat4);
            box.reinitializeMesh();
            TrackWheelChassisBody.m_box01 = box;

            box = new Box3DEntity();
            box.initializeSizeXYZ(80.0, 12, 60, [tex0]);
            box.setXYZ(0.0,70.0 + 10 + 6,0.0);                    
            box.setScaleXYZ(scale, scale, scale);
            mat4 = new Matrix4();
            mat4.identity();
            mat4.setScaleXYZ(0.6,1.0,0.8);
            mat4.appendTranslationXYZ(-20.0,0.0,0.0);
            box.transformFaceAt(1,mat4);
            box.reinitializeMesh();
            TrackWheelChassisBody.m_box02 = box;
            
        }
        let twUpperBox:Box3DEntity = new Box3DEntity();
        twUpperBox.copyMeshFrom(TrackWheelChassisBody.m_box01);
        twUpperBox.copyTransformFrom(TrackWheelChassisBody.m_box01);
        twUpperBox.initializeSizeXYZ(60.0,30,60,[tex0]);
        this.m_entity01 = twUpperBox;

        twUpperBox = new Box3DEntity();
        twUpperBox.copyMeshFrom(TrackWheelChassisBody.m_box02);
        twUpperBox.copyTransformFrom(TrackWheelChassisBody.m_box02);
        twUpperBox.initializeSizeXYZ(60.0,30,60,[tex0]);
        this.m_entity02 = twUpperBox;

        this.m_weapType = 1;
    }
    initialize(sc:RendererScene,parentContainer:DisplayEntityContainer,offsetPos:Vector3D = null):void
    {
        if(this.m_parentContainer == null)
        {
            this.m_parentContainer = parentContainer;
            parentContainer.addChild(this.m_container);
            if(this.m_weapType == 0)
            {
                this.m_container.addEntity(this.m_entity01);
            }
            else if(this.m_weapType == 1)
            {
                this.m_container.addEntity(this.m_entity01);
                this.m_container.addEntity(this.m_entity02);
                this.m_container.setScaleXYZ(1.5, 1.3, 1.7);
                this.m_container.setXYZ(0.0,-50.0,0.0);
            }
        }
    }
    getPosition(position:Vector3D):void
    {
        this.m_container.getPosition(position);
    }
}