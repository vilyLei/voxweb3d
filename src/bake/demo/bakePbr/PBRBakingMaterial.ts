/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2023 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import ShaderCodeBuffer from "../../../vox/material/ShaderCodeBuffer";
import ShaderUniformData from "../../../vox/material/ShaderUniformData";
import MaterialBase from "../../../vox/material/MaterialBase";
import Vector3D from "../../../vox/math/Vector3D";

import { PBRShaderCode } from "./PBRShaderCode";
class PBRBakingShaderBuffer extends ShaderCodeBuffer {
    constructor() {
        super();
    }
    private static s_instance: PBRBakingShaderBuffer = new PBRBakingShaderBuffer();
    private m_uniqueName: string = "";
    bake = false;
    initialize(texEnabled: boolean): void {
        //console.log("PBRBakingShaderBuffer::initialize()...");
        this.m_uniqueName = "PBRBakingShd";
    }
    getFragShaderCode(): string {
        let fragCode0 =
`#version 300 es
precision highp float;
`
        let fragCode2 = PBRShaderCode.frag_body;

        return fragCode0 + fragCode2;
    }
    getVertShaderCode(): string {
        let vtxCode0: string = 
`#version 300 es
precision highp float;
`;
        let vtxCode1 = "";
        if (this.bake) {
            vtxCode1 = "\n#define BAKE 1\n"
        }
        let vtxCode2 = PBRShaderCode.vert_body;
        return vtxCode0 + vtxCode1 + vtxCode2;
    }
    getUniqueShaderName(): string {
        //console.log("H ########################### this.m_uniqueName: "+this.m_uniqueName);
        return this.m_uniqueName + (this.bake ? "bake" : "");
    }
    toString(): string {
        return "[PBRBakingShaderBuffer()]";
    }

    static GetInstance(): PBRBakingShaderBuffer {
        return PBRBakingShaderBuffer.s_instance;
    }
}

export default class PBRBakingMaterial extends MaterialBase {
    private m_posOffset = new Float32Array([0.0, 0.0, 0.0, 0.0]);
    private m_uvOffset = new Float32Array([0.0, 0.0, 1.0, 1.0]);
    private m_albedo = new Float32Array([0.5, 0.0, 0.0, 0.0]);
    private m_params = new Float32Array([0.0, 0.0, 1.0, 0.0]);
    private m_lightPositions = new Float32Array(4 * 4);
    private u_lightColors = new Float32Array(4 * 4);

    bake = false;
    constructor() {
        super();
    }
    clone(): PBRBakingMaterial {
        let m = new PBRBakingMaterial();
        m.bake = this.bake;
        m.m_posOffset = this.m_posOffset.slice(0);
        m.m_uvOffset = this.m_uvOffset.slice(0);
        m.m_params = this.m_params.slice(0);
        m.m_lightPositions = this.m_lightPositions.slice(0);
        m.u_lightColors = this.u_lightColors.slice(0);
        m.setTextureList(this.getTextureList());
        return m;
    }
    setOffsetXY(px: number, py: number): void {
        this.m_posOffset[0] = px;
        this.m_posOffset[1] = py;
    }
    setOffsetUV(pu: number, pv: number): void {
        this.m_uvOffset[0] = pu;
        this.m_uvOffset[1] = pv;
    }
    setScaleUV(su: number, sv: number): void {
        this.m_uvOffset[2] = su;
        this.m_uvOffset[3] = sv;
    }
    getCodeBuf(): ShaderCodeBuffer {

        let ins = PBRBakingShaderBuffer.GetInstance();
        ins.bake = this.bake;
        return ins;
    }

    setMetallic(metallic: number): void {

        this.m_params[0] = metallic;
    }
    setRoughness(roughness: number): void {

        //roughness = Math.max(1.0 - j/(cn - 1), 0.05);
        roughness = Math.min(Math.max(roughness, 0.05), 1.0);
        this.m_params[1] = roughness;
    }
    setAO(ao: number): void {

        this.m_params[2] = ao;
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

        //  console.log("this.m_albedo: ",this.m_albedo);
        //  console.log("this.m_params: ",this.m_params);
        //  console.log("this.m_camPos: ",this.m_camPos);
        let oum: ShaderUniformData = new ShaderUniformData();
        oum.uniformNameList = ["u_albedo", "u_lightPositions", "u_lightColors", "u_posOffset", "u_uvOffset"];
        oum.dataList = [this.m_albedo, this.m_lightPositions, this.u_lightColors, this.m_posOffset, this.m_uvOffset];
        return oum;
    }
}