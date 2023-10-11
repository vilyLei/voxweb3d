import { GPUDevice } from "./GPUDevice";
interface GPUCanvasConfiguration {
	device?: GPUDevice;
	format?: string;
	usage?: number;
	alphaMode: string;
}
export { GPUCanvasConfiguration };
