interface GPUVertexAttribute {
	label?: string;
	shaderLocation: number;
	offset: number;
	/**
	 * In GPUVertexFormat: https://gpuweb.github.io/gpuweb/#enumdef-gpuvertexformat
	 */
	format: string;
}
export { GPUVertexAttribute };
