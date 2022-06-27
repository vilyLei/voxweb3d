import { BinaryReader } from "./BinaryReader";
import * as fflate from '../libs/fflate.module.js';

// Parse an FBX file in Binary format
class BufPropertyParser {

    constructor(){}

	ppFlag: number = 0;
	encoding: number = 0;
	ppType: string = "";
	parseDirec( reader: BinaryReader, params: any[]): any[] {
		if(params.length < 1) {
			return [];
		}
		// let offset: number, type: string, arrayLength: number, encoding: number, compressedLength: number
		//[bufOffset, compressedLength, arrayLength, encoding, type];
		// console.log("BufPropertyParser::parseDirec(), params: ",params);
		let offset: number = params[0];
		let compressedLength: number = params[1];
		let arrayLength = params[2];
		let encoding = params[3];
		let type = params[4];

		// let type: string = , arrayLength: number, encoding: number, compressedLength: number
		reader.setOffset(offset);
		// let length;
		// console.log("parseProperty(), type: ",type);
		switch ( type ) {

			case 'b':
			case 'c':
			case 'd':
			case 'f':
			case 'i':
			case 'l':
				if ( encoding === 0 ) {

					switch ( type ) {

						case 'b':
						case 'c':
							return reader.getBooleanArray( arrayLength );

						case 'd':
							return reader.getFloat64Array( arrayLength );

						case 'f':
							return reader.getFloat32Array( arrayLength );

						case 'i':
							return reader.getInt32Array( arrayLength );

						case 'l':
							return reader.getInt64Array( arrayLength );

					}

				}

				if ( typeof fflate === 'undefined' ) {
					console.error( 'BufPropertyParser::parseDirec() External library fflate.min.js required.' );
				}
				let u8Arr = reader.getArrayU8Buffer( compressedLength );
				// let t = Date.now();
				// console.log("parseProperty reader2...u8Arr.length: ", u8Arr.length);
				const data = fflate.unzlibSync( u8Arr, null );
				let reader2: BinaryReader = new BinaryReader( data.buffer );
				// console.log(type,"parseProperty reader2...data.length: ", MathConst.CalcCeilPowerOfTwo(data.length), data.length);
				// console.log("unzlibSync loss time: ", (Date.now() - t));
				// this.subLossTime += (Date.now() - t);
				// console.log("XXXX is Geometry data.length: ",data.length,", compressedLength: ",compressedLength);
				switch ( type ) {

					case 'b':
					case 'c':
						return reader2.getBooleanArray( arrayLength );

					case 'd':
						//return [bufOffset, bufSize, arrayLength];
						//this.m_ppParams = [bufOffset, bufSize, arrayLength];
						// TODO(vily): 为了测试千万级三角面的的数据读取
						// try{
						return reader2.getFloat64Array( arrayLength );
						// }catch(e) {
						// 	console.log("errrrro arrayLength: ",arrayLength);
						// 	throw Error(e);
						// }

					case 'f':
						return reader2.getFloat32Array( arrayLength );

					case 'i':
						
						return reader2.getInt32Array( arrayLength );

					case 'l':
						return reader2.getInt64Array( arrayLength );

				}

			default:
				throw new Error( 'BufPropertyParser::parseDirec() Unknown property type ' + type );

		}
	}
	private getArrayByteLength(type: string, arrayLength: number): number {
		switch ( type ) {

			case 'd':
			case 'l':
				return arrayLength * 8;
			case 'f':
			case 'i':
				return arrayLength * 4;
			default:
				break;

		}
		return arrayLength;
	}
	parseProperty( reader: BinaryReader ) {

		const type = reader.getString( 1 );
		let length;
		this.encoding = 0;
		this.ppType = type;
		// console.log("parseProperty(), type: ",type);
		switch ( type ) {

			case 'C':
				return reader.getBoolean();

			case 'D':
				return reader.getFloat64();

			case 'F':
				return reader.getFloat32();

			case 'I':
				return reader.getInt32();

			case 'L':
				return reader.getInt64();

			case 'R':
				length = reader.getUint32();
				return reader.getArrayBuffer( length );

			case 'S':
				length = reader.getUint32();
				return reader.getString( length );

			case 'Y':
				return reader.getInt16();

			case 'b':
			case 'c':
			case 'd':
			case 'f':
			case 'i':
			case 'l':

				const arrayLength = reader.getUint32();
				const encoding = reader.getUint32(); // 0: non-compressed, 1: compressed
				const compressedLength = reader.getUint32();
				this.encoding = encoding;

				let bufOffset = reader.getOffset();
				
				let skipLen = encoding === 0 ? this.getArrayByteLength(type, arrayLength) : compressedLength;
				if(this.ppFlag == 12) {
					// console.log("%%%%% skipLen: ",skipLen, type, encoding);
					reader.skip( skipLen );
					return [bufOffset, compressedLength, arrayLength, encoding, type];
				}else if(this.ppFlag == 131) {
					// console.log("%%%%% skipLen: ",skipLen, type, encoding);
					reader.skip( skipLen );
					return [];
				}
				if ( encoding === 0 ) {

					switch ( type ) {

						case 'b':
						case 'c':
							return reader.getBooleanArray( arrayLength );

						case 'd':
							return reader.getFloat64Array( arrayLength );

						case 'f':
							return reader.getFloat32Array( arrayLength );

						case 'i':
							return reader.getInt32Array( arrayLength );

						case 'l':
							return reader.getInt64Array( arrayLength );

					}

				}

				if ( typeof fflate === 'undefined' ) {
					console.error( 'BufPropertyParser::parseProperty() External library fflate.min.js required.' );
				}
				// let u8Arr = new Uint8Array( reader.getArrayBuffer( compressedLength ) );
				// // console.log("parseProperty reader2...u8Arr.length: ", u8Arr.length);
				// const data = fflate.unzlibSync( u8Arr, null );
				// const reader2 = new BinaryReader( data.buffer );
				
				let u8Arr = reader.getArrayU8Buffer( compressedLength );
				// let t = Date.now();
				const data = fflate.unzlibSync( u8Arr, null );
				let reader2: BinaryReader = new BinaryReader( data.buffer );
				// console.log(type,"parseProperty reader2...data.length: ", MathConst.CalcCeilPowerOfTwo(data.length), data.length);
				// console.log("unzlibSync loss time: ", (Date.now() - t));
				// this.subLossTime += (Date.now() - t);
				// console.log("XXXX is Geometry data.length: ",data.length,", compressedLength: ",compressedLength);
				switch ( type ) {

					case 'b':
					case 'c':
						return reader2.getBooleanArray( arrayLength );

					case 'd':
						//this.m_ppParams = [bufOffset, bufSize, arrayLength];
						// TODO(vily): 为了测试单个几何模型千万级三角面的的数据读取
						// try{
						return reader2.getFloat64Array( arrayLength );
						// }catch(e) {
						// 	console.log("errrrro arrayLength: ",arrayLength);
						// 	throw Error(e);
						// }

					case 'f':
						return reader2.getFloat32Array( arrayLength );

					case 'i':
						
						return reader2.getInt32Array( arrayLength );

					case 'l':
						return reader2.getInt64Array( arrayLength );

				}

			default:
				throw new Error( 'BufPropertyParser::parseProperty() Unknown property type ' + type );

		}
	}
}

export { BufPropertyParser }