/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import VtxBufConst from "../../vox/mesh/VtxBufConst";
import VtxBufData from "../../vox/mesh/VtxBufData";
import IROIVtxBuf from "../../vox/render/IROIVtxBuf";
import { RenderDrawMode } from "../../vox/render/RenderConst";

export default class ROIVertexBuffer implements IROIVtxBuf {
    private static s_uid = 0;
    protected m_uid = 0;
    protected m_layoutBit = 0;

    protected m_ivs: Uint16Array | Uint32Array = null;
    protected m_bufDataUsage = 0;
    protected m_ibufStep = 2;// 2 or 4

    layoutBit = 0x0;
    vertexVer = 0;
    indicesVer = 0;
    version = 0;
    drawMode = RenderDrawMode.ELEMENTS_TRIANGLES;
    bufData: VtxBufData = null;
    constructor(bufDataUsage: number = VtxBufConst.VTX_STATIC_DRAW) {
        this.m_uid = ROIVertexBuffer.s_uid++;
        this.m_bufDataUsage = bufDataUsage;
    }
    getUid(): number {
        return this.m_uid;
    }
    getType(): number {
        return 0;
    }
    setBufSortFormat(layoutBit: number): void {
        this.m_layoutBit = layoutBit;
    }
    getBufSortFormat(): number {
        return this.m_layoutBit;
    }
    getIBufStep(): number {
        return this.m_ibufStep;
    }
    getBufDataUsage(): number {
        return this.m_bufDataUsage;
    }
    getIvsData(): Uint16Array | Uint32Array {
        return this.m_ivs;
    }
    setUintIVSData(uint16Or32Arr: Uint16Array | Uint32Array, status: number = VtxBufConst.VTX_STATIC_DRAW): void {
        if ((uint16Or32Arr instanceof Uint16Array)) {
            this.m_ibufStep = 2;
            if(uint16Or32Arr.length > 65535) {
                throw Error("its type is not Uint32Array.");
            }
        }
        else if ((uint16Or32Arr instanceof Uint32Array)) {
            this.m_ibufStep = 4;
        }
        else {
            console.error("Error: uint16Or32Arr is not an Uint32Array or an Uint16Array bufferArray instance !!!!");
            return;
        }

        this.m_ivs = uint16Or32Arr;
        if (uint16Or32Arr != null) {
            this.indicesVer++;
        }
    }
    /**
     * this function is only an empty function.
     */
    destroy(): void {
        this.m_layoutBit = 0;
    }
}