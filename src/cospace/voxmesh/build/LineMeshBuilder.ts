/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import IVector3D from "../../../vox/math/IVector3D";
import IColor4 from '../../../vox/material/IColor4';
import IRawMesh from '../../../vox/mesh/IRawMesh';
import { ILineMeshBuilder } from './ILineMeshBuilder';
import { MeshBuilder } from "./MeshBuilder";

import { ICoRScene } from "../../voxengine/ICoRScene";
import { ICoMesh } from "../../voxmesh/ICoMesh";
import { ICoMath } from "../../math/ICoMath";
declare var CoRScene: ICoRScene;
declare var CoMesh: ICoMesh;
declare var CoMath: ICoMath;

class LineMeshBuilder extends MeshBuilder implements ILineMeshBuilder {

    private m_posvs: number[] = null;
    private m_colorvs: number[] = null;

    color = CoRScene.createColor4(1.0, 0.0, 0.0, 1.0);
    dynColorEnabled = true;

    constructor() { super() }

    setRGB3f(pr: number, pg: number, pb: number): void {
        this.color.setRGB3f(pr, pg, pb);
    }
    private createLineMesh(): IRawMesh {

        let vs = new Float32Array(this.m_posvs);

        let mesh = CoMesh.createRawMesh();
        mesh.ivsEnabled = false;
        mesh.aabbEnabled = true;
        mesh.reset();
        mesh.addFloat32Data(vs, 3);

        if (this.m_colorvs != null) {
            if (this.m_colorvs.length != vs.length) throw ("Error: colorvs.length == vs.length");
            mesh.addFloat32Data(new Float32Array(this.m_colorvs), 3);
        }
        mesh.vbWholeDataEnabled = false;
        mesh.initialize();
        mesh.toArraysLines();
        mesh.vtCount = Math.floor(vs.length / 3);

        return mesh;
    }
    private useColor(posTotal: number): void {
        if (!this.dynColorEnabled) {
            this.m_colorvs = new Array(posTotal * 3);
            for (let i = 0; i < posTotal; ++i) this.color.toArray3(this.m_colorvs, i * 3);
        }
    }
    createLine(begin: IVector3D, end: IVector3D = null): IRawMesh {
        if (this.m_posvs == null) {
            this.m_posvs = [0.0, 0.0, 0.0, 100.0, 0, 0];
        }
        if (begin != null) begin.toArray(this.m_posvs);
        if (end != null) end.toArray(this.m_posvs, 3);
        this.useColor(2);
        return this.createLineMesh();
    }
    createRectXOY(px: number, py: number, pw: number, ph: number): IRawMesh {
        pw += px;
        ph += py;
        this.useColor(8);
        this.m_posvs = [px, py, 0.0, pw, py, 0.0, pw, py, 0.0, pw, ph, 0.0, pw, ph, 0.0, px, ph, 0.0, px, ph, 0.0, px, py, 0.0];
        return this.createLineMesh();
    }
    createRectXOZ(px: number, pz: number, pw: number, pl: number): IRawMesh {
        pw += px;
        pl += pz;
        this.useColor(8);
        this.m_posvs = [px, 0.0, pz, pw, 0.0, pz, pw, 0.0, pz, pw, 0.0, pl, pw, 0.0, pl, px, 0.0, pl, px, 0.0, pl, px, 0.0, pz];
        return this.createLineMesh();
    }

