    vec4 color = VOX_Texture2D(VOX_DIFFUSE_MAP, v_texUV.xy);
    #ifdef VOX_USE_CLIP_MIX
        color = mix(color, VOX_Texture2D(VOX_DIFFUSE_MAP, v_texUV.zw),v_factor.x);
    #endif

    vec3 offsetColor = getOffsetColor();

    blendBrightnessORAlpha( color, offsetColor );

    #ifdef VOX_PREMULTIPLY_ALPHA
        color.xyz *= color.aaa;
    #endif
    #ifdef VOX_VERTEX_COLOR
		#ifdef VOX_BRIGHTNESS
        	color.xyz *= v_vtxColor.xyz;
        	color.xyz *= v_vtxColor.www;
		#else
        	color *= v_vtxColor;
		#endif
    #endif
    FragColor0 = color;
    // for test
    // FragColor0 = vec4(vec3(0.3), 1.0);