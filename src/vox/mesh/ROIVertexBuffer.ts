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
// import IROIvsData from "../../vox/render/vtx/IROIvsData";
import ROIvsData from "./ROIvsData";

export default class ROIVertexBuffer implements IROIVtxBuf {

    private static s_uid = 0;
    protected m_uid = 0;
    protected m_layoutBit = 0;
    private m_irdTotal = 0;
    protected m_irds: ROIvsData[] = new Array(2);
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
        this.m_irds.fill(null);
    }
    getIvsDataTotal(): number {
        return 1;
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
    // getIBufStep(): number {
    //     return this.m_ibufStep;
    // }
    getBufDataUsage(): number {
        return this.m_bufDataUsage;
    }
    getIvsDataAt(index: number = 0): ROIvsData {
        if(index >= 0 && index < this.m_irdTotal) {
            return this.m_irds[index];
        }
        return null;
    }
    setIVSDataAt(data: ROIvsData, index: number = 0): void {
        if(this.m_irds[index]) {
            this.m_irds[index].destroy();
        }
        this.m_irds[index] = data;
        this.m_irdTotal = index + 1;
        this.indicesVer++;
    }
    /**
     * this function is only an empty function.
     */
    destroy(): void {
        this.m_layoutBit = 0;
    }
}