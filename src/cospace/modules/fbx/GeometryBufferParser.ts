import { getData } from "./Utils";
import { FBXTreeMap } from "./FBXTree";
import { FBXBufferObject } from "./FBXBufferObject";
import { BinaryReader } from "./BinaryReader";
import * as fflate from '../libs/fflate.module.js';

// parse Geometry data from FBXTree and return map of BufferGeometries
class GeometryBufferParser {

	private m_idLst: number[];
	private m_nodeIDList: string[];
	private m_parseTotal: number = 0;
	private m_deformers: any;
	private m_fbxTree: FBXTreeMap;
	private m_connections: Map<number, any>;
	private m_reader: BinaryReader = null;
	
	constructor(){}

	setReader(reader: BinaryReader): void {
		this.m_reader = reader;
	}
	parseGeomBuf( deformers: any, fbxTree: FBXTreeMap, connections: Map<number, any>,  immediate: boolean = true): Map<number, FBXBufferObject> {

		const geometryMap: Map<number, FBXBufferObject> = new Map();
		
		if ( 'Geometry' in fbxTree.Objects ) {

			const geoNodes = fbxTree.Objects.Geometry;
			let id: number = 0;
			let idLst: number[] = [];
			let nodeIDList: string[] = [];
			this.m_idLst = idLst;
			this.m_nodeIDList = nodeIDList;
			// for ( const nodeID in geoNodes ) {
			// 	id = parseInt( nodeID );
			// 	const relationships = connections.get( id );
			// 	const geoBuf = this.parseGeometryBuffer( relationships, geoNodes[ nodeID ], deformers, fbxTree );
			// 	geometryMap.set( id, geoBuf );
			// }
			for ( const nodeID in geoNodes ) {
				idLst.push( parseInt( nodeID ) );
				nodeIDList.push(nodeID);
			}
			for(let i: number = 0; i < idLst.length; ++i) {
				id = idLst[i];
				const relationships = connections.get( id );
				const geoBuf = this.parseGeometryBuffer( relationships, geoNodes[ nodeIDList[i] ], deformers, fbxTree );
				geometryMap.set( id, geoBuf );
			}
			// console.log("geoInfo.vertexIndices.length: ", geoInfo.vertexIndices.length);
			// console.log("geometryMap: ",geometryMap);
		}
		
		return geometryMap;

	}
	
	parseGeomBufBegin( deformers: any, fbxTree: FBXTreeMap, connections: Map<number, any>): void {

		//const geometryMap: Map<number, FBXBufferObject> = new Map();
		
		if ( 'Geometry' in fbxTree.Objects ) {

			this.m_deformers = deformers;
			this.m_fbxTree = fbxTree;
			this.m_connections = connections;
			this.m_idLst = [];
			this.m_nodeIDList = [];
			const geoNodes = fbxTree.Objects.Geometry;
			for ( const nodeID in geoNodes ) {
				this.m_idLst.push( parseInt( nodeID ) );
				this.m_nodeIDList.push(nodeID);
			}
			this.m_parseTotal = this.m_idLst.length;
		}
		
		//return geometryMap;

	}
	getGeomBufId(): number {
		if(this.isParsing()) {
			return this.m_idLst[this.m_idLst.length - 1];
		}
		return -1;
	}
	parseGeomBufNext(): FBXBufferObject {
		if(this.isParsing()) {
			const geoNodes = this.m_fbxTree.Objects.Geometry;
			let id = this.m_idLst.pop();
			const relationships = this.m_connections.get( id );
			let obj = this.parseGeometryBuffer( relationships, geoNodes[ this.m_nodeIDList.pop() ], this.m_deformers, this.m_fbxTree );
			if(!this.isParsing()) {
				this.m_reader = null;
			}
			return obj;
		}
		return null;
	}
	isParsing(): boolean {
		return this.m_idLst != null && this.m_idLst.length > 0;
	}
	getParseTotal(): number {
		return this.m_parseTotal;
	}

	// Parse single node in FBXTree.Objects.Geometry
	private parseGeometryBuffer( relationships: any, geoNode: any, deformers: any, fbxTree: FBXTreeMap ): FBXBufferObject {

		switch ( geoNode.attrType ) {

			case 'Mesh':
				return this.parseMeshGeometryBuffer( relationships, geoNode, deformers, fbxTree );
				break;

			case 'NurbsCurve':
				return this.parseNurbsGeometry( geoNode );
				break;

		}

	}

