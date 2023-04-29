/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2023 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import UniformConst from "../UniformConst";
import IShaderCodeBuilder from "../../../vox/material/code/IShaderCodeBuilder";
import { GlobalUniformParamBase } from "../../../vox/material/param/GlobalUniformParamBase";


class GlobalEnvLightUniformParam extends GlobalUniformParamBase {

    getNames(): string[] {
        return [UniformConst.EnvLightParams.name];
    }
    buildUniformData(): Float32Array {
        let data = UniformConst.EnvLightParams.data.slice();
        this.uProbe.addVec4Data(data, UniformConst.EnvLightParams.arrayLength);
        this.buildData();
        return data;
    }
    use(shaderBuilder: IShaderCodeBuilder, total: number = 1): void {

        shaderBuilder.addFragUniformParam(UniformConst.EnvLightParams);
    }
}

export { GlobalEnvLightUniformParam };