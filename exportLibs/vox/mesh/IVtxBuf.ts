/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/
export default interface IVtxBuf {
	layoutBit: number;
	getUid(): number;
	getType(): number;
	getBuffersTotal(): number;
	getAttribsTotal(): number;
	getF32DataVerAt(index: number): number;
	setF32DataVerAt(index: number, ver: number): void;
	getF32DataAt(index: number): Float32Array;
	setF32DataAt(index: number, float32Arr: Float32Array, stepFloatsTotal: number, setpOffsets: number[]): void;
	setData4fAt(vertexI: number, attribI: number, px: number, py: number, pz: number, pw: number): void;
	setData3fAt(vertexI: number, attribI: number, px: number, py: number, pz: number): void;
	setData2fAt(vertexI: number, attribI: number, px: number, py: number): void;
	destroy(): void;
}
