import { GPUTexture } from "../../gpu/GPUTexture";
import { calculateMipLevels, WebGPUContext } from "../../gpu/WebGPUContext";

class WROTextureContext {
	private mWGCtx: WebGPUContext | null = null;
	private static sUid = 0;
	constructor(wgCtx?: WebGPUContext) {
		if (wgCtx) {
			this.initialize(wgCtx);
		}
	}
	initialize(wgCtx: WebGPUContext): void {
		this.mWGCtx = wgCtx;
	}
	async createMaterialTexture(generateMipmaps: boolean, url: string = "", flipY = false, format = "rgba8unorm") {
		const device = this.mWGCtx.device;
		const mipmapG = this.mWGCtx.mipmapGenerator;

		let tex: GPUTexture;
		url = url != "" ? url : "static/assets/box.jpg";
		const response = await fetch(url);

		let imageBitmap: ImageBitmap;
		try {
			imageBitmap = await createImageBitmap(await response.blob());
		} catch (e) {
			console.error("createMaterialTexture(), error url: ", url);
			return null;
		}

		const mipLevelCount = generateMipmaps ? calculateMipLevels(imageBitmap.width, imageBitmap.height) : 1;
		const textureDescriptor = {
			size: { width: imageBitmap.width, height: imageBitmap.height, depthOrArrayLayers: 1 },
			format,
			mipLevelCount,
			usage: GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.COPY_DST | GPUTextureUsage.RENDER_ATTACHMENT,
			label: url
		};
		tex = device.createTexture(textureDescriptor);
		device.queue.copyExternalImageToTexture({ source: imageBitmap, flipY }, { texture: tex }, [imageBitmap.width, imageBitmap.height]);

		if (generateMipmaps) {
			mipmapG.generateMipmap(tex, textureDescriptor);
		}
		tex.url = url;
		tex.uid = WROTextureContext.sUid++;
		return tex;
	}

}
export { WROTextureContext };
