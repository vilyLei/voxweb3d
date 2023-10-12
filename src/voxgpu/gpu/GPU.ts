import { GPUAdapter } from "./GPUAdapter";
interface GPU {
	requestAdapter(): GPUAdapter;
	getPreferredCanvasFormat(): any;
	/**
	 * In WGSLLanguageFeatures: https://developer.mozilla.org/en-US/docs/Web/API/WGSLLanguageFeatures
	 */
	wgslLanguageFeatures: any;
}
export { GPU };
