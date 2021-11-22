/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import PBRShaderDecorator from "../../pbr/material/PBRShaderDecorator";
import PBRMaterial from "../../pbr/material/PBRMaterial";
import { MaterialPipeline } from "../../vox/material/pipeline/MaterialPipeline";

export default class PBRMaterialBuilder {

    hdrBrnEnabled: boolean = false;
    vtxFlatNormal: boolean = false;

    pipeline:MaterialPipeline = null;
    constructor() {
    }

    makePBRMaterial(metallic: number, roughness: number, ao: number): PBRMaterial {

        let material: PBRMaterial = new PBRMaterial();
        material.setMaterialPipeline( this.pipeline );
        let decorator: PBRShaderDecorator = new PBRShaderDecorator();
        material.decorator = decorator;

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