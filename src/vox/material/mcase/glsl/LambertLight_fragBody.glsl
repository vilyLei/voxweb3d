worldNormal.xyz = v_worldNormal;
worldPosition.xyz = v_worldPosition;

vec4 color = u_localParams[0];
#ifdef VOX_DIFFUSE_MAP
    color = color * VOX_Texture2D(VOX_DIFFUSE_MAP, v_uv.xy);
#endif
color.xyz += u_localParams[1].xyz;
#ifdef VOX_NORMAL_MAP
    worldNormal.xyz = (getNormalFromMap(VOX_NORMAL_MAP, v_uv, worldNormal.xyz));
#endif

#ifdef LIGHT_LOCAL_PARAMS_INDEX

    vec3 viewDir = normalize(u_cameraPosition.xyz - worldPosition.xyz);        
    int lightParamIndex = LIGHT_LOCAL_PARAMS_INDEX;
    vec4 param = u_localParams[ LIGHT_LOCAL_PARAMS_INDEX ];
    
    LambertLight light;
    light.normal = worldNormal.xyz;
    light.viewDirec = viewDir;
    light.diffuse = color.xyz;
    light.specular = param.xyz;
    light.specularPower = param.w;
    light.param = u_localParams[ LIGHT_LOCAL_PARAMS_INDEX + 1 ];

    #ifdef VOX_SPECULAR_MAP
        light.specularPower *= VOX_Texture2D(VOX_SPECULAR_MAP, v_uv.xy).z;
        light.specularPower += 8.0;
    #endif
    vec3 destColor = getLambertLightColor(light);
    param = u_localParams[ LIGHT_LOCAL_PARAMS_INDEX + 2 ];
    color.xyz = color.xyz * param.x + param.y * destColor;
#endif

#ifdef VOX_AO_MAP
    color.xyz *= VOX_Texture2D(VOX_AO_MAP, v_uv.xy).yyy;
#endif

FragColor0 = color;