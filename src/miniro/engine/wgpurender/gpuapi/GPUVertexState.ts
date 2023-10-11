import { GPUShaderModule } from "./GPUShaderModule";
import { GPUVertexBufferLayout } from "./GPUVertexBufferLayout";
interface GPUVertexState {
	label?: string;
	module: GPUShaderModule;
	entryPoint: string;
	buffers: GPUVertexBufferLayout[];
}
export { GPUVertexState };
