/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2023 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/
// 只是用transform 和一个 ROTransform 一一对应, 只是记录transform的最终形态

import MathConst from "../../vox/math/MathConst";
import IVector3D from "../../vox/math/IVector3D";
import Matrix4 from "../../vox/math/Matrix4";
import Matrix4Pool from "../../vox/math/Matrix4Pool";
import IROTransform from "./IROTransform";
import IROTransUpdateWrapper from "./IROTransUpdateWrapper";
import IEntityUpdate from "../../vox/scene/IEntityUpdate";
import ITransUpdater from "../../vox/scene/ITransUpdater";

export default class ROTransform implements IROTransform, IEntityUpdate {
	private static s_uid: number = 0;
	private static s_initData = new Float32Array([1.0, 0.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0, 0.0, 1.0]);
	static readonly UPDATE_NONE = 0;
	static readonly UPDATE_POSITION = 1;
	static readonly UPDATE_ROTATION = 2;
	static readonly UPDATE_SCALE = 4;
	static readonly UPDATE_TRANSFORM = 7;
	static readonly UPDATE_PARENT_MAT = 8;
	private m_uid = 0;
	private m_fs32: Float32Array = null;
	// It is a flag that need inverted mat yes or no
	private m_invMatEnabled = false;
	private m_rotFlag = false;
	private m_dt = 0;
	// private m_updater: ITransUpdater = null;
	wrapper: IROTransUpdateWrapper = null;
	version = -1;
	/**
	 * the default value is 0
	 */
	__$transUpdate = 0;
	constructor(fs32: Float32Array = null) {
		this.m_uid = ROTransform.s_uid++;
		this.m_dt = fs32 != null ? 1 : 0;
		this.m_fs32 = fs32 != null ? fs32 : new Float32Array(16);
	}
	updatedStatus = ROTransform.UPDATE_POSITION;
	updateStatus = ROTransform.UPDATE_TRANSFORM;
	getUid(): number {
		return this.m_uid;
	}
	getFS32Data(): Float32Array {
		return this.m_fs32;
	}
	/**
	 * 防止因为共享 fs32 数据带来的逻辑错误
	 */
	rebuildFS32Data(): void {
		if (this.m_dt > 0) {
			this.m_dt = 0;
			this.m_fs32 = new Float32Array(16);
		}
	}
	getRotationFlag(): boolean {
		return this.m_rotFlag;
	}
	getX(): number {
		return this.m_fs32[12];
	}
	getY(): number {
		return this.m_fs32[13];
	}
	getZ(): number {
		return this.m_fs32[14];
	}
	setX(p: number): void {
		this.updateStatus |= 1;
		this.updatedStatus |= 1;
		this.m_fs32[12] = p;
		this.updateTo();
	}
	setY(p: number): void {
		this.updateStatus |= 1;
		this.updatedStatus |= 1;
		this.m_fs32[13] = p;
		this.updateTo();
	}
	setZ(p: number): void {
		this.updateStatus |= 1;
		this.updatedStatus |= 1;
		this.m_fs32[14] = p;
		this.updateTo();
	}
	setXYZ(px: number, py: number, pz: number): void {
		this.m_fs32[12] = px;
		this.m_fs32[13] = py;
		this.m_fs32[14] = pz;
		this.updateStatus |= 1;
		this.updatedStatus |= 1;
		this.updateTo();
	}
	offsetPosition(pv: IVector3D): void {
		this.m_fs32[12] += pv.x;
		this.m_fs32[13] += pv.y;
		this.m_fs32[14] += pv.z;
		this.updateStatus |= 1;
		this.updatedStatus |= 1;
		this.updateTo();
	}
	setPosition(pv: IVector3D): void {
		this.m_fs32[12] = pv.x;
		this.m_fs32[13] = pv.y;
		this.m_fs32[14] = pv.z;
		this.updateStatus |= 1;
		this.updatedStatus |= 1;
		this.updateTo();
	}
	getPosition(pv: IVector3D): void {
		pv.x = this.m_fs32[12];
		pv.y = this.m_fs32[13];
		pv.z = this.m_fs32[14];
	}
	copyPositionFrom(t: ROTransform): void {
		if (t != null) {
			this.m_fs32[12] = t.m_fs32[12];
			this.m_fs32[13] = t.m_fs32[13];
			this.m_fs32[14] = t.m_fs32[14];
			this.updateStatus |= ROTransform.UPDATE_POSITION;
			this.updatedStatus |= ROTransform.UPDATE_POSITION;
			this.updateTo();
		}
	}
	getRotationX(): number {
		return this.m_fs32[1];
	}
	getRotationY(): number {
		return this.m_fs32[6];
	}
	getRotationZ(): number {
		return this.m_fs32[9];
	}
	setRotationX(degrees: number): void {
		this.m_fs32[1] = degrees;
		this.m_rotFlag = true;
		this.updateStatus |= ROTransform.UPDATE_ROTATION;
		this.updatedStatus |= ROTransform.UPDATE_ROTATION;
		this.updateTo();
	}
	setRotationY(degrees: number): void {
		this.m_fs32[6] = degrees;
		this.m_rotFlag = true;
		this.updateStatus |= ROTransform.UPDATE_ROTATION;
		this.updatedStatus |= ROTransform.UPDATE_ROTATION;
		this.updateTo();
	}
	setRotationZ(degrees: number): void {
		this.m_fs32[9] = degrees;
		this.m_rotFlag = true;
		this.updateStatus |= ROTransform.UPDATE_ROTATION;
		this.updatedStatus |= ROTransform.UPDATE_ROTATION;
		this.updateTo();
	}
	setRotationXYZ(rx: number, ry: number, rz: number): void {
		this.m_fs32[1] = rx;
		this.m_fs32[6] = ry;
		this.m_fs32[9] = rz;
		this.updateStatus |= ROTransform.UPDATE_ROTATION;
		this.updatedStatus |= ROTransform.UPDATE_ROTATION;
		this.m_rotFlag = true;
		this.updateTo();
	}
	setRotationV3(v3: IVector3D): void {
		this.setRotationXYZ(v3.x, v3.y, v3.z);
	}
	getScaleX(): number {
		return this.m_fs32[0];
	}
	getScaleY(): number {
		return this.m_fs32[5];
	}
	getScaleZ(): number {
		return this.m_fs32[10];
	}
	setScaleX(p: number): void {
		this.m_fs32[0] = p;
		this.updateStatus |= ROTransform.UPDATE_SCALE;
		this.updatedStatus |= ROTransform.UPDATE_SCALE;
	}
	setScaleY(p: number): void {
		this.m_fs32[5] = p;
		this.updateStatus |= ROTransform.UPDATE_SCALE;
		this.updatedStatus |= ROTransform.UPDATE_SCALE;
	}
	setScaleZ(p: number): void {
		this.m_fs32[10] = p;
		this.updateStatus |= ROTransform.UPDATE_SCALE;
		this.updatedStatus |= ROTransform.UPDATE_SCALE;
	}
	setScaleXYZ(sx: number, sy: number, sz: number): void {
		this.m_fs32[0] = sx;
		this.m_fs32[5] = sy;
		this.m_fs32[10] = sz;

		this.updateStatus |= ROTransform.UPDATE_SCALE;
		this.updatedStatus |= ROTransform.UPDATE_SCALE;
		this.updateTo();
	}
	setScaleV3(v3: IVector3D): void {
		this.setScaleXYZ(v3.x, v3.y, v3.z);
	}
	setScale(s: number): void {
		this.m_fs32[0] = s;
		this.m_fs32[5] = s;
		this.m_fs32[10] = s;
		this.updateStatus |= ROTransform.UPDATE_SCALE;
		this.updatedStatus |= ROTransform.UPDATE_SCALE;
		this.updateTo();
	}
	getRotationXYZ(pv: IVector3D): void {
		pv.x = this.m_fs32[1];
		pv.y = this.m_fs32[6];
		pv.z = this.m_fs32[9];
	}
	getScaleXYZ(pv: IVector3D): void {
		pv.x = this.m_fs32[0];
		pv.y = this.m_fs32[5];
		pv.z = this.m_fs32[10];
	}
	// local to world spcae matrix
	private m_omat: Matrix4 = null;
	private m_localMat: Matrix4 = null;
	private m_parentMat: Matrix4 = null;
	private m_toParentMat: Matrix4 = null;
	private m_toParentMatFlag: boolean = true;
	// word to local matrix
	private m_invOmat: Matrix4 = null;

