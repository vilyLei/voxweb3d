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
`;
        if(RendererDevice.IsWebGL1()) {

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
        fragCode +=
`
precision highp float;
//uniform sampler2D u_sampler0;
uniform samplerCube u_sampler0;

//uniform mat4 u_viewMat;

out vec4 FragColor;
in vec2 v_texUV;
in vec3 v_worldPos;
in vec3 v_normal;
in vec3 v_camPos;

// material parameters
uniform vec4 u_albedo;
uniform vec4 u_params; //[metallic,roughness,ao, F0 offset]
uniform vec4 u_F0; //[metallic,roughness,ao, F0 offset]

// lights
uniform vec4 u_lightPositions[4];
uniform vec4 u_lightColors[4];

uniform vec4 u_camPos;

#define PI 3.141592653589793
#define PI2 6.283185307179586
#define PI_HALF 1.5707963267948966
#define RECIPROCAL_PI 0.3183098861837907
#define RECIPROCAL_PI2 0.15915494309189535
#define EPSILON 1e-6
// ----------------------------------------------------------------------------
vec3 approximationSRGBToLinear(vec3 srgbColor) {
    return pow(srgbColor, vec3(2.2));
}
vec3 approximationLinearToSRCB(vec3 linearColor) {
    return pow(linearColor, vec3(1.0/2.2));
}
vec3 accurateSRGBToLinear(vec3 srgbColor) {
    vec3 linearRGBLo = srgbColor / 12.92;
    vec3 linearRGBHi = pow((srgbColor + vec3(0.055)) / vec3(1.055), vec3(2.4));
    //vec3 linearRGB = (srgbColor <= 0.04045) ? linearRGBLo : linearRGBHi;
    vec3 linearRGB = all(lessThanEqual(srgbColor, vec3(0.04045))) ? linearRGBLo : linearRGBHi;

    return linearRGB;
}
vec3 accurateLinearToSRGB(vec3 linearColor) {
    vec3 srgbLo = linearColor * 12.92;
    vec3 srgbHi = (pow(abs(linearColor), vec3(1.0 / 2.4)) * 1.055) - 0.055;
    vec3 srgb = all(lessThanEqual(linearColor, vec3(0.0031308))) ? srgbLo : srgbHi;

    return srgb;
}

// handy value clamping to 0 - 1 range
#define saturate(a) clamp( a, 0.0, 1.0 )

// Trowbridge-Reitz(Generalized-Trowbridge-Reitz，GTR)

float DistributionGTR1(float NdotH, float roughness)
{
    if (roughness >= 1.0) return 1.0/PI;
    float a2 = roughness * roughness;
    float t = 1.0 + (a2 - 1.0)*NdotH*NdotH;
    return (a2 - 1.0) / (PI * log(a2) *t);
}
float DistributionGTR2(float NdotH, float roughness)
{
    float a2 = roughness * roughness;
    float t = 1.0 + (a2 - 1.0) * NdotH * NdotH;
    return a2 / (PI * t * t);
}

float DistributionGGX(vec3 N, vec3 H, float roughness)
{
    float a = roughness*roughness;
    float a2 = a*a;
    float NdotH = max(dot(N, H), 0.0);
    float NdotH2 = NdotH*NdotH;

    float nom   = a2;
    float denom = (NdotH2 * (a2 - 1.0) + 1.0);
    denom = PI * denom * denom;

    return nom / max(denom, 0.0000001); // prevent divide by zero for roughness=0.0 and NdotH=1.0
}


float GeometryImplicit(float NdotV, float NdotL) {
    return NdotL * NdotV;
}

