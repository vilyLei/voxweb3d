/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2023 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import Vector3D from "../../vox/math/Vector3D";
import IAABB from "../../vox/geom/IAABB";
import VtxBufConst from "../../vox/mesh/VtxBufConst";
import DashedLineMesh from '../../vox/mesh/DashedLineMesh';
import DisplayEntity from "../../vox/entity/DisplayEntity";
import Color4 from '../../vox/material/Color4';
import IRenderMaterial from "../../vox/render/IRenderMaterial";
import Line3DMaterial from '../../vox/material/mcase/Line3DMaterial';
import IOBB from "../geom/IOBB";

export default class BoxFrame3D extends DisplayEntity {
    private m_dynColorBoo: boolean = false;
    constructor(dynColorBoo: boolean = false) {
        super();
        this.m_dynColorBoo = dynColorBoo;
    }
    private m_minV: Vector3D = new Vector3D(-100.0, -100.0, -100.0);
    private m_maxV: Vector3D = new Vector3D(100.0, 100.0, 100.0);
    private m_posarr: number[] = null;
    private m_sm: DashedLineMesh = null;
    private m_currMaterial: Line3DMaterial = null;
    // 用于射线检测
    public rayTestRadius: number = 8.0;
    color: Color4 = new Color4(1.0, 1.0, 1.0, 1.0);
    setLineWidth(lineW: number): void {
        //if(this.getMesh())
        //{
        //    //this.getMesh().vbuf.lineWidth = lineW;
        //}
    }

    setRGB3f(pr: number, pg: number, pb: number): void {
        if (this.m_dynColorBoo) {
            this.m_currMaterial.setRGB3f(pr, pg, pb);
        }
    }
    createMaterial(): void {
        if (this.getMaterial() == null) {
            this.m_currMaterial = new Line3DMaterial(this.m_dynColorBoo);
            this.setMaterial(this.m_currMaterial);
        }
    }
    protected __activeMesh(material: IRenderMaterial): void {
        if (this.getMesh() == null) {
            let colorarr: number[] = null;
            if (!this.m_dynColorBoo) {
                colorarr = [];
                let i: number = 0;
                for (; i < 24; ++i) {
                    colorarr.push(this.color.r, this.color.g, this.color.b);
                }
            }
            this.m_sm = new DashedLineMesh(VtxBufConst.VTX_DYNAMIC_DRAW);
            this.m_sm.rayTestRadius = this.rayTestRadius;
            this.m_sm.vbWholeDataEnabled = false;
            this.m_sm.setBufSortFormat(material.getBufSortFormat());
            if (this.m_dynColorBoo) {
                this.m_sm.initialize(this.m_posarr, null);
            }
            else {
                this.m_sm.initialize(this.m_posarr, colorarr);
            }
            this.setMesh(this.m_sm);
        }
    }
    initializeByAABB(aabb: IAABB): void {
        this.initialize(aabb.min, aabb.max);
    }
    initialize(minV: Vector3D, maxV: Vector3D): void {
        this.m_minV.copyFrom(minV);
        this.m_maxV.copyFrom(maxV);
        this.m_posarr = [
            // bottom frame plane: -y, first pos: (+x,-y,+z), plane positions wrap mode: CCW
            this.m_minV.x, this.m_minV.y, this.m_minV.z, this.m_minV.x, this.m_minV.y, this.m_maxV.z,
            this.m_minV.x, this.m_minV.y, this.m_minV.z, this.m_maxV.x, this.m_minV.y, this.m_minV.z,
            this.m_minV.x, this.m_minV.y, this.m_maxV.z, this.m_maxV.x, this.m_minV.y, this.m_maxV.z,
            this.m_maxV.x, this.m_minV.y, this.m_minV.z, this.m_maxV.x, this.m_minV.y, this.m_maxV.z,
            // wall frame
            this.m_minV.x, this.m_minV.y, this.m_minV.z, this.m_minV.x, this.m_maxV.y, this.m_minV.z,
            this.m_minV.x, this.m_minV.y, this.m_maxV.z, this.m_minV.x, this.m_maxV.y, this.m_maxV.z,
            this.m_maxV.x, this.m_minV.y, this.m_minV.z, this.m_maxV.x, this.m_maxV.y, this.m_minV.z,
            this.m_maxV.x, this.m_minV.y, this.m_maxV.z, this.m_maxV.x, this.m_maxV.y, this.m_maxV.z,
            // top frame plane: +y
            this.m_minV.x, this.m_maxV.y, this.m_minV.z, this.m_minV.x, this.m_maxV.y, this.m_maxV.z,
            this.m_minV.x, this.m_maxV.y, this.m_minV.z, this.m_maxV.x, this.m_maxV.y, this.m_minV.z,
            this.m_minV.x, this.m_maxV.y, this.m_maxV.z, this.m_maxV.x, this.m_maxV.y, this.m_maxV.z,
            this.m_maxV.x, this.m_maxV.y, this.m_minV.z, this.m_maxV.x, this.m_maxV.y, this.m_maxV.z
        ];

        this.createMaterial();
        this.activeDisplay();
        if (this.m_sm == null) this.m_sm = this.getMesh() as DashedLineMesh;
    }

