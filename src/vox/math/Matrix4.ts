/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import MathConst from "../../vox/math/MathConst";
import Vector3D from "../../vox/math/Vector3D";
import {EulerOrder} from './EulerOrder';
import OrientationType from "../../vox/math/OrientationType";
import IMatrix4 from "../../vox/math/IMatrix4";
import { Euler } from "./Euler";
import { Quaternion } from "./Quaternion";
const _mx = new Vector3D();
const _my = new Vector3D();
const _mz = new Vector3D();
class Matrix4 implements IMatrix4 {
	private static s_InitData: Float32Array = new Float32Array([
		1.0, 0.0, 0.0, 0.0,
		0.0, 1.0, 0.0, 0.0,
		0.0, 0.0, 1.0, 0.0,
		0.0, 0.0, 0.0, 1.0
	]);
	private static m_v3: Vector3D = new Vector3D();
	private static s_uid: number = 0;
	private static s_isolatedUid: number = 0x4ffff;
	private m_uid: number = -1;
	private static s_tMat4: Matrix4 = new Matrix4();
	private m_index: number = 0;
	private m_fs32: Float32Array = null;
	private m_localFS32: Float32Array = null;
	constructor(pfs32: Float32Array = null, index: number = 0) {
		this.m_index = index;
		if (pfs32 != null) {
			this.m_uid = Matrix4.s_uid++;
			this.m_fs32 = pfs32;
			this.m_localFS32 = this.m_fs32.subarray(index, index + 16);
		}
		else {
			this.m_uid = Matrix4.s_isolatedUid++;
			this.m_fs32 = new Float32Array(16);
			this.m_fs32.set(Matrix4.s_InitData, 0);
			this.m_localFS32 = this.m_fs32;
		}
	}
	setData(data: number[]): void {
		if (data.length == 16) {
			this.m_localFS32.set(data);
		}
	}
	getCapacity(): number {
		return 16;
	}
	GetMaxUid(): number {
		return Matrix4.s_uid;
	}
	getUid(): number {
		return this.m_uid;
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
		this.m_localFS32.set(Matrix4.s_InitData, 0);
	}
	determinant(): number {
		let lfs = this.m_localFS32;
		return (lfs[0] * lfs[5] - lfs[4] * lfs[1])
			*
			(lfs[10] * lfs[15] - lfs[14] * lfs[11])
			-
			(lfs[0] * lfs[9] - lfs[8] * lfs[1])
			*
			(lfs[6] * lfs[15] - lfs[14] * lfs[7])
			+
			(lfs[0] * lfs[13] - lfs[12] * lfs[1])
			*
			(lfs[6] * lfs[11] - lfs[10] * lfs[7])
			+
			(lfs[4] * lfs[9] - lfs[8] * lfs[5])
			*
			(lfs[2] * lfs[15] - lfs[14] * lfs[3])
			-
			(lfs[4] * lfs[13] - lfs[12] * lfs[5])
			*
			(lfs[2] * lfs[11] - lfs[10] * lfs[3])
			+
			(lfs[8] * lfs[13] - lfs[12] * lfs[9])
			*
			(lfs[2] * lfs[7] - lfs[6] * lfs[3]);
	}
	
	multiplyMatrices( a: IMatrix4, b: IMatrix4 ): IMatrix4 {

		const ae = a.getLocalFS32();
		const be = b.getLocalFS32();
		const fs = this.getLocalFS32();

		const a11 = ae[ 0 ], a12 = ae[ 4 ], a13 = ae[ 8 ], a14 = ae[ 12 ];
		const a21 = ae[ 1 ], a22 = ae[ 5 ], a23 = ae[ 9 ], a24 = ae[ 13 ];
		const a31 = ae[ 2 ], a32 = ae[ 6 ], a33 = ae[ 10 ], a34 = ae[ 14 ];
		const a41 = ae[ 3 ], a42 = ae[ 7 ], a43 = ae[ 11 ], a44 = ae[ 15 ];

		const b11 = be[ 0 ], b12 = be[ 4 ], b13 = be[ 8 ], b14 = be[ 12 ];
		const b21 = be[ 1 ], b22 = be[ 5 ], b23 = be[ 9 ], b24 = be[ 13 ];
		const b31 = be[ 2 ], b32 = be[ 6 ], b33 = be[ 10 ], b34 = be[ 14 ];
		const b41 = be[ 3 ], b42 = be[ 7 ], b43 = be[ 11 ], b44 = be[ 15 ];

		fs[ 0 ] = a11 * b11 + a12 * b21 + a13 * b31 + a14 * b41;
		fs[ 4 ] = a11 * b12 + a12 * b22 + a13 * b32 + a14 * b42;
		fs[ 8 ] = a11 * b13 + a12 * b23 + a13 * b33 + a14 * b43;
		fs[ 12 ] = a11 * b14 + a12 * b24 + a13 * b34 + a14 * b44;

		fs[ 1 ] = a21 * b11 + a22 * b21 + a23 * b31 + a24 * b41;
		fs[ 5 ] = a21 * b12 + a22 * b22 + a23 * b32 + a24 * b42;
		fs[ 9 ] = a21 * b13 + a22 * b23 + a23 * b33 + a24 * b43;
		fs[ 13 ] = a21 * b14 + a22 * b24 + a23 * b34 + a24 * b44;

		fs[ 2 ] = a31 * b11 + a32 * b21 + a33 * b31 + a34 * b41;
		fs[ 6 ] = a31 * b12 + a32 * b22 + a33 * b32 + a34 * b42;
		fs[ 10 ] = a31 * b13 + a32 * b23 + a33 * b33 + a34 * b43;
		fs[ 14 ] = a31 * b14 + a32 * b24 + a33 * b34 + a34 * b44;

		fs[ 3 ] = a41 * b11 + a42 * b21 + a43 * b31 + a44 * b41;
		fs[ 7 ] = a41 * b12 + a42 * b22 + a43 * b32 + a44 * b42;
		fs[ 11 ] = a41 * b13 + a42 * b23 + a43 * b33 + a44 * b43;
		fs[ 15 ] = a41 * b14 + a42 * b24 + a43 * b34 + a44 * b44;

		return this;

	}
	multiply(ma: IMatrix4, mb: IMatrix4 = null): IMatrix4 {
		if(ma != null && mb != null) {
			return this.multiplyMatrices(ma, mb);
		} else if(ma != null) {
			return this.multiplyMatrices(this, ma);
		}
		return this;
	}
	
	premultiply(m: IMatrix4): IMatrix4 {
		if(m != this && m != null) {
			return this.multiplyMatrices(m, this);
		}
		return this;
	}

