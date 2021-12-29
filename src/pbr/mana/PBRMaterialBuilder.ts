/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import PBRShaderDecorator from "../../pbr/material/PBRShaderDecorator";
import PBRMaterial from "../../pbr/material/PBRMaterial";
import { MaterialPipeline } from "../../vox/material/pipeline/MaterialPipeline";
import { VertUniformComp } from "../../vox/material/component/VertUniformComp";
import { CommonMaterialContext } from "../../materialLab/base/CommonMaterialContext";

export default class PBRMaterialBuilder {

    hdrBrnEnabled: boolean = false;
    vtxFlatNormal: boolean = false;

    materialCtx: CommonMaterialContext;
    //pipeline:MaterialPipeline = null;
    constructor() {
    }

    makePBRMaterial(metallic: number, roughness: number, ao: number): PBRMaterial {

        let material = this.materialCtx.createPBRLightMaterial(true, true, true);
        let decorator = material.decorator;
        console.log("makePBRMaterial(), decorator: ",decorator);

        decorator.woolEnabled = true;
        decorator.toneMappingEnabled = true;
        decorator.specularEnvMapEnabled = true;
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