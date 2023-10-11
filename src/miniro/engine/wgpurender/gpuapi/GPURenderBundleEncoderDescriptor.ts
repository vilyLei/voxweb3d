import { GPUBuffer } from "./GPUBuffer";
import { GPURenderPipeline } from "./GPURenderPipeline";
import { GPUBindGroup } from "./GPUBindGroup";

interface GPURenderBundleEncoderDescriptor {
	label?:string;
	
	/**
	 * see: https://gpuweb.github.io/gpuweb/#depth-or-stencil-format
	 */
	colorFormats: string[];

	depthReadOnly?: boolean;
	/**
	 * see: https://gpuweb.github.io/gpuweb/#depth-or-stencil-format
	 */
	depthStencilFormat?: boolean;

	sampleCount?: number;
	stencilReadOnly?: boolean;
}
export { GPURenderBundleEncoderDescriptor };
