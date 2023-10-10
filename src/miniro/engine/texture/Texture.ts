import ITexData from "./ITexData";

export default class Texture {

	protected mGL: any | null = null;
	protected mTexBufW = 128;
	protected mTexBufH = 128;
	protected mTexWidth = 128;
	protected mTexHeight = 128;

	protected mTexTarget = 0;
	// The fragment processor texture sampler type.
	protected mSampler = -1;
	// have render useable data
	protected mHaveRData = false;
	protected mType = 0;
	protected mGenerateMipmap = true;

	protected mTexGpuBuf: any = null;

	name = "Texture";
	internalFormat = 0;
	srcFormat = 0;
	dataType = 0;
	wrap_s = 0;
	wrap_t = 0;
	wrap_r = 0;

	mipmapEnabled = false;
	flipY = false;
	premultiplyAlpha = false;

	/**
	 * the value contains (1,2,4,8), the default value is 4
	 */
	unpackAlignment = 4;
	minFilter = 0;
	// webgl1环境下,这个参数值为LINEAR会报错:
	// [.WebGL-0BC70EE8]RENDER WARNING: texture bound to texture unit 1 is not renderable. It maybe non-power-of-2 and have incompatible texture filtering.
	magFilter = 0;
	// 用于记录自身变换的版本号，例如数据变换
	version = 0;
	constructor(gl: any, texWidth: number = 128, texHeight: number = 128) {

		this.mGL = gl;
		this.mTexTarget = gl.TEXTURE_2D;

		this.internalFormat = gl.RGBA;
		this.srcFormat = gl.RGBA;
		this.dataType = gl.UNSIGNED_BYTE;
		this.wrap_s = gl.CLAMP_TO_EDGE;
		this.wrap_t = gl.CLAMP_TO_EDGE;
		this.wrap_r = gl.CLAMP_TO_EDGE;

		this.minFilter = gl.LINEAR_MIPMAP_LINEAR;
		this.magFilter = gl.LINEAR;

		this.mTexWidth = texWidth;
		this.mTexHeight = texHeight;
	}
	isGpuEnabled(): boolean {
		return this.mTexGpuBuf != null;
	}
	isDataEnough(): boolean { return this.mHaveRData; }
	__$$use(gl: any, tsu: any, ti: number): void {

		if (this.mTexGpuBuf) {

			gl.uniform1i(tsu, ti - gl.TEXTURE0);
			gl.activeTexture(ti);
			gl.bindTexture(this.mSampler, this.mTexGpuBuf);
		}
	}
	protected testDataEnough(): void {}

    protected createTexBuf(gl: any): boolean {
        if (!this.mTexGpuBuf) {
            this.mSampler = gl.TEXTURE_2D;
			this.mTexGpuBuf = gl.createTexture();
			gl.bindTexture(this.mSampler, this.mTexGpuBuf);
            return true;
        }
        return false;
    }
    // sub class override
    protected uploadData(gl: any): void {
    }
    /**
     * This function only be be called by the renderer inner system.
     * if sub class override this function, it must does call this function.
     */
    __$$upload(gl: any): void {
        if (this.mTexGpuBuf == null && this.mHaveRData) {
            let buildStatus = this.createTexBuf(gl);
            if (buildStatus) {
				// console.log("upload an img to texture gpu res.");
                this.__$updateToGpuBegin(gl);
                this.uploadData(gl);
                this.__$buildParam(gl);
                this.mGenerateMipmap = true;
            }
        }
    }
    protected __$buildParam(gl: any): void {
        this.mTexBufW = this.mTexWidth;
        this.mTexBufH = this.mTexHeight;
        // texture wrap
        gl.texParameteri(this.mSampler, gl.TEXTURE_WRAP_S, this.wrap_s);
        gl.texParameteri(this.mSampler, gl.TEXTURE_WRAP_T, this.wrap_t);
        // texture filter
        gl.texParameteri(this.mSampler, gl.TEXTURE_MIN_FILTER, this.minFilter);
        gl.texParameteri(this.mSampler, gl.TEXTURE_MAG_FILTER, this.magFilter);

        if (this.mTexTarget == gl.TEXTURE_3D) {
            gl.texParameteri(this.mSampler, gl.TEXTURE_WRAP_R, this.wrap_r);
            gl.texParameteri(gl.TEXTURE_3D, gl.TEXTURE_BASE_LEVEL, 0);
            gl.texParameteri(gl.TEXTURE_3D, gl.TEXTURE_MAX_LEVEL, Math.log2(this.mTexWidth));
        }
        if (this.mipmapEnabled && this.mGenerateMipmap) {
            gl.generateMipmap(this.mSampler);
        }
    }
	/**
	 * sub class can not override!!!!
	 */
	protected dataUploadToGpu(gl: any, texData: ITexData, texDatas: ITexData[], force: boolean = false): void {
		this.version = 0;
		const interType = this.internalFormat;
		const format = this.srcFormat;
		const type = this.dataType;
		let d = texData;
		if (texDatas == null) {
			if (d.status > -1 || force) d.updateToGpu(gl, this.mSampler, interType, format, type, force);
		} else {
			const ds = texDatas;
			for (let i = 0, len = ds.length; i < len; ++i) {
				d = ds[i];
				if (d != null) {
					if (d.status > -1 || force) d.updateToGpu(gl, this.mSampler, interType, format, type, force);
				}
			}
			this.mGenerateMipmap = false;
		}
	}
	protected __$updateToGpuBegin(gl: any): void {

		gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, this.flipY);
		gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, this.premultiplyAlpha);
		gl.pixelStorei(gl.UNPACK_ALIGNMENT, this.unpackAlignment);
	}
	protected __$updateToGpuEnd(gl: any): void {}

    __$destroy(): void {
		if(this.mGL) {
			if(this.mTexGpuBuf) {
				this.mGL.deleteTexture(this.mTexGpuBuf);
				this.mTexGpuBuf = null;
			}
			this.mGL = null;
		}
		this.mHaveRData = false;
	}
}
