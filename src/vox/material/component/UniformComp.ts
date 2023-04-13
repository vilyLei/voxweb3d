/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import IShaderCodeBuilder from "../code/IShaderCodeBuilder";
import IShaderUniformData from "../IShaderUniformData";
import IRenderTexture from "../../render/texture/IRenderTexture";
import { IUniformComp } from "./IUniformComp";

class UniformComp implements IUniformComp {

    protected m_params: Float32Array = null;
    protected m_uniqueNSKeyString: string = "";
    constructor() {
    }
    initialize(): void {
    }
    use(shaderBuilder: IShaderCodeBuilder): void {

    }
    getTextures(shaderBuilder: IShaderCodeBuilder, outList: IRenderTexture[] = null): IRenderTexture[] {

        return null;
    }
	dataCopyFrom(src: IUniformComp): void {

	}
    reset(): void {

    }
    destroy(): void {

    }
    getUniqueNSKeyString(): string {
        return this.m_uniqueNSKeyString;
    }
    clone(): UniformComp {
        return null;
    }
    getParams(): Float32Array {
        return this.m_params;
    }
    getParamsTotal(): number {
        return this.m_params != null ? this.m_params.length >> 2 : 0;
    }
    buildShaderUniformData(data: IShaderUniformData): void {

    }
}
export { UniformComp };
