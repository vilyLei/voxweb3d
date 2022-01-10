worldNormal.xyz = v_worldNormal;
worldPosition.xyz = v_worldPosition;
vec3 N = worldNormal.xyz;
vec4 color = u_fragLocalParams[0];

color.xyz += u_fragLocalParams[1].xyz;
#ifdef VOX_USE_VTX_COLOR
    color.xyz *= v_cv.xyz;
#endif

vec3 ao = vec3(1.0);
vec2 texUV = v_uv.xy;
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
            #ifdef VOX_NORMAL_MAP
                N = btnMat3 * normalize(getNormalFromMap(VOX_NORMAL_MAP, texUV));
            #endif
        #endif
    #else
        #ifdef VOX_NORMAL_MAP
            N = normalize(getNormalFromMap(VOX_NORMAL_MAP, texUV, worldNormal.xyz));
        #endif
    #endif

    calcDiffuse( color, texUV.xy );

    #ifdef VOX_AO_MAP
        ao = VOX_Texture2D(VOX_AO_MAP, texUV).yyy;
    #endif

    int lightParamIndex = VOX_LIGHT_LOCAL_PARAMS_INDEX;
    param = u_fragLocalParams[ VOX_LIGHT_LOCAL_PARAMS_INDEX ];
    
    LambertLight light;
    light.normal = N;
    light.viewDirec = viewDir;
    light.diffuse = color.xyz;
    light.specular = param.xyz;

    light.specularPower = param.w;
    param = u_fragLocalParams[ VOX_LIGHT_LOCAL_PARAMS_INDEX + 1 ];
    light.param = param;
    vec4 param4;
    #ifdef VOX_SPECULAR_MAP
        param4 = VOX_Texture2D(VOX_SPECULAR_MAP, texUV);
        #if VOX_SPECULAR_MODE == 2
            light.specular *= color.xyz;
        #elif VOX_SPECULAR_MODE == 3
            light.specular *= param4.xyz;
        #endif
        light.specularPower = max(1.0, light.specularPower * param4.z);
    #endif
    vec3 destColor = getLambertLightColor(light);

    #ifdef VOX_ENV_AMBIENT_LIGHT_LIGHT_MAP
        param4 = u_envLightParams[4];
        param4.xyz = color.xyz * VOX_Texture2D(VOX_ENV_AMBIENT_LIGHT_LIGHT_MAP, (param4.xy + worldPosition.xz) / param4.zw).xyz;
        destColor.xyz += param4.xyz * u_envLightParams[0].xyz * ao;
    #endif
    color.xyz = color.xyz * param.z + param.w * destColor;
#else

    calcDiffuse( color, texUV.xy );

    #ifdef VOX_AO_MAP
        ao = VOX_Texture2D(VOX_AO_MAP, texUV).yyy;
    #endif
#endif

color.xyz *= ao;
color.xyz += u_fragLocalParams[ VOX_LIGHT_LOCAL_PARAMS_INDEX + 2 ].xyz * ao;

FragColor0 = color;
//[x: displacement, y: ao, z: specular, w: occ]