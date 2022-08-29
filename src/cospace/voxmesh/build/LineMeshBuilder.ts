/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import Vector3D from "../../../vox/math/IVector3D";
import IColor4 from '../../../vox/material/IColor4';

import { ICoRScene } from "../../voxengine/ICoRScene";
declare var CoRScene: ICoRScene;

export default class LineMeshBuilder {
    constructor() {
    }
    private m_posarr: number[] = null;
    private m_colorarr: number[] = null;
    private m_lineMesh: any = null;
    color = CoRScene.createColor4(1.0, 0.0, 0.0, 1.0);
    dynColorEnabled: boolean = false;
    setRGB3f(pr: number, pg: number, pb: number): void {
        this.color.setRGB3f(pr, pg, pb);
    }
    protected __activeMesh(): void {
        let mesh: any;
        mesh.vbWholeDataEnabled = false;
        mesh.initialize(this.m_posarr, this.m_colorarr);
    }
    setPosAt(i: number, pos: Vector3D): void {
        if (this.m_lineMesh != null) {
            this.m_lineMesh.setVSXYZAt(i, pos.x, pos.y, pos.z);
        }
    }
    createLine(begin: Vector3D, end: Vector3D = null): void {
        if (this.m_posarr == null) {
            this.m_posarr = [100.0, 0.0, 0.0, 0.0, 0, 0];
        }
        this.m_posarr[0] = begin.x;
        this.m_posarr[1] = begin.y;
        this.m_posarr[2] = begin.z;
        if (end == null) {
            this.m_posarr[3] = 0;
            this.m_posarr[4] = 0;
            this.m_posarr[5] = 0;
        }
        else {
            this.m_posarr[3] = end.x;
            this.m_posarr[4] = end.y;
            this.m_posarr[5] = end.z;
        }

        this.m_colorarr = [
            this.color.r, this.color.g, this.color.b, this.color.r, this.color.g, this.color.b
        ];
    }
    createRectXOY(px: number, py: number, pw: number, ph: number): void {
        pw += px;
        ph += py;
        if (!this.dynColorEnabled) {
            let c = this.color;
            this.m_colorarr = [
                c.r, c.g, c.b, c.r, c.g, c.b,
                c.r, c.g, c.b, c.r, c.g, c.b,
                c.r, c.g, c.b, c.r, c.g, c.b,
                c.r, c.g, c.b, c.r, c.g, c.b
            ];
        }
        this.m_posarr = [px, py, 0.0, pw, py, 0.0, pw, py, 0.0, pw, ph, 0.0, pw, ph, 0.0, px, ph, 0.0, px, ph, 0.0, px, py, 0.0];
    }
    
    createRectXOZ(px: number, pz: number, pw: number, pl: number): void {
        pw += px;
        pl += pz;
        if (!this.dynColorEnabled) {
            let c = this.color;
            this.m_colorarr = [
                c.r, c.g, c.b, c.r, c.g, c.b,
                c.r, c.g, c.b, c.r, c.g, c.b,
                c.r, c.g, c.b, c.r, c.g, c.b,
                c.r, c.g, c.b, c.r, c.g, c.b
            ];
        }
        this.m_posarr = [px, 0.0, pz, pw, 0.0, pz, pw, 0.0, pz, pw, 0.0, pl, pw, 0.0, pl, px, 0.0, pl, px, 0.0, pl, px, 0.0, pz];
    }
    createByPosList(posList: Vector3D[], colorList: IColor4[] = null): void {
        
        this.m_posarr = [];
        if (!this.dynColorEnabled) {
            this.m_colorarr = [];
            if(colorList == null) {
                for(let i = 0; i < posList.length; ++i) {
                    this.m_colorarr.push(this.color.r, this.color.g, this.color.b,this.color.r, this.color.g, this.color.b);
                }
            }
            else {
                let c: IColor4;
                for(let i = 0; i < posList.length; ++i) {
                    c = colorList[i];
                    this.m_colorarr.push(c.r, c.g, c.b);
                    this.m_colorarr.push(c.r, c.g, c.b);
                }
            }
        }

        for(let i = 1; i < posList.length; ++i) {
            this.m_posarr.push(posList[i-1].x, posList[i-1].y, posList[i-1].z);
            this.m_posarr.push(posList[i].x, posList[i].y, posList[i].z);
        }
    }
    createPolygon(posList: Vector3D[], colorList: IColor4[] = null): void {
        this.createByPosList(posList, colorList);
    }
    destroy(): void {
        this.m_lineMesh = null;
    }
}