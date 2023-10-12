import { GPUVertexAttribute } from "./GPUVertexAttribute";
interface GPUVertexBufferLayout {
	label?: string;

	attributes: GPUVertexAttribute[];
	/**
	 * A number representing the stride, in bytes, between the different structures (e.g. vertices) inside the buffer.
	 */
	arrayStride: number;
	/**
	 * the default value is "vertex".
	 * Possible values are:
	 * 		"instance": Each structure is an instance — the address is advanced by arrayStride for each instance.
	 * 		"vertex": Each structure is a vertex — the address is advanced by arrayStride for each vertex, and reset between instances.
	 */
	stepMode?: string;
}
export { GPUVertexBufferLayout };