	append(lhs: IMatrix4): void {
		let lfs32: Float32Array = lhs.getLocalFS32();
		let fs: Float32Array = this.m_localFS32;

		let m111: number = fs[0];
		let m121: number = fs[4];
		let m131: number = fs[8];
		let m141: number = fs[12];
		let m112: number = fs[1];
		let m122: number = fs[5];
		let m132: number = fs[9];
		let m142: number = fs[13];
		let m113: number = fs[2];
		let m123: number = fs[6];
		let m133: number = fs[10];
		let m143: number = fs[14];
		let m114: number = fs[3];
		let m124: number = fs[7];
		let m134: number = fs[11];
		let m144: number = fs[15];
		let m211: number = lfs32[0];
		let m221: number = lfs32[4];
		let m231: number = lfs32[8];
		let m241: number = lfs32[12];
		let m212: number = lfs32[1];
		let m222: number = lfs32[5];
		let m232: number = lfs32[9];
		let m242: number = lfs32[13];
		let m213: number = lfs32[2];
		let m223: number = lfs32[6];
		let m233: number = lfs32[10];
		let m243: number = lfs32[14];
		let m214: number = lfs32[3];
		let m224: number = lfs32[7];
		let m234: number = lfs32[11];
		let m244: number = lfs32[15];

		fs[0] = m111 * m211 + m112 * m221 + m113 * m231 + m114 * m241;
		fs[1] = m111 * m212 + m112 * m222 + m113 * m232 + m114 * m242;
		fs[2] = m111 * m213 + m112 * m223 + m113 * m233 + m114 * m243;
		fs[3] = m111 * m214 + m112 * m224 + m113 * m234 + m114 * m244;
		fs[4] = m121 * m211 + m122 * m221 + m123 * m231 + m124 * m241;
		fs[5] = m121 * m212 + m122 * m222 + m123 * m232 + m124 * m242;
		fs[6] = m121 * m213 + m122 * m223 + m123 * m233 + m124 * m243;
		fs[7] = m121 * m214 + m122 * m224 + m123 * m234 + m124 * m244;
		fs[8] = m131 * m211 + m132 * m221 + m133 * m231 + m134 * m241;
		fs[9] = m131 * m212 + m132 * m222 + m133 * m232 + m134 * m242;
		fs[10] = m131 * m213 + m132 * m223 + m133 * m233 + m134 * m243;
		fs[11] = m131 * m214 + m132 * m224 + m133 * m234 + m134 * m244;
		fs[12] = m141 * m211 + m142 * m221 + m143 * m231 + m144 * m241;
		fs[13] = m141 * m212 + m142 * m222 + m143 * m232 + m144 * m242;
		fs[14] = m141 * m213 + m142 * m223 + m143 * m233 + m144 * m243;
		fs[15] = m141 * m214 + m142 * m224 + m143 * m234 + m144 * m244;
	}
	append3x3(lhs: Matrix4): void {
		let lfs32: Float32Array = lhs.getLocalFS32();
		let fs: Float32Array = this.m_localFS32;

		let m111: number = fs[0];
		let m121: number = fs[4];
		let m131: number = fs[8];
		let m112: number = fs[1];
		let m122: number = fs[5];
		let m132: number = fs[9];
		let m113: number = fs[2];
		let m123: number = fs[6];
		let m133: number = fs[10];
		let m211: number = lfs32[0];
		let m221: number = lfs32[4];
		let m231: number = lfs32[8];
		let m212: number = lfs32[1];
		let m222: number = lfs32[5];
		let m232: number = lfs32[9];
		let m213: number = lfs32[2];
		let m223: number = lfs32[6];
		let m233: number = lfs32[10];
		fs[0] = m111 * m211 + m112 * m221 + m113 * m231;
		fs[1] = m111 * m212 + m112 * m222 + m113 * m232;
		fs[2] = m111 * m213 + m112 * m223 + m113 * m233;
		fs[4] = m121 * m211 + m122 * m221 + m123 * m231;
		fs[5] = m121 * m212 + m122 * m222 + m123 * m232;
		fs[6] = m121 * m213 + m122 * m223 + m123 * m233;
		fs[8] = m131 * m211 + m132 * m221 + m133 * m231;
		fs[9] = m131 * m212 + m132 * m222 + m133 * m232;
		fs[10] = m131 * m213 + m132 * m223 + m133 * m233;
	}
	appendRotationPivot(radian: number, axis: Vector3D, pivotPoint: Vector3D = null): void {
		if (pivotPoint == null) {
			pivotPoint = Vector3D.Z_AXIS;
		}
		Matrix4.s_tMat4.identity();
		Matrix4.s_tMat4.getAxisRotation(axis.x, axis.y, axis.z, radian);
		Matrix4.s_tMat4.appendTranslationXYZ(pivotPoint.x, pivotPoint.y, pivotPoint.z);
		this.append(Matrix4.s_tMat4);
	}
	appendRotation(radian: number, axis: Vector3D): void {
		Matrix4.s_tMat4.identity();
		Matrix4.s_tMat4.getAxisRotation(axis.x, axis.y, axis.z, radian);
		this.append(Matrix4.s_tMat4);
	}
	appendRotationX(radian: number): void {
		Matrix4.s_tMat4.rotationX(radian);
		this.append3x3(Matrix4.s_tMat4);
	}
	appendRotationY(radian: number): void {
		Matrix4.s_tMat4.rotationY(radian);
		this.append3x3(Matrix4.s_tMat4);
	}
	appendRotationZ(radian: number): void {
		Matrix4.s_tMat4.rotationZ(radian);
		this.append3x3(Matrix4.s_tMat4);
	}
	// 用欧拉角形式旋转(heading->pitch->bank) => (y->x->z)
	appendRotationEulerAngle(radianX: number, radianY: number, radianZ: number): void {
		Matrix4.s_tMat4.rotationY(radianY);
		this.append3x3(Matrix4.s_tMat4);
		Matrix4.s_tMat4.rotationX(radianX);
		this.append3x3(Matrix4.s_tMat4);
		Matrix4.s_tMat4.rotationZ(radianZ);
		this.append3x3(Matrix4.s_tMat4);
	}

	setScale(v3: Vector3D): Matrix4 {
		let fs: Float32Array = this.m_localFS32;
		fs[0] = v3.x; fs[5] = v3.y; fs[10] = v3.z;
		return this;
	}
	setScaleXYZ(xScale: number, yScale: number, zScale: number): void {
		let fs: Float32Array = this.m_localFS32;
		fs[0] = xScale; fs[5] = yScale; fs[10] = zScale;
	}
	getScale(outV3: Vector3D): void {
		let fs: Float32Array = this.m_localFS32;
		outV3.x = fs[0]
		outV3.y = fs[5];
		outV3.z = fs[10];
	}
	setRotationEulerAngle(radianX: number, radianY: number, radianZ: number): void {
		let fs: Float32Array = this.m_localFS32;
		//let sx:number = fs[0];
		//let sy:number = fs[5];
		//let sz:number = fs[10];

		let cosX: number = Math.cos(radianX);
		let sinX: number = Math.sin(radianX);
		let cosY: number = Math.cos(radianY);
		let sinY: number = Math.sin(radianY);
		let cosZ: number = Math.cos(radianZ);
		let sinZ: number = Math.sin(radianZ);
		let cosZsinY: number = cosZ * sinY;
		let sinZsinY: number = sinZ * sinY;
		let cosYscaleX: number = cosY * fs[0];
		let sinXscaleY: number = sinX * fs[5];
		let cosXscaleY: number = cosX * fs[5];
		let cosXscaleZ: number = cosX * fs[10];
		let sinXscaleZ: number = sinX * fs[10];

		fs[1] = sinZ * cosYscaleX;
		fs[2] = -sinY * fs[0];
		fs[0] = cosZ * cosYscaleX;
		fs[4] = cosZsinY * sinXscaleY - sinZ * cosXscaleY;
		fs[8] = cosZsinY * cosXscaleZ + sinZ * sinXscaleZ;
		fs[5] = sinZsinY * sinXscaleY + cosZ * cosXscaleY;
		fs[9] = sinZsinY * cosXscaleZ - cosZ * sinXscaleZ;
		fs[6] = cosY * sinXscaleY;
		fs[10] = cosY * cosXscaleZ;
	}

	setRotationEulerAngle2(cosX: number, sinX: number, cosY: number, sinY: number, cosZ: number, sinZ: number): void {
		let fs: Float32Array = this.m_localFS32;
		//let sx:number = fs[0];
		//let sy:number = fs[5];
		//let sz:number = fs[10];

		//	let cosX: number = Math.cos(radianX);
		//	let sinX:number = Math.sin(radianX);
		//	let cosY:number = Math.cos(radianY);
		//	let sinY:number = Math.sin(radianY);
		//	let cosZ:number = Math.cos(radianZ);
		//	let sinZ:number = Math.sin(radianZ);
		let cosZsinY: number = cosZ * sinY;
		let sinZsinY: number = sinZ * sinY;
		let cosYscaleX: number = cosY * fs[0];
		let sinXscaleY: number = sinX * fs[5];
		let cosXscaleY: number = cosX * fs[5];
		let cosXscaleZ: number = cosX * fs[10];
		let sinXscaleZ: number = sinX * fs[10];

		fs[1] = sinZ * cosYscaleX;
		fs[2] = -sinY * fs[0];
		fs[0] = cosZ * cosYscaleX;
		fs[4] = cosZsinY * sinXscaleY - sinZ * cosXscaleY;
		fs[8] = cosZsinY * cosXscaleZ + sinZ * sinXscaleZ;
		fs[5] = sinZsinY * sinXscaleY + cosZ * cosXscaleY;
		fs[9] = sinZsinY * cosXscaleZ - cosZ * sinXscaleZ;
		fs[6] = cosY * sinXscaleY;
		fs[10] = cosY * cosXscaleZ;
	}
	
