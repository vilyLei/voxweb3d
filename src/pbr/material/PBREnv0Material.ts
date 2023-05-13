/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2023 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import RendererDevice from "../../vox/render/RendererDevice";
import ShaderCodeBuffer from "../../vox/material/ShaderCodeBuffer";
import ShaderUniformData from "../../vox/material/ShaderUniformData";
import MaterialBase from "../../vox/material/MaterialBase";
import Vector3D from "../../vox/math/Vector3D";

class PBREnv0ShaderBuffer extends ShaderCodeBuffer {
    constructor() {
        super();
    }
    private static s_instance: PBREnv0ShaderBuffer = new PBREnv0ShaderBuffer();
    private m_uniqueName: string = "";
    velvetEnabled:boolean = true;
    toneMappingEnabled:boolean = true;
    envMapEnabled:boolean = true;
    scatterEnabled:boolean = true;
    specularBleedEnabled:boolean = true;
    initialize(texEnabled: boolean): void {
        //console.log("PBREnv0ShaderBuffer::initialize()...");
        this.m_uniqueName = "PBREnv0Shd";
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
        if(this.velvetEnabled) fragCode += "\n#define VOX_VELVET";
        if(this.toneMappingEnabled) fragCode += "\n#define VOX_TONE_MAPPING";
        if(this.envMapEnabled) fragCode += "\n#define VOX_ENV_MAP";
        if(this.scatterEnabled) fragCode += "\n#define VOX_SCATTER";
        if(this.specularBleedEnabled) fragCode += "\n#define VOX_SPECULAR_BLEED";
        
        fragCode +=
`
precision highp float;
//uniform sampler2D u_sampler0;
uniform samplerCube u_sampler0;

uniform mat4 u_viewMat;

out vec4 FragColor;
in vec2 v_texUV;
in vec3 v_worldPos;
in vec3 v_normal;
in vec3 v_camPos;

// material parameters
uniform vec4 u_albedo;
uniform vec4 u_params[4]; //[metallic,roughness,ao, F0 offset]
uniform vec4 u_F0; //[metallic,roughness,ao, F0 offset]

// lights
uniform vec4 u_lightPositions[4];
uniform vec4 u_lightColors[4];

//uniform vec4 u_camPos;

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


float GeometryImplicit(float NdotV, float dotNL) {
    return dotNL * NdotV;
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
    float dotNL = max(dot(N, L), 0.0); 
    float ggx2 = GeometrySchlickGGX(NdotV, roughness);
    float ggx1 = GeometrySchlickGGX(dotNL, roughness);

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

vec3 getWorldEnvDir(float rotateAngle, vec3 worldNormal,vec3 worldInvE)
{
	vec3 worldR = reflect(worldInvE, worldNormal);
    worldR.zy *= vec2(-1.0);
	return rotate(worldR, rotateAngle);
}

float FD_Schlick(float VoH, float f0, float f90) 
{
	return f0 + (f90 - f0) * pow(1.0 - VoH, 5.0);
}
vec3 FD_Schlick(const in vec3 specularColor, const in float dotLH) {

	// Original approximation by Christophe Schlick '94
	//float fresnel = pow( 1.0 - dotLH, 5.0 );
	// Optimized variant (presented by Epic at SIGGRAPH '13)
	// https://cdn2.unrealengine.com/Resources/files/2013SiggraphPresentationsNotes-26915738.pdf

	float fresnel = exp2((-5.55473 * dotLH - 6.98316) * dotLH);
	return (vec3(1.0) - specularColor) * fresnel + specularColor;
}

#ifdef VOX_VELVET
	float FD_Burley(float linearRoughness, float NoV, float NoL, float LoH)
	{
		float f90 = 0.5 + 2.0 * linearRoughness * LoH * LoH;
		float lightScatter = FD_Schlick(NoL, 1.0, f90);
		float viewScatter = FD_Schlick(NoV, 1.0, f90);
		return lightScatter * viewScatter;
	}
	float getColorFactorIntensity(float NoV, float frontScale, float sideScale)
	{
		float invNoV = 1.0 - NoV;
		float x2 = invNoV * invNoV;
		float x3 = x2 * invNoV;
		float x4 = x3 * invNoV;
		float x5 = x4 * invNoV;
		float y = clamp(-10.15 * x5 + 20.189 * x4 - 12.811 * x3 + 4.0585 * x2 - 0.2931 * invNoV, 0.0, 1.0);
		float sideFactorIntensity = mix(frontScale, sideScale, y);
		return sideFactorIntensity;
	}
#else
	float FD_Burley(float linearRoughness, float NoV, float NoL, float LoH, float frontScale, float sideScale)
	{
		float f90 = 0.5 + 2.0 * linearRoughness * LoH * LoH;
		float lightScatter = FD_Schlick(NoL, 1.0, f90);
		float viewScatter = FD_Schlick(NoV, frontScale, sideScale * f90);
		return lightScatter * viewScatter;
	}
#endif
// ----------------------------------------------------------------------------
void main()
{
    vec3 color = vec3(0.0);

    float metallic = u_params[0].x;
    float roughness = u_params[0].y;
    float ao = u_params[0].z;

    float colorGlossiness = u_params[1].x;//0.15;
    float reflectionIntensity = u_params[1].y;//0.1;
    float glossinessSquare = colorGlossiness * colorGlossiness;
    float specularPower = exp2(16.0 * glossinessSquare + 1.0);


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
    albedo = gammaCorrectionInv(albedo);

    specularColor = vec3(mix(0.025 * reflectionIntensity, 0.078 * reflectionIntensity, colorGlossiness));
    if(metallic > 0.0){
        vec3 specularColorMetal = mix(vec3(0.04), albedo, metallic);
        float ratio = clamp(8.0 * metallic, 0.0, 1.0);
        specularColor = mix(specularColor, specularColorMetal, ratio);
    }
    albedo = mix(albedo, vec3(0.0), metallic);
    
    
    specularColor *= u_params[3].xyz;
    #ifdef VOX_ENV_MAP
        float mipLv = 8.0 - glossinessSquare * 8.0;
	    vec3 envDir = -getWorldEnvDir(0.0/*envLightRotateAngle*/, N, -V); // env map upside down
	    envDir.x = -envDir.x;
        vec3 specularEnvColor3 = VOX_TextureCubeLod(u_sampler0, envDir, mipLv).xyz;
        specularColor = fresnelSchlick3(specularColor, dotNV, 0.25 * reflectionIntensity) * specularEnvColor3;
    #endif

    float frontColorScale = u_params[1].z;//0.5;
    float sideColorScale = u_params[1].w;//1.0;
    // reflectance equation
    vec3 Lo = vec3(0.0);
    vec3 scatterIntensity = u_params[2].www;
    vec3 diffuse = albedo.xyz / PI;
    for(int i = 0; i < 4; ++i) 
    {
        // calculate per-light radiance
        vec3 L = normalize(u_lightPositions[i].xyz - v_worldPos);
        vec3 H = normalize(V + L);

        // scale light by dotNL
        float dotNL = max(dot(N, L), 0.0);
        float dotLH = max(dot(L, H), 0.0);
        float dotNH = max(dot(N, H), 0.0);

        float distance = length(u_lightPositions[i].xyz - v_worldPos);
        //float attenuation = 1.0 / (1.0 + (distance * distance));
        
        float attenuation = 1.0 / (1.0 + 0.001 * distance + 0.0001 * distance * distance);
        vec3 radiance = u_lightColors[i].xyz * attenuation;


        // Cook-Torrance BRDF
        float NDF = DistributionGGX(N, H, roughness);
        float G   = GeometrySmith(N, V, L, roughness);
        //vec3 F    = fresnelSchlick(clamp(dot(H, V), 0.0, 1.0), F0);
        //vec3 F    = fresnelSchlick3(F0,clamp(dot(H, V), 0.0, 1.0), roughness);
        vec3 F    = fresnelSchlick3(F0, dotNV, roughness);
        
        vec3 nominator    = NDF * G * F;
        float denominator = 4.0 * dotNV * dotNL;
        vec3 specular = nominator / max(denominator, 0.001); // prevent divide by zero for NdotV=0.0 or dotNL=0.0
        
        vec3 kD = vec3(1.0) - F;
        kD *= vec3(1.0 - metallic);

        #ifdef VOX_VELVET
            float fdBurley = FD_Burley(1.0 - colorGlossiness, dotNV, dotNL, dotLH);
        #else
            float fdBurley = FD_Burley(1.0 - colorGlossiness, dotNV, dotNL, dotLH, frontColorScale, sideColorScale);
        #endif
        #ifdef VOX_SCATTER
            vec3 specularScatter = scatterIntensity * fresnelSchlick3(specularColor, dotLH, 1.0) * ((specularPower + 2.0) * 0.125) * pow(dotNH, specularPower);
        #else
            vec3 specularScatter = vec3(1.0);
        #endif
        // add to outgoing radiance Lo
        radiance *= dotNL;

        #ifdef VOX_SPECULAR_BLEED
            vec3 d_color = fdBurley * radiance * kD * diffuse * specularScatter;
        #else
            vec3 d_color = fdBurley * radiance * kD * diffuse;
        #endif
        vec3 s_color = specular * radiance * specularScatter;
        Lo += (d_color + s_color);  // note that we already multiplied the BRDF by the Fresnel (kS) so we won't multiply by kS again
        
    }
    Lo += specularColor;

    // ambient lighting (note that the next IBL tutorial will replace 
    // this ambient lighting with environment lighting).
    vec3 ambient = u_params[2].xyz * albedo.xyz * ao;

	#ifdef VOX_VELVET
		float sideIntensity = getColorFactorIntensity(dotNV, frontColorScale, sideColorScale);
		ambient *= sideIntensity;
		Lo *= sideIntensity * frontColorScale;
	#endif
    color = ambient + Lo;

    //color = dithering(color);
    // HDR tonemapping
    #ifdef VOX_TONE_MAPPING
        color = reinhard( color );
    #endif
    //color = reinhard_extended( color, 3.0 );
    //color = reinhard_extended_luminance( color, 5.0 );
    //color = ACESToneMapping(color, 1.0);

    // gamma correct
    color = gammaCorrection(color);

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
        let ns: string = this.m_uniqueName;
        if(this.velvetEnabled) ns += "_velvet";
        if(this.toneMappingEnabled) ns += "_toneMapping";
        if(this.envMapEnabled) ns += "_envMap";
        if(this.scatterEnabled) ns += "_scatter";
        if(this.specularBleedEnabled) ns += "_specBleed";
        return ns;
    }
    toString(): string {
        return "[PBREnv0ShaderBuffer()]";
    }

    static GetInstance(): PBREnv0ShaderBuffer {
        return PBREnv0ShaderBuffer.s_instance;
    }
}

export default class PBREnv0Material extends MaterialBase {
    constructor() {
        super();
    }

    velvetEnabled:boolean = false;    
    toneMappingEnabled:boolean = true;
    envMapEnabled:boolean = true;
    scatterEnabled:boolean = true;
    specularBleedEnabled:boolean = true;
    
    getCodeBuf(): ShaderCodeBuffer {
        let buf: PBREnv0ShaderBuffer = PBREnv0ShaderBuffer.GetInstance();
        buf.velvetEnabled = this.velvetEnabled;
        buf.toneMappingEnabled = this.toneMappingEnabled;
        buf.envMapEnabled = this.envMapEnabled;
        buf.scatterEnabled = this.scatterEnabled;
        buf.specularBleedEnabled = this.specularBleedEnabled;
        return buf;
    }

    private m_albedo: Float32Array = new Float32Array([0.0, 0.5, 0.0, 0.0]);
    private m_params: Float32Array = new Float32Array([
        0.0, 0.0, 1.0, 0.0,     // [metallic,roughness,ao, F0 offset]
        0.1,                   // colorGlossiness
        0.1,                   // reflectionIntensity
        0.5,                   // frontColorScale
        0.5,                   // sideColorScale

        0.1,0.1,0.1,           // ambient factor x,y,z
        1.0,                   // scatterIntensity
        1.0,1.0,1.0,           // env map specular color factor x,y,z
        1.0                    // undefined
        ]);
    private m_F0: Float32Array = new Float32Array([0.0, 0.0, 0.0, 0.0]);
    private m_camPos: Float32Array = new Float32Array([500.0, 500.0, 500.0, 1.0]);
    private m_lightPositions: Float32Array = new Float32Array(4 * 4);
    private m_lightColors: Float32Array = new Float32Array(4 * 4);
    setScatterIntensity(value: number): void {

        this.m_params[11] = Math.min(Math.max(value, 0.01), 512.0);
    }
    setColorGlossiness(value: number): void {

        this.m_params[4] = Math.min(Math.max(value, 0.001), 10.0);
    }
    setReflectionIntensity(value: number): void {

        this.m_params[5] = Math.min(Math.max(value, 0.001), 10.0);
    }
    
    setColorScale(frontScale: number, sideScale: number): void {

        this.m_params[6] = Math.min(Math.max(frontScale, 0.001), 10.0);
        this.m_params[7] = Math.min(Math.max(sideScale, 0.001), 10.0);
    }
    setEnvSpecularColorFactor(fx:number, fy: number, fz:number):void {
        this.m_params[12] = fx;
        this.m_params[13] = fy;
        this.m_params[14] = fz;
    }
    setAmbientFactor(fx:number, fy: number, fz:number):void {
        this.m_params[8] = fx;
        this.m_params[9] = fy;
        this.m_params[10] = fz;
    }
    setMetallic(metallic: number): void {

        this.m_params[0] = Math.min(Math.max(metallic, 0.001), 1.0);
    }
    setRoughness(roughness: number): void {
        this.m_params[1] = Math.min(Math.max(roughness, 0.005), 1.0);
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
    setAlbedoColor(pr: number, pg: number, pb: number): void {
        this.m_albedo[0] = pr;
        this.m_albedo[1] = pg;
        this.m_albedo[2] = pb;
    }
    setLightColorAt(i: number, pr: number, pg: number, pb: number): void {

        i *= 4;
        this.m_lightColors[i] = pr;
        this.m_lightColors[i + 1] = pg;
        this.m_lightColors[i + 2] = pb;
    }
    setCamPos(pos: Vector3D): void {

        this.m_camPos[0] = pos.x;
        this.m_camPos[1] = pos.y;
        this.m_camPos[2] = pos.z;
        //console.log(pos);
    }
    createSelfUniformData(): ShaderUniformData {

        //  console.log("this.m_albedo: ",this.m_albedo);
        //console.log("this.m_params: ",this.m_params);
        //  console.log("this.m_camPos: ",this.m_camPos);
        let oum: ShaderUniformData = new ShaderUniformData();
        oum.uniformNameList = ["u_albedo", "u_params", "u_lightPositions", "u_lightColors", "u_camPos", "u_F0"];
        oum.dataList = [this.m_albedo, this.m_params, this.m_lightPositions, this.m_lightColors, this.m_camPos,this.m_F0];
        return oum;
    }
}