/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2023 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import ShaderCodeBuffer from "../../../vox/material/ShaderCodeBuffer";
import ShaderUniformData from "../../../vox/material/ShaderUniformData";
import MaterialBase from "../../../vox/material/MaterialBase";

class FloatCubeMapShaderBuffer extends ShaderCodeBuffer {
    constructor() {
        super();
    }
    private static s_instance: FloatCubeMapShaderBuffer = null;
    private m_uniqueName: string = "";
    initialize(texEnabled: boolean): void {
        //console.log("FloatCubeMapShaderBuffer::initialize()...");
        this.m_uniqueName = "FloatCubeMapShd";
    }
    getFragShaderCode(): string {
        let fragCode: string =
`#version 300 es
precision mediump float;

uniform samplerCube u_sampler0;
uniform mat4 u_viewMat;
uniform vec4 u_color;
uniform vec4 u_param;
uniform vec4 u_camPos;

in vec3 v_nvs;
in vec3 v_worldPos;
in vec3 v_camPos;

// handy value clamping to 0 - 1 range
#define saturate(a) clamp( a, 0.0, 1.0 )

vec3 ReinhardToneMapping( vec3 color ){
    float toneMappingExposure = u_param.x;
	color *= toneMappingExposure;
	return saturate( color /( vec3( 1.0 ) + color ) );
    
    //  float max_white = 0.2;
    //  vec3 numerator = color * (vec3(1.0f) + (color / vec3(max_white * max_white)));
    //  return numerator / (vec3(1.0f) + color);
}
vec3 toneMapping( vec3 color ){ return ReinhardToneMapping( color ); }

vec4 LinearTosRGB( in vec4 value ){
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}

vec3 inverseTransformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( vec4( dir, 0.0 ) * matrix ).xyz );
}
vec3 rotate(vec3 dir, float radian)
{
	vec3 result;
	result.x = cos(radian) * dir.x - sin(radian) * dir.z;
	result.y = dir.y;
	result.z = sin(radian) * dir.x + cos(radian) * dir.z;
	return result;
}
vec3 getEnvDir(float rotateAngle, vec3 normal)
{
	vec3 worldNormal = inverseTransformDirection( normal, u_viewMat );
	vec3 worldInvE = normalize(v_worldPos.xyz - v_camPos.xyz);
	vec3 worldR = reflect(worldInvE, normalize(worldNormal));
	worldR.z = -worldR.z;
	worldR.y = -worldR.y;
	worldR = rotate(worldR, rotateAngle);
	float preX = worldR.x;
	float preZ = worldR.z;
	return worldR;
}
layout(location = 0) out vec4 FragColor;
void main()
{
    vec3 envDir = -getEnvDir(0.0/*envLightRotateAngle*/, v_nvs); // env map upside down
	envDir.x = -envDir.x;
    //vec3 color3 = texture(u_sampler0, v_nvs).xyz;
    vec3 color3 = textureLod(u_sampler0, v_nvs, 4.0).xyz;
    //vec3 color3 = texture(u_sampler0, envDir).xyz;
    //vec3 color3 = textureLod(u_sampler0, envDir, 0.0).xyz;
    
    color3 = toneMapping( color3 );
    vec4 color4 = vec4(color3, 1.0);
    color4 = LinearTosRGB( color4 );
    color4.xyz *= u_color.xyz;
    FragColor = color4;// + 0.001 * vec4(abs(v_nvs),1.0);
    //  if(abs(length(v_camPos.xyz) - length(u_camPos.xyz)) < 0.01) {
    //      FragColor.xyzw = vec4(1.0,0.0,0.0,1.0);
    //  }
}
`;
        return fragCode;
    }
    getVertShaderCode(): string {
        let vtxCode: string =
`#version 300 es
precision mediump float;
layout(location = 0) in vec3 a_vs;
layout(location = 1) in vec2 a_uvs;
layout(location = 2) in vec3 a_nvs;
uniform mat4 u_objMat;
uniform mat4 u_viewMat;
uniform mat4 u_projMat;
out vec3 v_nvs;
out vec3 v_worldPos;
out vec3 v_camPos;
void main()
{
    vec4 wpos = u_objMat * vec4(a_vs,1.0);
    gl_Position = u_projMat * u_viewMat * wpos;
    v_camPos = (inverse(u_viewMat) * vec4(0.0,0.0,0.0,1.0)).xyz;
    v_nvs = a_nvs;
    v_worldPos = wpos.xyz;
}
`;
        return vtxCode;
    }
    getUniqueShaderName(): string {
        //console.log("H ########################### this.m_uniqueName: "+this.m_uniqueName);
        return this.m_uniqueName;
    }
    toString(): string {
        return "[FloatCubeMapShaderBuffer()]";
    }

    static GetInstance(): FloatCubeMapShaderBuffer {
        if (FloatCubeMapShaderBuffer.s_instance != null) {
            return FloatCubeMapShaderBuffer.s_instance;
        }
        FloatCubeMapShaderBuffer.s_instance = new FloatCubeMapShaderBuffer();
        return FloatCubeMapShaderBuffer.s_instance;
    }
}

export default class FloatCubeMapMaterial extends MaterialBase {
    constructor() {
        super();
    }

    getCodeBuf(): ShaderCodeBuffer {
        return FloatCubeMapShaderBuffer.GetInstance();
    }
    private m_colorArray: Float32Array = new Float32Array([1.0, 1.0, 1.0, 1.0]);
    private m_param: Float32Array = new Float32Array([1.0, 0.0, 0.0, 0.0]);
    private m_camPos: Float32Array = new Float32Array([1.0, 0.0, 0.0, 0.0]);
    setExposure(exposure: number): void {
        this.m_param[0] = exposure;
    }
    setcamPos(px: number, py: number, pz: number): void {
        this.m_camPos[0] = px;
        this.m_camPos[1] = py;
        this.m_camPos[2] = pz;
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
        oum.uniformNameList = ["u_color", "u_param", "u_camPos"];
        oum.dataList = [this.m_colorArray, this.m_param, this.m_camPos];
        return oum;
    }
}