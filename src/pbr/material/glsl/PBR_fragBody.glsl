
// ----------------------------------------------------------------------------

    vec3 color = vec3(0.0);

    vec4 param4 = u_pbrParams[0];
    vec4 color4;
    float metallic = param4.x;
    float roughness = param4.y;
    float ao = param4.z;
    #ifdef VOX_USE_2D_MAP
    vec2 texUV = v_uv.xy;
    #else
    vec2 texUV = vec2(0.0);
    #endif
    
    float colorGlossiness = 1.0 - roughness;
    float reflectionIntensity = u_pbrParams[1].y;
    float glossinessSquare = colorGlossiness * colorGlossiness;
    float specularPower = exp2(8.0 * glossinessSquare + 1.0);

    worldPosition.xyz = v_worldPosition.xyz;
    vec3 V = normalize(u_cameraPosition.xyz - worldPosition.xyz);

    #ifdef VOX_VTX_FLAT_NORMAL
        worldNormal = getVtxFlatNormal(worldPosition.xyz);
    #else
        worldNormal = v_worldNormal;
    #endif
    
    vec3 N = worldNormal;
    #ifdef VOX_PARALLAX_MAP
        #ifdef VOX_NORMAL_MAP
            mat3 btnMat3 = getBTNMat3(v_uv, worldPosition.xyz, worldNormal.xyz);
            vec3 tbnViewDir = btnMat3 * V;
            
            //default value: vec4(1.0,10.0,2.0,0.1)
            param4 = u_fragLocalParams[ VOX_PARALLAX_PARAMS_INDEX ];
            texUV = parallaxOccRayMarchDepth(VOX_PARALLAX_MAP, v_uv, -tbnViewDir, param4);
            #ifdef VOX_NORMAL_MAP
                N = btnMat3 * normalize(getNormalFromMap(VOX_NORMAL_MAP, texUV));
            #endif
            N = normalize(mix(worldNormal, N, u_fragLocalParams[0].w));
        #endif
    #else
        #ifdef VOX_NORMAL_MAP
            //  N = normalize(getNormalFromMap(VOX_NORMAL_MAP, texUV, worldNormal.xyz));
            N = getNormalFromMap(VOX_NORMAL_MAP, texUV, worldPosition.xyz, worldNormal);
            N = normalize(mix(worldNormal, N, u_fragLocalParams[0].w));
        #endif
    #endif
    
    #ifdef VOX_AO_MAP
        ao = mix(1.0, VOX_Texture2D(VOX_AO_MAP, texUV).y, ao);
    #endif

    // #ifdef VOX_NORMAL_MAP
    //     N = getNormalFromMap(VOX_NORMAL_MAP, texUV, worldPosition.xyz, worldNormal);
    //     N = normalize(mix(worldNormal, N, u_fragLocalParams[0].w));
    // #endif

    #ifdef VOX_PIXEL_NORMAL_NOISE
        N = normalize(N + rand(N) * u_pbrParams[0].w);
    #else
        N = normalize(N);
    #endif

    float dotNV = clamp(dot(N, V), 0.0, 1.0);
    #ifdef VOX_DIFFUSE_MAP
    vec3 albedo = u_fragLocalParams[1].xyz * VOX_Texture2D(VOX_DIFFUSE_MAP, texUV).xyz;
    #else
    vec3 albedo = u_fragLocalParams[1].xyz;
    #endif
    
    // calculate reflectance at normal incidence; if dia-electric (like plastic) use F0 
    // of 0.04 and if it's a metal, use the albedo color as F0 (metallic workflow)    
    vec3 F0 = u_fragLocalParams[0].xyz + vec3(0.04);
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
    
    specularColor *= u_pbrParams[3].xyz;

    
    #ifdef VOX_ENV_MAP
        float mipLv = floor(100.0 * fract(u_pbrParams[3].w));
        mipLv -= glossinessSquare * mipLv;
        mipLv = max(mipLv + floor(u_pbrParams[3].w), 0.0);
	    vec3 envDir = -getWorldEnvDir(N, -V);
	    envDir.x = -envDir.x;
        #ifdef VOX_HDR_BRN
            vec3 specularEnvColor3 = vec3(rgbaToHdrBrn(VOX_TextureCubeLod(VOX_ENV_MAP, envDir, mipLv)));
        #else
            vec3 specularEnvColor3 = VOX_TextureCubeLod(VOX_ENV_MAP, envDir, mipLv).xyz;
        #endif
        
        specularEnvColor3 = gammaToLinear(specularEnvColor3);
        specularColor = fresnelSchlick3(specularColor, dotNV, 0.25 * reflectionIntensity) * specularEnvColor3;
    #endif

    float frontIntensity = u_pbrParams[1].z;
    float sideIntensity = u_pbrParams[1].w;

    // reflectance equation    
    RadianceLight rL;

    vec3 diffuse = albedo.xyz * RECIPROCAL_PI;
    vec3 rm = vec3(1.0 - metallic); // remainder metallic

    rL.scatterIntensity = u_pbrParams[2].www;
    rL.F0 = F0;
    rL.specularColor = specularColor;
    rL.dotNV = dotNV;
    rL.N = N;
    rL.V = V;
    rL.specularPower = specularPower;
    rL.frontIntensity = frontIntensity;
    rL.sideIntensity = sideIntensity;
    // point light process
    #if VOX_POINT_LIGHTS_TOTAL > 0
        for(int i = 0; i < VOX_POINT_LIGHTS_TOTAL; ++i) 
        {
            // calculate per-light radiance
            param4 = u_lightPositions[i];
            color4 = u_lightColors[i];
            rL.L = (param4.xyz - worldPosition.xyz);
            float factor = length(rL.L);
            factor = 1.0 / (1.0 + param4.w * factor + color4.w * factor * factor);
            rL.L = normalize(rL.L);
            calcPBRLight(roughness, rm, color4.xyz * factor, rL);
        }
    #endif
    // parallel light process
    #if VOX_DIRECTION_LIGHTS_TOTAL > 0
        for(int i = VOX_POINT_LIGHTS_TOTAL; i < VOX_LIGHTS_TOTAL; ++i) 
        {
            // calculate per-light radiance
            rL.L = normalize(-u_lightPositions[i].xyz);
            calcPBRLight(roughness, rm, u_lightColors[i].xyz, rL);
        }
    #endif
    // spot light process
    #if VOX_SPOT_LIGHTS_TOTAL > 0
        
        for(int i = (VOX_POINT_LIGHTS_TOTAL + VOX_DIRECTION_LIGHTS_TOTAL); i < VOX_LIGHTS_TOTAL; ++i) 
        {
            param4 = u_lightPositions[i];
            color4 = u_lightColors[i];
            rL.L = (param4.xyz - worldPosition.xyz);
            float factor = length(rL.L);
            float attenuation = 1.0 / (1.0 + param4.w * factor + color4.w * factor * factor);

            rL.L = normalize(rL.L);

            param4 = u_lightPositions[i + VOX_SPOT_LIGHTS_TOTAL];
            param4.xyz = normalize( param4.xyz );
            factor = max(1.0 - (clamp((1.0 - max(dot(-param4.xyz, rL.L), 0.0)), 0.0, param4.w) / param4.w), 0.0001);

            calcPBRLight(roughness, rm, color4.xyz * attenuation * factor, rL);
        }
    #endif
    
    #ifdef VOX_INDIRECT_ENV_MAP
        rL.L = vec3(0.0, -1.0, 0.0);
        float ifactor = clamp(abs(worldPosition.y - -210.0) / 300.0, 0.0,1.0);
        float lv = 1.0 + 6.0 * ifactor;
        #ifdef VOX_ENV_MAP
            color = VOX_TextureCubeLod(VOX_INDIRECT_ENV_MAP, envDir, lv).xyz;
            rL.specularColor = fresnelSchlick3(specularColor, dotNV, 0.25 * reflectionIntensity) * color;
            color = VOX_TextureCubeLod(VOX_INDIRECT_ENV_MAP, N, lv).xyz;
        #else
            color = VOX_TextureCubeLod(VOX_INDIRECT_ENV_MAP, N, lv).xyz;
            rL.specularColor = fresnelSchlick3(specularColor, dotNV, 0.25 * reflectionIntensity) * color;
        #endif
        calcPBRLight(roughness, rm, 2.0 * color, rL);
        ifactor = 1.0 - ifactor;
        float ifactor2 = max(dot(N, rL.L), 0.0);
        color *= ifactor2 * ifactor2 * (ifactor * ifactor) * ((1.0 - metallic) * roughness) * 0.5;
    #endif

    specularColor = (rL.specular + specularColor);

    #ifdef VOX_ABSORB
        specularColor *= vec3(reflectionIntensity);
    #endif
    
    vec3 Lo = rL.diffuse * diffuse + specularColor;
    #ifdef VOX_ENV_AMBIENT_LIGHT_LIGHT_MAP
        param4 = u_envLightParams[4];
        Lo += diffuse * VOX_Texture2D(VOX_ENV_AMBIENT_LIGHT_LIGHT_MAP, (param4.xy + worldPosition.xz) / param4.zw).xyz;
    #endif
    
    // ambient lighting (note that the next IBL tutorial will replace
    // this ambient lighting with environment lighting).
    vec3 ambient = ((color + u_pbrParams[2].xyz) * albedo.xyz) * ao;
    
	#ifdef VOX_WOOL
		sideIntensity = getColorFactorIntensity(dotNV, frontIntensity, sideIntensity);
		ambient *= sideIntensity;
		Lo *= sideIntensity * frontIntensity;
	#endif

    color = ambient + Lo;

    // HDR tonemapping
    #ifdef VOX_TONE_MAPPING
        color = tonemapReinhard( color, u_pbrParams[1].x );
    #endif
    

    // gamma correct
    color = linearToGamma(color);
    
    // mirror inverted reflection
    #ifdef VOX_MIRROR_PROJ_MAP
        float factorY = max(dot(N, V), 0.01) * 0.4 + 0.4;
        ao *= 0.8;
        #ifdef VOX_MIRROR_MAP_LOD
        vec4 mirrorColor4 = ao * VOX_Texture2DLod(VOX_MIRROR_PROJ_MAP, (gl_FragCoord.xy/u_stageParam.zw) + (N  * vec3(0.02)).xy, u_mirrorParams[0].w);
        #else
        vec4 mirrorColor4 = ao * VOX_Texture2D(VOX_MIRROR_PROJ_MAP, (gl_FragCoord.xy/u_stageParam.zw) + (N  * vec3(0.02)).xy);
        #endif
        factorY = mix(1.0, factorY, glossinessSquare);
        color.xyz = mix(mirrorColor4.xyz, color.xyz, factorY);
    #endif
    FragColor0 = vec4(color, 1.0);
//[x: displacement, y: ao, z: specular, w: occ]