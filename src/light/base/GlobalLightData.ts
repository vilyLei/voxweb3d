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

export default class GlobalLightData implements IMaterialPipe{

    private m_uid: number = -1;
    static s_uid: number = 0;
    private m_pointLightPosList: Vector3D[] = null;
    private m_pointLightColorList: Color4[] = null;
    private m_direcLightDirecList: Vector3D[] = null;
    private m_direcLightColorList: Color4[] = null;
    private m_lightPositions: Float32Array;
    private m_lightColors: Float32Array;
    private m_lightTotal: number = 0;

    private m_uProbe: ShaderUniformProbe = null;
    private m_suo: ShaderGlobalUniform = null;
    private m_dirty: boolean = false;
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
        return this.m_pointLightPosList;
    }
    getPointLightsTotal(): number {
        return this.m_pointLightPosList.length;
    }
    getDirecLightsTotal(): number {
        return this.m_direcLightDirecList.length;
    }
    getPositionData(): Float32Array {
        return this.m_lightPositions;
    }
    getColorData(): Float32Array {
        return this.m_lightColors;
    }
    buildData(): void {

        let total: number = this.m_lightTotal;

        if (this.m_lightPositions == null) this.m_lightPositions = new Float32Array(total * 4);
        if (this.m_lightColors == null) this.m_lightColors = new Float32Array(total * 4);

        // point light
        let posList: Vector3D[] = this.m_pointLightPosList;
        let colorList: Color4[] = this.m_pointLightColorList;
        let lightsTotal: number = posList.length;

        let j: number = 0;
        for (let i: number = 0; i < lightsTotal; ++i) {

            let pos: Vector3D = posList[i];
            let k: number = j * 4;
            this.m_lightPositions[k] = pos.x;
            this.m_lightPositions[k + 1] = pos.x;
            this.m_lightPositions[k + 2] = pos.y;
            let color: Color4 = colorList[i];
            this.m_lightColors[k] = color.r;
            this.m_lightColors[k + 1] = color.g;
            this.m_lightColors[k + 2] = color.b;
            j++;
        }

        /////////////////////////////////////////////////////////////////////
        /////////////////////////////////////////////////////////////////////
        /////////////////////////////////////////////////////////////////////

        posList = this.m_direcLightDirecList;
        colorList = this.m_direcLightColorList;
        lightsTotal = posList.length;
        j = this.m_pointLightPosList.length;
        for (let i: number = 0; i < lightsTotal; ++i) {

            let pos: Vector3D = posList[i];
            pos.normalize();
            let k: number = j * 4;
            this.m_lightPositions[k] = pos.x;
            this.m_lightPositions[k + 1] = pos.x;
            this.m_lightPositions[k + 2] = pos.y;
            let color: Color4 = colorList[i];
            this.m_lightColors[k] = color.r;
            this.m_lightColors[k + 1] = color.g;
            this.m_lightColors[k + 2] = color.b;
            j++;
        }

        if (this.m_uProbe == null) {

            this.m_uProbe = new ShaderUniformProbe();
            this.m_uProbe.bindSlotAt(this.m_uslotIndex);
            this.m_uProbe.addVec4Data(this.m_lightPositions, total);
            this.m_uProbe.addVec4Data(this.m_lightColors, total);

            this.m_suo = new ShaderGlobalUniform();
            this.m_suo.uniformNameList = [UniformConst.GlobalLight.positionName, UniformConst.GlobalLight.colorName];
            this.m_suo.copyDataFromProbe(this.m_uProbe);

            this.m_uProbe.update();

        }
    }
    update(): void {
        if (this.m_uProbe != null) {
            this.m_uProbe.update();
        }
    }

    useShaderPipe(shaderBuilder: IShaderCodeBuilder, pipeType: MaterialPipeType): void {

        if (this.m_uProbe != null) {

            let lightsTotal: number = this.getPointLightsTotal() + this.getDirecLightsTotal();
            if (this.getPointLightsTotal() > 0) shaderBuilder.addDefine("VOX_POINT_LIGHTS_TOTAL", "" + this.getPointLightsTotal());
            else shaderBuilder.addDefine("VOX_POINT_LIGHTS_TOTAL", "0");
            if (this.getDirecLightsTotal() > 0) shaderBuilder.addDefine("VOX_DIRECTION_LIGHTS_TOTAL", "" + this.getDirecLightsTotal());
            else shaderBuilder.addDefine("VOX_DIRECTION_LIGHTS_TOTAL", "0");
            if (lightsTotal > 0) shaderBuilder.addDefine("VOX_LIGHTS_TOTAL", "" + lightsTotal);
            else shaderBuilder.addDefine("VOX_LIGHTS_TOTAL", "0");

            shaderBuilder.addFragUniform(UniformConst.GlobalLight.type, UniformConst.GlobalLight.positionName, this.m_lightTotal);
            shaderBuilder.addFragUniform(UniformConst.GlobalLight.type, UniformConst.GlobalLight.colorName, this.m_lightTotal);
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
                if (this.getDirecLightsTotal() > 0) key = "" + this.getDirecLightsTotal();
                if(key != "") {
                    return "["+pipeType+":"+key+"]";
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

        let posList: Vector3D[] = new Array(lightsTotal);
        for (let i: number = 0; i < lightsTotal; ++i) {
            let pv: Vector3D = posList[i] = new Vector3D();
            pv.setXYZ(Math.random() - 0.5, 0.0, Math.random() - 0.5);
            pv.normalize();
            pv.scaleBy(this.lightBaseDis + Math.random() * 100.0);
            pv.y = (Math.random() - 0.5) * (this.lightBaseDis * 2.0);
        }
        this.m_pointLightPosList = posList;

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
            pv.setXYZ(Math.random() - 0.5, 0.0, Math.random() - 0.5);
            pv.normalize();
            pv.scaleBy(this.lightBaseDis + Math.random() * 100.0);
            pv.y = (Math.random() - 0.5) * (this.lightBaseDis * 2.0);
        }
        this.m_direcLightDirecList = direcList;

        let colorList: Color4[] = new Array(lightsTotal);
        for (let i: number = 0; i < lightsTotal; ++i) {
            colorList[i] = new Color4();
            colorList[i].normalizeRandom(colorSize);
        }
        this.m_direcLightColorList = colorList;

    }

    initialize(pointLightsTotal: number = 4, parallelLightsTotal: number = 2): void {
        this.m_lightTotal = pointLightsTotal + parallelLightsTotal;
        this.createPointLightParam(pointLightsTotal, 5.0);
        this.createDirecLightParam(parallelLightsTotal, 1.0);
    }
}