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
	vec3 lightColor = light.specular * nDotL * pow(max(dot(light.normal, light.viewDirec), 0.0), light.specularPower);
    vec2 param = light.param.xy;
	return (baseColor * param.x + param.y * lightColor);
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
                light.color = u_lightColors[i].xyz * attenuation;
                destColor += calcLambertLight( light );
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