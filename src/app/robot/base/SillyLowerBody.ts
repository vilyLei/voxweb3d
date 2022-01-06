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
import IPoseture from "../../../app/robot/poseture/IPoseture";
import DegreeTween from "../../../vox/utils/DegreeTween";
import IAttackDst from "../../../app/robot/attack/IAttackDst";
import IRbtModule from "../../../app/robot/base/IRbtModule";

export default class SillyLowerBody implements IRbtModule, IPoseture {
    private m_sc: RendererScene = null;
    private m_container: DisplayEntityContainer = null;

    degreeTween: DegreeTween = new DegreeTween();
    constructor(container: DisplayEntityContainer = null) {
        if (container == null) {
            this.m_container = new DisplayEntityContainer();
        }
        else {
            this.m_container = container;
        }
    }
    setBrightness(brn: number): void {

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
    initialize(sc: RendererScene, renderProcessIndex: number, box: DisplayEntity, offsetPos: Vector3D = null): void {
        if (this.m_sc == null) {
            this.m_sc = sc;

            sc.addContainer(this.m_container, renderProcessIndex);
            //  let box:Box3DEntity = new Box3DEntity();
            //  box.initializeSizeXYZ(50,50,50);
            //  box.setXYZ(0.0, 25.0, 0.0);
            this.m_container.addEntity(box);

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
        this.m_container.update();
    }
    isResetFinish(): boolean {
        return true;
    }
    runToReset(): void {
        this.m_container.update();
    }
}