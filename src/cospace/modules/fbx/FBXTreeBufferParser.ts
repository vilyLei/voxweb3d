import { FBXTreeMap, FBXTree } from "./FBXTree";
import { GeometryBufferParser } from "./GeometryBufferParser";
import { FBXBufferObject } from "./FBXBufferObject";

class FBXTreeBufferParser {
	private m_geometryMap: GeometryBufferParser;
	constructor() {	}

	parse(fbxTree: FBXTree): Map<number, FBXBufferObject> {

		let connections = this.parseConnections( fbxTree.map );
		const deformers = this.parseDeformers( fbxTree.map, connections );
		const geometryMap = new GeometryBufferParser().parseGeomBuf( deformers, fbxTree.map, connections);

		return geometryMap;

	}
	parseBegin(fbxTree: FBXTree): void {
		
		let connections = this.parseConnections( fbxTree.map );
		const deformers = this.parseDeformers( fbxTree.map, connections );
		this.m_geometryMap = new GeometryBufferParser();
		this.m_geometryMap.parseGeomBufBegin( deformers, fbxTree.map, connections );
	}

	
	getGeomBufId(): number {
		if(this.m_geometryMap != null) {
			return this.m_geometryMap.getGeomBufId();
		}
		return -1;
	}
	parseGeomBufNext(): FBXBufferObject {
		if(this.m_geometryMap != null) return this.m_geometryMap.parseGeomBufNext();
		return null;
	}
	isParseing(): boolean {
		if(this.m_geometryMap != null) return this.m_geometryMap.isParseing();
		return false;
	}
	getParseTotal(): number {
		if(this.m_geometryMap != null) return this.m_geometryMap.getParseTotal();
		return 0;
	}

	// Parses FBXTree.Connections which holds parent-child connections between objects (e.g. material -> texture, model->geometry )
	// and details the connection type
	private parseConnections(fbxTree: FBXTreeMap): Map<number, any>{

		const connectionMap: Map<number, any> = new Map();
        
		if ( 'Connections' in fbxTree ) {

			const rawConnections = fbxTree.Connections.connections;

			rawConnections.forEach( function ( rawConnection: any ) {

				const fromID = rawConnection[ 0 ];
				const toID = rawConnection[ 1 ];
				const relationship = rawConnection[ 2 ];

				if ( ! connectionMap.has( fromID ) ) {

					connectionMap.set( fromID, {
						parents: [],
						children: []
					} );

				}

				const parentRelationship = { ID: toID, relationship: relationship };
				connectionMap.get( fromID ).parents.push( parentRelationship );

				if ( ! connectionMap.has( toID ) ) {

					connectionMap.set( toID, {
						parents: [],
						children: []
					} );

				}

				const childRelationship = { ID: fromID, relationship: relationship };
				connectionMap.get( toID ).children.push( childRelationship );

			} );

		}

		return connectionMap;

	}

	// Parse nodes in FBXTree.Objects.Deformer
	// Deformer node can contain skinning or Vertex Cache animation data, however only skinning is supported here
	// Generates map of Skeleton-like objects for use later when generating and binding skeletons.
	private parseDeformers(fbxTree: FBXTreeMap, connections: Map<number, any>): any {
		const skeletons: any = {};
		const morphTargets: any = {};
		return {

			skeletons: skeletons,
			morphTargets: morphTargets,

		};

	}
}

export { FBXTreeBufferParser }