import { GPUVertexAttribute } from "./GPUVertexAttribute";
interface GPUVertexBufferLayout {
	label?: string;
	// shaderLocation: number;
	// offset: number;
	// format: string;
	attributes: GPUVertexAttribute[];
	arrayStride: number;
	stepMode: string;
}
export { GPUVertexBufferLayout };
