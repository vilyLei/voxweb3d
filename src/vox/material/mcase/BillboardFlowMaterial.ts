/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import MathShaderCode from "../../../vox/material/code/MathShaderCode";
import ShaderCodeBuffer from "../../../vox/material/ShaderCodeBuffer";
import ShaderUniformData from "../../../vox/material/ShaderUniformData";
import Color4 from "../../../vox/material/Color4";
import MaterialBase from "../../../vox/material/MaterialBase";
import BillboardGroupShaderBuffer from "../../../vox/material/mcase/BillboardGroupShaderBuffer";

import IShaderCodeObject from "../IShaderCodeObject";
import { BillboardGroupShaderCode } from "../mcase/glsl/BillboardGroupShaderCode";


class BillboardFlowShaderBuffer extends BillboardGroupShaderBuffer {

    playOnce: boolean = false;
    direcEnabled: boolean = false;
    // 因为速度增加，在x轴方向缩放(拉长或者缩短)
    spdScaleEnabled: boolean = false;
    constructor() {
        super();
    }

    initialize(texEnabled: boolean): void {

        this.m_coderEnabled = true;
        super.initialize(texEnabled);
        this.m_uniqueName = "flow_"+this.m_uniqueName;
        if (this.playOnce && this.direcEnabled) {
            this.m_uniqueName += "_OD";
        } else if (this.playOnce) {
            this.m_uniqueName += "_O";
        } else if (this.direcEnabled) {
            this.m_uniqueName += "_D";
            if (this.spdScaleEnabled) this.m_uniqueName += "SpdScale";
        }
        if (this.clipMixEnabled) this.m_uniqueName += "Mix";
        if (this.premultiplyAlpha) this.m_uniqueName += "PreMAlpha";
        this.adaptationShaderVersion = !this.m_coderEnabled;
    }

    buildVertShd(): void {

        let coder = this.m_coder;
        coder.addVertLayout("vec4", "a_vs");
        coder.addVertLayout("vec2", "a_uvs");
        coder.addVertLayout("vec4", "a_nvs");
        coder.addVertLayout("vec4", "a_vs2");
        coder.addVertLayout("vec4", "a_uvs2");
        coder.addVertLayout("vec4", "a_nvs2");

        let paramTotal: number = this.m_clipEnabled ? 5 : 4;
        coder.addVertUniform("vec4", "u_billParam", paramTotal);

        if (this.direcEnabled) coder.addDefine("ROTATION_DIRECT");
        if (this.playOnce) coder.addDefine("PLAY_ONCE");
        if (this.spdScaleEnabled) coder.addDefine("SPEED_SCALE");
        if (this.m_clipEnabled) coder.addDefine("BILL_PARAM_INDEX", "4");

    }
    
