/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import { IMaterialPipe } from "../pipeline/IMaterialPipe";
import IShaderCodeBuilder from "../code/IShaderCodeBuilder";
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
    reset(): void {

    }
    destroy(): void {

    }
    clone(): UniformComp {
        return null;
    }
}
export { UniformComp };