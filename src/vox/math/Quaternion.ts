
/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import {EulerOrder} from './EulerOrder';
import { Euler } from "./Euler";
import MathConst from "../../vox/math/MathConst";
import Vector3D from "../../vox/math/Vector3D";
import Matrix4 from "./Matrix4";

class Quaternion {

	private _x: number;
	private _y: number;
	private _z: number;
	private _w: number;
	isQuaternion: boolean;
	constructor( x = 0, y = 0, z = 0, w = 1 ) {

		this.isQuaternion = true;

		this._x = x;
		this._y = y;
		this._z = z;
		this._w = w;

	}

	static Slerp( qa: Quaternion, qb: Quaternion, qm: Quaternion, t: number ): Quaternion {

		console.warn( 'Quaternion: Static::Slerp() has been deprecated. Use qm.slerpQuaternions( qa, qb, t ) instead.' );
		return qm.slerpQuaternions( qa, qb, t );

	}

	static SlerpFlat( dst: Quaternion, src0: Quaternion, src1: Quaternion, t: number ): void {

		// fuzz-free, array-based Quaternion SLERP operation

		let x0 = src0.x,
			y0 = src0.y,
			z0 = src0.z,
			w0 = src0.w;

		const x1 = src1.x,
			y1 = src1.y,
			z1 = src1.z,
			w1 = src1.w;

		if ( t === 0 ) {

			dst.x = x0;
			dst.y = y0;
			dst.z = z0;
			dst.w = w0;
			return;

		}

		if ( t === 1 ) {

			dst.x = x1;
			dst.y = y1;
			dst.z = z1;
			dst.w = w1;
			return;

		}

		if ( w0 !== w1 || x0 !== x1 || y0 !== y1 || z0 !== z1 ) {

			let s = 1 - t;
			const cos = x0 * x1 + y0 * y1 + z0 * z1 + w0 * w1,
				dir = ( cos >= 0 ? 1 : - 1 ),
				sqrSin = 1 - cos * cos;

			// Skip the Slerp for tiny steps to avoid numeric problems:
			if ( sqrSin > Number.EPSILON ) {

				const sin = Math.sqrt( sqrSin ),
					len = Math.atan2( sin, cos * dir );

				s = Math.sin( s * len ) / sin;
				t = Math.sin( t * len ) / sin;

			}

			const tDir = t * dir;

			x0 = x0 * s + x1 * tDir;
			y0 = y0 * s + y1 * tDir;
			z0 = z0 * s + z1 * tDir;
			w0 = w0 * s + w1 * tDir;

			// Normalize in case we just did a lerp:
			if ( s === 1 - t ) {

				const f = 1 / Math.sqrt( x0 * x0 + y0 * y0 + z0 * z0 + w0 * w0 );

				x0 *= f;
				y0 *= f;
				z0 *= f;
				w0 *= f;

			}

		}

		dst.x = x0;
		dst.y = y0;
		dst.z = z0;
		dst.w = w0;

	}

	// static multiplyQuaternionsFlat( dst: Quaternion, dstOffset, src0, srcOffset0, src1, srcOffset1 ) {

	// 	const x0 = src0[ srcOffset0 ];
	// 	const y0 = src0[ srcOffset0 + 1 ];
	// 	const z0 = src0[ srcOffset0 + 2 ];
	// 	const w0 = src0[ srcOffset0 + 3 ];

	// 	const x1 = src1[ srcOffset1 ];
	// 	const y1 = src1[ srcOffset1 + 1 ];
	// 	const z1 = src1[ srcOffset1 + 2 ];
	// 	const w1 = src1[ srcOffset1 + 3 ];

	// 	dst[ dstOffset ] = x0 * w1 + w0 * x1 + y0 * z1 - z0 * y1;
	// 	dst[ dstOffset + 1 ] = y0 * w1 + w0 * y1 + z0 * x1 - x0 * z1;
	// 	dst[ dstOffset + 2 ] = z0 * w1 + w0 * z1 + x0 * y1 - y0 * x1;
	// 	dst[ dstOffset + 3 ] = w0 * w1 - x0 * x1 - y0 * y1 - z0 * z1;

