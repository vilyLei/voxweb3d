
export default interface IGeomModelData {
	uuid?: string;
	/**
	 * vbWhole vtx buffer is whole data, or not, the default value is false.
	 */
	vbWhole?: boolean;
	/**
	 * the default value is 3
	 */
	stride?: number;
	/**
	 * the default value is null
	 */
	indices?: Uint16Array | Uint32Array;
	
	uvsList: Float32Array[];
	vertices: Float32Array;
	normals: Float32Array;
}