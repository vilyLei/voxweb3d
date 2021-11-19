/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import Vector3D from "../../vox/math/Vector3D";
import Color4 from "../../vox/material/Color4";
import UniformConst from "../../vox/material/UniformConst";
import ShaderGlobalUniform from "../../vox/material/ShaderGlobalUniform";
import ShaderUniformProbe from "../../vox/material/ShaderUniformProbe";
import IShaderCodeBuilder from "../../vox/material/code/IShaderCodeBuilder";
import { MaterialPipeType } from "../../vox/material/pipeline/MaterialPipeType";
import { IMaterialPipe } from "../../vox/material/pipeline/IMaterialPipe";
import { GlobalLightUniformParam } from "../../vox/material/GlobalUniformParam";
import MathConst from "../../vox/math/MathConst";

export default class GlobalLightData implements IMaterialPipe {

    static s_uid: number = 0;
    private m_uid: number = -1;
    private m_changed: boolean = true;
    private m_uProbeVer: number = -1;

    private m_uniformParam: GlobalLightUniformParam = new GlobalLightUniformParam();
    /**
     * the light position(x,y,z) list in world space
     */
    private m_pointLightPosList: Vector3D[] = null;
    private m_pointLightColorList: Color4[] = null;
    /**
     * the light direction(nomralized x,y,z) list in world space
     */
    private m_direcLightDirecList: Vector3D[] = null;
    private m_direcLightColorList: Color4[] = null;

    /**
     * the spot light position(x,y,z) list in world space
     */
    private m_spotLightPosList: Vector3D[] = null;
    /**
     * the spot light direction(nomralized x,y,z) and cos angle value list in world space
     */
    private m_spotLightDirecList: Vector3D[] = null;
    private m_spotLightColorList: Color4[] = null;
    private m_lightPosDataVec4Total: number = 0;
    private m_lightPosData: Float32Array;
    private m_lightColors: Float32Array;
    private m_lightsTotal: number = 0;

    private m_uProbe: ShaderUniformProbe = null;
    private m_suo: ShaderGlobalUniform = null;
    private m_uslotIndex: number = 0;

    lightBaseDis: number = 700.0;