	localToGlobal(pv: IVector3D): void {
		this.getMatrix().transformVectorSelf(pv);
	}
	globalToLocal(pv: IVector3D): void {
		this.getInvMatrix().transformVectorSelf(pv);
	}
	// maybe need call update function
	getInvMatrix(): Matrix4 {
		if (this.m_invOmat != null) {
			if (this.m_invMatEnabled) {
				this.m_invOmat.copyFrom(this.m_omat);
				this.m_invOmat.invert();
			}
		} else {
			this.m_invOmat = Matrix4Pool.GetMatrix();
			this.m_invOmat.copyFrom(this.m_omat);
			this.m_invOmat.invert();
		}
		this.m_invMatEnabled = false;
		return this.m_invOmat;
	}
	getLocalMatrix(): Matrix4 {
		if (this.updateStatus > 0) {
			this.update();
		}
		return this.m_localMat;
	}
	// get local to world matrix, maybe need call update function
	getMatrix(flag: boolean = true): Matrix4 {
		if (this.updateStatus > 0 && flag) {
			this.update();
		}
		return this.m_omat;
	}
	// get local to parent space matrix, maybe need call update function
	getToParentMatrix(): Matrix4 {
		if (this.m_toParentMat != null) {
			//  if(this.m_toParentMatFlag)
			//  {
			//      console.log("....");
			//      this.m_toParentMat.invert();
			//  }
			return this.m_toParentMat;
		}
		return this.m_omat;
	}
	// local to world matrix, 使用的时候注意数据安全->防止多个显示对象拥有而出现多次修改的问题,因此此函数尽量不要用
	setParentMatrix(matrix: Matrix4): void {
		//  console.log("sTOTransform::etParentMatrix(), this.m_parentMat != matrix: ",(this.m_parentMat != matrix),this.m_uid);

		this.m_parentMat = matrix;
		this.m_invMatEnabled = true;
		if (this.m_parentMat != null) {
			if (this.m_localMat == this.m_omat) {
				this.updateStatus = ROTransform.UPDATE_TRANSFORM;
				this.updatedStatus = this.updateStatus;
				this.m_localMat = Matrix4Pool.GetMatrix();
			} else {
				this.updateStatus |= ROTransform.UPDATE_PARENT_MAT;
				this.updatedStatus = this.updateStatus;
			}
			this.updateTo();
		}
	}
	getParentMatrix(): Matrix4 {
		return this.m_parentMat;
	}
	updateMatrixData(matrix: Matrix4): void {
		if (matrix != null) {
			this.updateStatus = ROTransform.UPDATE_NONE;
			this.m_invMatEnabled = true;
			this.m_omat.copyFrom(matrix);
			this.updateTo();
		}
	}
	__$setMatrix(matrix: Matrix4): void {
		if (matrix != null) {
			this.updateStatus = ROTransform.UPDATE_NONE;
			this.m_invMatEnabled = true;
			if (this.m_localMat == this.m_omat) {
				this.m_localMat = matrix;
			}
			if (this.m_omat != null) {
				// ROTransPool.RemoveTransUniform(this.m_omat);
				Matrix4Pool.RetrieveMatrix(this.m_omat);
			}
			this.m_omat = matrix;
			this.updateTo();
		}
	}
	private destroy(): void {
		// 当自身被完全移出RenderWorld之后才能执行自身的destroy
		if (this.m_invOmat != null) Matrix4Pool.RetrieveMatrix(this.m_invOmat);
		if (this.m_localMat != null) {
			// if (this.m_omat == this.m_localMat) {
			//     ROTransPool.RemoveTransUniform(this.m_omat);
			// }
			Matrix4Pool.RetrieveMatrix(this.m_localMat);
		}
		if (this.m_omat != null && this.m_omat != this.m_localMat) {
			// ROTransPool.RemoveTransUniform(this.m_omat);
			Matrix4Pool.RetrieveMatrix(this.m_omat);
		}
		this.m_invOmat = null;
		this.m_localMat = null;
		this.m_omat = null;
		this.m_parentMat = null;
		this.updateStatus = ROTransform.UPDATE_TRANSFORM;
		this.m_fs32 = null;
		this.wrapper = null;
	}

