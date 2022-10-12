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

    private m_posvs: Float32Array = null;
    private m_colorvs: Float32Array = null;
    private m_beginRad: number = 0.0;
    private m_rangeRad: number = 0.0;

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
            mesh.addFloat32Data(this.m_colorvs, 3);
        }
        mesh.vbWholeDataEnabled = false;
        mesh.initialize();
        mesh.toArraysLines();
        mesh.vtCount = Math.floor(vs.length / 3);

        return mesh;
    }
    private useColor(posTotal: number): void {
        this.m_colorvs = null;
        if (!this.dynColorEnabled) {
            this.m_colorvs = new Float32Array(posTotal * 3);
            for (let i = 0; i < posTotal; ++i) this.color.toArray3(this.m_colorvs, i * 3);
        }
    }
    createLine(begin: IVector3D, end: IVector3D = null, axialRadius: number = 0.0): IRawMesh {

        this.m_posvs = new Float32Array([0.0, 0.0, 0.0, 100.0, 0, 0]);

        if (begin != null) begin.toArray(this.m_posvs);
        if (end != null) end.toArray(this.m_posvs, 3);
        this.useColor(2);
        let mesh = this.createLineMesh();
        if (axialRadius > 0.00001) {
            let r = axialRadius;

            let ab0 = CoMath.createAABB();
            ab0.min.setXYZ(begin.x - r, begin.y - r, begin.z - r);
            ab0.max.setXYZ(begin.x + r, begin.y + r, begin.z + r);

            let ab1 = CoMath.createAABB();
            ab1.min.setXYZ(end.x - r, end.y - r, end.z - r);
            ab1.max.setXYZ(end.x + r, end.y + r, end.z + r);
            ab0.union(ab1);

            mesh.bounds.copyFrom(ab0);
            mesh.bounds.update();
        }

        return mesh;
    }
    createRectXOY(px: number, py: number, pw: number, ph: number): IRawMesh {
        pw += px;
        ph += py;
        this.useColor(8);
        this.m_posvs = new Float32Array([px, py, 0.0, pw, py, 0.0, pw, py, 0.0, pw, ph, 0.0, pw, ph, 0.0, px, ph, 0.0, px, ph, 0.0, px, py, 0.0]);
        return this.createLineMesh();
    }
    createRectXOZ(px: number, pz: number, pw: number, pl: number): IRawMesh {
        pw += px;
        pl += pz;
        this.useColor(8);
        this.m_posvs = new Float32Array([px, 0.0, pz, pw, 0.0, pz, pw, 0.0, pz, pw, 0.0, pl, pw, 0.0, pl, px, 0.0, pl, px, 0.0, pl, px, 0.0, pz]);
        return this.createLineMesh();
    }

    createRectYOZ(py: number, pz: number, pw: number, pl: number): IRawMesh {
        pw += py;
        pl += pz;
        this.useColor(8);
        this.m_posvs = new Float32Array([0.0, py, pz, 0.0, pw, pz, 0.0, pw, pz, 0.0, pw, pl, 0.0, pw, pl, 0.0, py, pl, 0.0, py, pl, 0.0, py, pz]);
        return this.createLineMesh();
    }
    private createCircle(vs: number[], segsTotal: number): void {

        this.m_posvs = new Float32Array((segsTotal * 2) * 3);
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
    private createCircleData(ix: number, iy: number, iz: number, radius: number, segsTotal: number, center: IVector3D): number[] {

        if (radius < 0.001) radius = 0.001;
        if (segsTotal < 3) segsTotal = 3;
        if (center == null) center = CoMath.createVec3();

        let vs = new Array((segsTotal + 1) * 3);
        let j = 0;
        let rad = this.m_rangeRad;
        let range = rad > 0.0 ? rad : Math.PI * 2;
        let cvs = [center.x, center.y, center.z];
        for (let i = 0; i <= segsTotal; ++i) {
            rad = this.m_beginRad + range * i / segsTotal;
            vs[j + ix] = cvs[ix] + radius * Math.cos(rad);
            vs[j + iy] = cvs[iy] + radius * Math.sin(rad);
            vs[j + iz] = cvs[iz];
            j += 3;
        }
        return vs;
    }
    createCircleXOY(radius: number, segsTotal: number, center: IVector3D = null, beginRad: number = 0.0, rangeRad: number = 0.0): IRawMesh {

        this.m_beginRad = beginRad;
        this.m_rangeRad = rangeRad;

        let vs = this.createCircleData(0, 1, 2, radius, segsTotal, center);
        this.createCircle(vs, segsTotal);
        return this.createLineMesh();
    }
    createCircleXOZ(radius: number, segsTotal: number, center: IVector3D = null, beginRad: number = 0.0, rangeRad: number = 0.0): IRawMesh {

        this.m_beginRad = beginRad;
        this.m_rangeRad = rangeRad;

        let vs = this.createCircleData(0, 2, 1, radius, segsTotal, center);
        this.createCircle(vs, segsTotal);
        return this.createLineMesh();
    }
    createCircleYOZ(radius: number, segsTotal: number, center: IVector3D = null, beginRad: number = 0.0, rangeRad: number = 0.0): IRawMesh {

        this.m_beginRad = beginRad;
        this.m_rangeRad = rangeRad;

        let vs = this.createCircleData(1, 2, 0, radius, segsTotal, center);
        this.createCircle(vs, segsTotal);
        return this.createLineMesh();
    }
    createCurveByPositions(posList: IVector3D[], colorList: IColor4[] = null): IRawMesh {

        this.m_posvs = new Float32Array(posList.length * 6);
        let k = 0;
        if (!this.dynColorEnabled) {
            if (colorList == null) {
                this.useColor(posList.length * 2);
            }
            else {
                this.m_colorvs = new Float32Array(posList.length * 6);
                let c: IColor4;
                for (let i = 0; i < posList.length; ++i) {
                    c = colorList[i];
                    c.fromArray3(this.m_colorvs, k);
                    k += 3;
                    c.fromArray3(this.m_colorvs, k);
                    k += 3;
                }
            }
        }
        k = 0;
        for (let i = 1; i < posList.length; ++i) {
            posList[i - 1].toArray(this.m_posvs, k);
            k+=3;
            posList[i].toArray(this.m_posvs, k);
            k+=3;
            // this.m_posvs.push(posList[i - 1].x, posList[i - 1].y, posList[i - 1].z);
            // this.m_posvs.push(posList[i].x, posList[i].y, posList[i].z);
        }
        return this.createLineMesh();
    }
    createPolygon(posList: IVector3D[], colorList: IColor4[] = null): IRawMesh {
        return this.createCurveByPositions(posList, colorList);
    }
    createLines(linePosList: IVector3D[], colorList: IColor4[] = null): IRawMesh {
        if (linePosList.length < 1 || linePosList.length % 2 != 0) {
            throw Error("illegal positions data for creating lines.");
        }
        this.m_posvs = new Float32Array(linePosList.length * 3);
        let k = 0;
        if (!this.dynColorEnabled) {
            if (colorList == null) {
                this.useColor(linePosList.length);
            }
            else {
                this.m_colorvs = new Float32Array(linePosList.length * 3);
                let c: IColor4;
                for (let i = 0; i < linePosList.length; ++i) {
                    c = colorList[i];
                    c.fromArray3(this.m_colorvs, k)
                    k += 3;
                    //this.m_colorvs.push(c.r, c.g, c.b);
                }
            }
        }
        k = 0;
        for (let i = 0; i < linePosList.length; ++i) {
            // this.m_posvs.push(linePosList[i].x, linePosList[i].y, linePosList[i].z);
            linePosList[i].toArray(this.m_posvs, k);
            k += 3;
        }
        return this.createLineMesh();
    }
    createLinesWithFS32(posvs: Float32Array, colorvs: Float32Array = null): IRawMesh {
        if (posvs.length < 3 || posvs.length % 3 != 0) {
            throw Error("illegal positions data for creating lines.");
        }
        this.m_posvs = posvs;
        if (!this.dynColorEnabled) {
            if (colorvs == null) {
                this.useColor(posvs.length / 3);
            }
            else {
                this.m_colorvs = colorvs;
            }
        }
        // for (let i = 0; i < linePosList.length; ++i) {
        //     this.m_posvs.push(linePosList[i].x, linePosList[i].y, linePosList[i].z);
        // }
        return this.createLineMesh();
    }
    destroy(): void {
        this.m_colorvs = null;
        this.m_posvs = null;
    }
}
export { LineMeshBuilder }