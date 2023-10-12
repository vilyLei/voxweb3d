import { GPUPipelineLayout } from "./GPUPipelineLayout";
import { GPUVertexState } from "./GPUVertexState";
import { GPUFragmentState } from "./GPUFragmentState";
import { GPUPrimitiveState } from "./GPUPrimitiveState";
import { GPUDepthStencilState } from "./GPUDepthStencilState";
import { GPUMultisampleObject } from "./GPUMultisampleObject";

interface GPURenderPipelineDescriptor {
	label?: string;

	layout: GPUPipelineLayout;
	vertex?: GPUVertexState;
	fragment?: GPUFragmentState;
	primitive?: GPUPrimitiveState;
	depthStencil?: GPUDepthStencilState;

	multisample?: GPUMultisampleObject;
}
export { GPURenderPipelineDescriptor };
