/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import IVector3D from "../../../vox/math/IVector3D";
import IEntityTransform from "../../../vox/entity/IEntityTransform";
import ITransformEntity from "../../../vox/entity/ITransformEntity";
// import MouseEvent from "../../../vox/event/MouseEvent";
import IEvtDispatcher from "../../../vox/event/IEvtDispatcher";
// import MouseEvt3DDispatcher from "../../../vox/event/MouseEvt3DDispatcher";
import Plane from "../../../vox/geom/Plane";
import ROTransform from "../../../vox/display/ROTransform";
import Color4 from "../../../vox/material/Color4";
import {IRayControl} from "../../../voxeditor/base/IRayControl";


import { ICoRScene } from "../../voxengine/ICoRScene";
import { ICoMath } from "../../math/ICoMath";
import { ICoAGeom } from "../../ageom/ICoAGeom";

declare var CoRScene: ICoRScene;
declare var CoMath: ICoMath;
declare var CoAGeom: ICoAGeom;

/**
 * 在一个平面上拖动
 */
export default class DragPlane implements IRayControl {

    private m_targetEntity: IEntityTransform = null;
    private m_dispatcher: IEvtDispatcher;
    private m_targetPosOffset: IVector3D = CoMath.createVec3();
    private m_entity: ITransformEntity = null;
    uuid: string = "DragPlane";
    moveSelfEnabled: boolean = true;
    planeCrossRayEnabled: boolean = false;
    outColor: Color4 = new Color4(0.9,0.9,0.9,1.0);
    overColor: Color4 = new Color4(1.0,1.0,1.0,1.0);
    constructor() {
        
    }
    initialize(): void {
        if(this.m_entity == null) {
            this.m_entity = CoRScene.createDisplayEntity();
        }
    }
    addEventListener(type: number, listener: any, func: (evt: any) => void, captureEnabled: boolean = true, bubbleEnabled: boolean = false): void {
        this.m_dispatcher.addEventListener(type, listener, func, captureEnabled, bubbleEnabled);
    }
    removeEventListener(type: number, listener: any, func: (evt: any) => void): void {
        this.m_dispatcher.removeEventListener(type, listener, func);
    }
    
    setTargetPosOffset(offset: IVector3D): void {
        this.m_targetPosOffset.copyFrom( offset );
    }
    setTarget(target: IEntityTransform): void {
        this.m_targetEntity = target;
    }

    private initializeEvent(): void {

        if(this.m_dispatcher == null) {
            let MouseEvent = CoRScene.MouseEvent;
            let dispatcher = CoRScene.createMouseEvt3DDispatcher();
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
        (this.m_entity.getMaterial() as any).setRGBA4f(this.overColor.r, this.overColor.g, this.overColor.b, this.overColor.a);
    }
    showOutColor(): void {
        (this.m_entity.getMaterial() as any).setRGBA4f(this.outColor.r, this.outColor.g, this.outColor.b, this.outColor.a);
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
    setPosition(pv: IVector3D): void {
        this.m_entity.setPosition( pv );
    }
    getPosition(pv: IVector3D): void {
        this.m_entity.getPosition( pv );
    }
    update(): void {
        this.m_entity.update();
    }
    destroy(): void {
        this.m_targetEntity = null;
        if( this.m_entity != null) {
            this.m_entity.destroy();
        }
        if(this.m_dispatcher != null) {
            this.m_dispatcher.destroy();
            this.m_dispatcher = null;
        }
    }
    private m_planeNV = CoMath.createVec3(0.0, 1.0, 0.0);
    private m_planePos = CoMath.createVec3();
    private m_planeDis = 0.0;

    private m_flag = false;
    private m_pos = CoMath.createVec3();
    private m_dv = CoMath.createVec3();
    private m_outV = CoMath.createVec3();

    private calcClosePos(rpv: IVector3D, rtv: IVector3D): void {
        Plane.IntersectionSLV2(this.m_planeNV, this.m_planeDis, rpv,rtv, this.m_outV);
    }
    private m_rpv: IVector3D = CoMath.createVec3();
    private m_rtv: IVector3D = CoMath.createVec3();
    public moveByRay(rpv: IVector3D, rtv: IVector3D): void {

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
    setPlaneNormal(nv: IVector3D): void {
        this.m_planeNV.copyFrom(nv);
        this.m_planeNV.normalize();
    }
    selectByParam(raypv: IVector3D, raytv: IVector3D, wpos: IVector3D): void {
        
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