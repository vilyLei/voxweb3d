import { GPUDevice } from "./GPUDevice";
import { GPUAdapterInfo } from "./GPUAdapterInfo";
interface GPUAdapter {
	limits: any;
	features: any;
	isFallbackAdapter: boolean;
	requestAdapterInfo(): GPUAdapterInfo;
	requestDevice(descriptor?: any): GPUDevice;
}
export { GPUAdapter };
