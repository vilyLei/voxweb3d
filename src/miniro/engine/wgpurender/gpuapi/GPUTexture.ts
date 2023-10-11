import { GPUTextureView } from "./GPUTextureView";

interface GPUTexture {
	label?: string;
	width: number;
	height: number;
	createView(): GPUTextureView;
}
export { GPUTexture };
