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
import IAttackDst from "../../../app/robot/attack/IAttackDst";
import TriggerClock from "../../../vox/utils/TriggerClock";
import WeapMoudle from "../../../app/robot/WeapMoudle";
import { CampType } from "../../../app/robot/camp/Camp";
import MaterialBase from "../../../vox/material/MaterialBase";
import {RoleMaterialBuilder} from "../scene/RoleMaterialBuilder";
import Color4 from "../../../vox/material/Color4";

export default class TrackWheelWeaponBody {

    private static s_box01: Box3DEntity = null;
    private static s_box02: Box3DEntity = null;

    private m_pos: Vector3D = new Vector3D();

    private m_entity01: DisplayEntity = null;
    private m_entity02: DisplayEntity = null;

    private m_parentContainer: DisplayEntityContainer = null;
    private m_container: DisplayEntityContainer = null;

    private m_attackClock: TriggerClock = new TriggerClock();
    private m_weapType: number = 0;
    
    materialBuilder: RoleMaterialBuilder = null;
    weap: WeapMoudle = null;
    campType: CampType = CampType.Blue;

    constructor(container: DisplayEntityContainer = null) {
        if (container == null) {
            this.m_container = new DisplayEntityContainer();
        }
        else {
            this.m_container = container;
        }
    }
    
    setBrightness(brn: number, color: Color4): void {

        if(this.m_entity01 != null) {
            (this.m_entity01.getMaterial() as any).setRGB3f(color.r * brn, color.g * brn, color.b * brn);
        }
        if(this.m_entity02 != null) {
            (this.m_entity02.getMaterial() as any).setRGB3f(color.r * brn, color.g * brn, color.b * brn);
        }
    }
    getContainer(): DisplayEntityContainer {
        return this.m_container;
    }

    setVisible(boo: boolean): void {
        this.m_container.setVisible(boo);
    }
    getVisible(): boolean {
        return this.m_container.getVisible();
    }

