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
import H5FontSystem from "../../vox/text/H5FontSys";
export default class TextRectMesh extends MeshBase {
    constructor(bufDataUsage: number = VtxBufConst.VTX_DYNAMIC_DRAW) {
        super(bufDataUsage);
    }
    private m_vs: Float32Array = null;
    private m_uvs: Float32Array = null;

    private m_width: number = 0;
    private m_height: number = 0;
    private m_charsTotal: number = 0;
    private m_charsStr: string = "";

    flipVerticalUV: boolean = false;
    vtxUVEnabled: boolean = true;
    vertColorEnabled: boolean = false;
    alignFactorX: number = 0.5;
    alignFactorY: number = 0.5;

    fontSystem: H5FontSystem = null;
    getWidth(): number {
        return this.m_width;
    }
    getHeight(): number {
        return this.m_height;//m_pvs[7];
    }
    private static s_initIvs: Uint8Array = new Uint8Array([0, 1, 2, 0, 2, 3]);
    private static s_currIvs: Uint8Array = new Uint8Array([0, 1, 2, 0, 2, 3]);
    private static s_sizeArr: number[] = [0, 0];
    private createStrData(charsStr: string): void {
        this.m_charsStr = charsStr;
        let charsTot: number = charsStr.length;
        this.m_charsTotal = charsTot;
        let expand: boolean = false;
        let fontSystem: H5FontSystem = this.fontSystem;
        if (fontSystem == null) {
            fontSystem = H5FontSystem.GetInstance();
        }
        if (charsTot > 0) {
            fontSystem.createCharsTexFromStr(charsStr);
            this.m_width = -1;
            this.m_height = 0;
            let sizeArr: number[] = TextRectMesh.s_sizeArr;
            let i: number = 0;
            let maxX: number = 0;
            let maxY: number = 0;
            let minX: number = 0;
            let minY: number = 0;
            expand = this.m_vs != null && (charsTot * 8) > this.m_vs.length;
            let charTable = fontSystem.getCharTable();
            if (expand) {
                let ivs: Uint8Array = TextRectMesh.s_currIvs;
                ivs.set(TextRectMesh.s_initIvs, 0);
                this.m_ivs = new Uint16Array(charsTot * 6);
                this.m_uvs = new Float32Array(charsTot * 8);
                this.m_vs = new Float32Array(charsTot * 8);
                for (; i < charsTot; ++i) {
                    this.m_ivs.set(ivs, i * 6);
                    ivs[0] += 4;
                    ivs[1] += 4;
                    ivs[2] += 4;
                    ivs[3] += 4;
                    ivs[4] += 4;
                    ivs[5] += 4;
                    charTable.getUV8AndSizeFromChar(charsStr.charAt(i), this.m_uvs, sizeArr, i * 8);
                    if (this.m_height < sizeArr[1]) {
                        this.m_height = sizeArr[1];
                    }
                    this.m_vs[i * 8] = sizeArr[0];
                    this.m_width += sizeArr[0];
                }
            }
            else {
                if (this.m_vs == null) {
                    this.m_uvs = new Float32Array(charsTot * 8);
                    this.m_vs = new Float32Array(charsTot * 8);
                }

                for (; i < charsTot; ++i) {
                    charTable.getUV8AndSizeFromChar(charsStr.charAt(i), this.m_uvs, sizeArr, i * 8);
                    if (this.m_height < sizeArr[1]) {
                        this.m_height = sizeArr[1];
                    }
                    this.m_vs[i * 8] = sizeArr[0];
                    this.m_width += sizeArr[0];
                }
            }
            let dis: number = 1.0;
            this.m_width += charsTot * dis;
            minX = -this.alignFactorX * this.m_width;
            minY = -this.alignFactorY * this.m_height;
            maxY = minY + this.m_height;

            if (this.bounds == null) this.bounds = new AABB();
            this.bounds.min.setXYZ(minX, minY, 0.0);
            this.bounds.max.setXYZ(minX + this.m_width, maxY, 0.0);
            //  this.bounds.addXYZFloat32Arr(this.m_vs);
            //  this.bounds.updateFast();
            let j: number = 0;
            for (i = 0; i < charsTot; ++i) {
                maxX = minX + this.m_vs[j];
                this.m_vs[j] = minX; this.m_vs[j + 1] = minY;
                this.m_vs[j + 2] = maxX; this.m_vs[j + 3] = minY;
                this.m_vs[j + 4] = maxX; this.m_vs[j + 5] = maxY;
                this.m_vs[j + 6] = minX; this.m_vs[j + 7] = maxY;
                minX = maxX + dis;
                j += 8;
            }

            ROVertexBuffer.Reset();
            ROVertexBuffer.AddFloat32Data(this.m_vs, 2);
            ROVertexBuffer.AddFloat32Data(this.m_uvs, 2);
        }
        if (expand) {
            this.m_vbuf.setUintIVSData(this.m_ivs);
        }
        this.vtCount = charsTot * 6;
        this.vtxTotal = charsTot * 4;
        this.trisNumber = charsTot * 2;
    }
    initialize(charsStr: string): void {
        //console.log("RectPlaneMesh::initialize()...");

        let charsTot: number = charsStr.length;
        let ivs: Uint8Array = TextRectMesh.s_currIvs;
        ivs.set(TextRectMesh.s_initIvs, 0);
        if (this.m_ivs == null) {
            this.m_ivs = new Uint16Array(charsTot * 6);
        }
        for (let i: number = 0; i < charsTot; ++i) {
            this.m_ivs.set(ivs, i * 6);
            ivs[0] += 4;
            ivs[1] += 4;
            ivs[2] += 4;
            ivs[3] += 4;
            ivs[4] += 4;
            ivs[5] += 4;
        }
        this.createStrData(charsStr);

        ROVertexBuffer.vbWholeDataEnabled = this.vbWholeDataEnabled;
        this.m_vbuf = ROVertexBuffer.CreateBySaveData(this.getBufDataUsage());
        this.m_vbuf.setUintIVSData(this.m_ivs);
        //this.drawMode = RenderDrawMode.ELEMENTS_TRIANGLE_STRIP;
        this.buildEnd();
    }

    updateCharStr(charsStr: string): void {
        if (this.m_vbuf != null && this.m_charsStr != charsStr) {
            this.createStrData(charsStr);
            this.buildEnd();
            ROVertexBuffer.UpdateBufData(this.m_vbuf);
        }
    }
    __$destroy(): void {
        if (this.isResFree()) {
            this.bounds = null;

            this.m_vs = null;
            this.m_uvs = null;
            super.__$destroy();
        }
        this.fontSystem = null;
    }
}