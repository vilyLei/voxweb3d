import { GPUAdapter } from "./GPUAdapter";
interface GPU {
	requestAdapter(): GPUAdapter;
	getPreferredCanvasFormat(): any;
}
export { GPU };
