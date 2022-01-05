/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import ShaderCodeBuffer from "../../../vox/material/ShaderCodeBuffer";
import ShaderUniformData from "../../../vox/material/ShaderUniformData";
import Color4 from "../../../vox/material/Color4";
import MaterialBase from "../../../vox/material/MaterialBase";
import BillboardGroupShaderBuffer from "../../../vox/material/mcase/BillboardGroupShaderBuffer";

class BillboardFlareShaderBuffer extends BillboardGroupShaderBuffer {

    constructor() {
        super();
    }
    initialize(texEnabled: boolean): void {
        super.initialize( texEnabled );
        this.m_uniqueName = "flare_"+this.m_uniqueName;
    }
    buildVertShd(): void {

        let coder = this.m_coder;
        
        coder.addVertLayout("vec4", "a_vs");
        coder.addVertLayout("vec2", "a_uvs");
        coder.addVertLayout("vec4", "a_vs2");
        coder.addVertLayout("vec4", "a_uvs2");

        let paramTotal: number = this.m_clipEnabled ? 4 : 3;
        coder.addVertUniform("vec4", "u_billParam", paramTotal);

        if (this.m_clipEnabled) coder.addDefine("BILL_PARAM_INDEX", "3");

    }
    
    
    // getVertShaderCode(): string {
    //     return this.m_coder.buildVertCode();
    // }
    /*
    getVertShaderCode(): string {
        let paramTotal: number = this.m_clipEnabled ? 4 : 3;
        let vtxCode: string =
            `#version 300 es
precision mediump float;
layout(location = 0) in vec4 a_vs;
layout(location = 1) in vec2 a_uvs;
layout(location = 2) in vec4 a_vs2;
layout(location = 3) in vec4 a_uvs2;
uniform mat4 u_objMat;
uniform mat4 u_viewMat;
uniform mat4 u_projMat;
uniform vec4 u_billParam[`+ paramTotal + `];
out vec4 v_colorMult;
out vec4 v_colorOffset;
out vec4 v_texUV;
out vec4 v_factor;
void main()
{
vec4 temp = u_billParam[0];

float kf = fract(a_uvs2.w * temp.z/a_uvs2.x);
float fi = kf;
kf = min(kf/a_uvs2.y,1.0) * (1.0 - max((kf-a_uvs2.z)/(1.0 - a_uvs2.z),0.0));

vec2 vtx = a_vs.xy * temp.xy * vec2(a_vs.z + kf * a_vs.w);

viewPosition = u_viewMat * u_objMat * vec4(a_vs2.xyz,1.0);
viewPosition.xy += vtx.xy;
gl_Position =  u_projMat * viewPosition;
v_factor = vec4(0.0,0.0, kf * a_vs2.w,fi);
`;

        // return vtxCode + this.getVSEndCode(3);
        return vtxCode;// + this.getVSEndCode(3);
    }
    //*/
    toString(): string {
        return "[BillboardFlareShaderBuffer()]";
    }
    private static s_instance: BillboardFlareShaderBuffer = new BillboardFlareShaderBuffer();
    static GetInstance(): BillboardFlareShaderBuffer {
        if (BillboardFlareShaderBuffer.s_instance != null) {
            return BillboardFlareShaderBuffer.s_instance;
        }
        BillboardFlareShaderBuffer.s_instance = new BillboardFlareShaderBuffer();
        return BillboardFlareShaderBuffer.s_instance;
    }
}

export default class BillboardFlareMaterial extends MaterialBase {
    private m_brightnessEnabled: boolean = true;
    private m_alphaEnabled: boolean = false;
    private m_clipEnabled: boolean = false;
    private m_clipMixEnabled: boolean = false;
    constructor(brightnessEnabled: boolean = true, alphaEnabled: boolean = false, clipEnabled: boolean = false, clipMixEnabled: boolean = false) {
        super();
        this.m_brightnessEnabled = brightnessEnabled;
        this.m_alphaEnabled = alphaEnabled;
        this.m_clipEnabled = clipEnabled;
        this.m_clipMixEnabled = clipMixEnabled;
        if (this.m_clipEnabled) {
            this.m_uniformData = new Float32Array([1.0, 1.0, 0.0, 1.0, 1.0, 1.0, 1.0, 0.0, 0.0, 0.0, 0.0, 0.0, 2.0, 4.0, 0.5, 0.5]);
        }
        else {
            this.m_uniformData = new Float32Array([1.0, 1.0, 0.0, 1.0, 1.0, 1.0, 1.0, 0.0, 0.0, 0.0, 0.0, 0.0]);
        }
    }
    private m_time: number = 0;
    private m_uniformData: Float32Array = null;
    private m_color: Color4 = new Color4(1.0, 1.0, 1.0, 1.0);
    private m_brightness: number = 1.0;

    protected buildBuf(): void {

        let buf: BillboardFlareShaderBuffer = BillboardFlareShaderBuffer.GetInstance();
        buf.clipMixEnabled = this.m_clipMixEnabled;
        buf.brightnessEnabled = this.m_brightnessEnabled;
        buf.setParam(this.m_brightnessEnabled, this.m_alphaEnabled, this.m_clipEnabled, this.getTextureTotal() > 1);
    }
    getCodeBuf(): ShaderCodeBuffer {
        return BillboardFlareShaderBuffer.GetInstance();
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
    setClipUVParam(cn: number, total: number, du: number, dv: number): void {
        if (this.m_clipEnabled) {
            this.m_uniformData[12] = cn;
            this.m_uniformData[13] = total;
            this.m_uniformData[14] = du;
            this.m_uniformData[15] = dv;
        }
    }
    getTime(): number { return this.m_time; };
    setTime(time: number): void {
        this.m_time = time;
        this.m_uniformData[2] = time;
    }
    updateTime(offsetTime: number): void {
        this.m_time += offsetTime;
        this.m_uniformData[2] = this.m_time;
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