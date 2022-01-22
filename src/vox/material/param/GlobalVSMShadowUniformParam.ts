/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import UniformConst from "../UniformConst";
import IShaderCodeBuilder from "../../../vox/material/code/IShaderCodeBuilder";
import { GlobalUniformParamBase } from "../../../vox/material/param/GlobalUniformParamBase";

class GlobalVSMShadowUniformParam extends GlobalUniformParamBase {

    getNames(): string[] {
        return [UniformConst.ShadowMatrix.name, UniformConst.ShadowVSMParams.name];
    }
    
    buildUniformData(materix4Data: Float32Array): Float32Array {

        let params = new Float32Array(
            [
                -0.0005             // shadowBias
                , 0.0               // shadowNormalBias
                , 4                 // shadowRadius
                , 0.8               // shadow intensity

                , 512, 512          // shadowMapSize(width, height)
                , 0.1               // color intensity
                , 0.0               // undefined


                , 1.0, 1.0, 1.0      // direc light nv(x,y,z)
                , 0.0                // undefined
            ]
        );
        this.uProbe.addMat4Data(materix4Data, 1);
        this.uProbe.addVec4Data(params, UniformConst.ShadowVSMParams.arrayLength);
        this.buildData();
        return params;
    }
    use(shaderBuilder: IShaderCodeBuilder, total: number = 1): void {
        
        shaderBuilder.addFragUniformParam(UniformConst.ShadowVSMParams);
        shaderBuilder.addVertUniformParam(UniformConst.ShadowMatrix);
    }
}
export { GlobalVSMShadowUniformParam };