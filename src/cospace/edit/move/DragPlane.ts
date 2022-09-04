/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import IVector3D from "../../../vox/math/IVector3D";
import IAABB from "../../../vox/geom/IAABB";
import IEntityTransform from "../../../vox/entity/IEntityTransform";
import ITransformEntity from "../../../vox/entity/ITransformEntity";
import IEvtDispatcher from "../../../vox/event/IEvtDispatcher";
import { IRayControl } from "../base/IRayControl";

import { ICoRScene } from "../../voxengine/ICoRScene";
import { ICoMath } from "../../math/ICoMath";
import { ICoAGeom } from "../../ageom/ICoAGeom";
import { ICoMesh } from "../../voxmesh/ICoMesh";

declare var CoRScene: ICoRScene;
declare var CoMath: ICoMath;
declare var CoAGeom: ICoAGeom;
declare var CoMesh: ICoMesh;

/**
 * 支持在一个平面上拖动
 */
export default class DragPlane implements IRayControl {

    private m_targetEntity: IEntityTransform = null;
    private m_dispatcher: IEvtDispatcher;
    private m_targetPosOffset = CoMath.createVec3();
    private m_entity: ITransformEntity = null;
    private offsetV = CoMath.createVec3(30,30,30);
    // private m_entityScale = CoMath.createVec3(1.0, 1.0, 1.0);
    // private m_scale = 1.0;

    uuid: string = "DragPlane";

    moveSelfEnabled = true;
    crossRay = false;
    outColor = CoRScene.createColor4(0.9, 0.9, 0.9, 1.0);
    overColor = CoRScene.createColor4(1.0, 1.0, 1.0, 1.0);

    constructor() { }
    initialize(planeAxisType: number, size: number, alpha: number): void {

        if (this.m_entity == null) {

            const V3 = CoMath.Vector3D;
            let rscene = CoRScene.getRendererScene();
            let eb = rscene.entityBlock;
            let material = CoRScene.createDefaultMaterial();

            this.m_entity = CoRScene.createDisplayEntity();

            let et = this.m_entity;

            // this.m_scale = size;

            et.setMaterial(material);
            // et.setScaleXYZ(size, size, size);
            let builder = CoMesh.planeMeshBuilder;
            let ov = this.offsetV;
            switch (planeAxisType) {
                case 0:
                    // et.copyMeshFrom(eb.unitOXOZPlane);
                    et.setMesh(builder.createXOZ(ov.x,ov.z, size,size));
                    this.setPlaneNormal(V3.Y_AXIS);
                    this.outColor.setRGBA4f(1.0, 0.3, 0.3, alpha);
                    this.overColor.setRGBA4f(1.0, 0.1, 0.1, alpha * 1.1);
                    break;
                case 1:
                    // et.copyMeshFrom(eb.unitOXOYPlane);
                    et.setMesh(builder.createXOY(ov.x,ov.y, size,size));
                    this.setPlaneNormal(V3.Z_AXIS);
                    this.outColor.setRGBA4f(0.3, 0.3, 1.0, alpha);
                    this.overColor.setRGBA4f(0.1, 0.1, 1.0, alpha * 1.1);
                    break;
                // yoz
                case 2:
                    // et.copyMeshFrom(eb.unitOYOZPlane);
                    et.setMesh(builder.createYOZ(ov.y,ov.z, size,size));
                    this.setPlaneNormal(CoMath.Vector3D.X_AXIS);
                    this.outColor.setRGBA4f(0.3, 1.0, 0.3, alpha);
                    this.overColor.setRGBA4f(0.1, 1.0, 0.1, alpha * 1.1);
                    break;
                // ray cross plane
                // case 3:
                //     this.crossRay = true;
                //     this.outColor.setRGBA4f(1.0, 0.3, 1.0, alpha);
                //     this.overColor.setRGBA4f(1.0, 0.1, 1.0, alpha * 1.1);
                //     break;
                default:
                    throw Error("Error type !!!");
                    break;
            }
            
            et.setRenderState(CoRScene.RendererState.NONE_TRANSPARENT_STATE);
            this.showOutColor();
            this.initializeEvent();
        }
    }
    getEntity(): ITransformEntity {
        return this.m_entity;
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
            let MouseEvent = CoRScene.MouseEvent;
            let dispatcher = CoRScene.createMouseEvt3DDispatcher();
            dispatcher.addEventListener(MouseEvent.MOUSE_DOWN, this, this.mouseDownListener);
            dispatcher.addEventListener(MouseEvent.MOUSE_OVER, this, this.mouseOverListener);
            dispatcher.addEventListener(MouseEvent.MOUSE_OUT, this, this.mouseOutListener);
            this.m_entity.setEvtDispatcher(dispatcher);
            this.m_dispatcher = dispatcher;
        }