    getShaderCodeObject(): IShaderCodeObject {
        if(this.pipeline != null || this.m_coderEnabled) {
            return BillboardGroupShaderCode;
        }
        return super.getShaderCodeObject();
    }
    buildShader(): void {
        console.log("BillboardFlowShaderBuffer::buildShader()..., this.m_coderEnabled: ",this.m_coderEnabled);
        if(this.pipeline != null || this.m_coderEnabled) {
            this.m_coder.autoBuildHeadCodeEnabled = false;
            this.buildFragShd();
            this.buildVertShd();
            if (this.pipeline == null) {
                this.m_coder.addShaderObject( BillboardGroupShaderCode );
            }
        }
    }
    getVertShaderCode(): string {

        if(this.pipeline != null || this.m_coderEnabled) {
            return this.m_coder.buildVertCode();
        }
        let paramTotal: number = this.m_clipEnabled ? 5 : 4;
        console.log("BillboardFlowShaderBuffer::getVertShaderCode(),clipEnabled: ",this.m_clipEnabled, "paramTotal: ",paramTotal);
        console.log("this.m_coderEnabled: ",this.m_coderEnabled,"whole uns: ",this.getUniqueShaderName(), "uns: ",this.m_uniqueName);
        let vtxCode0: string =
            `#version 300 es
precision mediump float;
layout(location = 0) in vec4 a_vs;
layout(location = 1) in vec2 a_uvs;
layout(location = 2) in vec4 a_nvs;
layout(location = 3) in vec4 a_vs2;
layout(location = 4) in vec4 a_uvs2;
layout(location = 5) in vec4 a_nvs2;
const vec3 biasV3 = vec3(0.1);
uniform mat4 u_objMat;
uniform mat4 u_viewMat;
uniform mat4 u_projMat;
uniform vec4 u_billParam[`+ paramTotal + `];

`;
        if (this.m_hasOffsetColorTex) {
            if (this.m_useRawUVEnabled) {
                vtxCode0 += "#define VOX_USE_RAW_UV 1\n";
            }
        }
        if (this.m_clipEnabled) {
            vtxCode0 += "#define VOX_USE_CLIP 1\n";
            vtxCode0 += "#define BILL_PARAM_INDEX 4\n";
            if(this.clipMixEnabled) {
                vtxCode0 += "#define VOX_USE_CLIP_MIX 1\n";
            }
        }
        if (this.direcEnabled) vtxCode0 += "#define ROTATION_DIRECT 1\n";
        if (this.playOnce) vtxCode0 += "#define PLAY_ONCE 1\n";
        if (this.spdScaleEnabled) vtxCode0 += "#define SPEED_SCALE 1\n";

        if (this.m_hasOffsetColorTex && this.m_useRawUVEnabled) {
            vtxCode0 +=
                `
out vec4 v_uv;
`;
        }
        vtxCode0 +=
            `
out vec4 v_colorMult;
out vec4 v_colorOffset;
out vec4 v_texUV;
out vec4 v_factor;

#ifdef ROTATION_DIRECT

// 3.141592653589793
#define MATH_PI 3.14159265
// 4.71238898038469
#define MATH_3PER2PI 4.71238898
// 1.5707963267948966
#define MATH_1PER2PI 1.57079633

float getRadianByXY(float dx, float dy) {

    if(abs(dx) < 0.00001) {
        return (dy >= 0.0) ? MATH_1PER2PI : MATH_3PER2PI;
    }
    float rad = atan(dy/dx);
    return dx >= 0.0 ? rad: (MATH_PI + rad);
}
#endif

#ifdef VOX_USE_CLIP
void calculateClipUV(float fi) {
    
    #ifdef VOX_USE_CLIP_MIX
        // calculate clip uv
        vec4 temp = u_billParam[ BILL_PARAM_INDEX ];//(x:cn,y:total,z:du,w:dv)
        float clipf0 = floor(fi * temp.y);
        float clipf1 = min(clipf0 + 1.0, temp.y - 1.0);
        clipf0 /= temp.x;
        // vec2(floor(fract(clipf0) * temp.x), floor(clipf0)) -> vec2(cn u,rn v)
        v_texUV.xy = (vec2(floor(fract(clipf0) * temp.x), floor(clipf0)) + a_uvs.xy) * temp.zw;

        v_factor.x = fract(fi * temp.y);

        clipf1 /= temp.x;
        v_texUV.zw = (vec2(floor(fract(clipf1) * temp.x), floor(clipf1)) + a_uvs.xy) * temp.zw;
    #else
        // calculate clip uv
        vec4 temp = u_billParam[ BILL_PARAM_INDEX ];//(x:cn,y:total,z:du,w:dv)
        float clipf = floor(fi * temp.y);
        clipf /= temp.x;
        // vec2(floor(fract(clipf) * temp.x), floor(clipf)) -> vec2(cn u,rn v)
        v_texUV.xy = (vec2(floor(fract(clipf) * temp.x), floor(clipf)) + a_uvs.xy) * temp.zw;
    #endif
}
#endif

vec4 motionCalc(float time, inout vec2 vtx) {
    ///*
    vec3 timeV = vec3(time);
    vec3 acc3 = u_billParam[3].xyz + a_nvs2.xyz;
    #ifdef ROTATION_DIRECT
        #ifdef SPEED_SCALE
            float v0scale = clamp(length(a_nvs.xyz + acc3 * timeV)/u_billParam[1].w,1.0,u_billParam[3].w);
            vtx *= vec2(v0scale, 1.0);
        #endif

        vec3 pv0 = a_vs2.xyz + (a_nvs.xyz + acc3 * timeV) * timeV;
        timeV += biasV3;
        vec3 pv1 = a_vs2.xyz + (a_nvs.xyz + acc3 * timeV) * timeV;

        mat4 voMat = u_viewMat * u_objMat;
        vec4 pos = voMat * vec4(pv0,1.0);
        vec4 pos1 = voMat * vec4(pv1,1.0);
        float rad = getRadianByXY(pos1.x - pos.x, pos1.y - pos.y);
        float cosv = cos(rad);
        float sinv = sin(rad);

        // rotate
        vtx = vec2(vtx.x * cosv - vtx.y * sinv, vtx.x * sinv + vtx.y * cosv);
    #else
        vec4 pos = u_viewMat * u_objMat * vec4(a_vs2.xyz + (a_nvs.xyz + acc3 * timeV) * timeV,1.0);
    #endif
    //*/
    // vec3 acc3 = u_billParam[3].xyz + a_nvs2.xyz;
    // vec3 timeV = vec3(0.9);
    // vec4 pos = u_viewMat * u_objMat * vec4(a_vs2.xyz + (a_nvs.xyz + acc3 * timeV) * timeV,1.0);

    return pos;
}
`;
        let vtxCode02: string =
            `
void main()
{
    vec4 temp = u_billParam[0];
    float time = max(a_nvs.w * temp.z - a_uvs2.w, 0.0);

    #ifdef PLAY_ONCE
        time = min(time, a_uvs2.x);
    #endif

    float kf = fract(time/a_uvs2.x);
    float fi = kf;
    time = kf * a_uvs2.x;
    kf = min(kf/a_uvs2.y,1.0) * (1.0 - max((kf - a_uvs2.z)/(1.0 - a_uvs2.z),0.0));
    // scale
    vec2 vtx = a_vs.xy * temp.xy * vec2(a_vs.z + kf * a_vs.w);
    //vec2 vtx = a_vs.xy;

    vec4 pos = motionCalc(time, vtx);
    
    pos.xy += vtx.xy;
    gl_Position =  u_projMat * pos;
    v_factor = vec4(0.0,0.0, kf * a_vs2.w,fi);

    #ifdef VOX_USE_RAW_UV
        v_uv = vec4(a_uvs.xy,0.0,0.0);
    #endif
    #ifdef VOX_USE_CLIP
        calculateClipUV( fi );
    #else
        v_texUV = vec4(a_uvs.xy, a_uvs.xy);
    #endif

    v_colorMult = u_billParam[1];
    v_colorOffset = u_billParam[2];
}
`;

        return vtxCode0 + vtxCode02;
    }
    toString(): string {
        return "[BillboardFlowShaderBuffer()]";
    }
    private static s_instance: BillboardFlowShaderBuffer = new BillboardFlowShaderBuffer();
    static GetInstance(): BillboardFlowShaderBuffer {
        if (BillboardFlowShaderBuffer.s_instance != null) {
            return BillboardFlowShaderBuffer.s_instance;
        }
        BillboardFlowShaderBuffer.s_instance = new BillboardFlowShaderBuffer();
        return BillboardFlowShaderBuffer.s_instance;
    }
}

