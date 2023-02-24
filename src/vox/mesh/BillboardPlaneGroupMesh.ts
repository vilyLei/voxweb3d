/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import ROVertexBuffer from "../../vox/mesh/ROVertexBuffer";
import VtxBufConst from "../../vox/mesh/VtxBufConst";
import AABB from "../../vox/geom/AABB";
import MeshBase from "../../vox/mesh/MeshBase";

/**
 * static billboard plane group
 */
export default class BillboardPlaneGroupMesh extends MeshBase {
    constructor(bufDataUsage: number = VtxBufConst.VTX_STATIC_DRAW) {
        super(bufDataUsage);
    }
    private m_vs: Float32Array = null;
    private m_vs2: Float32Array = null;
    private m_uvs: Float32Array = null;
    private m_total: number = 0;
    flipVerticalUV: boolean = false;

    setUVSFloatArr(uvsFloatArr8: Float32Array): void {
        if (this.m_uvs == null) {
            this.m_uvs = new Float32Array(8);
        }
        this.m_uvs.set(uvsFloatArr8, 0);
    }
    setUVSArr(uvsArr8: number[]): void {
        if (this.m_uvs == null) {
            this.m_uvs = new Float32Array(8);
        }
        this.m_uvs.set(uvsArr8, 0);
    }
    createData(total: number): void {
        if (this.m_vs == null && total > 0) {
            this.m_total = total;
            let i: number = 0;
            let base: number = 0;
            let pdivs: number[] = [0, 1, 2, 0, 2, 3];
            let pivs: Uint16Array = new Uint16Array(total * 6);
            let len: number = total * 6;
            for (i = 0; i < len;) {
                pivs[i++] = pdivs[0] + base;
                pivs[i++] = pdivs[1] + base;
                pivs[i++] = pdivs[2] + base;
                pivs[i++] = pdivs[3] + base;
                pivs[i++] = pdivs[4] + base;
                pivs[i++] = pdivs[5] + base;
                base += 4;
            }
            this.m_ivs = pivs;
            this.m_vs = new Float32Array(total * 8);
            this.m_vs2 = new Float32Array(total * 12);
            this.m_uvs = new Float32Array(total * 8);
            let pduvs: number[] = [];
            if (this.flipVerticalUV) {
                pduvs = [
                    0.0, 0.0,
                    1.0, 0.0,
                    1.0, 1.0,
                    0.0, 1.0
                ];
            }
            else {
                pduvs = [
                    0.0, 1.0,
                    1.0, 1.0,
                    1.0, 0.0,
                    0.0, 0.0
                ];
            }
            for (i = 0; i < total; ++i) {
                this.m_uvs.set(pduvs, i * 8);
            }
            this.bounds = new AABB();
        }
    }
    setSizeAt(i: number, width: number, height: number): void {
        if (i >= 0 && i < this.m_total) {
            let maxX: number = 0.5 * width;
            let maxY: number = 0.5 * height;
            let minX: number = -maxX;
            let minY: number = -maxY;
            i *= 8;
            this.m_vs[i++] = minX; this.m_vs[i++] = minY;
            this.m_vs[i++] = maxX; this.m_vs[i++] = minY;
            this.m_vs[i++] = maxX; this.m_vs[i++] = maxY;
            this.m_vs[i++] = minX; this.m_vs[i++] = maxY;

            this.bounds.addXYZ(minX, minY, minX);
            this.bounds.addXYZ(maxX, maxY, maxX);
        }
    }
    setPositionAt(i: number, x: number, y: number, z: number): void {
        if (i >= 0 && i < this.m_total) {
            i *= 12;
            for (let j: number = 0; j < 4; ++j) {
                this.m_vs2[i++] = x; this.m_vs2[i++] = y; this.m_vs2[i++] = z;
            }
        }
    }

    setUVRectAt(i: number, u: number, v: number, du: number, dv: number): void {
        if (i >= 0 && i < this.m_total) {
            i *= 8;
            if (this.flipVerticalUV) {
                this.m_uvs[i++] = u; this.m_uvs[i++] = v;
                this.m_uvs[i++] = u + du; this.m_uvs[i++] = v;
                this.m_uvs[i++] = u + du; this.m_uvs[i++] = v + dv;
                this.m_uvs[i++] = u; this.m_uvs[i] = v + dv;
                //  pduvs = [
                //      0.0,0.0,
                //      1.0,0.0,
                //      1.0,1.0,
                //      0.0,1.0
                //  ];                        
            }
            else {
                this.m_uvs[i++] = u; this.m_uvs[i++] = v + dv;
                this.m_uvs[i++] = u + du; this.m_uvs[i++] = v + dv;
                this.m_uvs[i++] = u + du; this.m_uvs[i++] = v;
                this.m_uvs[i++] = u; this.m_uvs[i] = v;
                //  pduvs = [
                //      0.0,1.0,
                //      1.0,1.0,
                //      1.0,0.0,
                //      0.0,0.0
                //  ];
            }
            //      if(this.flipVerticalUV)
            //      {
            //      }
            //      else
            //      {
            //      }
            //  i *= 12;
            //  for(let j:number = 0; j < 4; ++j)
            //  {
            //      this.m_vs2[i++] = x;this.m_vs2[i++] = y;this.m_vs2[i++] = z;
            //  }
        }
    }
    initialize(): void {
        ROVertexBuffer.Reset();
        ROVertexBuffer.AddFloat32Data(this.m_vs, 2);
        ROVertexBuffer.AddFloat32Data(this.m_uvs, 2);
        ROVertexBuffer.AddFloat32Data(this.m_vs2, 3);
        ROVertexBuffer.vbWholeDataEnabled = this.vbWholeDataEnabled;
        this.m_vbuf = ROVertexBuffer.CreateBySaveData(this.getBufDataUsage());
        this.m_vbuf.setUintIVSDataAt(this.m_ivs);
        this.vtCount = this.m_ivs.length;
        this.vtxTotal = 4 * this.m_total;
        this.trisNumber = 2 * this.m_total;
        // console.log("vs: "+this.m_vs);
        // console.log("vs: "+this.m_vs2);
        // console.log("uvs: "+this.m_uvs);
        // console.log("ivs: "+this.m_ivs);
        //  console.log("this.m_ivs.length: "+this.m_ivs.length);
        //  console.log("vtCount: "+this.vtCount);
        this.buildEnd();
    }

    setUV(pu: number, pv: number, du: number, dv: number): void {
        if (this.m_vbuf != null) {
            this.m_vbuf.setData2fAt(0, 1, pu, pv + dv);
            this.m_vbuf.setData2fAt(1, 1, pu + du, pv + dv);
            this.m_vbuf.setData2fAt(2, 1, pu + du, pv);
            this.m_vbuf.setData2fAt(3, 1, pu, pv);
        }
    }
}