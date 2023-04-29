/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2023 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import VtxBufID from "../../vox/mesh/VtxBufID";
import IVtxBuf from "../../vox/mesh/IVtxBuf";

export default class VtxCombinedBuf implements IVtxBuf {
    private m_uid: number = -1;
    private m_total: number = 0;
    private m_ver = 0;
    layoutBit: number = 0x0;
    constructor(bufDataUsage: number) {
        this.m_uid = VtxBufID.CreateNewID();
    }

    getUid(): number {
        return this.m_uid;
    }
    public getType(): number {
        return 0;
    }
    private m_offsetList: number[] = null;
    private m_f32: Float32Array = null;
    private m_f32Stride: number = 0;

    getBuffersTotal(): number {
        return 1;
    }
    getAttribsTotal(): number {
        return this.m_offsetList.length;
    }
    
	getF32DataVerAt(index: number): number {
        // console.log("VtxCombinedBuf::getF32DataVerAt(), index: ",index, ", ver: ", this.m_ver);
        return this.m_ver;
    }
	setF32DataVerAt(index: number, ver: number): void {
    }
    getF32DataAt(index: number): Float32Array {
        return this.m_f32;
    }
    setF32DataAt(index: number, float32Arr: Float32Array, stepFloatsTotal: number, setpOffsets: number[]): void {
        if (setpOffsets != null) this.m_offsetList = setpOffsets;
        this.m_f32Stride = stepFloatsTotal;
        this.m_ver++;
        //console.log("VtxCombinedBuf::setF32DataAt(),"+this+" m_f32.length: "+float32Arr.length+", this.m_f32PreSize: "+this.m_f32PreSize);
        this.m_f32 = float32Arr;
    }
    setData4fAt(vertexI: number, attribI: number, px: number, py: number, pz: number, pw: number): void {
        vertexI = (this.m_f32Stride * vertexI) + this.m_offsetList[attribI];
        this.m_f32[vertexI++] = px;
        this.m_f32[vertexI++] = py;
        this.m_f32[vertexI++] = pz;
        this.m_f32[vertexI++] = pw;
    }
    setData3fAt(vertexI: number, attribI: number, px: number, py: number, pz: number): void {
        vertexI = (this.m_f32Stride * vertexI) + this.m_offsetList[attribI];
        //console.log("VtxCombinedBuf::setData3fAt(), vertexI: "+vertexI+",this.m_f32Stride: "+this.m_f32Stride);
        this.m_f32[vertexI++] = px;
        this.m_f32[vertexI++] = py;
        this.m_f32[vertexI++] = pz;
    }
    setData2fAt(vertexI: number, attribI: number, px: number, py: number): void {
        vertexI = (this.m_f32Stride * vertexI) + this.m_offsetList[attribI];
        //console.log("VtxCombinedBuf::setData2fAt(), vertexI: "+vertexI+",this.m_f32Stride: "+this.m_f32Stride);
        this.m_f32[vertexI++] = px;
        this.m_f32[vertexI++] = py;
    }
    public destroy(): void {
        console.log("VtxCombinedBuf::__$destroy()... ", this);
        this.m_offsetList = null;
        this.m_f32 = null;
    }
}