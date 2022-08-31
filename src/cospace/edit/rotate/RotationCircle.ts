/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import IVector3D from "../../../vox/math/IVector3D";
import IAABB from "../../../vox/geom/IAABB";

import IEntityTransform from "../../../vox/entity/IEntityTransform";
import IEvtDispatcher from "../../../vox/event/IEvtDispatcher";
import ITransformEntity from "../../../vox/entity/ITransformEntity";
import IColor4 from "../../../vox/material/IColor4";
import IColorMaterial from "../../../vox/material/mcase/IColorMaterial";
import { CircleRayTester } from "../base/CircleRayTester";

import IRawMesh from "../../../vox/mesh/IRawMesh";
import { IRayControl } from "../base/IRayControl";

import { ICoRScene } from "../../voxengine/ICoRScene";
import { ICoMaterial } from "../../voxmaterial/ICoMaterial";
import { ICoEntity } from "../../voxentity/ICoEntity";
import { ICoMath } from "../../math/ICoMath";
import { ICoAGeom } from "../../ageom/ICoAGeom";
import { ICoMesh } from "../../voxmesh/ICoMesh";

declare var CoRScene: ICoRScene;
declare var CoMaterial: ICoMaterial;
declare var CoMath: ICoMath;
declare var CoEntity: ICoEntity;
declare var CoAGeom: ICoAGeom;
declare var CoMesh: ICoMesh;

/**
 * 在三个坐标轴上旋转
 */
class RotationCircle implements IRayControl {

    private m_targetEntity: IEntityTransform = null;
    private m_dispatcher: IEvtDispatcher;
    private m_targetPosOffset = CoMath.createVec3();
    private m_entity: ITransformEntity = null;
    private m_center = CoMath.createVec3();
    private m_planeNV = CoMath.createVec3();
    private m_outV = CoMath.createVec3();
    private m_preRotV = CoMath.createVec3();
    private m_rotV = CoMath.createVec3();
    private m_initDegree = 0;
    private m_planeDis = 0;
    private m_type = 0;
    private m_material: IColorMaterial = null;
    private m_flag = -1;

    uuid = "RotationCircle";
    moveSelfEnabled = true;
    outColor = CoMaterial.createColor4(0.9, 0.9, 0.9, 1.0);
    overColor = CoMaterial.createColor4(1.0, 1.0, 1.0, 1.0);
    pickTestRadius = 20;
    constructor() {
    }
    /**
     * init the circle mouse event display entity
     * @param radius circle radius
     * @param segsTotal segments total
     * @param type 0 is xoy, 1 is xoz, 2 is yoz
     * @param color IColor4 instance
     */
    initialize(radius: number, segsTotal: number, type: number, color: IColor4): void {
        if (this.m_entity == null) {

            this.m_entity = CoEntity.createDisplayEntity();

            let builder = CoMesh.lineMeshBuilder;
            let mesh: IRawMesh;
            builder.dynColorEnabled = false;
            builder.color.copyFrom(color);
            this.m_type = type;
            switch (type) {
                case 1:
                    mesh = builder.createCircleXOZ(radius, segsTotal);
                    this.m_planeNV.setXYZ(0, 1, 0);
                    break;
                case 2:
                    mesh = builder.createCircleYOZ(radius, segsTotal);
                    this.m_planeNV.setXYZ(1, 0, 0);
                    break;
                default:
                    mesh = builder.createCircleXOY(radius, segsTotal);
                    this.m_planeNV.setXYZ(0, 0, 1);
                    break;
            }

            mesh.setRayTester(new CircleRayTester(radius, this.m_center, this.m_planeNV, this.m_planeDis, this.pickTestRadius));
            this.m_entity.setMesh(mesh);
            this.m_material = CoMaterial.createLineMaterial(builder.dynColorEnabled);
            this.m_entity.setMaterial(this.m_material);
            this.m_entity.update();

            this.initializeEvent();
        }
    }
    getEntity(): ITransformEntity {
        return this.m_entity;
    }
    setVisible(visible: boolean): void {
        console.log("RotationCircle::setVisible() ..., visible: ", visible);
        this.m_entity.setVisible(visible);
    }
    getVisible(): boolean {
        return this.m_entity.getVisible();
    }
    setXYZ(px: number, py: number, pz: number): void {
        this.m_entity.setXYZ(px, py, pz);
    }
    setRotation3(r: IVector3D): void {
        this.m_entity.setRotation3(r);
    }
    setRotationXYZ(rx: number, ry: number, rz: number): void {
        this.m_entity.setRotationXYZ(rx, ry, rz);
    }
    setScaleXYZ(sx: number, sy: number, sz: number): void {
        this.m_entity.setScaleXYZ(sx, sy, sz);
    }