	// Parse single node mesh geometry in FBXTree.Objects.Geometry
	private parseMeshGeometryBuffer( relationships: any, geoNode: any, deformers: any, fbxTree: FBXTreeMap ): FBXBufferObject {

		//console.log("GeometryBufferParser::genGeometryBuffers(), skeleton: ",skeleton);
		// let time = Date.now();
		const geoInfo = this.parseGeoNode( geoNode );
		// let lossTime: number = Date.now() - time;
		// console.log("XXX geoInfo lossTime: ", lossTime);
		const buffers = this.genBuffers( geoInfo );
		// console.log("GeometryBufferParser::genGeometryBuffers(), buffers: ",buffers);
		return buffers;

	}
	private parseGeoNode( geoNode: any ): any {

		const geoInfo: any = {};

		geoInfo.vertexPositions = ( geoNode.Vertices !== undefined ) ? geoNode.Vertices.a : [];
		geoInfo.vertexIndices = ( geoNode.PolygonVertexIndex !== undefined ) ? geoNode.PolygonVertexIndex.a : [];

		// if ( geoNode.LayerElementColor ) {
		// 	geoInfo.color = this.parseVertexColors( geoNode.LayerElementColor[ 0 ] );
		// }

		// if ( geoNode.LayerElementMaterial ) {
		// 	geoInfo.material = this.parseMaterialIndices( geoNode.LayerElementMaterial[ 0 ] );
		// }

		if ( geoNode.LayerElementNormal ) {
			geoInfo.normal = this.parseNormals( geoNode.LayerElementNormal[ 0 ] );
		}

		if ( geoNode.LayerElementUV ) {
			geoInfo.uv = [];

			let i = 0;
			while ( geoNode.LayerElementUV[ i ] ) {
				if ( geoNode.LayerElementUV[ i ].UV ) {
					geoInfo.uv.push( this.parseUVs( geoNode.LayerElementUV[ i ] ) );

				}
				i ++;
			}
		}
		geoInfo.weightTable = {};
		return geoInfo;

	}
	private buildNumberData(params: number[]): number[] {

		let u8Arr = this.m_reader.getArrayU8BufferByOffset( params[0], params[1] );
		const data = fflate.unzlibSync( u8Arr, null );
		const r2 = new BinaryReader( data.buffer );
		return r2.getFloat64Array( params[2] );
	}
	private buildInt32Data(params: number[]): number[] {

		let u8Arr = this.m_reader.getArrayU8BufferByOffset( params[0], params[1] );
		const data = fflate.unzlibSync( u8Arr, null );
		const r2 = new BinaryReader( data.buffer );
		return r2.getInt32Array( params[2] );
	}
	private genBuffers( geoInfo: any ): FBXBufferObject {

		const buffers: FBXBufferObject = new FBXBufferObject();

		let polygonIndex = 0;
		let faceLength = 0;

		let facePositionIndexes: number[] = new Array(36);
		let faceNormals: number[] = new Array(36);
		let faceColors: number[] = new Array(36);
		let faceUVs: number[][] = null;
		let faceWeights: number[] = [];
		let faceWeightIndices: number[] = [];

		// 使用的时候在解码得到实际需要的数据
		if(geoInfo.vertexIndices.length == 3) geoInfo.vertexIndices = this.buildInt32Data(geoInfo.vertexIndices);
		if(geoInfo.vertexPositions.length == 3) geoInfo.vertexPositions = this.buildNumberData(geoInfo.vertexPositions);
		if(geoInfo.normal.buffer.length == 3) geoInfo.normal.buffer = this.buildNumberData(geoInfo.normal.buffer);
		if(geoInfo.normal.indices.length == 3) geoInfo.normal.indices = this.buildInt32Data(geoInfo.normal.indices);
		if(geoInfo.uv[0].buffer.length == 3) geoInfo.uv[0].buffer = this.buildNumberData( geoInfo.uv[0].buffer);
		// 
		// console.log("B geoInfo: ", geoInfo);
		let vivs = geoInfo.vertexIndices;
		let vvs = geoInfo.vertexPositions;
		// console.log("geoInfo.vertexIndices: ", geoInfo.vertexIndices);
		// console.log("geoInfo.vertexPositions: ", vvs);
		// console.log("geoInfo normal: ", geoInfo.normal.buffer);
		// console.log("geoInfo uv[0]: ", geoInfo.uv[0].buffer);
		// console.log("geoInfo.vertexIndices.length: ", geoInfo.vertexIndices.length);
		// let normalData: number[] = new Array(vvs.length);

		let oivsLen: number = geoInfo.vertexIndices.length;
		
		//console.log("XXX oivsLen: ",oivsLen);
		
		let time = Date.now();
		let materialIndex: number = 0;
		// let miBoo = geoInfo.material && geoInfo.material.mappingType !== 'AllSame';

		let trisTotal = 0;
		for(let i = 0; i < oivsLen; ++i) {
			faceLength ++;
			if ( vivs[i] < 0 ) {
				trisTotal += faceLength - 2;
				faceLength = 0;
			}
		}
		let vsLen = trisTotal * 9;
		buffers.vertex = new Float32Array(vsLen);
		buffers.normal = new Float32Array(vsLen);
		let uvs = buffers.uvs;
		
		let guvLen = 0;
		let guv: number[][] = null;
		if ( geoInfo.uv ) {
			guvLen = geoInfo.uv.length;
			guv = geoInfo.uv;
			faceUVs = [];
			for(let j = 0; j < guvLen; ++j) {
				faceUVs.push(new Array(36));
				uvs[ j ] = new Float32Array( trisTotal * 6 );
			}
			buffers.uvs = uvs;
		}

		let lossTimeA: number = Date.now() - time;

		faceLength = 0;
		for(let i = 0; i < oivsLen; ++i) {

			let endOfFace = false;
			let vertexIndex = vivs[i];
			if ( vertexIndex < 0 ) {

				vertexIndex = vertexIndex ^ - 1; // equivalent to ( x * -1 ) - 1
				endOfFace = true;
			}
			let fi = faceLength * 3;
			const a = vertexIndex * 3;
			// facePositionIndexes.push( a, a + 1, a + 2 );
			facePositionIndexes[fi] = a;
			facePositionIndexes[fi+1] = a+1;
			facePositionIndexes[fi+2] = a+2;

			// if ( geoInfo.color ) {

			// 	const data = getData( polygonVertexIndex, polygonIndex, vertexIndex, geoInfo.color );

			// 	//faceColors.push( data[ 0 ], data[ 1 ], data[ 2 ] );
			// faceColors[fi] = data[0];
			// faceColors[fi+1] = data[1];
			// faceColors[fi+2] = data[2];

			// }
			if ( geoInfo.normal ) {
				// console.log("calc normal: ",geoInfo.normal.mappingType);
				const data = getData( i, polygonIndex, vertexIndex, geoInfo.normal );
				// faceNormals.push( data[ 0 ], data[ 1 ], data[ 2 ] );
				faceNormals[fi] = data[0];
				faceNormals[fi+1] = data[1];
				faceNormals[fi+2] = data[2];

				// normalData[a] = data[0];
				// normalData[a+1] = data[1];
				// normalData[a+2] = data[2];
			}

			if(guv != null) {
				fi = faceLength * 2;
				for(let j = 0; j < guvLen; ++j) {
					const data = getData( i, polygonIndex, vertexIndex, guv[j] );
					faceUVs[ j ][fi] = data[ 0 ];
					faceUVs[ j ][fi+1] = data[ 1 ];
				}
			}

			faceLength ++;

			if ( endOfFace ) {
				// console.log("facePositionIndexes: ",facePositionIndexes);
				this.genFace( buffers, geoInfo, facePositionIndexes, materialIndex, faceNormals, faceColors, faceUVs, faceWeights, faceWeightIndices, faceLength );
				
				polygonIndex ++;
				faceLength = 0;

				// faceWeights = [];
				// faceWeightIndices = [];

			}
		};

		let lossTime: number = Date.now() - time;

		// console.log("XXX normalData: ",normalData);
		console.log("XXX lossTime: ",lossTime, ",preCompute lossTime: ",lossTimeA);
		console.log("XXX vertex.length:", buffers.vertex.length, ", vsLen:",vsLen, ", oivsLen:",oivsLen);
		if(oivsLen > 2000000) {
			console.log("XXX larger geom vertices total.....");
		}
		// buffers.indices = indices;
		// //pvs
		// buffers.indices = pvs.length <= 65535 ? new Uint16Array(pvs) : new Uint32Array(pvs);

		return buffers;

	}

