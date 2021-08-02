/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import RendererScene from "../../vox/scene/RendererScene";
import TextureProxy from "../../vox/texture/TextureProxy";
import {TextureConst} from "../../vox/texture/TextureConst";
import FloatCubeTextureProxy from "../../vox/texture/FloatCubeTextureProxy";
import BinaryLoader from "../../vox/assets/BinaryLoader";

export class TextureLoader {

    protected m_rscene: RendererScene = null;
    texture: FloatCubeTextureProxy = null;
    constructor() {        
    }
    
    loadTextureWithUrl(url:string, rscene: RendererScene): void {
        //let url: string = "static/bytes/spe.mdf";
        let loader: BinaryLoader = new BinaryLoader();
        loader.uuid = url;
        loader.load(url, this);
        this.m_rscene = rscene;
  
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
        let width: number = 128;
        let height: number = 128;
        let size: number = width * height * 3;
        let fs32: Float32Array = new Float32Array(buffer);
        let subArr: Float32Array = null;
        let tex: FloatCubeTextureProxy = this.texture;
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

    constructor() {
        super();
    }
    protected parseTextureBuffer(buffer: ArrayBuffer): void {
        let begin: number = 0;
        let width: number = 128;
        let height: number = 128;
        
        let fs32: Float32Array = new Float32Array(buffer);
        let subArr: Float32Array = null;
  
        let tex: FloatCubeTextureProxy = this.texture;
        tex.toRGBFormat();
        //tex.toRGBFormatFloat32F();
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