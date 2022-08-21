/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import IVector3D from "../../../vox/math/IVector3D";
// import ILine from "../../ageom/base/ILine";
import IMatrix4 from "../../../vox/math/IMatrix4";

import IEntityTransform from "../../../vox/entity/IEntityTransform";

import IEvtDispatcher from "../../../vox/event/IEvtDispatcher";

import ITransformEntity from "../../../vox/entity/ITransformEntity";
import IColor4 from "../../../vox/material/IColor4";
// import { IRayControl } from "../../../voxeditor/base/IRayControl";
import IRawMesh from "../../../vox/mesh/IRawMesh";

import { CoMaterialContextParam, ICoRScene } from "../../voxengine/ICoRScene";
import { ICoMath } from "../../math/ICoMath";
import { ICoAGeom } from "../../ageom/ICoAGeom";

declare var CoRScene: ICoRScene;
declare var CoMath: ICoMath;
declare var CoAGeom: ICoAGeom;
/**
 * 在三个坐标轴上拖动
 */
// export default class DragAxis implements IRayControl {
export default class DragAxis {

    private m_targetEntity: IEntityTransform = null;
    private m_dispatcher: IEvtDispatcher;
    private m_targetPosOffset: IVector3D = CoMath.createVec3();
    private m_entity: ITransformEntity = null;
    uuid: string = "DragAxis";
    moveSelfEnabled = true;
    outColor = CoRScene.createColor4(0.9, 0.9, 0.9, 1.0);
    overColor = CoRScene.createColor4(1.0, 1.0, 1.0, 1.0);

    constructor() {
    }
    setVisible(visible: boolean): void {
        this.m_entity.setVisible(visible);
    }
    getVisible(): boolean {
        return this.m_entity.getVisible();
    }

    setEntity(entity: ITransformEntity): void {
        this.m_entity = entity;
    }
    addEventListener(type: number, listener: any, func: (evt: any) => void, captureEnabled: boolean = true, bubbleEnabled: boolean = false): void {
        this.m_dispatcher.addEventListener(type, listener, func, captureEnabled, bubbleEnabled);
    }
    removeEventListener(type: number, listener: any, func: (evt: any) => void): void {
        this.m_dispatcher.removeEventListener(type, listener, func);
    }
    setTargetPosOffset(offset: IVector3D): void {
        this.m_targetPosOffset.copyFrom(offset);
    }
    setTarget(target: IEntityTransform): void {
        this.m_targetEntity = target;
    }
    initializeEvent(): void {

        if (this.m_dispatcher == null) {
            const me = CoRScene.MouseEvent;
            let dispatcher = CoRScene.createMouseEvt3DDispatcher();
            dispatcher.addEventListener(me.MOUSE_DOWN, this, this.mouseDownListener);
            dispatcher.addEventListener(me.MOUSE_OVER, this, this.mouseOverListener);
            dispatcher.addEventListener(me.MOUSE_OUT, this, this.mouseOutListener);
            this.m_entity.setEvtDispatcher(dispatcher);
            this.m_dispatcher = dispatcher;
        }
        this.m_entity.mouseEnabled = true;
    }
    protected mouseOverListener(evt: any): void {
        console.log("DragAxis::mouseOverListener() ...");
        this.showOverColor();
    }
    protected mouseOutListener(evt: any): void {
        console.log("DragAxis::mouseOutListener() ...");
        this.showOutColor();
    }
    showOverColor(): void {
        // (this.getMaterial() as any).setRGBA4f(this.overColor.r, this.overColor.g, this.overColor.b, this.overColor.a);
    }
    showOutColor(): void {
        // (this.getMaterial() as any).setRGBA4f(this.outColor.r, this.outColor.g, this.outColor.b, this.outColor.a);
    }
    isSelected(): boolean {
        return this.m_flag > -1;
    }
    select(): void {
    }
    deselect(): void {
        this.m_flag = -1;
    }
    destroy(): void {
        this.m_targetEntity = null;
        if (this.m_entity != null) {
            this.m_entity.destroy();
            this.m_entity = null;
        }
        if (this.m_dispatcher != null) {
            this.m_dispatcher.destroy();
            this.m_dispatcher = null;
        }
    }
    setPosition(pos: IVector3D): void {
        this.m_entity.setPosition(pos);
    }
    getPosition(outPos: IVector3D): void {
        this.m_entity.getPosition(outPos);
    }
    update(): void {
        this.m_entity.update();
    }

