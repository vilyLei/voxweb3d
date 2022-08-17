/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import Vector3D from "../../../vox/math/Vector3D";
import StraightLine from "../../../vox/geom/StraightLine";
import Matrix4 from "../../../vox/math/Matrix4";
import MouseEvent from "../../../vox/event/MouseEvent";

import IEntityTransform from "../../../vox/entity/IEntityTransform";
import AxisQuad3DEntity from "../../../vox/entity/AxisQuad3DEntity";
import MouseEvt3DDispatcher from "../../../vox/event/MouseEvt3DDispatcher";

import ITransformEntity from "../../../vox/entity/ITransformEntity";
import Color4 from "../../../vox/material/Color4";
import {IRayControl} from "../../../voxeditor/base/IRayControl";
/**
 * 在三个坐标轴上拖动
 */
// export default class DragAxis implements IRayControl {
export default class DragAxis {
    
    private m_targetEntity: IEntityTransform = null;
    private m_dispatcher: MouseEvt3DDispatcher;
    private m_targetPosOffset: Vector3D = new Vector3D();
    private m_entity: ITransformEntity = null;
    uuid: string = "DragAxis";
    moveSelfEnabled: boolean = true;
    outColor: Color4 = new Color4(0.9,0.9,0.9,1.0);
    overColor: Color4 = new Color4(1.0,1.0,1.0,1.0);

    constructor() {        
    }
    // isSelected(): boolean;
    // select(): void;
    // deselect(): void;
    setVisible(visible: boolean): void {
        this.m_entity.setVisible( visible );
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
    setTargetPosOffset(offset: Vector3D): void {
        this.m_targetPosOffset.copyFrom( offset );
    }
    setTarget(target: IEntityTransform): void {
        this.m_targetEntity = target;
    }
    initializeEvent(): void {
        
        if(this.m_dispatcher == null) {
            let dispatcher: MouseEvt3DDispatcher = new MouseEvt3DDispatcher();
            dispatcher.addEventListener(MouseEvent.MOUSE_DOWN, this, this.mouseDownListener);
            dispatcher.addEventListener(MouseEvent.MOUSE_OVER,this,this.mouseOverListener);
            dispatcher.addEventListener(MouseEvent.MOUSE_OUT,this,this.mouseOutListener);
            this.m_entity.setEvtDispatcher(dispatcher);
            this.m_dispatcher = dispatcher;
        }
        this.m_entity.mouseEnabled = true;
    }
    protected mouseOverListener(evt: any): void {
        this.showOverColor();
    }
    protected mouseOutListener(evt: any): void {
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
        this.m_entity.destroy();
        if(this.m_dispatcher != null) {
            this.m_dispatcher.destroy();
            this.m_dispatcher = null;
        }
    }
    setPosition(pos: Vector3D): void {
        this.m_entity.setPosition(pos);
    }
    getPosition(outPos: Vector3D): void {
        this.m_entity.getPosition(outPos);
    }
    update(): void {
        this.m_entity.update();
    }

    private m_flag: number = -1;
    private m_axis_pv: Vector3D = new Vector3D();
    private m_axis_tv: Vector3D = new Vector3D();
    private m_initPos: Vector3D = new Vector3D();
    private m_pos: Vector3D = new Vector3D();
    private m_dv: Vector3D = new Vector3D();
    private m_outV: Vector3D = new Vector3D();
    private m_initV: Vector3D = new Vector3D();

    private m_mat4: Matrix4 = new Matrix4();
    private m_invMat4: Matrix4 = new Matrix4();
    private calcClosePos(rpv: Vector3D, rtv: Vector3D): void {
        if (this.m_flag > -1) {
            let mat4: Matrix4 = this.m_invMat4;
            mat4.transformVector3Self(rpv);
            mat4.deltaTransformVectorSelf(rtv);
            let outV: Vector3D = this.m_outV;
            StraightLine.CalcTwoSLCloseV2(rpv, rtv, this.m_axis_pv, this.m_axis_tv, outV);

            mat4 = this.m_mat4;
            mat4.transformVector3Self(outV);
        }
    }
    private m_rpv: Vector3D = new Vector3D();
    private m_rtv: Vector3D = new Vector3D();
    public moveByRay(rpv: Vector3D, rtv: Vector3D): void {
        if (this.m_flag > -1) {
            this.m_rpv.copyFrom(rpv);
            this.m_rtv.copyFrom(rtv);

            this.calcClosePos(this.m_rpv, this.m_rtv);
            this.m_dv.copyFrom(this.m_outV);
            this.m_dv.subtractBy(this.m_initV);
            this.m_pos.copyFrom(this.m_initPos);
            this.m_pos.addBy(this.m_dv);
            if(this.moveSelfEnabled) {
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

        // this.m_mat4.copyFrom(this.m_entity.getTransform().getMatrix());
        // this.m_invMat4.copyFrom(this.m_entity.getTransform().getInvMatrix());

        this.m_rpv.copyFrom(evt.raypv);
        this.m_rtv.copyFrom(evt.raytv);

        this.calcClosePos(this.m_rpv, this.m_rtv);
        this.m_initV.copyFrom(this.m_outV);
        this.getPosition(this.m_initPos);

    }
}