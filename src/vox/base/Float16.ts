/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2023 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import Float32Data from "../../vox/base/Float32Data";

/////////////////////////////////////////////////////////////////////////////////////////////////
export default class Float16 implements Float32Data {
	private static ___InitData_0: Float32Array = new Float32Array([0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0]);
	private static ___InitData_1: Float32Array = new Float32Array([1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0]);
	private static s_uid: number = 0;
	private m_uid: number = -1;
	private m_index: number = 0;
	private m_fs32: Float32Array = null;
	private m_localFS32: Float32Array = null;

	name: string = "Float16";

	constructor(pfs32: Float32Array = null, index: number = 0) {
		this.m_uid = Float16.s_uid++;
		this.m_index = index;
		if (pfs32 != null) {
			this.m_fs32 = pfs32;
			this.m_localFS32 = this.m_fs32.subarray(index, index + 16);
		}
		else {
			this.m_fs32 = new Float32Array(16);
			this.m_fs32.set(Float16.___InitData_0, 0);
			this.m_localFS32 = this.m_fs32;
		}
	}
	getCapacity(): number {
		return 16;
	}
	getUid(): number {
		return this.m_uid;
	}
	set4fAt(i: number, f0: number, f1: number, f2: number, f3: number): void {
		i *= 4;
		this.m_localFS32[i] = f0;
		this.m_localFS32[i + 1] = f1;
		this.m_localFS32[i + 2] = f2;
		this.m_localFS32[i + 3] = f3;
	}
	getLocalFS32(): Float32Array {
		return this.m_localFS32;
	}
	getFS32(): Float32Array {
		return this.m_fs32;
	}
	getFSIndex(): number {
		return this.m_index;
	}
	identity(): void {
		this.m_localFS32.set(Float16.___InitData_0, 0);
	}

	identityOne(): void {
		this.m_localFS32.set(Float16.___InitData_1, 0);
	}

	setF32ArrAndIndex(fs32Arr: Float32Array, index: number = 0): void {
		if (fs32Arr != null) {
			this.m_fs32 = fs32Arr;
			this.m_index = index;
		}
	}
	setF32Arr(fs32Arr: Float32Array): void {
		if (fs32Arr != null) {
			this.m_fs32 = fs32Arr;
		}
	}
	copyFromF32Arr(fs32Arr: Float32Array, index: number = 0): void {
		let subArr: Float32Array = fs32Arr.subarray(index, index + 16);
		this.m_fs32.set(subArr, this.m_index);
	}
	copyFrom(mat_other: Float16): void {
		this.m_localFS32.set(mat_other.getLocalFS32(), 0);
	}
	copyTo(mat_other: Float16): void {
		mat_other.copyFrom(this);
	}
	copyRawDataTo(float_rawDataArr: Float32Array, rawDataLength: number = 4, index: number = 0): void {
		let c: number = 0;
		while (c < rawDataLength) {
			float_rawDataArr[c + index] = this.m_fs32[this.m_index + c];
			++c;
		}
	}
	/////////////////////////////////////////////////////////////
	toString(): string {
		let str: string = "\n" + this.m_localFS32[0] + "," + this.m_localFS32[1] + "," + this.m_localFS32[2] + "," + this.m_localFS32[3] + "\n";
		str += this.m_localFS32[4] + "," + this.m_localFS32[5] + "," + this.m_localFS32[6] + "," + this.m_localFS32[7] + "\n";
		str += this.m_localFS32[8] + "," + this.m_localFS32[9] + "," + this.m_localFS32[10] + "," + this.m_localFS32[11] + "\n";
		str += this.m_localFS32[12] + "," + this.m_localFS32[13] + "," + this.m_localFS32[14] + "," + this.m_localFS32[15] + "\n";
		return str;
	}
	destroy(): void {
		this.m_localFS32 = null;
		this.m_fs32 = null;
		this.m_index = -1;
	}
}