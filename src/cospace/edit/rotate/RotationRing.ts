/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import IVector3D from "../../../vox/math/IVector3D";
import ITransformEntity from "../../../vox/entity/ITransformEntity";
import IColor4 from "../../../vox/material/IColor4";
import IColorMaterial from "../../../vox/material/mcase/IColorMaterial";
import IDisplayEntityContainer from "../../../vox/entity/IDisplayEntityContainer";

import IRawMesh from "../../../vox/mesh/IRawMesh";
import IRendererScene from "../../../vox/scene/IRendererScene";

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

class RotationRing {

    private m_container: IDisplayEntityContainer = null;
    private m_ring: ITransformEntity = null;
    private m_material: IColorMaterial = null;
    private m_editRS: IRendererScene = null;
    private m_editRSPI: number = 0;
    private m_type = 0;
    private m_total = 0;

    constructor() {
    }
    /**
     * init the circle mouse event display entity
     * @param radius circle radius
     * @param segsTotal segments total
     * @param type 0 is xoy, 1 is xoz, 2 is yoz
     * @param color IColor4 instance
     */
    initialize(rs: IRendererScene, rspi: number, radius: number, segsTotal: number, type: number): void {

        if (this.m_container == null) {

            this.m_editRS = rs;
            this.m_editRSPI = rspi;

            let ring = CoEntity.createDisplayEntity();
            this.m_container = CoEntity.createDisplayEntityContainer();

            let ml = CoMesh.line;
            let mesh: IRawMesh;
            ml.dynColorEnabled = true;
            this.m_type = type;
            let rad = 0;
            let posList: IVector3D[] = null;
            let j = 0;
            const s = 0.95;
            let range = Math.PI * 2;
            posList = new Array(segsTotal * 2);
            this.m_total = segsTotal;
            switch (type) {
                case 1:
                    // xoz
                    for (let i = segsTotal - 1; i >= 0; --i) {
                        rad = range * i / segsTotal;
                        const x = radius * Math.cos(rad);
                        const z = radius * Math.sin(rad);
                        posList[j++] = CoMath.createVec3(x, 0, z);
                        posList[j++] = CoMath.createVec3(x * s, 0, z * s);
                    }
                    break;
                case 2:
                    // yoz
                    for (let i = 0; i < segsTotal; ++i) {
                        rad = range * i / segsTotal;
                        const x = radius * Math.cos(rad);
                        const y = radius * Math.sin(rad);
                        posList[j++] = CoMath.createVec3(0, x, y);
                        posList[j++] = CoMath.createVec3(0, x * s, y * s);
                    }
                    break;
                default:
                    // xoy
                    for (let i = 0; i < segsTotal; ++i) {
                        rad = range * i / segsTotal;
                        const x = radius * Math.cos(rad);
                        const y = radius * Math.sin(rad);
                        posList[j++] = CoMath.createVec3(x, y, 0);
                        posList[j++] = CoMath.createVec3(x * s, y * s, 0);
                    }
                    break;
            }
            mesh = ml.createLines(posList);

            ring.setMesh(mesh);
            this.m_material = CoMaterial.createLineMaterial(ml.dynColorEnabled);
            ring.setMaterial(this.m_material);
            ring.update();
            this.m_ring = ring;
            this.m_container.addEntity(ring);
            rs.addContainer(this.m_container, rspi);
        }
    }
    getContainer(): IDisplayEntityContainer {
        return this.m_container;
    }
    setProgress(p: number): void {
        // console.log("setProgress(), p: ", p);
        if (this.m_ring != null) {
            if (p < 0.0) {
                p += Math.round(p) * 2.0;
            }
            p -= Math.floor(p);
            let tot = this.m_total * 2;
            let n = Math.round(tot * p) + 2;
            if (n > tot) {
                n = tot;
            }
            // console.log("setProgress(), n: ", n);
            this.m_ring.setIvsParam(0, n);
        }
    }
    setRingRotation(degree: number): void {
        if (this.m_ring != null) {
            switch (this.m_type) {
                case 1:
                    this.m_ring.setRotationXYZ(0, degree, 0);
                    break;
                case 2:
                    this.m_ring.setRotationXYZ(degree, 0, 0);
                    break;
                default:
                    this.m_ring.setRotationXYZ(0, 0, degree);
                    break;

            }
            this.m_ring.update();
        }
    }
    // setDirection(rv: Vector3D): void {
    // }
    setVisible(visible: boolean): void {
        console.log("RotationRing::setVisible() ..., visible: ", visible);
        this.m_container.setVisible(visible);
    }
    getVisible(): boolean {
        return this.m_container.getVisible();
    }
    setXYZ(px: number, py: number, pz: number): void {
        this.m_container.setXYZ(px, py, pz);
    }
    setRotation3(r: IVector3D): void {
        this.m_container.setRotation3(r);
    }
    setRotationXYZ(rx: number, ry: number, rz: number): void {
        this.m_container.setRotationXYZ(rx, ry, rz);
    }
    setScale3(s: IVector3D): void{
        this.m_container.setScale3(s);
    }
    setScaleXYZ(sx: number, sy: number, sz: number): void {
        this.m_container.setScaleXYZ(sx, sy, sz);
    }

    getScaleXYZ(pv: IVector3D): void {
        this.m_container.getScaleXYZ(pv);
    }
    getRotationXYZ(pv: IVector3D): void {
        this.m_container.getRotationXYZ(pv);
    }

    localToGlobal(pv: IVector3D): void {
        this.m_container.localToGlobal(pv);
    }
    globalToLocal(pv: IVector3D): void {
        this.m_container.globalToLocal(pv);
    }
    setColor(color: IColor4): void {
        (this.m_ring.getMaterial() as IColorMaterial).setColor(color);
    }
    destroy(): void {
        if (this.m_container != null) {
            this.m_editRS.removeContainer(this.m_container);
            this.m_container.destroy();
            this.m_container = null;
        }
        this.m_editRS = null;
    }
    setPosition(pos: IVector3D): void {
        this.m_container.setPosition(pos);
    }
    getPosition(outPos: IVector3D): void {
        this.m_container.getPosition(outPos);
    }
    update(): void {
        this.m_container.update();
    }
}

export { RotationRing }