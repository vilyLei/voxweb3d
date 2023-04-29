/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2023 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import IVtxShdCtr from "../../vox/material/IVtxShdCtr";
import IROVtxBuilder from "../../vox/render/IROVtxBuilder";
import IVertexRenderObj from "../../vox/render/IVertexRenderObj";
import VROBase from "../../vox/render/VROBase";
import DebugFlag from "../debug/DebugFlag";

export default class VertexRenderObj extends VROBase {
	private static s_uid: number = 0;

	shdp: IVtxShdCtr = null;

	vbufs: any[] = null;
	vbuf: any = null;

	attribTypes: number[] = null;
	wholeOffsetList: number[] = null;
	attribTypesLen = 0;
	updateUnlocked = true;
	wholeStride = 0;

	private constructor() {
		super();
		this.m_uid = VertexRenderObj.s_uid++;
	}
	run(): void {
		if (this.m_rc.testVROUid(this.m_uid) || this.indicesRes.test()) {
			if (DebugFlag.Flag_0 > 0) {
				console.log("VertexRenderObj::run(), B:", this.getUid(), this.m_vtxUid, this.m_uid);
			}
			if (this.vbuf != null) {
				this.m_rc.useVtxAttribsPtrTypeFloat(
					this.shdp,
					this.vbuf,
					this.attribTypes,
					this.attribTypesLen,
					this.wholeOffsetList,
					this.wholeStride
				);
			} else {
				this.m_rc.useVtxAttribsPtrTypeFloatMulti(
					this.shdp,
					this.vbufs,
					this.attribTypes,
					this.attribTypesLen,
					this.wholeOffsetList,
					this.wholeStride
				);
			}
			// if (this.m_rc.testRIOUid(this.m_vtxUid)) {
			//     this.m_rc.bindEleBuf(this.ibuf);
			// }
			this.indicesRes.bindToGPU();
		}
	}
	protected __$destroy(): void {
		console.log("VertexRenderObj::__$destroy()..., " + this);
		VROBase.s_midMap.delete(this.m_mid);
		this.m_mid = 0;
		this.m_vtxUid = -1;
		this.m_rc = null;
		this.shdp = null;
		this.vbufs = null;
		this.vbuf = null;
		// this.ibuf = null;
		this.indicesRes = null;

		this.attribTypes = null;
		this.attribTypesLen = 0;
		this.wholeStride = 0;
	}
	restoreThis(): void {
		VertexRenderObj.Restore(this);
	}

	private static s_FLAG_BUSY: number = 1;
	private static s_FLAG_FREE: number = 0;
	private static s_flags: number[] = [];
	private static s_unitListLen: number = 0;
	private static s_unitList: VertexRenderObj[] = [];
	private static s_freeIdList: number[] = [];
	
	static HasMid(mid: number): boolean {
		return VROBase.s_midMap.has(mid);
	}
	static GetByMid(mid: number): IVertexRenderObj {
		return VROBase.s_midMap.get(mid);
	}
	private static GetFreeId(): number {
		if (VertexRenderObj.s_freeIdList.length > 0) {
			return VertexRenderObj.s_freeIdList.pop();
		}
		return -1;
	}
	static Create(rc: IROVtxBuilder, mid: number, pvtxUid: number): VertexRenderObj {
		let unit: VertexRenderObj = null;
		let index: number = VertexRenderObj.GetFreeId();
		//console.log("VertexRenderObj::Create(), VertexRenderObj.s_unitList.length: "+VertexRenderObj.s_unitList.length);
		if (index >= 0) {
			unit = VertexRenderObj.s_unitList[index];
			VertexRenderObj.s_flags[index] = VertexRenderObj.s_FLAG_BUSY;
			unit.setMidAndBufUid(mid, pvtxUid);
		} else {
			unit = new VertexRenderObj();
			unit.setMidAndBufUid(mid, pvtxUid);
			VertexRenderObj.s_unitList.push(unit);
			VertexRenderObj.s_flags.push(VertexRenderObj.s_FLAG_BUSY);
			VertexRenderObj.s_unitListLen++;
		}
		unit.setRC(rc);
		VROBase.s_midMap.set(mid, unit);
		return unit;
	}

	private static Restore(pobj: VertexRenderObj): void {
		if (pobj != null && pobj.m_attachCount < 1 && VertexRenderObj.s_flags[pobj.getUid()] == VertexRenderObj.s_FLAG_BUSY) {
			let uid: number = pobj.getUid();
			VertexRenderObj.s_freeIdList.push(uid);
			VertexRenderObj.s_flags[uid] = VertexRenderObj.s_FLAG_FREE;
			pobj.__$destroy();
		}
	}
}