	compose( position: Vector3D, quaternion: Quaternion, scale: Vector3D ): Matrix4 {

		const fs = this.m_localFS32;

		const x = quaternion.x, y = quaternion.y, z = quaternion.z, w = quaternion.w;

		const x2 = x + x,	y2 = y + y, z2 = z + z;
		const xx = x * x2, xy = x * y2, xz = x * z2;
		const yy = y * y2, yz = y * z2, zz = z * z2;
		const wx = w * x2, wy = w * y2, wz = w * z2;

		const sx = scale.x, sy = scale.y, sz = scale.z;

		fs[ 0 ] = ( 1 - ( yy + zz ) ) * sx;
		fs[ 1 ] = ( xy + wz ) * sx;
		fs[ 2 ] = ( xz - wy ) * sx;
		fs[ 3 ] = 0;

		fs[ 4 ] = ( xy - wz ) * sy;
		fs[ 5 ] = ( 1 - ( xx + zz ) ) * sy;
		fs[ 6 ] = ( yz + wx ) * sy;
		fs[ 7 ] = 0;

		fs[ 8 ] = ( xz + wy ) * sz;
		fs[ 9 ] = ( yz - wx ) * sz;
		fs[ 10 ] = ( 1 - ( xx + yy ) ) * sz;
		fs[ 11 ] = 0;

		fs[ 12 ] = position.x;
		fs[ 13 ] = position.y;
		fs[ 14 ] = position.z;
		fs[ 15 ] = 1;

		return this;

	}
	makeRotationFromQuaternion( q: Quaternion ): Matrix4 {

		return this.compose( Vector3D.ZERO, q, Vector3D.ONE );

	}
	makeRotationFromEuler( euler: Euler ): Matrix4 {

		if ( euler == null ) {

			console.error( 'Matrix4::makeRotationFromEuler() now expects a Euler rotation rather than a Vector3D and order.' );

		}

		const fs = this.m_localFS32;
		
		const x = euler.x, y = euler.y, z = euler.z;
		const a = Math.cos( x ), b = Math.sin( x );
		const c = Math.cos( y ), d = Math.sin( y );
		const e = Math.cos( z ), f = Math.sin( z );

		if ( euler.order === EulerOrder.XYZ ) {

			const ae = a * e, af = a * f, be = b * e, bf = b * f;

			fs[ 0 ] = c * e;
			fs[ 4 ] = - c * f;
			fs[ 8 ] = d;

			fs[ 1 ] = af + be * d;
			fs[ 5 ] = ae - bf * d;
			fs[ 9 ] = - b * c;

			fs[ 2 ] = bf - ae * d;
			fs[ 6 ] = be + af * d;
			fs[ 10 ] = a * c;

		} else if ( euler.order === EulerOrder.YXZ ) {

			const ce = c * e, cf = c * f, de = d * e, df = d * f;

			fs[ 0 ] = ce + df * b;
			fs[ 4 ] = de * b - cf;
			fs[ 8 ] = a * d;

			fs[ 1 ] = a * f;
			fs[ 5 ] = a * e;
			fs[ 9 ] = - b;

			fs[ 2 ] = cf * b - de;
			fs[ 6 ] = df + ce * b;
			fs[ 10 ] = a * c;

		} else if ( euler.order === EulerOrder.ZXY ) {

			const ce = c * e, cf = c * f, de = d * e, df = d * f;

			fs[ 0 ] = ce - df * b;
			fs[ 4 ] = - a * f;
			fs[ 8 ] = de + cf * b;

			fs[ 1 ] = cf + de * b;
			fs[ 5 ] = a * e;
			fs[ 9 ] = df - ce * b;

			fs[ 2 ] = - a * d;
			fs[ 6 ] = b;
			fs[ 10 ] = a * c;

		} else if ( euler.order === EulerOrder.ZYX ) {

			const ae = a * e, af = a * f, be = b * e, bf = b * f;

			fs[ 0 ] = c * e;
			fs[ 4 ] = be * d - af;
			fs[ 8 ] = ae * d + bf;

			fs[ 1 ] = c * f;
			fs[ 5 ] = bf * d + ae;
			fs[ 9 ] = af * d - be;

			fs[ 2 ] = - d;
			fs[ 6 ] = b * c;
			fs[ 10 ] = a * c;

		} else if ( euler.order === EulerOrder.YZX ) {

			const ac = a * c, ad = a * d, bc = b * c, bd = b * d;

			fs[ 0 ] = c * e;
			fs[ 4 ] = bd - ac * f;
			fs[ 8 ] = bc * f + ad;

			fs[ 1 ] = f;
			fs[ 5 ] = a * e;
			fs[ 9 ] = - b * e;

			fs[ 2 ] = - d * e;
			fs[ 6 ] = ad * f + bc;
			fs[ 10 ] = ac - bd * f;

		} else if ( euler.order === EulerOrder.XZY ) {

			const ac = a * c, ad = a * d, bc = b * c, bd = b * d;

			fs[ 0 ] = c * e;
			fs[ 4 ] = - f;
			fs[ 8 ] = d * e;

			fs[ 1 ] = ac * f + bd;
			fs[ 5 ] = a * e;
			fs[ 9 ] = ad * f - bc;

			fs[ 2 ] = bc * f - ad;
			fs[ 6 ] = b * e;
			fs[ 10 ] = bd * f + ac;

		}

		// reset bottom row
		fs[ 3 ] = 0;
		fs[ 7 ] = 0;
		fs[ 11 ] = 0;

		// reset last column
		fs[ 12 ] = 0;
		fs[ 13 ] = 0;
		fs[ 14 ] = 0;
		fs[ 15 ] = 1;

		return this;

	}
	
	extractRotation( m: Matrix4 ): Matrix4 {

		// this method does not support reflection matrices

		const fs = this.m_localFS32;
		const me = m.getLocalFS32();
		const v3 = Matrix4.m_v3;
		m.copyColumnTo(0, v3);
		const scaleX = 1.0 / v3.getLength();
		m.copyColumnTo(1, v3);
		const scaleY = 1.0 / v3.getLength();
		m.copyColumnTo(2, v3);
		const scaleZ = 1.0 / v3.getLength();

		fs[ 0 ] = me[ 0 ] * scaleX;
		fs[ 1 ] = me[ 1 ] * scaleX;
		fs[ 2 ] = me[ 2 ] * scaleX;
		fs[ 3 ] = 0;

		fs[ 4 ] = me[ 4 ] * scaleY;
		fs[ 5 ] = me[ 5 ] * scaleY;
		fs[ 6 ] = me[ 6 ] * scaleY;
		fs[ 7 ] = 0;

		fs[ 8 ] = me[ 8 ] * scaleZ;
		fs[ 9 ] = me[ 9 ] * scaleZ;
		fs[ 10 ] = me[ 10 ] * scaleZ;
		fs[ 11 ] = 0;

		fs[ 12 ] = 0;
		fs[ 13 ] = 0;
		fs[ 14 ] = 0;
		fs[ 15 ] = 1;

		return this;

	}

	copyTranslation( m: IMatrix4 ): IMatrix4 {

		const fs = this.m_localFS32, me = m.getLocalFS32();

		fs[ 12 ] = me[ 12 ];
		fs[ 13 ] = me[ 13 ];
		fs[ 14 ] = me[ 14 ];

		return this;

	}
	setTranslationXYZ(px: number, py: number, pz: number): void {
		this.m_localFS32[12] = px;
		this.m_localFS32[13] = py;
		this.m_localFS32[14] = pz;
	}
	setTranslation(v3: Vector3D): void {
		this.m_localFS32[12] = v3.x;
		this.m_localFS32[13] = v3.y;
		this.m_localFS32[14] = v3.z;
	}
	appendScaleXYZ(xScale: number, yScale: number, zScale: number): void {
		const fs = this.m_localFS32;
		fs[0] *= xScale; fs[1] *= xScale; fs[2] *= xScale; fs[3] *= xScale;
		fs[4] *= yScale; fs[5] *= yScale; fs[6] *= yScale; fs[7] *= yScale;
		fs[8] *= zScale; fs[9] *= zScale; fs[10] *= zScale; fs[11] *= zScale;
	}

