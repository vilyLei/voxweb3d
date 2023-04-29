/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2023 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import UniformConst from "../UniformConst";
import IShaderCodeBuilder from "../../../vox/material/code/IShaderCodeBuilder";
import { GlobalUniformParamBase } from "../../../vox/material/param/GlobalUniformParamBase";

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
export { GlobalLightUniformParam };