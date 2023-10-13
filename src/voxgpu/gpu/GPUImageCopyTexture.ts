import { GPUTexture } from "./GPUTexture";
import { GPUOrigin3D } from "./GPUOrigin3D";
/**
 * See: https://developer.mozilla.org/en-US/docs/Web/API/GPUQueue/writeTexture
 */
interface GPUImageCopyTexture {
	label?: string;
	texture: GPUTexture;
	/**
	 * The default value is 0
	 */
    mipLevel?: number;
    origin?: GPUOrigin3D;
	/**
	 * An enumerated value defining which aspects of the texture to write the data to.
	 * Possible values are:
	 * 		"all"
	 * 		All available aspects of the texture format will be written to, which can mean all or any of color, depth, and stencil, depending on what kind of format you are dealing with.
	 * 		"depth-only"
	 * 		Only the depth aspect of a depth-or-stencil format will be written to.
	 * 		"stencil-only"
	 * 		Only the stencil aspect of a depth-or-stencil format will be written to.
	 * The default value is "all".
	 */
    aspect?: string;
}
export { GPUImageCopyTexture };
