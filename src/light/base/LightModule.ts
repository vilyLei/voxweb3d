/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import UniformConst from "../../vox/material/UniformConst";
import ShaderGlobalUniform from "../../vox/material/ShaderGlobalUniform";
import ShaderUniformProbe from "../../vox/material/ShaderUniformProbe";
import IShaderCodeBuilder from "../../vox/material/code/IShaderCodeBuilder";
import { MaterialPipeType } from "../../vox/material/pipeline/MaterialPipeType";
import { IMaterialPipe } from "../../vox/material/pipeline/IMaterialPipe";
import { GlobalLightUniformParam } from "../../vox/material/GlobalUniformParam";
import MathConst from "../../vox/math/MathConst";
import { PointLight } from "./PointLight";
import { DirectionLight } from "./DirectionLight";
import { SpotLight } from "./SpotLight";
import IRenderTexture from "../../vox/render/IRenderTexture";

class LightModule implements IMaterialPipe {

    static s_uid: number = 0;
    private m_uid: number = -1;

    private m_uniformParam: GlobalLightUniformParam = new GlobalLightUniformParam();
    private m_uProbe: ShaderUniformProbe = null;
    private m_suo: ShaderGlobalUniform = null;
    private m_uslotIndex: number = 0;

    private m_lightPosData: Float32Array = null;
    private m_lightColors: Float32Array = null;

    private m_lightPosDataVec4Total: number = 0;

    private m_lightsTotal: number = 0;
    private m_pointLightList: PointLight[] = null;
    private m_direcLightList: DirectionLight[] = null;
    private m_spotLightList: SpotLight[] = null;

    constructor(slotIndex: number = 0) {
        this.m_uslotIndex = slotIndex;
        this.m_uid = LightModule.s_uid++;
    }
    getUid(): number {
        return this.m_uid;
    }
    getPointLightsTotal(): number {
        return this.m_pointLightList != null ? this.m_pointLightList.length : 0;
    }
    getDirecLightsTotal(): number {
        return this.m_direcLightList != null ? this.m_direcLightList.length : 0;
    }
    getSpotLightsTotal(): number {
        return this.m_spotLightList != null ? this.m_spotLightList.length : 0;
    }
    getPointLightAt(i: number): PointLight {
        if (this.m_pointLightList != null && i >= 0 && i < this.m_pointLightList.length) {
            return this.m_pointLightList[i];
        }
        return null;
    }
    getDirectionLightAt(i: number): DirectionLight {
        if (this.m_direcLightList != null && i >= 0 && i < this.m_direcLightList.length) {
            return this.m_direcLightList[i];
        }
        return null;
    }
    getSpotLightAt(i: number): SpotLight {
        if (this.m_spotLightList != null && i >= 0 && i < this.m_spotLightList.length) {
            return this.m_spotLightList[i];
        }
        return null;
    }
    appendPointLight(): PointLight {
        if (this.m_pointLightList == null) {
            this.m_pointLightList = [];
        }
        let light: PointLight = new PointLight();
        this.m_pointLightList.push(light);
        this.m_lightsTotal++;
        return light;
    }
    appendDirectionLight(): DirectionLight {
        if (this.m_direcLightList == null) {
            this.m_direcLightList = [];
        }
        let light: DirectionLight = new DirectionLight();
        this.m_direcLightList.push(light);
        this.m_lightsTotal++;
        return light;
    }
    appendSpotLight(): SpotLight {
        if (this.m_spotLightList == null) {
            this.m_spotLightList = [];
        }
        let light: SpotLight = new SpotLight();
        this.m_spotLightList.push(light);
        this.m_lightsTotal++;
        return light;
    }