    private m_flag: number = -1;
    private m_axis_pv: IVector3D = CoMath.createVec3();
    private m_axis_tv: IVector3D = CoMath.createVec3();
    private m_initPos: IVector3D = CoMath.createVec3();
    private m_pos: IVector3D = CoMath.createVec3();
    private m_dv: IVector3D = CoMath.createVec3();
    private m_outV: IVector3D = CoMath.createVec3();
    private m_initV: IVector3D = CoMath.createVec3();

    private m_mat4: IMatrix4 = CoMath.createMat4();
    private m_invMat4: IMatrix4 = CoMath.createMat4();
    private calcClosePos(rpv: IVector3D, rtv: IVector3D): void {

        if (this.m_flag > -1) {
            let mat4 = this.m_invMat4;
            mat4.transformVector3Self(rpv);
            mat4.deltaTransformVectorSelf(rtv);
            let outV = this.m_outV;
            CoAGeom.Line.CalcTwoSLCloseV2(rpv, rtv, this.m_axis_pv, this.m_axis_tv, outV);
            mat4 = this.m_mat4;
            mat4.transformVector3Self(outV);
        }
    }
    private m_rpv = CoMath.createVec3();
    private m_rtv = CoMath.createVec3();
    public moveByRay(rpv: IVector3D, rtv: IVector3D): void {

        if (this.m_flag > -1) {

            this.m_rpv.copyFrom(rpv);
            this.m_rtv.copyFrom(rtv);

            this.calcClosePos(this.m_rpv, this.m_rtv);
            this.m_dv.copyFrom(this.m_outV);
            this.m_dv.subtractBy(this.m_initV);
            this.m_pos.copyFrom(this.m_initPos);
            this.m_pos.addBy(this.m_dv);
            if (this.moveSelfEnabled) {
                this.setPosition(this.m_pos);
                this.update();
            }

            if (this.m_targetEntity != null) {
                this.m_pos.addBy(this.m_targetPosOffset);
                this.m_targetEntity.setPosition(this.m_pos);
                this.m_targetEntity.update();
            }
        }
    }

    mouseDownListener(evt: any): void {
        let px = Math.abs(evt.lpos.x);
        let py = Math.abs(evt.lpos.y);
        let pz = Math.abs(evt.lpos.z);
        let flag = -1;
        if (px > py) {
            if (px < pz) {
                // z axis
                flag = 2;
            }
            else {
                // x axis
                flag = 0;
            }
        }
        else {
            if (py < pz) {
                // z axis
                flag = 2;
            }
            else {
                // y axis
                flag = 1;
            }
        }
        this.m_flag = flag;
        if (this.m_flag > -1) {
            switch (this.m_flag) {
                case 0:
                    // x axis
                    this.m_axis_tv.setXYZ(1.0, 0.0, 0.0);
                    break;
                case 1:
                    // y axis
                    this.m_axis_tv.setXYZ(0.0, 1.0, 0.0);
                    break;
                case 2:
                    // z axis
                    this.m_axis_tv.setXYZ(0.0, 0.0, 1.0);
                    break;
                default:
                    break;
            }
        }
        //console.log("AxisCtrlObj::mouseDownListener(). this.m_flag: "+this.m_flag);

        this.m_mat4.copyFrom(this.m_entity.getTransform().getMatrix());
        this.m_invMat4.copyFrom(this.m_entity.getTransform().getInvMatrix());

        this.m_rpv.copyFrom(evt.raypv);
        this.m_rtv.copyFrom(evt.raytv);

        this.calcClosePos(this.m_rpv, this.m_rtv);
        this.m_initV.copyFrom(this.m_outV);
        this.getPosition(this.m_initPos);

    }
}