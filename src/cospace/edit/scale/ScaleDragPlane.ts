/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import IVector3D from "../../../vox/math/IVector3D";
import IAABB from "../../../vox/geom/IAABB";
import ITransformEntity from "../../../vox/entity/ITransformEntity";
import { IRayControl } from "../base/IRayControl";
import IRendererScene from "../../../vox/scene/IRendererScene";

import { ICoRScene } from "../../voxengine/ICoRScene";
import { ICoMath } from "../../math/ICoMath";
import { ICoAGeom } from "../../ageom/ICoAGeom";
import { ICoMesh } from "../../voxmesh/ICoMesh";
import IColorMaterial from "../../../vox/material/mcase/IColorMaterial";
import { ScaleCtr } from "./ScaleCtr";

declare var CoRScene: ICoRScene;
declare var CoMath: ICoMath;
declare var CoAGeom: ICoAGeom;
declare var CoMesh: ICoMesh;

/**
 * 支持在一个平面上拖动缩放
 */
export default class ScaleDragPlane extends ScaleCtr implements IRayControl {

    private m_entity: ITransformEntity = null;
    private offsetV = CoMath.createVec3(30, 30, 30);
    private m_planeAxisType: number = 0;

    constructor() { super() }
    initialize(rs: IRendererScene, rspi: number, planeAxisType: number, size: number): void {

        if (this.m_entity == null) {

            this.m_editRS = rs;

            const V3 = CoMath.Vector3D;
            let material = CoRScene.createDefaultMaterial();
            material.initializeByCodeBuf(false);
            this.m_entity = CoRScene.createDisplayEntity();

            let et = this.m_entity;
            et.setMaterial(material);

            let mp = CoMesh.plane;
            mp.setBufSortFormat(material.getBufSortFormat());
            let ov = this.offsetV;

            this.m_planeAxisType = planeAxisType;

            switch (planeAxisType) {
                case 0:
                    // xoz
                    et.setMesh(mp.createXOZ(ov.x, ov.z, size, size));
                    this.setPlaneNormal(V3.Y_AXIS);
                    break;
                case 1:
                    // xoy
                    et.setMesh(mp.createXOY(ov.x, ov.y, size, size));
                    this.setPlaneNormal(V3.Z_AXIS);
                    break;
                case 2:
                    // yoz
                    et.setMesh(mp.createYOZ(ov.y, ov.z, size, size));
                    this.setPlaneNormal(CoMath.Vector3D.X_AXIS);
                    break;
                default:
                    throw Error("Error type !!!");
                    break;
            }

            et.setRenderState(CoRScene.RendererState.NONE_TRANSPARENT_STATE);
            rs.addEntity(et, rspi);

            this.showOutColor();
            this.applyEvent( this.m_entity );
        }
    }
    protected mouseOverListener(evt: any): void {
        // console.log("ScaleDragPlane::mouseOverListener() ...");
        this.showOverColor();
    }
    protected mouseOutListener(evt: any): void {
        // console.log("ScaleDragPlane::mouseOutListener() ...");
        this.showOutColor();
    }
    showOverColor(): void {

        let m = this.m_entity.getMaterial() as IColorMaterial;
        m.setColor(this.overColor);
        // (this.m_entity.getMaterial() as any).setRGBA4f(this.overColor.r, this.overColor.g, this.overColor.b, this.overColor.a);
    }
    showOutColor(): void {
        let m = this.m_entity.getMaterial() as IColorMaterial;
        m.setColor(this.outColor);
        // (this.m_entity.getMaterial() as any).setRGBA4f(this.outColor.r, this.outColor.g, this.outColor.b, this.outColor.a);
    }

