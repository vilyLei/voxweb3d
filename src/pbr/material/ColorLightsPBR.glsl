/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

uniform samplerCube u_sampler0;

uniform mat4 u_viewMat;

out vec4 FragColor;

in vec3 v_worldPos;
in vec3 v_worldNormal;
in vec3 v_camPos;

// material parameters
uniform vec4 u_albedo;
uniform vec4 u_params[4];
uniform vec4 u_F0;

// point and parallel lights
#if VOX_LIGHTS_TOTAL > 0
    uniform vec4 u_lightPositions[VOX_LIGHTS_TOTAL];
    uniform vec4 u_lightColors[VOX_LIGHTS_TOTAL];
#endif

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
float distributionGTR2(float NdotH, float roughness)
{
    float a2 = roughness * roughness;
    float t = 1.0 + (a2 - 1.0) * NdotH * NdotH;
    return a2 / (PI * t * t);
}

float distributionGGX(vec3 N, vec3 H, float roughness)
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


float geometryImplicit(float NdotV, float dotNL) {
    return dotNL * NdotV;
}

// ----------------------------------------------------------------------------
float geometrySchlickGGX(float NdotV, float roughness)
{
    float r = (roughness + 1.0);
    float k = (r*r) / 8.0;

    float nom   = NdotV;
    float denom = NdotV * (1.0 - k) + k;

    return nom / denom;
}
// ----------------------------------------------------------------------------
float geometrySmith(vec3 N, vec3 V, vec3 L, float roughness)
{
    float NdotV = max(dot(N, V), 0.0);
    float dotNL = max(dot(N, L), 0.0); 
    float ggx2 = geometrySchlickGGX(NdotV, roughness);
    float ggx1 = geometrySchlickGGX(dotNL, roughness);

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
vec3 acesToneMapping(vec3 color, float adapted_lum)
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
vec3 tonemapReinhard(vec3 color, float exposure) {
  vec3 c = color * exposure;
  return c / (1.0 + c);
}
vec3 reinhardToneMapping( vec3 color, float toneMappingExposure ) {

	color *= toneMappingExposure;
	return saturate( color / ( vec3( 1.0 ) + color ) );

}
//Convert color to linear space
#define VOX_GAMMA 2.2
vec3 gammaToLinear(vec3 color) 
{
    #ifdef VOX_GAMMA_CORRECTION
	    return pow(color, vec3(VOX_GAMMA));
    #else
        return color;
    #endif
}
vec3 linearToGamma(vec3 color) 
{ 
    #ifdef VOX_GAMMA_CORRECTION
	    return pow(color, vec3(1.0 / VOX_GAMMA)); 
    #else
        return color;
    #endif
}
vec4 gammaToLinear(vec4 color) {
    #ifdef VOX_GAMMA_CORRECTION
        return vec4(pow(color.rgb, vec3(VOX_GAMMA)), color.a);
    #else
        return color;
    #endif
}

vec4 linearToGamma(vec4 color) {
    #ifdef VOX_GAMMA_CORRECTION
        return vec4(pow(color.rgb, vec3(1.0 / VOX_GAMMA)), color.a);
    #else
        return color;
    #endif
}
// expects values in the range of [0,1]x[0,1], returns values in the [0,1] range.
// do not collapse into a single function per: http://byteblacksmith.com/improvements-to-the-canonical-one-liner-glsl-rand-for-opengl-es-2-0/
highp float randUV( const in vec2 uv ) {
	const highp float a = 12.9898, b = 78.233, c = 43758.5453;
	highp float dt = dot( uv.xy, vec2( a,b ) ), sn = mod( dt, PI );
	return fract(sin(sn) * c);
}
// based on https://www.shadertoy.com/view/MslGR8
vec3 dithering( vec3 color ) {
    //Calculate grid position
    float grid_position = randUV( gl_FragCoord.xy );

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
vec3 rotateY(vec3 dir, float radian)
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
	return rotateY(worldR, rotateAngle);
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
vec3 fixSeams(vec3 vec, float mipmapIndex, float cubeTexsize) {
    float scale = 1.0 - exp2(mipmapIndex) / cubeTexsize;
    float M = max(max(abs(vec.x), abs(vec.y)), abs(vec.z));
    if (abs(vec.x) != M) vec.x *= scale;
    if (abs(vec.y) != M) vec.y *= scale;
    if (abs(vec.z) != M) vec.z *= scale;
    return vec;
}

vec3 fixSeams(vec3 vec, float cubeTexsize ) {
    float scale = 1.0 - 1.0 / cubeTexsize;
    float M = max(max(abs(vec.x), abs(vec.y)), abs(vec.z));
    if (abs(vec.x) != M) vec.x *= scale;
    if (abs(vec.y) != M) vec.y *= scale;
    if (abs(vec.z) != M) vec.z *= scale;
    return vec;
}
#ifdef VOX_WOOL
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
		float k = clamp(-10.15 * x5 + 20.189 * x4 - 12.811 * x3 + 4.0585 * x2 - 0.2931 * invNoV, 0.0, 1.0);
		float sideFactorIntensity = mix(frontScale, sideScale, k);
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
struct RadianceLight {
	vec3 diffuse;
	vec3 specular;
    vec3 scatterIntensity;
    vec3 F0;
    vec3 N;
    vec3 V;
    vec3 L;
    vec3 specularColor;

    float dotNV;
    float frontIntensity;
    float sideIntensity;
    float specularPower;
};
void calcPBRLight(float roughness, vec3 rm, in vec3 inColor, inout RadianceLight rL) {
    // rm is remainder metallic: vec3(1.0 - metallic)

    vec3 H = normalize(rL.V + rL.L);

    // scale light by dotNL
    float dotNL = max(dot(rL.N, rL.L), 0.0);
    float dotLH = max(dot(rL.L, H), 0.0);
    float dotNH = max(dot(rL.N, H), 0.0);

    // Cook-Torrance BRDF
    float NDF = distributionGGX(rL.N, H, roughness);
    float G   = geometrySmith(rL.N, rL.V, rL.L, roughness);
    //vec3 F    = fresnelSchlick(clamp(dot(H, rL.V), 0.0, 1.0), rL.F0);
    //vec3 F    = fresnelSchlick3(rL.F0,clamp(dot(H, V), 0.0, 1.0), roughness);
    vec3 F    = fresnelSchlick3(rL.F0, rL.dotNV, roughness);
    
    vec3 nominator    = NDF * G * F;
    float denominator = 4.0 * rL.dotNV * dotNL;
    vec3 specular = nominator / max(denominator, 0.001); // prevent divide by zero for NdotV=0.0 or dotNL=0.0
    
    vec3 kD = (vec3(1.0) - F ) * rm;

    #ifdef VOX_WOOL
        float fdBurley = FD_Burley(roughness, rL.dotNV, dotNL, dotLH);
    #else
        float fdBurley = FD_Burley(roughness, rL.dotNV, dotNL, dotLH, rL.frontIntensity, rL.sideIntensity);
    #endif
    #ifdef VOX_SCATTER
        vec3 specularScatter = rL.scatterIntensity * fresnelSchlick3(rL.specularColor, dotLH, 1.0) * ((rL.specularPower + 2.0) * 0.125) * pow(dotNH, rL.specularPower);
    #else
        vec3 specularScatter = vec3(1.0);
    #endif
    
    // add to outgoing radiance Lo
    inColor *= dotNL;

    #ifdef VOX_SPECULAR_BLEED
        rL.diffuse += fdBurley * inColor * kD * specularScatter;
    #else
        rL.diffuse += fdBurley * inColor * kD;
    #endif

    rL.specular += specular * inColor * specularScatter;

}

const vec2 noise2 = vec2(12.9898,78.233);
const vec3 noise3 = vec3(12.9898,78.233,158.5453);
vec2 rand(vec2 seed,float intensity) {

  float noiseX = (fract(sin(dot(seed, noise2)) * 43758.5453));
  float noiseY = (fract(sin(dot(seed, noise2 * 2.0)) * 43758.5453));
  return vec2(noiseX,noiseY) * intensity;
}
vec3 rand(vec3 seed, float intensity) {
  float noiseX = (fract(sin(dot(seed, noise3)) * 43758.5453));
  float noiseY = (fract(sin(dot(seed, noise3 * 2.0)) * 43758.5453));
  float noiseZ = (fract(sin(dot(seed, noise3 * 3.0)) * 43758.5453));
  return vec3(noiseX, noiseY, noiseZ) * intensity;
}
// ----------------------------------------------------------------------------
void main()
{
    vec3 color = vec3(0.0);

    float metallic = u_params[0].x;
    float roughness = u_params[0].y;
    float ao = u_params[0].z;

    float colorGlossiness = 1.0 - roughness;
    float reflectionIntensity = u_params[1].y;
    float glossinessSquare = colorGlossiness * colorGlossiness;
    float specularPower = exp2(8.0 * glossinessSquare + 1.0);

    vec3 N = normalize(v_worldNormal);
    vec3 V = normalize(v_camPos.xyz - v_worldPos);
    float dotNV = clamp(dot(N, V), 0.0, 1.0);
    vec3 albedo = u_albedo.xyz;
    // calculate reflectance at normal incidence; if dia-electric (like plastic) use F0 
    // of 0.04 and if it's a metal, use the albedo color as F0 (metallic workflow)    
    vec3 F0 = u_F0.xyz + vec3(0.04);
    F0 = mix(F0, albedo.xyz, metallic);

    vec3 diffuseColor = albedo.xyz;
    albedo = gammaToLinear(albedo);

    vec3 specularColor = vec3(mix(0.025 * reflectionIntensity, 0.078 * reflectionIntensity, colorGlossiness));
    #ifdef VOX_METALLIC_CORRECTION
        //if(metallic > 0.0){
            vec3 specularColorMetal = mix(F0, albedo, metallic);
            float ratio = clamp(metallic, 0.0, 1.0);
            specularColor = mix(specularColor, specularColorMetal, ratio);
        //}
    #endif
    albedo = mix(albedo, F0, metallic);
    
    specularColor *= u_params[3].xyz;

    #ifdef VOX_ENV_MAP
        float mipLv = floor(u_params[3].w);
        mipLv -= glossinessSquare * mipLv;
        mipLv += 100.0 * fract(u_params[3].w);
	    vec3 envDir = -getWorldEnvDir(0.0/*envLightRotateAngle*/, N, -V); // env map upside down
	    envDir.x = -envDir.x;
        vec3 specularEnvColor3 = VOX_TextureCubeLod(u_sampler0, envDir, mipLv).xyz;
        //specularEnvColor3 = reinhardToneMapping(specularEnvColor3,1.0);
        specularEnvColor3 = gammaToLinear(specularEnvColor3);
        specularColor = fresnelSchlick3(specularColor, dotNV, 0.25 * reflectionIntensity) * specularEnvColor3;
    #endif

    float frontIntensity = u_params[1].z;
    float sideIntensity = u_params[1].w;

    // reflectance equation
    
    RadianceLight rL;

    vec3 diffuse = albedo.xyz * RECIPROCAL_PI;
    vec3 rm = vec3(1.0 - metallic); // remainder metallic

    rL.scatterIntensity = u_params[2].www;
    rL.F0 = F0;
    rL.specularColor = specularColor;
    rL.dotNV = dotNV;
    rL.N = N;
    rL.V = V;
    rL.specularPower = specularPower;
    rL.frontIntensity = frontIntensity;
    rL.sideIntensity = sideIntensity;

    // point light progress
    #if VOX_POINT_LIGHTS_TOTAL > 0
        for(int i = 0; i < VOX_POINT_LIGHTS_TOTAL; ++i) 
        {
            // calculate per-light radiance
            vec3 L = (u_lightPositions[i].xyz - v_worldPos);
            float distance = length(L);
            float attenuation = 1.0 / (1.0 + 0.001 * distance + 0.0001 * distance * distance);
            vec3 inColor = u_lightColors[i].xyz * attenuation;
            rL.L = normalize(L);
            calcPBRLight(roughness, rm, inColor, rL);
        }
    #endif
    // parallel light progress
    #if VOX_PARALLEL_LIGHTS_TOTAL > 0
        for(int i = VOX_POINT_LIGHTS_TOTAL; i < VOX_LIGHTS_TOTAL; ++i) 
        {
            rL.L = normalize(u_lightPositions[i].xyz);
            calcPBRLight(roughness, rm, u_lightColors[i].xyz, rL);
        }
    #endif
    
    #ifdef VOX_ABSORB
        vec3 Lo = rL.diffuse * diffuse + (rL.specular + specularColor) * reflectionIntensity;
    #else
        vec3 Lo = rL.diffuse * diffuse + (rL.specular + specularColor);
    #endif
    
    // ambient lighting (note that the next IBL tutorial will replace 
    // this ambient lighting with environment lighting).
    vec3 ambient = u_params[2].xyz * albedo.xyz * ao;

	#ifdef VOX_WOOL
		sideIntensity = getColorFactorIntensity(dotNV, frontIntensity, sideIntensity);
		ambient *= sideIntensity;
		Lo *= sideIntensity * frontIntensity;
	#endif
    color = ambient + Lo;

    //color = dithering(color);
    // HDR tonemapping
    #ifdef VOX_TONE_MAPPING
        //color = reinhard( color );
        color = tonemapReinhard( color, u_params[1].x );
        //color = reinhard_extended( color, u_params[1].x );
        //color = reinhard_extended_luminance( color, u_params[1].x );
        //color = acesToneMapping(color, u_params[1].x);
    #endif

    // gamma correct
    color = linearToGamma(color);

    FragColor = vec4(color, 1.0);
}