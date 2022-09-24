/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import IVector3D from "../../../vox/math/IVector3D";
import ITransformEntity from "../../../vox/entity/ITransformEntity";
import IColorMaterial from "../../../vox/material/mcase/IColorMaterial";

import { IRotationCtr } from "./IRotationCtr";
import { RotationCtr } from "./RotationCtr";
import IRendererScene from "../../../vox/scene/IRendererScene";

import { ICoRScene } from "../../voxengine/ICoRScene";
import { ICoMaterial } from "../../voxmaterial/ICoMaterial";
import { ICoEntity } from "../../voxentity/ICoEntity";
import { ICoMath } from "../../math/ICoMath";
import { ICoAGeom } from "../../ageom/ICoAGeom";
import { ICoMesh } from "../../voxmesh/ICoMesh";
import { ICoParticle } from "../../particle/ICoParticle";
import { IRenderCamera } from "../../../vox/render/IRenderCamera";
import { SphereRayTester } from "../base/SphereRayTester";
import IRenderStage3D from "../../../vox/render/IRenderStage3D";

declare var CoRScene: ICoRScene;
declare var CoMaterial: ICoMaterial;
declare var CoMath: ICoMath;
declare var CoEntity: ICoEntity;
declare var CoAGeom: ICoAGeom;
declare var CoMesh: ICoMesh;
declare var CoParticle: ICoParticle;

/**
 * 在camera view x/y axis 上 拖动旋转
 */
class RotationCamXYCircle extends RotationCtr implements IRotationCtr {

    // private m_target: IRotatedTarget = null;
    // private m_dispatcher: IEvtDispatcher;
    // private m_targetPosOffset = CoMath.createVec3();
    private m_entity: ITransformEntity = null;
    private m_rotV = CoMath.createVec3();

    private m_scaleV = CoMath.createVec3();
    private m_posV = CoMath.createVec3();
    private m_srcDV = CoMath.createVec3();
    private m_dstDV = CoMath.createVec3();
    private m_camPos = CoMath.createVec3();
    private m_mat0 = CoMath.createMat4();
    private m_stage: IRenderStage3D = null;
    private m_stagePos = CoMath.createVec3();

    // private m_circle: IBillboardBase = null;
    private m_circle: ITransformEntity = null;
    // private m_flag = -1;
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
    initialize(rs: IRendererScene, rspi: number, radius: number): void {

        if (this.m_entity == null) {

            this.m_editRS = rs;
            this.m_editRSPI = rspi;
            this.m_stage = rs.getStage3D();

            let bounds = CoEntity.createBoundsEntity();

            let minV = CoMath.createVec3(radius, radius, radius).scaleBy(-1.0);
            let maxV = CoMath.createVec3(radius, radius, radius);
            bounds.setBounds(minV, maxV);
            bounds.setRayTester(new SphereRayTester(radius));
            this.applyEvent(bounds);
            this.m_entity = bounds;

            /*
            let par = CoParticle.createBillboard();
            par.initializeSquare(radius, [this.createTexByUrl("static/assets/circle01.png")]);
            rs.addEntity(par.entity, rspi + 1);
            let RST = CoRScene.RendererState;
            par.entity.setRenderState(RST.NONE_TRANSPARENT_ALWAYS_STATE);
            this.m_circle = par;
            //*/
            ///*
            let n = Math.floor(radius / 2.0);
            if (n < 30) {
                n = 30;
            }
            let RST = CoRScene.RendererState;
            let cirMat = CoMath.createMat4();
            cirMat.setRotationEulerAngle(Math.PI * 0.5, 0.0, Math.PI * 0.5);
            let plb = CoMesh.plane;;
            plb.transMatrix = cirMat;
            let cirPlMaterial = CoMaterial.createDefaultMaterial(false);
            cirPlMaterial.initializeByCodeBuf(false);

            plb.setBufSortFormat(cirPlMaterial.getBufSortFormat());
            let cirPlaneMesh = plb.createCircle(radius, n);

            let cirEntity = CoEntity.createDisplayEntity();
            cirEntity.setMaterial(cirPlMaterial);
            cirEntity.setMesh(cirPlaneMesh);
            // cirEntity.setRenderState(RST.NONE_CULLFACE_NORMAL_STATE);
            cirEntity.setRenderState(RST.NONE_TRANSPARENT_ALWAYS_STATE);
            rs.addEntity(cirEntity, rspi);
            this.m_circle = cirEntity;
            //*/

            this.applyEvent(bounds);
            rs.addEntity(this.m_entity, rspi);
        }
    }

