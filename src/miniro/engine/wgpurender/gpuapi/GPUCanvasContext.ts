import {GPUCanvasConfiguration} from './GPUCanvasConfiguration'
interface GPUCanvasContext {
	configure(config: GPUCanvasConfiguration): void;
	getCurrentTexture(): any;
}
export { GPUCanvasContext };
