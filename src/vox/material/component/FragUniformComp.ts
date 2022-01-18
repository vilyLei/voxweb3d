/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import IShaderCodeBuilder from "../code/IShaderCodeBuilder";
import IRenderTexture from "../../render/texture/IRenderTexture";
import { UniformComp } from "./UniformComp";
import Vector3D from "../../math/Vector3D";
/**
 * manage uniform data for the vertex calculation
 */
class FragUniformComp extends UniformComp {

    constructor() {
        super();
    }

    initialize(): void {
        if (this.m_params == null) {
            this.m_uniqueNSKeyString = "";
            let paramsTotal: number = 0;
           
            if (paramsTotal > 0) {
                this.m_params = new Float32Array(paramsTotal * 4);
                let i: number = 0;
                if (i >= 0) {
                }
            }
        }
    }
    use(shaderBuilder: IShaderCodeBuilder): void {
        if (this.getParamsTotal() > 0) {
            
            shaderBuilder.addVertUniform("vec4", "u_fragLocalParams", this.getParamsTotal());

        }
    }
    reset(): void {

    }
    destroy(): void {

    }

    getTextures(shaderBuilder: IShaderCodeBuilder, outList: IRenderTexture[] = null): IRenderTexture[] {
        if (this.getParamsTotal() > 0) {

            if(outList == null) outList = [];
            
            return outList;
        }
        return null;
    }
    clone(): UniformComp {
        let u = new FragUniformComp();
        return u;
    }
}
export { FragUniformComp };