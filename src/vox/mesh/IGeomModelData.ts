
export default interface IGeomModelData {
	uuid?: string;
	/**
	 * vbWhole vtx buffer is whole data, or not, the default is false.
	 */
	vbWhole?: boolean;
	uvsList: Float32Array[];
	vertices: Float32Array;
	normals: Float32Array;
	indices: Uint16Array | Uint32Array;
}