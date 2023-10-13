import { GPUOrigin2D } from "./GPUOrigin2D";

declare type OffscreenCanvas = {width: number, height: number};
/**
 * See: https://gpuweb.github.io/gpuweb/#dictdef-gpuimagecopyexternalimage
 */
interface GPUImageCopyExternalImage {
    label?: string;

    source: ImageBitmap | HTMLVideoElement | HTMLCanvasElement | OffscreenCanvas;
    origin?: GPUOrigin2D;
    /**
     * The default value is false
     */
    flipY?: boolean;
}
export { GPUImageCopyExternalImage };
