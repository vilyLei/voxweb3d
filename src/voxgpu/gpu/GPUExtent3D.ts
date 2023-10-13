type GPUExtent3DDict = {
	width?: number,
	height?: number,
	depthOrArrayLayers?: number
};
type GPUExtent3D = GPUExtent3DDict | number[];
export { GPUExtent3DDict, GPUExtent3D };