    constructor(slotIndex: number = 0) {
        this.m_uslotIndex = slotIndex;
        this.m_uid = GlobalLightData.s_uid++;
    }
    getUid(): number {
        return this.m_uid;
    }
    getSpotLightPosList(): Vector3D[] {
        return this.m_spotLightPosList;
    }
    getPointLightPosList(): Vector3D[] {
        return this.m_pointLightPosList;
    }
    getPointLightsTotal(): number {
        return this.m_pointLightPosList != null ? this.m_pointLightPosList.length : 0;
    }
    getDirecLightsTotal(): number {
        return this.m_direcLightDirecList != null ? this.m_direcLightDirecList.length : 0;
    }
    getSpotLightsTotal(): number {
        return this.m_spotLightDirecList != null ? this.m_spotLightDirecList.length : 0;
    }
    getPositionData(): Float32Array {
        return this.m_lightPosData;
    }
    getColorData(): Float32Array {
        return this.m_lightColors;
    }
    /**
     * point light ads 光照模型中顶点与点光源之间距离的一次方和二次方因子
     * @param factor1 顶点与点光源之间距离的一次方因子, default value is 0.0001
     * @param factor2 顶点与点光源之间距离的二次方因子, default value is 0.0005
     */
    setPointLightAttenuationFactorAt(index: number, factor1: number, factor2: number): void {
        if (this.m_pointLightPosList != null && index >= 0 && index < this.m_pointLightPosList.length) {
            this.m_pointLightPosList[index].w = factor1;
            this.m_pointLightColorList[index].a = factor2;
            let i: number = index * 4;
            this.m_lightPosData[i + 3] = factor1;
            this.m_lightColors[i + 3] = factor2;
        }
    }
    setPointLightAt(index: number, position: Vector3D, color: Color4): void {

        let i: number = index * 4;
        if (position != null && this.m_pointLightPosList != null && index < this.m_pointLightPosList.length) {
            this.m_pointLightPosList[index].copyFrom(position);
            if (this.m_lightPosData != null) {
                this.m_lightPosData[i] = position.x;
                this.m_lightPosData[i + 1] = position.y;
                this.m_lightPosData[i + 2] = position.z;
            }
        }
        if (color != null && this.m_pointLightColorList != null && index < this.m_pointLightColorList.length) {
            this.m_pointLightColorList[index].copyFromRGB(color);
            if (this.m_lightColors != null) {
                this.m_lightColors[i] = color.r;
                this.m_lightColors[i + 1] = color.g;
                this.m_lightColors[i + 2] = color.b;
            }
        }
    }
    setDirecLightAt(index: number, direc: Vector3D, color: Color4): void {

        if (this.m_direcLightDirecList != null && index >= 0 && index < this.m_direcLightDirecList.length) {

            let i: number = this.m_pointLightPosList != null ? (this.m_pointLightPosList.length + index) * 4 : index * 4;
            if (direc != null) {
                this.m_direcLightDirecList[index].copyFrom(direc);
                if (this.m_lightPosData != null) {
                    this.m_lightPosData[i] = direc.x;
                    this.m_lightPosData[i + 1] = direc.y;
                    this.m_lightPosData[i + 2] = direc.z;
                }
            }
            if (color != null) {
                this.m_direcLightColorList[index].copyFrom(color);
                if (this.m_lightColors != null) {
                    this.m_lightColors[i] = color.r;
                    this.m_lightColors[i + 1] = color.g;
                    this.m_lightColors[i + 2] = color.b;
                }
            }
        }
    }
    /**
     * spot light ads 光照模型中顶点与点光源之间距离的一次方和二次方因子
     * @param factor1 顶点与点光源之间距离的一次方因子, default value is 0.0001
     * @param factor2 顶点与点光源之间距离的二次方因子, default value is 0.0005
     */
    setSpotLightAttenuationFactorAt(index: number, factor1: number, factor2: number): void {
        if (this.m_spotLightPosList != null && index >= 0 && index < this.m_spotLightPosList.length) {
            this.m_spotLightPosList[index].w = factor1;
            this.m_spotLightColorList[index].a = factor2;
            let i: number = 0;
            if (this.m_pointLightPosList != null) i += this.m_pointLightPosList.length;
            if (this.m_direcLightDirecList != null) i += this.m_direcLightDirecList.length;
            i *= 4;
            i += index * 4;
            this.m_lightPosData[i + 3] = factor1;
            this.m_lightColors[i + 3] = factor2;
        }
    }
    setSpotLightAt(index: number, position: Vector3D, direc: Vector3D, angle_degree: number, color: Color4): void {

        if (this.m_spotLightDirecList != null && index >= 0 && index < this.m_spotLightDirecList.length) {

            let i: number = 0;
            if (this.m_pointLightPosList != null) i += this.m_pointLightPosList.length;
            if (this.m_direcLightDirecList != null) i += this.m_direcLightDirecList.length;
            i *= 4;

            if (position != null && position != null) {

                let offset: number = i + this.m_spotLightPosList.length * 4;
                this.m_spotLightPosList[index].copyFrom(position);
                // position
                let posI: number = i + index * 4;
                
                if (this.m_lightPosData != null) {
                    this.m_lightPosData[posI] = position.x;
                    this.m_lightPosData[posI + 1] = position.y;
                    this.m_lightPosData[posI + 2] = position.z;
                    //this.m_lightPosData[posI + 3] = value;
                }
                // direction and angle
                angle_degree = 90 - MathConst.Clamp(angle_degree, 0.0, 90.0);      
                let value: number = Math.cos(MathConst.DegreeToRadian(angle_degree));
                this.m_spotLightDirecList[index].copyFrom(direc);
                this.m_spotLightDirecList[index].w = value;

                let direcI: number = offset + i + index * 4;
                
                if (this.m_lightPosData != null) {
                    this.m_lightPosData[direcI] = direc.x;
                    this.m_lightPosData[direcI + 1] = direc.y;
                    this.m_lightPosData[direcI + 2] = direc.z;
                    this.m_lightPosData[direcI + 3] = value;
                }
            }
            if (color != null) {
                this.m_spotLightColorList[index].copyFromRGB(color);
                if (this.m_lightColors != null) {
                    i += index * 4;
                    this.m_lightColors[i] = color.r;
                    this.m_lightColors[i + 1] = color.g;
                    this.m_lightColors[i + 2] = color.b;
                }
            }
        }
    }
    buildData(): void {

        if (this.m_changed) {
            this.m_changed = false;
            let total: number = this.m_lightsTotal;
            let colorsTotal: number = this.m_lightsTotal;
            let lightParamsTotal: number = total * 4;
            this.m_lightPosDataVec4Total = this.m_lightsTotal;
            if(this.m_spotLightDirecList == null) {
                if (this.m_lightPosData == null) this.m_lightPosData = new Float32Array(lightParamsTotal);
            }
            else {
                lightParamsTotal += this.m_spotLightDirecList.length * 4;
                this.m_lightPosDataVec4Total += this.m_spotLightDirecList.length;
                if (this.m_lightPosData == null) this.m_lightPosData = new Float32Array(lightParamsTotal);
            }
            if (this.m_lightColors == null) this.m_lightColors = new Float32Array(colorsTotal * 4);

            // point light
            let params: Vector3D[] = this.m_pointLightPosList;
            let colorList: Color4[] = this.m_pointLightColorList;
            let lightsTotal: number;
            let j: number = 0;
            if (params != null) {
                lightsTotal = params.length;
                for (let i: number = 0; i < lightsTotal; ++i) {

                    let pos: Vector3D = params[i];
                    let k: number = j * 4;
                    this.m_lightPosData[k] = pos.x;
                    this.m_lightPosData[k + 1] = pos.y;
                    this.m_lightPosData[k + 2] = pos.z;
                    this.m_lightPosData[k + 3] = pos.w;
                    let color: Color4 = colorList[i];
                    this.m_lightColors[k] = color.r;
                    this.m_lightColors[k + 1] = color.g;
                    this.m_lightColors[k + 2] = color.b;
                    this.m_lightColors[k + 3] = color.a;
                    j++;
                }
            }

            // direction light    
            params = this.m_direcLightDirecList;
            if (params != null) {
                colorList = this.m_direcLightColorList;
                lightsTotal = params.length;
                j = this.m_pointLightPosList != null ? this.m_pointLightPosList.length : 0;
                for (let i: number = 0; i < lightsTotal; ++i) {

                    let param: Vector3D = params[i];
                    param.normalize();
                    let k: number = j * 4;
                    this.m_lightPosData[k] = param.x;
                    this.m_lightPosData[k + 1] = param.y;
                    this.m_lightPosData[k + 2] = param.z;

                    let color: Color4 = colorList[i];
                    this.m_lightColors[k] = color.r;
                    this.m_lightColors[k + 1] = color.g;
                    this.m_lightColors[k + 2] = color.b;
                    j++;
                }
            }
            // spot light    
            params = this.m_spotLightDirecList;
            if (params != null) {
                colorList = this.m_spotLightColorList;
                lightsTotal = params.length;
                j = 0;
                if(this.m_pointLightPosList != null) j += this.m_pointLightPosList.length;
                if(this.m_direcLightDirecList != null) j += this.m_direcLightDirecList.length;
                
                let offset: number = lightsTotal * 4;
                for (let i: number = 0; i < lightsTotal; ++i) {

                    let param: Vector3D = this.m_spotLightPosList[i];
                    let k: number = j * 4;
                    this.m_lightPosData[k] = param.x;
                    this.m_lightPosData[k + 1] = param.y;
                    this.m_lightPosData[k + 2] = param.z;
                    this.m_lightPosData[k + 3] = param.w;
                    param = params[i];
                    param.normalize();
                    this.m_lightPosData[offset + k] = param.x;
                    this.m_lightPosData[offset + k + 1] = param.y;
                    this.m_lightPosData[offset + k + 2] = param.z;
                    this.m_lightPosData[offset + k + 3] = param.w;

                    let color: Color4 = colorList[i];
                    this.m_lightColors[k] = color.r;
                    this.m_lightColors[k + 1] = color.g;
                    this.m_lightColors[k + 2] = color.b;
                    this.m_lightColors[k + 3] = color.a;
                    j += 1;
                }
            }

            if (this.m_uProbe == null) {
                this.m_uProbe = new ShaderUniformProbe();
                this.m_uProbe.bindSlotAt(this.m_uslotIndex);
                this.m_uProbe.addVec4Data(this.m_lightPosData, this.m_lightPosDataVec4Total);
                this.m_uProbe.addVec4Data(this.m_lightColors, colorsTotal);
                this.m_suo = this.m_uniformParam.createGlobalUinform(this.m_uProbe);
                // console.log("this.m_uProbe.getUid(): ", this.m_uProbe.getUid());
            }
        }
    }
    update(): void {
        this.buildData();
        if (this.m_uProbe != null && this.m_uProbeVer != this.m_uProbe.rst) {
            this.m_uProbe.update();
            this.m_uProbeVer = this.m_uProbe.rst;
        }
    }
    showInfo(): void {
        
        console.log("showInfo(), this.m_lightPosData: ",this.m_lightPosData);
        console.log("showInfo(), this.m_lightColors: ",this.m_lightColors);
    }
    useShaderPipe(shaderBuilder: IShaderCodeBuilder, pipeType: MaterialPipeType): void {

        if (this.m_uProbe != null) {

            shaderBuilder.normalEanbled = true;
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
    private createPointLightParam(lightsTotal: number, colorSize: number = 10.0): void {

        let params: Vector3D[] = new Array(lightsTotal);
        for (let i: number = 0; i < lightsTotal; ++i) {
            let pv: Vector3D = params[i] = new Vector3D();
            pv.setXYZ(Math.random() - 0.5, 0.0, Math.random() - 0.5);
            pv.scaleBy(this.lightBaseDis + Math.random() * 100.0);
            pv.y = (Math.random() - 0.5) * (this.lightBaseDis * 2.0);
            pv.w = 0.0001;
        }
        this.m_pointLightPosList = params;

        let colorList: Color4[] = new Array(lightsTotal);
        for (let i: number = 0; i < lightsTotal; ++i) {
            colorList[i] = new Color4();
            colorList[i].normalizeRandom(colorSize);
            colorList[i].a = 0.0005;
        }
        this.m_pointLightColorList = colorList;

    }
    private createDirecLightParam(lightsTotal: number, colorSize: number = 10.0): void {

        let direcList: Vector3D[] = new Array(lightsTotal);
        for (let i: number = 0; i < lightsTotal; ++i) {
            let pv: Vector3D = direcList[i] = new Vector3D();
            pv.setXYZ(Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5);
            pv.normalize();
        }
        this.m_direcLightDirecList = direcList;

        let colorList: Color4[] = new Array(lightsTotal);
        for (let i: number = 0; i < lightsTotal; ++i) {
            colorList[i] = new Color4();
            colorList[i].normalizeRandom(colorSize);
            colorList[i].a = 0.0005;
        }
        this.m_direcLightColorList = colorList;

    }


    private createSpotLightParam(lightsTotal: number, colorSize: number = 10.0): void {

        let posList: Vector3D[] = new Array(lightsTotal);
        let paramsList: Vector3D[] = new Array(lightsTotal);

        for (let i: number = 0; i < lightsTotal; ++i) {
            
            let pv: Vector3D = posList[i] = new Vector3D();
            pv.setXYZ(Math.random() - 0.5, 0.0, Math.random() - 0.5);
            pv.scaleBy(this.lightBaseDis + Math.random() * 100.0);
            pv.y = 50 + (this.lightBaseDis * 2.0);
            pv.w = 0.0001;

            pv = paramsList[i] = new Vector3D();
            pv.setXYZ(0.0, -1.0, 0.0);
            pv.w = 0.3;
        }
        
        this.m_spotLightPosList = posList;
        this.m_spotLightDirecList = paramsList;

        let colorList: Color4[] = new Array(lightsTotal);
        for (let i: number = 0; i < lightsTotal; ++i) {
            colorList[i] = new Color4();
            colorList[i].normalizeRandom(colorSize);
            colorList[i].a = 0.0005;
        }
        this.m_spotLightColorList = colorList;

    }

    initialize(pointLightsTotal: number = 4, directionLightsTotal: number = 2, spotLightsTotal: number = 0): void {
        this.m_lightsTotal = pointLightsTotal + directionLightsTotal + spotLightsTotal;
        if (pointLightsTotal > 0) this.createPointLightParam(pointLightsTotal, 5.0);
        if (directionLightsTotal > 0) this.createDirecLightParam(directionLightsTotal, 3.0);
        if (spotLightsTotal > 0) this.createSpotLightParam(spotLightsTotal, 1.0);
    }
}