import IRendererScene from "../../../vox/scene/IRendererScene";
import { IFloatCubeTexture } from "../../../vox/render/texture/IFloatCubeTexture";
import { HttpFileLoader } from "./HttpFileLoader";
import IRenderTexture from "../../../vox/render/texture/IRenderTexture";
import FloatCubeTextureProxy from "../../../vox/texture/FloatCubeTextureProxy";
import { IBytesCubeTexture } from "../../../vox/render/texture/IBytesCubeTexture";
import TextureConst from "../../../vox/texture/TextureConst";

class BinaryTextureLoader {

    protected m_rc: IRendererScene = null;
    texture: IRenderTexture = null;
    hdrBrnEnabled = false;
    constructor(rc: IRendererScene = null) {
        this.m_rc = rc;
    }
    
    loadTextureWithUrl(url: string): void {
        let hostUrl = window.location.href;
		if (hostUrl.indexOf(".artvily.") > 0) {
			hostUrl = "http://www.artvily.com:9090/";
			url = hostUrl + url;
		}
        this.texture = this.createTex();
        let loader = new HttpFileLoader();
        loader.load(
            url,
            (buffer: ArrayBuffer, uuid: string): void => {
                this.parseTextureBuffer(buffer);
                this.texture = null;
                this.m_rc = null;
            }
        )
    }
    protected createTex(): IRenderTexture {
        return new FloatCubeTextureProxy(32, 32);
        // return this.m_rc.textureBlock.createFloatCubeTex(32,32);
    }
    protected parseTextureBuffer(buffer: ArrayBuffer): void {
        throw Error("illegal operations !!!");
        let begin = 0;
        let width = 128;
        let height = 128;
        let size = width * height * 3;
        let fs32 = new Float32Array(buffer);
        let subArr: Float32Array = null;
        let tex = this.texture as IFloatCubeTexture;
        tex.toRGBFormat();
        for (let i: number = 0, len: number = 6; i < len; ++i) {
            subArr = fs32.slice(begin, begin + size);
            console.log("width,height: ", width, height, ", subArr.length: ", subArr.length);
            tex.setDataFromBytesToFaceAt(i, subArr, width, height, 0);
            begin += size;
        }
    }
}

class SpecularEnvTextureLoader extends BinaryTextureLoader {

    constructor(rc: IRendererScene = null) {
        super(rc);
    }
    protected createTex(): IRenderTexture {
        if(this.texture == null) {
            let block = this.m_rc.textureBlock;
            if(this.hdrBrnEnabled) this.texture = block.createBytesCubeTex(32, 32);
            else this.texture = block.createFloatCubeTex(32, 32);
        }
        return this.texture;
    }
    parseHdrBrn(buffer: ArrayBuffer): void {

        let data16: Uint16Array = new Uint16Array(buffer);
        let currBytes: Uint8Array = new Uint8Array(buffer);
        let begin: number = 0;
        let width: number = data16[4];
        let height: number = data16[5];
        let mipMapMaxLv: number = data16[6];
        console.log("parseHdrBrn, width: ",width, "height: ",height,"mipMapMaxLv: ",mipMapMaxLv);
        let size: number = 0;
        let bytes: Uint8Array = currBytes.subarray(32);
        let tex: IBytesCubeTexture = this.texture as IBytesCubeTexture;
        tex.mipmapEnabled = mipMapMaxLv <= 1;
        tex.minFilter = TextureConst.LINEAR_MIPMAP_LINEAR;
        tex.magFilter = TextureConst.LINEAR;
        
        for (let j: number = 0; j < mipMapMaxLv; j++) {
            for (let i: number = 0; i < 6; i++) {
                size = width * height * 4;
                tex.setDataFromBytesToFaceAt(i, bytes.subarray(begin, begin + size), width, height, j);
                begin += size;
            }
            width >>= 1;
            height >>= 1;
        }
    }
    protected parseTextureBuffer(buffer: ArrayBuffer): void {
        if(this.hdrBrnEnabled) {
            this.parseHdrBrn(buffer);
            return;
        }
        let begin = 0;
        let width = 128;
        let height = 128;

        let fs32 = new Float32Array(buffer);
        let subArr: Float32Array = null;

        let tex = this.texture as IFloatCubeTexture;
        tex.toRGBFormat();
        tex.mipmapEnabled = false;
        tex.minFilter = TextureConst.LINEAR_MIPMAP_LINEAR;
        tex.magFilter = TextureConst.LINEAR;
        
        for (let j = 0; j < 9; j++) {
            for (let i = 0; i < 6; i++) {
                const size = width * height * 3;
                subArr = fs32.slice(begin, begin + size);
                tex.setDataFromBytesToFaceAt(i, subArr, width, height, j);
                begin += size;
            }
            width >>= 1;
            height >>= 1;
        }
    }
}

export { BinaryTextureLoader, SpecularEnvTextureLoader };