// ----------------------------------------------------------------------------
float GeometrySchlickGGX(float NdotV, float roughness)
{
    float r = (roughness + 1.0);
    float k = (r*r) / 8.0;

    float nom   = NdotV;
    float denom = NdotV * (1.0 - k) + k;

    return nom / denom;
}
// ----------------------------------------------------------------------------
float GeometrySmith(vec3 N, vec3 V, vec3 L, float roughness)
{
    float NdotV = max(dot(N, V), 0.0);
    float NdotL = max(dot(N, L), 0.0); 
    float ggx2 = GeometrySchlickGGX(NdotV, roughness);
    float ggx1 = GeometrySchlickGGX(NdotL, roughness);

    return ggx1 * ggx2;
}
// ----------------------------------------------------------------------------
// @param cosTheta is clamp(dot(H, V), 0.0, 1.0)
vec3 fresnelSchlick(float cosTheta, vec3 F0)
{
    return F0 + (1.0 - F0) * pow(max(1.0 - cosTheta, 0.0), 5.0);
}
vec3 fresnelSchlick2(vec3 specularColor, vec3 L, vec3 H)
{
   return specularColor + (1.0 - specularColor) * pow(1.0 - saturate(dot(L, H)), 5.0);
}
//fresnelSchlick2(specularColor, L, H) * ((SpecularPower + 2) / 8 ) * pow(saturate(dot(N, H)), SpecularPower) * dotNL;

#define  OneOnLN2_x6 8.656171// == 1/ln(2) * 6 (6 is SpecularPower of 5 + 1)
// dot: dot(N,V) or dot(H,V)
vec3 fresnelSchlick3(vec3 specularColor, float dot, float glossiness)
{
	return specularColor + (max(vec3(glossiness), specularColor) - specularColor) * exp2(-OneOnLN2_x6 * dot); 
}
vec3 fresnelSchlickWithRoughness(vec3 specularColor, vec3 L, vec3 N, float gloss)
{
   return specularColor + (max(vec3(gloss), specularColor) - specularColor) * pow(1.0 - saturate(dot(L, N)), 5.0);
}
vec3 ACESToneMapping(vec3 color, float adapted_lum)
{
	const float A = 2.51;
	const float B = 0.03;
	const float C = 2.43;
	const float D = 0.59;
	const float E = 0.14;

	color *= adapted_lum;
	return (color * (A * color + B)) / (color * (C * color + D) + E);
}

//color = color / (color + vec3(1.0));
vec3 reinhard(vec3 v)
{
    return v / (vec3(1.0) + v);
}
vec3 reinhard_extended(vec3 v, float max_white)
{
    vec3 numerator = v * (1.0 + (v / vec3(max_white * max_white)));
    return numerator / (1.0 + v);
}
float luminance(vec3 v)
{
    return dot(v, vec3(0.2126, 0.7152, 0.0722));
}

