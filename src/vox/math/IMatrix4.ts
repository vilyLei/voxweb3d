/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import Vector3D from "../../vox/math/Vector3D";
import Float32Data from "../../vox/base/Float32Data";

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
	 * 
	 * @param radian rotation angle radian
	 * @param axis rotation axis, it is a normalized Vector3D instance
	 * @param pivotPoint the default value is null
	 */
	appendRotationPivot(radian: number, axis: Vector3D, pivotPoint?: Vector3D): void;
	appendRotation(radian: number, axis: Vector3D): void;
	appendRotationX(radian: number): void;
	appendRotationY(radian: number): void;
	appendRotationZ(radian: number): void;
	// 用欧拉角形式旋转(heading->pitch->bank) => (y->x->z)
	appendRotationEulerAngle(radianX: number, radianY: number, radianZ: number): void;

	setScaleXYZ(xScale: number, yScale: number, zScale: number): void;
	setRotationEulerAngle(radianX: number, radianY: number, radianZ: number): void;
	setRotationEulerAngle2(cosX: number, sinX: number, cosY: number, sinY: number, cosZ: number, sinZ: number): void;
	setTranslationXYZ(px: number, py: number, pz: number): void;
	setTranslation(v3: Vector3D): void;
	appendScaleXYZ(xScale: number, yScale: number, zScale: number): void;

	appendScaleXY(xScale: number, yScale: number): void;
	appendTranslationXYZ(px: number, py: number, pz: number): void;
	appendTranslation(v3: Vector3D): void;
	copyColumnFrom(column_index: number, v3: Vector3D): void;
	copyColumnTo(column_index: number, v3: Vector3D): void;
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
	copyRowFrom(row_index: number, v3: Vector3D): void;
	copyRowTo(row_index: number, v3: Vector3D): void;
	decompose(orientationStyle: number): Vector3D[];
	invert(): boolean;
	pointAt(pos: Vector3D, at: Vector3D, up: Vector3D): void;
	prepend(rhs: IMatrix4): void;
	prepend3x3(rhs: IMatrix4): void;
	prependRotationPivot(radian: number, axis: Vector3D, pivotPoint: Vector3D): void;
	prependRotation(radian: number, axis: Vector3D): void;
	prependRotationX(radian: number): void;
	prependRotationY(radian: number): void;
	prependRotationZ(radian: number): void;
	// 用欧拉角形式旋转(heading->pitch->bank) => (y->x->z)
	prependRotationEulerAngle(radianX: number, radianY: number, radianZ: number): void;
	prependScale(xScale: number, yScale: number, zScale: number): void;
	prependScaleXY(xScale: number, yScale: number): void;
	prependTranslationXYZ(px: number, py: number, pz: number): void;
	prependTranslation(v3: Vector3D): void;
	recompose(components: Vector3D[], orientationStyle: number): boolean;
	setThreeAxes(x_axis: Vector3D, y_axis: Vector3D, z_axis: Vector3D,): void;
	deltaTransformVector(v3: Vector3D): Vector3D;

	deltaTransformVectorSelf(v3: Vector3D): void;
	deltaTransformOutVector(v3: Vector3D, out_v3: Vector3D): void;
	transformVector(v3: Vector3D): Vector3D;
	transformOutVector(v3: Vector3D, out_v3: Vector3D): void;
	transformOutVector3(v3: Vector3D, out_v3: Vector3D): void;
	transformVector3Self(v3: Vector3D): void;
	transformVectorSelf(v3: Vector3D): void;
	transformVectors(float_vinArr: Float32Array | number[], vinLength: number, float_voutArr: Float32Array): void;
	transformVectorsSelf(float_vinArr: Float32Array | number[], vinLength: number): void;
	transformVectorsRangeSelf(float_vinArr: Float32Array | number[], begin: number, end: number): void;
	transpose(): void;
	interpolateTo(toMat: IMatrix4, float_percent: number): void;
	rotationX(radian: number): void;
	rotationY(radian: number): void;
	rotationZ(radian: number): void;
	

	transformPerspV4Self(v4: Vector3D): void;
	///////
	
	destroy(): void;
}

export { IMatrix4 }