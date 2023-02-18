/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import DashedQuadLineMesh from '../../vox/mesh/DashedQuadLineMesh';
import DisplayEntity from "../../vox/entity/DisplayEntity";
import Color4 from '../../vox/material/Color4';
import IRenderMaterial from "../../vox/render/IRenderMaterial";
import QuadLine3DMaterial from '../../vox/material/mcase/QuadLine3DMaterial';
import IROTransform from "../../vox/display/IROTransform";

export default class AxisQuad3DEntity extends DisplayEntity {
    constructor(transform: IROTransform = null) {
        super(transform);
    }
    // 用于射线检测
    public pickTestRadius: number = 8.0;
    private m_thickness: number = 2.0;
    wireframe: boolean = false;
    colorX: Color4 = new Color4(1.0, 0.0, 0.0, 1.0);
    colorY: Color4 = new Color4(0.0, 1.0, 0.0, 1.0);
    colorZ: Color4 = new Color4(0.0, 0.0, 1.0, 1.0);
    private m_posarr: number[] = [0, 0, 0, 100.0, 0, 0, 0, 0, 0, 0, 100.0, 0, 0, 0, 0, 0, 0, 100.0];
    //private m_posarr:number[] = [0,0,0, 100.0,0,0];
    createMaterial(): void {
        if (this.getMaterial() == null) {
            let cm: QuadLine3DMaterial = new QuadLine3DMaterial();
            this.setMaterial(cm);
        }
    }
    protected __activeMesh(material: IRenderMaterial): void {
        if (this.getMesh() == null) {
            let colorarr: number[] = [
                this.colorX.r, this.colorX.g, this.colorX.b, this.colorX.a
                , this.colorY.r, this.colorY.g, this.colorY.b, this.colorY.a
                , this.colorZ.r, this.colorZ.g, this.colorZ.b, this.colorZ.a
            ];
            let mesh: DashedQuadLineMesh = new DashedQuadLineMesh();
            mesh.wireframe = this.wireframe;
            mesh.rayTestRadius = this.pickTestRadius;
            mesh.vbWholeDataEnabled = true;
            mesh.setBufSortFormat(material.getBufSortFormat());
            mesh.initialize(this.m_posarr, colorarr, this.m_thickness);
            this.setMesh(mesh);
        }
    }
    initialize(size: number = 100.0, thickness: number = 2.0): void {
        if (size < 10) {
            size = 10;
        }
        if (thickness < 0.1) {
            thickness = 0.1;
        }
        this.m_thickness = thickness;
        this.m_posarr[3] = size;
        this.m_posarr[10] = size;
        this.m_posarr[17] = size;
        this.createMaterial();
        this.activeDisplay();

    }
    initializeSizeXYZ(sizeX: number, sizeY: number, sizeZ: number, thickness: number = 2.0): void {
        this.m_posarr[3] = sizeX;
        this.m_posarr[10] = sizeY;
        this.m_posarr[17] = sizeZ;
        this.createMaterial();
        this.activeDisplay();
    }
}