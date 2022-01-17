/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/
import BillboardFSBase from "../../../vox/material/mcase/BillboardFSBase";
import ShaderCodeBuffer from "../../../vox/material/ShaderCodeBuffer";
import ShaderUniformData from "../../../vox/material/ShaderUniformData";
import MaterialBase from "../../../vox/material/MaterialBase";

class LightLine3DShaderBuffer extends ShaderCodeBuffer {
    billFS: BillboardFSBase = new BillboardFSBase();
    constructor() {
        super();
    }
    private m_uniqueName: string = "";
    initialize(texEnabled: boolean): void {
        this.m_uniqueName = "LightLine3DShader";
    }
    getFragShaderCode(): string {

        let fragCode0: string =
            `#version 300 es
precision mediump float;
#define FADE_VAR fv4
uniform sampler2D u_sampler0;
in vec4 v_colorMult;
in vec4 v_colorOffset;
in vec2 v_texUV;
layout(location = 0) out vec4 FragColor;
void main()
{
vec4 color = texture(u_sampler0, v_texUV);
vec3 offsetColor = v_colorOffset.rgb;
vec4 fv4 = v_colorMult.wwww;
`;
        let fadeCode: string = this.billFS.getBrnAndAlphaCode();
        let fragCode2: string =
            `
FragColor = color;
}
`;
        return fragCode0 + fadeCode + fragCode2

    }
    getVertShaderCode(): string {
        let vtxCode: string =
            `#version 300 es
precision mediump float;
const vec4  direcV = vec4(1.0,-1.0,-1.0,1.0);

layout(location = 0) in vec4 a_vs;
layout(location = 1) in vec2 a_uvs;
layout(location = 2) in vec3 a_nvs;
uniform mat4 u_objMat;
uniform mat4 u_viewMat;
uniform mat4 u_projMat;
uniform vec4 u_billParam[3];
out vec2 v_texUV;
out vec4 v_colorMult;
out vec4 v_colorOffset;
void main()
{
mat4 voMat4 = u_viewMat * u_objMat;
vec4 pv0 = voMat4 * vec4(a_vs.xyz,1.0);
vec4 pv1 = voMat4 * vec4(a_nvs.xyz,1.0);
pv1.xy = pv1.xy - pv0.xy;
pv1.xy = pv1.yx * (a_vs.w > 0.0 ? direcV.xy : direcV.zw);
pv0.xy += normalize(pv1.xy) * abs(a_vs.w);
gl_Position = u_projMat * pv0;
v_texUV = a_uvs * u_billParam[0].xy + u_billParam[0].zw;
v_colorMult = u_billParam[1];
v_colorOffset = u_billParam[2];
}
`;
        return vtxCode;
    }
    getUniqueShaderName(): string {
        return this.m_uniqueName + "_" + this.billFS.getBrnAlphaStatus();
    }
    toString(): string {
        return "[LightLine3DShaderBuffer()]";
    }
    private static s_instance: LightLine3DShaderBuffer = new LightLine3DShaderBuffer();
    static GetInstance(): LightLine3DShaderBuffer {
        if (LightLine3DShaderBuffer.s_instance != null) {
            return LightLine3DShaderBuffer.s_instance;
        }
        LightLine3DShaderBuffer.s_instance = new LightLine3DShaderBuffer();
        return LightLine3DShaderBuffer.s_instance;
    }
}

export default class LightLine3DMaterial extends MaterialBase {
    private m_brightnessEnabled: boolean = true;
    private m_alphaEnabled: boolean = false;
    constructor(brightnessEnabled: boolean = true, alphaEnabled: boolean = false) {
        super();
        this.m_brightnessEnabled = brightnessEnabled;
        this.m_alphaEnabled = alphaEnabled;
    }

    private m_uniformData: Float32Array = new Float32Array([1.0, 1.0, 0.0, 0.0, 1.0, 1.0, 1.0, 1.0, 0.0, 0.0, 0.0, 0.0]);
    getCodeBuf(): ShaderCodeBuffer {
        let buf: LightLine3DShaderBuffer = LightLine3DShaderBuffer.GetInstance();
        buf.billFS.setBrightnessAndAlpha(this.m_brightnessEnabled, this.m_alphaEnabled);
        return buf;
    }
    createSelfUniformData(): ShaderUniformData {
        let oum: ShaderUniformData = new ShaderUniformData();
        oum.uniformNameList = ["u_billParam"];
        oum.dataList = [this.m_uniformData];
        return oum;
    }
    setUVParam(uScale: number, vScale: number, uOffset: number, vOffset: number): void {
        this.m_uniformData[0] = uScale;
        this.m_uniformData[1] = vScale;
        this.m_uniformData[2] = uOffset;
        this.m_uniformData[3] = vOffset;
    }
    setUVScale(uScale: number, vScale: number): void {
        this.m_uniformData[0] = uScale;
        this.m_uniformData[1] = vScale;
    }
    setUVOffset(uOffset: number, vOffset: number): void {
        this.m_uniformData[2] = uOffset;
        this.m_uniformData[3] = vOffset;
    }
    setRGBA4f(pr: number, pg: number, pb: number, pa: number): void {
        this.m_uniformData[4] = pr;
        this.m_uniformData[5] = pg;
        this.m_uniformData[6] = pb;
        this.m_uniformData[7] = pa;
    }
    setRGB3f(pr: number, pg: number, pb: number) {
        this.m_uniformData[4] = pr;
        this.m_uniformData[5] = pg;
        this.m_uniformData[6] = pb;
    }
    setFadeFactor(pa: number): void {
        this.m_uniformData[7] = pa;
    }
    getFadeFactor(): number {
        return this.m_uniformData[7];
    }

    setRGBAOffset4f(pr: number, pg: number, pb: number, pa: number): void {
        this.m_uniformData[8] = pr;
        this.m_uniformData[9] = pg;
        this.m_uniformData[10] = pb;
        this.m_uniformData[11] = pa;
    }
    setRGBOffset3f(pr: number, pg: number, pb: number): void {
        this.m_uniformData[8] = pr;
        this.m_uniformData[9] = pg;
        this.m_uniformData[10] = pb;
    }
    getUniformData(): Float32Array {
        return this.m_uniformData;
    }

    destroy() {
        super.destroy();
        this.m_uniformData = null;
    }
}