    initializeByOBB(obb: IOBB, scale: number = 1.0): void {
		let ls = this.createPosList8ByOBB(obb, scale);
		this.initializeByPosList8(ls);
	}

	private createPosList8ByOBB(obb: IOBB, scale: number = 1.0): Vector3D[] {

		// bottom frame plane wit "-y axis"
		let et = obb.extent.clone().scaleBy(scale);

		let cv = obb.center;
		let max_vx = obb.axis[0].clone().scaleBy(et.x);
		let max_vy = obb.axis[1].clone().scaleBy(et.y);
		let max_vz = obb.axis[2].clone().scaleBy(et.z);
		let min_vx = max_vx.clone().scaleBy(-1);
		let min_vy = max_vy.clone().scaleBy(-1);
		let min_vz = max_vz.clone().scaleBy(-1);


		// 与"y"轴垂直的center positon之上的面
		let v0 = max_vx.clone().addBy(max_vy).addBy(max_vz).addBy(cv);// max pos
		let v1 = max_vx.clone().addBy(max_vy).addBy(min_vz).addBy(cv);
		let v2 = min_vx.clone().addBy(max_vy).addBy(min_vz).addBy(cv);
		let v3 = min_vx.clone().addBy(max_vy).addBy(max_vz).addBy(cv);
		// 与"y"轴垂直的center positon之下的面
		let p0 = max_vx.clone().addBy(min_vy).addBy(max_vz).addBy(cv);
		let p1 = max_vx.clone().addBy(min_vy).addBy(min_vz).addBy(cv);
		let p2 = min_vx.clone().addBy(min_vy).addBy(min_vz).addBy(cv);
		let p3 = min_vx.clone().addBy(min_vy).addBy(max_vz).addBy(cv);

		let ls = [v0, v1, v2, v3, p0, p1, p2, p3];
		return ls;
	}
	private createVSDataByPosList8(posList8: Vector3D[]): number[] {
		let posarr = [
            // bottom frame
            posList8[0].x, posList8[0].y, posList8[0].z, posList8[1].x, posList8[1].y, posList8[1].z,
            posList8[1].x, posList8[1].y, posList8[1].z, posList8[2].x, posList8[2].y, posList8[2].z,
            posList8[2].x, posList8[2].y, posList8[2].z, posList8[3].x, posList8[3].y, posList8[3].z,
            posList8[3].x, posList8[3].y, posList8[3].z, posList8[0].x, posList8[0].y, posList8[0].z,
            // wall frame
            posList8[0].x, posList8[0].y, posList8[0].z, posList8[4].x, posList8[4].y, posList8[4].z,
            posList8[1].x, posList8[1].y, posList8[1].z, posList8[5].x, posList8[5].y, posList8[5].z,
            posList8[2].x, posList8[2].y, posList8[2].z, posList8[6].x, posList8[6].y, posList8[6].z,
            posList8[3].x, posList8[3].y, posList8[3].z, posList8[7].x, posList8[7].y, posList8[7].z,
            // top frame
            posList8[4].x, posList8[4].y, posList8[4].z, posList8[5].x, posList8[5].y, posList8[5].z,
            posList8[5].x, posList8[5].y, posList8[5].z, posList8[6].x, posList8[6].y, posList8[6].z,
            posList8[6].x, posList8[6].y, posList8[6].z, posList8[7].x, posList8[7].y, posList8[7].z,
            posList8[7].x, posList8[7].y, posList8[7].z, posList8[4].x, posList8[4].y, posList8[4].z
        ];
		return posarr;
	}
    initializeByPosList8(posList8: Vector3D[]): void {
		this.m_posarr = this.createVSDataByPosList8(posList8);
        this.createMaterial();
        this.activeDisplay();
        if (this.m_sm == null) this.m_sm = this.getMesh() as DashedLineMesh;
    }
    getVertexAt(vtxIndex: number, outPos: Vector3D): void {
        if (this.m_sm != null) {
            let k: number = 0;
            switch (vtxIndex) {
                case 0:
                    outPos.setXYZ(this.m_posarr[k], this.m_posarr[++k], this.m_posarr[++k]);
                    break;
                case 1:
                    k = 3;
                    outPos.setXYZ(this.m_posarr[k], this.m_posarr[++k], this.m_posarr[++k]);
                    break;
                case 2:
                    k = 15;// 3 * 5
                    outPos.setXYZ(this.m_posarr[k], this.m_posarr[++k], this.m_posarr[++k]);
                    break;
                case 3:
                    k = 9;// 3 * 3
                    outPos.setXYZ(this.m_posarr[k], this.m_posarr[++k], this.m_posarr[++k]);
                    break;
                case 4:
                    k = 27;// 3 * 9
                    outPos.setXYZ(this.m_posarr[k], this.m_posarr[++k], this.m_posarr[++k]);
                    break;
                case 5:
                    k = 33;// 3 * 11
                    outPos.setXYZ(this.m_posarr[k], this.m_posarr[++k], this.m_posarr[++k]);
                    break;
                case 6:
                    k = 45;// 3 * 15
                    outPos.setXYZ(this.m_posarr[k], this.m_posarr[++k], this.m_posarr[++k]);
                    break;
                case 7:
                    k = 39;// 3 * 13
                    outPos.setXYZ(this.m_posarr[k], this.m_posarr[++k], this.m_posarr[++k]);
                    break;
                default:
                    break;
            }
        }
    }
    setVertexAt(vtxIndex: number, pos: Vector3D): void {
        if (this.m_sm != null) {
            let k: number = 0;
            switch (vtxIndex) {
                case 0:
                    this.m_posarr[k] = pos.x; this.m_posarr[++k] = pos.y; this.m_posarr[++k] = pos.z;
                    this.m_sm.setVSXYZAt(0, pos.x, pos.y, pos.z);
                    this.m_sm.setVSXYZAt(2, pos.x, pos.y, pos.z);
                    this.m_sm.setVSXYZAt(8, pos.x, pos.y, pos.z);
                    break;
                case 1:
                    k = 3;
                    this.m_posarr[k] = pos.x; this.m_posarr[++k] = pos.y; this.m_posarr[++k] = pos.z;
                    this.m_sm.setVSXYZAt(1, pos.x, pos.y, pos.z);
                    this.m_sm.setVSXYZAt(4, pos.x, pos.y, pos.z);
                    this.m_sm.setVSXYZAt(10, pos.x, pos.y, pos.z);
                    break;
                case 2:
                    k = 15;
                    this.m_posarr[k] = pos.x; this.m_posarr[++k] = pos.y; this.m_posarr[++k] = pos.z;
                    this.m_sm.setVSXYZAt(5, pos.x, pos.y, pos.z);
                    this.m_sm.setVSXYZAt(7, pos.x, pos.y, pos.z);
                    this.m_sm.setVSXYZAt(14, pos.x, pos.y, pos.z);
                    break;
                case 3:
                    k = 9;
                    this.m_posarr[k] = pos.x; this.m_posarr[++k] = pos.y; this.m_posarr[++k] = pos.z;
                    this.m_sm.setVSXYZAt(3, pos.x, pos.y, pos.z);
                    this.m_sm.setVSXYZAt(6, pos.x, pos.y, pos.z);
                    this.m_sm.setVSXYZAt(12, pos.x, pos.y, pos.z);
                    break;
                case 4:
                    k = 27;
                    this.m_posarr[k] = pos.x; this.m_posarr[++k] = pos.y; this.m_posarr[++k] = pos.z;
                    this.m_sm.setVSXYZAt(9, pos.x, pos.y, pos.z);
                    this.m_sm.setVSXYZAt(16, pos.x, pos.y, pos.z);
                    this.m_sm.setVSXYZAt(18, pos.x, pos.y, pos.z);
                    break;
                case 5:
                    k = 33;
                    this.m_posarr[k] = pos.x; this.m_posarr[++k] = pos.y; this.m_posarr[++k] = pos.z;
                    this.m_sm.setVSXYZAt(11, pos.x, pos.y, pos.z);
                    this.m_sm.setVSXYZAt(17, pos.x, pos.y, pos.z);
                    this.m_sm.setVSXYZAt(20, pos.x, pos.y, pos.z);
                    break;
                case 6:
                    k = 45;
                    this.m_posarr[k] = pos.x; this.m_posarr[++k] = pos.y; this.m_posarr[++k] = pos.z;
                    this.m_sm.setVSXYZAt(15, pos.x, pos.y, pos.z);
                    this.m_sm.setVSXYZAt(21, pos.x, pos.y, pos.z);
                    this.m_sm.setVSXYZAt(23, pos.x, pos.y, pos.z);
                    break;
                case 7:
                    k = 39;
                    this.m_posarr[k] = pos.x; this.m_posarr[++k] = pos.y; this.m_posarr[++k] = pos.z;
                    this.m_sm.setVSXYZAt(13, pos.x, pos.y, pos.z);
                    this.m_sm.setVSXYZAt(19, pos.x, pos.y, pos.z);
                    this.m_sm.setVSXYZAt(22, pos.x, pos.y, pos.z);
                    break;
                default:
                    break;
            }
        }
    }
    updateFrame(minV: Vector3D, maxV: Vector3D): void {
        if (this.m_sm) {
            this.m_minV.copyFrom(minV);
            this.m_maxV.copyFrom(maxV);
            let m = this.m_sm;
            // bottom frame
            m.setVSXYZAt(0, minV.x, minV.y, minV.z); m.setVSXYZAt(1, minV.x, minV.y, maxV.z);
            m.setVSXYZAt(2, minV.x, minV.y, minV.z); m.setVSXYZAt(3, maxV.x, minV.y, minV.z);
            m.setVSXYZAt(4, minV.x, minV.y, maxV.z); m.setVSXYZAt(5, maxV.x, minV.y, maxV.z);
            m.setVSXYZAt(6, maxV.x, minV.y, minV.z); m.setVSXYZAt(7, maxV.x, minV.y, maxV.z);
            // wall frame
            m.setVSXYZAt(8, minV.x, minV.y, minV.z); m.setVSXYZAt(9, minV.x, maxV.y, minV.z);
            m.setVSXYZAt(10, minV.x, minV.y, maxV.z); m.setVSXYZAt(11, minV.x, maxV.y, maxV.z);
            m.setVSXYZAt(12, maxV.x, minV.y, minV.z); m.setVSXYZAt(13, maxV.x, maxV.y, minV.z);
            m.setVSXYZAt(14, maxV.x, minV.y, maxV.z); m.setVSXYZAt(15, maxV.x, maxV.y, maxV.z);
            // top frame
            m.setVSXYZAt(16, minV.x, maxV.y, minV.z); m.setVSXYZAt(17, minV.x, maxV.y, maxV.z);
            m.setVSXYZAt(18, minV.x, maxV.y, minV.z); m.setVSXYZAt(19, maxV.x, maxV.y, minV.z);
            m.setVSXYZAt(20, minV.x, maxV.y, maxV.z); m.setVSXYZAt(21, maxV.x, maxV.y, maxV.z);
            m.setVSXYZAt(22, maxV.x, maxV.y, minV.z); m.setVSXYZAt(23, maxV.x, maxV.y, maxV.z);
        }
    }
    private m_abVersion: number = -1;
    updateFrameByAABB(ab: IAABB): void {
        if (this.m_abVersion != ab.version) {
            this.m_abVersion = ab.version;
            this.updateFrame(ab.min, ab.max);
        }
    }
	updateFrameByOBB(obb: IOBB, scale: number = 1.0): void {
		if (this.m_abVersion != obb.version) {
			let ls = this.createPosList8ByOBB(obb, scale);
			this.m_posarr = this.createVSDataByPosList8(ls);
			this.m_sm.setVSData( this.m_posarr );
            this.m_sm.updateData();
        }
	}
}
