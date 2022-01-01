/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/




/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import ShaderCodeBuffer from "../../../vox/material/ShaderCodeBuffer";
import BillboardFSBase from "../../../vox/material/mcase/BillboardFSBase";

export default class BillboardGroupShaderBuffer extends ShaderCodeBuffer {

    private m_billFS: BillboardFSBase = new BillboardFSBase();
    protected m_clipEnabled: boolean = false;
    protected m_hasOffsetColorTex: boolean = false;
    protected m_useRawUVEnabled: boolean = false
    protected m_brightnessEnabled: boolean = false;
    
    protected m_coderEnabled: boolean = false;
    protected m_uniqueName: string = "";
    clipMixEnabled: boolean = false;

    constructor() {
        super();
    }
    initialize(texEnabled: boolean): void {
        super.initialize(texEnabled);
        this.m_uniqueName = "BillboardGroupShader";
    }
    setParam(brightnessEnabled: boolean, alphaEnabled: boolean, clipEnabled: boolean, hasOffsetColorTex: boolean): void {
        this.m_brightnessEnabled = brightnessEnabled;
        this.m_billFS.setBrightnessAndAlpha(brightnessEnabled, alphaEnabled);
        this.m_clipEnabled = clipEnabled;
        this.m_hasOffsetColorTex = hasOffsetColorTex;
    }
    /*
    getClipCalcVSCode(paramIndex: number): string {
        if (this.clipMixEnabled) {
            let code: string =
                `
// calculate clip uv
temp = u_billParam[ BILL_PARAM_INDEX ];//(x:cn,y:total,z:du,w:dv)
float clipf0 = floor(fi * temp.y);
float clipf1 = min(clipf0+1.0,temp.y-1.0);
clipf0 /= temp.x;
// vec2(floor(fract(clipf0) * temp.x), floor(clipf0)) -> ve2(cn u,rn v)
v_texUV.xy = (vec2(floor(fract(clipf0) * temp.x), floor(clipf0)) + a_uvs.xy) * temp.zw;

v_factor.x = fract(fi * temp.y);

clipf1 /= temp.x;
v_texUV.zw = (vec2(floor(fract(clipf1) * temp.x), floor(clipf1)) + a_uvs.xy) * temp.zw;
`;
            return code;
        }
        else {
            let code: string =
                `
// calculate clip uv
temp = u_billParam[ BILL_PARAM_INDEX ];//(x:cn,y:total,z:du,w:dv)
float clipf = floor(fi * temp.y);
clipf /= temp.x;
// vec2(floor(fract(clipf) * temp.x), floor(clipf)) -> ve2(cn u,rn v)
v_texUV.xy = (vec2(floor(fract(clipf) * temp.x), floor(clipf)) + a_uvs.xy) * temp.zw;
`;
            return code;
        }
    }
    //*/
    getVSEndCode(paramIndex: number): string {
        let vtxCode1: string =

`
#ifdef VOX_USE_CLIP
    calculateClipUV( fi );
#else
    v_texUV = vec4(a_uvs.xy, a_uvs.xy);
#endif

v_colorMult = u_billParam[1];
v_colorOffset = u_billParam[2];
}
`;
        return vtxCode1;

        if (this.m_clipEnabled) {
            // vtxCode1 = this.getClipCalcVSCode(paramIndex);
            //VOX_USE_CLIP
            vtxCode1 = 
`
    #ifdef VOX_USE_CLIP
        calculateClipUV( fi );
    #endif
`;
        }
        else {
            vtxCode1 =
                `
v_texUV = vec4(a_uvs.xy, a_uvs.xy);
`;
        }
        let vtxCodeEnd: string =
            `
v_colorMult = u_billParam[1];
v_colorOffset = u_billParam[2];
}
`;
        return vtxCode1 + vtxCodeEnd;
    }

