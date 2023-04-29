/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2023 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import IROIvsData from "../../vox/render/vtx/IROIvsData";
type UINTType = Uint16Array | Uint32Array;
/**
 * 分块上传用于节省内存，而直接使用显存: 从源数据直接上传到显存
 */
export default interface IVtxBufData {
	addAttributeDataAt(attributeIndex: number, f32Data: Float32Array, step: number): void;
	addAttributeDataStepAt(attributeIndex: number): number;
	getVerticesTotal(): number;
	getAttributesTotal(): number;
	getAttributeDataAt(attributeIndex: number, dataIndex: number): Float32Array;
	getAttributeDataTotalAt(attributeIndex: number): number;
	getAttributeDataTotalBytesAt(attributeIndex: number): number;
	getAttributeStepAt(attributeIndex: number): number;
	addIndexData(indexbufferArr: UINTType): void;
	getIndexDataTotal(): number;
	getIndexDataLengthTotal(): number;
	getTrianglesTotal(): number;
	getIndexDataAt(i: number): IROIvsData;
	getIndexDataTotalBytes(): number;
	destroy(): void;
}
