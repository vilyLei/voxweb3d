/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import Vector3D from "../../vox/math/Vector3D";
import IEntityTransform from "../../vox/entity/IEntityTransform";
import DisplayEntity from "../../vox/entity/DisplayEntity";
import MouseEvent from "../../vox/event/MouseEvent";
import MouseEvt3DDispatcher from "../../vox/event/MouseEvt3DDispatcher";
import Plane from "../../vox/geom/Plane";
import ROTransform from "../../vox/display/ROTransform";
import Color4 from "../../vox/material/Color4";
import {IRayControl} from "../../voxeditor/base/IRayControl";
/**
 * 在一个平面上拖动
 */
export default class DragPlaneEntity3D extends DisplayEntity implements IRayControl {

    private m_targetEntity: IEntityTransform = null;
    private m_dispatcher: MouseEvt3DDispatcher;
    private m_targetPosOffset: Vector3D = new Vector3D();

    uuid: string = "DragPlaneEntity3D";
    moveSelfEnabled: boolean = true;
    planeCrossRayEnabled: boolean = false;
    outColor: Color4 = new Color4(0.9,0.9,0.9,1.0);
    overColor: Color4 = new Color4(1.0,1.0,1.0,1.0);
    constructor(transform: ROTransform = null) {
        super(transform);
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
            this.setEvtDispatcher(dispatcher);
            this.m_dispatcher = dispatcher;
        }

        this.mouseEnabled = true;
    }
    protected mouseOverListener(evt: any): void {
        this.showOverColor();
    }
    protected mouseOutListener(evt: any): void {
        this.showOutColor();
    }
    showOverColor(): void {
        (this.getMaterial() as any).setRGBA4f(this.overColor.r, this.overColor.g, this.overColor.b, this.overColor.a);
    }
    showOutColor(): void {
        (this.getMaterial() as any).setRGBA4f(this.outColor.r, this.outColor.g, this.outColor.b, this.outColor.a);
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
    private m_pos: Vector3D = new Vector3D();
    private m_dv: Vector3D = new Vector3D();
    private m_outV: Vector3D = new Vector3D();

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
            this.m_pos.copyFrom(this.m_outV);
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
    /**
     * set plane world onrmal vactor3
     * @param nv 
     */
    setPlaneNormal(nv: Vector3D): void {
        this.m_planeNV.copyFrom(nv);
        this.m_planeNV.normalize();
    }
    selectByParam(raypv: Vector3D, raytv: Vector3D, wpos: Vector3D): void {
        
        this.m_flag = true;
        
        this.m_rpv.copyFrom(raypv);
        this.m_rtv.copyFrom(raytv);
        this.m_planePos.copyFrom(wpos);
        if(this.planeCrossRayEnabled) {
            this.m_planeNV.copyFrom(this.m_rtv);
        }
        this.m_planeNV.normalize();
        
        this.m_planeDis = this.m_planePos.dot(this.m_planeNV);
        this.calcClosePos(this.m_rpv, this.m_rtv);
        this.getPosition(this.m_dv);
        this.m_dv.subtractBy(this.m_outV);
    }
    private mouseDownListener(evt: any): void {
        this.selectByParam(evt.raypv, evt.raytv, evt.wpos);

    }
}