    buildFragShd(): void {

        let coder = this.m_coder;
        this.m_uniform.addDiffuseMap();
        if (this.m_hasOffsetColorTex) {
            this.m_uniform.add2DMap("VOX_OFFSET_COLOR_MAP");
            if (this.m_useRawUVEnabled) {
                coder.addDefine("VOX_USE_RAW_UV");
                coder.addVarying("vec4", "v_uv");
            }
        }
        coder.addVarying("vec4", "v_colorMult");
        coder.addVarying("vec4", "v_colorOffset");
        coder.addVarying("vec4", "v_texUV");
        coder.addVarying("vec4", "v_factor");
        if (this.m_clipEnabled) {
            coder.addDefine("VOX_USE_CLIP");
            if(this.clipMixEnabled) {
                coder.addDefine("VOX_USE_CLIP_MIX");
            }
        }
        coder.addDefine("FADE_VAR", "v_factor");
        coder.addDefine("FADE_STATUS", "" + this.m_billFS.getBrnAlphaStatus());
        
    }
    getFragShaderCode(): string {

        if(this.pipeline != null || this.m_coderEnabled) {
            return this.m_coder.buildFragCode();
        }
/*
        let ttstr: string =
`#version 300 es

precision highp float;
#define VOX_GLSL_ES3 1
#define VOX_IN in
#define VOX_Texture2D texture
#define VOX_TextureCube texture
#define PI 3.141592653589793
#define PI2 6.283185307179586
#define PI_HALF 1.5707963267948966
#define RECIPROCAL_PI 0.3183098861837907
#define RECIPROCAL_PI2 0.15915494309189535
#define EPSILON 1e-6

#define VOX_USE_CLIP 1
#define VOX_USE_CLIP_MIX 1
#define FADE_VAR v_factor
#define FADE_STATUS 10
#define PLAY_ONCE 1
#define BILL_PARAM_INDEX 4
#define VOX_DIFFUSE_MAP u_sampler0
#define VOX_OFFSET_COLOR_MAP u_sampler1
#define VOX_USE_2D_MAP 1
uniform sampler2D u_sampler0;
uniform sampler2D u_sampler1;
in vec4 v_colorMult;
in vec4 v_colorOffset;
in vec4 v_texUV;
in vec4 v_factor;
vec4 localPosition = vec4(0.0,0.0,0.0,1.0);
vec4 worldPosition = vec4(0.0,0.0,0.0,1.0);
// view space position
vec4 viewPosition = vec4(0.0,0.0,0.0,1.0);
vec3 worldNormal = vec3(0.0, 0.0, 1.0);

vec3 getOffsetColor() {
    #ifdef VOX_OFFSET_COLOR_MAP
        #ifdef VOX_USE_RAW_UV
            vec3 offsetColor = clamp(v_colorOffset.xyz + VOX_Texture2D(VOX_OFFSET_COLOR_MAP, v_uv.xy).xyz,vec3(0.0),vec3(1.0));
        #else
            vec3 offsetColor = clamp(v_colorOffset.xyz + VOX_Texture2D(VOX_OFFSET_COLOR_MAP, v_texUV.xy).xyz,vec3(0.0),vec3(1.0));
        #endif
    #else
        vec3 offsetColor = v_colorOffset.xyz;
    #endif
    return offsetColor;
}

void blendBrightnessORAlpha(inout vec4 color, in vec3 offsetColor) {

    #if FADE_STATUS == 11
        color.rgb = color.rgb * v_colorMult.xyz + color.aaa * offsetColor;
        color *= FADE_VAR.zzzz;
    #elif FADE_STATUS == 10
        color.rgb = min(color.rgb * v_colorMult.xyz + color.rgb * offsetColor, vec3(1.0));
        color.rgb *= FADE_VAR.zzz;
    #elif FADE_STATUS == 1
        color.rgb = color.rgb * v_colorMult.xyz + color.aaa * offsetColor;
        color.a *= FADE_VAR.z;
    #else
        color.rgb = color.rgb * v_colorMult.xyz + offsetColor;
        color.a *= FADE_VAR.z;
    #endif
}
layout(location = 0) out vec4 FragColor0;
void main() {

    vec4 color = VOX_Texture2D(VOX_DIFFUSE_MAP, v_texUV.xy);
    #ifdef VOX_USE_CLIP_MIX
        color = mix(color, VOX_Texture2D(VOX_DIFFUSE_MAP, v_texUV.zw),v_factor.x);
    #endif

    vec3 offsetColor = getOffsetColor();
    
    blendBrightnessORAlpha( color, offsetColor );

    #ifdef VOX_PREMULTIPLY_ALPHA
        color.xyz *= color.aaa;
    #endif
    FragColor0 = color;
}
`;
return ttstr;
//*/
        let fragCodeHead: string =
            `#version 300 es
precision mediump float;
#define FADE_VAR v_factor
`;
        if (this.premultiplyAlpha) fragCodeHead += "\n#define VOX_PREMULTIPLY_ALPHA";
        // for test...................begin
        console.log("for test, this.m_hasOffsetColorTex, this.m_useRawUVEnabled: ", this.m_hasOffsetColorTex, this.m_useRawUVEnabled);
        console.log("for test, this.m_billFS.getBrnAlphaStatus(): ", this.m_billFS.getBrnAlphaStatus());
        if (this.m_hasOffsetColorTex) {
            if (this.m_useRawUVEnabled) {
                fragCodeHead += "#define VOX_USE_RAW_UV 1\n";
            }
        }
        if (this.m_clipEnabled) {
            fragCodeHead += "#define VOX_USE_CLIP 1\n";
            if(this.clipMixEnabled) {
                fragCodeHead += "#define VOX_USE_CLIP_MIX 1\n";
            }
        }
        // for test...................end

        fragCodeHead +=
            `
#define VOX_DIFFUSE_MAP u_sampler0
uniform sampler2D u_sampler0;
`;
        let fragCode0: string = "";
        if (this.m_hasOffsetColorTex) {
            fragCode0 =
                `
#define VOX_OFFSET_COLOR_MAP u_sampler1
uniform sampler2D u_sampler1;
`;
        }
        let fragCode1: string = "";
        if (this.m_hasOffsetColorTex && this.m_useRawUVEnabled) {
            fragCode1 =
                `
in vec4 v_uv;
`;
        }
        fragCode1 +=
            `
in vec4 v_colorMult;
in vec4 v_colorOffset;
in vec4 v_texUV;
in vec4 v_factor;
layout(location = 0) out vec4 FragColor0;
void main()
{
    vec4 color = texture(VOX_DIFFUSE_MAP, v_texUV.xy);
`;
        if (this.m_clipEnabled && this.clipMixEnabled) {
            fragCode1 +=
                `
    color = mix(color,texture(VOX_DIFFUSE_MAP, v_texUV.zw),v_factor.x);
`;
        }
        let fragCode2: string = this.m_billFS.getOffsetColorCode(this.m_hasOffsetColorTex);
        let fadeCode: string = this.m_billFS.getBrnAndAlphaCode("v_factor");
        let endCode: string =
            `
    #ifdef VOX_PREMULTIPLY_ALPHA
        color.xyz *= color.a;
    #endif
    FragColor0 = color;
}
`;
        return fragCodeHead + fragCode0 + fragCode1 + fragCode2 + fadeCode + endCode;
    }
    getVertShaderCode(): string {
        return ""
    }
    getUniqueShaderName(): string {
        let ns: string = this.m_uniqueName + "_" + this.m_billFS.getBrnAlphaStatus();
        if (this.m_hasOffsetColorTex && this.m_clipEnabled) {
            ns += "ClipColorTex";
        }
        else if (this.m_clipEnabled) {
            ns += "Clip";
        }
        else if (this.clipMixEnabled) {
            ns += "Mix";
        }
        if (this.premultiplyAlpha) ns += "PreMAlpha";
        return ns;
    }
    toString(): string {
        return "[BillboardFlareShaderBuffer()]";
    }
}