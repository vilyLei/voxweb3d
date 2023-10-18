import { GPUTexture } from "./GPUTexture";
import { WebGPUContextImpl } from "./WebGPUContextImpl";
import { calculateMipLevels, GPUMipmapGenerator } from "../texture/GPUMipmapGenerator";

class WebGPUTextureContext {

	private mWGCtx: WebGPUContextImpl;
	private static sUid = 0;
	readonly mipmapGenerator = new GPUMipmapGenerator();

	constructor(wgCtx?: WebGPUContextImpl) {
		if (wgCtx) {
			this.initialize(wgCtx);
		}
	}
	initialize(wgCtx: WebGPUContextImpl): void {
		if(!this.mWGCtx && wgCtx) {
			this.mWGCtx = wgCtx;
			this.mipmapGenerator.initialize(wgCtx.device);
		}
	}
	async createTexByUrl(url: string, generateMipmaps: boolean = true, flipY = false, format = "rgba8unorm") {

		const response = await fetch(url);

		let imageBitmap: ImageBitmap;
		try {
			imageBitmap = await createImageBitmap(await response.blob());
		} catch (e) {
			console.error("createMaterialTexture(), error url: ", url);
			return null;
		}
		const tex = this.createTexByImage(imageBitmap, generateMipmaps,flipY,format,url);
		tex.url = url;
		return tex;
	}

	createTexByImage(image: ImageBitmap | HTMLVideoElement | HTMLCanvasElement | OffscreenCanvas, generateMipmaps: boolean = true, flipY = false, format = "rgba8unorm", label?: string): GPUTexture {

		const device = this.mWGCtx.device;
		const mipmapG = this.mipmapGenerator;
		const mipLevelCount = generateMipmaps ? calculateMipLevels(image.width, image.height) : 1;
		const textureDescriptor = {
			size: { width: image.width, height: image.height, depthOrArrayLayers: 1 },
			format,
			mipLevelCount,
			usage: GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.COPY_DST | GPUTextureUsage.RENDER_ATTACHMENT,
		};
		let tex = device.createTexture(textureDescriptor);
		device.queue.copyExternalImageToTexture({ source: image, flipY }, { texture: tex }, [image.width, image.height]);

		if (generateMipmaps) {
			mipmapG.generateMipmap(tex, textureDescriptor);
		}
		tex.uid = WebGPUTextureContext.sUid++;
		return tex;
	}
}
export { WebGPUTextureContext };
