
void main()
{
    vec3 color = vec3(0.0);

    float metallic = u_params.x;
    float roughness = u_params.y;
    float ao = u_params.z;

    float matGlossiness = 1.0 - roughness;//0.15;
    float matReflectionIntensity = 0.5;
    float glossinessSquare = matGlossiness * matGlossiness;

    // vec3 N = normalize(v_normal);
    vec3 N;
    #ifdef VOX_NORMAL_MAP
        N = getNormalFromMap(VOX_NORMAL_MAP, v_worldPos, v_uv.xy, v_normal);
    #else
        N = normalize(v_normal);
    #endif
    #ifdef VOX_ROUGHNESS_MAP
        roughness *= VOX_Texture2D(VOX_ROUGHNESS_MAP, v_uv.xy).x;
    #endif
    #ifdef VOX_METALNESS_MAP
        metallic *= VOX_Texture2D(VOX_METALNESS_MAP, v_uv.xy).x;
    #endif
    #ifdef VOX_AO_MAP
        ao *= VOX_Texture2D(VOX_AO_MAP, v_uv.xy).x;
    #endif

    vec3 V = normalize(v_camPos.xyz - v_worldPos);
    float dotNV = clamp(dot(N, V), 0.0, 1.0);
    vec3 albedo = u_albedo.xyz;
    
    #ifdef VOX_DIFFUSE_MAP
        // albedo.xyz *= VOX_Texture2D(VOX_DIFFUSE_MAP, v_uv.xy).xyz;
        albedo.xyz = pow(VOX_Texture2D(VOX_DIFFUSE_MAP, v_uv.xy).xyz, vec3(2.2));
    #endif
    
    //
    // calculate reflectance at normal incidence; if dia-electric (like plastic) use F0 
    // of 0.04 and if it's a metal, use the albedo color as F0 (metallic workflow)    
    vec3 F0 = vec3(0.04) + u_F0.xyz;
    F0 = mix(F0, albedo.xyz, metallic);

    vec3 diffuseColor = albedo.xyz;
    vec3 specularColor = vec3(1.0);

    specularColor = gammaCorrectionInv(specularColor);

    specularColor = vec3(mix(0.025 * matReflectionIntensity, 0.078 * matReflectionIntensity, matGlossiness));
    specularColor = mix(specularColor, diffuseColor, matGlossiness);

    // FragColor0 = vec4(F0, 1.0);
    // return;
    
    vec3 baseSpecularColor = specularColor;
    float mipLv = 7.0 - glossinessSquare * 7.0;
    

    #ifdef VOX_ENV_MAP
	    vec3 envDir = -getWorldEnvDir(0.0, N, -V);
	    envDir.x = -envDir.x;
        vec3 specularEnvColor3 = VOX_TextureCubeLod(VOX_ENV_MAP, envDir, mipLv).xyz;
        specularEnvColor3 = pow(specularEnvColor3, vec3(3.0));
        specularEnvColor3 = (1.0 - roughness) * LinearTosRGB(specularEnvColor3);
        specularColor += fresnelSchlick3(specularColor, dotNV, 0.25 * matReflectionIntensity) * specularEnvColor3;
    #endif
    // reflectance equation
    vec3 Lo = vec3(0.0);
    
    for(int i = 0; i < 4; ++i) 
    {
        // calculate per-light radiance
        vec3 L = normalize(u_lightPositions[i].xyz - v_worldPos);
        vec3 H = normalize(V + L);
        float distance = length(u_lightPositions[i].xyz - v_worldPos);
        
        float attenuation = 1.0 / (1.0 + 0.001 * distance + 0.0003 * distance * distance);
        vec3 radiance = u_lightColors[i].xyz * attenuation;

        // Cook-Torrance BRDF
        float NDF = DistributionGGX(N, H, roughness);
        float G   = GeometrySmith(N, V, L, roughness);
        vec3 F    = fresnelSchlick3(F0,clamp(dot(H, V), 0.0, 1.0), 0.9);
        
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
    // gamma correct
    color = gammaCorrection(color);

    //color = dithering(color);
    FragColor0 = vec4(color, 1.0);
}