	// 	return dst;

	// }

	get x(): number {

		return this._x;

	}

	set x( value: number ) {

		this._x = value;
	}

	get y(): number {

		return this._y;

	}

	set y( value: number ) {

		this._y = value;
	}

	get z(): number {

		return this._z;

	}

	set z( value: number ) {

		this._z = value;
	}

	get w(): number {

		return this._w;

	}

	set w( value: number ) {

		this._w = value;
	}

	set( x: number, y: number, z: number, w: number ): Quaternion {

		this._x = x;
		this._y = y;
		this._z = z;
		this._w = w;
		return this;

	}

	clone(): Quaternion {

		return new Quaternion( this._x, this._y, this._z, this._w );

	}

	copy( q: Quaternion ) {

		this._x = q.x;
		this._y = q.y;
		this._z = q.z;
		this._w = q.w;

		return this;

	}

	setFromEuler( euler: Euler, update: boolean = true ) {

		if ( euler == null ) {

			throw new Error( 'Quaternion::setFromEuler() now expects an Euler rotation rather than a Vector3 and order.' );

		}

		const x = euler.x, y = euler.y, z = euler.z, order = euler.order;

		// http://www.mathworks.com/matlabcentral/fileexchange/
		// 	20696-function-to-convert-between-dcm-euler-angles-quaternions-and-euler-vectors/
		//	content/SpinCalc.m

		const cos = Math.cos;
		const sin = Math.sin;

		const c1 = cos( x / 2 );
		const c2 = cos( y / 2 );
		const c3 = cos( z / 2 );

		const s1 = sin( x / 2 );
		const s2 = sin( y / 2 );
		const s3 = sin( z / 2 );

		switch ( order ) {

			case EulerOrder.XYZ:
				this._x = s1 * c2 * c3 + c1 * s2 * s3;
				this._y = c1 * s2 * c3 - s1 * c2 * s3;
				this._z = c1 * c2 * s3 + s1 * s2 * c3;
				this._w = c1 * c2 * c3 - s1 * s2 * s3;
				break;

			case EulerOrder.YXZ:
				this._x = s1 * c2 * c3 + c1 * s2 * s3;
				this._y = c1 * s2 * c3 - s1 * c2 * s3;
				this._z = c1 * c2 * s3 - s1 * s2 * c3;
				this._w = c1 * c2 * c3 + s1 * s2 * s3;
				break;

			case EulerOrder.ZXY:
				this._x = s1 * c2 * c3 - c1 * s2 * s3;
				this._y = c1 * s2 * c3 + s1 * c2 * s3;
				this._z = c1 * c2 * s3 + s1 * s2 * c3;
				this._w = c1 * c2 * c3 - s1 * s2 * s3;
				break;

			case EulerOrder.ZYX:
				this._x = s1 * c2 * c3 - c1 * s2 * s3;
				this._y = c1 * s2 * c3 + s1 * c2 * s3;
				this._z = c1 * c2 * s3 - s1 * s2 * c3;
				this._w = c1 * c2 * c3 + s1 * s2 * s3;
				break;

			case EulerOrder.YZX:
				this._x = s1 * c2 * c3 + c1 * s2 * s3;
				this._y = c1 * s2 * c3 + s1 * c2 * s3;
				this._z = c1 * c2 * s3 - s1 * s2 * c3;
				this._w = c1 * c2 * c3 - s1 * s2 * s3;
				break;

			case EulerOrder.XZY:
				this._x = s1 * c2 * c3 - c1 * s2 * s3;
				this._y = c1 * s2 * c3 - s1 * c2 * s3;
				this._z = c1 * c2 * s3 + s1 * s2 * c3;
				this._w = c1 * c2 * c3 + s1 * s2 * s3;
				break;

			default:
				console.warn( 'Quaternion::setFromEuler() encountered an unknown order: ' + order );

		}

		return this;

	}

