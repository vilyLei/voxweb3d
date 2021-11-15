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
    private m_pointLightParamsList: Vector3D[] = null;
    private m_pointLightColorList: Color4[] = null;
    /**
     * the light direction(nomralized x,y,z) list in world space
     */
    private m_direcLightDirecList: Vector3D[] = null;
    private m_direcLightColorList: Color4[] = null;
    /**
     * the light direction(nomralized x,y,z) and cos angle value list in world space
     */
    private m_spotLightParamsList: Vector3D[] = null;
    private m_spotLightColorList: Color4[] = null;

    private m_lightParams: Float32Array;
    private m_lightColors: Float32Array;
    private m_lightTotal: number = 0;

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
    getPointList(): Vector3D[] {
        return this.m_pointLightParamsList;
    }
    getPointLightsTotal(): number {
        return this.m_pointLightParamsList != null ? this.m_pointLightParamsList.length : 0;
    }
    getDirecLightsTotal(): number {
        return this.m_direcLightDirecList != null ? this.m_direcLightDirecList.length : 0;
    }
    getSpotLightsTotal(): number {
        return this.m_spotLightParamsList != null ? this.m_spotLightParamsList.length : 0;
    }
    getPositionData(): Float32Array {
        return this.m_lightParams;
    }
    getColorData(): Float32Array {
        return this.m_lightColors;
    }
    setPointLightAt(index: number, position: Vector3D, color: Color4): void {

        let i: number = index * 4;
        if (position != null && this.m_pointLightParamsList != null && index < this.m_pointLightParamsList.length) {
            this.m_pointLightParamsList[index].copyFrom(position);
            if (this.m_lightParams != null) {
                this.m_lightParams[i] = position.x;
                this.m_lightParams[i + 1] = position.y;
                this.m_lightParams[i + 2] = position.z;
            }
        }
        if (color != null && this.m_pointLightColorList != null && index < this.m_pointLightColorList.length) {
            this.m_pointLightColorList[index].copyFrom(color);
            if (this.m_lightColors != null) {
                this.m_lightColors[i] = color.r;
                this.m_lightColors[i + 1] = color.g;
                this.m_lightColors[i + 2] = color.b;
            }
        }
    }
    setDirecLightAt(index: number, direc: Vector3D, color: Color4): void {

        if (this.m_direcLightDirecList != null && index >= 0 && index < this.m_direcLightDirecList.length) {

            let i: number = (this.m_pointLightParamsList.length + index) * 4;
            if (direc != null) {
                this.m_direcLightDirecList[index].copyFrom(direc);
                if (this.m_lightParams != null) {
                    this.m_lightParams[i] = direc.x;
                    this.m_lightParams[i + 1] = direc.y;
                    this.m_lightParams[i + 2] = direc.z;
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
    setSpotLightAt(index: number, direc: Vector3D, color: Color4, angle_degree: number): void {

        if (this.m_spotLightParamsList != null && index >= 0 && index < this.m_spotLightParamsList.length) {

            let i: number = (this.m_direcLightDirecList.length + this.m_pointLightParamsList.length + index) * 4;
            if (direc != null) {
                let value: number = Math.cos(MathConst.DegreeToRadian(angle_degree));
                this.m_spotLightParamsList[index].copyFrom(direc);
                this.m_spotLightParamsList[index].w = value;
                if (this.m_lightParams != null) {
                    this.m_lightParams[i] = direc.x;
                    this.m_lightParams[i + 1] = direc.y;
                    this.m_lightParams[i + 2] = direc.z;
                    this.m_lightParams[i + 3] = value;
                }
            }
            if (color != null) {
                this.m_spotLightColorList[index].copyFrom(color);
                if (this.m_lightColors != null) {
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
            let total: number = this.m_lightTotal;
            let arrLength: number = total * 4;

            if (this.m_lightParams == null) this.m_lightParams = new Float32Array(arrLength);
            if (this.m_lightColors == null) this.m_lightColors = new Float32Array(arrLength);

            // point light
            let params: Vector3D[] = this.m_pointLightParamsList;
            let colorList: Color4[] = this.m_pointLightColorList;
            let lightsTotal: number = params.length;
            let j: number = 0;
            if (params != null) {
                for (let i: number = 0; i < lightsTotal; ++i) {

                    let pos: Vector3D = params[i];
                    let k: number = j * 4;
                    this.m_lightParams[k] = pos.x;
                    this.m_lightParams[k + 1] = pos.y;
                    this.m_lightParams[k + 2] = pos.z;
                    let color: Color4 = colorList[i];
                    this.m_lightColors[k] = color.r;
                    this.m_lightColors[k + 1] = color.g;
                    this.m_lightColors[k + 2] = color.b;
                    j++;
                }
            }

            // direction light    
            params = this.m_direcLightDirecList;
            if (params != null) {
                colorList = this.m_direcLightColorList;
                lightsTotal = params.length;
                j = this.m_pointLightParamsList.length;
                for (let i: number = 0; i < lightsTotal; ++i) {

                    let pos: Vector3D = params[i];
                    pos.normalize();
                    let k: number = j * 4;
                    this.m_lightParams[k] = pos.x;
                    this.m_lightParams[k + 1] = pos.y;
                    this.m_lightParams[k + 2] = pos.z;
                    let color: Color4 = colorList[i];
                    this.m_lightColors[k] = color.r;
                    this.m_lightColors[k + 1] = color.g;
                    this.m_lightColors[k + 2] = color.b;
                    j++;
                }
            }
            // spot light    
            params = this.m_spotLightParamsList;
            if (params != null) {
                colorList = this.m_spotLightColorList;
                lightsTotal = params.length;
                j = this.m_direcLightDirecList.length + this.m_pointLightParamsList.length;
                for (let i: number = 0; i < lightsTotal; ++i) {

                    let pos: Vector3D = params[i];
                    pos.normalize();
                    let k: number = j * 4;
                    this.m_lightParams[k] = pos.x;
                    this.m_lightParams[k + 1] = pos.y;
                    this.m_lightParams[k + 2] = pos.z;
                    this.m_lightParams[k + 3] = pos.w;
                    let color: Color4 = colorList[i];
                    this.m_lightColors[k] = color.r;
                    this.m_lightColors[k + 1] = color.g;
                    this.m_lightColors[k + 2] = color.b;
                    j++;
                }
            }

            if (this.m_uProbe == null) {
                this.m_uProbe = new ShaderUniformProbe();
                this.m_uProbe.bindSlotAt(this.m_uslotIndex);
                this.m_uProbe.addVec4Data(this.m_lightParams, total);
                this.m_uProbe.addVec4Data(this.m_lightColors, total);

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

            this.m_uniformParam.use(shaderBuilder, this.m_lightTotal);
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
            shaderBuilder.addFragUniform(UniformConst.GlobalLight.type, UniformConst.GlobalLight.positionName, this.m_lightTotal);
            shaderBuilder.addFragUniform(UniformConst.GlobalLight.type, UniformConst.GlobalLight.colorName, this.m_lightTotal);
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
        }
        this.m_pointLightParamsList = params;

        let colorList: Color4[] = new Array(lightsTotal);
        for (let i: number = 0; i < lightsTotal; ++i) {
            colorList[i] = new Color4();
            colorList[i].normalizeRandom(colorSize);
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
        }
        this.m_direcLightColorList = colorList;

    }


    private createSpotLightParam(lightsTotal: number, colorSize: number = 10.0): void {

        let paramsList: Vector3D[] = new Array(lightsTotal);
        for (let i: number = 0; i < lightsTotal; ++i) {
            let pv: Vector3D = paramsList[i] = new Vector3D();
            pv.setXYZ(0.0, -1.0, 0.0);
            pv.w = 0.3;
        }
        this.m_spotLightParamsList = paramsList;

        let colorList: Color4[] = new Array(lightsTotal);
        for (let i: number = 0; i < lightsTotal; ++i) {
            colorList[i] = new Color4();
            colorList[i].normalizeRandom(colorSize);
        }
        this.m_spotLightColorList = colorList;

    }

    initialize(pointLightsTotal: number = 4, directionLightsTotal: number = 2, spotLightsTotal: number = 0): void {
        this.m_lightTotal = pointLightsTotal + directionLightsTotal + spotLightsTotal;
        if (pointLightsTotal > 0) this.createPointLightParam(pointLightsTotal, 5.0);
        if (directionLightsTotal > 0) this.createDirecLightParam(directionLightsTotal, 3.0);
        if (spotLightsTotal > 0) this.createSpotLightParam(spotLightsTotal, 1.0);
    }
}