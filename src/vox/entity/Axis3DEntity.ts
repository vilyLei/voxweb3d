/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2023 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import DashedLineMesh from '../../vox/mesh/DashedLineMesh';
import DisplayEntity from "../../vox/entity/DisplayEntity";
import Color4 from '../../vox/material/Color4';
import IRenderMaterial from "../../vox/render/IRenderMaterial";
import Line3DMaterial from '../../vox/material/mcase/Line3DMaterial';
import Vector3D from '../math/Vector3D';

export default class Axis3DEntity extends DisplayEntity {
    private m_sm: DashedLineMesh = null;
    // 用于射线检测
    public rayTestRadius = 8.0;
    private m_posarr: number[] = [0, 0, 0, 100.0, 0, 0, 0, 0, 0, 0, 100.0, 0, 0, 0, 0, 0, 0, 100.0];
    colorX = new Color4(1.0, 0.0, 0.0, 1.0);
    colorY = new Color4(0.0, 1.0, 0.0, 1.0);
    colorZ = new Color4(0.0, 0.0, 1.0, 1.0);
    constructor() {
        super();
    }
    setLineWidth(lineW: number): void {
        //if(this.getMesh())
        //{
        //    //this.getMesh().vbuf.lineWidth = lineW;
        //}
    }
    createMaterial(): void {
        if (this.getMaterial() == null) {
            let cm = new Line3DMaterial();
            this.setMaterial(cm);
        }
    }
    protected __activeMesh(material: IRenderMaterial): void {
        if (this.getMesh() == null) {
            let colorarr: number[] = [
                this.colorX.r, this.colorX.g, this.colorX.b, this.colorX.r, this.colorX.g, this.colorX.b
                , this.colorY.r, this.colorY.g, this.colorY.b, this.colorY.r, this.colorY.g, this.colorY.b
                , this.colorZ.r, this.colorZ.g, this.colorZ.b, this.colorZ.r, this.colorZ.g, this.colorZ.b
            ];
            let mesh = new DashedLineMesh();
            mesh.rayTestRadius = this.rayTestRadius;
            mesh.vbWholeDataEnabled = false;
            mesh.setBufSortFormat(material.getBufSortFormat());
            mesh.initialize(this.m_posarr, colorarr);
            this.setMesh(mesh);
			this.m_sm = mesh;
        }
    }
	updateDataWithPos(axisXPos: Vector3D, axisYPos: Vector3D, axisZPos: Vector3D): void {
		let ls = this.m_posarr;
		axisXPos.toArray(ls, 3);
		axisYPos.toArray(ls, 9);
		axisZPos.toArray(ls, 15);
		this.m_sm.setVSData( this.m_posarr );
		this.m_sm.updateData();
	}
    /**
     * initialize the axis entity mesh and geometry data
     * @param axisSize the X/Y/Z axis length
     */
    initialize(axisSize: number = 100.0): void {
        if (axisSize < 1) {
            axisSize = 1;
        }
        this.m_posarr[3] = axisSize;
        this.m_posarr[10] = axisSize;
        this.m_posarr[17] = axisSize;
        this.createMaterial();
        this.activeDisplay();

    }
    /**
     * initialize the axis entity mesh and geometry data
     * @param sizeX the X axis length
     * @param sizeY the Y axis length
     * @param sizeZ the Z axis length
     */
    initializeSizeXYZ(sizeX: number, sizeY: number, sizeZ: number): void {
        this.m_posarr[3] = sizeX;
        this.m_posarr[10] = sizeY;
        this.m_posarr[17] = sizeZ;
        this.createMaterial();
        this.activeDisplay();
    }
    initializeCorssSizeXYZ(sizeX: number, sizeY: number, sizeZ: number): void {
        //  this.m_posarr[3] = sizeX;
        //  this.m_posarr[10] = sizeY;
        //  this.m_posarr[17] = sizeZ;

        sizeX *= 0.5;
        sizeY *= 0.5;
        sizeZ *= 0.5;
        this.m_posarr[0] = -sizeX;
        this.m_posarr[7] = -sizeY;
        this.m_posarr[14] = -sizeZ;
        this.m_posarr[3] = sizeX;
        this.m_posarr[10] = sizeY;
        this.m_posarr[17] = sizeZ;

        this.createMaterial();
        this.activeDisplay();
    }
    /**
     * initialize the cross axis entity mesh and geometry data
     * @param axisSize the X/Y/Z axis length
     */
    initializeCross(axisSize: number = 100.0, offset: Vector3D = null): void {
        if (axisSize < 2) {
            axisSize = 2;
        }
        axisSize *= 0.5;
        if(offset == null) {
            offset = new Vector3D();
        }
        this.m_posarr[0] = -axisSize + offset.x;
        this.m_posarr[7] = -axisSize + offset.y;
        this.m_posarr[14] = -axisSize + offset.z;
        this.m_posarr[3] = axisSize + offset.x;
        this.m_posarr[10] = axisSize + offset.y;
        this.m_posarr[17] = axisSize + offset.z;
        this.createMaterial();
        this.activeDisplay();

    }
	destroy(): void {
		super.destroy();
		this.m_sm = null;
	}
}
