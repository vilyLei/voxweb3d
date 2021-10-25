/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import Vector3D from "../../vox/math/Vector3D";
import StraightLine from "../../vox/geom/StraightLine";
import Matrix4 from "../../vox/math/Matrix4";

import IEntityTransform from "../../vox/entity/IEntityTransform";
import AxisQuad3DEntity from "../../vox/entity/AxisQuad3DEntity";
import MouseEvent from "../../vox/event/MouseEvent";
import MouseEvt3DDispatcher from "../../vox/event/MouseEvt3DDispatcher";
import EventBaseDispatcher from "../../vox/event/EventBaseDispatcher";
import ROTransform from "../../vox/display/ROTransform";
/**
 * 在三个坐标轴上拖动
 */
export default class DragAxisQuad3D extends AxisQuad3DEntity {
    
    private m_targetEntity: IEntityTransform = null;
    private m_dispatcher: EventBaseDispatcher = new EventBaseDispatcher();

    moveSelfenabled: boolean = true;
    constructor(transform: ROTransform = null) {
        super(transform);
    }
    
    addEventListener(type: number, listener: any, func: (evt: any) => void, captureEnabled: boolean = true, bubbleEnabled: boolean = false): void {
        this.m_dispatcher.addEventListener(type, listener, func, captureEnabled, bubbleEnabled);
    }
    removeEventListener(type: number, listener: any, func: (evt: any) => void): void {
        this.m_dispatcher.removeEventListener(type, listener, func);
    }
    setTarget(target: IEntityTransform): void {
        this.m_targetEntity = target;
    }
    initialize(size: number = 100.0, thickness: number = 2.0): void {
        let dispatcher: MouseEvt3DDispatcher = new MouseEvt3DDispatcher();
        dispatcher.addEventListener(MouseEvent.MOUSE_DOWN, this, this.mouseDownListener);
        dispatcher.addEventListener(MouseEvent.MOUSE_OVER,this,this.mouseOverListener);
        dispatcher.addEventListener(MouseEvent.MOUSE_OUT,this,this.mouseOutListener);
        this.setEvtDispatcher(dispatcher);
        this.mouseEnabled = true;
        super.initialize(size, thickness);
    }
    protected mouseOverListener(evt: any): void {
        this.m_dispatcher.dispatchEvt(evt);
    }
    protected mouseOutListener(evt: any): void {
        this.m_dispatcher.dispatchEvt(evt);
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
        super.destroy();
        if(this.m_dispatcher != null) {
            this.m_dispatcher.destroy();
            this.m_dispatcher = null;
        }
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
            if(this.moveSelfenabled) {
                this.setPosition(this.m_pos);
                this.update();
            }

            if (this.m_targetEntity != null) {
                this.m_targetEntity.setPosition(this.m_pos);
                this.m_targetEntity.update();
            }
        }
    }

    mouseDownListener(evt: any): void {
        let px: number = Math.abs(evt.lpos.x);
        let py: number = Math.abs(evt.lpos.y);
        let pz: number = Math.abs(evt.lpos.z);
        let flag: number = -1;
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

        this.m_mat4.copyFrom(this.getTransform().getMatrix());
        this.m_invMat4.copyFrom(this.getTransform().getInvMatrix());

        this.m_rpv.copyFrom(evt.raypv);
        this.m_rtv.copyFrom(evt.raytv);

        this.calcClosePos(this.m_rpv, this.m_rtv);
        this.m_initV.copyFrom(this.m_outV);
        this.getPosition(this.m_initPos);

    }
}