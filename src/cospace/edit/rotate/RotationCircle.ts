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
import { IRotationCtr } from "./IRotationCtr";
import { IRotatedTarget } from "./IRotatedTarget";
import { RotationCtr } from "./RotationCtr";
import IRendererScene from "../../../vox/scene/IRendererScene";

import { ICoRScene } from "../../voxengine/ICoRScene";
import { ICoMaterial } from "../../voxmaterial/ICoMaterial";
import { ICoEntity } from "../../voxentity/ICoEntity";
import { ICoMath } from "../../math/ICoMath";
import { ICoAGeom } from "../../ageom/ICoAGeom";
import { ICoMesh } from "../../voxmesh/ICoMesh";
import { IRenderCamera } from "../../../vox/render/IRenderCamera";
import { RotationRing } from "./RotationRing";

declare var CoRScene: ICoRScene;
declare var CoMaterial: ICoMaterial;
declare var CoMath: ICoMath;
declare var CoEntity: ICoEntity;
declare var CoAGeom: ICoAGeom;
declare var CoMesh: ICoMesh;

/**
 * 在三个坐标轴上旋转
 */
class RotationCircle extends RotationCtr implements IRotationCtr {

    // private m_target: IRotatedTarget = null;
    // private m_dispatcher: IEvtDispatcher;
    // private m_targetPosOffset = CoMath.createVec3();
    private m_entity: ITransformEntity = null;
    private m_circle: ITransformEntity = null;
    private m_cv = CoMath.createVec3();
    private m_planeNV = CoMath.createVec3();
    private m_outV = CoMath.createVec3();
    private m_preRotV = CoMath.createVec3();
    private m_rotV = CoMath.createVec3();
    private m_initDegree = 0;
    private m_planeDis = 0;
    private m_type = 0;
    private m_material: IColorMaterial = null;
    // private m_flag = -1;
    private m_ring: RotationRing = null;

    private m_editRS: IRendererScene = null;
    private m_editRSPI: number = 0;


    constructor() {
        super();
    }
    /**
     * init the circle mouse event display entity
     * @param radius circle radius
     * @param segsTotal segments total
     * @param type 0 is xoy, 1 is xoz, 2 is yoz
     * @param color IColor4 instance
     */
    initialize(rs: IRendererScene, rspi: number, radius: number, segsTotal: number, type: number): void {

        if (this.m_entity == null) {

            this.m_editRS = rs;
            this.m_editRSPI = rspi;

            this.m_ring = new RotationRing();
            this.m_entity = CoEntity.createDisplayEntity();
            this.m_circle = CoEntity.createDisplayEntity();

            let ml = CoMesh.line;
            let mesh: IRawMesh;
            let mesh2: IRawMesh;
            ml.dynColorEnabled = true;
            this.m_type = type;
            let direcV = CoMath.createVec3();
            let pnv = this.m_planeNV;
            switch (type) {
                case 1:
                    // xoz
                    mesh = ml.createCircleXOZ(radius, Math.round(segsTotal * 0.5), null, 0, Math.PI);
                    mesh2 = ml.createCircleXOZ(radius, segsTotal);
                    pnv.setXYZ(0, 1, 0);
                    direcV.setXYZ(0, 0, 1);
                    break;
                case 2:
                    // yoz
                    mesh = ml.createCircleYOZ(radius, Math.round(segsTotal * 0.5), null, 0, Math.PI);
                    mesh2 = ml.createCircleYOZ(radius, segsTotal);
                    pnv.setXYZ(1, 0, 0);
                    direcV.setXYZ(0, 0, 1);
                    break;
                default:
                    // xoy
                    mesh = ml.createCircleXOY(radius, Math.round(segsTotal * 0.5), null, 0, Math.PI);
                    mesh2 = ml.createCircleXOY(radius, segsTotal);
                    pnv.setXYZ(0, 0, 1);
                    direcV.setXYZ(0, 1, 0);
                    type = 0;
                    break;
            }

            mesh.setRayTester(new CircleRayTester(radius, this.m_cv, direcV, pnv, this.m_planeDis, this.pickTestRadius));
            this.m_entity.setMesh(mesh);
            this.m_material = CoMaterial.createLineMaterial(ml.dynColorEnabled);
            this.m_material.setColor(this.outColor);
            this.m_entity.setMaterial(this.m_material);
            this.m_entity.update();

            this.m_circle.setMesh(mesh2);
            this.m_circle.setMaterial(this.m_material);
            this.m_circle.update();
            this.m_circle.setVisible(false);

            this.applyEvent(this.m_entity);

            rs.addEntity(this.m_entity, rspi);
            rs.addEntity(this.m_circle, rspi);

            this.m_ring.initialize(rs, rspi, radius, 120, type);
            this.m_ring.setVisible(false);
        }
    }
    run(camera: IRenderCamera, rtv: IVector3D): void {
        // return;
        // 圆弧朝向摄像机
        let pv = this.m_outV;
        let camPV = camera.getPosition();
        pv.copyFrom(camPV);
        let dis = pv.dot(this.m_planeNV);
        pv.copyFrom(this.m_planeNV);
        pv.scaleBy(-dis);
        pv.addBy(camPV);
        let mc = CoMath.MathConst;

        const entity = this.m_entity;
        let ang = 0;
        switch (this.m_type) {
            case 0:
                // xoy
                ang = -mc.GetDegreeByXY(pv.x, pv.y);
                entity.setRotationXYZ(0, 0, 270 - ang);
                entity.update();
                break;
            case 1:
                // xoz
                ang = -mc.GetDegreeByXY(pv.x, pv.z);
                entity.setRotationXYZ(0, 90 + ang, 0);
                entity.update();
                break;
            case 2:
                // yoz
                ang = -mc.GetDegreeByXY(pv.z, pv.y);
                entity.setRotationXYZ(ang, 0, 0);
                entity.update();
                break;
            default:
                break;
        }
    }

