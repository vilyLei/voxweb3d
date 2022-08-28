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
import ITestRay from "../../../vox/mesh/ITestRay";
import IRawMesh from "../../../vox/mesh/IRawMesh";
import { IRayControl } from "../base/IRayControl";

import { ICoRScene } from "../../voxengine/ICoRScene";
import { ICoMath } from "../../math/ICoMath";
import { ICoAGeom } from "../../ageom/ICoAGeom";

declare var CoRScene: ICoRScene;
declare var CoMath: ICoMath;
declare var CoAGeom: ICoAGeom;

/**
 * 在三个坐标轴上拖动
 */
export default class ScaleEntity implements IRayControl {

    private m_targetEntity: IEntityTransform = null;
    private m_dispatcher: IEvtDispatcher;
    private m_targetPosOffset: IVector3D = CoMath.createVec3();
    private m_entity: ITransformEntity = null;
    uuid: string = "ScaleEntity";
    moveSelfEnabled = true;
    outColor = CoRScene.createColor4(0.9, 0.9, 0.9, 1.0);
    overColor = CoRScene.createColor4(1.0, 1.0, 1.0, 1.0);
    pickTestRadius: number = 10;
    constructor() {
    }
    initialize(size: number = 100.0): void {
        if (this.m_entity == null) {
            this.m_entity = CoRScene.createAxis3DEntity(size);
            this.m_entity.update();
            let mesh = this.m_entity.getMesh() as IRawMesh;
            this.initializeEvent();
        }
    }
    getEntity(): ITransformEntity {
        return this.m_entity;
    }
    setVisible(visible: boolean): void {
        console.log("ScaleEntity::setVisible() ..., visible: ", visible);
        this.m_entity.setVisible(visible);
    }
    getVisible(): boolean {
        return this.m_entity.getVisible();
    }
    setXYZ(px: number, py: number, pz: number): void {
        this.m_entity.setXYZ(px,py,pz);
    }
    setRotationXYZ(rx: number, ry: number, rz: number): void {
        this.m_entity.setRotationXYZ(rx,ry,rz);
    }
    setScaleXYZ(sx: number, sy: number, sz: number): void {
        this.m_entity.setScaleXYZ(sx,sy,sz);
    }
    
    getScaleXYZ(pv: IVector3D): void {
        this.m_entity.getScaleXYZ( pv );
    }
    getRotationXYZ(pv: IVector3D): void {
        this.m_entity.getRotationXYZ( pv );
    }
    localToGlobal(pv: IVector3D): void {
        this.m_entity.localToGlobal( pv );
    }
    globalToLocal(pv: IVector3D): void {
        this.m_entity.globalToLocal( pv );
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
    private initializeEvent(): void {

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
        console.log("ScaleEntity::mouseOverListener() ...");
        this.showOverColor();
    }
    protected mouseOutListener(evt: any): void {
        console.log("ScaleEntity::mouseOutListener() ...");
        this.showOutColor();
    }
    showOverColor(): void {
        (this.m_entity.getMaterial() as any).setRGB3f(this.overColor.r, this.overColor.g, this.overColor.b);
    }
    showOutColor(): void {
        (this.m_entity.getMaterial() as any).setRGB3f(this.outColor.r, this.outColor.g, this.outColor.b);
    }
    isSelected(): boolean {
        return this.m_flag > -1;
    }
    select(): void {
    }
    deselect(): void {
        console.log("ScaleEntity::deselect() ...");
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
        if(this.m_flag < 0) {
            console.log(">>>>>>>>>>>");
        }
        this.m_entity.setPosition(pos);
    }
    getPosition(outPos: IVector3D): void {
        this.m_entity.getPosition(outPos);
    }
    update(): void {
        this.m_entity.update();
    }

    private m_flag: number = -1;
    public moveByRay(rpv: IVector3D, rtv: IVector3D): void {
        if (this.m_flag > -1) {

        }
    }

    mouseDownListener(evt: any): void {
        console.log("ScaleEntity::mouseDownListener() ...");
        
    }
}