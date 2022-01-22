/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import Vector3D from "../../../vox/math/Vector3D";
import Matrix4 from "../../../vox/math/Matrix4";

import { IRenderCamera } from "../../../vox/render/IRenderCamera";
import IShaderCodeBuilder from "../../../vox/material/code/IShaderCodeBuilder";
import { MaterialPipeType } from "../../../vox/material/pipeline/MaterialPipeType";
import { IMaterialPipe } from "../../../vox/material/pipeline/IMaterialPipe";

import { MaterialPipeBase } from "../../../vox/material/pipeline/MaterialPipeBase";

import IRenderTexture from "../../../vox/render/texture/IRenderTexture";
import { GlobalVSMShadowUniformParam } from "../../../vox/material/param/GlobalVSMShadowUniformParam";
import { ShadowMode } from "../../../vox/material/pipeline/ShadowMode";
import { VSMShaderCode } from "./VSMShaderCode";

export default class ShadowVSMData extends MaterialPipeBase implements IMaterialPipe {

    private m_direcMatrix: Matrix4 = null;
    private m_params: Float32Array = null;
    private m_offetMatrix: Matrix4 = null;
    private m_shadowMap: IRenderTexture = null;
    private m_camVersion: number = -1;

    setShadowMap(shadowMap: IRenderTexture): void {
        this.m_shadowMap = shadowMap;
    }
    resetPipe(): void {
    }
    getTextures(shaderBuilder: IShaderCodeBuilder, outList: IRenderTexture[], pipeType: MaterialPipeType): IRenderTexture[] {
        if (this.m_shadowMap != null) {
            if (outList == null) outList = [];
            outList.push(this.m_shadowMap);
            shaderBuilder.uniform.addShadowMap(ShadowMode.VSM);
            return outList;
        }
        return null;
    }
    useShaderPipe(shaderBuilder: IShaderCodeBuilder, pipeType: MaterialPipeType): void {
        if (this.m_uniformParam != null) {
            shaderBuilder.addDefine("VOX_USE_SHADOW", "1");
            shaderBuilder.addVarying("vec4", "v_shadowPos");
            (this.m_uniformParam as GlobalVSMShadowUniformParam).use(shaderBuilder);
            shaderBuilder.addShaderObject(VSMShaderCode);
        }
    }
    getPipeTypes(): MaterialPipeType[] {
        return [MaterialPipeType.VSM_SHADOW];
    }
    getPipeKey(pipeType: MaterialPipeType): string {
        switch (pipeType) {
            case MaterialPipeType.VSM_SHADOW:
                return "[" + pipeType + "]";
                break;
            default:
                break;
        }
        return "";
    }

    initialize(): void {

        if (this.m_uniformParam == null) {

            this.m_direcMatrix = new Matrix4();
            this.m_offetMatrix = new Matrix4();

            this.m_offetMatrix.identity();
            this.m_offetMatrix.setScaleXYZ(0.5, 0.5, 0.5);
            this.m_offetMatrix.setTranslationXYZ(0.5, 0.5, 0.5);

            let uniformParam = new GlobalVSMShadowUniformParam(this.m_shdCtx);
            this.m_params = uniformParam.buildUniformData(this.m_direcMatrix.getLocalFS32());
            this.m_uniformParam = uniformParam;            
        }
    }
    updateShadowCamera(camera: IRenderCamera): void {

        if (this.m_camVersion != camera.version) {

            this.m_camVersion = camera.version;
            this.m_direcMatrix.copyFrom((camera as any).getVPMatrix());
            this.m_direcMatrix.append(this.m_offetMatrix);
            this.setDirec(camera.getNV());
            this.m_dirty = true;
        }
    }
    setShadowParam(shadowBias: number, shadowNormalBias: number, shadowRadius: number): void {

        this.m_params[0] = shadowBias;
        this.m_params[1] = shadowNormalBias;
        this.m_params[2] = shadowRadius;
        this.m_dirty = true;
    }
    setShadowIntensity(intensity: number): void {

        this.m_params[3] = intensity;
        this.m_dirty = true;
    }
    setColorIntensity(intensity: number): void {

        this.m_params[6] = intensity;
        this.m_dirty = true;
    }
    setShadowRadius(radius: number): void {
        this.m_params[2] = radius;
        this.m_dirty = true;
    }
    setShadowBias(bias: number): void {

        this.m_params[0] = bias;
        this.m_dirty = true;
    }
    setShadowSize(width: number, height: number): void {

        this.m_params[4] = width;
        this.m_params[5] = height;
        this.m_dirty = true;
    }
    setDirec(v3: Vector3D): void {

        this.m_params[8] = -v3.x;
        this.m_params[9] = -v3.y;
        this.m_params[10] = -v3.z;
        this.m_dirty = true;
    }

    destroy(): void {

        this.m_shadowMap = null;
        this.m_direcMatrix = null;
        this.m_params = null;
        this.m_offetMatrix = null;

        super.destroy();
    }
}