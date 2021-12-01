
const vec3 vec3One = vec3(1.0);
// ----------------------------------------------------------------------------

// handy value clamping to 0 - 1 range
#define saturate(a) clamp( a, 0.0, 1.0 )

//Convert color to linear space
#define VOX_GAMMA 2.2
const vec3 vec3Gamma = vec3(VOX_GAMMA);
const vec3 vec3ReciprocalGamma = vec3(1.0 / VOX_GAMMA);

vec3 gammaToLinear(vec3 color) {
    #ifdef VOX_GAMMA_CORRECTION
	    return pow(color, vec3Gamma);
    #else
        return color;
    #endif
}
vec3 linearToGamma(vec3 color) { 
    #ifdef VOX_GAMMA_CORRECTION
	    return pow(color, vec3ReciprocalGamma); 
    #else
        return color;
    #endif
}
vec4 gammaToLinear(vec4 color) {
    #ifdef VOX_GAMMA_CORRECTION
        return vec4(pow(color.rgb, vec3Gamma), color.a);
    #else
        return color;
    #endif
}

vec4 linearToGamma(vec4 color) {
    #ifdef VOX_GAMMA_CORRECTION
        return vec4(pow(color.rgb, vec3ReciprocalGamma), color.a);
    #else
        return color;
    #endif
}

