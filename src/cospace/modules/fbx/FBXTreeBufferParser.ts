import { getEulerOrder, generateTransform } from "./Utils";
import { FBXTreeMap, FBXTree } from "./FBXTree";
import { BinaryReader } from "./BinaryReader";
import { GeometryBufferParser } from "./GeometryBufferParser";
import { FBXBufferObject } from "./FBXBufferObject";

class FBXTreeBufferParser {
	private m_geomParser: GeometryBufferParser;
	private m_connections: Map<number, any>;
	private m_fbxTree: FBXTree;
	constructor() {	}

	parse(fbxTree: FBXTree, reader: BinaryReader): Map<number, FBXBufferObject> {

		this.m_connections = this.parseConnections( fbxTree.map );
		const deformers = this.parseDeformers( fbxTree.map, this.m_connections );
		let parser = new GeometryBufferParser();
		parser.setReader(reader);
		const geometryMap = parser.parseGeomBuf( deformers, fbxTree.map, this.m_connections);

		this.parseScene( deformers, geometryMap, this.m_connections, fbxTree.map);
		return geometryMap;

	}
	private parseScene( deformers: Map<number, any>, geometryMap: Map<number, FBXBufferObject>, connections: Map<number, any>, fbxTree: FBXTreeMap ): void {
		const modelMap = this.parseModels( geometryMap, connections, fbxTree );
	}
	private parseModels( geometryMap: Map<number, FBXBufferObject>, connections: Map<number, any>, fbxTree: FBXTreeMap ): Map<number, any> {

		const modelMap: Map<number, any> = new Map();
		const modelNodes = fbxTree.Objects.Model;
		
		for ( const nodeID in modelNodes ) {

			const id = parseInt( nodeID );
			const node = modelNodes[ nodeID ];
			const relationships = connections.get( id );

			// let model = this.buildSkeleton( relationships, skeletons, id, node.attrName );
			let model: any = null;
			if ( true ) {

				switch ( node.attrType ) {

					case 'Camera':
						// model = this.createCamera( relationships );
						break;
					case 'Light':
						// model = this.createLight( relationships );
						break;
					case 'Mesh':
						//model = this.createMesh( relationships, geometryMap, materialMap );
						break;
					case 'NurbsCurve':
						// model = this.createCurve( relationships, geometryMap );
						break;
					case 'LimbNode':
					case 'Root':
						// model = new Bone();
						break;
					case 'Null':
					default:
						// model = new Group();
						break;

				}

				//model.name = node.attrName ? PropertyBinding.sanitizeNodeName( node.attrName ) : '';

				model.ID = id;

			}

			this.getTransformData( model, node );
			modelMap.set( id, model );

		}
		return modelMap;
	}
	
