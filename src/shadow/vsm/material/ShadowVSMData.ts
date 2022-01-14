/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import Vector3D from "../../../vox/math/Vector3D";
import Matrix4 from "../../../vox/math/Matrix4";

import UniformConst from "../../../vox/material/UniformConst";
import ShaderGlobalUniform from "../../../vox/material/ShaderGlobalUniform";
import ShaderUniformProbe from "../../../vox/material/ShaderUniformProbe";
import CameraBase from "../../../vox/view/CameraBase";
import IShaderCodeBuilder from "../../../vox/material/code/IShaderCodeBuilder";

import { MaterialPipeType } from "../../../vox/material/pipeline/MaterialPipeType";
import { IMaterialPipe } from "../../../vox/material/pipeline/IMaterialPipe";

import IRenderTexture from "../../../vox/render/IRenderTexture";
import { GlobalVSMShadowUniformParam } from "../../../vox/material/GlobalUniformParam";
import { VSMShaderCode } from "./VSMShaderCode";
import RTTTextureProxy from "../../../vox/texture/RTTTextureProxy";
import { ShadowMode } from "../../../vox/material/pipeline/ShadowMode";
import RenderProxy from "../../../vox/render/RenderProxy";

export default class ShadowVSMData implements IMaterialPipe {

    private m_uniformParam: GlobalVSMShadowUniformParam = new GlobalVSMShadowUniformParam();
    private m_uProbe: ShaderUniformProbe = null;
    private m_suo: ShaderGlobalUniform = null;
    private m_direcMatrix: Matrix4 = null;
    private m_params: Float32Array = null;
    private m_offetMatrix: Matrix4 = null;
    private m_shadowMap: RTTTextureProxy = null;
    private m_camVersion: number = -1;
    private m_dirty: boolean = false;
    private m_renderProxy: RenderProxy = null;

    constructor(renderProxy: RenderProxy) {
        this.m_renderProxy = renderProxy;
    }
    setShadowMap(shadowMap: RTTTextureProxy): void {
        this.m_shadowMap = shadowMap;
    }
    resetPipe(): void {
        
    }
    getTextures(shaderBuilder: IShaderCodeBuilder, outList: IRenderTexture[], pipeType: MaterialPipeType): IRenderTexture[] {
        if(this.m_shadowMap != null) {
            if(outList == null) outList = [];
            outList.push(this.m_shadowMap);
            shaderBuilder.uniform.addShadowMap(ShadowMode.VSM);
            return outList;
        }
        return null;
    }
    useShaderPipe(shaderBuilder: IShaderCodeBuilder, pipeType: MaterialPipeType): void {
        if (this.m_uProbe != null) {
            shaderBuilder.addDefine("VOX_USE_SHADOW", "1");
            shaderBuilder.addVarying("vec4", "v_shadowPos");
            this.m_uniformParam.use(shaderBuilder);
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

        if (this.m_uProbe == null) {

            this.m_direcMatrix = new Matrix4();
            this.m_offetMatrix = new Matrix4();

            this.m_offetMatrix.identity();
            this.m_offetMatrix.setScaleXYZ(0.5, 0.5, 0.5);
            this.m_offetMatrix.setTranslationXYZ(0.5, 0.5, 0.5);

            this.m_params = new Float32Array(
                [
                    -0.0005             // shadowBias
                    , 0.0               // shadowNormalBias
                    , 4                 // shadowRadius
                    , 0.8               // shadow intensity

                    , 512, 512          // shadowMapSize(width, height)
                    , 0.1               // color intensity
                    , 0.0               // undefined


                    , 1.0, 1.0, 1.0      // direc light nv(x,y,z)
                    , 0.0                // undefined
                ]
            );

            this.m_uProbe = this.m_renderProxy.uniformContext.createShaderUniformProbe();
            this.m_uProbe.addMat4Data(this.m_direcMatrix.getLocalFS32(), 1);
            this.m_uProbe.addVec4Data(this.m_params, UniformConst.ShadowVSMParams.arrayLength);
            this.m_suo = this.m_uniformParam.createGlobalUinform(this.m_uProbe, this.m_renderProxy);
            this.m_uProbe.update();
        }
    }
    getGlobalUinform(): ShaderGlobalUniform {
        return this.m_suo.clone();
    }
    getGlobalUinformAt(i: number): ShaderGlobalUniform {
        let suo: ShaderGlobalUniform = new ShaderGlobalUniform();
        suo.copyDataFromProbeAt(i, this.m_uProbe);
        return suo;
    }
    updateShadowCamera(camera: CameraBase): void {
        //console.log("this.m_camVersion,camera.version: ",this.m_camVersion,camera.version);
        if (this.m_camVersion != camera.version) {

            this.m_camVersion = camera.version;
            this.m_direcMatrix.copyFrom(camera.getVPMatrix());
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
    update(): void {

        if (this.m_dirty && this.m_uProbe != null) {
            this.m_dirty = false;
            this.m_uProbe.update();
        }
    }
    destroy(): void {
        this.m_shadowMap = null;
    }
}