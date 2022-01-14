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
import RenderProxy from "../render/RenderProxy";

class GlobalUniformParamBase {

    private m_rc: RenderProxy = null;
    uProbe: ShaderUniformProbe = null;
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
    // createGlobalUinform(uProbe: ShaderUniformProbe, rc: RenderProxy): ShaderGlobalUniform {
    //     return rc.uniformContext.createGlobalUinformFromProbe(uProbe, this.getNames());
    // }
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
    use(shaderBuilder: IShaderCodeBuilder, total: number = 1): void {
        
        shaderBuilder.addFragUniformParam(UniformConst.EnvLightParams);
    }
}

class GlobalVSMShadowUniformParam extends GlobalUniformParamBase {

    getNames(): string[] {
        return [UniformConst.ShadowMatrix.name, UniformConst.ShadowVSMParams.name];
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
    use(shaderBuilder: IShaderCodeBuilder, paramsTotal: number = 1, colorsTotal: number = 1): void {
        shaderBuilder.uniform.useCameraPosition(false, true);
        shaderBuilder.addFragUniform(UniformConst.GlobalLight.type, UniformConst.GlobalLight.positionName, paramsTotal);
        shaderBuilder.addFragUniform(UniformConst.GlobalLight.type, UniformConst.GlobalLight.colorName, colorsTotal);
    }
}
export {GlobalLightUniformParam, GlobalVSMShadowUniformParam, GlobalEnvLightUniformParam};