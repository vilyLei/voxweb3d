/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import VtxBufConst from "../../vox/mesh/VtxBufConst";
import ROVtxBufUidStore from "../../vox/mesh/ROVtxBufUidStore";
import VtxBufData from "../../vox/mesh/VtxBufData";
import IVtxBuf from "../../vox/mesh/IVtxBuf";
import IROVtxBuf from "../../vox/render/IROVtxBuf";
import VtxCombinedBuf from "../../vox/mesh/VtxCombinedBuf";
import VtxSeparatedBuf from "../../vox/mesh/VtxSeparatedBuf";
import { RenderDrawMode } from "../../vox/render/RenderConst";
import ROIVertexBuffer from "./ROIVertexBuffer";

export default class ROVertexBuffer extends ROIVertexBuffer implements IVtxBuf, IROVtxBuf {
	private m_vtxBuf: IVtxBuf = null;
	private m_bufTypeList: number[] = null;
	private m_bufSizeList: number[] = null;

	private constructor(bufDataUsage: number = VtxBufConst.VTX_STATIC_DRAW) {
		super(bufDataUsage);
	}
	private setVtxBuf(vtxBuf: IVtxBuf): void {
		if (vtxBuf != this) {
			this.m_vtxBuf = vtxBuf;
			if (vtxBuf != null) {
				vtxBuf.layoutBit = this.layoutBit;
			}
		}
	}
	private setBufDataUsage(bufDataUsage: number): void {
		this.m_bufDataUsage = bufDataUsage;
	}
	getUid(): number {
		return this.m_uid;
	}
	getType(): number {
		return this.m_vtxBuf.getType();
	}

	setBufTypeList(list: number[]): void {
		this.m_bufTypeList = list;
	}
	setBufSizeList(list: number[]): void {
		this.m_bufSizeList = list;
	}
	getBufTypeList(): number[] {
		return this.m_bufTypeList;
	}
	getBufSizeList(): number[] {
		return this.m_bufSizeList;
	}

	getIvsUnitBytes(): number {
		return this.m_ivsUnitBytes;
	}
	getBufDataUsage(): number {
		return this.m_bufDataUsage;
	}
	getBuffersTotal(): number {
		return this.m_vtxBuf.getBuffersTotal();
	}

	getAttribsTotal(): number {
		return this.m_vtxBuf.getAttribsTotal();
	}
	getF32DataVerAt(index: number): number {
		return this.m_vtxBuf.getF32DataVerAt(index);
	}
	setF32DataVerAt(index: number, ver: number): void {
		this.m_vtxBuf.setF32DataVerAt(index, ver);
	}

	updateF32DataVerAt(index: number): void {
		let ver = this.m_vtxBuf.getF32DataVerAt(index) + 1;
		this.m_vtxBuf.setF32DataVerAt(index, ver);
		this.vertexVer++;
	}
	getF32DataAt(index: number): Float32Array {
		return this.m_vtxBuf.getF32DataAt(index);
	}
	setF32DataAt(index: number, float32Arr: Float32Array, stepFloatsTotal: number, setpOffsets: number[]): void {
		// console.log("setF32DataAt(), ",index, ", float32Arr: ", float32Arr);
		this.m_vtxBuf.setF32DataAt(index, float32Arr, stepFloatsTotal, setpOffsets);
		this.vertexVer++;
	}
	setData4fAt(vertexI: number, attribI: number, px: number, py: number, pz: number, pw: number): void {

		if (this.m_vtxBuf) {
			this.m_vtxBuf.setData4fAt(vertexI, attribI, px, py, pz, pw);
			this.vertexVer++;
		}
	}
	setData3fAt(vertexI: number, attribI: number, px: number, py: number, pz: number): void {
		if (this.m_vtxBuf) {
			this.m_vtxBuf.setData3fAt(vertexI, attribI, px, py, pz);
			this.vertexVer++;
		}
	}
	setData2fAt(vertexI: number, attribI: number, px: number, py: number): void {
		if (this.m_vtxBuf) {
			this.m_vtxBuf.setData2fAt(vertexI, attribI, px, py);
			this.vertexVer++;
		}
	}
	/**
	 * this function is only an empty function.
	 */
	destroy(): void {
		super.destroy();
	}

