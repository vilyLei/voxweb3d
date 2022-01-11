void calcDiffuse(inout vec4 color, vec2 uv) {
    #ifdef VOX_DIFFUSE_MAP
        color *= VOX_Texture2D(VOX_DIFFUSE_MAP, uv);
    #endif
    #ifdef VOX_DIFFUSE_MAP2
        #ifdef VOX_USE_DIFFUSEMAP2_MAT
            vec4 srcColor = VOX_Texture2D( VOX_DIFFUSE_MAP2, v_map2Pos.xy / v_map2Pos.ww );
        #else
            vec4 srcColor = VOX_Texture2D( VOX_DIFFUSE_MAP2, uv );
        #endif
        color = color * vec4(1.0 - srcColor.w) + srcColor * srcColor.wwww;
        
    #endif
}
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
#ifdef VOX_LIGHTS_TOTAL
#if VOX_LIGHTS_TOTAL > 0

struct LambertLight {
    // surface normal
	vec3 normal;
    // diffuse color
	vec3 diffuse;
    // specular color
	vec3 specular;
    // view direction
    vec3 viewDirec;
    // light direction per pixel
    vec3 direc;
    // light color
    vec3 color;
    vec4 param;
    float specularPower;
};
vec3 calcLambertLight(in LambertLight light) {

    float nDotL = max(dot(light.normal, light.direc), 0.0);
	vec3 baseColor = nDotL * light.diffuse * light.color;
	vec3 viewDir = normalize(light.direc + light.viewDirec);
	vec3 specularColor = light.color * light.specular * nDotL * pow(max(dot(light.normal, viewDir), 0.0), light.specularPower);
    vec2 param = light.param.xy;
	return (baseColor * param.x + param.y * specularColor);
}

#endif
vec3 getLambertLightColor(in LambertLight light) {
    #if VOX_LIGHTS_TOTAL > 0
        vec4 color4;
        vec4 param4;
        vec3 destColor = vec3(0.0);
        // point light process
        #if VOX_POINT_LIGHTS_TOTAL > 0
            for(int i = 0; i < VOX_POINT_LIGHTS_TOTAL; ++i)
            {
                param4 = u_lightPositions[i];
                color4 = u_lightColors[i];
                light.color = color4.xyz;
                // calculate per-light radiance
                light.direc = (param4.xyz - worldPosition.xyz);
                float distance = length(light.direc);
                float attenuation = 1.0 / (1.0 + param4.w * distance + color4.w * distance * distance);
                light.direc = normalize(light.direc);
                light.color *= attenuation;
                destColor += calcLambertLight( light );// * attenuation;
            }
        #endif
        // direction light process
        #if VOX_DIRECTION_LIGHTS_TOTAL > 0
            for(int i = VOX_POINT_LIGHTS_TOTAL; i < (VOX_POINT_LIGHTS_TOTAL + VOX_DIRECTION_LIGHTS_TOTAL); ++i) 
            {
                light.direc = normalize(-u_lightPositions[i].xyz);
                light.color = u_lightColors[i].xyz;
                destColor += calcLambertLight( light );
            }
        #endif
        // spot light process
        #if VOX_SPOT_LIGHTS_TOTAL > 0
            
            for(int i = (VOX_POINT_LIGHTS_TOTAL + VOX_DIRECTION_LIGHTS_TOTAL); i < VOX_LIGHTS_TOTAL; ++i) 
            {
                param4 = u_lightPositions[i];
                color4 = u_lightColors[i];
                //light.color = color4.xyz;
                light.direc = param4.xyz - worldPosition.xyz;

                float factor = length( light.direc );
                float attenuation = 1.0 / (1.0 + param4.w * factor + color4.w * factor * factor);
                light.color = color4.xyz * attenuation;
                
                param4 = u_lightPositions[i + VOX_SPOT_LIGHTS_TOTAL];
                param4.xyz = normalize( param4.xyz );
                light.direc = normalize( light.direc );
                float ft = abs(param4.w) + 0.001;
                factor = (1.0 - max(dot(-param4.xyz, light.direc), 0.0));
                factor = min(1.0 - (factor / ft), 1.0);
                //factor = max(factor, 0.0001);
                
                destColor += calcLambertLight( light ) * factor;
            }
        #endif
        return destColor;
    #else
        return srcColor.xyz;
    #endif
}
#endif