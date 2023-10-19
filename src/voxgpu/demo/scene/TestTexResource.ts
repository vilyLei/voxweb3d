import { GPUTexture } from "../../gpu/GPUTexture";
import { WebGPUContext } from "../../gpu/WebGPUContext";

import { GPUTextureView } from "../../gpu/GPUTextureView";

class TestTexResource {
	wgCtx: WebGPUContext = null;

	constructor(wgCtx?: WebGPUContext) {
		this.wgCtx = wgCtx;
	}

	pngTexList: GPUTexture[] = [];
	jpgTexList: GPUTexture[] = [];
	pngViews: GPUTextureView[] = [];
	jpgViews: GPUTextureView[] = [];

	buildDefault2DTextures(callback: (texs: GPUTexture[]) => void, mipmap = true, flipY = true): void {
		let urls = [
			"static/assets/box.jpg",
			"static/assets/default.jpg",
			"static/assets/decorativePattern_01.jpg",
			"static/assets/letterA.png",
			"static/assets/xulie_08_61.png",
			"static/assets/blueTransparent.png",
			"static/assets/redTransparent.png",
			"static/assets/xulie_H_00002.png",
		];
		this.build2DTextures(urls, callback, mipmap, flipY);
	}
	build2DTextures(urls: string[], callback: (texs: GPUTexture[]) => void, mipmap = true, flipY = true): void {
		if (urls && urls.length > 0) {
			let texs: GPUTexture[] = [];
			let total = urls.length;
			for (let i = 0; i < urls.length; ++i) {
				this.wgCtx.texture.createTex2DByUrl(urls[i], mipmap, flipY).then((tex: GPUTexture) => {
					const view = tex.createView();
					view.label = "(view)" + tex.url;
					if (tex.url.indexOf(".png") > 0) {
						this.pngTexList.push(tex);
						this.pngViews.push(view);
					} else {
						this.jpgTexList.push(tex);
						this.jpgViews.push(view);
					}
					texs.push(tex);
					total--;
					if (total < 1) {
						if (callback) {
							callback(texs);
						}
					}
				});
			}
		} else {
			this.wgCtx.texture.createTex2DByUrl("static/assets/box.jpg", flipY).then((tex: GPUTexture) => {
				if (callback) {
					callback([tex]);
				}
			});
		}
	}
	buildCubeTexture(urls: string[], callback: (texs: GPUTexture) => void, mipmap = true, flipY = true): void {
		this.wgCtx.texture.createTexCubeByUrls(urls, mipmap, flipY).then((tex: GPUTexture) => {
			if (callback) {
				callback(tex);
			}
		});
	}
}
export { TestTexResource };