	private static s_combinedBufs: IVtxBuf[] = [];
	private static s_separatedBufs: IVtxBuf[] = [];
	private __$destroy(): void {
		console.log("ROVertexBuffer::__$destroy()... " + this);
		this.m_vtxBuf.destroy();
		if (this.m_vtxBuf.getType() < 1) {
			ROVertexBuffer.s_combinedBufs.push(this.m_vtxBuf);
		} else {
			ROVertexBuffer.s_separatedBufs.push(this.m_vtxBuf);
		}
		this.m_vtxBuf = null;
		// this.m_ivs = null;
		this.m_irds.fill(null);
		this.bufData = null;
		this.m_bufTypeList = null;
		this.m_bufSizeList = null;
	}
	private static s_FLAG_BUSY: number = 1;
	private static s_FLAG_FREE: number = 0;
	private static s_unitFlagList: number[] = [];
	private static s_unitListLen: number = 0;
	private static s_unitList: ROVertexBuffer[] = [];
	private static s_freeIdList: number[] = [];
	private static s_vtxStore: ROVtxBufUidStore = new ROVtxBufUidStore();
	private static GetFreeId(): number {
		if (ROVertexBuffer.s_freeIdList.length > 0) {
			return ROVertexBuffer.s_freeIdList.pop();
		}
		return -1;
	}
	private static GetVtxByUid(uid: number): ROVertexBuffer {
		return ROVertexBuffer.s_unitList[uid];
	}
	private static Create(bufDataUsage: number = VtxBufConst.VTX_STATIC_DRAW): ROVertexBuffer {
		const rvb = ROVertexBuffer;
		let unit: ROVertexBuffer = null;
		let index = rvb.GetFreeId();
		if (index >= 0) {
			unit = rvb.s_unitList[index];
			unit.setBufDataUsage(bufDataUsage);
			rvb.s_unitFlagList[index] = rvb.s_FLAG_BUSY;
		} else {
			unit = new ROVertexBuffer(bufDataUsage);
			rvb.s_unitList.push(unit);
			rvb.s_unitFlagList.push(rvb.s_FLAG_BUSY);
			rvb.s_unitListLen++;
		}
		unit.vertexVer = 0;
		unit.indicesVer = 0;
		unit.version++;
		//console.log("ROVertexBuffer::Create(), ROVertexBuffer.s_unitList.length: "+ROVertexBuffer.s_unitList.length+", new buf: "+unit);
		rvb.s_vtxStore.__$attachAt(unit.getUid());
		return unit;
	}
	private static __$Restore(pobj: ROVertexBuffer): void {
		const rvb = ROVertexBuffer;
		if (pobj != null && rvb.s_unitFlagList[pobj.getUid()] == rvb.s_FLAG_BUSY) {
			//console.log("ROVertexBuffer::__$Restore, pobj: "+pobj);
			const uid = pobj.getUid();
			rvb.s_freeIdList.push(uid);
			rvb.s_unitFlagList[uid] = rvb.s_FLAG_FREE;
			pobj.__$destroy();
		}
	}
	static __$$AttachAt(uid: number): void {
		ROVertexBuffer.s_vtxStore.__$attachAt(uid);
	}
	static __$$DetachAt(uid: number): void {
		ROVertexBuffer.s_vtxStore.__$detachAt(uid);
	}
	private static s_stride = 0;
	static BufDataList: Float32Array[] = null;
	static BufDataStepList: number[] = null;
	static BufStatusList: number[] = null;
	static BufVerList: number[] = null;
	static vtxDataFS32: number[] = null;
	static vbWholeDataEnabled = false;
	static dynBufSegEnabled = false;
	static useBufByIndexEnabled = false;
	static vtxFS32: Float32Array = null;