	private parseBufObjTransData(bufObj: FBXBufferObject, modelID: string,  connections: Map<number, any>, fbxTree: FBXTreeMap ): void {

		// console.log("parseBufObjTransData(), modelID: ",modelID);
		const modelNodes = fbxTree.Objects.Model;
		// console.log("parseBufObjTransData(), modelNodes: ",modelNodes);
		const node = modelNodes[ modelID ];
		this.getTransformData( bufObj, node );
		if ( bufObj.parent ) {

			bufObj.userData.transformData.parentMatrix = node.parent.matrix;
			bufObj.userData.transformData.parentMatrixWorld = node.parent.matrixWorld;

		}

		const transform = generateTransform( bufObj.userData.transformData );
		bufObj.transform = transform;
		// if(bufObj.isEntity) {
		// 	console.log("### ### bufObj.userData: ", bufObj.userData);
		// 	console.log("### ### bufObj apply transform, transform: ", transform);
		// }
	}
	// parse the model node for transform data
	private	getTransformData( model: FBXBufferObject | any, modelNode: any ) {

		const transformData: any = {};

		if ( 'InheritType' in modelNode ) transformData.inheritType = parseInt( modelNode.InheritType.value );

		if ( 'RotationOrder' in modelNode ) transformData.eulerOrder = getEulerOrder( modelNode.RotationOrder.value );
		else transformData.eulerOrder = 'ZYX';

		if ( 'Lcl_Translation' in modelNode ) transformData.translation = modelNode.Lcl_Translation.value;

		if ( 'PreRotation' in modelNode ) transformData.preRotation = modelNode.PreRotation.value;
		if ( 'Lcl_Rotation' in modelNode ) transformData.rotation = modelNode.Lcl_Rotation.value;
		if ( 'PostRotation' in modelNode ) transformData.postRotation = modelNode.PostRotation.value;

		if ( 'Lcl_Scaling' in modelNode ) transformData.scale = modelNode.Lcl_Scaling.value;

		if ( 'ScalingOffset' in modelNode ) transformData.scalingOffset = modelNode.ScalingOffset.value;
		if ( 'ScalingPivot' in modelNode ) transformData.scalingPivot = modelNode.ScalingPivot.value;

		if ( 'RotationOffset' in modelNode ) transformData.rotationOffset = modelNode.RotationOffset.value;
		if ( 'RotationPivot' in modelNode ) transformData.rotationPivot = modelNode.RotationPivot.value;
		// console.log("XXXXXXXXXX getTransformData(),...");
		model.userData.transformData = transformData;

	}
	parseBegin(fbxTree: FBXTree, reader: BinaryReader): void {

		this.m_fbxTree = fbxTree;

		this.m_connections = this.parseConnections( fbxTree.map );

		const deformers = this.parseDeformers( fbxTree.map, this.m_connections );
		this.m_geomParser = new GeometryBufferParser();
		this.m_geomParser.setReader(reader);
		this.m_geomParser.parseGeomBufBegin( deformers, fbxTree.map, this.m_connections );
	}

	
	getGeomBufId(): number {
		if(this.m_geomParser != null) {
			return this.m_geomParser.getGeomBufId();
		}
		return -1;
	}
	parseGeomBufNext(): FBXBufferObject {
		let obj: FBXBufferObject;
		if(this.m_geomParser != null) {
			obj = this.m_geomParser.parseGeomBufNext();
			let ID = obj.ID;
			// console.log("this.m_fbxTree.map: ", this.m_fbxTree.map);
			// console.log("parseGeomBufNext(), ID, id: ", ID,obj.id);
			const relationships = this.m_connections.get( obj.id );
			// console.log("this.m_connections: ",this.m_connections);
			// console.log("relationships: ",relationships);
			let modelID: string = "";
			modelID = relationships.parents[0].ID + "";
			this.parseBufObjTransData(obj, modelID, this.m_connections, this.m_fbxTree.map);
		}
		return obj;
	}
	parseGeomBufAt(i: number): FBXBufferObject {
		let obj: FBXBufferObject;
		if(this.m_geomParser != null) {
			obj = this.m_geomParser.parseGeomBufAt( i );
			const relationships = this.m_connections.get( obj.id );
			let modelID: string = "";
			modelID = relationships.parents[0].ID + "";
			this.parseBufObjTransData(obj, modelID, this.m_connections, this.m_fbxTree.map);
		}
		return obj;
	}
	isParsing(): boolean {
		if(this.m_geomParser != null) return this.m_geomParser.isParsing();
		return false;
	}
	getParseTotal(): number {
		if(this.m_geomParser != null) return this.m_geomParser.getParseTotal();
		return 0;
	}

	// Parses FBXTree.Connections which holds parent-child connections between objects (e.g. material -> texture, model->geometry )
	// and details the connection type
	private parseConnections(fbxTree: FBXTreeMap): Map<number, any>{

		const connectionMap: Map<number, any> = new Map();
        
		if ( 'Connections' in fbxTree ) {

			const rawConnections = fbxTree.Connections.connections;
			// console.log("parseConnections(), begin...");
			rawConnections.forEach( function ( rawConnection: any ) {

				const fromID = rawConnection[ 0 ];
				const toID = rawConnection[ 1 ];
				// console.log("parseConnections(), fromID, toID: ", fromID, toID);
				const relationship = rawConnection[ 2 ];

				// let boo: boolean = false;
				if ( ! connectionMap.has( fromID ) ) {
					// if(fromID == 985892303) {
					// 	boo = true;
					// 	console.log("parseConnections(), ! connectionMap.has( 985892303 ), fromID: ", fromID);
					// }
					connectionMap.set( fromID, {
						parents: [],
						children: []
					} );

				}

				const parentRelationship = { ID: toID, relationship: relationship };
				connectionMap.get( fromID ).parents.push( parentRelationship );
				// if(fromID == 985892303) {
				// 	console.log("XXXXX ! connectionMap.has( toID ): ", ! connectionMap.has( toID ));
				// }
				if ( ! connectionMap.has( toID ) ) {
					// if(fromID == 985892303) {
					// 	console.log("XXXXX parseConnections(), build toID: ", toID);
					// }
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