	copyFrom(src: ROTransform): void {
		this.m_fs32.set(src.m_fs32, 0);
		this.updatedStatus |= 1;
		this.updateStatus |= ROTransform.UPDATE_TRANSFORM;
		this.m_rotFlag = src.m_rotFlag;
		this.updateTo();
	}
	forceUpdate(): void {
		this.updateStatus |= ROTransform.UPDATE_TRANSFORM;
		this.update();
	}
	private updateTo(): void {
		if (this.wrapper) this.wrapper.updateTo();
	}
	setUpdater(updater: ITransUpdater): void {
		if (this.wrapper) this.wrapper.setUpdater(updater);
	}
	update(): void {
		let st = this.updateStatus;
		if (st > 0) {
			this.m_invMatEnabled = true;
			st = st | this.updatedStatus;
			if ((st & ROTransform.UPDATE_TRANSFORM) > 0) {
				const factor = MathConst.MATH_PI_OVER_180;
				this.m_localMat.getLocalFS32().set(this.m_fs32, 0);
				if (this.m_rotFlag) {
					this.m_localMat.setRotationEulerAngle(this.m_fs32[1] * factor, this.m_fs32[6] * factor, this.m_fs32[9] * factor);
				}
				if (this.m_parentMat != null) {
					st = st | ROTransform.UPDATE_PARENT_MAT;
				}
			}
			if (this.m_omat != this.m_localMat) {
				this.m_omat.copyFrom(this.m_localMat);
			}
			if ((st & ROTransform.UPDATE_PARENT_MAT) == ROTransform.UPDATE_PARENT_MAT) {
				if (this.m_toParentMat != null) {
					this.m_toParentMat.copyFrom(this.m_omat);
				} else {
					this.m_toParentMat = Matrix4Pool.GetMatrix();
					this.m_toParentMat.copyFrom(this.m_omat);
				}
				this.m_toParentMatFlag = true;
				this.m_omat.append(this.m_parentMat);
			}
			st = ROTransform.UPDATE_NONE;
			this.version++;
		}
		this.updateStatus = st;
		this.__$transUpdate = 0;
	}
	getMatrixFS32(): Float32Array {
		return this.getMatrix().getLocalFS32();
	}

