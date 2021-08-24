/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import ShaderCodeBuffer from "../../vox/material/ShaderCodeBuffer";
import MaterialBase from "../../vox/material/MaterialBase";
import ShaderUniformData from "../../vox/material/ShaderUniformData";

class HdrCylShaderBuffer extends ShaderCodeBuffer {
    constructor() {
        super();
    }
    private static s_instance: HdrCylShaderBuffer = new HdrCylShaderBuffer();
    private m_uniqueName: string = "";
    initialize(texEnabled: boolean): void {
        //console.log("HdrCylShaderBuffer::initialize()...");
        this.m_uniqueName = "HdrCylShd";
    }

    getFragShaderCode(): string {
        let fragCode: string =
`#version 300 es
precision mediump float;
const float PI = 3.14159265359;

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
vec4 LinearToRGBE( in vec4 value ) {
  float maxComponent = max( max( value.r, value.g ), value.b );
  float fExp = clamp( ceil( log2( maxComponent ) ), -128.0, 127.0 );
  return vec4( value.rgb / exp2( fExp ), ( fExp + 128.0 ) / 255.0 );
  // return vec4( value.brg, ( 3.0 + 128.0 ) / 256.0 );
}

// expects values in the range of [0,1]x[0,1], returns values in the [0,1] range.
// do not collapse into a single function per: http://byteblacksmith.com/improvements-to-the-canonical-one-liner-glsl-rand-for-opengl-es-2-0/
highp float rand( const in vec2 uv ) {
	const highp float a = 12.9898, b = 78.233, c = 43758.5453;
	highp float dt = dot( uv.xy, vec2( a,b ) ), sn = mod( dt, PI );
	return fract(sin(sn) * c);
}
// based on https://www.shadertoy.com/view/MslGR8
vec3 dithering( vec3 color ) {
    //Calculate grid position
    float grid_position = rand( gl_FragCoord.xy );

    //Shift the individual colors differently, thus making it even harder to see the dithering pattern
    vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );

    //modify shift acording to grid position.
    dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );

    //shift the color by dither_shift
    return color + dither_shift_RGB;
}
uniform sampler2D u_sampler0;

in vec3 v_nv;
in vec3 v_param;
in vec3 v_wVtxPos;
in vec3 v_wViewPos;
layout(location = 0) out vec4 FragColor0;
vec2 calcUV() {
    vec3 nor = normalize(v_nv);
	vec3 viewDir = -1.0 * normalize(v_wViewPos - v_wVtxPos);
	vec3 refl = reflect(viewDir,nor);
	float u = 1.0 - ((atan(refl.x,refl.z) / PI + 1.0) * 0.5);
	float v = acos(refl.y) / PI;
	return vec2(u, v);
}
void main() {

    vec2 uv = calcUV();
    //  vec4 color4 = texture(u_sampler0, uv);
    //  FragColor0 = color4;
    vec4 color4 = texture(u_sampler0, uv);
    color4 = RGBEToLinear(color4);
    color4.rgb = toneMapping(color4.rgb);
    color4 = LinearTosRGB(color4);
    color4.rgb = dithering( color4.rgb );
    FragColor0 = vec4(color4.rgb,1.0) * u_color;
}
`;
        return fragCode;
    }
    getVtxShaderCode(): string {
        let vtxCode: string =
`#version 300 es
precision mediump float;
layout(location = 0) in vec3 a_vs;
layout(location = 1) in vec3 a_nvs;
uniform mat4 u_objMat;
uniform mat4 u_viewMat;
uniform mat4 u_projMat;
out vec3 v_nv;
out vec3 v_param;
out vec3 v_wVtxPos;
out vec3 v_wViewPos;
void main(){
    vec4 viewWorldPos = inverse(u_viewMat) * vec4(0.0,0.0,0.0,1.0);
    vec4 wpos = u_objMat * vec4(a_vs, 1.0);
    vec4 viewPos = u_viewMat * wpos;
    gl_Position = u_projMat * viewPos;
    v_nv = a_nvs;
    v_param = vec3(length(normalize(wpos.xyz - viewWorldPos.xyz)));
    v_wVtxPos = wpos.xyz;
    v_wViewPos = viewWorldPos.xyz;
}
`;
        return vtxCode;
    }
    getUniqueShaderName(): string {
        //console.log("H ########################### this.m_uniqueName: "+this.m_uniqueName);
        return this.m_uniqueName;
    }
    toString(): string {
        return "[HdrCylShaderBuffer()]";
    }

    static GetInstance(): HdrCylShaderBuffer {
        return HdrCylShaderBuffer.s_instance;
    }
}

export default class HdrCylMaterial extends MaterialBase {
    constructor() {
        super();
    }

    getCodeBuf(): ShaderCodeBuffer {
        return HdrCylShaderBuffer.GetInstance();
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