    // private createTexByUrl(url: string = ""): IRenderTexture {
    //     let tex = this.m_editRS.textureBlock.createImageTex2D(64, 64, false);
    //     let img = new Image();
    //     img.onload = (evt: any): void => {
    //         tex.setDataFromImage(img, 0, 0, 0, false);
    //     };
    //     img.src = url != "" ? url : "static/assets/box.jpg";
    //     return tex;
    // }
    enable(): void {
        super.enable();
        this.m_entity.mouseEnabled = true;
    }
    disable(): void {
        super.disable();
        this.m_entity.mouseEnabled = false;
    }
    run(camera: IRenderCamera, rtv: IVector3D): void {

        // // 圆面朝向摄像机
        const sv = this.m_scaleV;
        let et = this.m_circle;
        et.getPosition(this.m_posV);
        // et.getScaleXYZ(sv);
        // et.update();
        this.m_camPos.copyFrom(camera.getPosition());
        this.m_srcDV.setXYZ(1, 0, 0);
        this.m_dstDV.subVecsTo(this.m_camPos, this.m_posV);

        let rad = CoMath.Vector3D.RadianBetween(this.m_srcDV, this.m_dstDV);
        let axis = this.m_rotV;
        CoMath.Vector3D.Cross(this.m_srcDV, this.m_dstDV, axis);
        axis.normalize();

        let mat = et.getTransform().getMatrix();
        mat.identity();
        // mat.setScaleXYZ(sv.x, sv.y, sv.z);
        mat.appendRotation(rad, axis);
        mat.appendTranslation(this.m_posV);

        let rv = mat.decompose(CoMath.OrientationType.EULER_ANGLES)[1];
        et.setRotation3(rv.scaleBy(CoMath.MathConst.MATH_180_OVER_PI));

        // et.update();
    }
    getEntity(): ITransformEntity {
        return this.m_entity;
    }
    setVisible(visible: boolean): void {

        console.log("RotationCamXYCircle::setVisible() ..., visible: ", visible);

        this.m_entity.setVisible(visible);
        this.m_circle.setVisible(visible);
    }
    getVisible(): boolean {
        return this.m_entity.getVisible();
    }
    setXYZ(px: number, py: number, pz: number): void {
        this.m_entity.setXYZ(px, py, pz);
        this.m_circle.setXYZ(px, py, pz);
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
    }

    getScaleXYZ(pv: IVector3D): void {
        // this.m_entity.getScaleXYZ(pv);
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
    // private initializeEvent(entity: ITransformEntity): void {

    //     if (this.m_dispatcher == null) {
    //         const me = CoRScene.MouseEvent;
    //         let dispatcher = CoRScene.createMouseEvt3DDispatcher();
    //         dispatcher.addEventListener(me.MOUSE_DOWN, this, this.mouseDownListener);
    //         dispatcher.addEventListener(me.MOUSE_OVER, this, this.mouseOverListener);
    //         dispatcher.addEventListener(me.MOUSE_OUT, this, this.mouseOutListener);
    //         this.m_dispatcher = dispatcher;
    //     }
    //     entity.setEvtDispatcher(this.m_dispatcher);
    //     entity.mouseEnabled = true;
    // }
    // protected mouseOverListener(evt: any): void {
    //     console.log("RotationCamXYCircle::mouseOverListener() ...");
    //     this.showOverColor();
    // }
    // protected mouseOutListener(evt: any): void {
    //     console.log("RotationCamXYCircle::mouseOutListener() ...");
    //     this.showOutColor();
    // }
    showOverColor(): void {
        // const c = this.overColor;
        // this.m_circle.setRGBA4f(c.r, c.g, c.b, 0.2);
        this.overColor.a = 0.1;
        (this.m_circle.getMaterial() as IColorMaterial).setColor(this.overColor);
    }
    showOutColor(): void {
        // const c = this.outColor;
        // this.m_circle.setRGBA4f(c.r, c.g, c.b, 0.1);
        this.outColor.a = 0.05;
        (this.m_circle.getMaterial() as IColorMaterial).setColor(this.outColor);
    }
    // isSelected(): boolean {
    //     return this.m_flag > -1;
    // }
    // select(): void {
    //     console.log("RotationCamXYCircle::select() ...");
    // }
    // deselect(): void {
    //     console.log("RotationCamXYCircle::deselect() ...");
    //     if (this.isSelected()) {
    //         this.editEnd();
    //         this.setAllVisible(true);
    //     }
    // }
    destroy(): void {

        super.destroy();

        if (this.m_entity != null) {
            this.m_editRS.removeEntity(this.m_entity);
            this.m_entity.destroy();
            this.m_entity = null;
        }
        this.m_editRS = null;
        this.m_stage = null;
        this.m_mat0 = null;
        // if (this.m_dispatcher != null) {
        //     this.m_dispatcher.destroy();
        //     this.m_dispatcher = null;
        // }
    }
    setPosition(pos: IVector3D): void {
        this.m_entity.setPosition(pos);
        this.m_circle.setPosition(pos);
    }
    getPosition(outPos: IVector3D): void {
        this.m_entity.getPosition(outPos);
    }
    update(): void {
        this.m_entity.update();
        this.m_circle.update();
    }

    public moveByRay(rpv: IVector3D, rtv: IVector3D): void {
        if (this.isEnabled()) {
            if (this.isSelected()) {
                let et = this.m_target;
                if (et != null) {

                    const f = 0.02;
                    let cam = this.m_editRS.getCamera();
                    let uv = cam.getUV();
                    let rv = cam.getRV();

                    let pv = this.m_stagePos;
                    let st = this.m_stage;
                    let mat = this.m_mat0;

                    let dx = st.mouseX - pv.x;
                    let dy = pv.y - st.mouseY;
                    let rotv = this.m_rotV;

                    mat.identity();
                    mat.appendRotation(dx * f, uv);
                    mat.appendRotation(dy * f, rv);

                    // et.getRotationXYZ(rotv);
                    rotv = mat.decompose(CoMath.OrientationType.EULER_ANGLES)[1];
                    et.setRotation3(rotv.scaleBy(CoMath.MathConst.MATH_180_OVER_PI));
                    et.update();
                }

            }
        }
    }
    protected mouseDownListener(evt: any): void {

        console.log("RotationCamXYCircle::mouseDownListener() ..., evt: ", evt);
        if (this.isEnabled()) {

            this.editBegin();
            this.m_target.select();

            this.setThisVisible(true);

            let st = this.m_stage;
            this.m_stagePos.setXYZ(st.mouseX, st.mouseY, 0.0);
        }

    }
}

export { RotationCamXYCircle }