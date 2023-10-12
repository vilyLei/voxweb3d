import { GPUDevice } from "./GPUDevice";
/**
 * see: https://gpuweb.github.io/gpuweb/#dictdef-gpucanvasconfiguration
 */
interface GPUCanvasConfiguration {
	label?: string;

	device?: GPUDevice;

	/**
	 * In GPUTextureFormat: https://gpuweb.github.io/gpuweb/#enumdef-gputextureformat
	 */
	format?: string;

	/**
	 * The bitwise flags representing the allowed usages of the GPUTexture
	 * In GPUTextureUsage: https://gpuweb.github.io/gpuweb/#typedefdef-gputextureusageflags
	 */
	usage?: number;
	/**
	 * The default value is "opaque".
	 * Possible values are(in GPUCanvasAlphaMode: https://gpuweb.github.io/gpuweb/#gpucanvasalphamode):
	 *		"opaque","premultiplied",
	 */
	alphaMode?: string;
	/**
	 * The default value is "srgb".
	 * Possible values are(in PredefinedColorSpace: https://html.spec.whatwg.org/multipage/canvas.html#predefinedcolorspace):
	 *		"srgb", "display-p3",
	 */
	colorSpace?: string;

	viewFormats?: string[];
}
export { GPUCanvasConfiguration };
