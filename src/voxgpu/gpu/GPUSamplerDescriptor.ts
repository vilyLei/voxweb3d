import { GPUBindGroupLayout } from "./GPUBindGroupLayout";
/**
 * See: https://gpuweb.github.io/gpuweb/#GPUSamplerDescriptor
 */
interface GPUSamplerDescriptor {
	label?: string;
	/**
	 * An enumerated value specifying the behavior of the sampler when the sample footprint width extends beyond the width of the texture.
	 * Possible values are:
	 * 		"clamp-to-edge": The texture coordinates are clamped between 0.0 and 1.0, inclusive.
	 * 		"repeat": The texture coordinates wrap to the other side of the texture.
	 * 		"mirror-repeat": The texture coordinates wrap to the other side of the texture,
	 * 						but the texture is flipped when the integer part of the coordinate is odd.
	 * If omitted, addressModeU defaults to "clamp-to-edge".
	 */
	addressModeU?: string;			// = "clamp-to-edge";
	/**
	 * An enumerated value specifying the behavior of the sampler when the sample footprint height extends beyond the height of the texture.
	 * Possible and default values are the same as for addressModeU: "clamp-to-edge".
	 */
    addressModeV?: string;			// = "clamp-to-edge";
	/**
	 * An enumerated value specifying the behavior of the sampler when the sample footprint depth extends beyond the depth of the texture.
	 * Possible and default values are the same as for addressModeU: "clamp-to-edge".
	 */
    addressModeW?: string;			// = "clamp-to-edge";
	/**
	 * An enumerated value specifying the sampling behavior when the sample footprint is smaller than or equal to one texel.
	 * Possible values are:
	 * 		"nearest": Return the value of the texel nearest to the texture coordinates.
	 * 		"linear": Select two texels in each dimension and return a linear interpolation between their values.
	 * If omitted, magFilter defaults to "nearest".
	 */
    magFilter?: string;				// = "nearest";
	/**
	 * An enumerated value specifying the sampling behavior when the sample footprint is larger than one texel.
	 * Possible and default values are the same as for magFilter: nearest".
	 */
    minFilter?: string;				// = "nearest";
	/**
	 * An enumerated value specifying the behavior when sampling between mipmap levels.
	 * Possible and default values are the same as for magFilter: nearest".
	 */
    mipmapFilter?: string;			// = "nearest";
	/**
	 * A number specifying the minimum level of detail used internally when sampling a texture.
	 * If omitted, lodMinClamp defaults to 0.
	 */
    lodMinClamp?: number;			// = 0;
	/**
	 * A number specifying the maximum level of detail used internally when sampling a texture.
	 * If omitted, lodMaxClamp defaults to 32.
	 */
    lodMaxClamp?: number;			// = 32;
	/**
	 * If specified, the sampler will be a comparison sampler of the specified type.
	 * Possible (enumerated) values are:
	 * 		"never": Comparison tests never pass.
	 * 		"less": A provided value passes the comparison test if it is less than the sampled value.
	 * 		"equal": A provided value passes the comparison test if it is equal to the sampled value.
	 * 		"less-equal": A provided value passes the comparison test if it is less than or equal to the sampled value.
	 * 		"greater": A provided value passes the comparison test if it is greater than the sampled value.
	 * 		"not-equal": A provided value passes the comparison test if it is not equal to the sampled value.
	 * 		"greater-equal": A provided value passes the comparison test if it is greater than or equal to the sampled value.
	 * 		"always": Comparison tests always pass.
	 * Comparison samplers may use filtering,
	 * but the sampling results will be implementation-dependent and may differ from the normal filtering rules.
	 */
    compare?: string;
	/**
	 * Specifies the maximum anisotropy value clamp used by the sampler. If omitted, maxAnisotropy defaults to 1.
	 * Most implementations support maxAnisotropy values in a range between 1 and 16, inclusive.
	 * The value used will be clamped to the maximum value that the underlying platform supports.
	 */
    maxAnisotropy?: number;			// = 1;
}
export { GPUSamplerDescriptor };
