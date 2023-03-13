vec3 getNormalFromMap(sampler2D nor_sampler, const in vec3 wpos, const in vec2 uv, const in vec3 nv)
{
    vec3 tangentNormal = VOX_Texture2D(nor_sampler, uv).xyz * 2.0 - 1.0;

    vec3 Q1  = dFdx(wpos);
    vec3 Q2  = dFdy(wpos);
    vec2 st1 = dFdx(uv);
    vec2 st2 = dFdy(uv);

    vec3 N   = normalize(nv);
    vec3 T  = normalize(Q1*st2.t - Q2*st1.t);
    vec3 B  = -normalize(cross(N, T));
    mat3 TBN = mat3(T, B, N);

    return normalize(TBN * tangentNormal);
}

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
vec3 getWorldEnvDir2(float rotateAngle, vec3 worldNormal, vec3 worldInvE)
{
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