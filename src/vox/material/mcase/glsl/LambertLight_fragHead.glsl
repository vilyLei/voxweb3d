#ifdef VOX_NORMAL_MAP
vec3 getNormalFromMap(sampler2D texSampler, vec2 texUV, vec3 nv)
{
    vec3 tangentNormal = VOX_Texture2D(texSampler, texUV).xyz * 2.0 - 1.0;

    vec3 Q1  = dFdx(worldPosition.xyz);
    vec3 Q2  = dFdy(worldPosition.xyz);
    vec2 st1 = dFdx(texUV);
    vec2 st2 = dFdy(texUV);

    vec3 N   = normalize(nv);
    vec3 T  = normalize(Q1*st2.t - Q2*st1.t);
    vec3 B  = normalize(cross(T, N));

    mat3 TBN = mat3(T, B, N);

    return TBN * tangentNormal;
}
vec3 getNormalFromMap(in sampler2D texSampler, in vec2 texUV)
{
    return VOX_Texture2D(texSampler, texUV).xyz * 2.0 - 1.0;
}
#endif
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
//const vec4 occParam = vec4(1.0,10.0,2.0,0.1);
vec2 parallaxOccRayMarchDepth(sampler2D texSampler, vec2 puvs, vec3 viewDir,vec4 occParam)
{
    float depthValue = 1.0 - VOX_Texture2D(texSampler, puvs).r;
    float numLayers = mix(occParam.x, occParam.y, max(dot(vec3(0.0, 0.0, 1.0), viewDir),0.0));
    float layerHeight = occParam.z / numLayers;
    vec2 tuv = (viewDir.xy * occParam.w) / numLayers;  
    float ph = 0.0;
    while(ph < depthValue)
    {
        puvs -= tuv;
        depthValue = 1.0 - VOX_Texture2D(texSampler, puvs).r;
        ph += layerHeight;
    }
    tuv += puvs;
    depthValue -= ph;
    ph = 1.0 - VOX_Texture2D(texSampler, tuv).r - ph + layerHeight;
    float weight = depthValue / (depthValue - ph);
    return tuv * weight + puvs * (1.0 - weight);
}
#endif
#ifdef VOX_LIGHTS_TOTAL
#if VOX_LIGHTS_TOTAL > 0

struct LambertLight {
	vec3 normal;
    // diffuse color
	vec3 diffuse;
    // specular color
	vec3 specular;
    // view direction
    vec3 viewDirec;
    // light direction
    vec3 direc;
    // light color
    vec3 color;
    // light distance attenuation factor
    vec4 param;
    float specularPower;
};
vec3 calcLambertLight(in LambertLight light) {

    float nDotL = max(dot(light.normal, light.direc), 0.0);
	vec3 baseColor = nDotL * light.diffuse * light.color;
	vec3 viewDir = normalize(light.direc + light.viewDirec);
	vec3 specularColor = light.specular * nDotL * pow(max(dot(light.normal, light.viewDirec), 0.0), light.specularPower);
    vec2 param = light.param.xy;
	return (baseColor * param.x + param.y * specularColor);
}

#endif
vec3 getLambertLightColor(in LambertLight light) {
    #if VOX_LIGHTS_TOTAL > 0
        vec3 destColor = vec3(0.0);
        // point light process
        #if VOX_POINT_LIGHTS_TOTAL > 0
            vec2 param = light.param.zw;
            for(int i = 0; i < VOX_POINT_LIGHTS_TOTAL; ++i)
            {
                // calculate per-light radiance
                light.direc = normalize(u_lightPositions[i].xyz - worldPosition.xyz);
                float distance = length(light.direc);
                float attenuation = 1.0 / (1.0 + param.x * distance + param.y * distance * distance);
                light.color = u_lightColors[i].xyz;
                destColor += calcLambertLight( light ) * attenuation;
            }
        #endif
        // parallel light process
        #if VOX_DIRECTION_LIGHTS_TOTAL > 0
            for(int i = VOX_POINT_LIGHTS_TOTAL; i < VOX_LIGHTS_TOTAL; ++i) 
            {
                light.direc = normalize(u_lightPositions[i].xyz);
                light.color = u_lightColors[i].xyz;
                destColor += calcLambertLight( light );
            }
        #endif
        return destColor;
    #else
        return srcColor.xyz;
    #endif
}
#endif