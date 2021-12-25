/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import IShaderCodeBuilder from "../code/IShaderCodeBuilder";
import {UniformComp} from "./UniformComp";
class VertUniformComp extends UniformComp{
    
    private m_params: Float32Array = null;
    private m_paramsTotal: number = 2;
    constructor() {
        super();
    }
    
    setUVScale(uScale: number, vScale: number): void {
        if (this.m_params != null) {
            this.m_params[0] = uScale;
            this.m_params[1] = vScale;
        }
    }
    setUVTranslation(tu: number, tv: number): void {
        if (this.m_params != null) {
            this.m_params[2] = tu;
            this.m_params[3] = tv;
        }
    }

    /**
     * 设置顶点置换贴图参数
     * @param scale 缩放值
     * @param bias 偏移量
     */
    setDisplacementParams(scale: number, bias: number): void {
        if (this.m_params != null) {
            this.m_params[4] = scale;
            this.m_params[5] = bias;
        }
    }
    initialize(): void {
        
    }
    use(shaderBuilder: IShaderCodeBuilder): void {

    }
    reset(): void {

    }
    destroy(): void {

    }
}
export {VertUniformComp};