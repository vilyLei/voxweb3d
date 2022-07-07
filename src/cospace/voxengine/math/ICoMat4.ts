import {ICoVec3} from "./ICoVec3";
interface ICoMat4 {

	setData(data: number[]): void;
	getCapacity(): number;
	GetMaxUid(): number;
	getUid(): number;
	getLocalFS32(): Float32Array;
	getFS32(): Float32Array;
	getFSIndex(): number;
	identity(): void;
	determinant(): number;

	multiplyMatrices( a: ICoMat4, b: ICoMat4 ): ICoMat4;
	multiply(ma: ICoMat4, mb?: ICoMat4): ICoMat4;

	premultiply(m: ICoMat4): ICoMat4;
	append3x3(lhs: ICoMat4): void;
	appendRotationPivot(radian: number, axis: ICoVec3, pivotPoint?: ICoVec3): void;
	appendRotation(radian: number, axis: ICoVec3): void;
	appendRotationX(radian: number): void;
	appendRotationY(radian: number): void;
	appendRotationZ(radian: number): void;
	// 用欧拉角形式旋转(heading->pitch->bank) => (y->x->z)
	appendRotationEulerAngle(radianX: number, radianY: number, radianZ: number): void;

	setScale(v3: ICoVec3): ICoMat4;
	setScaleXYZ(xScale: number, yScale: number, zScale: number): void;
	getScale(outV3: ICoVec3): void;
	setRotationEulerAngle(radianX: number, radianY: number, radianZ: number): void;

	setRotationEulerAngle2(cosX: number, sinX: number, cosY: number, sinY: number, cosZ: number, sinZ: number): void

	// compose( position: ICoVec3, quaternion: Quaternion, scale: ICoVec3 ): ICoMat4;
	// makeRotationFromQuaternion( q: Quaternion ):ICoMat4;
	// makeRotationFromEuler( euler: Euler ): ICoMat4;

	extractRotation( m: ICoMat4 ): ICoMat4;
	copyTranslation( m: ICoMat4 ): ICoMat4;
	setTranslationXYZ(px: number, py: number, pz: number): void;
	setTranslation(v3: ICoVec3): void;
	appendScaleXYZ(xScale: number, yScale: number, zScale: number): void;

	appendScaleXY(xScale: number, yScale: number): void;
	appendTranslationXYZ(px: number, py: number, pz: number): void;
	appendTranslation(v3: ICoVec3): void;
	copyColumnFrom(column_index: number, v3: ICoVec3): void;
	copyColumnTo(column_index: number, outV3: ICoVec3): void;
	setF32ArrAndIndex(fs32Arr: Float32Array, index?: number): void;
	setF32ArrIndex(index?: number): void;
	setF32Arr(fs32Arr: Float32Array): void;
	copyFromF32Arr(fs32Arr: Float32Array, index?: number): void;
	copyToF32Arr(fs32Arr: Float32Array, index?: number): void;
	copy(smat: ICoMat4): ICoMat4;
	copyFrom(smat: ICoMat4): void;
	copyTo(dmat: ICoMat4): void;
	copyRawDataFrom(float_rawDataArr: Float32Array, rawDataLength?: number, index?: number, bool_tp?: Boolean): void;
	copyRawDataTo(float_rawDataArr: Float32Array, rawDataLength?: number, index?: number, bool_tp?: boolean): void;
	copyRowFrom(row_index: number, v3: ICoVec3): void;
	copyRowTo(row_index: number, v3: ICoVec3): void;
	decompose(orientationStyle: number): ICoVec3[];
	invert(): boolean;
	invertThis(): ICoMat4;
	pointAt(pos: ICoVec3, at: ICoVec3, up: ICoVec3): void;
	prepend(rhs: ICoMat4): void;
	prepend3x3(rhs: ICoMat4): void;
	prependRotationPivot(radian: number, axis: ICoVec3, pivotPoint: ICoVec3): void;
	prependRotation(radian: number, axis: ICoVec3): void;
	prependRotationX(radian: number): void;
	prependRotationY(radian: number): void;
	prependRotationZ(radian: number): void;
	// 用欧拉角形式旋转(heading->pitch->bank) => (y->x->z)
	prependRotationEulerAngle(radianX: number, radianY: number, radianZ: number): void;
	prependScale(xScale: number, yScale: number, zScale: number): void;
	prependScaleXY(xScale: number, yScale: number): void;
	prependTranslationXYZ(px: number, py: number, pz: number): void;
	prependTranslation(v3: ICoVec3): void;
	recompose(components: ICoVec3[], orientationStyle: number): boolean;
	setThreeAxes(x_axis: ICoVec3, y_axis: ICoVec3, z_axis: ICoVec3,): void;
	deltaTransformVector(v3: ICoVec3): ICoVec3;

	deltaTransformVectorSelf(v3: ICoVec3): void;
	deltaTransformOutVector(v3: ICoVec3, out_v3: ICoVec3): void;
	transformVector(v3: ICoVec3): ICoVec3;
	transformOutVector(v3: ICoVec3, out_v3: ICoVec3): void;
	transformOutVector3(v3: ICoVec3, out_v3: ICoVec3): void;
	transformVector3Self(v3: ICoVec3): void;
	transformVectorSelf(v3: ICoVec3): void;
	transformVectors(float_vinArr: Float32Array | number[], vinLength: number, float_voutArr: Float32Array): void;
	transformVectorsSelf(float_vinArr: Float32Array | number[], vinLength: number): void;
	transformVectorsRangeSelf(float_vinArr: Float32Array | number[], begin: number, end: number): void;
	transpose(): void;
	interpolateTo(toMat: ICoMat4, float_percent: number): void;

	rotationX(radian: number): void;
	rotationY(radian: number): void;
	rotationZ(radian: number): void;

	transformPerspV4Self(v4: ICoVec3): void;
	clone(): ICoMat4;
	///////
	// view etc..
	///////////////////////////////////////////
	perspectiveRH(fovy: number, aspect: number, zNear: number, zFar: number): void;
	perspectiveRH2(fovy: number, pw: number, ph: number, zNear: number, zFar: number): void;
	orthoRH(b: number, t: number, l: number, r: number, zNear: number, zFar: number): void;
	perspectiveLH(fovy: number, aspect: number, zNear: number, zFar: number): void;
	orthoLH(b: number, t: number, l: number, r: number, zNear: number, zFar: number): void;
	lookAtRH(eye: ICoVec3, center: ICoVec3, up: ICoVec3): void;
	lookAtLH(eye: ICoVec3, center: ICoVec3, up: ICoVec3): void;
	destroy(): void;
}

export { ICoMat4 }