export default class BillboardFlowMaterial extends MaterialBase {

    private m_brightnessEnabled: boolean = true;
    private m_alphaEnabled: boolean = false;
    private m_clipEnabled: boolean = false;
    private m_clipMixEnabled: boolean = false;
    private m_playOnce: boolean = false;
    private m_direcEnabled: boolean = false;
    private m_spdScaleEnabled: boolean = false;
    private m_time: number = 0;
    private m_uniformData: Float32Array = null;
    private m_color: Color4 = new Color4(1.0, 1.0, 1.0, 1.0);
    private m_brightness: number = 1.0;
    premultiplyAlpha: boolean = false;

    constructor(brightnessEnabled: boolean = true, alphaEnabled: boolean = false, clipEnabled: boolean = false) {
        super();
        this.m_brightnessEnabled = brightnessEnabled;
        this.m_alphaEnabled = alphaEnabled;
        this.m_clipEnabled = clipEnabled;
        if (clipEnabled) {
            this.m_uniformData = new Float32Array([
                1.0, 1.0, 0.0, 1.0,        // sx,sy,time, undefined
                1.0, 1.0, 1.0, 1.0,        // r,g,b, spdScaleFactor(0.1 -> 5.0)
                0.0, 0.0, 0.0, 0.0,
                0.0, 0.0, 0.0, 2.0,        // whole acceleration x,y,z,  speed scale max value
                2, 4, 0.5, 0.5             // clip cn, clip total, clip du, clip dv
            ]);
        }
        else {
            this.m_uniformData = new Float32Array([1.0, 1.0, 0.0, 1.0, 1.0, 1.0, 1.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 2.0]);
        }
    }

