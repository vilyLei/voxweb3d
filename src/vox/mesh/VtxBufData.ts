/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2023 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/
/**
 * 分块上传用于节省内存，而直接使用显存: 从源数据直接上传到显存
 */
import IVtxBufData from "../../vox/mesh/IVtxBufData";
import ROIvsData from "./ROIvsData";
type UINTType = Uint16Array | Uint32Array;

export default class VtxBufData implements IVtxBufData {
	// private m_indexList: UINTType[] = [];
	private m_indexList: ROIvsData[] = [];
	private m_attriList: Float32Array[][] = null;
	private m_attriBytesList: number[] = null;
	private m_attriStepsList: number[] = null;
	private m_attriTotalList: number[] = null;
	private m_attriLenTotalList: number[] = null;

	private m_indexBytesTotal: number = 0;
	private m_indexLengthsTotal: number = 0;
	private m_attributesTotal: number = 0;
	constructor(attributesTotal: number) {
		this.m_attributesTotal = attributesTotal;
		this.m_attriList = new Array(attributesTotal);
		this.m_attriBytesList = new Array(attributesTotal);
		this.m_attriStepsList = new Array(attributesTotal);
		this.m_attriTotalList = new Array(attributesTotal);
		this.m_attriLenTotalList = new Array(attributesTotal);
		this.m_attriBytesList.fill(0);
		this.m_attriStepsList.fill(0);
		this.m_attriTotalList.fill(0);
		this.m_attriLenTotalList.fill(0);
		for (let i: number = 0; i < this.m_attributesTotal; ++i) {
			this.m_attriList[i] = [];
		}
	}
	addAttributeDataAt(attributeIndex: number, f32Data: Float32Array, step: number): void {
		this.m_attriList[attributeIndex].push(f32Data);
		this.m_attriBytesList[attributeIndex] += f32Data.byteLength;
		this.m_attriStepsList[attributeIndex] = step;
		this.m_attriTotalList[attributeIndex] += 1;
		this.m_attriLenTotalList[attributeIndex] += f32Data.length;
	}
	addAttributeDataStepAt(attributeIndex: number): number {
		return this.m_attriStepsList[attributeIndex];
	}
	getVerticesTotal(): number {
		return this.m_attriLenTotalList[0] / this.m_attriStepsList[0];
	}
	getAttributesTotal(): number {
		return this.m_attriList.length;
	}
	getAttributeDataAt(attributeIndex: number, dataIndex: number): Float32Array {
		return this.m_attriList[attributeIndex][dataIndex];
	}
	getAttributeDataTotalAt(attributeIndex: number): number {
		return this.m_attriTotalList[attributeIndex];
	}
	getAttributeDataTotalBytesAt(attributeIndex: number): number {
		return this.m_attriBytesList[attributeIndex];
	}
	getAttributeStepAt(attributeIndex: number): number {
		return this.m_attriStepsList[attributeIndex];
	}
	addIndexData(ivs: UINTType): void {
		this.m_indexBytesTotal += ivs.byteLength;
		this.m_indexLengthsTotal += ivs.length;
		// this.m_indexList.push(indexbufferArr);
		let data = new ROIvsData();
		data.setData(ivs);
		this.m_indexList.push(data);
	}
	getIndexDataTotal(): number {
		return this.m_indexList.length;
	}
	getIndexDataLengthTotal(): number {
		return this.m_indexLengthsTotal;
	}
	getTrianglesTotal(): number {
		return this.m_indexLengthsTotal / 3;
	}
	getIndexDataAt(i: number): ROIvsData {
		return this.m_indexList[i];
	}
	getIndexDataTotalBytes(): number {
		return this.m_indexBytesTotal;
	}
	destroy(): void {
		if (this.m_indexList != null) {
			let j = 0;
			let len = 0;
			let list: Float32Array[] = null;
			for (let i = 0; i < this.m_attributesTotal; ++i) {
				list = this.m_attriList[i];
				len = list.length;
				for (j = 0; j < len; ++j) {
					list[j] = null;
				}
				this.m_attriList[i] = null;
			}

			let uList = this.m_indexList;
			len = uList.length;
			for (j = 0; j < len; ++j) {
				uList[j] = null;
			}
			this.m_indexList = null;
		}
	}
}
