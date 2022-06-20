import { BinaryReader } from "./BinaryReader";
import { FBXTree } from "./FBXTree";
import * as fflate from '../libs/fflate.module.js';
import MathConst from "../../../vox/math/MathConst";

// Parse an FBX file in Binary format
class BinaryParser {

    private m_reader: BinaryReader = null;
    private m_allNodes: FBXTree = null;
    private m_version: number = 0;
    private m_parsing: boolean = false;
	private subLossTime: number = 0;
    constructor(){}

	parse( buffer: ArrayBuffer ): FBXTree {

		const reader = new BinaryReader( buffer );
		reader.skip( 23 ); // skip magic 23 bytes

		const version = reader.getUint32();

		if ( version < 6400 ) {

			throw new Error( 'FBXLoader: FBX version not supported, FileVersion: ' + version );

		}

		const allNodes = new FBXTree();
		while ( ! this.endOfContent( reader ) ) {

			const node = this.parseNode( reader, version );
			if ( node !== null ) allNodes.add( node.name, node );
		}

		return allNodes;

	}

    getFBXTree(): FBXTree {
        return this.m_allNodes;
    }
    parseBegin( buffer: ArrayBuffer ): FBXTree {

		let reader = new BinaryReader( buffer );
		reader.skip( 23 ); // skip magic 23 bytes

		const version = reader.getUint32();
		if ( version < 6400 ) {

			throw new Error( 'FBXLoader: FBX version not supported, FileVersion: ' + version );

		}

        this.m_reader = reader;
        this.m_version = version;

		let allNodes = new FBXTree();
        this.m_allNodes = allNodes;
        this.m_parsing = !this.endOfContent( reader );
        
		return allNodes;

	}
    parseNext(): void {
        const allNodes = this.m_allNodes;
        const reader = this.m_reader;
        this.m_parsing = !this.endOfContent( reader );
		this.subLossTime = 0;
		if ( this.m_parsing ) {
            let time = Date.now();
			const node = this.parseNode( reader, this.m_version );
            console.log("### c0 BinaryParser::parseNext(), lossTime: ", (Date.now() - time), "sub lossTime: ",this.subLossTime);
			if ( node !== null ) allNodes.add( node.name, node );
		}
    }
    
	isParsing(): boolean {
        return this.m_parsing;
    }


	// Check if reader has reached the end of content.
	private endOfContent( reader: BinaryReader ) {

		// footer size: 160bytes + 16-byte alignment padding
		// - 16bytes: magic
		// - padding til 16-byte alignment (at least 1byte?)
		//	(seems like some exporters embed fixed 15 or 16bytes?)
		// - 4bytes: magic
		// - 4bytes: version
		// - 120bytes: zero
		// - 16bytes: magic
		if ( reader.size() % 16 === 0 ) {

			return ( ( reader.getOffset() + 160 + 16 ) & ~ 0xf ) >= reader.size();

		} else {

			return reader.getOffset() + 160 + 16 >= reader.size();

		}

	}

	totalBP: number = 0;
	totalBPTime: number = 0;
	// recursively parse nodes until the end of the file is reached
	private parseNode( reader: BinaryReader, version: number ): any {

		const node: any = {};

		// The first three data sizes depends on version.
		const endOffset = ( version >= 7500 ) ? reader.getUint64() : reader.getUint32();
		const numProperties = ( version >= 7500 ) ? reader.getUint64() : reader.getUint32();

		( version >= 7500 ) ? reader.getUint64() : reader.getUint32(); // the returned propertyListLen is not used

		const nameLen = reader.getUint8();
		const name = reader.getString( nameLen );

		// Regards this node as NULL-record if endOffset is zero
		if ( endOffset === 0 ) return null;

		const propertyList = new Array(numProperties);

		for ( let i = 0; i < numProperties; i ++ ) {

			// propertyList.push( this.parseProperty( reader ) );
			propertyList[i] = this.parseProperty( reader );

		}

		// Regards the first three elements in propertyList as id, attrName, and attrType
		const id = propertyList.length > 0 ? propertyList[ 0 ] : '';
		const attrName = propertyList.length > 1 ? propertyList[ 1 ] : '';
		const attrType = propertyList.length > 2 ? propertyList[ 2 ] : '';

		// check if this node represents just a single property
		// like (name, 0) set or (name2, [0, 1, 2]) set of {name: 0, name2: [0, 1, 2]}
		node.singleProperty = ( numProperties === 1 && reader.getOffset() === endOffset ) ? true : false;

		while ( endOffset > reader.getOffset() ) {

			const subNode = this.parseNode( reader, version );

			if ( subNode !== null ) this.parseSubNode( name, node, subNode );

		}
		node.propertyList = propertyList; // raw property list used by parent

		if ( typeof id === 'number' ) node.id = id;
		if ( attrName !== '' ) node.attrName = attrName;
		if ( attrType !== '' ) node.attrType = attrType;
		if ( name !== '' ) node.name = name;

		return node;

	}