	// Generate data for a single face in a geometry. If the face is a quad then split it into 2 tris
	private genFace( buffers: any, geoInfo: any, facePositionIndexes: number[], materialIndex: number, faceNormals: number[], faceColors: number[], faceUVs:number[][], faceWeights: number[], faceWeightIndices:number[], faceLength: number ): void {
		
		let vps = geoInfo.vertexPositions;
		let vs = buffers.vertex;
		let nvs = buffers.normal;
		let uvs = buffers.uvs;

		let i3 = buffers.i3;
		let i2 = buffers.i2;
		// let colorBoo = geoInfo.color != null;
		let normalBoo = geoInfo.normal != null;
		let uvBoo = geoInfo.uv != null;
		// let miBoo = geoInfo.material && geoInfo.material.mappingType !== 'AllSame';
		for ( let i = 2; i < faceLength; i ++ ) {

			vs[i3] = ( vps[ facePositionIndexes[ 0 ] ] );
			vs[i3 + 1] = ( vps[ facePositionIndexes[ 1 ] ] );
			vs[i3 + 2] = ( vps[ facePositionIndexes[ 2 ] ] );

			vs[i3 + 3] = ( vps[ facePositionIndexes[ ( i - 1 ) * 3 ] ] );
			vs[i3 + 4] = ( vps[ facePositionIndexes[ ( i - 1 ) * 3 + 1 ] ] );
			vs[i3 + 5] = ( vps[ facePositionIndexes[ ( i - 1 ) * 3 + 2 ] ] );

			vs[i3 + 6] = ( vps[ facePositionIndexes[ i * 3 ] ] );
			vs[i3 + 7] = ( vps[ facePositionIndexes[ i * 3 + 1 ] ] );
			vs[i3 + 8] = ( vps[ facePositionIndexes[ i * 3 + 2 ] ] );

			// if ( colorBoo ) {

			// 	buffers.colors.push( faceColors[ 0 ] );
			// 	buffers.colors.push( faceColors[ 1 ] );
			// 	buffers.colors.push( faceColors[ 2 ] );

			// 	buffers.colors.push( faceColors[ ( i - 1 ) * 3 ] );
			// 	buffers.colors.push( faceColors[ ( i - 1 ) * 3 + 1 ] );
			// 	buffers.colors.push( faceColors[ ( i - 1 ) * 3 + 2 ] );

			// 	buffers.colors.push( faceColors[ i * 3 ] );
			// 	buffers.colors.push( faceColors[ i * 3 + 1 ] );
			// 	buffers.colors.push( faceColors[ i * 3 + 2 ] );

			// }


			if ( normalBoo ) {

				nvs[i3] = ( faceNormals[ 0 ] );
				nvs[i3 + 1] = ( faceNormals[ 1 ] );
				nvs[i3 + 2] = ( faceNormals[ 2 ] );
				
				nvs[i3 + 3] = ( faceNormals[ ( i - 1 ) * 3 ] );
				nvs[i3 + 4] = ( faceNormals[ ( i - 1 ) * 3 + 1 ] );
				nvs[i3 + 5] = ( faceNormals[ ( i - 1 ) * 3 + 2 ] );

				nvs[i3 + 6] = ( faceNormals[ i * 3 ] );
				nvs[i3 + 7] = ( faceNormals[ i * 3 + 1 ] );
				nvs[i3 + 8] = ( faceNormals[ i * 3 + 2 ] );

			}

			if ( uvBoo ) {

				const guv = geoInfo.uv;
				for ( let j = 0, jl = guv.length; j < jl; j ++ ) {
					const fuvs = faceUVs[ j ];
					const puvs = uvs[j];
					puvs[i2] = fuvs[ 0 ];
					puvs[i2 + 1] = fuvs[ 1 ];
					puvs[i2 + 2] = fuvs[ ( i - 1 ) * 2 ];
					puvs[i2 + 3] = fuvs[ ( i - 1 ) * 2 + 1 ];
					puvs[i2 + 4] = fuvs[ i * 2 ];
					puvs[i2 + 5] = fuvs[ i * 2 + 1 ];
				}
			}
			
			i3 += 9;
			i2 += 6;
		}
		buffers.i3 = i3;
		buffers.i2 = i2;
	}

