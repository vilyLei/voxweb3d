import { GPUBuffer } from "./GPUBuffer";
import { GPUTexture } from "./GPUTexture";
import { GPUCommandBuffer } from "./GPUCommandBuffer";

type SrcType = {source: ImageBitmap | HTMLVideoElement | HTMLCanvasElement, origin?:number[] | {x: number, y: number}, flipY?: boolean};
type DstType = {texture: GPUTexture, premultipliedAlpha?:boolean, origin?:number[] | {x: number, y: number}, mipLevel?: number, colorSpace?: string, aspect?: string};
type SizeType = {width:number, height: number, depthOrArrayLayers?: number} | number[];

interface GPUQueue {
	/**
	 * see: https://developer.mozilla.org/en-US/docs/Web/API/GPUQueue/copyExternalImageToTexture
	 */
	copyExternalImageToTexture(source: SrcType, destination: DstType, copySize: SizeType): void;
	writeBuffer(buffer: GPUBuffer, bufferOffset: number, data: ArrayBuffer | DataView, dataOffset?: number, size?: number): void;
	submit(cmds: GPUCommandBuffer[]): void;
	onSubmittedWorkDone(): void;
}
export { GPUQueue };
