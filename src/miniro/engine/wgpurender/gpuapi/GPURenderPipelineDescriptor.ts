import { GPUPipelineLayout } from "./GPUPipelineLayout";
import { GPUVertexState } from "./GPUVertexState";
import { GPUFragmentState } from "./GPUFragmentState";
import { GPUPrimitiveState } from "./GPUPrimitiveState";
import { GPUDepthStencilState } from "./GPUDepthStencilState";

interface GPURenderPipelineDescriptor {
	label?: string;

	layout: GPUPipelineLayout;
	vertex?: GPUVertexState;
	fragment?: GPUFragmentState;
	primitive?: GPUPrimitiveState;
	depthStencil?: GPUDepthStencilState;
}
export { GPURenderPipelineDescriptor };