	// Parse normal from FBXTree.Objects.Geometry.LayerElementNormal if it exists
	private parseNormals( NormalNode: any ): any {

		const mappingType = NormalNode.MappingInformationType;
		const referenceType = NormalNode.ReferenceInformationType;
		const buffer = NormalNode.Normals.a;
		let indexBuffer = [];
		if ( referenceType === 'IndexToDirect' ) {

			if ( 'NormalIndex' in NormalNode ) {

				indexBuffer = NormalNode.NormalIndex.a;

			} else if ( 'NormalsIndex' in NormalNode ) {

				indexBuffer = NormalNode.NormalsIndex.a;

			}

		}

		return {
			dataSize: 3,
			buffer: buffer,
			indices: indexBuffer,
			mappingType: mappingType,
			referenceType: referenceType
		};

	}

	// Parse UVs from FBXTree.Objects.Geometry.LayerElementUV if it exists
	private parseUVs( UVNode: any ): any {

		const mappingType = UVNode.MappingInformationType;
		const referenceType = UVNode.ReferenceInformationType;
		const buffer = UVNode.UV.a;
		let indexBuffer = [];
		if ( referenceType === 'IndexToDirect' ) {

			indexBuffer = UVNode.UVIndex.a;

		}
		// console.log("parseUVs(), buffer: ", buffer);
		return {
			dataSize: 2,
			buffer: buffer,
			indices: indexBuffer,
			mappingType: mappingType,
			referenceType: referenceType
		};

	}

