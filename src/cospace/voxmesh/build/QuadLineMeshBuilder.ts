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

class QuadLineMeshBuilder extends MeshBuilder implements ILineMeshBuilder {

    private m_posvs: number[] = null;
    private m_colorvs: number[] = null;

    thickness = 30.0;
    readonly color = CoRScene.createColor4(1.0, 1.0, 1.0, 1.0);
    dynColorEnabled = true;

    constructor() { super() }

    setRGB3f(pr: number, pg: number, pb: number): void {
        this.color.setRGB3f(pr, pg, pb);
    }
    private createLineMesh(): IRawMesh {
        
        let mesh = CoMesh.createRawMesh();
        // mesh.ivsEnabled = false;
        mesh.aabbEnabled = true;
        mesh.reset();

        let pcolors: number[] = this.m_colorvs;        
        let posarr = this.m_posvs;

        let vtxTotal = Math.floor(posarr.length / 3);
        // let lsTotal = Math.floor(vtxTotal / 2);
        let thickness = this.thickness * 0.5;
        let vs = new Float32Array(vtxTotal * 8);
        let vs2 = new Float32Array(vs.length);
        let cvs2 = new Float32Array(vs.length);

        let cvs: Float32Array = null;
        if(pcolors != null) {
            cvs = new Float32Array(vs.length);
            cvs.set(pcolors, 0);
            cvs.set(pcolors, pcolors.length);
        }

        mesh.bounds = CoMath.createAABB();
        let i: number = posarr.length;
        let j: number = 0;
        let k: number = 0;
        let p: number = 0;
        let beginNextX: number = 2.0 * posarr[0] - posarr[3];
        let beginNextY: number = 2.0 * posarr[1] - posarr[4];
        let beginNextZ: number = 2.0 * posarr[2] - posarr[5];
        let endNextX: number = 2.0 * posarr[i - 3] - posarr[i - 6];
        let endNextY: number = 2.0 * posarr[i - 2] - posarr[i - 5];
        let endNextZ: number = 2.0 * posarr[i - 1] - posarr[i - 4];

        // console.log("posarr.length: " + posarr.length);
        // console.log("beginNextZ: " + beginNextZ);
        // console.log("endNextZ: " + endNextZ);

        let tot: number = vtxTotal - 1;
        i = 0;

        cvs2[p] = beginNextX;
        cvs2[p + 1] = beginNextY;
        cvs2[p + 2] = beginNextZ;
        cvs2[p + 3] = 0.0;
        p += 4;
        for (; i < tot; ++i) {
            vs[k] = posarr[j];
            vs[k + 1] = posarr[j + 1];
            vs[k + 2] = posarr[j + 2];
            vs[k + 3] = -thickness;
            mesh.bounds.addXYZ(posarr[j], posarr[j + 1], posarr[j + 2]);
            vs2[k] = posarr[j + 3];
            vs2[k + 1] = posarr[j + 4];
            vs2[k + 2] = posarr[j + 5];
            vs2[k + 3] = -thickness;

            cvs2[p] = posarr[j];
            cvs2[p + 1] = posarr[j + 1];
            cvs2[p + 2] = posarr[j + 2];
            cvs2[p + 3] = 0.0;

            j += 3;
            k += 4;
            p += 4;
        }
        vs[k] = posarr[j];
        vs[k + 1] = posarr[j + 1];
        vs[k + 2] = posarr[j + 2];
        vs[k + 3] = -thickness;
        mesh.bounds.addXYZ(posarr[j], posarr[j + 1], posarr[j + 2]);
        vs2[k] = endNextX;
        vs2[k + 1] = endNextY;
        vs2[k + 2] = endNextZ;
        vs2[k + 3] = -thickness;
        j += 3;
        k += 4;
        mesh.bounds.updateFast();

        i = j = 0;
        //j = 0;
        for (; i < vtxTotal; ++i) {
            vs[k] = vs[j];
            vs[k + 1] = vs[j + 1];
            vs[k + 2] = vs[j + 2];
            vs[k + 3] = thickness;

            vs2[k] = vs2[j];
            vs2[k + 1] = vs2[j + 1];
            vs2[k + 2] = vs2[j + 2];
            vs2[k + 3] = thickness;

            cvs2[k] = cvs2[j];
            cvs2[k + 1] = cvs2[j + 1];
            cvs2[k + 2] = cvs2[j + 2];
            cvs2[k + 3] = thickness;
            k += 4;
            j += 4;
        }

        let ivs = new Uint16Array(tot * 6);
        i = j = 0;
        for (; i < tot; ++i) {
            ivs[j] = i;
            ivs[j + 1] = i + 1;
            ivs[j + 2] = i + vtxTotal + 1;
            ivs[j + 3] = i;
            ivs[j + 4] = i + vtxTotal + 1;
            ivs[j + 5] = i + vtxTotal;
            j += 6;
        }

        console.log("QuadLineMesh::initialize(), vs: " + vs);
        console.log("QuadLineMesh::initialize(), vs2: " + vs2);
        console.log("QuadLineMesh::initialize(), cvs: " + cvs);
        console.log("QuadLineMesh::initialize(), cvs2: " + cvs2);
        console.log("QuadLineMesh::initialize(), ivs: " + ivs);

        mesh.vbWholeDataEnabled = true;
        mesh.addFloat32Data(vs, 4);
        if(cvs != null) {
            mesh.addFloat32Data(cvs, 4);
        }
        mesh.addFloat32Data(vs2, 4);
        mesh.addFloat32Data(cvs2, 4);
        mesh.setIVS( ivs );

        mesh.aabbEnabled = false;
        mesh.initialize();
        mesh.trisNumber = tot * 2;
        return mesh;
    }
    private useColor(posTotal: number): void {
        if (!this.dynColorEnabled) {
            this.m_colorvs = new Array(posTotal * 4);
            for (let i = 0; i < posTotal; ++i) this.color.toArray(this.m_colorvs, i * 4);
        }
    }
    createLine(begin: IVector3D, end: IVector3D = null, axialRadius: number = 0.0): IRawMesh {
        if (this.m_posvs == null) {
            this.m_posvs = [0.0, 0.0, 0.0, 100.0, 0, 0];
        }
        if (begin != null) begin.toArray(this.m_posvs);
        if (end != null) end.toArray(this.m_posvs, 3);
        this.useColor(2);
        let mesh = this.createLineMesh();
        if(axialRadius > 0.00001) {
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
    private createCircle(vs: number[]): void {

        this.m_posvs = vs;
        this.useColor(vs.length / 3);
    }
    createCircleXOY(radius: number, segsTotal: number, center: IVector3D = null): IRawMesh {

        if (radius < 0.001) radius = 0.001;
        if (segsTotal < 3) segsTotal = 3;
        if (center == null) center = CoMath.createVec3();

        let vs = new Array((segsTotal + 2) * 3);
        let j = 0;
        let rad = 0.0;
        let pi2 = Math.PI * 2;
        let n = segsTotal + 1;
        for (let i = 0; i <= n; ++i) {
            rad = pi2 * i / segsTotal;
            vs[j++] = center.x + radius * Math.cos(rad);
            vs[j++] = center.y + radius * Math.sin(rad);
            vs[j++] = center.z;
        }

        this.createCircle(vs);
        return this.createLineMesh();
    }
    createCircleXOZ(radius: number, segsTotal: number, center: IVector3D = null): IRawMesh {

        if (radius < 0.001) radius = 0.001;
        if (segsTotal < 3) segsTotal = 3;
        if (center == null) center = CoMath.createVec3();

        let vs = new Array((segsTotal + 2) * 3);
        let j = 0;
        let rad = 0.0;
        let pi2 = Math.PI * 2;
        let n = segsTotal + 1;
        for (let i = 0; i <= n; ++i) {
            rad = pi2 * i / segsTotal;
            vs[j++] = center.x + radius * Math.cos(rad);
            vs[j++] = center.y;
            vs[j++] = center.z + radius * Math.sin(rad);
        }

        this.createCircle(vs);
        return this.createLineMesh();
    }
    createCircleYOZ(radius: number, segsTotal: number, center: IVector3D = null): IRawMesh {

        if (radius < 0.001) radius = 0.001;
        if (segsTotal < 3) segsTotal = 3;
        if (center == null) center = CoMath.createVec3();

        let vs = new Array((segsTotal + 2) * 3);
        let j = 0;
        let rad = 0.0;
        let pi2 = Math.PI * 2;
        let n = segsTotal + 1;
        for (let i = 0; i <= n; ++i) {
            rad = pi2 * i / segsTotal;
            vs[j++] = center.x;
            vs[j++] = center.y + radius * Math.cos(rad);
            vs[j++] = center.z + radius * Math.sin(rad);
        }

        this.createCircle(vs);
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
                }
            }
        }
        for (let i = 0; i < posList.length; ++i) {
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
export { QuadLineMeshBuilder }