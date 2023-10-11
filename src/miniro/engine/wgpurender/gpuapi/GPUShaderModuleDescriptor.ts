interface GPUShaderModuleDescriptor {
	label?: string;
	code: string;
	/**
	 * value example: {0: false, 1200: 3.0, width: 20, height: 15,}
	 * see: https://gpuweb.github.io/gpuweb/#typedefdef-gpupipelineconstantvalue
	 */
	constants?: any;
}
export { GPUShaderModuleDescriptor };
