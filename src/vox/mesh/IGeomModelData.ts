
export default interface IGeomModelData {
	uvsList: Float32Array[];
	vertices: Float32Array;
	normals: Float32Array;
	indices: Uint16Array | Uint32Array;
}