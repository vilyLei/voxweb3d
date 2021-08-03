/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import DefaultPBRMaterial from "../../pbr/material/DefaultPBRMaterial";
import DefaultPBRMaterial2 from "../../pbr/material/DefaultPBRMaterial2";
import TextureProxy from "../../vox/texture/TextureProxy";
import { TextureConst } from "../../vox/texture/TextureConst";
import ImageTextureLoader from "../../vox/texture/ImageTextureLoader";
import DefaultPBRLight from "./DefaultPBRLight";
import Color4 from "../../vox/material/Color4";
import GlobalLightData from "../../light/base/GlobalLightData";

export default class MaterialBuilder {

    texLoader: ImageTextureLoader = null;
    lightModule: DefaultPBRLight = null;
    lightData: GlobalLightData = null;
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
        material.woolEnabled = true;
        material.toneMappingEnabled = true;
        material.envMapEnabled = true;
        material.specularBleedEnabled = true;
        material.metallicCorrection = true;
        material.absorbEnabled = false;
        material.normalNoiseEnabled = false;
        material.pixelNormalNoiseEnabled = true;
        this.lightModule.setLightToMaterial(material);
        return material;
    }
    makeDefaultPBRMaterial2(metallic: number, roughness: number, ao: number): DefaultPBRMaterial2 {
        let material: DefaultPBRMaterial2 = new DefaultPBRMaterial2(this.lightData.getPointLightTotal(), this.lightData.getDirecLightTotal());
        material.setMetallic(metallic);
        material.setRoughness(roughness);
        material.setAO(ao);

        material.woolEnabled = true;
        material.toneMappingEnabled = true;
        material.envMapEnabled = true;
        material.specularBleedEnabled = true;
        material.metallicCorrection = true;
        material.absorbEnabled = false;
        material.normalNoiseEnabled = false;
        material.pixelNormalNoiseEnabled = true;
        material.setLightData( this.lightData );

        return material;
    }
}