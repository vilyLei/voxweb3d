import { GPUBindGroupLayout } from "./GPUBindGroupLayout";

interface GPUBindGroupLayoutDescriptorEntityBuffer {
	type?: string;
}
//https://gpuweb.github.io/gpuweb/#dictdef-gpubindgrouplayoutentry
interface GPUBindGroupLayoutEntity {
	label?: string;
	/**
	 * A unique identifier for a resource binding within the GPUBindGroupLayout, corresponding to a GPUBindGroupEntry.
	 * binding and a @binding attribute in the GPUShaderModule.
	 */
	binding: number;
	/**
	 * A bitset of the members of GPUShaderStage.
	 * Each set bit indicates that a GPUBindGroupLayoutEntry's resource will be accessible from the associated shader stage.
	 * GPUShaderStage(GPUShaderStageFlags) values.
	 * See: https://gpuweb.github.io/gpuweb/#typedefdef-gpushaderstageflags
	 */
	visibility: number;
	buffer?: GPUBindGroupLayoutDescriptorEntityBuffer;
	sampler?: any;
	texture?: any;
}
/**
 * see: https://gpuweb.github.io/gpuweb/#dictdef-gpubindgrouplayoutdescriptor
 */
interface GPUBindGroupLayoutDescriptor {
	label?: string;
	entries: GPUBindGroupLayoutEntity[];
	layout?: GPUBindGroupLayout;
}
export { GPUBindGroupLayoutDescriptor };
