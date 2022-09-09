/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import IVector3D from "../../../vox/math/IVector3D";
import IAABB from "../../../vox/geom/IAABB";
import IMatrix4 from "../../../vox/math/IMatrix4";
import IEntityTransform from "../../../vox/entity/IEntityTransform";
import IEvtDispatcher from "../../../vox/event/IEvtDispatcher";

import ITransformEntity from "../../../vox/entity/ITransformEntity";
import IRawMesh from "../../../vox/mesh/IRawMesh";
import { IRayControl } from "../base/IRayControl";
import { SphereRayTester } from "../base/SphereRayTester";
import { DashedLineRayTester } from "../base/DashedLineRayTester";

import { ICoRScene } from "../../voxengine/ICoRScene";
import { ICoMath } from "../../math/ICoMath";
import { ICoAGeom } from "../../ageom/ICoAGeom";
import { ICoMesh } from "../../voxmesh/ICoMesh";
import { ICoMaterial } from "../../voxmaterial/ICoMaterial";
import { ICoEntity } from "../../voxentity/ICoEntity";
import IColorMaterial from "../../../vox/material/mcase/IColorMaterial";

declare var CoRScene: ICoRScene;
declare var CoMath: ICoMath;
declare var CoAGeom: ICoAGeom;
declare var CoMesh: ICoMesh;
declare var CoMaterial: ICoMaterial;
declare var CoEntity: ICoEntity;

/**
 * 在直线上拖动
 */
class DragLine implements IRayControl {

    private m_targetEntity: IEntityTransform = null;
    private m_dispatcher: IEvtDispatcher;
    private m_targetPosOffset: IVector3D = CoMath.createVec3();
    private m_entity: ITransformEntity = null;
    private m_cone: ITransformEntity = null;

    uuid = "DragLine";
    innerSphereRadius = 30.0;
    moveSelfEnabled = true;
    pickTestRadius = 10;

    outColor = CoRScene.createColor4(0.9, 0.9, 0.9, 1.0);
    overColor = CoRScene.createColor4(1.0, 1.0, 1.0, 1.0);
    
    tv = CoMath.createVec3(1.0, 0.0, 0.0);
    coneTransMat4 = CoMath.createMat4();
    coneScale = 1.0;
    constructor() {
    }

    initialize(size: number = 100.0, innerSize: number = 0): void {

        if (this.m_entity == null) {
            let r = this.pickTestRadius;

            CoMesh.line.dynColorEnabled = true;
            let minV = this.tv.clone().scaleBy(innerSize);
            let maxV = this.tv.clone().scaleBy(size);
            let mesh = CoMesh.line.createLine(minV, maxV, r);

            // console.log("DragLine::initialize(), mesh.bounds: ", mesh.bounds);
            let material = CoMaterial.createLineMaterial(true);
            this.m_entity = CoEntity.createDisplayEntity();
            this.m_entity.setMaterial( material );
            this.m_entity.setMesh( mesh );

            if (mesh != null) {
                let lineTester = new DashedLineRayTester(mesh.getVS(), 1, r);
                lineTester.setPrevTester(new SphereRayTester(this.innerSphereRadius));
                mesh.setRayTester( lineTester );
            }
            this.initializeEvent( this.m_entity );

            material = CoMaterial.createDefaultMaterial();
            material.initializeByCodeBuf(false);
            CoMesh.cone.setBufSortFormat( material.getBufSortFormat() );
            CoMesh.cone.transMatrix = this.coneTransMat4;
            mesh = CoMesh.cone.create(this.coneScale * 0.5 * r, this.coneScale * 1.5 * r, 10, 0.0);
            this.m_cone = CoEntity.createDisplayEntity();
            this.m_cone.setMaterial( material );
            this.m_cone.setMesh( mesh );
            this.initializeEvent( this.m_cone );
        }
    }
    getCone(): ITransformEntity {
        return this.m_cone;
    }
    getEntity(): ITransformEntity {
        return this.m_entity;
    }
    setVisible(visible: boolean): void {
        console.log("DragLine::setVisible() ..., visible: ", visible);
        this.m_entity.setVisible(visible);
    }
    getVisible(): boolean {
        return this.m_entity.getVisible();
    }
    setXYZ(px: number, py: number, pz: number): void {
        this.m_entity.setXYZ(px,py,pz);
    }
    setRotation3(r: IVector3D): void {
        this.m_entity.setRotation3(r);
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
    getGlobalBounds(): IAABB {
        return null;
    }
    getLocalBounds(): IAABB {
        return null;
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

    private initializeEvent(entity: ITransformEntity): void {

        if (this.m_dispatcher == null) {
            const me = CoRScene.MouseEvent;
            let dispatcher = CoRScene.createMouseEvt3DDispatcher();
            dispatcher.addEventListener(me.MOUSE_DOWN, this, this.mouseDownListener);
            dispatcher.addEventListener(me.MOUSE_OVER, this, this.mouseOverListener);
            dispatcher.addEventListener(me.MOUSE_OUT, this, this.mouseOutListener);
            this.m_dispatcher = dispatcher;
        }
        entity.setEvtDispatcher(this.m_dispatcher);
        entity.mouseEnabled = true;
    }
    protected mouseOverListener(evt: any): void {
        console.log("DragLine::mouseOverListener() ...");
        this.showOverColor();
    }
    protected mouseOutListener(evt: any): void {
        console.log("DragLine::mouseOutListener() ...");
        this.showOutColor();
    }
    showOverColor(): void {
        let m = this.m_entity.getMaterial() as IColorMaterial;
        m.setColor(this.overColor);
        m = this.m_cone.getMaterial() as IColorMaterial;
        m.setColor(this.overColor);
    }
    showOutColor(): void {
        let m = this.m_entity.getMaterial() as IColorMaterial;
        m.setColor(this.outColor);
        m = this.m_cone.getMaterial() as IColorMaterial;
        m.setColor(this.outColor);
    }
    isSelected(): boolean {
        return this.m_flag > -1;
    }
    select(): void {
    }
    deselect(): void {
        console.log("DragLine::deselect() ...");
        this.m_flag = -1;
    }
    destroy(): void {
        this.m_targetEntity = null;
        if (this.m_entity != null) {
            this.m_entity.destroy();
            this.m_entity = null;
        }
        if (this.m_cone != null) {
            this.m_cone.destroy();
            this.m_cone = null;
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
    private m_line_pv: IVector3D = CoMath.createVec3();
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
            CoAGeom.Line.CalcTwoSLCloseV2(rpv, rtv, this.m_line_pv, this.tv, outV);
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
        console.log("DragLine::mouseDownListener() ...");
        this.m_flag = 1;
        //console.log("AxisCtrlObj::mouseDownListener(). this.m_flag: "+this.m_flag);
        let trans = this.m_entity.getTransform();

        this.m_mat4.copyFrom(trans.getMatrix());
        this.m_invMat4.copyFrom(trans.getInvMatrix());

        this.m_rpv.copyFrom(evt.raypv);
        this.m_rtv.copyFrom(evt.raytv);

        this.calcClosePos(this.m_rpv, this.m_rtv);
        this.m_initV.copyFrom(this.m_outV);
        this.getPosition(this.m_initPos);

    }
}
export { DragLine }