	setFromAxisAngle( axis: Vector3D, angle: number ): Quaternion {

		// http://www.euclideanspace.com/maths/geometry/rotations/conversions/angleToQuaternion/index.htm

		// assumes axis is normalized

		const halfAngle = angle / 2, s = Math.sin( halfAngle );

		this._x = axis.x * s;
		this._y = axis.y * s;
		this._z = axis.z * s;
		this._w = Math.cos( halfAngle );
		return this;

	}

	setFromRotationMatrix( m: Matrix4 ): Quaternion {

		// http://www.euclideanspace.com/maths/geometry/rotations/conversions/matrixToQuaternion/index.htm

		// assumes the upper 3x3 of m is a pure rotation matrix (i.e, unscaled)

		const te = m.getLocalFS32(),

			m11 = te[ 0 ], m12 = te[ 4 ], m13 = te[ 8 ],
			m21 = te[ 1 ], m22 = te[ 5 ], m23 = te[ 9 ],
			m31 = te[ 2 ], m32 = te[ 6 ], m33 = te[ 10 ],

			trace = m11 + m22 + m33;

		if ( trace > 0 ) {

			const s = 0.5 / Math.sqrt( trace + 1.0 );

			this._w = 0.25 / s;
			this._x = ( m32 - m23 ) * s;
			this._y = ( m13 - m31 ) * s;
			this._z = ( m21 - m12 ) * s;

		} else if ( m11 > m22 && m11 > m33 ) {

			const s = 2.0 * Math.sqrt( 1.0 + m11 - m22 - m33 );

			this._w = ( m32 - m23 ) / s;
			this._x = 0.25 * s;
			this._y = ( m12 + m21 ) / s;
			this._z = ( m13 + m31 ) / s;

		} else if ( m22 > m33 ) {

			const s = 2.0 * Math.sqrt( 1.0 + m22 - m11 - m33 );

			this._w = ( m13 - m31 ) / s;
			this._x = ( m12 + m21 ) / s;
			this._y = 0.25 * s;
			this._z = ( m23 + m32 ) / s;

		} else {

			const s = 2.0 * Math.sqrt( 1.0 + m33 - m11 - m22 );

			this._w = ( m21 - m12 ) / s;
			this._x = ( m13 + m31 ) / s;
			this._y = ( m23 + m32 ) / s;
			this._z = 0.25 * s;

		}
		return this;

	}

	setFromUnitVectors( vFrom: Quaternion, vTo: Quaternion ): Quaternion {

		// assumes direction vectors vFrom and vTo are normalized

		let r = vFrom.dot( vTo ) + 1;

		if ( r < Number.EPSILON ) {

			// vFrom and vTo point in opposite directions

			r = 0;

			if ( Math.abs( vFrom.x ) > Math.abs( vFrom.z ) ) {

				this._x = - vFrom.y;
				this._y = vFrom.x;
				this._z = 0;
				this._w = r;

			} else {

				this._x = 0;
				this._y = - vFrom.z;
				this._z = vFrom.y;
				this._w = r;

			}

		} else {

			// crossVectors( vFrom, vTo ); // inlined to avoid cyclic dependency on Vector3

			this._x = vFrom.y * vTo.z - vFrom.z * vTo.y;
			this._y = vFrom.z * vTo.x - vFrom.x * vTo.z;
			this._z = vFrom.x * vTo.y - vFrom.y * vTo.x;
			this._w = r;

		}

		return this.normalize();

	}

	angleTo( q: Quaternion ) {

		return 2 * Math.acos( Math.abs( MathConst.Clamp( this.dot( q ), - 1, 1 ) ) );

	}

	rotateTowards( q: Quaternion, step: number ): Quaternion {

		const angle = this.angleTo( q );

		if ( angle === 0 ) return this;

		const t = Math.min( 1, step / angle );

		this.slerp( q, t );

		return this;

	}

