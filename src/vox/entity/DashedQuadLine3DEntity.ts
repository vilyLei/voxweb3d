/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import Vector3D from "../../vox/math/Vector3D";
import DashedQuadLineMesh from '../../vox/mesh/DashedQuadLineMesh';
import DisplayEntity from "../../vox/entity/DisplayEntity";
import Color4 from '../../vox/material/Color4';
import IRenderMaterial from "../../vox/render/IRenderMaterial";
import QuadLine3DMaterial from '../../vox/material/mcase/QuadLine3DMaterial';

export default class DashedQuadLine3DEntity extends DisplayEntity {
    constructor() {
        super();
    }
    color: Color4 = new Color4(1.0, 1.0, 1.0, 1.0);
    private m_posarr: number[] = null;
    private m_colorarr: number[] = null;
    private m_thickness: number = 100.0;
    createMaterial(): void {
        if (this.getMaterial() == null) {
            let cm: QuadLine3DMaterial = new QuadLine3DMaterial();
            this.setMaterial(cm);
        }
    }
    protected __activeMesh(material: IRenderMaterial): void {
        if (this.getMesh() == null) {
            let colorarr: number[] = null;
            if (this.m_colorarr == null) {
                let tot: number = Math.floor(this.m_posarr.length / 6.0);
                colorarr = [];
                colorarr.length = tot * 4;
                let i: number = 0;
                let j: number = 0;
                for (; i < tot; ++i) {
                    colorarr[j] = this.color.r;
                    colorarr[j + 1] = this.color.g;
                    colorarr[j + 2] = this.color.b;
                    colorarr[j + 3] = this.color.a;
                    j += 4;
                }
            }
            let mesh: DashedQuadLineMesh = new DashedQuadLineMesh();
            mesh.vbWholeDataEnabled = true;
            mesh.initialize(this.m_posarr, colorarr, this.m_thickness);
            this.setMesh(mesh);
        }
    }
    // for example: posarr      ->[0.0,0.0,0.0, 100.0,0.0,0.0, 150.0,0.0,0.0, 250.0,0.0,0.0]
    //              colorarr    ->[1.0,0.0,0.0, 0.0,1.0,0.0]
    initialize(posarr: number[], thickness: number, colorarr: number[] = null): void {
        this.m_thickness = thickness;
        this.m_posarr = posarr;
        this.m_colorarr = colorarr;

        if (this.m_thickness < 0.1) {
            this.m_thickness = 0.1;
        }

        this.createMaterial();
        this.activeDisplay();

    }

    toString(): string {
        return "[DashedQuadLine3DEntity]";
    }
}