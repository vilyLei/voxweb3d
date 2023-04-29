/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2023 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import VtxBufID from "../../vox/mesh/VtxBufID";
import IVtxBuf from "../../vox/mesh/IVtxBuf";

export default class VtxSeparatedBuf implements IVtxBuf {
    private m_uid: number = -1;
    private m_ofList: number[] = null;
    private m_list: Float32Array[] = null;
    private m_dirtyList: boolean[] = null;
    private m_verList: number[] = null;
    private m_f32Bufs: any[] = null;
    private m_bufersTotal: number = 0;
    layoutBit: number = 0x0;
    constructor() {
        this.m_uid = VtxBufID.CreateNewID();
    }

    getUid(): number {
        return this.m_uid;
    }
    public getType(): number {
        return 1;
    }


    getBuffersTotal(): number {
        return this.m_bufersTotal;
    }

    getAttribsTotal(): number {
        return this.m_bufersTotal;
    }
    getF32DataAt(index: number): Float32Array {
        // console.log("VtxSeparatedBuf::getF32DataAt(), VVV index: ",index, ", this.m_list[index]: ", this.m_list[index]);
        return this.m_list[index];
    }
    setF32DataAt(index: number, float32Arr: Float32Array, stepFloatsTotal: number, setpOffsets: number[]): void {

        if(index < 1) this.m_bufersTotal = 1;
        else this.m_bufersTotal = index + 1;

        if (this.m_list == null) {
            this.m_list = new Array(8);
            this.m_list.fill(null);
            this.m_dirtyList = new Array(8);
            this.m_dirtyList.fill(false);
            this.m_verList = new Array(8);
            this.m_verList.fill(0);
        }
        this.m_list[index] = float32Arr;
        if (this.m_f32Bufs != null && float32Arr != null) {
            this.m_dirtyList[index] = true;
        }
        if (setpOffsets != null) this.m_ofList = setpOffsets;

        // console.log("VtxSeparatedBuf::setF32DataAt(), this.m_bufersTotal: ",this.m_bufersTotal, setpOffsets);
        // if (float32Arr != null) {
        //     this.m_sizeList[index] = float32Arr.length;
        // }
    }

	getF32DataVerAt(index: number): number {
        // console.log("VtxSeparatedBuf::getF32DataVerAt(), VVV index: ",index, ", ver: ", this.m_verList[index]);
        return this.m_verList[index];
    }
	setF32DataVerAt(index: number, ver: number): void {
        // console.log("VtxSeparatedBuf::setF32DataVerAt(), VVV index: ",index, ", ver: ", ver);
        this.m_verList[index] = ver;
    }
    setData4fAt(vertexI: number, attribI: number, px: number, py: number, pz: number, pw: number): void {
        vertexI *= this.m_ofList[attribI];
		const vs = this.m_list[attribI];
        vs[vertexI++] = px;
        vs[vertexI++] = py;
        vs[vertexI++] = pz;
        vs[vertexI++] = pw;
    }
    setData3fAt(vertexI: number, attribI: number, px: number, py: number, pz: number): void {
        vertexI *= this.m_ofList[attribI];
		const vs = this.m_list[attribI];
        vs[vertexI++] = px;
        vs[vertexI++] = py;
        vs[vertexI++] = pz;
    }
    setData2fAt(vertexI: number, attribI: number, px: number, py: number): void {
        vertexI *= this.m_ofList[attribI];
		const vs = this.m_list[attribI];
        vs[vertexI++] = px;
        vs[vertexI++] = py;
    }
    public destroy(): void {
        this.m_list = null;
        this.m_dirtyList = null;
        // this.m_sizeList = null;
        // //this.m_f32PreSizeList = null;
        this.m_list = null;
    }
}
