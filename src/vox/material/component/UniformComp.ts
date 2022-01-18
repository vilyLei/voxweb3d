/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import { IMaterialPipe } from "../pipeline/IMaterialPipe";
import IShaderCodeBuilder from "../code/IShaderCodeBuilder";
import ShaderUniformData from "../ShaderUniformData";
import IRenderTexture from "../../render/texture/IRenderTexture";
class UniformComp {

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
    buildShaderUniformData(data: ShaderUniformData): void {
        
    }
}
export { UniformComp };