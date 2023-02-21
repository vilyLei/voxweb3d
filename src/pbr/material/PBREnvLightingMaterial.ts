/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import RendererDevice from "../../vox/render/RendererDevice";
import ShaderCodeBuffer from "../../vox/material/ShaderCodeBuffer";
import ShaderUniformData from "../../vox/material/ShaderUniformData";
import MaterialBase from "../../vox/material/MaterialBase";
import Vector3D from "../../vox/math/Vector3D";
import { PBREnvLighting } from "./glsl/PBREnvLighting";

class PBREnvLightingShaderBuffer extends ShaderCodeBuffer {
    constructor() {
        super();
    }
    private static s_instance: PBREnvLightingShaderBuffer = new PBREnvLightingShaderBuffer();
    private m_uniqueName: string = "";
    initialize(texEnabled: boolean): void {
        //console.log("PBREnvLightingShaderBuffer::initialize()...");
        this.m_uniqueName = "PBREnvLightingShd";
    }
    getFragShaderCode(): string {

        let fragCode: string =
`#version 300 es
precision highp float;
`;
        if (RendererDevice.IsWebGL1()) {

            fragCode +=
                `
#extension GL_EXT_shader_texture_lod : enable
#define VOX_TextureCubeLod textureCubeLodEXT
`;
        }
        else {

            fragCode +=
                `
#define VOX_TextureCubeLod textureLod
`;
        }
        fragCode += PBREnvLighting.frag_body;

        return fragCode;
    }
    getVertShaderCode(): string {
        let vtxCode = PBREnvLighting.vert_body;
        return vtxCode;
    }
    getUniqueShaderName(): string {
        //console.log("H ########################### this.m_uniqueName: "+this.m_uniqueName);
        return this.m_uniqueName;
    }

    static GetInstance(): PBREnvLightingShaderBuffer {
        return PBREnvLightingShaderBuffer.s_instance;
    }
}

export default class PBREnvLightingMaterial extends MaterialBase {
    constructor() {
        super();
    }

    getCodeBuf(): ShaderCodeBuffer {
        return PBREnvLightingShaderBuffer.GetInstance();
    }

    private m_albedo: Float32Array = new Float32Array([0.5, 0.0, 0.0, 0.0]);
    private m_params: Float32Array = new Float32Array([0.0, 0.0, 1.0, 0.0]);
    private m_F0: Float32Array = new Float32Array([0.0, 0.0, 0.0, 0.0]);
    private m_lightPositions: Float32Array = new Float32Array(4 * 4);
    private u_lightColors: Float32Array = new Float32Array(4 * 4);

    setMetallic(metallic: number): void {

        this.m_params[0] = Math.min(Math.max(metallic, 0.05), 1.0);
    }
    setRoughness(roughness: number): void {

        roughness = Math.min(Math.max(roughness, 0.05), 1.0);
        this.m_params[1] = roughness;
    }
    setAO(ao: number): void {

        this.m_params[2] = ao;
    }
    setF0(f0x: number, f0y: number, f0z: number): void {

        this.m_F0[0] = f0x;
        this.m_F0[1] = f0y;
        this.m_F0[2] = f0z;
    }
    setPosAt(i: number, px: number, py: number, pz: number): void {

        i *= 4;
        this.m_lightPositions[i] = px;
        this.m_lightPositions[i + 1] = py;
        this.m_lightPositions[i + 2] = pz;
    }
    setColor(pr: number, pg: number, pb: number): void {

        this.m_albedo[0] = pr;
        this.m_albedo[1] = pg;
        this.m_albedo[2] = pb;
    }
    setColorAt(i: number, pr: number, pg: number, pb: number): void {

        i *= 4;
        this.u_lightColors[i] = pr;
        this.u_lightColors[i + 1] = pg;
        this.u_lightColors[i + 2] = pb;
    }

    createSelfUniformData(): ShaderUniformData {

        let oum = new ShaderUniformData();
        oum.uniformNameList = ["u_albedo", "u_params", "u_lightPositions", "u_lightColors", "u_F0"];
        oum.dataList = [this.m_albedo, this.m_params, this.m_lightPositions, this.u_lightColors, this.m_F0];
        return oum;
    }
}