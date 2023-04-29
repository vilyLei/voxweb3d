/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2023 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/
import UniformConst from "./UniformConst";
import IShaderCodeBuilder from "../../vox/material/code/IShaderCodeBuilder";

class GlobalLightUniformParamBuilder {

    getNames(): string[] {
        return [UniformConst.GlobalLight.positionName, UniformConst.GlobalLight.colorName];
    }
    use(shaderBuilder: IShaderCodeBuilder, lightsTotal: number): void {        
        shaderBuilder.addFragUniformParam(UniformConst.CameraPosParam);
        shaderBuilder.addFragUniform(UniformConst.GlobalLight.type, UniformConst.GlobalLight.positionName, lightsTotal);
        shaderBuilder.addFragUniform(UniformConst.GlobalLight.type, UniformConst.GlobalLight.colorName, lightsTotal);
    }
}
export {GlobalLightUniformParamBuilder};