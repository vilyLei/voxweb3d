import {GPUCanvasConfiguration} from './GPUCanvasConfiguration'
import { GPUTexture } from './GPUTexture';
/**
 * see: https://gpuweb.github.io/gpuweb/#gpucanvascontext
 *		https://developer.mozilla.org/en-US/docs/Web/API/GPUCanvasContext
 */
interface GPUCanvasContext {

	canvas: HTMLCanvasElement | OffscreenCanvas;
	configure(config?: GPUCanvasConfiguration): void;

	unconfigure(): void;

	getCurrentTexture(): GPUTexture;
}
export { GPUCanvasContext };