    private updatePointLightData(): void {
        if (this.m_pointLightList != null) {
            let light: PointLight;
            let posFS: Float32Array = this.m_lightPosData;
            let colFS: Float32Array = this.m_lightColors;
            let j: number = 0;
            for(let i: number = 0; i < this.m_pointLightList.length; ++i) {

                light = this.m_pointLightList[i];

                j = i * 4;
                posFS[j] = light.position.x;
                posFS[j + 1] = light.position.y;
                posFS[j + 2] = light.position.z;
                posFS[j + 3] = light.attenuationFactor1;

                colFS[j] = light.color.r;
                colFS[j + 1] = light.color.g;
                colFS[j + 2] = light.color.b;
                colFS[j + 3] = light.attenuationFactor2;
            }
        }
    }
    private updateDirecLighttData(): void {
        if (this.m_direcLightList != null) {
            let light: DirectionLight;
            let posFS: Float32Array = this.m_lightPosData;
            let colFS: Float32Array = this.m_lightColors;
            let j: number = 0;
            let offset: number = this.m_pointLightList != null ? this.m_pointLightList.length : 0;
            offset *= 4;

            for(let i: number = 0; i < this.m_direcLightList.length; ++i) {

                light = this.m_direcLightList[i];

                j = offset + i * 4;
                posFS[j] = light.direction.x;
                posFS[j + 1] = light.direction.y;
                posFS[j + 2] = light.direction.z;
                posFS[j + 3] = light.attenuationFactor1;
                
                colFS[j] = light.color.r;
                colFS[j + 1] = light.color.g;
                colFS[j + 2] = light.color.b;
                colFS[j + 3] = light.attenuationFactor2;
            }
        }
    }
    private updateSpotLighttData(): void {
        if (this.m_spotLightList != null) {
            let light: SpotLight;
            let posFS: Float32Array = this.m_lightPosData;
            let colFS: Float32Array = this.m_lightColors;
            let j: number = 0;
            let offset: number = this.m_pointLightList != null ? this.m_pointLightList.length : 0;
            offset += this.m_direcLightList != null ? this.m_direcLightList.length : 0;
            offset *= 4;

            for(let i: number = 0; i < this.m_spotLightList.length; ++i) {

                light = this.m_spotLightList[i];

                j = offset + i * 4;
                posFS[j] = light.position.x;
                posFS[j + 1] = light.position.y;
                posFS[j + 2] = light.position.z;
                posFS[j + 3] = light.attenuationFactor1;
                
                colFS[j] = light.color.r;
                colFS[j + 1] = light.color.g;
                colFS[j + 2] = light.color.b;
                colFS[j + 3] = light.attenuationFactor2;
            }

            offset += this.m_spotLightList.length * 4;
            for(let i: number = 0; i < this.m_spotLightList.length; ++i) {

                light = this.m_spotLightList[i];
                let value: number = 90 - MathConst.Clamp(light.angleDegree, 0.0, 90.0);      
                value = Math.cos(MathConst.DegreeToRadian(value));
                j = offset + i * 4;
                posFS[j] = light.direction.x;
                posFS[j + 1] = light.direction.y;
                posFS[j + 2] = light.direction.z;
                posFS[j + 3] = value;
                
            }
        }
    }
    private buildData(): void {

        if (this.m_uProbe == null) {

            let total: number = this.m_lightsTotal;
            let colorsTotal: number = this.m_lightsTotal;
            let lightParamsTotal: number = total * 4;
            this.m_lightPosDataVec4Total = this.m_lightsTotal;
            if (this.m_spotLightList == null) {
                if (this.m_lightPosData == null) this.m_lightPosData = new Float32Array(lightParamsTotal);
            }
            else {
                lightParamsTotal += this.m_spotLightList.length * 4;
                this.m_lightPosDataVec4Total += this.m_spotLightList.length;
                if (this.m_lightPosData == null) this.m_lightPosData = new Float32Array(lightParamsTotal);
            }
            if (this.m_lightColors == null) this.m_lightColors = new Float32Array(colorsTotal * 4);

            this.m_uProbe = new ShaderUniformProbe();
            this.m_uProbe.bindSlotAt(this.m_uslotIndex);
            this.m_uProbe.addVec4Data(this.m_lightPosData, this.m_lightPosDataVec4Total);
            this.m_uProbe.addVec4Data(this.m_lightColors, colorsTotal);
            this.m_suo = this.m_uniformParam.createGlobalUinform(this.m_uProbe);
            // console.log("this.m_uProbe.getUid(): ", this.m_uProbe.getUid());
        }
        this.updatePointLightData();
        this.updateDirecLighttData();
        this.updateSpotLighttData();
            
    }
    update(): void {
        this.buildData();
        this.m_uProbe.update();
    }

