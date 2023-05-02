/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2023 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import ShaderCodeBuffer from "../../vox/material/ShaderCodeBuffer";
import ShaderUniformData from "../../vox/material/ShaderUniformData";
import MaterialBase from "../../vox/material/MaterialBase";

class HDRRGBETexRenderShaderBuffer extends ShaderCodeBuffer {
    constructor() {
        super();
    }
    private static s_instance: HDRRGBETexRenderShaderBuffer = null;
    private m_uniqueName: string = "";
    initialize(texEnabled: boolean): void {
        //console.log("HDRRGBETexRenderShaderBuffer::initialize()...");
        this.m_uniqueName = "HDRRGBETexMaterialShd";
    }
    getFragShaderCode(): string {
        let fragCode: string =
            `#version 300 es
precision mediump float;
uniform sampler2D u_sampler0;
uniform vec4 u_color;
uniform vec4 u_param;

// handy value clamping to 0 - 1 range
#define saturate(a) clamp( a, 0.0, 1.0 )

vec3 reinhard_extended(vec3 v, float max_white)
{
    vec3 numerator = v * (vec3(1.0) + (v / vec3(max_white * max_white)));
    return numerator / (vec3(1.0) + v);
}
vec3 ReinhardToneMapping( vec3 color ){
    float toneMappingExposure = u_param.x;
	color *= toneMappingExposure;
	return saturate( color /( vec3( 1.0 ) + color ) );
    
    //  float max_white = 0.2;
    //  vec3 numerator = color * (vec3(1.0) + (color / vec3(max_white * max_white)));
    //  return numerator / (vec3(1.0) + color);
}
vec3 toneMapping( vec3 color ){ return ReinhardToneMapping( color ); }

vec4 LinearTosRGB( in vec4 value ){
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}
vec4 RGBEToLinear( in vec4 value ){
	return vec4( value.rgb * exp2( value.a * 255.0 - 128.0 ), 1.0 );
}
in vec2 v_uv;
layout(location = 0) out vec4 FragColor;
void main(){
    vec4 color4 = texture(u_sampler0, v_uv);
    color4 = RGBEToLinear(color4);
    color4.rgb = toneMapping(color4.rgb);
    color4 = LinearTosRGB(color4);
    FragColor = vec4(color4.rgb,1.0) * u_color;
}
`;
        return fragCode;
    }
    getVertShaderCode(): string {
        let vtxCode: string =
            `#version 300 es
precision highp float;
layout(location = 0) in vec3 a_vs;
layout(location = 1) in vec2 a_uvs;
uniform mat4 u_objMat;
uniform mat4 u_viewMat;
uniform mat4 u_projMat;
out vec2 v_uv;
void main(){
    v_uv = a_uvs;
    gl_Position = u_projMat * u_viewMat * u_objMat * vec4(a_vs.xyz,1.0);
}
`;
        return vtxCode;
    }
    getUniqueShaderName(): string {
        //console.log("H ########################### this.m_uniqueName: "+this.m_uniqueName);
        return this.m_uniqueName;
    }
    toString(): string {
        return "[HDRRGBETexRenderShaderBuffer()]";
    }

    static GetInstance(): HDRRGBETexRenderShaderBuffer {
        if (HDRRGBETexRenderShaderBuffer.s_instance != null) {
            return HDRRGBETexRenderShaderBuffer.s_instance;
        }
        HDRRGBETexRenderShaderBuffer.s_instance = new HDRRGBETexRenderShaderBuffer();
        return HDRRGBETexRenderShaderBuffer.s_instance;
    }
}
export default class HDRRGBETexMaterial extends MaterialBase {
    constructor() {
        super();
    }
    getCodeBuf(): ShaderCodeBuffer {
        return HDRRGBETexRenderShaderBuffer.GetInstance();
    }
    private m_colorArray: Float32Array = new Float32Array([1.0, 1.0, 1.0, 1.0]);
    private m_param: Float32Array = new Float32Array([1.0, 0.0, 0.0, 0.0]);
    setExposure(exposure: number): void {
        this.m_param[0] = exposure;
    }
    setRGB3f(pr: number, pg: number, pb: number): void {
        this.m_colorArray[0] = pr;
        this.m_colorArray[1] = pg;
        this.m_colorArray[2] = pb;
    }
    setRGBA4f(pr: number, pg: number, pb: number, pa: number): void {
        this.m_colorArray[0] = pr;
        this.m_colorArray[1] = pg;
        this.m_colorArray[2] = pb;
        this.m_colorArray[3] = pa;
    }
    createSelfUniformData(): ShaderUniformData {
        let oum: ShaderUniformData = new ShaderUniformData();
        oum.uniformNameList = ["u_color", "u_param"];
        oum.dataList = [this.m_colorArray, this.m_param];
        return oum;
    }
}