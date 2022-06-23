import MathConst from './MathConst';
import Vector3D from './Vector3D';
import Matrix4 from './Matrix4';
import {Quaternion} from './Quaternion';

const _matrix = new Matrix4();
const _quaternion = new Quaternion();

class Euler {
	
	static readonly DefaultOrder = 'XYZ';
	static readonly RotationOrders = [ 'XYZ', 'YZX', 'ZXY', 'XZY', 'YXZ', 'ZYX' ];
	isEuler: boolean;
	private _x: number;
	private _y: number;
	private _z: number;
	private _order: string;
	constructor( x = 0, y = 0, z = 0, order = Euler.DefaultOrder ) {

		this.isEuler = true;

		this._x = x;
		this._y = y;
		this._z = z;
		this._order = order;

	}

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

	get z() {

		return this._z;

	}

	set z( value: number ) {

		this._z = value;
	}

	get order(): string {

		return this._order;

	}

	set order( value: string ) {

		this._order = value;
	}

	set( x: number, y: number, z: number, order: string = this._order ) {

		this._x = x;
		this._y = y;
		this._z = z;
		this._order = order;

		return this;

	}

	clone() {

		return new Euler( this._x, this._y, this._z, this._order );

	}

	copy( euler: Euler ) {

		this._x = euler._x;
		this._y = euler._y;
		this._z = euler._z;
		this._order = euler._order;
		
		return this;

	}

	setFromRotationMatrix( m: Matrix4, order: string = this._order, update: boolean = true ): Euler {

		// assumes the upper 3x3 of m is a pure rotation matrix (i.e, unscaled)

		const te = m.getLocalFS32();
		const m11 = te[ 0 ], m12 = te[ 4 ], m13 = te[ 8 ];
		const m21 = te[ 1 ], m22 = te[ 5 ], m23 = te[ 9 ];
		const m31 = te[ 2 ], m32 = te[ 6 ], m33 = te[ 10 ];
		let clamp = MathConst.Clamp;
		switch ( order ) {

			case 'XYZ':

				this._y = Math.asin( MathConst.Clamp( m13, - 1, 1 ) );

				if ( Math.abs( m13 ) < 0.9999999 ) {

					this._x = Math.atan2( - m23, m33 );
					this._z = Math.atan2( - m12, m11 );

				} else {

					this._x = Math.atan2( m32, m22 );
					this._z = 0;

				}

				break;

			case 'YXZ':

				this._x = Math.asin( - clamp( m23, - 1, 1 ) );

				if ( Math.abs( m23 ) < 0.9999999 ) {

					this._y = Math.atan2( m13, m33 );
					this._z = Math.atan2( m21, m22 );

				} else {

					this._y = Math.atan2( - m31, m11 );
					this._z = 0;

				}

				break;

			case 'ZXY':

				this._x = Math.asin( clamp( m32, - 1, 1 ) );

				if ( Math.abs( m32 ) < 0.9999999 ) {

					this._y = Math.atan2( - m31, m33 );
					this._z = Math.atan2( - m12, m22 );

				} else {

					this._y = 0;
					this._z = Math.atan2( m21, m11 );

				}

				break;

			case 'ZYX':

				this._y = Math.asin( - clamp( m31, - 1, 1 ) );

				if ( Math.abs( m31 ) < 0.9999999 ) {

					this._x = Math.atan2( m32, m33 );
					this._z = Math.atan2( m21, m11 );

				} else {

					this._x = 0;
					this._z = Math.atan2( - m12, m22 );

				}

				break;

			case 'YZX':

				this._z = Math.asin( clamp( m21, - 1, 1 ) );

				if ( Math.abs( m21 ) < 0.9999999 ) {

					this._x = Math.atan2( - m23, m22 );
					this._y = Math.atan2( - m31, m11 );

				} else {

					this._x = 0;
					this._y = Math.atan2( m13, m33 );

				}

				break;

			case 'XZY':

				this._z = Math.asin( - clamp( m12, - 1, 1 ) );

				if ( Math.abs( m12 ) < 0.9999999 ) {

					this._x = Math.atan2( m32, m22 );
					this._y = Math.atan2( m13, m11 );

				} else {

					this._x = Math.atan2( - m23, m33 );
					this._y = 0;

				}

				break;

			default:

				console.warn( 'Euler: .setFromRotationMatrix() encountered an unknown order: ' + order );

		}

		this._order = order;

		return this;

	}
	
	setFromQuaternion( q: Quaternion, order: string, update: boolean = true ): Euler {

		_matrix.makeRotationFromQuaternion( q );

		return this.setFromRotationMatrix( _matrix, order, update );

	}

	setFromVector3( v: Vector3D, order: string = this._order ) {

		return this.set( v.x, v.y, v.z, order );

	}

	reorder( newOrder: string ): Euler {

		// WARNING: this discards revolution information -bhouston

		_quaternion.setFromEuler( this );

		return this.setFromQuaternion( _quaternion, newOrder );

	}

	equals( euler: Euler ): boolean {

		return ( euler._x === this._x ) && ( euler._y === this._y ) && ( euler._z === this._z ) && ( euler._order === this._order );

	}

	fromArray( array: any[] ): Euler {

		this._x = array[ 0 ];
		this._y = array[ 1 ];
		this._z = array[ 2 ];
		if ( array[ 3 ] !== undefined ) this._order = array[ 3 ];

		return this;

	}

	toArray( array: any = [], offset = 0 ): any[] {

		array[ offset ] = this._x;
		array[ offset + 1 ] = this._y;
		array[ offset + 2 ] = this._z;
		array[ offset + 3 ] = this._order;

		return array;

	}


	// @deprecated since r138, 02cf0df1cb4575d5842fef9c85bb5a89fe020d53

	toVector3() {

		console.error( 'THREE.Euler: .toVector3() has been removed. Use Vector3.setFromEuler() instead' );

	}

}


export { Euler };