    setRotationY(rotation: number): void {
        this.m_container.setRotationY(rotation);
    }
    getRotationY(): number {
        return this.m_container.getRotationY();
    }
    initWeap01(tex0: TextureProxy): void {
        
        let height: number = 30.0;
        if (TrackWheelWeaponBody.s_box01 == null) {
            TrackWheelWeaponBody.s_box01 = new Box3DEntity();
            let material = this.materialBuilder.createMaterial(tex0);
            TrackWheelWeaponBody.s_box01.setMaterial( material );
            TrackWheelWeaponBody.s_box01.initializeSizeXYZ(60.0, 30, 60, [tex0]);
            let mat4: Matrix4 = new Matrix4();
            mat4.identity();
            mat4.setScaleXYZ(1.0, 1.1, 1.0);
            mat4.appendTranslationXYZ(0.0, 0.5 * height * 0.1, 0.0);
            TrackWheelWeaponBody.s_box01.transformFaceAt(2, mat4);
            TrackWheelWeaponBody.s_box01.reinitializeMesh();
        }
        let twUpperBox: Box3DEntity = new Box3DEntity();
        let material = this.materialBuilder.createMaterial(tex0);
        twUpperBox.setMaterial( material );
        twUpperBox.copyMeshFrom(TrackWheelWeaponBody.s_box01);
        twUpperBox.initializeSizeXYZ(60.0, height, 60, [tex0]);
        twUpperBox.setXYZ(0.0, 75.0, 0.0);


        this.m_entity01 = twUpperBox;
        this.m_weapType = 0;
    }
    initWeap02(tex0: TextureProxy): void {

        if (TrackWheelWeaponBody.s_box01 == null) {
            let scale: number = 1.0;
            let box: Box3DEntity = new Box3DEntity();
            let material = this.materialBuilder.createMaterial(tex0);
            box.setMaterial( material );
            box.initializeSizeXYZ(80.0, 20, 60, [tex0]);
            box.setXYZ(0.0, 70.0, 0.0);
            box.setScaleXYZ(scale, scale, scale);
            let mat4: Matrix4 = new Matrix4();
            mat4.identity();
            mat4.setScaleXYZ(0.7, 1.0, 0.9);
            mat4.appendTranslationXYZ(-8.0, 0.0, 0.0);
            box.transformFaceAt(0, mat4);
            box.reinitializeMesh();
            TrackWheelWeaponBody.s_box01 = box;

            box = new Box3DEntity();
            box.setMaterial( material );
            box.initializeSizeXYZ(80.0, 12, 60, [tex0]);
            box.setXYZ(0.0, 70.0 + 10 + 6, 0.0);
            box.setScaleXYZ(scale, scale, scale);
            mat4 = new Matrix4();
            mat4.identity();
            mat4.setScaleXYZ(0.6, 1.0, 0.8);
            mat4.appendTranslationXYZ(-20.0, 0.0, 0.0);
            box.transformFaceAt(1, mat4);
            box.reinitializeMesh();
            TrackWheelWeaponBody.s_box02 = box;

        }
        //let color = this.color;
        let twUpperBox: Box3DEntity = new Box3DEntity();
        let material = this.materialBuilder.createMaterial(tex0);
        //material.setRGB3f(color.r, color.g, color.b);
        twUpperBox.setMaterial( material );
        twUpperBox.copyMeshFrom(TrackWheelWeaponBody.s_box01);
        twUpperBox.copyTransformFrom(TrackWheelWeaponBody.s_box01);
        twUpperBox.initializeSizeXYZ(60.0, 30, 60, [tex0]);
        this.m_entity01 = twUpperBox;

        twUpperBox = new Box3DEntity();
        material = this.materialBuilder.createMaterial(tex0);
        //material.setRGB3f(color.r, color.g, color.b);
        twUpperBox.setMaterial( material );
        twUpperBox.copyMeshFrom(TrackWheelWeaponBody.s_box02);
        twUpperBox.copyTransformFrom(TrackWheelWeaponBody.s_box02);
        twUpperBox.initializeSizeXYZ(60.0, 30, 60, [tex0]);
        this.m_entity02 = twUpperBox;

        this.m_weapType = 1;
    }
    initialize(sc: RendererScene, parentContainer: DisplayEntityContainer, offsetPos: Vector3D = null): void {
        if (this.m_parentContainer == null) {
            this.m_parentContainer = parentContainer;
            parentContainer.addChild(this.m_container);
            if (this.m_weapType == 0) {
                this.m_container.addEntity(this.m_entity01);
            }
            else if (this.m_weapType == 1) {
                this.m_container.addEntity(this.m_entity01);
                this.m_container.addEntity(this.m_entity02);
                this.m_container.setScaleXYZ(1.5, 1.3, 1.7);
                this.m_container.setXYZ(0.0, -50.0, 0.0);
            }

            let pv: Vector3D = new Vector3D();
            if (offsetPos != null) {
                pv.addBy(offsetPos);
            }

            this.m_attackClock.setPeriod(16);
            this.m_attackClock.setTriggerTimeAt(0, 6);
            this.weap = new WeapMoudle(sc);
        }
    }
    getPosition(position: Vector3D): void {
        this.m_container.getPosition(position);
    }

    private m_beginPos: Vector3D = new Vector3D();
    run(attackDst: IAttackDst, degreeDis: number, attPos: Vector3D): void {
        this.m_attackClock.run();
        if (degreeDis < 2.0) {
            let index: number = this.m_attackClock.getTriggerIndex();
            if (index > -1) {
                this.m_parentContainer.getPosition(this.m_beginPos);
                this.m_entity01.getPosition(this.m_pos);
                this.m_beginPos.y += this.m_pos.y + 10;
                //  attack 姿态控制
                this.weap.createAtt(0, this.m_beginPos, attPos, attackDst, this.campType);
            }
        }
    }
}