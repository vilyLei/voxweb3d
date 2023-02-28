
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
     * 是否启用线框模式数据, 默认值为false
     */
    wireframe?: boolean;
    /**
     * 是否启用形状模式数据, 默认值为true
     */
    shape?: boolean;
	/**
	 * the default value is null
	 */
	indices?: Uint16Array | Uint32Array;
	/**
	 * the default value is undefined or null
	 */
	extraIndicesList?: {indices:(Uint16Array | Uint32Array), wireframe?: boolean, shape?:boolean}[];
	
	uvsList: Float32Array[];
	vertices: Float32Array;
	normals: Float32Array;
}