/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import DefaultPBRMaterial2 from "../../pbr/material/DefaultPBRMaterial2";
import PBRMaterial from "../../pbr/material/PBRMaterial";
import TextureProxy from "../../vox/texture/TextureProxy";
import { TextureConst } from "../../vox/texture/TextureConst";
import ImageTextureLoader from "../../vox/texture/ImageTextureLoader";
import DefaultPBRLight from "./DefaultPBRLight";
import Color4 from "../../vox/material/Color4";
import GlobalLightData from "../../light/base/GlobalLightData";

export default class PBRMaterialBuilder {

    texLoader: ImageTextureLoader = null;
    lightData: GlobalLightData = null;
    hdrBrnEnabled: boolean = false;
    constructor() {
    }

    getImageTexByUrl(purl: string, wrapRepeat: boolean = true, mipmapEnabled = true): TextureProxy {
        let ptex: TextureProxy = this.texLoader.getImageTexByUrl(purl);
        ptex.mipmapEnabled = mipmapEnabled;
        if (wrapRepeat) ptex.setWrap(TextureConst.WRAP_REPEAT);
        return ptex;
    }
    makePBRMaterial(metallic: number, roughness: number, ao: number): PBRMaterial {
        let material: PBRMaterial = new PBRMaterial(this.lightData.getPointLightTotal(), this.lightData.getDirecLightTotal());
        material.hdrBrnEnabled = this.hdrBrnEnabled;
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