	identity(): Quaternion {

		return this.set( 0, 0, 0, 1 );

	}

	invert(): Quaternion {

		// quaternion is assumed to have unit length

		return this.conjugate();

	}

	conjugate(): Quaternion {

		this._x *= - 1;
		this._y *= - 1;
		this._z *= - 1;
		return this;

	}

	dot( q: Quaternion ) {

		return this._x * q._x + this._y * q._y + this._z * q._z + this._w * q._w;

	}

	lengthSq() {

		return this._x * this._x + this._y * this._y + this._z * this._z + this._w * this._w;

	}

	length() {

		return Math.sqrt( this._x * this._x + this._y * this._y + this._z * this._z + this._w * this._w );

	}

	normalize() {

		let l = this.length();

		if ( l === 0 ) {

			this._x = 0;
			this._y = 0;
			this._z = 0;
			this._w = 1;

		} else {

			l = 1 / l;

			this._x = this._x * l;
			this._y = this._y * l;
			this._z = this._z * l;
			this._w = this._w * l;

		}
		return this;

	}

	multiply( q: Quaternion, p: Quaternion ): Quaternion {

		if ( p !== undefined ) {

			console.warn( 'Quaternion::multiply() now only accepts one argument. Use .multiplyQuaternions( a, b ) instead.' );
			return this.multiplyQuaternions( q, p );

		}

		return this.multiplyQuaternions( this, q );

	}

	premultiply( q: Quaternion ): Quaternion {

		return this.multiplyQuaternions( q, this );

	}

	multiplyQuaternions( a: Quaternion, b: Quaternion ): Quaternion {

		// from http://www.euclideanspace.com/maths/algebra/realNormedAlgebra/quaternions/code/index.htm

		const qax = a._x, qay = a._y, qaz = a._z, qaw = a._w;
		const qbx = b._x, qby = b._y, qbz = b._z, qbw = b._w;

		this._x = qax * qbw + qaw * qbx + qay * qbz - qaz * qby;
		this._y = qay * qbw + qaw * qby + qaz * qbx - qax * qbz;
		this._z = qaz * qbw + qaw * qbz + qax * qby - qay * qbx;
		this._w = qaw * qbw - qax * qbx - qay * qby - qaz * qbz;

		return this;

	}

	slerp( qb: Quaternion, t: number ): Quaternion {

		if ( t === 0 ) return this;
		if ( t === 1 ) return this.copy( qb );

		const x = this._x, y = this._y, z = this._z, w = this._w;

		// http://www.euclideanspace.com/maths/algebra/realNormedAlgebra/quaternions/slerp/

		let cosHalfTheta = w * qb._w + x * qb._x + y * qb._y + z * qb._z;

		if ( cosHalfTheta < 0 ) {

			this._w = - qb._w;
			this._x = - qb._x;
			this._y = - qb._y;
			this._z = - qb._z;

			cosHalfTheta = - cosHalfTheta;

		} else {

			this.copy( qb );

		}

		if ( cosHalfTheta >= 1.0 ) {

			this._w = w;
			this._x = x;
			this._y = y;
			this._z = z;

			return this;

		}

		const sqrSinHalfTheta = 1.0 - cosHalfTheta * cosHalfTheta;

		if ( sqrSinHalfTheta <= Number.EPSILON ) {

			const s = 1 - t;
			this._w = s * w + t * this._w;
			this._x = s * x + t * this._x;
			this._y = s * y + t * this._y;
			this._z = s * z + t * this._z;

			this.normalize();
			return this;

		}

		const sinHalfTheta = Math.sqrt( sqrSinHalfTheta );
		const halfTheta = Math.atan2( sinHalfTheta, cosHalfTheta );
		const ratioA = Math.sin( ( 1 - t ) * halfTheta ) / sinHalfTheta,
			ratioB = Math.sin( t * halfTheta ) / sinHalfTheta;

		this._w = ( w * ratioA + this._w * ratioB );
		this._x = ( x * ratioA + this._x * ratioB );
		this._y = ( y * ratioA + this._y * ratioB );
		this._z = ( z * ratioA + this._z * ratioB );

		return this;

	}

