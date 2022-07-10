/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import Vector3D from '../../vox/math/Vector3D';
import DashedLineMesh from '../../vox/mesh/DashedLineMesh';
import DisplayEntity from "../../vox/entity/DisplayEntity";
import IRenderMaterial from "../../vox/render/IRenderMaterial";
import Line3DMaterial from '../../vox/material/mcase/Line3DMaterial';
import Color4 from '../material/Color4';
import CameraBase from '../view/CameraBase';
export default class DashedLine3DEntity extends DisplayEntity {
    private m_currMaterial: Line3DMaterial = null;
    private m_posarr: number[] = null;
    private m_colorarr: number[] = null;
    private m_f32VS: Float32Array = null;
    dynColorEnabled: boolean = true;
    constructor() {
        super();
    }

    setRGB3f(pr: number, pg: number, pb: number) {
        this.m_currMaterial.setRGB3f(pr, pg, pb);
    }
    createMaterial(): void {
        if (this.getMaterial() == null) {
            this.m_currMaterial = new Line3DMaterial(this.dynColorEnabled);
            this.setMaterial(this.m_currMaterial);
        }
    }
    protected __activeMesh(material: IRenderMaterial): void {
        if (this.getMesh() == null) {
            let mesh: DashedLineMesh = new DashedLineMesh();
            mesh.vbWholeDataEnabled = false;
            mesh.setBufSortFormat(material.getBufSortFormat());
            mesh.setVS( this.m_f32VS );
            mesh.initialize(this.m_posarr, this.m_colorarr);
            this.setMesh(mesh);
        }
    }
    initializeLS(va: Vector3D, vb: Vector3D): void {
        this.m_posarr = [va.x, va.y, va.z, vb.x, vb.y, vb.z];

        this.createMaterial();
        this.activeDisplay();

    }
    initializeF32VS(f32vs: Float32Array): void {
        this.m_f32VS = f32vs;

        this.createMaterial();
        this.activeDisplay();

    }
    initiazlizeFrustrum(camera: CameraBase): void {

        let pvs: Vector3D[] = camera.getWordFrustumVtxArr();
        this.m_posarr = new Array(72);
        this.m_colorarr = new Array(72);

        let ids: number[] = [
            0, 1, 1, 2, 2, 3, 3, 0,    // far plane
            4, 5, 5, 6, 6, 7, 7, 4,    // near plane
            0, 4, 1, 5, 2, 6, 3, 7,    // side plane
        ];
        let farColor: Color4 = new Color4(1.0, 0.0, 1.0, 1.0);
        let nearColor: Color4 = new Color4(0.0, 0.5, 1.0);
        let sideColor: Color4 = new Color4(0.0, 0.9, 0.0);
        let colors: Color4[] = [
            farColor, farColor, farColor, farColor, farColor, farColor, farColor, farColor,
            nearColor, nearColor, nearColor, nearColor, nearColor, nearColor, nearColor, nearColor,
            sideColor, sideColor, sideColor, sideColor, sideColor, sideColor, sideColor, sideColor,
        ];
        let pv: Vector3D;
        let color: Color4;
        let j: number = 0;
        for (let i: number = 0; i < ids.length; i++) {

            pv = pvs[ids[i]];
            color = colors[i];

            this.m_posarr[j] = pv.x;
            this.m_posarr[j + 1] = pv.y;
            this.m_posarr[j + 2] = pv.z;

            this.m_colorarr[j] = color.r;
            this.m_colorarr[j + 1] = color.g;
            this.m_colorarr[j + 2] = color.b;

            j += 3;
        }
        this.dynColorEnabled = false;

        this.createMaterial();
        this.activeDisplay();
    }
    initializeBySegmentLine(pvList: Vector3D[], colors: Color4[] = null): void {
        //this.m_posarr = [va.x,va.y,va.z, vb.x,vb.y,vb.z];
        this.m_posarr = [];
        let i: number = 0;
        let len: number = pvList.length;
        for (; i < len; i += 2) {
            this.m_posarr.push(pvList[i].x, pvList[i].y, pvList[i].z);
            this.m_posarr.push(pvList[i + 1].x, pvList[i + 1].y, pvList[i + 1].z);
        }
        if (colors != null) {
            this.dynColorEnabled = false;
        }
        if (!this.dynColorEnabled) {
            if (colors == null) {
                this.m_colorarr = this.m_posarr.slice();
                this.m_colorarr.fill(1.0);
            }
            else {
                this.m_colorarr = new Array(this.m_posarr.length);
                let j: number = 0;
                let color: Color4;
                for (i = 0; i < len; i++) {
                    color = colors[i];
                    this.m_colorarr[j] = color.r;
                    this.m_colorarr[j + 1] = color.g;
                    this.m_colorarr[j + 2] = color.b;
                    j += 3;
                }
            }

        }
        this.createMaterial();
        this.activeDisplay();

    }
    initializeByPosition(pvList: Vector3D[], origin: boolean = false): void {
        //this.m_posarr = [va.x,va.y,va.z, vb.x,vb.y,vb.z];
        this.m_posarr = [];
        let len: number = pvList.length;
        if(origin) {
            for (let i = 0; i < len; i++) {
                const pos = pvList[i];
                this.m_posarr.push(pos.x, pos.y, pos.z);
            }
        }else {
            let pos0: Vector3D;
            let pos1: Vector3D;
            for (let i = 1; i < len; i++) {
                pos0 = pvList[i - 1];
                this.m_posarr.push(pos0.x, pos0.y, pos0.z);
                pos1 = pvList[i];
                this.m_posarr.push(pos1.x, pos1.y, pos1.z);
            }
        }

        this.createMaterial();
        this.activeDisplay();

    }
    toString(): string {
        return "DashedLine3DEntity(name=" + this.name + ",uid = " + this.getUid() + ", rseFlag = " + this.__$rseFlag + ")";
    }
}