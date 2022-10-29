/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import IVector3D from "../../../vox/math/IVector3D";
import ITransformEntity from "../../../vox/entity/ITransformEntity";
import IColorMaterial from "../../../vox/material/mcase/IColorMaterial";
import { CircleRayTester } from "../base/CircleRayTester";

import IRawMesh from "../../../vox/mesh/IRawMesh";
import { IRayControl } from "../base/IRayControl";
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
 * 在camera view z axis 上 拖动旋转
 */
class RotationCamZCircle extends RotationCtr implements IRayControl {

    private m_entity: ITransformEntity = null;
    private m_cv = CoMath.createVec3();
    private m_planeNV = CoMath.createVec3();
    private m_outV = CoMath.createVec3();
    private m_rotV = CoMath.createVec3();

    private m_scaleV = CoMath.createVec3();
    private m_posV = CoMath.createVec3();
    private m_srcDV = CoMath.createVec3();
    private m_dstDV = CoMath.createVec3();
    private m_camPos = CoMath.createVec3();
    private m_mat0 = CoMath.createMat4();

    private m_initDegree = 0;
    private m_planeDis = 0;
    private m_material: IColorMaterial = null;
    private m_editRS: IRendererScene = null;
    private m_editRSPI: number = 0;

    private m_ring: RotationRing = null;

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
    initialize(rs: IRendererScene, rspi: number, radius: number, segsTotal: number): void {

        if (this.m_entity == null) {

            this.m_editRS = rs;
            this.m_editRSPI = rspi;

            this.m_ring = new RotationRing();
            this.m_entity = CoEntity.createDisplayEntity();

            let ml = CoMesh.line;
            let mesh: IRawMesh;
            ml.dynColorEnabled = true;
            let pnv = this.m_planeNV;
            // yoz
            mesh = ml.createCircleYOZ(radius, segsTotal);
            pnv.setXYZ(1, 0, 0);

            mesh.setRayTester(new CircleRayTester(radius, this.m_cv, null, pnv, this.m_planeDis, this.pickTestRadius));
            this.m_entity.setMesh(mesh);
            this.m_material = CoMaterial.createLineMaterial(ml.dynColorEnabled);
            this.m_material.setColor(this.outColor);
            this.m_entity.setMaterial(this.m_material);
            this.m_entity.update();

            this.applyEvent(this.m_entity);
            rs.addEntity(this.m_entity, rspi);
            this.m_ring.initialize(rs, rspi, radius, 120, 2);
            this.m_ring.setVisible(false);
        }
    }
    private m_camVer = -7;
    run(camera: IRenderCamera, rtv: IVector3D): void {

        if (this.m_camVer != camera.version) {
            this.m_camVer = camera.version;
            
            // 圆面朝向摄像机
            
            const sv = this.m_scaleV;
            let et = this.m_entity;
            et.getPosition(this.m_posV);
            et.getScaleXYZ(sv);

            this.m_camPos.copyFrom(camera.getPosition());
            this.m_srcDV.setXYZ(1, 0, 0);
            this.m_dstDV.subVecsTo(this.m_camPos, this.m_posV);

            let rad = CoMath.Vector3D.RadianBetween(this.m_srcDV, this.m_dstDV);
            let axis = this.m_rotV;
            CoMath.Vector3D.Cross(this.m_srcDV, this.m_dstDV, axis);
            axis.normalize();

            let mat = this.m_mat0;
            mat.identity();
            mat.appendRotation(rad, axis);
            // mat.appendTranslation(this.m_posV);

            let rv = mat.decompose(CoMath.OrientationType.EULER_ANGLES)[1];
            et.setRotation3(rv.scaleBy(CoMath.MathConst.MATH_180_OVER_PI));
            et.update();

            this.m_ring.setPosition(this.m_posV);
            this.m_ring.setRotation3(rv);
            this.m_ring.setScale3(sv);
        }
    }
    setVisible(visible: boolean): void {
        console.log("RotationCamZCircle::setVisible() ..., visible: ", visible);
        this.m_entity.setVisible(visible);
        if (!visible) this.m_ring.setVisible(visible);
    }
    getVisible(): boolean {
        return this.m_entity.getVisible();
    }
    setXYZ(px: number, py: number, pz: number): void {
        this.m_entity.setXYZ(px, py, pz);
    }
    setRotation3(r: IVector3D): void {
    }
    setRotationXYZ(rx: number, ry: number, rz: number): void {
    }
    setScaleXYZ(sx: number, sy: number, sz: number): void {
        this.m_entity.setScaleXYZ(sx, sy, sz);
    }

    getScaleXYZ(pv: IVector3D): void {
    }
    getRotationXYZ(pv: IVector3D): void {
    }

