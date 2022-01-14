/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/
import UniformConst from "./UniformConst";
import IShaderCodeBuilder from "../../vox/material/code/IShaderCodeBuilder";
import ShaderGlobalUniform from "../../vox/material/ShaderGlobalUniform";
import{IShaderUniformProbe} from "../../vox/material/IShaderUniformProbe";
import RenderProxy from "../render/RenderProxy";

class GlobalUniformParamBase {

    private m_rc: RenderProxy = null;
    uProbe: IShaderUniformProbe = null;
    uniform: ShaderGlobalUniform = null;
    constructor(rc: RenderProxy, autoBuild: boolean = true) {
        this.m_rc = rc;
        if(autoBuild) {
            this.uProbe = rc.uniformContext.createShaderUniformProbe();
            this.uniform = rc.uniformContext.createShaderGlobalUniform();
        }
    }
    getNames(): string[] {
        return [];
    }
    buildData(): void {
        this.m_rc.uniformContext.updateGlobalUinformDataFromProbe(this.uniform, this.uProbe, this.getNames());
        this.uProbe.update();
    }
    destroy(): void {
        this.uProbe = null;
        this.uniform = null;
    }
}

class GlobalEnvLightUniformParam extends GlobalUniformParamBase {

    getNames(): string[] {
        return [UniformConst.EnvLightParams.name];
    }
    buildUniformData(): Float32Array {
        let data = UniformConst.EnvLightParams.data.slice();
        this.uProbe.addVec4Data( data, UniformConst.EnvLightParams.arrayLength );
        this.buildData();
        return data;
    }
    use(shaderBuilder: IShaderCodeBuilder, total: number = 1): void {
        
        shaderBuilder.addFragUniformParam(UniformConst.EnvLightParams);
    }
}

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
class GlobalLightUniformParam extends GlobalUniformParamBase {

    getNames(): string[] {
        return [UniformConst.GlobalLight.positionName, UniformConst.GlobalLight.colorName];
    }
    
    buildUniformData(lightPosData: Float32Array, lightPosDataVec4Total: number, lightColors: Float32Array, colorsTotal: number): void {

        this.uProbe.addVec4Data(lightPosData, lightPosDataVec4Total);
        this.uProbe.addVec4Data(lightColors, colorsTotal);
        this.buildData();
    }
    use(shaderBuilder: IShaderCodeBuilder, paramsTotal: number = 1, colorsTotal: number = 1): void {
        shaderBuilder.uniform.useCameraPosition(false, true);
        shaderBuilder.addFragUniform(UniformConst.GlobalLight.type, UniformConst.GlobalLight.positionName, paramsTotal);
        shaderBuilder.addFragUniform(UniformConst.GlobalLight.type, UniformConst.GlobalLight.colorName, colorsTotal);
    }
}
export {GlobalUniformParamBase, GlobalLightUniformParam, GlobalVSMShadowUniformParam, GlobalEnvLightUniformParam};