	appendScaleXY(xScale: number, yScale: number): void {
		const fs = this.m_localFS32;
		fs[0] *= xScale; fs[1] *= xScale; fs[2] *= xScale; fs[3] *= xScale;
		fs[4] *= yScale; fs[5] *= yScale; fs[6] *= yScale; fs[7] *= yScale;
	}
	appendTranslationXYZ(px: number, py: number, pz: number): void {
		this.m_localFS32[12] += px;
		this.m_localFS32[13] += py;
		this.m_localFS32[14] += pz;
	}
	appendTranslation(v3: Vector3D): void {
		this.m_localFS32[12] += v3.x;
		this.m_localFS32[13] += v3.y;
		this.m_localFS32[14] += v3.z;
	}
	copyColumnFrom(column_index: number, v3: Vector3D): void {
		const fs = this.m_localFS32;
		switch (column_index) {
			case 0:
				{
					fs[0] = v3.x;
					fs[1] = v3.y;
					fs[2] = v3.z;
					fs[3] = v3.w;
				}
				break;
			case 1:
				{
					fs[4] = v3.x;
					fs[5] = v3.y;
					fs[6] = v3.z;
					fs[7] = v3.w;
				}
				break;
			case 2:
				{
					fs[8] = v3.x;
					fs[9] = v3.y;
					fs[10] = v3.z;
					fs[11] = v3.w;
				}
				break;
			case 3:
				{
					fs[12] = v3.x;
					fs[13] = v3.y;
					fs[14] = v3.z;
					fs[15] = v3.w;
				}
				break;
			default:
				break;
		}
	}
	copyColumnTo(column_index: number, outV3: Vector3D): void {
		const fs = this.m_localFS32;
		column_index <<= 2;
		outV3.x = fs[column_index];
		outV3.y = fs[1 + column_index];
		outV3.z = fs[2 + column_index];
		outV3.w = fs[3 + column_index];
	}
	setF32ArrAndIndex(fs32Arr: Float32Array, index: number = 0): void {
		if (fs32Arr != null && index >= 0) {
			this.m_fs32 = fs32Arr;
			this.m_index = index;
			this.m_localFS32 = this.m_fs32.subarray(index, index + 16);
		}
	}
	setF32ArrIndex(index: number = 0): void {
		if (index >= 0) {
			this.m_index = index;
			this.m_localFS32 = this.m_fs32.subarray(index, index + 16);
		}
	}
	setF32Arr(fs32Arr: Float32Array): void {
		if (fs32Arr != null) {
			this.m_fs32 = fs32Arr;
		}
	}
	copyFromF32Arr(fs32Arr: Float32Array, index: number = 0): void {
		//let subArr:Float32Array = fs32Arr.subarray(index, index + 16);
		//this.m_localFS32.set(fs32Arr.subarray(index, index + 16), 0);
		let i: number = 0;
		for (let end: number = index + 16; index < end; index++) {
			this.m_localFS32[i] = fs32Arr[index];
			++i;
		}
	}
	copyToF32Arr(fs32Arr: Float32Array, index: number = 0): void {
		fs32Arr.set(this.m_localFS32, index);
	}
	copy(smat: IMatrix4): IMatrix4 {
		this.m_localFS32.set(smat.getLocalFS32(), 0);
		return this;
	}
	copyFrom(smat: IMatrix4): void {
		this.m_localFS32.set(smat.getLocalFS32(), 0);
	}
	copyTo(dmat: IMatrix4): void {
		//dmat.copyFrom(this);
		dmat.getLocalFS32().set(this.getLocalFS32(), 0);
	}
	copyRawDataFrom(float_rawDataArr: Float32Array, rawDataLength: number = 16, index: number = 0, bool_tp: Boolean = false): void {
		if (bool_tp) this.transpose();
		rawDataLength = rawDataLength - index;
		let c: number = 0;
		while (c < rawDataLength) {
			this.m_fs32[this.m_index + c] = float_rawDataArr[c + index];
			++c;
		}
		if (bool_tp) this.transpose();
	}
	copyRawDataTo(float_rawDataArr: Float32Array, rawDataLength: number = 16, index: number = 0, bool_tp: boolean = false): void {
		if (bool_tp) this.transpose();
		let c: number = 0;
		while (c < rawDataLength) {
			float_rawDataArr[c + index] = this.m_fs32[this.m_index + c];
			++c;
		}
		if (bool_tp) this.transpose();
	}
	copyRowFrom(row_index: number, v3: Vector3D): void {
		const fs = this.m_localFS32;
		switch (row_index) {
			case 0:
				{
					fs[0] = v3.x;
					fs[4] = v3.y;
					fs[8] = v3.z;
					fs[12] = v3.w;
				}
				break;
			case 1:
				{
					fs[1] = v3.x;
					fs[5] = v3.y;
					fs[9] = v3.z;
					fs[13] = v3.w;
				}
				break;
			case 2:
				{
					fs[2] = v3.x;
					fs[6] = v3.y;
					fs[10] = v3.z;
					fs[14] = v3.w;
				}
				break;
			case 3:
				{
					fs[3] = v3.x;
					fs[7] = v3.y;
					fs[11] = v3.z;
					fs[15] = v3.w;
				}
				break;
			default:
				break;
		}
	}
	copyRowTo(row_index: number, v3: Vector3D): void {
		const fs = this.m_localFS32;
		v3.x = fs[row_index];
		v3.y = fs[4 + row_index];
		v3.z = fs[8 + row_index];
		v3.w = fs[12 + row_index];
	}
	decompose(orientationStyle: number): Vector3D[] {
		// TODO: optimize after 4 lines
		let vec = [];
		let mr = Matrix4.s_tMat4;
		let rfs = mr.getLocalFS32();
		//let mrfsI = mr.getFSIndex();
		//std::memcpy(&mr, m_rawData, m_rawDataSize);
		mr.copyFrom(this);
		///*
		let pos = new Vector3D(rfs[12], rfs[13], rfs[14]);
		let scale = new Vector3D();
		scale.x = Math.sqrt(rfs[0] * rfs[0] + rfs[1] * rfs[1] + rfs[2] * rfs[2]);
		scale.y = Math.sqrt(rfs[4] * rfs[4] + rfs[5] * rfs[5] + rfs[6] * rfs[6]);
		scale.z = Math.sqrt(rfs[8] * rfs[8] + rfs[9] * rfs[9] + rfs[10] * rfs[10]);
		if (rfs[0] * (rfs[5] * rfs[10] - rfs[6] * rfs[9]) - rfs[1] * (rfs[4] * rfs[10] - rfs[6] * rfs[8]) + rfs[2] * (rfs[4] * rfs[9] - rfs[5] * rfs[8]) < 0) scale.z = -scale.z;
		rfs[0] /= scale.x;
		rfs[1] /= scale.x;
		rfs[2] /= scale.x;
		rfs[4] /= scale.y;
		rfs[5] /= scale.y;
		rfs[6] /= scale.y;
		rfs[8] /= scale.z;
		rfs[9] /= scale.z;
		rfs[10] /= scale.z;
		let rot = new Vector3D();
		switch (orientationStyle) {
			case OrientationType.AXIS_ANGLE:
				{
					rot.w = MathConst.SafeACos((rfs[0] + rfs[5] + rfs[10] - 1) / 2);
					let len = Math.sqrt((rfs[6] - rfs[9]) * (rfs[6] - rfs[9]) + (rfs[8] - rfs[2]) * (rfs[8] - rfs[2]) + (rfs[1] - rfs[4]) * (rfs[1] - rfs[4]));
					if (len > MathConst.MATH_MIN_POSITIVE) {
						rot.x = (rfs[6] - rfs[9]) / len;
						rot.y = (rfs[8] - rfs[2]) / len;
						rot.z = (rfs[1] - rfs[4]) / len;
					}
					else rot.x = rot.y = rot.z = 0;
				}
				break;
			case OrientationType.QUATERNION:
				{
					let tr = (rfs[0] + rfs[5] + rfs[10]);
					if (tr > 0) {
						rot.w = Math.sqrt(1 + tr) / 2;
						rot.x = (rfs[6] - rfs[9]) / (4 * rot.w);
						rot.y = (rfs[8] - rfs[2]) / (4 * rot.w);
						rot.z = (rfs[1] - rfs[4]) / (4 * rot.w);
					}
					else if (rfs[0] > rfs[5] && rfs[0] > rfs[10]) {
						rot.x = Math.sqrt(1 + rfs[0] - rfs[5] - rfs[10]) / 2;
						rot.w = (rfs[6] - rfs[9]) / (4 * rot.x);
						rot.y = (rfs[1] + rfs[4]) / (4 * rot.x);
						rot.z = (rfs[8] + rfs[2]) / (4 * rot.x);
					}
					else if (rfs[5] > rfs[10]) {
						rot.y = Math.sqrt(1 + rfs[5] - rfs[0] - rfs[10]) / 2;
						rot.x = (rfs[1] + rfs[4]) / (4 * rot.y);
						rot.w = (rfs[8] - rfs[2]) / (4 * rot.y);
						rot.z = (rfs[6] + rfs[9]) / (4 * rot.y);
					}
					else {
						rot.z = Math.sqrt(1 + rfs[10] - rfs[0] - rfs[5]) / 2;
						rot.x = (rfs[8] + rfs[2]) / (4 * rot.z);
						rot.y = (rfs[6] + rfs[9]) / (4 * rot.z);
						rot.w = (rfs[1] - rfs[4]) / (4 * rot.z);
					}
				}
				break;
			case OrientationType.EULER_ANGLES:
				{
					rot.y = Math.asin(-rfs[2]);
					if (rfs[2] != 1 && rfs[2] != -1) {
						rot.x = Math.atan2(rfs[6], rfs[10]);
						rot.z = Math.atan2(rfs[1], rfs[0]);
					}
					else {
						rot.z = 0;
						rot.x = Math.atan2(rfs[4], rfs[5]);
					}
				}
				break;
			default:
				break;
		};
		vec.push(pos);
		vec.push(rot);
		vec.push(scale);
		mr = null;
		return vec;
	}
	invert(): boolean {
		let d: number = this.determinant();
		let invertable = Math.abs(d) > MathConst.MATH_MIN_POSITIVE;
		if (invertable) {
			let fs: Float32Array = this.m_localFS32;
			d = 1.0 / d;
			let m11: number = fs[0];
			let m21: number = fs[4];
			let m31: number = fs[8];
			let m41: number = fs[12];
			let m12: number = fs[1];
			let m22: number = fs[5];
			let m32: number = fs[9];
			let m42: number = fs[13];
			let m13: number = fs[2];
			let m23: number = fs[6];
			let m33: number = fs[10];
			let m43: number = fs[14];
			let m14: number = fs[3];
			let m24: number = fs[7];
			let m34: number = fs[11];
			let m44: number = fs[15];
			fs[0] = d * (m22 * (m33 * m44 - m43 * m34) - m32 * (m23 * m44 - m43 * m24) + m42 * (m23 * m34 - m33 * m24));
			fs[1] = -d * (m12 * (m33 * m44 - m43 * m34) - m32 * (m13 * m44 - m43 * m14) + m42 * (m13 * m34 - m33 * m14));
			fs[2] = d * (m12 * (m23 * m44 - m43 * m24) - m22 * (m13 * m44 - m43 * m14) + m42 * (m13 * m24 - m23 * m14));
			fs[3] = -d * (m12 * (m23 * m34 - m33 * m24) - m22 * (m13 * m34 - m33 * m14) + m32 * (m13 * m24 - m23 * m14));
			fs[4] = -d * (m21 * (m33 * m44 - m43 * m34) - m31 * (m23 * m44 - m43 * m24) + m41 * (m23 * m34 - m33 * m24));
			fs[5] = d * (m11 * (m33 * m44 - m43 * m34) - m31 * (m13 * m44 - m43 * m14) + m41 * (m13 * m34 - m33 * m14));
			fs[6] = -d * (m11 * (m23 * m44 - m43 * m24) - m21 * (m13 * m44 - m43 * m14) + m41 * (m13 * m24 - m23 * m14));
			fs[7] = d * (m11 * (m23 * m34 - m33 * m24) - m21 * (m13 * m34 - m33 * m14) + m31 * (m13 * m24 - m23 * m14));
			fs[8] = d * (m21 * (m32 * m44 - m42 * m34) - m31 * (m22 * m44 - m42 * m24) + m41 * (m22 * m34 - m32 * m24));
			fs[9] = -d * (m11 * (m32 * m44 - m42 * m34) - m31 * (m12 * m44 - m42 * m14) + m41 * (m12 * m34 - m32 * m14));
			fs[10] = d * (m11 * (m22 * m44 - m42 * m24) - m21 * (m12 * m44 - m42 * m14) + m41 * (m12 * m24 - m22 * m14));
			fs[11] = -d * (m11 * (m22 * m34 - m32 * m24) - m21 * (m12 * m34 - m32 * m14) + m31 * (m12 * m24 - m22 * m14));
			fs[12] = -d * (m21 * (m32 * m43 - m42 * m33) - m31 * (m22 * m43 - m42 * m23) + m41 * (m22 * m33 - m32 * m23));
			fs[13] = d * (m11 * (m32 * m43 - m42 * m33) - m31 * (m12 * m43 - m42 * m13) + m41 * (m12 * m33 - m32 * m13));
			fs[14] = -d * (m11 * (m22 * m43 - m42 * m23) - m21 * (m12 * m43 - m42 * m13) + m41 * (m12 * m23 - m22 * m13));
			fs[15] = d * (m11 * (m22 * m33 - m32 * m23) - m21 * (m12 * m33 - m32 * m13) + m31 * (m12 * m23 - m22 * m13));
		};
		return invertable;
	}
	invertThis(): Matrix4 {
		this.invert();
		return this;
	}
	pointAt(pos: Vector3D, at: Vector3D, up: Vector3D): void {

		//TODO: need optimize
		if (at == null) at = new Vector3D(0.0, 0.0, -1.0);
		if (up == null) up = new Vector3D(0.0, -1.0, 0.0);
		let dir = at.subtract(pos);
		let vup = up.clone();
		//Vector3D right;
		dir.normalize();
		vup.normalize();
		let dir2 = dir.clone().scaleBy(vup.dot(dir));
		
		vup.subtractBy(dir2);
		if (vup.getLength() > MathConst.MATH_MIN_POSITIVE) vup.normalize();
		else if (dir.x != 0) vup.setTo(-dir.y, dir.x, 0);
		else vup.setTo(1, 0, 0);
		let right = vup.crossProduct(dir);
		right.normalize();
		let fs = this.m_localFS32;
		fs[0] = right.x;
		fs[4] = right.y;
		fs[8] = right.z;
		fs[12] = 0.0;
		fs[1] = vup.x;
		fs[5] = vup.y;
		fs[9] = vup.z;
		fs[13] = 0.0;
		fs[2] = dir.x;
		fs[6] = dir.y;
		fs[10] = dir.z;
		fs[14] = 0.0;
		fs[3] = pos.x;
		fs[7] = pos.y;
		fs[11] = pos.z;
		fs[15] = 1.0;
	}
	prepend(rhs: IMatrix4): void {
		let rfs32: Float32Array = rhs.getLocalFS32();
		let fs: Float32Array = this.m_localFS32;
		let m111 = rfs32[0];
		let m121 = rfs32[4];
		let m131 = rfs32[8];
		let m141 = rfs32[12];
		let m112 = rfs32[1];
		let m122 = rfs32[5];
		let m132 = rfs32[9];
		let m142 = rfs32[13];
		let m113 = rfs32[2];
		let m123 = rfs32[6];
		let m133 = rfs32[10];
		let m143 = rfs32[14];
		let m114 = rfs32[3];
		let m124 = rfs32[7];
		let m134 = rfs32[11];
		let m144 = rfs32[15];
		let m211 = fs[0];
		let m221 = fs[4];
		let m231 = fs[8];
		let m241 = fs[12];
		let m212 = fs[1];
		let m222 = fs[5];
		let m232 = fs[9];
		let m242 = fs[13];
		let m213 = fs[2];
		let m223 = fs[6];
		let m233 = fs[10];
		let m243 = fs[14];
		let m214 = fs[3];
		let m224 = fs[7];
		let m234 = fs[11];
		let m244 = fs[15];
		fs[0] = m111 * m211 + m112 * m221 + m113 * m231 + m114 * m241;
		fs[1] = m111 * m212 + m112 * m222 + m113 * m232 + m114 * m242;
		fs[2] = m111 * m213 + m112 * m223 + m113 * m233 + m114 * m243;
		fs[3] = m111 * m214 + m112 * m224 + m113 * m234 + m114 * m244;
		fs[4] = m121 * m211 + m122 * m221 + m123 * m231 + m124 * m241;
		fs[5] = m121 * m212 + m122 * m222 + m123 * m232 + m124 * m242;
		fs[6] = m121 * m213 + m122 * m223 + m123 * m233 + m124 * m243;
		fs[7] = m121 * m214 + m122 * m224 + m123 * m234 + m124 * m244;
		fs[8] = m131 * m211 + m132 * m221 + m133 * m231 + m134 * m241;
		fs[9] = m131 * m212 + m132 * m222 + m133 * m232 + m134 * m242;
		fs[10] = m131 * m213 + m132 * m223 + m133 * m233 + m134 * m243;
		fs[11] = m131 * m214 + m132 * m224 + m133 * m234 + m134 * m244;
		fs[12] = m141 * m211 + m142 * m221 + m143 * m231 + m144 * m241;
		fs[13] = m141 * m212 + m142 * m222 + m143 * m232 + m144 * m242;
		fs[14] = m141 * m213 + m142 * m223 + m143 * m233 + m144 * m243;
		fs[15] = m141 * m214 + m142 * m224 + m143 * m234 + m144 * m244;
	}
	prepend3x3(rhs: IMatrix4): void {
		let rfs32: Float32Array = rhs.getLocalFS32();
		let fs: Float32Array = this.m_localFS32;
		let m111 = rfs32[0];
		let m121 = rfs32[4];
		let m131 = rfs32[8];
		let m112 = rfs32[1];
		let m122 = rfs32[5];
		let m132 = rfs32[9];
		let m113 = rfs32[2];
		let m123 = rfs32[6];
		let m133 = rfs32[10];
		let m211 = fs[0];
		let m221 = fs[4];
		let m231 = fs[8];
		let m212 = fs[1];
		let m222 = fs[5];
		let m232 = fs[9];
		let m213 = fs[2];
		let m223 = fs[6];
		let m233 = fs[10];
		fs[0] = m111 * m211 + m112 * m221 + m113 * m231;
		fs[1] = m111 * m212 + m112 * m222 + m113 * m232;
		fs[2] = m111 * m213 + m112 * m223 + m113 * m233;
		fs[4] = m121 * m211 + m122 * m221 + m123 * m231;
		fs[5] = m121 * m212 + m122 * m222 + m123 * m232;
		fs[6] = m121 * m213 + m122 * m223 + m123 * m233;
		fs[8] = m131 * m211 + m132 * m221 + m133 * m231;
		fs[9] = m131 * m212 + m132 * m222 + m133 * m232;
		fs[10] = m131 * m213 + m132 * m223 + m133 * m233;
	}
	prependRotationPivot(radian: number, axis: Vector3D, pivotPoint: Vector3D): void {
		Matrix4.s_tMat4.identity();
		Matrix4.s_tMat4.getAxisRotation(axis.x, axis.y, axis.z, radian);
		Matrix4.s_tMat4.appendTranslationXYZ(pivotPoint.x, pivotPoint.y, pivotPoint.z);
		this.prepend(Matrix4.s_tMat4);
	}
	prependRotation(radian: number, axis: Vector3D): void {
		Matrix4.s_tMat4.identity();
		Matrix4.s_tMat4.getAxisRotation(axis.x, axis.y, axis.z, radian);
		this.prepend(Matrix4.s_tMat4);
	}
	prependRotationX(radian: number): void {
		//s_tempMat.identity();
		Matrix4.s_tMat4.rotationX(radian);
		this.prepend3x3(Matrix4.s_tMat4);
	}
	prependRotationY(radian: number): void {
		//s_tempMat.identity();
		Matrix4.s_tMat4.rotationY(radian);
		this.prepend3x3(Matrix4.s_tMat4);
	}
	prependRotationZ(radian: number): void {
		//s_tempMat.identity();
		Matrix4.s_tMat4.rotationZ(radian);
		this.prepend3x3(Matrix4.s_tMat4);
	}
	// 用欧拉角形式旋转(heading->pitch->bank) => (y->x->z)
	prependRotationEulerAngle(radianX: number, radianY: number, radianZ: number): void {
		//s_tempMat.identity();
		Matrix4.s_tMat4.rotationY(radianY);
		this.prepend3x3(Matrix4.s_tMat4);
		//s_tempMat.identity();
		Matrix4.s_tMat4.rotationX(radianX);
		this.prepend3x3(Matrix4.s_tMat4);
		//s_tempMat.identity();
		Matrix4.s_tMat4.rotationZ(radianZ);
		this.prepend3x3(Matrix4.s_tMat4);
	}
	prependScale(xScale: number, yScale: number, zScale: number): void {
		const fs = this.m_localFS32;
		fs[0] *= xScale; fs[1] *= yScale; fs[2] *= zScale;
		fs[4] *= xScale; fs[5] *= yScale; fs[6] *= zScale;
		fs[8] *= xScale; fs[9] *= yScale; fs[10] *= zScale;
		fs[12] *= xScale; fs[13] *= yScale; fs[14] *= zScale;
	}
	prependScaleXY(xScale: number, yScale: number): void {
		const fs = this.m_localFS32;
		fs[0] *= xScale; fs[1] *= yScale;
		fs[4] *= xScale; fs[5] *= yScale;
		fs[8] *= xScale; fs[9] *= yScale;
		fs[12] *= xScale; fs[13] *= yScale;
	}
	prependTranslationXYZ(px: number, py: number, pz: number): void {
		Matrix4.s_tMat4.identity();
		//Matrix4.s_tMat4.setPositionXYZ(px, py, pz);
		this.prepend(Matrix4.s_tMat4);
	}
	prependTranslation(v3: Vector3D): void {
		Matrix4.s_tMat4.identity();
		//Matrix4.s_tMat4.setPositionXYZ(v3.x, v3.y, v3.z);
		this.prepend(Matrix4.s_tMat4);
	}
	recompose(components: Vector3D[], orientationStyle: number): boolean {
		if (components.length < 3 || components[2].x == 0 || components[2].y == 0 || components[2].z == 0) return false;
		this.identity();
		let scale = Matrix4.s_tMat4.getFS32();
		scale[0] = scale[1] = scale[2] = components[2].x;
		scale[4] = scale[5] = scale[6] = components[2].y;
		scale[8] = scale[9] = scale[10] = components[2].z;
		let fs: Float32Array = this.m_localFS32;
		switch (orientationStyle) {
			case OrientationType.EULER_ANGLES:
				{
					let cx: number = Math.cos(components[1].x);
					let cy: number = Math.cos(components[1].y);
					let cz: number = Math.cos(components[1].z);
					let sx: number = Math.sin(components[1].x);
					let sy: number = Math.sin(components[1].y);
					let sz: number = Math.sin(components[1].z);
					fs[0] = cy * cz * scale[0];
					fs[1] = cy * sz * scale[1];
					fs[2] = -sy * scale[2];
					fs[3] = 0;
					fs[4] = (sx * sy * cz - cx * sz) * scale[4];
					fs[5] = (sx * sy * sz + cx * cz) * scale[5];
					fs[6] = sx * cy * scale[6];
					fs[7] = 0;
					fs[8] = (cx * sy * cz + sx * sz) * scale[8];
					fs[9] = (cx * sy * sz - sx * cz) * scale[9];
					fs[10] = cx * cy * scale[10];
					fs[11] = 0;
					fs[12] = components[0].x;
					fs[13] = components[0].y;
					fs[14] = components[0].z;
					fs[15] = 1;
				}
				break;
			default:
				{
					let x: number = components[1].x;
					let y: number = components[1].y;
					let z: number = components[1].z;
					let w: number = components[1].w;
					if (orientationStyle == OrientationType.AXIS_ANGLE) {
						let halfW = 0.5 * w;
						x *= Math.sin(halfW);
						y *= Math.sin(halfW);
						z *= Math.sin(halfW);
						w = Math.cos(halfW);
					};
					fs[0] = (1 - 2 * y * y - 2 * z * z) * scale[0];
					fs[1] = (2 * x * y + 2 * w * z) * scale[1];
					fs[2] = (2 * x * z - 2 * w * y) * scale[2];
					fs[3] = 0;
					fs[4] = (2 * x * y - 2 * w * z) * scale[4];
					fs[5] = (1 - 2 * x * x - 2 * z * z) * scale[5];
					fs[6] = (2 * y * z + 2 * w * x) * scale[6];
					fs[7] = 0;
					fs[8] = (2 * x * z + 2 * w * y) * scale[8];
					fs[9] = (2 * y * z - 2 * w * x) * scale[9];
					fs[10] = (1 - 2 * x * x - 2 * y * y) * scale[10];
					fs[11] = 0;
					fs[12] = components[0].x;
					fs[13] = components[0].y;
					fs[14] = components[0].z;
					fs[15] = 1;
				}
				break;
		};
		//TODO: need thinking
		if (components[2].x == 0) this.m_localFS32[0] = 0;// 1e-15;
		if (components[2].y == 0) this.m_localFS32[5] = 0;// 1e-15;
		if (components[2].z == 0) this.m_localFS32[10] = 0;// 1e-15;
		scale = null;
		return true;
	}
	setThreeAxes(x_axis: Vector3D, y_axis: Vector3D, z_axis: Vector3D,): void {
		let vs: Float32Array = this.m_localFS32;
		vs[0] = x_axis.x; vs[1] = x_axis.y; vs[2] = x_axis.z;
		vs[4] = y_axis.x; vs[5] = y_axis.y; vs[6] = y_axis.z;
		vs[8] = z_axis.x; vs[9] = z_axis.y; vs[10] = z_axis.z;
	}
	deltaTransformVector(v3: Vector3D): Vector3D {
		let x: number = v3.x;
		let y: number = v3.y;
		let z: number = v3.z;
		return new Vector3D(
			x * this.m_localFS32[0] + y * this.m_localFS32[4] + z * this.m_localFS32[8]
			, x * this.m_localFS32[1] + y * this.m_localFS32[5] + z * this.m_localFS32[9]
			, x * this.m_localFS32[2] + y * this.m_localFS32[6] + z * this.m_localFS32[10]
			, 0.0);
	}

