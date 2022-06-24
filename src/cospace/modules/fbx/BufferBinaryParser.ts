import { BinaryReader } from "./BinaryReader";
import { FBXTree } from "./FBXTree";
// import * as fflate from '../libs/fflate.module.js';
import { BufPropertyParser } from "./BufPropertyParser";

// Parse an FBX file in Binary format
class BufferBinaryParser {

    private m_reader: BinaryReader = null;
    private m_allNodes: FBXTree = null;
    private m_version: number = 0;
    private m_parsing: boolean = false;
	private m_parsingIndex: number = 0;
	private subLossTime: number = 0;
	private nodeParsingTotal: number = 0;
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
	getReader(): BinaryReader {
		return this.m_reader;
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
		this.m_parsingIndex = 0;

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
		this.nodeParsingTotal = 0;
		if ( this.m_parsing ) {
			this.m_parsingIndex++
            let time = Date.now();
			const node = this.parseNode( reader, this.m_version );
            //console.log("### c0 BufferBinaryParser::parseNext(), lossTime: ", (Date.now() - time), "sub lossTime: ",this.subLossTime);
			// if(node != null) {
			// 	let ns = node.name != undefined ? "-"+node.name : "";
			// 	console.log("### parse("+this.m_parsingIndex+ns+") BufferBinaryParser::parseNext(), lossTime: ", (Date.now() - time)+"ms", "nodeParsingTotal: ",this.nodeParsingTotal);
			// }
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
	private m_isObjects: boolean = false;
	private m_isGeometry: boolean = false;
	// private m_ppFlag: number = 0;
	private m_debug: boolean = false;
	private m_pptParser: BufPropertyParser = new BufPropertyParser();
	// recursively parse nodes until the end of the file is reached
	private parseNode( reader: BinaryReader, version: number ): any {

		this.nodeParsingTotal++;

		const node: any = {};

		// The first three data sizes depends on version.
		const endOffset = ( version >= 7500 ) ? reader.getUint64() : reader.getUint32();
		const numProperties = ( version >= 7500 ) ? reader.getUint64() : reader.getUint32();

		( version >= 7500 ) ? reader.getUint64() : reader.getUint32(); // the returned propertyListLen is not used

		const nameLen = reader.getUint8();
		const name = reader.getString( nameLen );

		if(this.m_debug) {
			if(name == "Objects") {
				console.log("node have Objects A");
				this.m_isObjects = true;
			}
			if(this.m_isObjects && name == "Geometry") {
				this.m_isGeometry = true;
				console.log("node have Geometry A");
			}
			if(this.m_isGeometry && name != "") {
				console.log("parseNode(), name: ",name);
			}
		}
		// if(name == "Vertices") {
		// 	console.log("Vertices begin A.");
		// }
		// Regards this node as NULL-record if endOffset is zero
		if ( endOffset === 0 ) return null;

		const propertyList = new Array(numProperties);
		this.m_pptParser.ppFlag = 0;
		// if(name == "PolygonVertexIndex"){
		// 	this.m_ppFlag = 12;
		// }
		switch(name) {
			case "Vertices":
			case "Normals":
			case "PolygonVertexIndex":
			case "UV":
			case "NormalsIndex":
				this.m_pptParser.ppFlag = 12;
				break;
			case "Edges":
			case "NormalsW":
			case "Materials":
				this.m_pptParser.ppFlag = 131;
				break;
			default:
				break;
		}
		for ( let i = 0; i < numProperties; i ++ ) {
			propertyList[i] = this.m_pptParser.parseProperty( reader );
		}
		/*
		if(name == "Vertices") {
			console.log("parseNode name", name, " m_encoding: ", this.m_encoding, ",m_ppType: ",this.m_ppType);
			// console.log("Vertices begin m_encoding: ", this.m_encoding, ",m_ppType: ",this.m_ppType);
			console.log("Vertices begin propertyList: ", propertyList);

			// let u8Arr = reader.getArrayU8BufferByOffset( this.m_ppParams[0], this.m_ppParams[1] );
			// const data = fflate.unzlibSync( u8Arr, null );
			// const r2 = new BinaryReader( data.buffer );
			// let datafs = r2.getFloat64Array( this.m_ppParams[2] );
			// console.log("this.m_ppParams[1]: ",this.m_ppParams[1]);
			// console.log("pptlfs: ",propertyList[0]);
			// console.log("datafs: ",datafs);

		} else if(name == "Normals"){
			console.log("parseNode name", name, " m_encoding: ", this.m_encoding, ",m_ppType: ",this.m_ppType);
			console.log("Normals begin propertyList: ", propertyList);
		} else if(name == "UV"){
			console.log("parseNode name", name, " m_encoding: ", this.m_encoding, ",m_ppType: ",this.m_ppType);
			console.log("UV begin propertyList: ", propertyList);
		}
		//*/
		// if(name == "PolygonVertexIndex"){
		// 	console.log("parseNode name", name, " m_encoding: ", this.m_encoding, ",m_ppType: ",this.m_ppType);
		// 	console.log("PolygonVertexIndex begin propertyList: ", propertyList);
		// }
		// if(name == "PolygonVertexIndex"){
		// 	console.log("parseNode name", name, " m_encoding: ", this.m_encoding, ",m_ppType: ",this.m_ppType);
		// 	console.log("PolygonVertexIndex begin propertyList: ", propertyList);
		// }
		// if(name == "NormalsIndex"){
		// 	console.log("parseNode name", name, " m_encoding: ", this.m_pptParser.encoding, ",m_ppType: ",this.m_pptParser.ppType);
		// 	console.log("NormalsIndex begin propertyList: ", propertyList);
		// }
		//
		// else if(name == "LayerElementUV"){
		// 	console.log("LayerElementUV begin propertyList: ", propertyList);
		// }
		//
		// Regards the first three elements in propertyList as id, attrName, and attrType
		const id = propertyList.length > 0 ? propertyList[ 0 ] : '';
		const attrName = propertyList.length > 1 ? propertyList[ 1 ] : '';
		const attrType = propertyList.length > 2 ? propertyList[ 2 ] : '';

		// check if this node represents just a single property
		// like (name, 0) set or (name2, [0, 1, 2]) set of {name: 0, name2: [0, 1, 2]}
		node.singleProperty = ( numProperties === 1 && reader.getOffset() === endOffset ) ? true : false;
		// console.log("endOffset: ",endOffset, ", reader.getOffset(): ", reader.getOffset());
		// let ps = reader.getOffset();
		// while ( endOffset > ps ) {
		while ( endOffset > reader.getOffset() ) {

			const subNode = this.parseNode( reader, version );

			if ( subNode !== null ) this.parseSubNode( name, node, subNode );

		}
		node.propertyList = propertyList; // raw property list used by parent

		if ( typeof id === 'number' ) node.id = id;
		if ( attrName !== '' ) node.attrName = attrName;
		if ( attrType !== '' ) node.attrType = attrType;
		if ( name !== '' ) node.name = name;
		/*
		if(name == "Vertices") {
			console.log("Vertices begin B.");
		}
		if(this.m_debug) {
			if(name == "Geometry") {
				console.log("node have Geometry B");
			}
			if(name == "Objects") {
				console.log("node have Objects B");
			}
		}
		//*/
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

			let ls = subNode.propertyList;
			// console.log("BinaryParser::parseSubNode(), ls: ",ls);
			let len = (ls.length - 1);
			if(len < 0) len = 0;
			const array:any[] = new Array(len);
			for(let i = 1, j = 0; i < ls.length; ++i) {
				array[j] = ls[i];
				j++;
			}

			if ( node.connections === undefined ) {

				node.connections = [];

			}

			// console.log("BinaryParser::parseSubNode(), node.connections.push( array ): ",array);
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
}

export { BufferBinaryParser }