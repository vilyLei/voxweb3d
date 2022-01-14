/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import UniformConst from "../../vox/material/UniformConst";
import IShaderCodeBuilder from "../../vox/material/code/IShaderCodeBuilder";

import { MaterialPipeType } from "../../vox/material/pipeline/MaterialPipeType";
import { IMaterialPipe } from "../../vox/material/pipeline/IMaterialPipe";
import { MaterialPipeBase } from "../../vox/material/pipeline/MaterialPipeBase";

import { EnvShaderCode } from "../material/EnvShaderCode";
import { GlobalEnvLightUniformParam } from "../../vox/material/GlobalUniformParam";
import IRenderTexture from "../../vox/render/IRenderTexture";
import TextureProxy from "../../vox/texture/TextureProxy";

export default class EnvLightData extends MaterialPipeBase implements IMaterialPipe {

    private m_shaderCodeEnabled: boolean = true;
    private m_uniformCodeEnabled: boolean = true;
    private m_ambientMap: TextureProxy = null;
    private m_data: Float32Array = null;
    setEnvAmbientMap(tex: TextureProxy): void {
        if (this.m_ambientMap != tex) {
            if (this.m_ambientMap != null) {
                this.m_ambientMap.__$detachThis();
            }
            this.m_ambientMap = tex;
            if (this.m_ambientMap != null) {
                this.m_ambientMap.__$attachThis();
            }
        }
    }

    setAmbientColorRGB3f(pr: number, pg: number, pb: number): void {
        let data: Float32Array = this.m_data;
        data[0] = pr;
        data[1] = pg;
        data[2] = pb;
        this.m_dirty = true;
    }
    setFogColorRGB3f(pr: number, pg: number, pb: number): void {
        let data: Float32Array = this.m_data;
        data[8] = pr;
        data[9] = pg;
        data[10] = pb;
        this.m_dirty = true;
    }
    setFogDensity(density: number): void {
        this.m_data[11] = density;
        this.m_dirty = true;
    }
    setFogNear(near: number): void {
        this.m_data[6] = near;
        this.m_dirty = true;
    }
    setFogFar(far: number): void {
        this.m_data[7] = far;
        this.m_dirty = true;
    }
    setFogAreaOffset(px: number, pz: number): void {
        this.m_data[12] = px;
        this.m_data[13] = pz;
        this.m_dirty = true;
    }
    setFogAreaSize(width: number, height: number): void {
        this.m_data[14] = width;
        this.m_data[15] = height;
        this.m_dirty = true;
    }

    setEnvAmbientLightAreaOffset(px: number, pz: number): void {
        this.m_data[16] = px;
        this.m_data[17] = pz;
        this.m_dirty = true;
    }
    setEnvAmbientLightAreaSize(width: number, height: number): void {
        this.m_data[18] = width;
        this.m_data[19] = height;
        this.m_dirty = true;
    }

    resetPipe(): void {
        this.m_shaderCodeEnabled = true;
        this.m_uniformCodeEnabled = true;
    }
    getTextures(shaderBuilder: IShaderCodeBuilder, outList: IRenderTexture[], pipeType: MaterialPipeType): IRenderTexture[] {

        if (this.m_ambientMap != null && pipeType == MaterialPipeType.ENV_AMBIENT_LIGHT) {
            if (outList == null) outList = [];
            outList.push(this.m_ambientMap);
            shaderBuilder.uniform.add2DMap("VOX_ENV_AMBIENT_LIGHT_LIGHT_MAP", true, true, false);
            return outList;
        }
        return null;
    }
    useShaderPipe(shaderBuilder: IShaderCodeBuilder, pipeType: MaterialPipeType): void {

        if (this.m_uniformParam != null) {
            switch (pipeType) {

                case MaterialPipeType.ENV_LIGHT_PARAM:
                    this.buildUniformCode(shaderBuilder);
                    break;

                case MaterialPipeType.FOG:
                case MaterialPipeType.FOG_EXP2:

                    this.buildUniformCode(shaderBuilder);
                    this.useFogData(shaderBuilder, pipeType == MaterialPipeType.FOG_EXP2, true);
                    break;

                case MaterialPipeType.ENV_AMBIENT_LIGHT:

                    this.buildUniformCode(shaderBuilder);
                    //this.useShaderCode(shaderBuilder, true);
                    break;
                default:
                    break;
            }
        }
    }
    getPipeTypes(): MaterialPipeType[] {
        return [MaterialPipeType.ENV_LIGHT_PARAM, MaterialPipeType.FOG, MaterialPipeType.FOG_EXP2, MaterialPipeType.ENV_AMBIENT_LIGHT];
    }
    getPipeKey(pipeType: MaterialPipeType): string {
        switch (pipeType) {
            case MaterialPipeType.ENV_LIGHT_PARAM:
            case MaterialPipeType.FOG:
            case MaterialPipeType.FOG_EXP2:
            case MaterialPipeType.ENV_AMBIENT_LIGHT:
                return "[" + pipeType + "]";
                break;
            default:
                break;
        }
        return "";
    }
    useUniforms(shaderBuilder: IShaderCodeBuilder): void {
        if (this.m_uniformParam != null) {
            shaderBuilder.addFragUniformParam(UniformConst.EnvLightParams);
        }
    }
    private buildUniformCode(shaderBuilder: IShaderCodeBuilder): void {
        if (this.m_uniformCodeEnabled) {
            this.m_uniformCodeEnabled = false;
            (this.m_uniformParam as GlobalEnvLightUniformParam).use(shaderBuilder);
        }
    }
    private useFogData(shaderBuilder: IShaderCodeBuilder, fogExp2Enabled: boolean, autoAppendShd: boolean): void {

        shaderBuilder.addDefine("VOX_USE_FOG", "1");
        if (fogExp2Enabled) {
            shaderBuilder.addDefine("VOX_FOG_EXP2", "1");
        }
        shaderBuilder.addVarying("float", "v_fogDepth");
        this.useShaderCode(shaderBuilder, autoAppendShd);
    }
    private useShaderCode(shaderBuilder: IShaderCodeBuilder, autoAppendShd: boolean): void {

        if (this.m_shaderCodeEnabled) {
            this.m_shaderCodeEnabled = false;
            if (autoAppendShd) {
                shaderBuilder.addShaderObject(EnvShaderCode);
            }
            else {
                shaderBuilder.addShaderObjectHead(EnvShaderCode);
            }
        }
    }
    initialize(): void {

        if (this.m_uniformParam == null) {
            /*
            readonly data: Float32Array = new Float32Array([

                0.1, 0.1, 0.1,              // ambient factor x,y,z
                1.0,                        // scatterIntensity

                1.0,                        // tone map exposure
                0.1,                        // reflectionIntensity

                600.0,                      // fogNear
                3500.0,                     // fogFar

                0.3,0.0,0.9,                // fog color(r, g, b)
                0.0005,                     // fog density

                0.0,0.0,                    // fog area offset x and z
                800.0,800.0                 // fog area width and height

                -500.0, -500.0,             // env ambient area offset x,z
                1000.0, 1000.0              // env ambient area width, height

            ]);
            // */
            
            let uniformParam = new GlobalEnvLightUniformParam(this.m_renderProxy);
            this.m_data = uniformParam.buildUniformData();
            this.m_uniformParam = uniformParam;

        }
    }

    destroy(): void {
        this.setEnvAmbientMap(null);
        this.m_data = null;
        super.destroy();
    }
}