	static Reset(): void {
		const rvb = ROVertexBuffer;
		rvb.BufDataList = [];
		rvb.s_stride = 0;
		rvb.BufStatusList = [];
		rvb.BufDataStepList = [];
		rvb.BufVerList = [];
		rvb.vtxFS32 = null;
		rvb.vbWholeDataEnabled = false;
		rvb.dynBufSegEnabled = false;
		rvb.useBufByIndexEnabled = false;
	}
	static AddFloat32DataVer(ver: number): void {
		ROVertexBuffer.BufVerList.push(ver);
	}
	static AddFloat32Data(float32Arr: Float32Array, step: number, status: number = VtxBufConst.VTX_STATIC_DRAW): void {
		const rvb = ROVertexBuffer;
		rvb.BufDataList.push(float32Arr);
		rvb.BufDataStepList.push(step);
		rvb.BufStatusList.push(status);
		rvb.s_stride += step;
	}
	static CreateBySaveData(bufDataUsage: number = VtxBufConst.VTX_STATIC_DRAW, layoutBit: number = 0x0): ROVertexBuffer {
		const rvb = ROVertexBuffer;
		let i = 0;
		let k = 0;
		let stride = 0;
		let bufTot = rvb.BufDataStepList.length;
		let offsetList: number[] = [];

		for (; i < bufTot; i++) {
			offsetList.push(stride);
			stride += rvb.BufDataStepList[i];
		}
		let tot = rvb.BufDataList[0].length / rvb.BufDataStepList[0];
		let vtxfs32 = new Float32Array(stride * tot);
		let j = 0;
		let segLen = 0;
		let parrf32: Float32Array = null;
		let subArr: Float32Array = null;

		for (i = 0; i < tot; ++i) {
			k = i * stride;
			for (j = 0; j < bufTot; ++j) {
				segLen = rvb.BufDataStepList[j];
				parrf32 = rvb.BufDataList[j];
				subArr = parrf32.subarray(i * segLen, (i + 1) * segLen);
				vtxfs32.set(subArr, k);
				k += segLen;
			}
		}
		let vb = rvb.Create(bufDataUsage);
		vb.layoutBit = layoutBit;
		if (rvb.s_combinedBufs.length > 0) {
			let vtx = rvb.s_combinedBufs.pop() as VtxCombinedBuf;
			vb.setVtxBuf(vtx);
		} else {
			vb.setVtxBuf(new VtxCombinedBuf(vb.getBufDataUsage()));
		}
		vb.setF32DataAt(0, vtxfs32, stride, offsetList);
		return vb;
	}
	static CreateVtxCombinedBuf(
		vtxfs32: Float32Array,
		bufDataStepList: number[],
		bufDataUsage: number = VtxBufConst.VTX_STATIC_DRAW,
		layoutBit: number = 0x0
	): ROVertexBuffer {
		let i = 0;
		let stride = 0;
		let bufTot = bufDataStepList.length;
		let offsetList: number[] = [];

		for (; i < bufTot; i++) {
			offsetList.push(stride);
			stride += bufDataStepList[i];
		}
		const rvb = ROVertexBuffer;
		let vb = rvb.Create(bufDataUsage);
		vb.layoutBit = layoutBit;
		if (rvb.s_combinedBufs.length > 0) {
			let vtx = rvb.s_combinedBufs.pop() as VtxCombinedBuf;
			vb.setVtxBuf(vtx);
		} else {
			vb.setVtxBuf(new VtxCombinedBuf(vb.getBufDataUsage()));
		}
		vb.setF32DataAt(0, vtxfs32, stride, offsetList);
		const vls = rvb.BufVerList;
		if (vls.length > 0) {
			vb.setF32DataVerAt(0, vls[0]);
		}
		return vb;
	}
	private static UpdateCombinedBufData(vb: ROVertexBuffer): void {
		const rvb = ROVertexBuffer;

		let i = 0;
		let k = 0;
		let stride = 0;
		let bufTot = rvb.BufDataStepList.length;
		let tot = rvb.BufDataList[0].length / rvb.BufDataStepList[0];
		let vtxfs32 = vb.getF32DataAt(0);
		let newBoo = rvb.s_stride * tot != vtxfs32.length;
		let offsetList: number[] = null;
		if (newBoo) {
			offsetList = [];
			vtxfs32 = new Float32Array(rvb.s_stride * tot);
			for (; i < bufTot; i++) {
				offsetList.push(stride);
				stride += rvb.BufDataStepList[i];
			}
		} else {
			stride = rvb.s_stride;
		}
		let j = 0;
		let segLen = 0;
		let parrf32: Float32Array = null;
		let subArr: Float32Array = null;

		for (i = 0; i < tot; ++i) {
			k = i * stride;
			for (j = 0; j < bufTot; ++j) {
				segLen = rvb.BufDataStepList[j];
				parrf32 = rvb.BufDataList[j];
				subArr = parrf32.subarray(i * segLen, (i + 1) * segLen);
				vtxfs32.set(subArr, k);
				k += segLen;
			}
		}
		if (newBoo) {
			vb.setF32DataAt(0, vtxfs32, stride, offsetList);
		} else {
			vb.setF32DataAt(0, vtxfs32, stride, null);
		}
		const vls = rvb.BufVerList;
		if (vls.length > 0) {
			vb.setF32DataVerAt(0, vls[0]);
		}
	}

