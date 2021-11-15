worldNormal.xyz = v_worldNormal;
worldPosition.xyz = v_worldPosition;

vec4 color = u_fragLocalParams[0];
#ifdef VOX_DIFFUSE_MAP
    color = color * VOX_Texture2D(VOX_DIFFUSE_MAP, v_uv.xy);
#endif
color.xyz += u_fragLocalParams[1].xyz;

vec2 texUV = v_uv;
#ifdef VOX_LIGHT_LOCAL_PARAMS_INDEX
    vec4 param;
    vec3 viewDir = normalize(u_cameraPosition.xyz - worldPosition.xyz);
    #ifdef VOX_PARALLAX_MAP        
        #ifdef VOX_NORMAL_MAP
            mat3 btnMat3 = getBTNMat3(v_uv, worldPosition.xyz, worldNormal.xyz);
            vec3 tbnViewDir = btnMat3 * viewDir;
            
            //default value: vec4(1.0,10.0,2.0,0.1)
            param = u_fragLocalParams[ VOX_PARALLAX_PARAMS_INDEX ];
            texUV = parallaxOccRayMarchDepth(VOX_PARALLAX_MAP, v_uv, -tbnViewDir, param);
            vec3 pnv = normalize(getNormalFromMap(VOX_NORMAL_MAP, texUV));
            worldNormal.xyz = btnMat3 * pnv;
        #endif
    #else
        #ifdef VOX_NORMAL_MAP
            worldNormal.xyz = normalize(getNormalFromMap(VOX_NORMAL_MAP, texUV, worldNormal.xyz));
        #endif
    #endif

    int lightParamIndex = VOX_LIGHT_LOCAL_PARAMS_INDEX;
    param = u_fragLocalParams[ VOX_LIGHT_LOCAL_PARAMS_INDEX ];
    
    LambertLight light;
    light.normal = worldNormal.xyz;
    light.viewDirec = viewDir;
    light.diffuse = color.xyz;
    light.specular = param.xyz;

    light.specularPower = param.w;
    light.param = u_fragLocalParams[ VOX_LIGHT_LOCAL_PARAMS_INDEX + 1 ];
    vec4 param4;
    #ifdef VOX_SPECULAR_MAP
        param4 = VOX_Texture2D(VOX_SPECULAR_MAP, texUV);
        #if VOX_SPECULAR_MODE == 2
            light.specular *= color.xyz;
        #elif VOX_SPECULAR_MODE == 3
            light.specular *= param4.xyz;
        #endif
        light.specularPower *= param4.z;
        light.specularPower = max(0.5,light.specularPower);
    #endif
    vec3 destColor = getLambertLightColor(light);
    param = u_fragLocalParams[ VOX_LIGHT_LOCAL_PARAMS_INDEX + 2 ];
    color.xyz = color.xyz * param.x + param.y * destColor;
#endif

#ifdef VOX_AO_MAP
    color.xyz *= VOX_Texture2D(VOX_AO_MAP, texUV).yyy;
#endif

FragColor0 = color;
//[x: displacement, y: ao, z: specular, w: occ]