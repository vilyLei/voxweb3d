import IRendererScene from "../../../vox/scene/IRendererScene";
import { IMaterial } from "../../../vox/material/IMaterial";
import { VertUniformComp } from "../../../vox/material/component/VertUniformComp";
import { IAppPBR } from "../interfaces/IAppPBR";
import { PBRDecorator } from "../../../pbr/material/PBRDecorator";
import { IBytesCubeTexture } from "../../../vox/render/texture/IBytesCubeTexture";
import TextureConst from "../../../vox/texture/TextureConst";
import IRenderTexture from "../../../vox/render/texture/IRenderTexture";
import { IFloatCubeTexture } from "../../../vox/render/texture/IFloatCubeTexture";

export class SpecularTextureBuilder {

    hdrBrnEnabled: boolean = false;
    texture: IFloatCubeTexture | IBytesCubeTexture = null;
    width: number = 128;
    height: number = 128;
    
    constructor() {
    }
    
    protected createTexture(hdrBrnEnabled: boolean, rscene: IRendererScene): void {
        if(this.texture == null) {
            let block = rscene.textureBlock;
            if(hdrBrnEnabled) this.texture = block.createBytesCubeTex(32, 32);
            else this.texture = block.createFloatCubeTex(32, 32);
        }
    }
    createFloat(rscene: IRendererScene, buffer: ArrayBuffer): IRenderTexture {

        this.createTexture(false, rscene);

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
        return this.texture;
    }
    createHdrBrn(rscene: IRendererScene, buffer: ArrayBuffer): IRenderTexture {

        this.createTexture(true, rscene);

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
        return this.texture;
    }
}


class Instance implements IAppPBR {
    private m_rscene: IRendererScene = null;
    private m_specularBuilder: SpecularTextureBuilder = null;
    constructor() {

    }
    initialize(rsecne: IRendererScene): void {
        this.m_rscene = rsecne;
    }
    
    createMaterial(vertUniformEnabled: boolean = true): IMaterial {

        let vertUniform: VertUniformComp = vertUniformEnabled ? new VertUniformComp() : null;
        let decor = new PBRDecorator();
        decor.vertUniform = vertUniform;
        return this.m_rscene.materialBlock.createMaterial( decor );
    }
    createSpecularTex( buffer: ArrayBuffer, hdrBrnEnabled?: boolean ): IRenderTexture {
        
        if(hdrBrnEnabled) {
            return this.m_specularBuilder.createHdrBrn(this.m_rscene, buffer);
        }
        return this.m_specularBuilder.createFloat(this.m_rscene, buffer);
    }
}

export { Instance }
