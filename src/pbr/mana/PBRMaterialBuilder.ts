/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import PBRShaderDecorator from "../../pbr/material/PBRShaderDecorator";
import PBRMaterial from "../../pbr/material/PBRMaterial";
import TextureProxy from "../../vox/texture/TextureProxy";
import { TextureConst } from "../../vox/texture/TextureConst";
import ImageTextureLoader from "../../vox/texture/ImageTextureLoader";
import GlobalLightData from "../../light/base/GlobalLightData";

import { MaterialPipeline } from "../../vox/material/pipeline/MaterialPipeline";

export default class PBRMaterialBuilder {

    texLoader: ImageTextureLoader = null;
    lightData: GlobalLightData = null;
    hdrBrnEnabled: boolean = false;
    vtxFlatNormal: boolean = false;

    pipeline:MaterialPipeline = new MaterialPipeline();
    constructor() {
    }

    getImageTexByUrl(purl: string, wrapRepeat: boolean = true, mipmapEnabled = true): TextureProxy {
        let ptex: TextureProxy = this.texLoader.getImageTexByUrl(purl);
        ptex.mipmapEnabled = mipmapEnabled;
        if (wrapRepeat) ptex.setWrap(TextureConst.WRAP_REPEAT);
        return ptex;
    }
    makePBRMaterial(metallic: number, roughness: number, ao: number): PBRMaterial {

        let material: PBRMaterial = new PBRMaterial();
        material.setMaterialPipeline( this.pipeline );

        material.decorator = new PBRShaderDecorator();
        material.decorator.lightData = this.lightData;

        let decorator: PBRShaderDecorator = material.decorator;

        decorator.woolEnabled = true;
        decorator.toneMappingEnabled = true;
        decorator.envMapEnabled = true;
        decorator.specularBleedEnabled = true;
        decorator.metallicCorrection = true;
        decorator.absorbEnabled = false;
        decorator.normalNoiseEnabled = false;
        decorator.pixelNormalNoiseEnabled = true;
        decorator.hdrBrnEnabled = this.hdrBrnEnabled;
        decorator.vtxFlatNormal = this.vtxFlatNormal;
        
        material.setMetallic(metallic);
        material.setRoughness(roughness);
        material.setAO(ao);

        return material;
    }
}