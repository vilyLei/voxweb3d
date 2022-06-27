
import { LoaderUtils } from "../loaders/LoaderUtils";

class BinaryReader {

    dv: DataView;
    offset: number;
    littleEndian: boolean;

	constructor( buffer: ArrayBuffer, littleEndian?: boolean ) {

		this.dv = new DataView( buffer );
		this.offset = 0;
		this.littleEndian = ( littleEndian !== undefined ) ? littleEndian : true;

	}

	getOffset(): number {

		return this.offset;

	}

	size(): number {

		return this.dv.buffer.byteLength;

	}

	skip( length: number ) {

		this.offset += length;

	}
	setOffset( offset: number ) {

		this.offset = offset;

	}

	// seems like true/false representation depends on exporter.
	// true: 1 or 'Y'(=0x59), false: 0 or 'T'(=0x54)
	// then sees LSB.
	getBoolean() {

		return ( this.getUint8() & 1 ) === 1;

	}

	getBooleanArray( size: number ): boolean[] {

		// const a = [];
		// for ( let i = 0; i < size; i ++ ) {
		// 	a.push( this.getBoolean() );
		// }
		// return a;

		const a = new Array(size);
		for ( let i = 0; i < size; i ++ ) {
			a[i] = this.getBoolean();
		}
		return a;
	}

	getUint8() {

		const value = this.dv.getUint8( this.offset );
		this.offset += 1;
		return value;

	}

	getInt16() {

		const value = this.dv.getInt16( this.offset, this.littleEndian );
		this.offset += 2;
		return value;

	}

	getInt32(): number {

		const value = this.dv.getInt32( this.offset, this.littleEndian );
		this.offset += 4;
		return value;

	}

	getInt32Array( size: number ): number[] {

		// const a: number[] = [];
		// for ( let i = 0; i < size; i ++ ) {
		// 	a.push( this.getInt32() );
		// }
		// return a;

		const a: number[] = new Array( size );
		for ( let i = 0; i < size; i ++ ) {
			a[i] = this.getInt32();
		}
		return a;

	}

	getUint32(): number {

		const value = this.dv.getUint32( this.offset, this.littleEndian );
		this.offset += 4;
		return value;

	}

	// JavaScript doesn't support 64-bit integer so calculate this here
	// 1 << 32 will return 1 so using multiply operation instead here.
	// There's a possibility that this method returns wrong value if the value
	// is out of the range between Number.MAX_SAFE_INTEGER and Number.MIN_SAFE_INTEGER.
	// TODO: safely handle 64-bit integer
	getInt64(): number {

		let low, high;

		if ( this.littleEndian ) {

			low = this.getUint32();
			high = this.getUint32();

		} else {

			high = this.getUint32();
			low = this.getUint32();

		}

		// calculate negative value
		if ( high & 0x80000000 ) {

			high = ~ high & 0xFFFFFFFF;
			low = ~ low & 0xFFFFFFFF;

			if ( low === 0xFFFFFFFF ) high = ( high + 1 ) & 0xFFFFFFFF;

			low = ( low + 1 ) & 0xFFFFFFFF;

			return - ( high * 0x100000000 + low );

		}

		return high * 0x100000000 + low;

	}

	getInt64Array( size: number ): number[] {

		// const a: number[] = [];
		// for ( let i = 0; i < size; i ++ ) {
		// 	a.push( this.getInt64() );
		// }
		// return a;

		const a: number[] = new Array(size);
		for ( let i = 0; i < size; i ++ ) {
			a[i] = this.getInt64();
		}
		return a;

	}

	// Note: see getInt64() comment
	getUint64(): number {

		let low: number, high: number;

		if ( this.littleEndian ) {

			low = this.getUint32();
			high = this.getUint32();

		} else {

			high = this.getUint32();
			low = this.getUint32();

		}

		return high * 0x100000000 + low;

	}

	getFloat32(): number {

		const value = this.dv.getFloat32( this.offset, this.littleEndian );
		this.offset += 4;
		return value;

	}

	getFloat32Array( size: number ): number[] {

		// const a = [];
		// for ( let i = 0; i < size; i ++ ) {
		// 	a.push( this.getFloat32() );
		// }
		// return a;

		const a = new Array(size);
		for ( let i = 0; i < size; i ++ ) {
			a[i] = this.getFloat32();
		}
		return a;

	}

	getFloat64(): number {
		const value = this.dv.getFloat64( this.offset, this.littleEndian );
		this.offset += 8;
		return value;
		// try{
		// const value = this.dv.getFloat64( this.offset, this.littleEndian );
		// this.offset += 8;
		// return value;
		// }catch(e) {
		// 	console.log("EEEEEerror this.offset: ",this.offset);
		// 	throw Error(e);
		// }
		// return 0;
	}

	getFloat64Array( size: number ): number[] {

		// const a: number[] = [];
		// for ( let i = 0; i < size; i ++ ) {
		// 	a.push( this.getFloat64() );
		// }
		// return a;

		const a: number[] = new Array( size );
		for ( let i = 0; i < size; i ++ ) {
			a[i] = this.getFloat64();
			// try{
			// 	a[i] = this.getFloat64();
			// }catch(e) {
			// 	console.log("EEEEEerror size: ",size);
			// 	throw Error(e);
			// }
		}
		return a;

	}

	getArrayBuffer( size: number ): ArrayBuffer {

		const value = this.dv.buffer.slice( this.offset, this.offset + size );
		this.offset += size;
		return value;
		// let u8Arr = new Uint8Array( this.dv.buffer );
		// const value = u8Arr.subarray( this.offset, this.offset + size );
		// this.offset += size;
		// // console.log("getArrayBuffer() use size: ", size);
		// return value.buffer;
		// console.log("aaa",value.length);
		// return (value.slice()).buffer;
	}
	
	getArrayU8Buffer( size: number ): Uint8Array {
		let u8Arr = new Uint8Array( this.dv.buffer );
		const value = u8Arr.subarray( this.offset, this.offset + size );
		this.offset += size;
		// console.log("getArrayU8Buffer() use size: ", size);
		return value;
	}

	getArrayU8BufferByOffset( offset: number, size: number ): Uint8Array {
		let u8Arr = new Uint8Array( this.dv.buffer );
		return u8Arr.subarray( offset, offset + size );
	}
	getString( size: number ): string {

		// note: safari 9 doesn't support Uint8Array.indexOf; create intermediate array instead
		// let a: number[] = [];
		// for ( let i = 0; i < size; i ++ ) {
		// 	a[ i ] = this.getUint8();
		// }
		let a: number[] = new Array(size);
		for ( let i = 0; i < size; i ++ ) {
			a[ i ] = this.getUint8();
		}

		const nullByte = a.indexOf( 0 );
		if ( nullByte >= 0 ) a = a.slice( 0, nullByte );

		return LoaderUtils.decodeText( new Uint8Array( a ) );

	}

}

export { BinaryReader }