	private static s_FLAG_BUSY: number = 1;
	private static s_FLAG_FREE: number = 0;
	private static m_unitFlagList: number[] = [];
	private static m_unitListLen: number = 0;
	private static m_unitList: ROTransform[] = [];
	private static m_freeIdList: number[] = [];
	private static GetFreeId(): number {
		if (ROTransform.m_freeIdList.length > 0) {
			return ROTransform.m_freeIdList.pop();
		}
		return -1;
	}
	static Create(matrix: Matrix4 = null, fs32: Float32Array = null): ROTransform {
		let unit: ROTransform = null;
		let index = fs32 != null ? -1 : ROTransform.GetFreeId();
		if (index >= 0) {
			unit = ROTransform.m_unitList[index];
			ROTransform.m_unitFlagList[index] = ROTransform.s_FLAG_BUSY;
			unit.rebuildFS32Data();
		} else {
			unit = new ROTransform(fs32);
			ROTransform.m_unitList.push(unit);
			ROTransform.m_unitFlagList.push(ROTransform.s_FLAG_BUSY);
			ROTransform.m_unitListLen++;
		}
		if (matrix == null) {
			unit.m_omat = Matrix4Pool.GetMatrix();
		} else {
			unit.m_omat = matrix;
		}
		unit.m_localMat = unit.m_omat;
		if (fs32 == null) {
			let ida = ROTransform.s_initData;
			if (unit.m_fs32 == null) {
				unit.m_fs32 = ida.slice(0);
			} else {
				unit.m_fs32.set(ida, 0);
			}
		}
		return unit;
	}

	static Restore(pt: ROTransform): void {
		if (pt != null && ROTransform.m_unitFlagList[pt.getUid()] == ROTransform.s_FLAG_BUSY) {
			let uid = pt.getUid();
			ROTransform.m_freeIdList.push(uid);
			ROTransform.m_unitFlagList[uid] = ROTransform.s_FLAG_FREE;
			pt.destroy();
		}
	}
}
