/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import IShaderCodeBuilder from "../code/IShaderCodeBuilder";
import { UniformComp } from "./UniformComp";
import TextureProxy from "../../texture/TextureProxy";
class VertUniformComp extends UniformComp {
   
    private m_uvTransParam: Float32Array = null;
    private m_curveMoveParam: Float32Array = null;
    private m_displacementParam: Float32Array = null;

    private m_uvTransformParamIndex: number = -1;
    private m_curveMoveParamIndex: number = -1;
    private m_displacementParamIndex: number = -1;


    uvTransformEnabled: boolean = false;
    curveMoveMap: TextureProxy = null;
    displacementMap: TextureProxy = null;
    constructor() {
        super();
    }
    
    initialize(): void {
        if(this.m_params == null) {
            let paramsTotal: number = 0;
            if(this.uvTransformEnabled) {
                this.m_uvTransformParamIndex = paramsTotal;
                paramsTotal++;
            }
            if(this.curveMoveMap != null) {
                this.m_curveMoveParamIndex = paramsTotal;
                paramsTotal++;
            }
            if(this.displacementMap != null) {
                this.m_displacementParamIndex = paramsTotal;
                paramsTotal++;
            }
            if(paramsTotal > 0) {
                this.m_params = new Float32Array(paramsTotal * 4);
                let i: number = this.m_uvTransformParamIndex;
                if(i >= 0) {
                    this.m_uvTransParam = this.m_params.subarray(i * 4, (i + 1) * 4);
                }
                i = this.m_curveMoveParamIndex;
                if(i >= 0) {
                    this.m_curveMoveParam = this.m_params.subarray(i * 4, (i + 1) * 4);
                }
                i = this.m_displacementParamIndex;
                if(i >= 0) {
                    this.m_displacementParam = this.m_params.subarray(i * 4, (i + 1) * 4);
                }
            }
        }
    }
    use(shaderBuilder: IShaderCodeBuilder): void {
        
    }
    reset(): void {

    }
    destroy(): void {

    }

    getTextures(texList: TextureProxy[]): TextureProxy[] {

        if(texList == null) {
            texList = [];    
        }
        if(this.curveMoveMap != null) {
            texList.push( this.curveMoveMap );
        }
        if(this.displacementMap != null) {
            texList.push( this.displacementMap );
        }
        return texList;
    }
    setCurveMoveParam(texSize: number, posTotal: number): void {
        if(this.m_curveMoveParam != null) {
            this.m_curveMoveParam[0] = 1.0 / texSize;
            this.m_curveMoveParam[2] = posTotal;
        }
    }
    setCurveMoveDistance(index: number): void {
        if(this.m_curveMoveParam != null) {
            this.m_curveMoveParam[1] = index;
        }
    }
    setUVScale(uScale: number, vScale: number): void {
        if (this.m_uvTransParam != null) {
            this.m_uvTransParam[0] = uScale;
            this.m_uvTransParam[1] = vScale;
        }
    }
    setUVTranslation(tu: number, tv: number): void {
        if (this.m_uvTransParam != null) {
            this.m_uvTransParam[2] = tu;
            this.m_uvTransParam[3] = tv;
        }
    }

    /**
     * 设置顶点置换贴图参数
     * @param scale 缩放值
     * @param bias 偏移量
     */
    setDisplacementParams(scale: number, bias: number): void {
        if (this.m_displacementParam != null) {
            this.m_displacementParam[0] = scale;
            this.m_displacementParam[1] = bias;
        }
    }
}
export { VertUniformComp };