    localToGlobal(pv: IVector3D): void {
        this.m_entity.localToGlobal(pv);
    }
    globalToLocal(pv: IVector3D): void {
        this.m_entity.globalToLocal(pv);
    }

    enable(): void {
        super.enable();
        this.m_entity.mouseEnabled = true;
    }
    disable(): void {
        super.disable();
        this.m_entity.mouseEnabled = false;
    }
    showOverColor(): void {
        (this.m_entity.getMaterial() as IColorMaterial).setColor(this.overColor);
    }
    showOutColor(): void {
        (this.m_entity.getMaterial() as IColorMaterial).setColor(this.outColor);
        this.m_ring.setColor(this.outColor);
    }
    deselect(): void {
        console.log("RotationCamZCircle::deselect() ...");
        if (this.isSelected()) {

            this.editEnd();
            this.setAllVisible(true);
            this.m_ring.setVisible(false);
        }
    }
    destroy(): void {
        super.destroy();
        if (this.m_entity != null) {
            this.m_editRS.removeEntity(this.m_entity);
            this.m_entity.destroy();
            this.m_entity = null;
        }
        if (this.m_ring != null) {
            this.m_ring.destroy();
            this.m_ring = null;
        }
        this.m_editRS = null;
        this.m_mat0 = null;
        this.m_cv = null;
        this.m_planeNV = null;
    }
    setPosition(pos: IVector3D): void {
        this.m_entity.setPosition(pos);
    }
    getPosition(pv: IVector3D): IVector3D {
        this.m_entity.getPosition(pv);
        return pv;
    }
    update(): void {
        this.m_entity.update();
        this.m_ring.update();
    }

    public moveByRay(rpv: IVector3D, rtv: IVector3D): void {

        if (this.isEnabled()) {
            if (this.isSelected()) {
                let degree = this.getDegree(rpv, rtv);
                degree -= this.m_initDegree;
                if (degree > 360) degree -= 360.0;
                else if (degree < 0) degree += 360.0;

                this.m_ring.setProgress(degree / 360.0);

                let et = this.m_target;
                if (et != null) {

                    let mat = this.m_mat0;
                    let axis = this.m_dstDV;

                    axis.subVecsTo(this.m_camPos, this.m_posV);
                    axis.normalize();
                    mat.identity();
                    mat.appendRotation(CoMath.MathConst.DegreeToRadian(degree), axis);

                    let rv = mat.decompose(CoMath.OrientationType.EULER_ANGLES)[1];
                    et.setRotation3(rv.scaleBy(CoMath.MathConst.MATH_180_OVER_PI));
                    et.update();
                }
            }
        }
    }
    // private m_axisEntity: ITransformEntity = null;
    protected mouseDownListener(evt: any): void {

        console.log("RotationCamZCircle::mouseDownListener() ..., evt: ", evt);
        if (this.isEnabled()) {

            this.editBegin();
            this.m_target.select();
            this.setThisVisible(true);

            this.m_initDegree = this.getDegree(evt.raypv, evt.raytv);
            this.m_ring.setVisible(true);
            this.m_ring.setRingRotation(this.m_initDegree);
            this.m_ring.setProgress(0.0);
        }
    }

    public getDegree(rpv: IVector3D, rtv: IVector3D): number {
        let degree = 0;
        if (this.isSelected()) {
            let u = CoAGeom.PlaneUtils;
            let pnv = this.m_srcDV.copyFrom(rtv).scaleBy(-1.0);
            let pos = this.m_posV;
            this.m_entity.getPosition(pos);
            let hitFlag = u.IntersectRayLinePos2(pnv, pos.dot(pnv), rpv, rtv, this.m_outV);

            // if(this.m_axisEntity == null) {
            //     this.m_axisEntity = CoEntity.createCrossAxis3DEntity(20);
            //     this.m_editRS.addEntity(this.m_axisEntity, 1);
            // }
            // this.m_axisEntity.setPosition(this.m_outV);
            // this.m_axisEntity.update();

            let v = this.m_outV;
            this.m_entity.globalToLocal(v);
            if (hitFlag) {

                hitFlag = u.Intersection == CoAGeom.Intersection.Hit;
                let V3 = CoMath.Vector3D;
                if (hitFlag && V3.Distance(v, this.m_cv) > 2.0) {
                    v.subtractBy(this.m_cv);

                    let et = this.m_target;
                    if (et != null) {
                        // YOZ, X-Axis
                        degree = CoMath.MathConst.GetDegreeByXY(v.y, v.z);
                        if (degree > 360) degree -= 360.0;
                        else if (degree < 0) degree += 360.0;

                    }
                }
            }
        }
        return degree;
    }
}

export { RotationCamZCircle }