vec3 change_luminance(vec3 c_in, float l_out)
{
    float l_in = luminance(c_in);
    return c_in * (l_out / l_in);
}
vec3 reinhard_extended_luminance(vec3 v, float max_white_l)
{
    float l_old = luminance(v);
    float numerator = l_old * (1.0 + (l_old / (max_white_l * max_white_l)));
    float l_new = numerator / (1.0 + l_old);
    return change_luminance(v, l_new);
}
vec3 ReinhardToneMapping( vec3 color, float toneMappingExposure ) {

	color *= toneMappingExposure;
	return saturate( color / ( vec3( 1.0 ) + color ) );

}
vec4 LinearTosRGB( in vec4 value ){
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}
vec3 LinearTosRGB( in vec3 value ){
	return vec3( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ));
}
#define VOX_GAMMA 2.2
vec3 gammaCorrectionInv(vec3 color) 
{
	return pow(color, vec3(VOX_GAMMA));
}
vec3 gammaCorrection(vec3 color) 
{ 
	return pow(color, vec3(1.0 / VOX_GAMMA)); 
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
//  vec3 getEnvDir(float rotateAngle, vec3 normal)
//  {
//  	vec3 worldNormal = inverseTransformDirection( normal, u_viewMat );
//  	vec3 worldInvE = normalize(v_worldPos.xyz - v_camPos.xyz);
//  	vec3 worldR = reflect(worldInvE, normalize(worldNormal));
//  	worldR.z = -worldR.z;
//  	worldR.y = -worldR.y;
//  	worldR = rotate(worldR, rotateAngle);
//  	float preX = worldR.x;
//  	float preZ = worldR.z;
//  	return worldR;
//  }
vec3 getWorldEnvDir2(float rotateAngle, vec3 worldNormal, vec3 worldInvE)
{
	//vec3 worldInvE = normalize(v_worldPos.xyz - v_camPos.xyz);
	vec3 worldR = reflect(worldInvE, worldNormal);
	worldR.z = -worldR.z;
	worldR.y = -worldR.y;
	return rotate(worldR, rotateAngle);
}
vec3 getWorldEnvDir(float rotateAngle, vec3 worldNormal,vec3 worldInvE)
{
	vec3 worldR = reflect(worldInvE, worldNormal);
    worldR.zy *= vec2(-1.0);
	return rotate(worldR, rotateAngle);
}
// ----------------------------------------------------------------------------
void main()
{
    vec3 color = vec3(0.0);

    float metallic = u_params.x;
    float roughness = u_params.y;
    float ao = u_params.z;

    float matGlossiness = 1.0 - roughness;//0.15;
    float matReflectionIntensity = 0.5;
    float glossinessSquare = matGlossiness * matGlossiness;

    vec3 N = normalize(v_normal);
    vec3 V = normalize(v_camPos.xyz - v_worldPos);
    float dotNV = clamp(dot(N, V), 0.0, 1.0);
    vec3 albedo = u_albedo.xyz;
    // calculate reflectance at normal incidence; if dia-electric (like plastic) use F0 
    // of 0.04 and if it's a metal, use the albedo color as F0 (metallic workflow)    
    vec3 F0 = vec3(0.04) + u_F0.xyz;
    F0 = mix(F0, albedo.xyz, metallic);// * vec3(0.0,0.9,0.0);

    vec3 diffuseColor = albedo.xyz;//vec3(0.925);
    vec3 specularColor = vec3(1.0);

    specularColor = gammaCorrectionInv(specularColor);

    specularColor = vec3(mix(0.025 * matReflectionIntensity, 0.078 * matReflectionIntensity, matGlossiness));
    specularColor = mix(specularColor, diffuseColor, matGlossiness);
    
    vec3 baseSpecularColor = specularColor;
    float mipLv = 7.0 - glossinessSquare * 7.0;
    
	vec3 envDir = -getWorldEnvDir(0.0/*envLightRotateAngle*/, N, -V); // env map upside down
	envDir.x = -envDir.x;
    // specularEnvColor = vec3(1.0)/*envMapIntensity*/ * textureCubeLodEXT(sEnvMap, dir, mipLv).xyz;
    // vec3 sEnvColor3 = texture(u_sampler0, N).xyz;
    // vec3 sEnvColor3 = textureLod(u_sampler0, N, mipLv).xyz;
    // vec3 sEnvColor3 = textureCubeLodEXT(u_sampler0, N, mipLv).xyz;
    // vec3 specularEnvColor3 = VOX_TextureCubeLod(u_sampler0, N, mipLv).xyz;
    
    vec3 specularEnvColor3 = VOX_TextureCubeLod(u_sampler0, envDir, mipLv).xyz;
    specularEnvColor3 = pow(specularEnvColor3, vec3(3.0));
    specularEnvColor3 = (1.0 - roughness) * LinearTosRGB(specularEnvColor3);
    specularColor += fresnelSchlick3(specularColor, dotNV, 0.25 * matReflectionIntensity) * specularEnvColor3;

    // reflectance equation
    vec3 Lo = vec3(0.0);
    //specularColor = vec3(metallic) * specularColor;
    for(int i = 0; i < 4; ++i) 
    {
        // calculate per-light radiance
        vec3 L = normalize(u_lightPositions[i].xyz - v_worldPos);
        vec3 H = normalize(V + L);
        float distance = length(u_lightPositions[i].xyz - v_worldPos);
        //float attenuation = 1.0 / (1.0 + (distance * distance));
        
        float attenuation = 1.0 / (1.0 + 0.001 * distance + 0.0003 * distance * distance);
        vec3 radiance = u_lightColors[i].xyz * attenuation;

        // Cook-Torrance BRDF
        float NDF = DistributionGGX(N, H, roughness);
        float G   = GeometrySmith(N, V, L, roughness);
        //vec3 F    = fresnelSchlick(clamp(dot(H, V), 0.0, 1.0), F0);
        vec3 F    = fresnelSchlick3(F0,clamp(dot(H, V), 0.0, 1.0), 0.9);
        //vec3 F    = fresnelSchlick3(F0,dotNV, 0.9);
        
        vec3 nominator    = NDF * G * F;
        float denominator = 4.0 * max(dot(N, V), 0.0) * max(dot(N, L), 0.0);
        vec3 specular = nominator / max(denominator, 0.001); // prevent divide by zero for NdotV=0.0 or NdotL=0.0
        
        // kS is equal to Fresnel
        vec3 kS = F;
        // for energy conservation, the diffuse and specular light can't
        // be above 1.0 (unless the surface emits light); to preserve this
        // relationship the diffuse component (kD) should equal 1.0 - kS.
        vec3 kD = vec3(1.0) - kS;
        // multiply kD by the inverse metalness such that only non-metals
        // have diffuse lighting, or a linear blend if partly metal (pure metals
        // have no diffuse light).
        kD *= 1.0 - metallic;

        // scale light by NdotL
        float NdotL = max(dot(N, L), 0.0);
        //specularColor = fresnelSchlick3(baseSpecularColor, clamp(dot(H, V), 0.0, 1.0), 0.25 * matReflectionIntensity) * specularEnvColor3;
        // add to outgoing radiance Lo
        Lo += (kD * albedo.xyz / PI + specularColor + specular) * radiance * NdotL;  // note that we already multiplied the BRDF by the Fresnel (kS) so we won't multiply by kS again
        
    }
    // ambient lighting (note that the next IBL tutorial will replace 
    // this ambient lighting with environment lighting).
    vec3 ambient = vec3(0.03) * albedo.xyz * ao;

    color = ambient + Lo;

    // HDR tonemapping
    color = reinhard( color );
    //color = reinhard_extended( color, 3.0 );
    //color = reinhard_extended_luminance( color, 5.0 );
    //color = ACESToneMapping(color, 1.0);
    //color = LinearTosRGB(color);
    // gamma correct
    color = gammaCorrection(color);

    //color = dithering(color);
    FragColor = vec4(color, 1.0);
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
layout(location = 2) in vec3 a_nvs;

uniform mat4 u_objMat;
uniform mat4 u_viewMat;
uniform mat4 u_projMat;

out vec2 v_texUV;
out vec3 v_worldPos;
out vec3 v_normal;
out vec3 v_camPos;

void main(){

    vec4 wPos = u_objMat * vec4(a_vs, 1.0);
    vec4 viewPos = u_viewMat * wPos;
    gl_Position = u_projMat * viewPos;

    v_worldPos = wPos.xyz;
    v_texUV = a_uvs;
    //v_normal = mat3(u_objMat) * a_nvs;
    v_normal = normalize(a_nvs * inverse(mat3(u_objMat)));
    v_camPos = (inverse(u_viewMat) * vec4(0.0,0.0,0.0, 1.0)).xyz;
}
`;
        return vtxCode;
    }
    getUniqueShaderName(): string {
        //console.log("H ########################### this.m_uniqueName: "+this.m_uniqueName);
        return this.m_uniqueName;
    }
    toString(): string {
        return "[PBREnvLightingShaderBuffer()]";
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
    private m_camPos: Float32Array = new Float32Array([500.0, 500.0, 500.0, 1.0]);
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
    setCamPos(pos: Vector3D): void {

        this.m_camPos[0] = pos.x;
        this.m_camPos[1] = pos.y;
        this.m_camPos[2] = pos.z;
    }
    createSelfUniformData(): ShaderUniformData {

        //  console.log("this.m_albedo: ",this.m_albedo);
        console.log("this.m_params: ",this.m_params);
        //  console.log("this.m_camPos: ",this.m_camPos);
        let oum: ShaderUniformData = new ShaderUniformData();
        oum.uniformNameList = ["u_albedo", "u_params", "u_lightPositions", "u_lightColors", "u_camPos", "u_F0"];
        oum.dataList = [this.m_albedo, this.m_params, this.m_lightPositions, this.u_lightColors, this.m_camPos,this.m_F0];
        return oum;
    }
}