	// Parse Vertex Colors from FBXTree.Objects.Geometry.LayerElementColor if it exists
	private parseVertexColors( ColorNode: any ): any {

		const mappingType = ColorNode.MappingInformationType;
		const referenceType = ColorNode.ReferenceInformationType;
		const buffer = ColorNode.Colors.a;
		let indexBuffer = [];
		if ( referenceType === 'IndexToDirect' ) {

			indexBuffer = ColorNode.ColorIndex.a;

		}

		return {
			dataSize: 4,
			buffer: buffer,
			indices: indexBuffer,
			mappingType: mappingType,
			referenceType: referenceType
		};

	}

	// Parse mapping and material data in FBXTree.Objects.Geometry.LayerElementMaterial if it exists
	private parseMaterialIndices( MaterialNode: any ): any {

		const mappingType = MaterialNode.MappingInformationType;
		const referenceType = MaterialNode.ReferenceInformationType;

		if ( mappingType === 'NoMappingInformation' ) {

			return {
				dataSize: 1,
				buffer: [ 0 ],
				indices: [ 0 ],
				mappingType: 'AllSame',
				referenceType: referenceType
			};

		}

		const materialIndexBuffer = MaterialNode.Materials.a;

		// Since materials are stored as indices, there's a bit of a mismatch between FBX and what
		// we expect.So we create an intermediate buffer that points to the index in the buffer,
		// for conforming with the other functions we've written for other data.
		const materialIndices = [];

		for ( let i = 0; i < materialIndexBuffer.length; ++ i ) {

			materialIndices.push( i );

		}

		return {
			dataSize: 1,
			buffer: materialIndexBuffer,
			indices: materialIndices,
			mappingType: mappingType,
			referenceType: referenceType
		};

	}

	// Generate a NurbGeometry from a node in FBXTree.Objects.Geometry
	private parseNurbsGeometry( geoNode: any ): any {
		return null;
		/*
		if ( NURBSCurve === undefined ) {

			console.error( 'FBXLoader: The loader relies on NURBSCurve for any nurbs present in the model. Nurbs will show up as empty geometry.' );
			return new BufferGeometry();

		}

		const order = parseInt( geoNode.Order );

		if ( isNaN( order ) ) {

			console.error( 'FBXLoader: Invalid Order %s given for geometry ID: %s', geoNode.Order, geoNode.id );
			return new BufferGeometry();

		}

		const degree = order - 1;

		const knots = geoNode.KnotVector.a;
		const controlPoints = [];
		const pointsValues = geoNode.Points.a;

		for ( let i = 0, l = pointsValues.length; i < l; i += 4 ) {

			controlPoints.push( new Vector4().fromArray( pointsValues, i ) );

		}

		let startKnot, endKnot;

		if ( geoNode.Form === 'Closed' ) {

			controlPoints.push( controlPoints[ 0 ] );

		} else if ( geoNode.Form === 'Periodic' ) {

			startKnot = degree;
			endKnot = knots.length - 1 - startKnot;

			for ( let i = 0; i < degree; ++ i ) {

				controlPoints.push( controlPoints[ i ] );

			}

		}

		const curve = new NURBSCurve( degree, knots, controlPoints, startKnot, endKnot );
		const points = curve.getPoints( controlPoints.length * 12 );

		return new BufferGeometry().setFromPoints( points );
		//*/
	}

}
export { GeometryBufferParser };