    getScaleXYZ(pv: IVector3D): void {
        this.m_entity.getScaleXYZ(pv);
    }
    getRotationXYZ(pv: IVector3D): void {
        this.m_entity.getRotationXYZ(pv);
    }

    getGlobalBounds(): IAABB {
        return null;
    }
    getLocalBounds(): IAABB {
        return null;
    }
    localToGlobal(pv: IVector3D): void {
        this.m_entity.localToGlobal(pv);
    }
    globalToLocal(pv: IVector3D): void {
        this.m_entity.globalToLocal(pv);
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
        console.log("RotationCircle::mouseOverListener() ...");
        this.showOverColor();
    }
    protected mouseOutListener(evt: any): void {
        console.log("RotationCircle::mouseOutListener() ...");
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
        console.log("RotationCircle::select() ...");
    }
    deselect(): void {
        console.log("RotationCircle::deselect() ...");
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
        this.m_center = null;
        this.m_planeNV = null;
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

    public moveByRay(rpv: IVector3D, rtv: IVector3D): void {
        if (this.m_flag > -1) {
            // console.log("RotationCircle::moveByRay() ...");
            // console.log("           this.m_initDegree: ", this.m_initDegree);
            let degree = this.getDegree(rpv, rtv);            
            // console.log("           degree: ", degree);
            degree -= this.m_initDegree;
            
            let et = this.m_targetEntity;
            if (et != null) {
                let rv = this.m_rotV;
                let prv = this.m_preRotV;
                et.getRotationXYZ(rv);

                switch (this.m_type) {
                    case 1:
                        // XOZ, Y-Axis
                        rv.y = prv.y + degree;
                        break;
                    case 2:
                        // YOZ, X-Axis
                        rv.x = prv.x + degree;
                        break;
                    default:
                        // XOY, Z-Axis
                        rv.z = prv.z + degree;
                        break;
                }
                et.setRotation3(rv);
                et.update();
            }
        }
    }
    mouseDownListener(evt: any): void {
        console.log("RotationCircle::mouseDownListener() ..., evt: ", evt);

        this.m_flag = 1;

        this.m_initDegree = this.getDegree(evt.raypv, evt.raytv);
        this.m_preRotV.setXYZ(0, 0, 0);
        if (this.m_targetEntity != null) {
            this.m_targetEntity.getRotationXYZ(this.m_preRotV);
        }
    }

    public getDegree(rpv: IVector3D, rtv: IVector3D): number {
        let degree = 0;
        if (this.m_flag > -1) {
            let u = CoAGeom.PlaneUtils;
            let hitFlag = u.IntersectRayLinePos2(this.m_planeNV, this.m_planeDis, rpv, rtv, this.m_outV);
            if (hitFlag) {
                hitFlag = u.Intersection == CoAGeom.Intersection.Hit;
                let V3 = CoMath.Vector3D;
                if (hitFlag && V3.Distance(this.m_outV, this.m_center) > 2.0) {
                    this.m_outV.subtractBy(this.m_center);

                    let et = this.m_targetEntity;
                    if (et != null) {
                        let v = this.m_outV;

                        switch (this.m_type) {
                            case 1:
                                // XOZ, Y-Axis
                                degree = -CoMath.MathConst.GetDegreeByXY(v.x, v.z);
                                //rv.y = pv.y - degree;
                                break;
                            case 2:
                                // YOZ, X-Axis
                                degree = CoMath.MathConst.GetDegreeByXY(v.y, v.z);
                                //rv.x = pv.x + degree;
                                break;
                            default:
                                // XOY, Z-Axis
                                degree = CoMath.MathConst.GetDegreeByXY(v.x, v.y);
                                //rv.z = pv.z + degree;
                                break;
                        }
                        degree += 360.0;
                        if (degree > 360) degree = degree - 360.0;
                        // console.log("RotationCircle::getDegree() ..., degree: ", degree);
                    }
                }
            }
        }
        return degree;
    }
}

export { RotationCircle }