    createRectYOZ(py: number, pz: number, pw: number, pl: number): IRawMesh {
        pw += py;
        pl += pz;
        this.useColor(8);
        this.m_posvs = [0.0, py, pz, 0.0, pw, pz, 0.0, pw, pz, 0.0, pw, pl, 0.0, pw, pl, 0.0, py, pl, 0.0, py, pl, 0.0, py, pz];
        return this.createLineMesh();
    }
    private createCircle(vs: number[], segsTotal: number): void {

        this.m_posvs = new Array((segsTotal * 2) * 3);
        let k = 0, j = 0;
        let pvs = this.m_posvs;

        for (let i = 1; i <= segsTotal; ++i) {
            k = (i - 1) * 3;
            pvs[j++] = vs[k++];
            pvs[j++] = vs[k++];
            pvs[j++] = vs[k++];
            k = i * 3;
            pvs[j++] = vs[k++];
            pvs[j++] = vs[k++];
            pvs[j++] = vs[k++];
        }
        this.useColor(segsTotal * 2);
    }
    createCircleXOY(radius: number, segsTotal: number, center: IVector3D = null): IRawMesh {

        if (radius < 0.001) radius = 0.001;
        if (segsTotal < 3) segsTotal = 3;
        if (center == null) center = CoMath.createVec3();

        let vs = new Array((segsTotal + 1) * 3);
        let j = 0;
        let rad = 0.0;
        let pi2 = Math.PI * 2;
        for (let i = 0; i <= segsTotal; ++i) {
            rad = pi2 * i / segsTotal;
            vs[j++] = center.x + radius * Math.cos(rad);
            vs[j++] = center.y + radius * Math.sin(rad);
            vs[j++] = center.z;
        }

        this.createCircle(vs, segsTotal);
        return this.createLineMesh();
    }
    createCircleXOZ(radius: number, segsTotal: number, center: IVector3D = null): IRawMesh {

        if (radius < 0.001) radius = 0.001;
        if (segsTotal < 3) segsTotal = 3;
        if (center == null) center = CoMath.createVec3();

        let vs = new Array((segsTotal + 1) * 3);
        let j = 0;
        let rad = 0.0;
        let pi2 = Math.PI * 2;
        for (let i = 0; i <= segsTotal; ++i) {
            rad = pi2 * i / segsTotal;
            vs[j++] = center.x + radius * Math.cos(rad);
            vs[j++] = center.y;
            vs[j++] = center.z + radius * Math.sin(rad);
        }

        this.createCircle(vs, segsTotal);
        return this.createLineMesh();
    }
    createCircleYOZ(radius: number, segsTotal: number, center: IVector3D = null): IRawMesh {

        if (radius < 0.001) radius = 0.001;
        if (segsTotal < 3) segsTotal = 3;
        if (center == null) center = CoMath.createVec3();

        let vs = new Array((segsTotal + 1) * 3);
        let j = 0;
        let rad = 0.0;
        let pi2 = Math.PI * 2;
        for (let i = 0; i <= segsTotal; ++i) {
            rad = pi2 * i / segsTotal;
            vs[j++] = center.x;
            vs[j++] = center.y + radius * Math.cos(rad);
            vs[j++] = center.z + radius * Math.sin(rad);
        }

        this.createCircle(vs, segsTotal);
        return this.createLineMesh();
    }
    createCurveByPositions(posList: IVector3D[], colorList: IColor4[] = null): IRawMesh {

        this.m_posvs = [];
        if (!this.dynColorEnabled) {
            this.m_colorvs = [];
            if (colorList == null) {
                this.useColor(posList.length * 2);
            }
            else {
                let c: IColor4;
                for (let i = 0; i < posList.length; ++i) {
                    c = colorList[i];
                    this.m_colorvs.push(c.r, c.g, c.b);
                    this.m_colorvs.push(c.r, c.g, c.b);
                }
            }
        }
        for (let i = 1; i < posList.length; ++i) {
            this.m_posvs.push(posList[i - 1].x, posList[i - 1].y, posList[i - 1].z);
            this.m_posvs.push(posList[i].x, posList[i].y, posList[i].z);
        }
        return this.createLineMesh();
    }
    createPolygon(posList: IVector3D[], colorList: IColor4[] = null): IRawMesh {
        return this.createCurveByPositions(posList, colorList);
    }
    destroy(): void {
        this.m_colorvs = null;
        this.m_posvs = null;
    }
}
export { LineMeshBuilder }