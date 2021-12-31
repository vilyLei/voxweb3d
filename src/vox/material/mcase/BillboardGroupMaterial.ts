/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/




import MathConst from "../../../vox/math/MathConst";
import ShaderCodeBuffer from "../../../vox/material/ShaderCodeBuffer";
import ShaderUniformData from "../../../vox/material/ShaderUniformData";
import Color4 from "../../../vox/material/Color4";
import MaterialBase from "../../../vox/material/MaterialBase";


class BillGroupShaderBuffer extends ShaderCodeBuffer {
    constructor() {
        super();
    }
    private m_uniqueName: string = "";
    initialize(texEnabled: boolean): void {        
        super.initialize( texEnabled );
        this.m_uniqueName = "BillGroupShader";
    }
    getFragShaderCode(): string {
        let fragCode: string =
            `#version 300 es
precision mediump float;
uniform sampler2D u_sampler0;
in vec4 v_colorMult;
in vec4 v_colorOffset;
in vec2 v_texUV;
layout(location = 0) out vec4 FragColor;
void main()
{
vec4 color = texture(u_sampler0, v_texUV);
color.rgb = max(color.rgb * v_colorMult.xyz + v_colorOffset.xyz,0.0);
FragColor = color;
}
`;
        return fragCode;
    }
    getVertShaderCode(): string {
        let vtxCode: string =
            `#version 300 es
precision mediump float;
layout(location = 0) in vec2 a_vs;
layout(location = 1) in vec3 a_vs2;
layout(location = 2) in vec2 a_uvs;
uniform mat4 u_objMat;
uniform mat4 u_viewMat;
uniform mat4 u_projMat;
uniform vec4 u_billParam[3];
out vec4 v_colorMult;
out vec4 v_colorOffset;
out vec2 v_texUV;
void main()
{
vec4 temp = u_billParam[0];
vec2 vtx = vec2(a_vs.x * temp.x, a_vs.y * temp.y);
vec4 pos = u_viewMat * u_objMat * vec4(a_vs2.xyz,1.0);
pos.xy += vtx.xy;
gl_Position =  u_projMat * pos;
v_texUV = a_uvs;
v_colorMult = u_billParam[1];
v_colorOffset = u_billParam[2];
}
`;
        return vtxCode;
    }
    getUniqueShaderName(): string {
        return this.m_uniqueName;
    }
    toString(): string {
        return "[BillGroupShaderBuffer()]";
    }
    private static s_instance: BillGroupShaderBuffer = new BillGroupShaderBuffer();
    static GetInstance(): BillGroupShaderBuffer {
        if (BillGroupShaderBuffer.s_instance != null) {
            return BillGroupShaderBuffer.s_instance;
        }
        BillGroupShaderBuffer.s_instance = new BillGroupShaderBuffer();
        return BillGroupShaderBuffer.s_instance;
    }
}

export default class BillboardGroupMaterial extends MaterialBase {
    constructor() {
        super();
    }
    private m_rz: number = 0;
    private m_uniformData: Float32Array = new Float32Array([1.0, 1.0, 0.0, 1.0, 1.0, 1.0, 1.0, 0.0, 0.0, 0.0, 0.0, 0.0]);
    private m_color: Color4 = new Color4(1.0, 1.0, 1.0, 1.0);
    private m_brightness: number = 1.0;

    getCodeBuf(): ShaderCodeBuffer {
        let buf: ShaderCodeBuffer = BillGroupShaderBuffer.GetInstance();
        return buf;
    }
    createSelfUniformData(): ShaderUniformData {
        let oum: ShaderUniformData = new ShaderUniformData();
        oum.uniformNameList = ["u_billParam"];
        oum.dataList = [this.m_uniformData];
        return oum;
    }


    setRGBA4f(pr: number, pg: number, pb: number, pa: number): void {
        this.m_color.r = pr;
        this.m_color.g = pg;
        this.m_color.b = pb;
        this.m_uniformData[4] = pr * this.m_brightness;
        this.m_uniformData[5] = pg * this.m_brightness;
        this.m_uniformData[6] = pb * this.m_brightness;
        this.m_uniformData[7] = pa;
    }
    setRGB3f(pr: number, pg: number, pb: number) {
        this.m_color.r = pr;
        this.m_color.g = pg;
        this.m_color.b = pb;
        this.m_uniformData[4] = pr * this.m_brightness;
        this.m_uniformData[5] = pg * this.m_brightness;
        this.m_uniformData[6] = pb * this.m_brightness;
    }
    setAlpha(pa: number): void {
        this.m_uniformData[7] = pa;
    }
    getAlpha(): number {
        return this.m_uniformData[6];
    }
    setBrightness(brighness: number): void {
        this.m_brightness = brighness;
        this.m_uniformData[4] = this.m_color.r * brighness;
        this.m_uniformData[5] = this.m_color.g * brighness;
        this.m_uniformData[6] = this.m_color.b * brighness;
    }
    getBrightness(): number {
        return this.m_brightness;
    }

    setRGBAOffset4f(pr: number, pg: number, pb: number, pa: number): void {
        //this.m_colorOffset.r = pr;
        //this.m_colorOffset.g = pg;
        //this.m_colorOffset.b = pb;
        //this.m_colorOffset.a = pa;
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
    getRotationZ(): number { return this.m_rz; };
    setRotationZ(degrees: number): void {
        this.m_rz = degrees;
        this.m_uniformData[2] = degrees * MathConst.MATH_PI_OVER_180;
    }
    getScaleX(): number { return this.m_uniformData[0]; }
    getScaleY(): number { return this.m_uniformData[1]; }
    setScaleX(p: number): void { this.m_uniformData[0] = p; }
    setScaleY(p: number): void { this.m_uniformData[1] = p; }
    setScaleXY(sx: number, sy: number): void {
        this.m_uniformData[0] = sx;
        this.m_uniformData[1] = sy;
    }
    getUniformData(): Float32Array {
        return this.m_uniformData;
    }

    destroy() {
        super.destroy();
        this.m_uniformData = null;
    }
}