	slerpQuaternions( qa: Quaternion, qb: Quaternion, t: number ): Quaternion {

		return this.copy( qa ).slerp( qb, t );

	}

	random(): Quaternion {

		// Derived from http://planning.cs.uiuc.edu/node198.html
		// Note, this source uses w, x, y, z ordering,
		// so we swap the order below.

		const u1 = Math.random();
		const sqrt1u1 = Math.sqrt( 1 - u1 );
		const sqrtu1 = Math.sqrt( u1 );

		const u2 = 2 * Math.PI * Math.random();

		const u3 = 2 * Math.PI * Math.random();

		return this.set(
			sqrt1u1 * Math.cos( u2 ),
			sqrtu1 * Math.sin( u3 ),
			sqrtu1 * Math.cos( u3 ),
			sqrt1u1 * Math.sin( u2 ),
		);

	}

	equals( quaternion: Quaternion ): boolean {

		return ( quaternion._x === this._x ) && ( quaternion._y === this._y ) && ( quaternion._z === this._z ) && ( quaternion._w === this._w );

	}

	fromArray( array: number[], offset = 0 ): Quaternion {

		this._x = array[ offset ];
		this._y = array[ offset + 1 ];
		this._z = array[ offset + 2 ];
		this._w = array[ offset + 3 ];
		return this;

	}

	toArray( array: number[] = [], offset = 0 ): number[] {

		array[ offset ] = this._x;
		array[ offset + 1 ] = this._y;
		array[ offset + 2 ] = this._z;
		array[ offset + 3 ] = this._w;

		return array;

	}

	fromBufferAttribute( attribute: any, index: number = 0 ): Quaternion {

		this._x = attribute.getX( index );
		this._y = attribute.getY( index );
		this._z = attribute.getZ( index );
		this._w = attribute.getW( index );

		return this;

	}

	// _onChange( callback ) {

	// 	this._onChangeCallback = callback;

	// 	return this;

	// }

	// _onChangeCallback() {}

	// *[ Symbol.iterator ]() {

	// 	yield this._x;
	// 	yield this._y;
	// 	yield this._z;
	// 	yield this._w;

	// }

}