    getEntity(): ITransformEntity {
        return this.m_entity;
    }
    setVisible(visible: boolean): void {
        console.log("RotationCircle::setVisible() ..., visible: ", visible);
        this.m_entity.setVisible(visible);
        if (!visible) this.m_ring.setVisible(visible);
    }
    getVisible(): boolean {
        return this.m_entity.getVisible();
    }
    setXYZ(px: number, py: number, pz: number): void {
        this.m_entity.setXYZ(px, py, pz);
        this.m_circle.setXYZ(px, py, pz);
        this.m_ring.setXYZ(px, py, pz);
    }
    setRotation3(r: IVector3D): void {
        // this.m_entity.setRotation3(r);
    }
    setRotationXYZ(rx: number, ry: number, rz: number): void {
        // this.m_entity.setRotationXYZ(rx, ry, rz);
    }
    setScaleXYZ(sx: number, sy: number, sz: number): void {
        this.m_entity.setScaleXYZ(sx, sy, sz);
        this.m_circle.setScaleXYZ(sx, sy, sz);
        this.m_ring.setScaleXYZ(sx, sy, sz);
    }

    getScaleXYZ(pv: IVector3D): void {
        this.m_entity.getScaleXYZ(pv);
    }
    getRotationXYZ(pv: IVector3D): void {
        // this.m_entity.getRotationXYZ(pv);
    }

    // getGlobalBounds(): IAABB {
    //     return null;
    // }
    // getLocalBounds(): IAABB {
    //     return null;
    // }
    localToGlobal(pv: IVector3D): void {
        this.m_entity.localToGlobal(pv);
    }
    globalToLocal(pv: IVector3D): void {
        this.m_entity.globalToLocal(pv);
    }

    // addEventListener(type: number, listener: any, func: (evt: any) => void, captureEnabled: boolean = true, bubbleEnabled: boolean = false): void {
    //     this.m_dispatcher.addEventListener(type, listener, func, captureEnabled, bubbleEnabled);
    // }
    // removeEventListener(type: number, listener: any, func: (evt: any) => void): void {
    //     this.m_dispatcher.removeEventListener(type, listener, func);
    // }
    // setTargetPosOffset(offset: IVector3D): void {
    //     this.m_targetPosOffset.copyFrom(offset);
    // }
    // setTarget(target: IRotatedTarget): void {
    //     this.m_target = target;
    // }
    enable(): void {
        super.enable();
        this.m_entity.mouseEnabled = true;
    }
    disable(): void {
        super.disable();
        this.m_entity.mouseEnabled = false;
    }
    // private initializeEvent(): void {

