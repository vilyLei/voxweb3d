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

export default class TrackWheelChassis implements IRbtModule, IPoseture {
    private m_sc: RendererScene = null;
    private m_container: DisplayEntityContainer = null;
    private m_trackWheelL: BoxGroupTrack = new BoxGroupTrack();
    private m_trackWheelR: BoxGroupTrack = new BoxGroupTrack();
    private m_pos: Vector3D = new Vector3D();

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
        this.m_trackWheelL.moveDistanceOffset(0.75);
        this.m_trackWheelR.moveDistanceOffset(0.75);
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

            sc.addContainer(this.m_container, renderProcessIndex);
            this.m_trackWheelL.initializeFrom(srcTrackWheel, [AssetsModule.GetImageTexByUrl("static/assets/metal_02.jpg")]);
            srcTrackWheel.getPosition(this.m_pos);
            this.m_pos.z -= 0.5 * dis;
            this.m_pos.addBy( offsetPos );
            this.m_trackWheelL.setPosition(this.m_pos);
            this.m_container.addEntity(this.m_trackWheelL.animator);

            this.m_trackWheelR.initializeFrom(srcTrackWheel, [AssetsModule.GetImageTexByUrl("static/assets/metal_02.jpg")]);
            srcTrackWheel.getPosition(this.m_pos);
            this.m_pos.z += 0.5 * dis;
            this.m_pos.addBy( offsetPos );
            this.m_trackWheelR.setPosition(this.m_pos);
            this.m_container.addEntity(this.m_trackWheelR.animator);

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