// see: https://developer.mozilla.org/en-US/docs/Web/API/GPUDevice/createRenderPipeline#depthstencil_object_structure
interface GPUStencilBackOrFrontObj {
	compare?: string;
	depthFailOp?: string;
	failOp?: string;
	passOp?: string;
}
interface GPUDepthStencilState {
	label?: string;
	depthWriteEnabled: boolean;
	depthCompare: string;
	format: string;
	depthBia?: number;
	depthBiasClamp?: number;
	depthBiasSlopeScale?: number;
	stencilBack?: GPUStencilBackOrFrontObj;
	stencilFront?: GPUStencilBackOrFrontObj;
	stencilReadMask?: number;
	stencilWriteMask?: number;
}
export { GPUDepthStencilState };
