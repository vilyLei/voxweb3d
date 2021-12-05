/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/
import UniformConst from "./UniformConst";
import IShaderCodeBuilder from "../../vox/material/code/IShaderCodeBuilder";
import ShaderGlobalUniform from "../../vox/material/ShaderGlobalUniform";
import ShaderUniformProbe from "../../vox/material/ShaderUniformProbe";

class GlobalUniformParamBase {

    constructor() {
    }
    geNames(): string[] {
        return [];
    }
    createGlobalUinform(uProbe: ShaderUniformProbe): ShaderGlobalUniform {
        let suo: ShaderGlobalUniform = new ShaderGlobalUniform();
        suo.uniformNameList = this.geNames();
        suo.copyDataFromProbe(uProbe);
        uProbe.update();
        return suo;
    }
}

class GlobalEnvLightUniformParam extends GlobalUniformParamBase {

    constructor() {
        super();
    }
    geNames(): string[] {
        return [UniformConst.EnvLightParams.name];
    }
    use(shaderBuilder: IShaderCodeBuilder, total: number = 1): void {
        
        shaderBuilder.addFragUniformParam(UniformConst.EnvLightParams);
    }
}

class GlobalVSMShadowUniformParam extends GlobalUniformParamBase {

    constructor() {
        super();
    }
    geNames(): string[] {
        return [UniformConst.ShadowMatrix.name, UniformConst.ShadowVSMParams.name];
    }
    use(shaderBuilder: IShaderCodeBuilder, total: number = 1): void {
        
        shaderBuilder.addFragUniformParam(UniformConst.ShadowVSMParams);
        shaderBuilder.addVertUniformParam(UniformConst.ShadowMatrix);
    }
}
class GlobalLightUniformParam extends GlobalUniformParamBase {

    constructor() {
        super();
    }
    geNames(): string[] {
        return [UniformConst.GlobalLight.positionName, UniformConst.GlobalLight.colorName];
    }
    use(shaderBuilder: IShaderCodeBuilder, paramsTotal: number = 1, colorsTotal: number = 1): void {
        shaderBuilder.uniform.useCameraPosition(false, true);
        shaderBuilder.addFragUniform(UniformConst.GlobalLight.type, UniformConst.GlobalLight.positionName, paramsTotal);
        shaderBuilder.addFragUniform(UniformConst.GlobalLight.type, UniformConst.GlobalLight.colorName, colorsTotal);
    }
}
export {GlobalLightUniformParam, GlobalVSMShadowUniformParam, GlobalEnvLightUniformParam};