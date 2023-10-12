import { GPUDevice } from "./GPUDevice";
import { GPUAdapterInfo } from "./GPUAdapterInfo";
import { GPUDeviceDescriptor } from "./GPUDeviceDescriptor";
interface GPUAdapter {
	limits: any;
	features: any;
	isFallbackAdapter: boolean;
	requestAdapterInfo(): GPUAdapterInfo;
	requestDevice(descriptor?: GPUDeviceDescriptor): GPUDevice;
}
export { GPUAdapter };
