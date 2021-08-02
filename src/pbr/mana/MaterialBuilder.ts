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
import Color4 from "../../vox/material/Color4";

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
        /*
        this.lightModule.setLightToMaterial(material);
        let colorSize: number = 2.0;
        let pr: number = Math.random() * colorSize;
        let pg: number = Math.random() * colorSize;
        let pb: number = Math.random() * colorSize;
        material.setAlbedoColor(pr, pg, pb);
        colorSize = 0.8;
        pr = Math.random() * colorSize;
        pg = Math.random() * colorSize;
        pb = Math.random() * colorSize;
        material.setF0(pr, pg, pb);
        material.setScatterIntensity(Math.random() * 128.0 + 1.0);
        material.setAmbientFactor(0.01, 0.01, 0.01);
        //*/
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