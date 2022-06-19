import { getData } from "./Utils";
import { FBXTreeMap } from "./FBXTree";
import { FBXBufferObject } from "./FBXBufferObject";

// parse Geometry data from FBXTree and return map of BufferGeometries
class GeometryBufferParser {

	private m_idLst: number[];
	private m_nodeIDList: string[];
	private m_parseTotal: number = 0;
	private m_deformers: any;
	private m_fbxTree: FBXTreeMap;
	private m_connections: Map<number, any>;
	constructor(){}
	
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
			console.log("geometryMap: ",geometryMap);
		}
		
		return geometryMap;

	}
	
	parseGeomBufBegin( deformers: any, fbxTree: FBXTreeMap, connections: Map<number, any>): void {

		//const geometryMap: Map<number, FBXBufferObject> = new Map();
		
		if ( 'Geometry' in fbxTree.Objects ) {

			this.m_deformers = deformers;
			this.m_fbxTree = fbxTree;
			this.m_connections = connections;

			// let id: number = 0;
			// let idLst: number[] = [];
			// let nodeIDList: string[] = [];
			this.m_idLst = [];
			this.m_nodeIDList = [];
			// for ( const nodeID in geoNodes ) {
			// 	id = parseInt( nodeID );
			// 	const relationships = connections.get( id );
			// 	const geoBuf = this.parseGeometryBuffer( relationships, geoNodes[ nodeID ], deformers, fbxTree );
			// 	geometryMap.set( id, geoBuf );
			// }
			const geoNodes = fbxTree.Objects.Geometry;
			for ( const nodeID in geoNodes ) {
				this.m_idLst.push( parseInt( nodeID ) );
				this.m_nodeIDList.push(nodeID);
			}
			this.m_parseTotal = this.m_idLst.length;
			// this.m_parseIndex = 0;
			// for(let i: number = 0; i < idLst.length; ++i) {
			// 	id = idLst[i];
			// 	const relationships = connections.get( id );
			// 	const geoBuf = this.parseGeometryBuffer( relationships, geoNodes[ nodeIDList[i] ], deformers, fbxTree );
			// 	geometryMap.set( id, geoBuf );
			// }
			// console.log("geoInfo.vertexIndices.length: ", geoInfo.vertexIndices.length);
			// console.log("geometryMap: ",geometryMap);
		}
		
		//return geometryMap;

	}
	getGeomBufId(): number {
		if(this.isParseing()) {
			return this.m_idLst[this.m_idLst.length - 1];
		}
		return -1;
	}
	parseGeomBufNext(): FBXBufferObject {
		if(this.isParseing()) {
			const geoNodes = this.m_fbxTree.Objects.Geometry;
			let id = this.m_idLst.pop();
			const relationships = this.m_connections.get( id );
			return this.parseGeometryBuffer( relationships, geoNodes[ this.m_nodeIDList.pop() ], this.m_deformers, this.m_fbxTree );

		}
		return null;
	}
	isParseing(): boolean {
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
		const geoInfo = this.parseGeoNode( geoNode );
		const buffers = this.genBuffers( geoInfo );
		// console.log("GeometryBufferParser::genGeometryBuffers(), buffers: ",buffers);
		return buffers;

	}
	private parseGeoNode( geoNode: any ): any {

		const geoInfo: any = {};

		geoInfo.vertexPositions = ( geoNode.Vertices !== undefined ) ? geoNode.Vertices.a : [];
		geoInfo.vertexIndices = ( geoNode.PolygonVertexIndex !== undefined ) ? geoNode.PolygonVertexIndex.a : [];

		if ( geoNode.LayerElementColor ) {

			geoInfo.color = this.parseVertexColors( geoNode.LayerElementColor[ 0 ] );

		}

		if ( geoNode.LayerElementMaterial ) {

			geoInfo.material = this.parseMaterialIndices( geoNode.LayerElementMaterial[ 0 ] );

		}

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

	private genBuffers( geoInfo: any ): FBXBufferObject {

		const buffers: FBXBufferObject = new FBXBufferObject();

		let polygonIndex = 0;
		let faceLength = 0;

		// these will hold data for a single face
		let facePositionIndexes: number[] = [];
		let faceNormals: number[] = [];
		let faceColors: number[] = [];
		let faceUVs: number[][] = [];
		let faceWeights: number[] = [];
		let faceWeightIndices: number[] = [];

		const scope = this;
		// console.log("geoInfo.vertexIndices: ", geoInfo.vertexIndices);
		// console.log("geoInfo.vertexIndices.length: ", geoInfo.vertexIndices.length);

		let vtxTotal: number = geoInfo.vertexIndices.length;
		
		// console.log("XXX vtxTotal: ",vtxTotal);
		let vsLen = vtxTotal * 3;
		// console.log("XXX geoInfo.vertexPositions: ",geoInfo.vertexPositions);
		// let indices = vsLen <= 65535 ? new Uint16Array(vsLen) : new Uint32Array(vsLen);
		// let indicesI: number = 0;
		// let pvs: number[] = []
		// let fs = new Array(geoInfo.vertexIndices.length);
		// fs.fill(0);
		// let vics = geoInfo.vertexIndices;
		// for(let i: number = 0; i < vics.length; ++i) {
		// }
		let map: Map<string, number> = new Map();
		geoInfo.vertexIndices.forEach( function ( vertexIndex: number, polygonVertexIndex: number ): void {

			let materialIndex: number;
			let endOfFace = false;
			//console.log("XXXXXXA vertexIndex, polygonVertexIndex: ",vertexIndex,polygonVertexIndex);
			///*
			const prev = vertexIndex;
			// Face index and vertex index arrays are combined in a single array
			// A cube with quad faces looks like this:
			// PolygonVertexIndex: *24 {
			//  a: 0, 1, 3, -3, 2, 3, 5, -5, 4, 5, 7, -7, 6, 7, 1, -1, 1, 7, 5, -4, 6, 0, 2, -5
			//  }
			// Negative numbers mark the end of a face - first face here is 0, 1, 3, -3
			// to find index of last vertex bit shift the index: ^ - 1
			if ( vertexIndex < 0 ) {

				vertexIndex = vertexIndex ^ - 1; // equivalent to ( x * -1 ) - 1
				endOfFace = true;
			}
			// if(vertexIndex == 4) {
			// 	return;
			// }else {
			// 	//return;
			// }
			//console.log("XXXXXX vertexIndex, polygonVertexIndex: ","("+prev+")"+vertexIndex,polygonVertexIndex);
			// let weightIndices: number[] = [];
			// let weights: number[] = [];
			// pvs.push(vertexIndex * 3, vertexIndex * 3 + 1, vertexIndex * 3 + 2);
			// indices[indicesI++] = vertexIndex * 3;
			// indices[indicesI++] = vertexIndex * 3 + 1;
			// indices[indicesI++] = vertexIndex * 3 + 2;
			// 

			const a = vertexIndex * 3;
			// const b = vertexIndex * 3 + 1;
			// const c = vertexIndex * 3 + 2;
			// let key = a + ""+b+""+c;
			// if(map.has(key)) {
			// 	faceLength ++;
			// 	polygonIndex ++;
			// 	return;
			// }else {
			// 	map.set(key, 1);
			// }
			//console.log("a, a + 1, a + 2: ",vertexIndex * 3, vertexIndex * 3 + 1, vertexIndex * 3 + 2);
			facePositionIndexes.push( a, a + 1, a + 2 );

			if ( geoInfo.color ) {

				const data = getData( polygonVertexIndex, polygonIndex, vertexIndex, geoInfo.color );

				faceColors.push( data[ 0 ], data[ 1 ], data[ 2 ] );

			}
			if ( geoInfo.normal ) {

				const data = getData( polygonVertexIndex, polygonIndex, vertexIndex, geoInfo.normal );

				faceNormals.push( data[ 0 ], data[ 1 ], data[ 2 ] );

			}

			if ( geoInfo.material && geoInfo.material.mappingType !== 'AllSame' ) {

				materialIndex = getData( polygonVertexIndex, polygonIndex, vertexIndex, geoInfo.material )[ 0 ];

			}

			if ( geoInfo.uv ) {

				geoInfo.uv.forEach( function ( uv: any, i: number ) {

					const data = getData( polygonVertexIndex, polygonIndex, vertexIndex, uv );

					if ( faceUVs[ i ] === undefined ) {

						faceUVs[ i ] = [];

					}

					faceUVs[ i ].push( data[ 0 ] );
					faceUVs[ i ].push( data[ 1 ] );

				} );

			}

			faceLength ++;

			if ( endOfFace ) {

				scope.genFace( buffers, geoInfo, facePositionIndexes, materialIndex, faceNormals, faceColors, faceUVs, faceWeights, faceWeightIndices, faceLength );

				polygonIndex ++;
				faceLength = 0;

				// reset arrays for the next face
				facePositionIndexes = [];
				faceNormals = [];
				faceColors = [];
				faceUVs = [];
				faceWeights = [];
				faceWeightIndices = [];

			}
			//*/
		} );
		
		console.log("XXX buffers.vertex.length: ", buffers.vertex.length , ", vtxTotal * 3: ",vtxTotal * 3);
		// buffers.indices = indices;
		// //pvs
		// buffers.indices = pvs.length <= 65535 ? new Uint16Array(pvs) : new Uint32Array(pvs);

		return buffers;

	}
	private genBuffersT( geoInfo: any ): FBXBufferObject {

		const buffers: FBXBufferObject = new FBXBufferObject();

		let polygonIndex = 0;
		let faceLength = 0;

		// these will hold data for a single face
		let facePositionIndexes: number[] = [];
		let faceNormals: number[] = [];
		let faceColors: number[] = [];
		let faceUVs: number[][] = [];
		let faceWeights: number[] = [];
		let faceWeightIndices: number[] = [];

		const scope = this;
		// console.log("geoInfo.vertexIndices: ", geoInfo.vertexIndices);
		console.log("geoInfo.vertexIndices.length: ", geoInfo.vertexIndices.length);

		let vtxTotal: number = geoInfo.vertexIndices.length;

		console.log("XXX vtxTotal: ",vtxTotal);
		let vsLen = vtxTotal * 3;
		// let indices = vsLen <= 65535 ? new Uint16Array(vsLen) : new Uint32Array(vsLen);
		// let indicesI: number = 0;
		// let pvs: number[] = []
		geoInfo.vertexIndices.forEach( function ( vertexIndex: number, polygonVertexIndex: number ): void {

			let materialIndex: number;
			let endOfFace = false;

			console.log("XXXXXX vertexIndex, polygonVertexIndex: ",vertexIndex,polygonVertexIndex);
			// Face index and vertex index arrays are combined in a single array
			// A cube with quad faces looks like this:
			// PolygonVertexIndex: *24 {
			//  a: 0, 1, 3, -3, 2, 3, 5, -5, 4, 5, 7, -7, 6, 7, 1, -1, 1, 7, 5, -4, 6, 0, 2, -5
			//  }
			// Negative numbers mark the end of a face - first face here is 0, 1, 3, -3
			// to find index of last vertex bit shift the index: ^ - 1
			if ( vertexIndex < 0 ) {

				vertexIndex = vertexIndex ^ - 1; // equivalent to ( x * -1 ) - 1
				endOfFace = true;
			}

			// let weightIndices: number[] = [];
			// let weights: number[] = [];
			// pvs.push(vertexIndex * 3, vertexIndex * 3 + 1, vertexIndex * 3 + 2);
			// indices[indicesI++] = vertexIndex * 3;
			// indices[indicesI++] = vertexIndex * 3 + 1;
			// indices[indicesI++] = vertexIndex * 3 + 2;
			
			facePositionIndexes.push( vertexIndex * 3, vertexIndex * 3 + 1, vertexIndex * 3 + 2 );

			if ( geoInfo.color ) {

				const data = getData( polygonVertexIndex, polygonIndex, vertexIndex, geoInfo.color );

				faceColors.push( data[ 0 ], data[ 1 ], data[ 2 ] );

			}
			if ( geoInfo.normal ) {

				const data = getData( polygonVertexIndex, polygonIndex, vertexIndex, geoInfo.normal );

				faceNormals.push( data[ 0 ], data[ 1 ], data[ 2 ] );

			}

			if ( geoInfo.material && geoInfo.material.mappingType !== 'AllSame' ) {

				materialIndex = getData( polygonVertexIndex, polygonIndex, vertexIndex, geoInfo.material )[ 0 ];

			}

			if ( geoInfo.uv ) {

				geoInfo.uv.forEach( function ( uv: any, i: number ) {

					const data = getData( polygonVertexIndex, polygonIndex, vertexIndex, uv );

					if ( faceUVs[ i ] === undefined ) {

						faceUVs[ i ] = [];

					}

					faceUVs[ i ].push( data[ 0 ] );
					faceUVs[ i ].push( data[ 1 ] );

				} );

			}

			faceLength ++;

			if ( endOfFace ) {

				scope.genFace( buffers, geoInfo, facePositionIndexes, materialIndex, faceNormals, faceColors, faceUVs, faceWeights, faceWeightIndices, faceLength );

				polygonIndex ++;
				faceLength = 0;

				// reset arrays for the next face
				facePositionIndexes = [];
				faceNormals = [];
				faceColors = [];
				faceUVs = [];
				faceWeights = [];
				faceWeightIndices = [];

			}

		} );
		
		console.log("XXX buffers.vertex.length: ", buffers.vertex.length , ", vtxTotal * 3: ",vtxTotal * 3);
		// buffers.indices = indices;
		// //pvs
		// buffers.indices = pvs.length <= 65535 ? new Uint16Array(pvs) : new Uint32Array(pvs);

		return buffers;

	}

	// Generate data for a single face in a geometry. If the face is a quad then split it into 2 tris
	private genFace( buffers: any, geoInfo: any, facePositionIndexes: number[], materialIndex: number, faceNormals: number[], faceColors: number[], faceUVs:number[][], faceWeights: number[], faceWeightIndices:number[], faceLength: number ): void {

		for ( let i = 2; i < faceLength; i ++ ) {

			buffers.vertex.push( geoInfo.vertexPositions[ facePositionIndexes[ 0 ] ] );
			buffers.vertex.push( geoInfo.vertexPositions[ facePositionIndexes[ 1 ] ] );
			buffers.vertex.push( geoInfo.vertexPositions[ facePositionIndexes[ 2 ] ] );

			buffers.vertex.push( geoInfo.vertexPositions[ facePositionIndexes[ ( i - 1 ) * 3 ] ] );
			buffers.vertex.push( geoInfo.vertexPositions[ facePositionIndexes[ ( i - 1 ) * 3 + 1 ] ] );
			buffers.vertex.push( geoInfo.vertexPositions[ facePositionIndexes[ ( i - 1 ) * 3 + 2 ] ] );

			buffers.vertex.push( geoInfo.vertexPositions[ facePositionIndexes[ i * 3 ] ] );
			buffers.vertex.push( geoInfo.vertexPositions[ facePositionIndexes[ i * 3 + 1 ] ] );
			buffers.vertex.push( geoInfo.vertexPositions[ facePositionIndexes[ i * 3 + 2 ] ] );

			if ( geoInfo.color ) {

				buffers.colors.push( faceColors[ 0 ] );
				buffers.colors.push( faceColors[ 1 ] );
				buffers.colors.push( faceColors[ 2 ] );

				buffers.colors.push( faceColors[ ( i - 1 ) * 3 ] );
				buffers.colors.push( faceColors[ ( i - 1 ) * 3 + 1 ] );
				buffers.colors.push( faceColors[ ( i - 1 ) * 3 + 2 ] );

				buffers.colors.push( faceColors[ i * 3 ] );
				buffers.colors.push( faceColors[ i * 3 + 1 ] );
				buffers.colors.push( faceColors[ i * 3 + 2 ] );

			}

			if ( geoInfo.material && geoInfo.material.mappingType !== 'AllSame' ) {

				buffers.materialIndex.push( materialIndex );
				buffers.materialIndex.push( materialIndex );
				buffers.materialIndex.push( materialIndex );

			}

			if ( geoInfo.normal ) {

				buffers.normal.push( faceNormals[ 0 ] );
				buffers.normal.push( faceNormals[ 1 ] );
				buffers.normal.push( faceNormals[ 2 ] );

				buffers.normal.push( faceNormals[ ( i - 1 ) * 3 ] );
				buffers.normal.push( faceNormals[ ( i - 1 ) * 3 + 1 ] );
				buffers.normal.push( faceNormals[ ( i - 1 ) * 3 + 2 ] );

				buffers.normal.push( faceNormals[ i * 3 ] );
				buffers.normal.push( faceNormals[ i * 3 + 1 ] );
				buffers.normal.push( faceNormals[ i * 3 + 2 ] );

			}

			if ( geoInfo.uv ) {

				geoInfo.uv.forEach( function ( uv: any, j: number ) {

					if ( buffers.uvs[ j ] === undefined ) buffers.uvs[ j ] = [];

					buffers.uvs[ j ].push( faceUVs[ j ][ 0 ] );
					buffers.uvs[ j ].push( faceUVs[ j ][ 1 ] );

					buffers.uvs[ j ].push( faceUVs[ j ][ ( i - 1 ) * 2 ] );
					buffers.uvs[ j ].push( faceUVs[ j ][ ( i - 1 ) * 2 + 1 ] );

					buffers.uvs[ j ].push( faceUVs[ j ][ i * 2 ] );
					buffers.uvs[ j ].push( faceUVs[ j ][ i * 2 + 1 ] );

				} );

			}
		}
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

			console.error( 'THREE.FBXLoader: The loader relies on NURBSCurve for any nurbs present in the model. Nurbs will show up as empty geometry.' );
			return new BufferGeometry();

		}

		const order = parseInt( geoNode.Order );

		if ( isNaN( order ) ) {

			console.error( 'THREE.FBXLoader: Invalid Order %s given for geometry ID: %s', geoNode.Order, geoNode.id );
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