export { Quaternion };
// /**
//  * vox.math.Quaternion
//  * 
//  * 用于表示基本的四元数对象
//  * 
//  * @author Vily
//  */
// class Quaternion
// {
// 	w:number = 0.0;
// 	x:number = 0.0;
// 	y:number = 0.0;
// 	z:number = 0.0;
// 	private m_sin:number = 0.0;
// 	private m_cos:number = 0.0;
// 	private m_rad:number = 0.0;
// 	constructor(w:number = 0.0, x:number = 0.0, y:number = 0.0, z:number = 0.0)
// 	{
// 		this.w = w;
// 		this.x = x;
// 		this.y = y;
// 		this.z = z;
// 	}
// 	initState(w:number = 0, x:number = 0, y:number = 0, z:number = 0):void
// 	{
// 		this.w = w;
// 		this.x = x;
// 		this.y = y;
// 		this.z = z;
// 	}
// 	setAngRadAndNV(pang:number, nv:Vector3D):void
// 	{
// 		this.m_rad =  pang * MathConst.MATH_PI_OVER_180;
// 		this.m_cos = Math.cos(0.5 * this.m_rad);
// 		this.m_sin = Math.sin(0.5 * this.m_rad);			
// 		this.w = this.m_cos;
// 		this.x = nv.x * this.m_sin;
// 		this.y = nv.y * this.m_sin;
// 		this.z = nv.z * this.m_sin;
// 	}
// 	setRotRadAndNV(prad:number, nv:Vector3D):void
// 	{
// 		this.m_rad = prad;
// 		this.m_cos = Math.cos(0.5 * this.m_rad);
// 		this.m_sin = Math.sin(0.5 * this.m_rad);
// 		this.w = this.m_cos;
// 		this.x = nv.x * this.m_sin;
// 		this.y = nv.y * this.m_sin;
// 		this.z = nv.z * this.m_sin;
// 	}		
// 	setRad(r:number):void
// 	{
// 		this.m_rad = r;
// 		this.m_cos = Math.cos(0.5 * this.m_rad);
// 		this.m_sin = Math.sin(0.5 * this.m_rad);
// 	}
// 	getRad():number
// 	{
// 		return this.m_rad;
// 	}
// 	updateRot():void
// 	{
// 		this.w = this.m_cos;
// 		this.x *= this.m_sin;
// 		this.y *= this.m_sin;
// 		this.z *= this.m_sin;
// 	}
// 	setXYZ(px:number, py:number, pz:number):void
// 	{
// 		this.x = px;
// 		this.y = py;
// 		this.z = pz;
// 	}
// 	add(q:Quaternion):void
// 	{
// 		this.w += q.w;
// 		this.x += q.x;
// 		this.y += q.y;
// 		this.z += q.z;
// 	}
// 	sub(q:Quaternion):void
// 	{
// 		this.w -= q.w;
// 		this.x -= q.x;
// 		this.y -= q.y;
// 		this.z -= q.z;
// 	}
// 	scale(s:number):void
// 	{
// 		this.w *= s;
// 		this.x *= s;
// 		this.y *= s;
// 		this.z *= s;
// 	}		
// 	mulToThis(q1:Quaternion, q2:Quaternion):void
// 	{
// 		let pw:number = q1.w * q2.w - q1.x * q2.x - q1.y * q2.y - q1.z * q2.z;
// 		let px:number = q1.w * q2.x + q1.x * q2.w + q1.y * q2.z - q1.z * q2.y;
// 		let py:number = q1.w * q2.y - q1.x * q2.z + q1.y * q2.w + q1.z * q2.x;
// 		let pz:number = q1.w * q2.z + q1.x * q2.y - q1.y * q2.x + q1.z * q2.w;
// 		this.w = pw;
// 		this.x = px;
// 		this.y = py;
// 		this.z = pz;
// 	}		
// 	mul(q:Quaternion):void
// 	{
// 		let pw:number = this.w * q.w - this.x * q.x - this.y * q.y - this.z * q.z;
// 		let px:number = this.w * q.x + this.x * q.w + this.y * q.z - this.z * q.y;
// 		let py:number = this.w * q.y - this.x * q.z + this.y * q.w + this.z * q.x;
// 		let pz:number = this.w * q.z + this.x * q.y - this.y * q.x + this.z * q.w;
// 		this.w = pw;
// 		this.x = px;
// 		this.y = py;
// 		this.z = pz;
// 	}
// 	mulNew(q2:Quaternion):Quaternion
// 	{
// 		let q:Quaternion = new Quaternion();
// 		q.w = this.w * q2.w - this.x * q2.x - this.y * q2.y - this.z * q2.z;
// 		q.x = this.w * q2.x + this.x * q2.w + this.y * q2.z - this.z * q2.y;
// 		q.y = this.w * q2.y - this.x * q2.z + this.y * q2.w + this.z * q2.x;
// 		q.z = this.w * q2.z + this.x * q2.y - this.y * q2.x + this.z * q2.w;
// 		return q;
// 	}
// 	/**
// 	 * 四元数乘以3D矢量 Vector3D,实现四元数对一个顶点的旋转
// 	 * @param				q		一个四元数对象
// 	 * @param				v		一个 3D矢量 Vector3D
// 	 * @param				outV	计算结果存放于一个 Vector3D 中
// 	 * */
// 	static quatMulV3(q:Quaternion, v:Vector3D, outV:Vector3D ):void
// 	{
// 		let xx:number = q.x * q.x;
// 		let yy:number = q.y * q.y;
// 		let zz:number = q.z * q.z;
// 		let xy:number = q.x * q.y;
// 		let yz:number = q.y * q.z;
// 		let xz:number = q.x * q.z;
// 		let sx:number = q.w * q.x;
// 		let sy:number = q.w * q.y;
// 		let sz:number = q.w * q.z;
// 		let tx:number = v.x * (0.5 - yy - zz) + v.y * (xy - sz) + v.z * (xz + sy);
// 		let ty:number = v.x * (xy + sz) + v.y * (0.5 - xx - zz) + v.z * (yz - sx);
// 		let tz:number = v.x * (xz - sy) + v.y * (yz + sx) + v.z * (0.5 - xx - yy);
// 		outV.x = tx * 2.0;
// 		outV.y = ty * 2.0;
// 		outV.z = tz * 2.0;
// 	}
// 	rotate(q:Quaternion, v:Vector3D):void
// 	{
// 		let pw:number = -q.x * v.x - q.y * v.y - q.z * v.z;
// 		let px:number = q.w * v.x + q.y * v.z - q.z * v.y;
// 		let py:number = q.w * v.y - q.x * v.z + q.z * v.x;
// 		let pz:number = q.w * v.z + q.x * v.y - q.y * v.x;
// 		this.w = q.w + pw * 0.5;
// 		this.x = q.x + px * 0.5;
// 		this.y = q.y + py * 0.5;
// 		this.z = q.z + pz * 0.5;
// 	}
// 	normalizeFrom(q:Quaternion):void
// 	{
// 		let len:number = Math.sqrt(q.w * q.w + q.x * q.x + q.y * q.y + q.z * q.z);
// 		if (len > MathConst.MATH_MIN_POSITIVE) len = 1.0 / len;
// 		this.w = q.w * len;
// 		this.x = q.x * len;
// 		this.y = q.y * len;
// 		this.z = q.z * len;
// 	}
// 	normalize():void
// 	{
// 		let len:number = Math.sqrt(this.w * this.w + this.x * this.x + this.y * this.y + this.z * this.z);
// 		if (len > MathConst.MATH_MIN_POSITIVE) len = 1 / len;
// 		this.w *= len;
// 		this.x *= len;
// 		this.y *= len;
// 		this.z *= len;
// 	}
// 	/*
// 	// 取反
// 	negate():void
// 	{
// 		w *= -1;
// 		x *= -1;
// 		y *= -1;
// 		z *= -1;
// 	}
// 	*/
// 	/**
// 	 * 得到当前 四元数的 逆
// 	 * */
// 	invert():void
// 	{
// 		this.adjoint();
// 		this.normalize();
// 	}
// 	/**
// 	 * 共轭
// 	 * */
// 	adjoint():void
// 	{
// 		this.x *= -1.0;
// 		this.y *= -1.0;
// 		this.z *= -1.0;
// 	}
// 	/**
// 	 * 共轭
// 	 * */
// 	adjointNew():Quaternion
// 	{			
// 		return new Quaternion(this.w,-1 * this.x, -1 * this.y,-1 * this.z);
// 	}
// 	getLength():number
// 	{
// 		return Math.sqrt(this.w * this.w + this.x * this.x + this.y * this.y + this.z * this.z);
// 	}
// 	copyFrom(q:Quaternion):void
// 	{
// 		this.w = q.w;
// 		this.x = q.x;
// 		this.y = q.y;
// 		this.z = q.z;
// 	}
// 	clone():Quaternion
// 	{
// 		return new Quaternion(this.w, this.x, this.y, this.z);
// 	}
// 	toString():String
// 	{
// 		return "Quaternion(" + this.w + ", " + this.x + ", " + this.y+ ", " + this.z + ")";
// 	}
// }