	static UpdateBufData(vb: ROVertexBuffer): void {
		if (vb.getType() == 0) {
			ROVertexBuffer.UpdateCombinedBufData(vb);
		} else {
			ROVertexBuffer.UpdateSeparatedBufData(vb);
		}
	}
	static CreateByBufDataSeparate(bufData: VtxBufData, bufDataUsage: number = VtxBufConst.VTX_STATIC_DRAW, layoutBit: number = 0x0): ROVertexBuffer {
		let i = 0;
		let stride = 0;
		let bufTot = bufData.getAttributesTotal();
		let offsetList = new Array(bufTot);
		offsetList.fill(0);

		const rvb = ROVertexBuffer;
		let vb = rvb.Create(bufDataUsage);
		vb.layoutBit = layoutBit;
		if (rvb.s_separatedBufs.length > 0) {
			let vtx = rvb.s_separatedBufs.pop() as VtxSeparatedBuf;
			vb.setVtxBuf(vtx);
		} else {
			vb.setVtxBuf(new VtxSeparatedBuf());
		}
		for (i = 0; i < bufTot; i++) {
			vb.setF32DataAt(i, bufData.getAttributeDataAt(i, 0), stride, offsetList);
		}
		vb.setIVSDataAt(bufData.getIndexDataAt(0));
		vb.bufData = bufData;

		const vls = rvb.BufVerList;
		if (vls.length > 0) {
			for (i = 0; i < bufTot; i++) {
				vb.setF32DataVerAt(i, vls[i]);
			}
		}
		return vb;
	}

	static CreateBySaveDataSeparate(bufDataUsage: number = VtxBufConst.VTX_STATIC_DRAW): ROVertexBuffer {
		const rvb = ROVertexBuffer;

		let i = 0;
		let stride = 0;
		let bufTot = rvb.BufDataStepList.length;
		let offsetList: number[] = new Array(bufTot);

		let vb = rvb.Create(bufDataUsage);
		if (rvb.s_separatedBufs.length > 0) {
			let vtx = rvb.s_separatedBufs.pop() as VtxSeparatedBuf;
			vb.setVtxBuf(vtx);
		} else {
			vb.setVtxBuf(new VtxSeparatedBuf());
		}
		for (i = 0; i < bufTot; i++) {
			offsetList[i] = rvb.BufDataStepList[i];
		}
		for (i = 0; i < bufTot; i++) {
			vb.setF32DataAt(i, rvb.BufDataList[i], stride, offsetList);
		}
        const vls = rvb.BufVerList;
		if (vls.length > 0) {
			for (i = 0; i < bufTot; i++) {
				vb.setF32DataVerAt(i, vls[i]);
			}
		}
		return vb;
	}
	private static UpdateSeparatedBufData(vb: ROVertexBuffer): ROVertexBuffer {

		const rvb = ROVertexBuffer;
		let bufTot = rvb.BufDataStepList.length;
		let offsetList: number[] = new Array(bufTot);
		for (let i = 0; i < bufTot; i++) {
			offsetList[i] = rvb.BufDataStepList[i];
		}
		// console.log("ROVertexBuffer::CreateBySaveDataSeparate(), bufTot: "+bufTot);
		for (let i = 0; i < bufTot; i++) {
			vb.setF32DataAt(i, rvb.BufDataList[i], 0, offsetList);
		}
        const vls = rvb.BufVerList;
		if (vls.length > 0) {
			for (let i = 0; i < bufTot; i++) {
				vb.setF32DataVerAt(i, vls[i]);
			}
		}
		return vb;
	}
	static GetVtxAttachCountAt(vtxUid: number): number {
		return ROVertexBuffer.s_vtxStore.getAttachCountAt(vtxUid);
	}
	static GetVtxAttachAllCount(): number {
		return ROVertexBuffer.s_vtxStore.getAttachAllCount();
	}
	private static s_timeDelay = 128;
	/**
	 * 放在帧循环中自动定时清理资源 system memory vertex data
	 */
	static ClearTest(): void {
		--ROVertexBuffer.s_timeDelay;
		if (ROVertexBuffer.s_timeDelay < 1) {
			ROVertexBuffer.s_timeDelay = 128;
			// 管理作为数据
			let store: ROVtxBufUidStore = ROVertexBuffer.s_vtxStore;

			if (store.__$getRemovedListLen() > 0) {
				let list: number[] = store.__$getRemovedList();
				let len: number = list.length;
				let i: number = 0;
				let vtxUid: number = 0;
				let vb: ROVertexBuffer = null;
				let maxSteps: number = 32;
				len = len > maxSteps ? maxSteps : len;
				for (; i < len; ++i) {
					vtxUid = list.shift();
					if (store.getAttachCountAt(vtxUid) < 1) {
						console.log("ROVertexBuffer remove a instance, vtxUid: " + vtxUid);
						vb = ROVertexBuffer.GetVtxByUid(vtxUid);
						ROVertexBuffer.__$Restore(vb);
					}
				}
			}
		}
	}
}
