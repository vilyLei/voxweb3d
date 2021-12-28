/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import { IMaterialPipe } from "../pipeline/IMaterialPipe";
import IShaderCodeBuilder from "../code/IShaderCodeBuilder";
import TextureProxy from "../../texture/TextureProxy";
class UniformComp {

    protected m_params: Float32Array = null;
    private m_paramsTotal: number = 0;
    private m_beginIndex: number = 0;
    constructor() {
    }
    initialize(): void {
    }
    use(shaderBuilder: IShaderCodeBuilder): void {

    }
    getTextures(inTexList: TextureProxy[]): TextureProxy[] {

        // if(inTexList) {
        // }
        return null;
    }
    reset(): void {

    }
    destroy(): void {

    }
    clone(): UniformComp {
        return null;
    }
}
export { UniformComp };