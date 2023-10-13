import { GPUImageCopyTexture } from "./GPUImageCopyTexture";

/**
 * See: https://gpuweb.github.io/gpuweb/#dictdef-gpuimagecopytexturetagged
 */
interface GPUImageCopyTextureTagged extends GPUImageCopyTexture {

    /**
     * Possible values are:
     *      "srgb", "display-p3"
     * The default value is "srgb".
     * See: https://html.spec.whatwg.org/multipage/canvas.html#predefinedcolorspace
     */
    colorSpace?: string;
    /**
     * The default value is false
     */
    premultipliedAlpha?: boolean;
}
export { GPUImageCopyTextureTagged };
