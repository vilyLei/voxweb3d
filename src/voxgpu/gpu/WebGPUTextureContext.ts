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
		if (!this.mWGCtx && wgCtx) {
			this.mWGCtx = wgCtx;
			this.mipmapGenerator.initialize(wgCtx.device);
		}
	}
	async createTex2DByUrl(url: string, generateMipmaps = true, flipY = false, format = "rgba8unorm") {
		const response = await fetch(url);

		let imageBitmap: ImageBitmap;
		try {
			imageBitmap = await createImageBitmap(await response.blob());
		} catch (e) {
			console.error("createMaterialTexture(), error url: ", url);
			return null;
		}
		const tex = this.createTex2DByImage(imageBitmap, generateMipmaps, flipY, format, url);
		tex.url = url;
		return tex;
	}

	createTex2DByImage(image: WebImageType, generateMipmaps = true, flipY = false, format = "rgba8unorm", label?: string): GPUTexture {
		const device = this.mWGCtx.device;
		const mipmapG = this.mipmapGenerator;
		const mipLevelCount = generateMipmaps ? calculateMipLevels(image.width, image.height) : 1;
		const textureDescriptor = {
			dimension: "2d",
			size: { width: image.width, height: image.height, depthOrArrayLayers: 1 },
			format,
			mipLevelCount,
			usage: GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.COPY_DST | GPUTextureUsage.RENDER_ATTACHMENT
		};
		let tex = device.createTexture(textureDescriptor);
		device.queue.copyExternalImageToTexture({ source: image, flipY }, { texture: tex }, [image.width, image.height]);

		if (generateMipmaps) {
			mipmapG.generateMipmap(tex, textureDescriptor);
		}
		tex.uid = WebGPUTextureContext.sUid++;
		return tex;
	}

	async createTexCubeByUrls(urls: string[], generateMipmaps = true, flipY = false, format = "rgba8unorm") {
		const promises = urls.map(async (src: string) => {
			const response = await fetch(src);
			return createImageBitmap(await response.blob());
		});
		const images = await Promise.all(promises);
		const tex = this.createTexCubeByImages(images, generateMipmaps, flipY, (format = "rgba8unorm"));
		tex.url = urls[0];
		tex.uid = WebGPUTextureContext.sUid++;
		return tex;
	}
	createTexCubeByImages(images: WebImageType[], generateMipmaps = true, flipY = false, format = "rgba8unorm", label?: string): GPUTexture {
		let image = images[0];

		const device = this.mWGCtx.device;
		const queue = this.mWGCtx.queue;
		const mipmapG = this.mipmapGenerator;
		const mipLevelCount = generateMipmaps ? calculateMipLevels(image.width, image.height) : 1;
		const textureDescriptor = {
			dimension: "2d",
			size: { width: image.width, height: image.height, depthOrArrayLayers: 6 },
			format,
			mipLevelCount,
			usage: GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.COPY_DST | GPUTextureUsage.RENDER_ATTACHMENT
		};
		const tex = device.createTexture(textureDescriptor);
		for (let i = 0; i < images.length; ++i) {
			image = images[i];
			queue.copyExternalImageToTexture({ source: image, flipY }, { texture: tex, origin: [0, 0, i] }, [image.width, image.height]);
		}
		if (generateMipmaps) {
			mipmapG.generateMipmap(tex, textureDescriptor);
		}
		tex.uid = WebGPUTextureContext.sUid++;
		return tex;
	}
}
export { WebGPUTextureContext };
