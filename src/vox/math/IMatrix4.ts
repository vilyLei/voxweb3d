/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import IVector3D from "../../vox/math/IVector3D";
import Float32Data from "../../vox/base/Float32Data";
// import Matrix4 from "./Matrix4";

interface IMatrix4 extends Float32Data {

	setData(data: number[]): void;
	getCapacity(): number;
	getUid(): number;
	getLocalFS32(): Float32Array;
	getFS32(): Float32Array;
	getFSIndex(): number;
	identity(): void;
	determinant(): number;
	append(lhs: IMatrix4): void;
	append3x3(lhs: IMatrix4): void;
	/**
	 * @param radian rotation angle radian
	 * @param axis rotation axis, it is a normalized IVector3D instance
	 * @param pivotPoint the default value is null
	 */
	appendRotationPivot(radian: number, axis: IVector3D, pivotPoint?: IVector3D): void;
	appendRotation(radian: number, axis: IVector3D): void;
	appendRotationX(radian: number): void;
	appendRotationY(radian: number): void;
	appendRotationZ(radian: number): void;
	// 用欧拉角形式旋转(heading->pitch->bank) => (y->x->z)
	appendRotationEulerAngle(radianX: number, radianY: number, radianZ: number): void;
	setScale(v3: IVector3D): IMatrix4;
	setScaleXYZ(xScale: number, yScale: number, zScale: number): void;
	setRotationEulerAngle(radianX: number, radianY: number, radianZ: number): void;
	setRotationEulerAngle2(cosX: number, sinX: number, cosY: number, sinY: number, cosZ: number, sinZ: number): void;
	setTranslationXYZ(px: number, py: number, pz: number): void;
	setTranslation(v3: IVector3D): void;
	appendScaleXYZ(xScale: number, yScale: number, zScale: number): void;

	appendScaleXY(xScale: number, yScale: number): void;
	appendTranslationXYZ(px: number, py: number, pz: number): void;
	appendTranslation(v3: IVector3D): void;
	copyColumnFrom(column_index: number, v3: IVector3D): void;
	copyColumnTo(column_index: number, v3: IVector3D): void;
	/**
	 * @param fs32Arr src data
	 * @param index the default value is 0
	 */
	setF32ArrAndIndex(fs32Arr: Float32Array, index?: number): void;
	/**
	 * @param index the default value is 0
	 */
	setF32ArrIndex(index: number): void;
	setF32Arr(fs32Arr: Float32Array): void;
	/**
	 *
	 * @param fs32Arr src data
	 * @param index the default value is 0
	 */
	copyFromF32Arr(fs32Arr: Float32Array, index?: number): void;
	/**
	 *
	 * @param fs32Arr dst data
	 * @param index the default value is 0
	 */
	copyToF32Arr(fs32Arr: Float32Array, index?: number): void;
	copyFrom(smat: IMatrix4): void;
	copyTo(dmat: IMatrix4): void;
	/**
	 *
	 * @param float_rawDataArr src data
	 * @param rawDataLength the default value is 16
	 * @param index  the default value is 0
	 * @param transpose  the default value is false
	 */
	copyRawDataFrom(float_rawDataArr: Float32Array, rawDataLength?: number, index?: number, transpose?: Boolean): void;
	/**
	 *
	 * @param float_rawDataArr dst data
	 * @param rawDataLength the default value is 16
	 * @param index  the default value is 0
	 * @param transpose  the default value is false
	 */
	copyRawDataTo(float_rawDataArr: Float32Array, rawDataLength?: number, index?: number, transpose?: boolean): void;
	copyRowFrom(row_index: number, v3: IVector3D): void;
	copyRowTo(row_index: number, v3: IVector3D): void;
	/**
	 * @param orientationStyle the value example: OrientationType.EULER_ANGLES
	 * @returns [position, rotation, scale]
	 */
	decompose(orientationStyle: number): IVector3D[];
	invert(): boolean;
	pointAt(pos: IVector3D, at: IVector3D, up: IVector3D): void;
	prepend(rhs: IMatrix4): void;
	prepend3x3(rhs: IMatrix4): void;
	prependRotationPivot(radian: number, axis: IVector3D, pivotPoint: IVector3D): void;
	prependRotation(radian: number, axis: IVector3D): void;
	prependRotationX(radian: number): void;
	prependRotationY(radian: number): void;
	prependRotationZ(radian: number): void;
	// 用欧拉角形式旋转(heading->pitch->bank) => (y->x->z)
	prependRotationEulerAngle(radianX: number, radianY: number, radianZ: number): void;
	prependScale(xScale: number, yScale: number, zScale: number): void;
	prependScaleXY(xScale: number, yScale: number): void;
	prependTranslationXYZ(px: number, py: number, pz: number): void;
	prependTranslation(v3: IVector3D): void;
	recompose(components: IVector3D[], orientationStyle: number): boolean;
	setThreeAxes(x_axis: IVector3D, y_axis: IVector3D, z_axis: IVector3D,): void;
	deltaTransformVector(v3: IVector3D): IVector3D;

	deltaTransformVectorSelf(v3: IVector3D): void;
	deltaTransformOutVector(v3: IVector3D, out_v3: IVector3D): void;
	transformVector(v3: IVector3D): IVector3D;
	transformOutVector(v3: IVector3D, out_v3: IVector3D): void;
	transformOutVector3(v3: IVector3D, out_v3: IVector3D): void;
	transformVector3Self(v3: IVector3D): void;
	transformVectorSelf(v3: IVector3D): void;
	transformVectors(float_vinArr: Float32Array | number[], vinLength: number, float_voutArr: Float32Array): void;
	transformVectorsSelf(float_vinArr: Float32Array | number[], vinLength: number): void;
	transformVectorsRangeSelf(float_vinArr: Float32Array | number[], begin: number, end: number): void;
	transpose(): void;
	interpolateTo(toMat: IMatrix4, float_percent: number): void;
	rotationX(radian: number): void;
	rotationY(radian: number): void;
	rotationZ(radian: number): void;

	copyTranslation( m: IMatrix4 ): IMatrix4;

	transformPerspV4Self(v4: IVector3D): void;

	premultiply(m: IMatrix4): IMatrix4;
	multiply(m: IMatrix4): IMatrix4;
	invertThis(): IMatrix4;

	
	lookAtRH(eyePos: IVector3D, atPos: IVector3D, up: IVector3D): void;
	lookAtLH(eyePos: IVector3D, atPos: IVector3D, up: IVector3D): void;

	clone(): IMatrix4;
	destroy(): void;
}

export default IMatrix4;