	deltaTransformVectorSelf(v3: Vector3D): void {
		let fs: Float32Array = this.m_localFS32;
		let x: number = v3.x;
		let y: number = v3.y;
		let z: number = v3.z;
		v3.x = x * fs[0] + y * fs[4] + z * fs[8];
		v3.y = x * fs[1] + y * fs[5] + z * fs[9];
		v3.z = x * fs[2] + y * fs[6] + z * fs[10];
	}
	deltaTransformOutVector(v3: Vector3D, out_v3: Vector3D): void {
		let fs: Float32Array = this.m_localFS32;
		out_v3.x = v3.x * fs[0] + v3.y * fs[4] + v3.z * fs[8];
		out_v3.y = v3.x * fs[1] + v3.y * fs[5] + v3.z * fs[9];
		out_v3.z = v3.x * fs[2] + v3.y * fs[6] + v3.z * fs[10];
	}
	transformVector(v3: Vector3D): Vector3D {
		let fs: Float32Array = this.m_localFS32;
		let x: number = v3.x;
		let y: number = v3.y;
		let z: number = v3.z;
		return new Vector3D(
			x * fs[0] + y * fs[4] + z * fs[8] + fs[12]
			, x * fs[1] + y * fs[5] + z * fs[9] + fs[13]
			, x * fs[2] + y * fs[6] + z * fs[10] + fs[14]
			, x * fs[3] + y * fs[7] + z * fs[11] + fs[15]
		);
	}
	transformOutVector(v3: Vector3D, out_v3: Vector3D): void {
		let x: number = v3.x;
		let y: number = v3.y;
		let z: number = v3.z;
		let fs: Float32Array = this.m_localFS32;
		out_v3.setTo(
			x * fs[0] + y * fs[4] + z * fs[8] + fs[12]
			, x * fs[1] + y * fs[5] + z * fs[9] + fs[13]
			, x * fs[2] + y * fs[6] + z * fs[10] + fs[14]
			, x * fs[3] + y * fs[7] + z * fs[11] + fs[15]
		);
	}
	transformOutVector3(v3: Vector3D, out_v3: Vector3D): void {
		let fs: Float32Array = this.m_localFS32;
		out_v3.x = v3.x * fs[0] + v3.y * fs[4] + v3.z * fs[8] + fs[12];
		out_v3.y = v3.x * fs[1] + v3.y * fs[5] + v3.z * fs[9] + fs[13];
		out_v3.z = v3.x * fs[2] + v3.y * fs[6] + v3.z * fs[10] + fs[14];
	}
	transformVector3Self(v3: Vector3D): void {
		let x: number = v3.x;
		let y: number = v3.y;
		let z: number = v3.z;
		let fs: Float32Array = this.m_localFS32;
		v3.x = x * fs[0] + y * fs[4] + z * fs[8] + fs[12];
		v3.y = x * fs[1] + y * fs[5] + z * fs[9] + fs[13];
		v3.z = x * fs[2] + y * fs[6] + z * fs[10] + fs[14];
	}
	transformVectorSelf(v3: Vector3D): void {
		let x: number = v3.x;
		let y: number = v3.y;
		let z: number = v3.z;
		let fs: Float32Array = this.m_localFS32;
		v3.setTo(
			x * fs[0] + y * fs[4] + z * fs[8] + fs[12],
			x * fs[1] + y * fs[5] + z * fs[9] + fs[13],
			x * fs[2] + y * fs[6] + z * fs[10] + fs[14],
			x * fs[3] + y * fs[7] + z * fs[11] + fs[15]
		);
	}
	transformVectors(float_vinArr: Float32Array | number[], vinLength: number, float_voutArr: Float32Array): void {
		let i: number = 0;
		let x: number, y: number, z: number;
		let pfs: Float32Array = this.m_localFS32;
		vinLength -= 3;
		while (i <= vinLength) {
			x = float_vinArr[i];
			y = float_vinArr[i + 1];
			z = float_vinArr[i + 2];
			float_voutArr[i] = x * pfs[0] + y * pfs[4] + z * pfs[8] + pfs[12];
			float_voutArr[i + 1] = x * pfs[1] + y * pfs[5] + z * pfs[9] + pfs[13];
			float_voutArr[i + 2] = x * pfs[2] + y * pfs[6] + z * pfs[10] + pfs[14];
			i += 3;
		}
	}
	transformVectorsSelf(float_vinArr: Float32Array | number[], vinLength: number): void {
		let i: number = 0;
		let x: number, y: number, z: number;
		let pfs: Float32Array = this.m_localFS32;
		vinLength -= 3;
		while (i <= vinLength) {
			x = float_vinArr[i];
			y = float_vinArr[i + 1];
			z = float_vinArr[i + 2];
			float_vinArr[i] = x * pfs[0] + y * pfs[4] + z * pfs[8] + pfs[12];
			float_vinArr[i + 1] = x * pfs[1] + y * pfs[5] + z * pfs[9] + pfs[13];
			float_vinArr[i + 2] = x * pfs[2] + y * pfs[6] + z * pfs[10] + pfs[14];
			i += 3;
		}
	}
	transformVectorsRangeSelf(float_vinArr: Float32Array | number[], begin: number, end: number): void {
		let i: number = begin;
		let x: number, y: number, z: number;
		let pfs: Float32Array = this.m_localFS32;
		end -= 3;
		while (i <= end) {
			x = float_vinArr[i];
			y = float_vinArr[i + 1];
			z = float_vinArr[i + 2];
			float_vinArr[i] = x * pfs[0] + y * pfs[4] + z * pfs[8] + pfs[12];
			float_vinArr[i + 1] = x * pfs[1] + y * pfs[5] + z * pfs[9] + pfs[13];
			float_vinArr[i + 2] = x * pfs[2] + y * pfs[6] + z * pfs[10] + pfs[14];
			i += 3;
		}
	}
	transpose(): void {
		Matrix4.s_tMat4.copyFrom(this);
		let fs32 = Matrix4.s_tMat4.getFS32();
		let fs = this.m_localFS32;
		fs[1] = fs32[4];
		fs[2] = fs32[8];
		fs[3] = fs32[12];
		fs[4] = fs32[1];
		fs[6] = fs32[9];
		fs[7] = fs32[13];
		fs[8] = fs32[2];
		fs[9] = fs32[6];
		fs[11] = fs32[14];
		fs[12] = fs32[3];
		fs[13] = fs32[7];
		fs[14] = fs32[11];
	}
	interpolateTo(toMat: IMatrix4, float_percent: number): void {
		let fs32: Float32Array = toMat.getFS32();
		let fsI: number = toMat.getFSIndex();
		let _g: number = 0;
		let i: number = this.m_index;
		while (_g < 16) {
			this.m_fs32[i] += (fs32[fsI + _g] - this.m_fs32[i]) * float_percent;
			++i;
			++_g;
		}
	}
	private getAxisRotation(x: number, y: number, z: number, radian: number): void {
		radian = -radian;
		let fs: Float32Array = this.m_localFS32;
		let s: number = Math.sin(radian), c = Math.cos(radian);
		let t: number = 1.0 - c;
		fs[0] = c + x * x * t;
		fs[5] = c + y * y * t;
		fs[10] = c + z * z * t;
		let tmp1: number = x * y * t;
		let tmp2: number = z * s;
		fs[4] = tmp1 + tmp2;
		fs[1] = tmp1 - tmp2;
		tmp1 = x * z * t;
		tmp2 = y * s;
		fs[8] = tmp1 - tmp2;
		fs[2] = tmp1 + tmp2;
		tmp1 = y * z * t;
		tmp2 = x * s;
		fs[9] = tmp1 + tmp2;
		fs[6] = tmp1 - tmp2;
	}
	rotationX(radian: number): void {
		let s: number = Math.sin(radian), c: number = Math.cos(radian);
		this.m_localFS32[0] = 1.0; this.m_localFS32[1] = 0.0; this.m_localFS32[2] = 0.0;
		this.m_localFS32[4] = 0.0; this.m_localFS32[5] = c; this.m_localFS32[6] = s;
		this.m_localFS32[8] = 0.0; this.m_localFS32[9] = -s; this.m_localFS32[10] = c;
	}
	rotationY(radian: number): void {
		let s: number = Math.sin(radian), c: number = Math.cos(radian);
		this.m_localFS32[0] = c; this.m_localFS32[1] = 0.0; this.m_localFS32[2] = -s;
		this.m_localFS32[4] = 0.0; this.m_localFS32[5] = 1.0; this.m_localFS32[6] = 0.0;
		this.m_localFS32[8] = s; this.m_localFS32[9] = 0.0; this.m_localFS32[10] = c;
	}
	rotationZ(radian: number): void {
		let s: number = Math.sin(radian), c = Math.cos(radian);
		this.m_localFS32[0] = c; this.m_localFS32[1] = s; this.m_localFS32[2] = 0.0;
		this.m_localFS32[4] = -s; this.m_localFS32[5] = c; this.m_localFS32[6] = 0.0;
		this.m_localFS32[8] = 0.0; this.m_localFS32[9] = 0.0; this.m_localFS32[10] = 1.0;
	}
	/////////////////////////////////////////////////////////////
	toString(): string {
		let str: string = "\n" + this.m_localFS32[0] + "," + this.m_localFS32[1] + "," + this.m_localFS32[2] + "," + this.m_localFS32[3] + "\n";
		str += this.m_localFS32[4] + "," + this.m_localFS32[5] + "," + this.m_localFS32[6] + "," + this.m_localFS32[7] + "\n";
		str += this.m_localFS32[8] + "," + this.m_localFS32[9] + "," + this.m_localFS32[10] + "," + this.m_localFS32[11] + "\n";
		str += this.m_localFS32[12] + "," + this.m_localFS32[13] + "," + this.m_localFS32[14] + "," + this.m_localFS32[15] + "\n";
		return str;
	}

