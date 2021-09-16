
/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/
// 摄像机拉近拉远的控制(主要是移动端的多点触摸)

import Vector3D from "../../vox/math/Vector3D";
import IRenderStage3D from "../../vox/render/IRenderStage3D";
import CameraBase from "../../vox/view/CameraBase";
import DivLog from "../../vox/utils/DivLog";
import MouseEvent from "../../vox/event/MouseEvent";

export default class CameraZoomController {
    private m_camera: CameraBase = null;

    private m_touchZoomBoo: boolean = false;
    private m_preDis: number = 0;
    private m_touchZoomSpd: number = 2.0;
    private m_slideSpd: number = 1.0;
    private m_mouseWheelZoomSpd: number = 0.5;
    private m_tempa: Vector3D = new Vector3D();
    private m_tempb: Vector3D = new Vector3D();
    private m_preva: Vector3D = new Vector3D();
    private m_prevb: Vector3D = new Vector3D();
    private m_va: Vector3D = new Vector3D();
    private m_vb: Vector3D = new Vector3D();
    private m_lookAt: Vector3D = new Vector3D();
    private m_fowardDis: number = 0;
    private m_initBoo: boolean = true;
    private m_lookAtCtrlEnabled: boolean = true;
    private m_flagDrag: number = 0;
    private m_flagZoom: number = 0;
    private m_flagType: number = 2;
    constructor() { }
    setMobileZoomSpeed(spd: number) {
        this.m_touchZoomSpd = spd;
    }
    seSlideSpeed(spd: number) {
        this.m_slideSpd = spd;
    }
    setMouseWheelZoomSpd(spd: number) {
        this.m_mouseWheelZoomSpd = spd;
    }
    bindCamera(camera: CameraBase) {
        this.m_camera = camera;
    }
    initialize(stage3D: IRenderStage3D): void {
        if (this.m_initBoo) {
            this.m_initBoo = false;
            stage3D.addEventListener(MouseEvent.MOUSE_WHEEL, this, this.mouseWheelListener, true, true);
            stage3D.addEventListener(MouseEvent.MOUSE_MULTI_MOVE, this, this.mouseMultiMoveListener, true, true);
            stage3D.addEventListener(MouseEvent.MOUSE_MULTI_UP, this, this.mouseMultiUpListener, true, true);
        }
    }
    setLookAtCtrlEnabled(enabled: boolean): void {
        this.m_lookAtCtrlEnabled = enabled;
    }
    private mouseWheelListener(evt: any): void {
        this.m_fowardDis = (evt.wheelDeltaY * this.m_mouseWheelZoomSpd);
    }
    private mouseMultiMoveListener(evt: any): void {
        this.setTouchPosArray(evt.posArray);
    }
    private mouseMultiUpListener(evt: any): void {
        this.setTouchPosArray(evt.posArray);
    }
    private resetState(): void {
        this.m_flagDrag = 0;
        this.m_flagZoom = 0;
        this.m_flagType = 0;
    }
    private setTouchPosArray(posArray: any[]): void {
        if (posArray != null && posArray.length > 1) {
            let dis: number = 0;
            this.m_va.setXYZ(posArray[0].x, posArray[0].y, 0);
            this.m_vb.setXYZ(posArray[1].x, posArray[1].y, 0);
            if (this.m_touchZoomBoo) {
                dis = Vector3D.Distance(this.m_va, this.m_vb);
                if (this.m_flagType < 1) {

                    this.m_tempa.copyFrom(this.m_va);
                    this.m_tempb.copyFrom(this.m_vb);
                    this.m_tempa.subVecsTo(this.m_va, this.m_preva);
                    this.m_tempb.subVecsTo(this.m_vb, this.m_prevb);
                    this.m_tempa.normalize();
                    this.m_tempb.normalize();
                    if (this.m_tempa.dot(this.m_tempb) > 0.9) {
                        // 可能是拖动
                        this.m_flagDrag++;
                    }
                    else {
                        // 可能是缩放
                        this.m_flagZoom++;
                    }
                    //DivLog.ShowLog("> "+this.m_flagDrag+","+this.m_flagZoom);
                    if (this.m_flagDrag > 3 || this.m_flagZoom > 3) {
                        this.m_flagType = (this.m_flagDrag > this.m_flagZoom) ? 1 : 2;
                    }
                }
                else {
                    this.m_tempa.subVecsTo(this.m_va, this.m_preva);
                }
                let dv: number = Math.abs(this.m_preDis - dis);
                if (dv > 0.1) {
                    this.m_fowardDis = (dis - this.m_preDis) * this.m_touchZoomSpd;
                    this.m_preDis = dis;
                }
            }
            else {
                this.m_touchZoomBoo = true;
                this.m_preDis = Vector3D.Distance(this.m_va, this.m_vb);
                this.resetState();
            }
        }
        else {
            this.resetState();
            this.m_touchZoomBoo = false;
        }
        this.m_preva.copyFrom(this.m_va);
        this.m_prevb.copyFrom(this.m_vb);
    }
    run(lookAtPos: Vector3D, minDis: number): void {
        let lookAtEnabled: boolean = this.m_lookAtCtrlEnabled;
        if (lookAtPos == null) {
            lookAtPos = this.m_lookAt;
        }

        if (this.m_camera != null) {
            if (this.m_flagType == 2) {
                if (this.m_fowardDis > 0) {
                    if (Vector3D.Distance(this.m_camera.getPosition(), this.m_camera.getLookAtPosition()) > minDis) {
                        this.m_camera.forward(this.m_fowardDis);
                        if (lookAtEnabled) this.m_camera.setLookPosXYZFixUp(lookAtPos.x, lookAtPos.y, lookAtPos.z);
                    }
                    this.m_fowardDis = 0;
                }
                else if (this.m_fowardDis < -0.001) {
                    this.m_camera.forward(this.m_fowardDis);
                    if (lookAtEnabled) this.m_camera.setLookPosXYZFixUp(lookAtPos.x, lookAtPos.y, lookAtPos.z);
                    this.m_fowardDis = 0;
                }
            }
            else if (this.m_flagType == 1) {
                // drag to slide
                this.m_camera.slideViewOffsetXY(-this.m_tempa.x * this.m_slideSpd, this.m_tempa.y * this.m_slideSpd);
            }
        }
    }
}