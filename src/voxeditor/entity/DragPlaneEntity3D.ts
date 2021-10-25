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
import DisplayEntity from "../../vox/entity/DisplayEntity";
import MouseEvent from "../../vox/event/MouseEvent";
import MouseEvt3DDispatcher from "../../vox/event/MouseEvt3DDispatcher";
import EventBaseDispatcher from "../../vox/event/EventBaseDispatcher";
import Plane from "../../vox/geom/Plane";
import ROTransform from "../../vox/display/ROTransform";
/**
 * 在一个平面上拖动
 */
export default class DragPlaneEntity3D extends DisplayEntity {

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

    initializeEvent(): void {

        let dispatcher: MouseEvt3DDispatcher = new MouseEvt3DDispatcher();
        dispatcher.addEventListener(MouseEvent.MOUSE_DOWN, this, this.mouseDownListener);
        dispatcher.addEventListener(MouseEvent.MOUSE_OVER,this,this.mouseOverListener);
        dispatcher.addEventListener(MouseEvent.MOUSE_OUT,this,this.mouseOutListener);
        this.setEvtDispatcher(dispatcher);
        this.mouseEnabled = true;
    }
    protected mouseOverListener(evt: any): void {
        this.m_dispatcher.dispatchEvt(evt);
    }
    protected mouseOutListener(evt: any): void {
        this.m_dispatcher.dispatchEvt(evt);
    }
    isSelected(): boolean {
        return this.m_flag;
    }
    select(): void {
        this.m_flag = true;
    }
    deselect(): void {
        this.m_flag = false;
    }
    destroy(): void {
        this.m_targetEntity = null;
        super.destroy();
        if(this.m_dispatcher != null) {
            this.m_dispatcher.destroy();
            this.m_dispatcher = null;
        }
    }
    private m_planeNV: Vector3D = new Vector3D(0.0, 1.0, 0.0);
    private m_planePos: Vector3D = new Vector3D();
    private m_planeDis: number = 0.0;

    private m_flag: boolean = false;
    private m_initPos: Vector3D = new Vector3D();
    private m_pos: Vector3D = new Vector3D();
    private m_dv: Vector3D = new Vector3D();
    private m_outV: Vector3D = new Vector3D();
    private m_initV: Vector3D = new Vector3D();

    private calcClosePos(rpv: Vector3D, rtv: Vector3D): void {
        Plane.IntersectionSLV2(this.m_planeNV, this.m_planeDis, rpv,rtv, this.m_outV);
    }
    private m_rpv: Vector3D = new Vector3D();
    private m_rtv: Vector3D = new Vector3D();
    public moveByRay(rpv: Vector3D, rtv: Vector3D): void {
        if (this.m_flag) {
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
    /**
     * set plane world onrmal vactor3
     * @param nv 
     */
    setPlaneNormal(nv: Vector3D): void {
        this.m_planeNV.copyFrom(nv);
        this.m_planeNV.normalize();
    }
    mouseDownListener(evt: any): void {

        this.m_flag = true;
        if( this.m_flag ) {

            this.m_planePos.copyFrom(evt.wpos);
            this.m_planeDis = this.m_planePos.getLength();

            this.m_rpv.copyFrom(evt.raypv);
            this.m_rtv.copyFrom(evt.raytv);

            this.calcClosePos(this.m_rpv, this.m_rtv);
            this.m_initV.copyFrom(this.m_outV);
            this.getPosition(this.m_initPos);
        }

    }
}