/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import DefaultPBRMaterial from "../../pbr/material/DefaultPBRMaterial";
import TextureProxy from "../../vox/texture/TextureProxy";
import { TextureConst } from "../../vox/texture/TextureConst";
import ImageTextureLoader from "../../vox/texture/ImageTextureLoader";
import DefaultPBRLight from "./DefaultPBRLight";

export default class MaterialBuilder {

    texLoader: ImageTextureLoader = null;
    lightModule: DefaultPBRLight = null;
    
    constructor() {
    }

    getImageTexByUrl(purl: string, wrapRepeat: boolean = true, mipmapEnabled = true): TextureProxy {
        let ptex: TextureProxy = this.texLoader.getImageTexByUrl(purl);
        ptex.mipmapEnabled = mipmapEnabled;
        if (wrapRepeat) ptex.setWrap(TextureConst.WRAP_REPEAT);
        return ptex;
    }

    makeDefaultPBRMaterial(metallic: number, roughness: number, ao: number): DefaultPBRMaterial {
        let material: DefaultPBRMaterial = new DefaultPBRMaterial(this.lightModule.getPointLightTotal(), this.lightModule.getDirecLightTotal());
        material.setMetallic(metallic);
        material.setRoughness(roughness);
        material.setAO(ao);
        this.lightModule.setLightToMaterial(material);
        let colorSize: number = 2.0;
        material.setAlbedoColor(Math.random() * colorSize, Math.random() * colorSize, Math.random() * colorSize);
        colorSize = 0.8;
        material.setF0(Math.random() * colorSize, Math.random() * colorSize, Math.random() * colorSize);
        material.setScatterIntensity(Math.random() * 128.0 + 1.0);
        material.setAmbientFactor(0.01, 0.01, 0.01);
        material.woolEnabled = true;
        material.toneMappingEnabled = true;
        material.envMapEnabled = true;
        material.specularBleedEnabled = true;
        material.metallicCorrection = true;
        material.absorbEnabled = false;
        material.normalNoiseEnabled = false;
        material.pixelNormalNoiseEnabled = true;
        return material;
    }
}