    showInfo(): void {

        console.log("showInfo(), this.m_lightPosData: ", this.m_lightPosData);
        console.log("showInfo(), this.m_lightColors: ", this.m_lightColors);
    }
    
    resetPipe(): void {
        
    }
    getTextures(shaderBuilder: IShaderCodeBuilder, outList: IRenderTexture[], pipeType: MaterialPipeType): IRenderTexture[] {
        return null;
    }
    useShaderPipe(shaderBuilder: IShaderCodeBuilder, pipeType: MaterialPipeType): void {

        if (this.m_uProbe != null) {

            shaderBuilder.normalEnabled = true;
            let lightsTotal: number = this.getPointLightsTotal() + this.getDirecLightsTotal() + this.getSpotLightsTotal();
            if (lightsTotal > 0) {
                shaderBuilder.addDefine("VOX_LIGHTS_TOTAL", "" + lightsTotal);
                if (this.getPointLightsTotal() > 0) shaderBuilder.addDefine("VOX_POINT_LIGHTS_TOTAL", "" + this.getPointLightsTotal());
                else shaderBuilder.addDefine("VOX_POINT_LIGHTS_TOTAL", "0");
                if (this.getDirecLightsTotal() > 0) shaderBuilder.addDefine("VOX_DIRECTION_LIGHTS_TOTAL", "" + this.getDirecLightsTotal());
                else shaderBuilder.addDefine("VOX_DIRECTION_LIGHTS_TOTAL", "0");
                if (this.getSpotLightsTotal() > 0) shaderBuilder.addDefine("VOX_SPOT_LIGHTS_TOTAL", "" + this.getSpotLightsTotal());
                else shaderBuilder.addDefine("VOX_SPOT_LIGHTS_TOTAL", "0");
            }
            else {
                shaderBuilder.addDefine("VOX_LIGHTS_TOTAL", "0");
            }

            this.m_uniformParam.use(shaderBuilder, this.m_lightPosDataVec4Total, this.m_lightsTotal);
        }
    }
    getPipeTypes(): MaterialPipeType[] {
        return [MaterialPipeType.GLOBAL_LIGHT];
    }

    getPipeKey(pipeType: MaterialPipeType): string {
        switch (pipeType) {
            case MaterialPipeType.GLOBAL_LIGHT:
                let key: string = "";
                if (this.getPointLightsTotal() > 0) key = "" + this.getPointLightsTotal();
                if (this.getDirecLightsTotal() > 0) key += "" + this.getDirecLightsTotal();
                if (this.getSpotLightsTotal() > 0) key += "" + this.getSpotLightsTotal();
                if (key != "") {
                    return "[" + pipeType + ":" + key + "]";
                }
                break;
            default:
                break;
        }
        return "";
    }

    useUniforms(shaderBuilder: IShaderCodeBuilder): void {
        if (this.m_uProbe != null) {
            shaderBuilder.addFragUniform(UniformConst.GlobalLight.type, UniformConst.GlobalLight.positionName, this.m_lightPosDataVec4Total);
            shaderBuilder.addFragUniform(UniformConst.GlobalLight.type, UniformConst.GlobalLight.colorName, this.m_lightsTotal);
        }
    }
    getGlobalUinform(): ShaderGlobalUniform {
        return this.m_suo.clone();
    }
}

export {LightModule};