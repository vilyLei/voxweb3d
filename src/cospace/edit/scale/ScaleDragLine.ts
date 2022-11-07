/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import IVector3D from "../../../vox/math/IVector3D";
import IMatrix4 from "../../../vox/math/IMatrix4";

import ITransformEntity from "../../../vox/entity/ITransformEntity";
import { IRayControl } from "../base/IRayControl";
import { SphereRayTester } from "../base/SphereRayTester";
import { DashedLineRayTester } from "../base/DashedLineRayTester";
import { ScaleCtr } from "./ScaleCtr";

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
 * 在直线上拖动缩放
 */
class ScaleDragLine extends ScaleCtr implements IRayControl {

    private m_entity: ITransformEntity = null;
    private m_box: ITransformEntity = null;

    innerSphereRadius = 30.0;

    type = 0;
    tv = CoMath.createVec3(1.0, 0.0, 0.0);
    coneTransMat4 = CoMath.createMat4();
    boxScale = 1.0;

    constructor() {
        super();
    }

    initialize(size: number = 100.0, innerSize: number = 0): void {

        if (this.m_entity == null) {
            let r = this.pickTestRadius;

            CoMesh.line.dynColorEnabled = true;
            let material = CoMaterial.createLineMaterial(true);
            CoMesh.line.setBufSortFormat(material.getBufSortFormat());

            let minV = this.tv.clone().scaleBy(innerSize);
            let maxV = this.tv.clone().scaleBy(size);
            let mesh = CoMesh.line.createLine(minV, maxV, r);

            this.m_entity = CoEntity.createDisplayEntity();
            this.m_entity.setMaterial(material);
            this.m_entity.setMesh(mesh);

            if (mesh != null) {
                let lineTester = new DashedLineRayTester(mesh.getVS(), 1, r);
                lineTester.setPrevTester(new SphereRayTester(this.innerSphereRadius));
                mesh.setRayTester(lineTester);
            }
            this.applyEvent(this.m_entity);

            material = CoMaterial.createDefaultMaterial();
            material.initializeByCodeBuf(false);
            CoMesh.box.setBufSortFormat(material.getBufSortFormat());
            CoMesh.box.transMatrix = this.coneTransMat4;
            mesh = CoMesh.box.createCube(this.boxScale * r * 2.0);
            this.m_box = CoEntity.createDisplayEntity();
            this.m_box.setMaterial(material);
            this.m_box.setMesh(mesh);
            this.applyEvent(this.m_box);
        }
    }
    getBox(): ITransformEntity {
        return this.m_box;
    }
    getEntity(): ITransformEntity {
        return this.m_entity;
    }
    setVisible(visible: boolean): void {
        this.m_entity.setVisible(visible);
        this.m_box.setVisible(visible);
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
    localToGlobal(pv: IVector3D): void {
        this.m_entity.localToGlobal(pv);
    }
    globalToLocal(pv: IVector3D): void {
        this.m_entity.globalToLocal(pv);
    }

    showOverColor(): void {
        
        this.setEntityColor(this.m_entity, this.overColor);
        this.setEntityColor(this.m_box, this.overColor);
    }
    showOutColor(): void {
        
        this.setEntityColor(this.m_entity, this.outColor);
        this.setEntityColor(this.m_box, this.outColor);
    }

    enable(): void {
        super.enable();
        this.m_entity.mouseEnabled = true;
        this.m_box.mouseEnabled = true;
    }
    disable(): void {
        super.disable();
        this.m_entity.mouseEnabled = false;
        this.m_box.mouseEnabled = false;
    }
    destroy(): void {
        super.destroy();
        if (this.m_entity != null) {
            this.m_entity.destroy();
            this.m_entity = null;
        }
        if (this.m_box != null) {
            this.m_box.destroy();
            this.m_box = null;
        }
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
        this.m_box.update();
    }

    // private m_flag: number = -1;
    private m_line_pv: IVector3D = CoMath.createVec3();
    private m_initPos: IVector3D = CoMath.createVec3();
    private m_dv: IVector3D = CoMath.createVec3();
    private m_outV: IVector3D = CoMath.createVec3();
    private m_initV: IVector3D = CoMath.createVec3();

    private m_mat4: IMatrix4 = CoMath.createMat4();
    private m_invMat4: IMatrix4 = CoMath.createMat4();
    private calcClosePos(rpv: IVector3D, rtv: IVector3D): void {

        if (this.isSelected()) {
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
    private m_sv = CoMath.createVec3();
    moveByRay(rpv: IVector3D, rtv: IVector3D): void {

        if (this.isEnabled()) {
            if (this.isSelected()) {

                this.m_rpv.copyFrom(rpv);
                this.m_rtv.copyFrom(rtv);

                this.calcClosePos(this.m_rpv, this.m_rtv);
                this.m_dv.copyFrom(this.m_outV);
                this.m_dv.subtractBy(this.m_initV);

                // console.log("this.m_dv: ", this.m_dv);
                const dv = this.m_dv;
                const sv = this.m_sv;
                let scale = 1.0;
                let sx = 1.0;
                let sy = 1.0;
                let sz = 1.0;

                let tv = this.tv;
                let dis = 100.0;
                if (tv.x > 0.1) {
                    dis += dv.x;
                    if (dis < 1) dis = 1.0;
                    scale = dis / 100.0;
                    sx = scale;
                } else if (tv.y > 0.1) {
                    dis += dv.y;
                    if (dis < 1) dis = 1.0;
                    scale = dis / 100.0;
                    sy = scale;

                } else if (tv.z > 0.1) {
                    dis += dv.z;
                    if (dis < 1) dis = 1.0;
                    scale = dis / 100.0;
                    sz = scale;
                }
                // console.log("scale: ",scale, sv);

                if (this.m_target != null) {
                    this.m_target.setScaleXYZ(sv.x * sx, sv.y * sy, sv.z * sz);
                    this.m_target.update();
                }
            }
        }
    }

    mouseDownListener(evt: any): void {
        // console.log("ScaleDragLine::mouseDownListener() ...");
        if (this.isEnabled()) {

            this.editBegin();
            this.setThisVisible(true);
            this.m_target.select();
            // this.m_flag = 1;
            //console.log("AxisCtrlObj::mouseDownListener(). this.m_flag: "+this.m_flag);
            let trans = this.m_entity.getTransform();

            this.m_mat4.copyFrom(trans.getMatrix());
            this.m_invMat4.copyFrom(trans.getInvMatrix());

            this.m_rpv.copyFrom(evt.raypv);
            this.m_rtv.copyFrom(evt.raytv);

            this.calcClosePos(this.m_rpv, this.m_rtv);
            this.m_initV.copyFrom(this.m_outV);
            this.getPosition(this.m_initPos);
            this.m_target.getScaleXYZ(this.m_sv);
        }
    }
}
export { ScaleDragLine }