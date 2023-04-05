/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import IVtxDrawingInfo from "./IVtxDrawingInfo";
import { IROIvsRDP } from "./IROIvsRDP";

export default class VtxDrawingInfo implements IVtxDrawingInfo {
	private static s_uid = 0;
	private m_uid = VtxDrawingInfo.s_uid++;

	private m_ivsIndex = -1;
	private m_ivsCount = -1;
	private m_wireframe = false;
	private m_ver = 0;
	private m_unlock = true;
	private m_ivsDataIndex = 0;
	private m_insCount = 0;

	constructor() {}
	destroy(): void {
	}
	lock(): void {
		this.m_unlock = false;
	}
	unlock(): void {
		this.m_unlock = true;
	}
	isUnlock(): boolean {
		return this.m_unlock;
	}
	setInstanceCount(insCount: number): void {
		if (this.m_unlock && this.m_insCount != insCount) {
			this.m_insCount = insCount;
			this.m_ver++;
		}
	}
	setWireframe(wireframe: boolean): void {
		if (this.m_unlock && this.m_wireframe != wireframe) {
			this.m_wireframe = wireframe;
			this.m_ver++;
		}
	}
	applyIvsDataAt(index: number): void {
		if (index >= 0 && this.m_ivsDataIndex != index) {
			this.m_ver++;
			this.m_ivsDataIndex = index;
		}
	}
	setIvsParam(ivsIndex: number = -1, ivsCount: number = -1): void {
		if (this.m_unlock) {
			if (ivsIndex >= 0 && this.m_ivsIndex != ivsIndex) {
				this.m_ivsIndex = ivsIndex;
				this.m_ver++;
			}
			if (ivsCount >= 0 && this.m_ivsCount != ivsCount) {
				this.m_ivsCount = ivsCount;
				this.m_ver++;
			}
		}
	}
	reset(): void {
        
	}
	__$$copyToRDP(rdp: IROIvsRDP): boolean {
		// console.log("__$$copyToRDP() ...rdp.getUid(): ", rdp.getUid());
		if (rdp) {
			// const rdp = this.rdp;
			if (this.m_unlock) {
				// console.log("info rdp.getUid(): ", rdp.getUid(), this.m_uid);
				const ver = this.m_ver * 31 + this.m_uid;
				if (rdp.ver != ver) {
					rdp.ver = ver;

					// console.log("__$$copyToRDP() ...rdp.getUid(): ", rdp.getUid(), ", this.m_uid: ", this.m_uid);
					rdp.setInsCount(this.m_insCount);
					rdp.setIvsParam(this.m_ivsIndex, this.m_ivsCount);

					if (this.m_wireframe) {
						rdp.toWireframe();
					} else {
						rdp.toCommon();
					}
					rdp.applyRDPAt(this.m_ivsDataIndex);
				}
			}
			return rdp.test();
		}
		return false;
	}
}
