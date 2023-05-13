/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2023 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import IRendererScene from "../../vox/scene/IRendererScene";
import TextureConst from "../../vox/texture/TextureConst";
import { IFloatCubeTexture } from "../../vox/render/texture/IFloatCubeTexture";
import { IBytesCubeTexture } from "../../vox/render/texture/IBytesCubeTexture";
import BinaryLoader from "../../vox/assets/BinaryLoader";

export class TextureLoader {

    protected m_rscene: IRendererScene = null;
    texture: IFloatCubeTexture | IBytesCubeTexture = null;
    width: number = 128;
    height: number = 128;
    constructor() {
    }
    
    loadTextureWithUrl(url:string, rscene: IRendererScene): void {
        //let url: string = "static/bytes/spe.mdf";
        let loader: BinaryLoader = new BinaryLoader();
        loader.uuid = url;
        loader.load(url, this);
        this.m_rscene = rscene;
        this.createTexture();
    }
    protected createTexture(): void {

        this.texture = this.m_rscene.textureBlock.createFloatCubeTex(32, 32);
    }
    loaded(buffer: ArrayBuffer, uuid: string): void {
        //console.log("loaded... uuid: ", uuid, buffer.byteLength);
        this.parseTextureBuffer(buffer);
        this.m_rscene = null;
        this.texture = null;
    }
    loadError(status: number, uuid: string): void {
    }
    
    protected parseTextureBuffer(buffer: ArrayBuffer): void {
        
        let begin: number = 0;
        let width: number = this.width;
        let height: number = this.height;
        let size: number = width * height * 3;
        let fs32: Float32Array = new Float32Array(buffer);
        let subArr: Float32Array = null;
        let tex: IFloatCubeTexture = this.texture as IFloatCubeTexture;
        tex.toRGBFormat();
        for (let i: number = 0, len: number = 6; i < len; ++i) {
            subArr = fs32.slice(begin, begin + size);
            console.log("width,height: ", width, height, ", subArr.length: ", subArr.length);
            tex.setDataFromBytesToFaceAt(i, subArr, width, height, 0);
            begin += size;
        }
    }
}
export class SpecularTextureLoader extends TextureLoader {

    hdrBrnEnabled: boolean = false;
    constructor() {
        super();
    }
    
    protected createTexture(): void {
        if(this.texture == null) {
            let block = this.m_rscene.textureBlock;
            if(this.hdrBrnEnabled) this.texture = block.createBytesCubeTex(32, 32);
            else this.texture = block.createFloatCubeTex(32, 32);
        }
    }
    parseFloat(buffer: ArrayBuffer): void {

        this.createTexture();

        let begin: number = 0;
        let width: number = this.width;
        let height: number = this.height;
        
        let component:number = 3;
        
        let fs32: Float32Array = new Float32Array(buffer);
        let subArr: Float32Array = null;
  
        let tex: IFloatCubeTexture = this.texture as IFloatCubeTexture;
        tex.toRGBFormat();
        //tex.toRGBFormatFloat32F();
        tex.minFilter = TextureConst.LINEAR_MIPMAP_LINEAR;
        tex.magFilter = TextureConst.LINEAR;
        
        for (let j = 0; j < 9; j++) {
            for (let i = 0; i < 6; i++) {
                const size = width * height * component;
                subArr = fs32.subarray(begin, begin + size);
                tex.setDataFromBytesToFaceAt(i, subArr, width, height, j);
                begin += size;
            }
            width >>= 1;
            height >>= 1;
        }
    }
    parseHdrBrn(buffer: ArrayBuffer): void {

        this.createTexture();

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
            this.parseHdrBrn( buffer );
        }
        else {
            this.parseFloat( buffer );
        }
    }
}