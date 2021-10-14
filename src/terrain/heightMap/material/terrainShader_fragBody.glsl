worldPosition.xyz = v_wpos.xyz;
#ifdef VOX_USE_2D_MAP
    vec2 colorUV = v_uv.xy * 16.0;
    vec4 color = VOX_Texture2D(u_sampler0, v_uv.xy * 4.0);
    vec4 ao = VOX_Texture2D(VOX_DISPLACEMENT_MAP, v_uv);

    #ifdef VOX_USE_FOG
        vec4 color1 = getFogColorFromTexture2D( u_sampler1 );
        fogEnvColor = color1.xyz;
    #else
        vec4 color1 = VOX_Texture2D(u_sampler1, v_uv);
    #endif
    
    float f = v_param.x / 0.70;
    color.xyz = mix( color.xyz, color1.xyz, f * f);
    color.xyz *= (ao.xyz * 0.9 + vec3(0.1));
    color *= u_color;
    FragColor0 = color;
#else
    FragColor0 = u_color;
#endif