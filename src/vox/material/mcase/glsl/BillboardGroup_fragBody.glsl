    vec4 color = VOX_Texture2D(VOX_DIFFUSE_MAP, v_texUV.xy);
    #ifdef VOX_USE_CLIP_MIX
        color = mix(color, VOX_Texture2D(VOX_DIFFUSE_MAP, v_texUV.zw),v_factor.x);
    #endif

    vec3 offsetColor = getOffsetColor();
    
    blendBrightnessORAlpha( color, offsetColor );

    #ifdef VOX_PREMULTIPLY_ALPHA
        color.xyz *= color.a;
    #endif
    FragColor0 = color;