	transformPerspV4Self(v4: Vector3D): void {
		const fs = this.m_localFS32;
		v4.w = v4.z;
		v4.x *= fs[0];
		v4.y *= fs[5];
		v4.z *= fs[10];
		v4.z += fs[14];
		v4.w *= fs[11];
		v4.w += fs[15];
	}
	clone(): IMatrix4 {
		let m = new Matrix4();
		m.copyFrom(this);
		return m;
	}
	///////
	// view etc..
	///////////////////////////////////////////
	perspectiveRH(fovy: number, aspect: number, zNear: number, zFar: number): void {
		//assert(abs(aspect - std::numeric_limits<float>::epsilon()) > minFloatValue)
		const fs = this.m_localFS32;
		let tanHalfFovy = Math.tan(fovy * 0.5);
		this.identity();
		fs[0] = 1.0 / (aspect * tanHalfFovy);
		fs[5] = 1.0 / tanHalfFovy;
		fs[10] = -(zFar + zNear) / (zFar - zNear);
		fs[11] = -1.0;
		fs[14] = -(2.0 * zFar * zNear) / (zFar - zNear);
	}
	perspectiveRH2(fovy: number, pw: number, ph: number, zNear: number, zFar: number): void {
		let focalLength: number = pw / Math.tan(fovy * 0.5);
		let m0: number = focalLength / pw;
		let m5: number = focalLength / ph;
		let m10: number = -zFar / (zFar - zNear);
		let m14: number = -zNear * m10;
		this.identity();
		const fs = this.m_localFS32;
		fs[0] = m0;
		fs[5] = m5;
		fs[10] = m10;
		fs[11] = -1.0;
		fs[14] = m14;
	}
	orthoRH(b: number, t: number, l: number, r: number, zNear: number, zFar: number): void {
		
		this.identity();
		const fs = this.m_localFS32;
		fs[0] = 2.0 / (r - l);
		fs[5] = 2.0 / (t - b);
		fs[10] = -2.0 / (zFar - zNear);
		fs[12] = -(r + l) / (r - l);
		fs[13] = -(t + b) / (t - b);
		fs[14] = -(zFar + zNear) / (zFar - zNear);
		fs[15] = 1.0;
	}
	perspectiveLH(fovy: number, aspect: number, zNear: number, zFar: number): void {
		//assert(abs(aspect - std::numeric_limits<float>::epsilon()) > minFloatValue)

		let tanHalfFovy: number = Math.tan(fovy * 0.5);
		this.identity();
		const fs = this.m_localFS32;
		fs[0] = 1.0 / (aspect * tanHalfFovy);
		fs[5] = 1.0 / tanHalfFovy;
		fs[10] = (zFar + zNear) / (zFar - zNear);
		fs[11] = 1.0;
		fs[14] = (2.0 * zFar * zNear) / (zFar - zNear);
	}
	orthoLH(b: number, t: number, l: number, r: number, zNear: number, zFar: number): void {
		this.identity();
		const fs = this.m_localFS32;
		fs[0] = 2.0 / (r - l);// / (aspect * tanHalfFovy);
		fs[5] = 2.0 / (t - b);// / tanHalfFovy;
		fs[10] = 2.0 / (zFar - zNear);
		fs[12] = -(r + l) / (r - l);
		fs[13] = -(t + b) / (t - b);
		fs[14] = -(zFar + zNear) / (zFar - zNear);
		fs[15] = 1.0;
	}
	lookAtRH(eyePos: Vector3D, atPos: Vector3D, up: Vector3D): void {
		this.identity();
		let f: Vector3D = atPos.subtract(eyePos);
		f.normalize();
		let s: Vector3D = f.crossProduct(up);
		s.normalize();
		let u: Vector3D = s.crossProduct(f);
		s.w = -s.dot(eyePos);
		u.w = -u.dot(eyePos);
		f.w = f.dot(eyePos);
		f.negate();
		this.copyRowFrom(0, s);
		this.copyRowFrom(1, u);
		this.copyRowFrom(2, f);
	}
	lookAtLH(eyePos: Vector3D, atPos: Vector3D, up: Vector3D): void {
		this.identity();
		let f: Vector3D = atPos.subtract(eyePos);
		f.normalize();
		let s: Vector3D = f.crossProduct(up);
		s.normalize();
		let u: Vector3D = s.crossProduct(f);
		s.w = -s.dot(eyePos);
		u.w = -u.dot(eyePos);
		f.w = -f.dot(eyePos);
		this.copyRowFrom(0, s);
		this.copyRowFrom(1, u);
		this.copyRowFrom(2, f);
	}
	destroy(): void {
		this.m_localFS32 = null;
		this.m_fs32 = null;
		this.m_index = -1;
	}
}

export default Matrix4;