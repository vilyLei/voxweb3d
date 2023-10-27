import { WebGPUContext } from "../gpu/WebGPUContext";
import { GPUSampler } from "../gpu/GPUSampler";
import { GPUTexture } from "../gpu/GPUTexture";
import { GPUTextureView } from "../gpu/GPUTextureView";

interface WGTextureDataType {
	generateMipmaps?: boolean;
	flipY?: boolean;
	format?: string;
	dimension?: string;
	build(ctx: WebGPUContext): GPUTexture;
	destroy(): void;
}
class WGImageTextureData implements WGTextureDataType {
	protected mImgs: WebImageType[];
	protected mTex: GPUTexture;
	protected mUrl: string;

	generateMipmaps = true;
	flipY = false;
	format = "rgba8unorm";
	dimension = "2d";
	constructor(){}

	build(ctx: WebGPUContext): GPUTexture {

		if (this.mImgs && !this.mTex) {
			switch(this.dimension) {
				case "cube":
					this.mTex = ctx.texture.createTexCubeByImages(this.mImgs, this.generateMipmaps, this.flipY, this.format, this.mUrl);
					break;
				case "2d":
					this.mTex = ctx.texture.createTex2DByImage(this.mImgs[0], this.generateMipmaps, this.flipY, this.format, this.mUrl);
					break;
			}
			this.mTex.url = this.mUrl;
		}
		return this.mTex;
	}
	destroy(): void {}
}
class WGImage2DTextureData extends WGImageTextureData {
	constructor(url: string){
		super();
		this.initByURL(url);
	}
	setImage(image: WebImageType): WGImageTextureData {
		this.mImgs = [image];
		return this;
	}

	private initByURL(url: string): WGImageTextureData {

		this.mUrl = url;
		fetch(url).then((response: Response): void => {
			try {
				response.blob().then((blob: Blob): void => {
					createImageBitmap(blob).then((bmp: ImageBitmap): void => {
						this.mImgs = [bmp];
					});
				});
			} catch (e) {
				console.error("WGImageTextureData::initByURL(), error url: ", url);
				return null;
			}
		});
		return this;
	}
}
class WGImageCubeTextureData extends WGImageTextureData {
	constructor(urls: string[]){
		super();
		this.initCubeMapURLs(urls);
	}

	async createCubeMapImgsByUrls(urls: string[]) {
		const promises = urls.map(async (src: string) => {
			const response = await fetch(src);
			return createImageBitmap(await response.blob());
		});
		const images = await Promise.all(promises);
		return images;
	}
	private initCubeMapURLs(urls: string[]): WGImageTextureData {

		this.dimension = 'cube';
		this.mUrl = urls[0];
		this.createCubeMapImgsByUrls( urls ).then((imgs: ImageBitmap[]): void => {
			this.mImgs = imgs;
		});
		return this;
	}
}
interface WGTextureType {
	shdVarName: string;
	texture?: GPUTexture;
	flipY?: boolean;
	name?: string;
	dimension?: string;
	generateMipmaps?: boolean;
	data?: WGTextureDataType;
}
interface WGTexSamplerType {
	shdVarName: string;
	sampler: GPUSampler;
	name?: string;
}
class WGTexture implements WGTextureType {
	name = "WGTexture";

	shdVarName = "";

	generateMipmaps = true;
	flipY = true;
	dimension = "2d";

	texture: GPUTexture;

	view?: GPUTextureView;
	data?: WGTextureDataType;
	// __$build(): void{};
}
class WGTexSampler implements WGTexSamplerType {
	name = "WGTexture";

	shdVarName = "";
	sampler: GPUSampler;
}
class WGTextureWrapper {
	bindGroupIndex = 0;

	texture: WGTexture;
	sampler?: WGTexSampler;

	constructor(param: { texture: WGTextureType; sampler?: WGTexSamplerType }) {

		const tp = param.texture;
		this.texture = new WGTexture();
		const tex = this.texture as any;
		for (var k in tp) {
			tex[k] = (tp as any)[k];
		}
		if(this.texture.data) {
			let td = this.texture.data;
			if(td.generateMipmaps) tex.generateMipmaps = td.generateMipmaps;
			if(td.flipY) tex.flipY = td.flipY;
			if(td.dimension) tex.dimension = td.dimension;
			if(td.format) tex.format = td.format;
		}

		const sp = param.sampler;
		if (sp) {
			this.sampler = new WGTexSampler();
			const s = this.sampler as any;
			for (var k in sp) {
				s[k] = (sp as any)[k];
			}
		}
	}
	destroy(): void {

	}
}
export { WGImageTextureData, WGImage2DTextureData, WGImageCubeTextureData, WGTextureDataType, WGTextureType, WGTexSamplerType, WGTextureWrapper, WGTexture };
