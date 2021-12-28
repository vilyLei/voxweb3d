/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import IShaderCodeBuilder from "../code/IShaderCodeBuilder";
import { UniformComp } from "./UniformComp";
import TextureProxy from "../../texture/TextureProxy";
/**
 * manage uniform data for the vertex calculation
 */
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
            this.m_uniqueNSKeyString = "";
            let paramsTotal: number = 0;
            if(this.uvTransformEnabled) {
                this.m_uvTransformParamIndex = paramsTotal;
                paramsTotal++;
                this.m_uniqueNSKeyString +="UV";
            }
            if(this.curveMoveMap != null) {
                this.m_curveMoveParamIndex = paramsTotal;
                paramsTotal++;
                this.m_uniqueNSKeyString +="CM";
            }
            if(this.displacementMap != null) {
                this.m_displacementParamIndex = paramsTotal;
                paramsTotal++;
                this.m_uniqueNSKeyString +="DC";
            }
            if(paramsTotal > 0) {
                this.m_params = new Float32Array(paramsTotal * 4);
                let i: number = this.m_uvTransformParamIndex;
                if(i >= 0) {
                    this.m_uvTransParam = this.m_params.subarray(i * 4, (i + 1) * 4);
                    // u scale, v scale, translation u, translation v
                    this.m_uvTransParam.set([1.0, 1.0, 0.0, 0.0]);
                }
                i = this.m_curveMoveParamIndex;
                if(i >= 0) {
                    this.m_curveMoveParam = this.m_params.subarray(i * 4, (i + 1) * 4);
                }
                i = this.m_displacementParamIndex;
                if(i >= 0) {
                    this.m_displacementParam = this.m_params.subarray(i * 4, (i + 1) * 4);
                    // displacement scale, bias, undefined, undefined
                    this.m_displacementParam.set([10.0, 0.0, 0.0, 0.0]);
                }
            }
        }
    }
    use(shaderBuilder: IShaderCodeBuilder): void {

        if(this.m_curveMoveParamIndex >= 0) {
            shaderBuilder.addVertLayout("vec4","a_vs");
        }
        
        if(this.m_uvTransformParamIndex >= 0) {
            shaderBuilder.addDefine("VOX_VTX_TRANSFORM_PARAM_INDEX", ""+this.m_uvTransformParamIndex);
        }
        if(this.m_curveMoveParamIndex >= 0) {
            shaderBuilder.uniform.add2DMap("VTX_CURVE_MOVE_MAP", false, false, true);
            shaderBuilder.addDefine("VOX_VTX_CURVE_MOVE_PARAM_INDEX", ""+this.m_curveMoveParamIndex);
        }
        if(this.m_displacementParamIndex >= 0) {
            shaderBuilder.uniform.addDisplacementMap(this.m_displacementParamIndex);
        }
    }
    reset(): void {

    }
    destroy(): void {

    }

    getTextures(): TextureProxy[] {

        let texList: TextureProxy[] = [];
        if(this.m_curveMoveParamIndex >= 0) {
            texList.push( this.curveMoveMap );
        }
        if(this.m_displacementParamIndex >= 0) {
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
    
    clone(): UniformComp {
        let u = new VertUniformComp();
        u.uvTransformEnabled = this.uvTransformEnabled;
        u.displacementMap = this.displacementMap;
        u.curveMoveMap = this.curveMoveMap;
        return u;
    }
}
export { VertUniformComp };