    //     if (this.m_dispatcher == null) {
    //         const me = CoRScene.MouseEvent;
    //         let d = CoRScene.createMouseEvt3DDispatcher();
    //         d.addEventListener(me.MOUSE_DOWN, this, this.mouseDownListener);
    //         d.addEventListener(me.MOUSE_OVER, this, this.mouseOverListener);
    //         d.addEventListener(me.MOUSE_OUT, this, this.mouseOutListener);
    //         this.m_entity.setEvtDispatcher(d);
    //         this.m_dispatcher = d;
    //     }
    //     this.m_entity.mouseEnabled = true;
    // }
    // protected mouseOverListener(evt: any): void {
    //     console.log("RotationCircle::mouseOverListener() ...");
    //     this.showOverColor();
    // }
    // protected mouseOutListener(evt: any): void {
    //     console.log("RotationCircle::mouseOutListener() ...");
    //     this.showOutColor();
    // }
    showOverColor(): void {
        (this.m_entity.getMaterial() as IColorMaterial).setColor(this.overColor);
    }
    showOutColor(): void {
        (this.m_entity.getMaterial() as IColorMaterial).setColor(this.outColor);
        this.m_ring.setColor(this.outColor);
    }
    // isSelected(): boolean {
    //     return this.m_flag > -1;
    // }
    // select(): void {
    //     console.log("RotationCircle::select() ...");
    // }
    deselect(): void {
        console.log("RotationCircle::deselect() ...");
        if (this.isSelected()) {
            this.editEnd();
            this.setAllVisible(true);
            
            if (this.m_circle.getVisible()) {
                this.m_entity.setVisible(true);
                this.m_circle.setVisible(false);
            }
            this.m_ring.setVisible(false);
        }
        // this.m_flag = -1;
    }
    destroy(): void {
        super.destroy();
        if (this.m_entity != null) {
            this.m_editRS.removeEntity(this.m_entity);
            this.m_entity.destroy();
            this.m_entity = null;
        }
        if (this.m_circle != null) {
            this.m_editRS.removeEntity(this.m_circle);
            this.m_circle.destroy();
            this.m_circle = null;
        }
        if (this.m_ring != null) {
            this.m_ring.destroy();
            this.m_ring = null;
        }
        this.m_editRS = null;
        // if (this.m_dispatcher != null) {
        //     this.m_dispatcher.destroy();
        //     this.m_dispatcher = null;
        // }
        this.m_cv = null;
        this.m_planeNV = null;
    }
    setPosition(pos: IVector3D): void {
        this.m_entity.setPosition(pos);
        this.m_circle.setPosition(pos);
        this.m_ring.setPosition(pos);
    }
    getPosition(outPos: IVector3D): void {
        this.m_entity.getPosition(outPos);
    }
    update(): void {
        this.m_entity.update();
        this.m_circle.update();
        this.m_ring.update();
    }

    public moveByRay(rpv: IVector3D, rtv: IVector3D): void {

        if (this.isEnabled()) {
            if (this.isSelected()) {
                // console.log("RotationCircle::moveByRay() ...");
                // console.log("           this.m_initDegree: ", this.m_initDegree);
                let degree = this.getDegree(rpv, rtv);
                // console.log("           degree: ", degree);
                degree -= this.m_initDegree;

                this.m_ring.setProgress(degree / 360.0);

                let et = this.m_target;
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
    }
    mouseDownListener(evt: any): void {
        console.log("RotationCircle::mouseDownListener() ..., evt: ", evt);
        if (this.isEnabled()) {

            this.editBegin();
            this.m_target.select();

            this.m_entity.setVisible(false);
            this.m_circle.setVisible(true);

            // this.m_flag = 1;


            this.setThisVisible(true);

            this.m_initDegree = this.getDegree(evt.raypv, evt.raytv);

            console.log("this.m_initDegree: ", this.m_initDegree);

            this.m_ring.setVisible(true);
            this.m_ring.setRingRotation(this.m_initDegree);
            this.m_ring.setProgress(0.0);

            this.m_preRotV.setXYZ(0, 0, 0);
            if (this.m_target != null) {
                this.m_target.getRotationXYZ(this.m_preRotV);
            }
        }
    }
    // private m_axisEntity: ITransformEntity = null;
    public getDegree(rpv: IVector3D, rtv: IVector3D): number {
        let degree = 0;
        if (this.isSelected()) {
            let u = CoAGeom.PlaneUtils;
            this.getPosition(this.m_outV);
            let pids = this.m_planeNV.dot(this.m_outV);
            let hitFlag = u.IntersectRayLinePos2(this.m_planeNV, pids, rpv, rtv, this.m_outV);

            // for test
            // if(this.m_axisEntity == null) {
            //     this.m_axisEntity = CoEntity.createCrossAxis3DEntity(20);
            //     this.m_editRS.addEntity(this.m_axisEntity, 1);
            // }
            // this.m_axisEntity.setPosition(this.m_outV);
            // this.m_axisEntity.update();

            let v = this.m_outV;
            this.m_circle.globalToLocal(v);
            if (hitFlag) {
                hitFlag = u.Intersection == CoAGeom.Intersection.Hit;
                let V3 = CoMath.Vector3D;
                if (hitFlag && V3.Distance(v, this.m_cv) > 2.0) {
                    v.subtractBy(this.m_cv);

                    let et = this.m_target;
                    if (et != null) {
                        switch (this.m_type) {
                            case 1:
                                // XOZ, Y-Axis
                                degree = CoMath.MathConst.GetDegreeByXY(v.x, v.z);
                                degree = -degree;
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
                        if (degree > 360) degree -= 360.0;
                        else if (degree < 0) degree += 360.0;
                        // console.log("RotationCircle::getDegree() ..., degree: ", degree);
                    }
                }
            }
        }
        return degree;
    }
}

export { RotationCircle }