    setPlayParam(playOnce: boolean, direcEnabled: boolean, clipMixEnabled: boolean = false, spdScaleEnabled: boolean = false): void {
        this.m_playOnce = playOnce;
        this.m_direcEnabled = direcEnabled;
        this.m_clipMixEnabled = clipMixEnabled;
        this.m_spdScaleEnabled = spdScaleEnabled;
    }
    protected buildBuf(): void {
        let buf: BillboardFlowShaderBuffer = BillboardFlowShaderBuffer.GetInstance();
        buf.playOnce = this.m_playOnce;
        buf.direcEnabled = this.m_direcEnabled;
        buf.clipMixEnabled = this.m_clipMixEnabled;
        buf.spdScaleEnabled = this.m_spdScaleEnabled;
        buf.premultiplyAlpha = this.premultiplyAlpha;
        buf.setParam(this.m_brightnessEnabled, this.m_alphaEnabled, this.m_clipEnabled, this.getTextureTotal() > 1);
    }

    getCodeBuf(): ShaderCodeBuffer {
        return BillboardFlowShaderBuffer.GetInstance();
        // let buf: BillboardFlowShaderBuffer = BillboardFlowShaderBuffer.GetInstance();
        // buf.playOnce = this.m_playOnce;
        // buf.direcEnabled = this.m_direcEnabled;
        // buf.clipMixEnabled = this.m_clipMixEnabled;
        // buf.spdScaleEnabled = this.m_spdScaleEnabled;
        // buf.premultiplyAlpha = this.premultiplyAlpha;
        // buf.setParam(this.m_brightnessEnabled, this.m_alphaEnabled, this.m_clipEnabled, this.getTextureTotal() > 1);
        // return buf;
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
        this.m_color.a = pa;
        this.m_uniformData[4] = pr * this.m_brightness;
        this.m_uniformData[5] = pg * this.m_brightness;
        this.m_uniformData[6] = pb * this.m_brightness;
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
    setAcceleration(accX: number, accY: number, accZ: number): void {
        this.m_uniformData[12] = accX;
        this.m_uniformData[13] = accY;
        this.m_uniformData[14] = accZ;
    }
    setSpdScaleMax(spdScaleMax: number, factor: number = 1.0): void {
        if (spdScaleMax < 1.0) spdScaleMax = 1.0;
        if (spdScaleMax > 10.0) spdScaleMax = 10.0;
        if (factor < 0.1) factor = 0.1;
        if (factor > 5.0) factor = 5.0;
        this.m_uniformData[15] = spdScaleMax;
        this.m_uniformData[7] = factor;
    }
    setClipUVParam(cn: number, total: number, du: number, dv: number): void {
        if (this.m_clipEnabled) {
            this.m_uniformData[16] = cn;
            this.m_uniformData[17] = total;
            this.m_uniformData[18] = du;
            this.m_uniformData[19] = dv;
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