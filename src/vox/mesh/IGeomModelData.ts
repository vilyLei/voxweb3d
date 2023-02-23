
export default interface IGeomModelData {
	uuid?: string;
	uvsList: Float32Array[];
	vertices: Float32Array;
	normals: Float32Array;
	indices: Uint16Array | Uint32Array;
}