    enable(): void {
        super.enable();
        this.m_entity.mouseEnabled = true;
    }
    disable(): void {
        super.disable();
        this.m_entity.mouseEnabled = false;
    }
    setRenderState(state: number): void {
        this.m_entity.setRenderState(state);
    }
    setVisible(visible: boolean): void {
        console.log("ScaleDragPlane::setVisible() ..., visible: ", visible);
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
    getPosition(pv: IVector3D): IVector3D {
        this.m_entity.getPosition(pv);
        return pv;
    }
    setScaleXYZ(sx: number, sy: number, sz: number): void {
        this.m_entity.setScaleXYZ(sx, sy, sz);
    }

    getScaleXYZ(pv: IVector3D): void {
        this.m_entity.getScaleXYZ(pv);
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
    // isSelected(): boolean {
    //     return this.m_flag > -1;
    // }
    // select(): void {
    // }
    // deselect(): void {
    //     if (this.m_flag > -1) {

    //         this.editEnd();
    //         this.setAllVisible(true);
    //     }
    //     this.m_flag = -1;
    // }
    update(): void {
        this.m_entity.update();
    }
    destroy(): void {
        // this.m_target = null;
        super.destroy();
        if (this.m_entity != null) {
            this.m_entity.destroy();
        }
        // if (this.m_dispatcher != null) {
        //     this.m_dispatcher.destroy();
        //     this.m_dispatcher = null;
        // }
    }
    private m_planeNV = CoMath.createVec3(0.0, 1.0, 0.0);
    private m_planePos = CoMath.createVec3();
    private m_planeDis = 0.0;

    // private m_flag = -1;
    private m_pos = CoMath.createVec3();
    private m_dv = CoMath.createVec3();
    private m_outV = CoMath.createVec3();

    private calcClosePos(rpv: IVector3D, rtv: IVector3D): void {
        CoAGeom.PlaneUtils.IntersectLinePos2(this.m_planeNV, this.m_planeDis, rpv, rtv, this.m_outV);
    }
    private m_rpv = CoMath.createVec3();
    private m_rtv = CoMath.createVec3();
    private m_sv = CoMath.createVec3();
    private m_dis = 1.0;
    moveByRay(rpv: IVector3D, rtv: IVector3D): void {

        if (this.isEnabled()) {
            if (this.isSelected()) {

                this.m_rpv.copyFrom(rpv);
                this.m_rtv.copyFrom(rtv);

                this.calcClosePos(this.m_rpv, this.m_rtv);

                let V3 = CoMath.Vector3D;
                let dis = V3.Distance(this.m_pos, this.m_outV);
                if (dis < 1.0) dis = 1.0;

                const sv = this.m_sv;
                let sx = 1.0;
                let sy = 1.0;
                let sz = 1.0;

                let scale = dis / this.m_dis;
                let type = this.m_planeAxisType;

                if (type == 0) {
                    // xoz
                    sx = scale;
                    sz = scale;
                } else if (type == 1) {
                    // xoy
                    sx = scale;
                    sy = scale;

                } else {
                    // yoz
                    sy = scale;
                    sz = scale;
                }

                if (this.m_target != null) {
                    this.m_target.setScaleXYZ(sv.x * sx, sv.y * sy, sv.z * sz);
                    this.m_target.update();
                }
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


        this.m_rpv.copyFrom(raypv);
        this.m_rtv.copyFrom(raytv);
        this.m_planePos.copyFrom(wpos);

        this.m_planeNV.normalize();

        this.m_planeDis = this.m_planePos.dot(this.m_planeNV);
        this.calcClosePos(this.m_rpv, this.m_rtv);
        this.getPosition(this.m_dv);
        this.m_dv.subtractBy(this.m_outV);
    }
    protected mouseDownListener(evt: any): void {

        if (this.isEnabled()) {

            this.editBegin();
            this.setThisVisible(true);

            console.log("ScaleDragPlane::mouseDownListener() ...");
            this.m_target.select();
            this.selectByParam(evt.raypv, evt.raytv, evt.wpos);
            this.m_target.getScaleXYZ(this.m_sv);
            this.getPosition(this.m_pos);

            let V3 = CoMath.Vector3D;
            this.m_dis = V3.Distance(this.m_pos, this.m_outV);
            if (this.m_dis < 1.0) this.m_dis = 1.0;
        }
    }
}