	private parseSubNode( name: string, node: any, subNode: any ): void {

		// special case: child node is single property
		if ( subNode.singleProperty === true ) {

			const value = subNode.propertyList[ 0 ];

			if ( value.buffer != undefined) {
				console.log("parseSubNode(), value.buffer.byteLength: ", value.buffer.byteLength);
			}
			//if ( Array.isArray( value ) ) {
			if ( value instanceof Array) {

				node[ subNode.name ] = subNode;

				subNode.a = value;

			} else {
				//console.log("value: ",value, typeof value);
				node[ subNode.name ] = value;

			}

		} else if ( name === 'Connections' && subNode.name === 'C' ) {

			// const array:any[] = [];
			// // console.log("subNode.propertyList.length: ",subNode.propertyList.length);
			// subNode.propertyList.forEach( function ( property: any, i: number ) {
			// 	// first Connection is FBX type (OO, OP, etc.). We'll discard these
			// 	if ( i !== 0 ) array.push( property );
			// } );
			let ls = subNode.propertyList;
			const array:any[] = new Array(ls.length);
			for(let i = 1, j = 0; i < ls.length; ++i) {
				array[j] = ls[i];
			}

			if ( node.connections === undefined ) {

				node.connections = [];

			}

			node.connections.push( array );

		} else if ( subNode.name === 'Properties70' ) {

			const keys = Object.keys( subNode );

			keys.forEach( function ( key ) {

				node[ key ] = subNode[ key ];

			} );

		} else if ( name === 'Properties70' && subNode.name === 'P' ) {

			let innerPropName = subNode.propertyList[ 0 ];
			let innerPropType1 = subNode.propertyList[ 1 ];
			const innerPropType2 = subNode.propertyList[ 2 ];
			const innerPropFlag = subNode.propertyList[ 3 ];
			let innerPropValue;

			if ( innerPropName.indexOf( 'Lcl ' ) === 0 ) innerPropName = innerPropName.replace( 'Lcl ', 'Lcl_' );
			if ( innerPropType1.indexOf( 'Lcl ' ) === 0 ) innerPropType1 = innerPropType1.replace( 'Lcl ', 'Lcl_' );

			if ( innerPropType1 === 'Color' || innerPropType1 === 'ColorRGB' || innerPropType1 === 'Vector' || innerPropType1 === 'Vector3D' || innerPropType1.indexOf( 'Lcl_' ) === 0 ) {

				innerPropValue = [
					subNode.propertyList[ 4 ],
					subNode.propertyList[ 5 ],
					subNode.propertyList[ 6 ]
				];

			} else {

				innerPropValue = subNode.propertyList[ 4 ];

			}

			// this will be copied to parent, see above
			node[ innerPropName ] = {

				'type': innerPropType1,
				'type2': innerPropType2,
				'flag': innerPropFlag,
				'value': innerPropValue

			};

		} else if ( node[ subNode.name ] === undefined ) {

			if ( typeof subNode.id === 'number' ) {

				node[ subNode.name ] = {};
				node[ subNode.name ][ subNode.id ] = subNode;

			} else {

				node[ subNode.name ] = subNode;

			}

		} else {

			if ( subNode.name === 'PoseNode' ) {

				if ( ! Array.isArray( node[ subNode.name ] ) ) {

					node[ subNode.name ] = [ node[ subNode.name ] ];

				}

				node[ subNode.name ].push( subNode );

			} else if ( node[ subNode.name ][ subNode.id ] === undefined ) {

				node[ subNode.name ][ subNode.id ] = subNode;

			}

		}

	}
	private parseProperty( reader: BinaryReader ) {

		const type = reader.getString( 1 );
		let length;

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
				console.log("parseProperty R..., length: ",length);
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

					console.error( 'FBXLoader: External library fflate.min.js required.' );

				}
				// let u8Arr = new Uint8Array( reader.getArrayBuffer( compressedLength ) );
				// // console.log("parseProperty reader2...u8Arr.length: ", u8Arr.length);
				// const data = fflate.unzlibSync( u8Arr, null ); // eslint-disable-line no-undef
				// const reader2 = new BinaryReader( data.buffer );

				let u8Arr = reader.getArrayU8Buffer( compressedLength );
				// let t = Date.now();
				// console.log("parseProperty reader2...u8Arr.length: ", u8Arr.length);
				const data = fflate.unzlibSync( u8Arr, null ); // eslint-disable-line no-undef
				const reader2 = new BinaryReader( data.buffer );
				// console.log(type,"parseProperty reader2...data.length: ", MathConst.CalcCeilPowerOfTwo(data.length), data.length);
				// console.log("unzlibSync loss time: ", (Date.now() - t));
				// this.subLossTime += (Date.now() - t);
				switch ( type ) {

					case 'b':
					case 'c':
						return reader2.getBooleanArray( arrayLength );

					case 'd':
						// TODO(vily): 为了测试千万级三角面的的数据读取
						try{
							return reader2.getFloat64Array( arrayLength );
						}catch(e) {
							console.log("errrrro arrayLength: ",arrayLength);
							throw Error(e);
						}

					case 'f':
						return reader2.getFloat32Array( arrayLength );

					case 'i':
						return reader2.getInt32Array( arrayLength );

					case 'l':
						return reader2.getInt64Array( arrayLength );

				}

			default:
				throw new Error( 'FBXLoader: Unknown property type ' + type );

		}
	}

}

export { BinaryParser }