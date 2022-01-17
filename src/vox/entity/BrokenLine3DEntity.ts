/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2020 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import Vector3D from '../../vox/math/Vector3D';
import StripLineMesh from '../../vox/mesh/StripLineMesh';
import DisplayEntity from "../../vox/entity/DisplayEntity";
import IRenderMaterial from "../../vox/render/IRenderMaterial";
import Line3DMaterial from '../../vox/material/mcase/Line3DMaterial';

export default class BrokenLine3DEntity extends DisplayEntity {
    private m_currMaterial: Line3DMaterial = null;
    private m_dynColorBoo: boolean = true;
    constructor(dynColorBoo: boolean = true) {
        super();
        this.m_dynColorBoo = dynColorBoo;
    }
    private m_posarr: number[] = null;

    setRGB3f(pr: number, pg: number, pb: number) {
        this.m_currMaterial.setRGB3f(pr, pg, pb);
    }
    createMaterial(): void {
        if (this.getMaterial() == null) {
            this.m_currMaterial = new Line3DMaterial(this.m_dynColorBoo);
            this.setMaterial(this.m_currMaterial);
        }
    }
    protected __activeMesh(material: IRenderMaterial): void {
        if (this.getMesh() == null) {
            let mesh: StripLineMesh = new StripLineMesh();
            mesh.vbWholeDataEnabled = false;
            mesh.setBufSortFormat(material.getBufSortFormat());
            mesh.initialize(this.m_posarr, null);
            this.setMesh(mesh);
        }
    }
    initializeLS(va: Vector3D, vb: Vector3D): void {
        this.m_posarr = [va.x, va.y, va.z, vb.x, vb.y, vb.z];

        this.createMaterial();
        this.activeDisplay();

    }
    initializeQuad(va: Vector3D, vb: Vector3D, vc: Vector3D, vd: Vector3D): void {
        this.m_posarr = [va.x, va.y, va.z, vb.x, vb.y, vb.z, vc.x, vc.y, vc.z, vd.x, vd.y, vd.z, va.x, va.y, va.z];
        this.createMaterial();
        this.activeDisplay();

    }
    initializeSquareXOY(size: number): void {
        let px: number = size * 0.5;
        let py: number = px;
        let pz: number = 0.0;
        this.m_posarr = [px, py, pz, -px, py, pz, -px, -py, pz, px, -py, pz, px, py, pz];
        this.createMaterial();
        this.activeDisplay();

    }
    initializeRectXOY(width: number, height: number): void {
        let px: number = width * 0.5;
        let py: number = height * 0.5;
        let pz: number = 0.0;
        this.m_posarr = [px, py, pz, -px, py, pz, -px, -py, pz, px, -py, pz, px, py, pz];
        this.createMaterial();
        this.activeDisplay();

    }
    initializeCircleXOY(cv: Vector3D, radius: number, segTotal: number = 10): void {
        let rad: number;
        let pi: number = 2.0 * Math.PI;
        this.m_posarr = new Array(3.0 * (segTotal + 1));
        let i: number = 0;
        for (; i < segTotal; ++i) {
            rad = (pi * i) / segTotal;
            this.m_posarr[i * 3] = cv.x + radius * Math.cos(rad);
            this.m_posarr[i * 3 + 1] = cv.y + radius * Math.sin(rad);
            this.m_posarr[i * 3 + 2] = cv.z;
        }
        this.m_posarr[i * 3] = this.m_posarr[0];
        this.m_posarr[i * 3 + 1] = this.m_posarr[1];
        this.m_posarr[i * 3 + 2] = this.m_posarr[2];
        this.createMaterial();
        this.activeDisplay();

    }
    initializeCircleXOZ(cv: Vector3D, radius: number, segTotal: number = 10): void {
        let rad: number;
        let pi: number = 2.0 * Math.PI;
        this.m_posarr = new Array(3.0 * (segTotal + 1));
        let i: number = 0;
        for (; i < segTotal; ++i) {
            rad = (pi * i) / segTotal;
            this.m_posarr[i * 3] = cv.x + radius * Math.cos(rad);
            this.m_posarr[i * 3 + 1] = cv.y;
            this.m_posarr[i * 3 + 2] = cv.z + radius * Math.sin(rad);
        }
        this.m_posarr[i * 3] = this.m_posarr[0];
        this.m_posarr[i * 3 + 1] = this.m_posarr[1];
        this.m_posarr[i * 3 + 2] = this.m_posarr[2];
        this.createMaterial();
        this.activeDisplay();

    }
    toString(): string {
        return "BrokenLine3DEntity(name=" + this.name + ",uid = " + this.getUid() + ", rseFlag = " + this.__$rseFlag + ")";
    }
}