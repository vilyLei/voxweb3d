import { GPUShaderModule } from "./GPUShaderModule";
import { GPUVertexBufferLayout } from "./GPUVertexBufferLayout";
interface GPUVertexState {
	label?: string;

	/**
	 * for example: {
	 * 			0: false,1200: 3.0,1300: 2.0,
	 * 			width: 20,height: 15,depth: -1,
	 * }
	 */
	constants?: any;
	module: GPUShaderModule;
	entryPoint: string;
	buffers: GPUVertexBufferLayout[];
}
export { GPUVertexState };
