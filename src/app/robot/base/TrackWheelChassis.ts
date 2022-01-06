/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import Vector3D from "../../../vox/math/Vector3D";
import DisplayEntityContainer from "../../../vox/entity/DisplayEntityContainer";
import RendererScene from "../../../vox/scene/RendererScene";
import IPoseture from "../../../app/robot/poseture/IPoseture";
import DegreeTween from "../../../vox/utils/DegreeTween";
import IAttackDst from "../../../app/robot/attack/IAttackDst";
import IRbtModule from "../../../app/robot/base/IRbtModule";
import TrackWheelChassisBody from "../../../app/robot/base/TrackWheelChassisBody";
import AssetsModule from "../../../app/robot/assets/AssetsModule";
import BoxGroupTrack from "../../../voxanimate/primitive/BoxGroupTrack";
import { RoleMaterialBuilder } from "../scene/RoleMaterialBuilder";
import { VertUniformComp } from "../../../vox/material/component/VertUniformComp";
import MaterialBase from "../../../vox/material/MaterialBase";
import DisplayEntity from "../../../vox/entity/DisplayEntity";

export default class TrackWheelChassis implements IRbtModule, IPoseture {
    private m_sc: RendererScene = null;
    private m_container: DisplayEntityContainer = null;
    private m_trackWheel: BoxGroupTrack = null;
    private m_pos: Vector3D = new Vector3D();
    private m_trackEntity: DisplayEntity = null;
    private m_vertUniform: VertUniformComp = null;
    private m_trackMoveDis: number = 0.0;

    materialBuilder: RoleMaterialBuilder = null;
    degreeTween: DegreeTween = new DegreeTween();
    constructor(container: DisplayEntityContainer = null) {
        if (container == null) {
            this.m_container = new DisplayEntityContainer();
        }
        else {
            this.m_container = container;
        }
    }
    getContainer(): DisplayEntityContainer {
        return this.m_container;
    }
    setAttackDst(dst: IAttackDst): void {

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
    direcByDegree(degree: number, finished: boolean): void {

        this.m_trackMoveDis += 0.75;
        this.m_vertUniform.setCurveMoveDistance(this.m_trackMoveDis);
        if (this.m_trackWheel != null) this.m_trackWheel.moveDistanceOffset(0.75);

        this.degreeTween.runRotY(degree);
        if (this.degreeTween.isDegreeChanged()) {
            this.m_container.update();
        }
    }
    direcByPos(pos: Vector3D, finished: boolean): void {
        this.degreeTween.runRotYByDstPos(pos);
        if (this.degreeTween.isDegreeChanged()) {
            this.m_container.update();
        }
    }
    setDstDirecDegree(degree: number): void {
    }
    isPoseRunning(): boolean {
        return false;
    }

    initialize(sc: RendererScene, renderProcessIndex: number, chassisBody: TrackWheelChassisBody, srcTrackWheel: BoxGroupTrack, dis: number, offsetPos: Vector3D = null): void {
        if (this.m_sc == null) {
            this.m_sc = sc;
            //createTrackLambertMaterial
            sc.addContainer(this.m_container, renderProcessIndex);
            // this.m_trackWheel = new BoxGroupTrack();
            // this.m_trackWheel.initializeFrom(srcTrackWheel, [AssetsModule.GetImageTexByUrl("static/assets/metal_02.jpg")]);

            srcTrackWheel.getPosition(this.m_pos);
            this.m_pos.addBy(offsetPos);

            let material: MaterialBase;
            let tm = this.materialBuilder.createTrackLambertMaterial(srcTrackWheel, AssetsModule.GetImageTexByUrl("static/assets/metal_02.jpg"));
            this.m_vertUniform = tm.vertUniform as VertUniformComp;
            material = tm;

            this.m_trackEntity = new DisplayEntity();
            this.m_trackEntity.setMaterial(material);
            this.m_trackEntity.copyMeshFrom(srcTrackWheel.animator);
            this.m_trackEntity.setPosition(this.m_pos);
            this.m_container.addEntity(this.m_trackEntity);

            // this.m_trackWheel.setPosition(this.m_pos);
            // this.m_container.addEntity(this.m_trackWheel.animator);
            this.degreeTween.bindTarget(this.m_container);
        }
    }
    setXYZ(px: number, py: number, pz: number): void {
        this.m_container.setXYZ(px, py, pz);
    }
    setPosition(position: Vector3D): void {
        this.m_container.setPosition(position);
    }
    getPosition(position: Vector3D): void {
        this.m_container.getPosition(position);
    }
    resetPose(): void {

    }
    resetNextOriginPose(): void {
    }
    run(moveEnabled: boolean): void {
        console.log("chassis run...");
        this.m_container.update();
    }
    isResetFinish(): boolean {
        return true;
    }
    runToReset(): void {
        this.m_container.update();
    }
}