vec3 approximationSRGBToLinear(vec3 srgbColor) {
    return pow(srgbColor, vec3Gamma);
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

// Trowbridge-Reitz(Generalized-Trowbridge-Reitz，GTR)

float DistributionGTR1(float NdotH, float roughness) {
    if (roughness >= 1.0) return 1.0/PI;
    float a2 = roughness * roughness;
    float t = 1.0 + (a2 - 1.0)*NdotH*NdotH;
    return (a2 - 1.0) / (PI * log(a2) *t);
}
float distributionGTR2(float NdotH, float roughness) {
    float a2 = roughness * roughness;
    float t = 1.0 + (a2 - 1.0) * NdotH * NdotH;
    return a2 / (PI * t * t);
}

float distributionGGX(vec3 N, vec3 H, float roughness) {
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
float geometrySmith(vec3 N, vec3 V, vec3 L, float roughness) {
    float NdotV = max(dot(N, V), 0.0);
    float dotNL = max(dot(N, L), 0.0); 
    float ggx2 = geometrySchlickGGX(NdotV, roughness);
    float ggx1 = geometrySchlickGGX(dotNL, roughness);

    return ggx1 * ggx2;
}
// ----------------------------------------------------------------------------
// @param cosTheta is clamp(dot(H, V), 0.0, 1.0)
vec3 fresnelSchlick(float cosTheta, vec3 F0) {
    return F0 + (1.0 - F0) * pow(max(1.0 - cosTheta, 0.0), 5.0);
}
vec3 fresnelSchlick2(vec3 specularColor, vec3 L, vec3 H) {
   return specularColor + (1.0 - specularColor) * pow(1.0 - saturate(dot(L, H)), 5.0);
}
//fresnelSchlick2(specularColor, L, H) * ((SpecularPower + 2) / 8 ) * pow(saturate(dot(N, H)), SpecularPower) * dotNL;

#define  OneOnLN2_x6 8.656171// == 1/ln(2) * 6 (6 is SpecularPower of 5 + 1)
// dot: dot(N,V) or dot(H,V)
vec3 fresnelSchlick3(vec3 specularColor, float dot, float glossiness) {
	return specularColor + (max(vec3(glossiness), specularColor) - specularColor) * exp2(-OneOnLN2_x6 * dot); 
}
vec3 fresnelSchlickWithRoughness(vec3 specularColor, vec3 L, vec3 N, float gloss) {
   return specularColor + (max(vec3(gloss), specularColor) - specularColor) * pow(1.0 - saturate(dot(L, N)), 5.0);
}

//float ambientOcclusion = ( texture2D( aoMap, vUv2 ).r - 1.0 ) * aoMapIntensity + 1.0;
//float dotNV = saturate( dot( normal, viewDir ) );
//specular *= computeSpecularOcclusion( dotNV, ambientOcclusion, specularRoughness );
// ref: https://seblagarde.files.wordpress.com/2015/07/course_notes_moving_frostbite_to_pbr_v32.pdf
float computeSpecularOcclusion( const in float dotNV, const in float ambientOcclusion, const in float roughness ) {

	return saturate( pow( dotNV + ambientOcclusion, exp2( - 16.0 * roughness - 1.0 ) ) - 1.0 + ambientOcclusion );

}

vec3 acesToneMapping(vec3 color, float adapted_lum) {
	const float A = 2.51;
	const float B = 0.03;
	const float C = 2.43;
	const float D = 0.59;
	const float E = 0.14;

	color *= adapted_lum;
	return (color * (A * color + B)) / (color * (C * color + D) + E);
}

//color = color / (color + vec3One);
vec3 reinhard(vec3 v) {
    return v / (vec3One + v);
}
vec3 reinhard_extended(vec3 v, float max_white) {
    vec3 numerator = v * (1.0 + (v / vec3(max_white * max_white)));
    return numerator / (1.0 + v);
}
float luminance(vec3 v) {
    return dot(v, vec3(0.2126, 0.7152, 0.0722));
}

vec3 change_luminance(vec3 c_in, float l_out) {
    float l_in = luminance(c_in);
    return c_in * (l_out / l_in);
}
vec3 reinhard_extended_luminance(vec3 v, float max_white_l) {
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
vec3 getWorldEnvDir(vec3 worldNormal,vec3 worldInvE)
{
	vec3 worldR = reflect(worldInvE, worldNormal);
    worldR.zy *= vec2(-1.0);
    return worldR;
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
	return (vec3One - specularColor) * fresnel + specularColor;
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
#ifdef VOX_PARALLAX_MAP
mat3 getBTNMat3(in vec2 texUV, in vec3 pos, in vec3 nv)
{
    vec3 Q1  = dFdx(pos);
    vec3 Q2  = dFdy(pos);
    vec2 st1 = dFdx(texUV);
    vec2 st2 = dFdy(texUV);

    vec3 N  = normalize(nv);
    vec3 T  = normalize(Q1*st2.t - Q2*st1.t);    
    vec3 B  = -normalize(cross(N, T));
    return mat3(T, B, N);
}
//example: const vec4 occParam = vec4(1.0,10.0,2.0,0.1);
vec2 parallaxOccRayMarchDepth(sampler2D texSampler, vec2 puvs, vec3 viewDir,vec4 occParam)
{
    float depthValue = 1.0 - VOX_Texture2D(texSampler, puvs).r;
    float numLayers = mix(occParam.x, occParam.y, max(dot(vec3(0.0, 0.0, 1.0), viewDir),0.0));
    float layerHeight = occParam.z / numLayers;
    vec2 tuv = (viewDir.xy * occParam.w) / numLayers;  
    float ph = 0.0;
    #ifndef VOX_GLSL_ES2
        while(ph < depthValue)
        {
            puvs -= tuv;
            depthValue = 1.0 - VOX_Texture2D(texSampler, puvs).r;
            ph += layerHeight;
        }
    #else
        for(int i = 0; i < 10; i++) {
            if(ph < depthValue)
            {
                puvs -= tuv;
                depthValue = 1.0 - VOX_Texture2D(texSampler, puvs).r;
                ph += layerHeight;
            }
            else {
                break;
            }
        }
    #endif
    tuv += puvs;
    depthValue -= ph;
    ph = 1.0 - VOX_Texture2D(texSampler, tuv).r - ph + layerHeight;
    float weight = depthValue / (depthValue - ph);
    //return puvs * (1.0 - weight) + tuv * weight;
    return mix(puvs, tuv, weight);
}
#endif
#if VOX_LIGHTS_TOTAL > 0
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
    
    vec3 kD = (vec3One - F ) * rm;

    #ifdef VOX_WOOL
        float fdBurley = FD_Burley(roughness, rL.dotNV, dotNL, dotLH);
    #else
        float fdBurley = FD_Burley(roughness, rL.dotNV, dotNL, dotLH, rL.frontIntensity, rL.sideIntensity);
    #endif
    #ifdef VOX_SCATTER
        vec3 specularScatter = rL.scatterIntensity * fresnelSchlick3(rL.specularColor, dotLH, 1.0) * ((rL.specularPower + 2.0) * 0.125) * pow(dotNH, rL.specularPower);
    #else
        vec3 specularScatter = vec3One;
    #endif
    
    // add to outgoing radiance Lo
    inColor *= dotNL;

    #ifdef VOX_SPECULAR_BLEED
        kD *= specularScatter;
    #endif
    rL.diffuse += fdBurley * inColor * kD;
    rL.specular += specular * inColor * specularScatter;

}
#endif
const vec2 noise2 = vec2(12.9898,78.233);
const vec3 noise3 = vec3(12.9898,78.233,158.5453);
vec2 rand(vec2 seed) {

    float noiseX = (fract(sin(dot(seed, noise2)) * 43758.5453));
    float noiseY = (fract(sin(dot(seed, noise2 * 2.0)) * 43758.5453));
    return vec2(noiseX,noiseY);
}
vec3 rand(vec3 seed) {
    float scale = 1.0;
    float scale2 = 43758.54;
    float noiseX = (fract(sin(scale * dot(seed, noise3)) * scale2));
    float noiseY = (fract(sin(scale * dot(seed, noise3 * 2.0)) * scale2));
    float noiseZ = (fract(sin(scale * dot(seed, noise3 * 3.0)) * scale2));
    return vec3(noiseX, noiseY, noiseZ);
}
#ifdef VOX_NORMAL_MAP
vec3 getNormalFromMap(sampler2D texSampler, vec2 texUV, vec3 wpos, vec3 nv)
{
    vec3 tangentNormal = VOX_Texture2D(texSampler, texUV).xyz * 2.0 - 1.0;

    vec3 Q1  = dFdx(wpos);
    vec3 Q2  = dFdy(wpos);
    vec2 st1 = dFdx(texUV);
    vec2 st2 = dFdy(texUV);

    vec3 N   = normalize(nv);
    vec3 T  = normalize(Q1*st2.t - Q2*st1.t);    
    vec3 B  = -normalize(cross(N, T));
    mat3 TBN = mat3(T, B, N);

    return TBN * tangentNormal;
}
vec3 getNormalFromMap(in sampler2D texSampler, in vec2 texUV)
{
    return VOX_Texture2D(texSampler, texUV).xyz * 2.0 - 1.0;
}
#endif

#ifdef VOX_HDR_BRN

const vec4 hdrBrnDecodeVec4 = vec4(255.0, 2.55, 0.0255, 0.000255);
float rgbaToHdrBrn(in vec4 color)
{
    return dot(hdrBrnDecodeVec4, color);
}
#endif

#ifdef VOX_VTX_FLAT_NORMAL

vec3 getVtxFlatNormal(const in vec3 pos)
{
    return normalize(cross(dFdx(pos), dFdy(pos)));
}
#endif