        this.m_entity.mouseEnabled = true;
    }
    protected mouseOverListener(evt: any): void {
        console.log("DragPlane::mouseOverListener() ...");
        this.showOverColor();
    }
    protected mouseOutListener(evt: any): void {
        console.log("DragPlane::mouseOutListener() ...");
        this.showOutColor();
    }
    showOverColor(): void {
        (this.m_entity.getMaterial() as any).setRGBA4f(this.overColor.r, this.overColor.g, this.overColor.b, this.overColor.a);
    }
    showOutColor(): void {
        (this.m_entity.getMaterial() as any).setRGBA4f(this.outColor.r, this.outColor.g, this.outColor.b, this.outColor.a);
    }

    setRenderState(state: number): void {
        this.m_entity.setRenderState(state);
    }
    setVisible(visible: boolean): void {
        this.m_entity.setVisible(visible);
    }
    getVisible(): boolean {
        return this.m_entity.getVisible();
    }
    setXYZ(px: number, py: number, pz: number): void {
        this.m_entity.setXYZ(px, py, pz);
    }
    setPosition(pv: IVector3D): void {
        this.m_entity.setPosition(pv);
    }
    getPosition(pv: IVector3D): void {
        this.m_entity.getPosition(pv);
    }
    setScaleXYZ(sx: number, sy: number, sz: number): void {
        // const s = this.m_scale;
        // this.m_entityScale.setXYZ(sx, sy, sz);
        // this.m_entity.setScaleXYZ(sx * s, sy * s, sz * s);
        this.m_entity.setXYZ(sx, sy, sz);
    }

    getScaleXYZ(pv: IVector3D): void {
        // pv.copyFrom( this.m_entityScale );
        this.m_entity.getScaleXYZ( pv );
    }
    setRotation3(r: IVector3D): void {
        this.m_entity.setRotation3(r);
    }
    setRotationXYZ(rx: number, ry: number, rz: number): void {
        this.m_entity.setRotationXYZ(rx, ry, rz);
    }
    getRotationXYZ(pv: IVector3D): void {
        this.m_entity.getRotationXYZ(pv);
    }
    
    getGlobalBounds(): IAABB {
        return this.m_entity.getGlobalBounds();
    }
    getLocalBounds(): IAABB {
        return this.m_entity.getGlobalBounds();
    }
    localToGlobal(pv: IVector3D): void {
        this.m_entity.localToGlobal(pv);
    }
    globalToLocal(pv: IVector3D): void {
        this.m_entity.globalToLocal(pv);
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
    update(): void {
        this.m_entity.update();
    }
    destroy(): void {
        this.m_targetEntity = null;
        if (this.m_entity != null) {
            this.m_entity.destroy();
        }
        if (this.m_dispatcher != null) {
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
        CoAGeom.PlaneUtils.IntersectLinePos2(this.m_planeNV, this.m_planeDis, rpv, rtv, this.m_outV);
    }
    private m_rpv = CoMath.createVec3();
    private m_rtv = CoMath.createVec3();
    public moveByRay(rpv: IVector3D, rtv: IVector3D): void {

        if (this.m_flag) {

            this.m_rpv.copyFrom(rpv);
            this.m_rtv.copyFrom(rtv);

            const pv = this.m_pos;

            this.calcClosePos(this.m_rpv, this.m_rtv);
            pv.copyFrom(this.m_outV);
            pv.addBy(this.m_dv);
            if (this.moveSelfEnabled) {
                this.setPosition(pv);
                this.update();
            }

            if (this.m_targetEntity != null) {

                pv.addBy(this.m_targetPosOffset);
                this.m_targetEntity.setPosition(pv);
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
        if (this.crossRay) {
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