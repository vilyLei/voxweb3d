    vec4 color = VOX_Texture2D(VOX_DIFFUSE_MAP, v_texUV.xy);
	#ifdef VOX_BRN_TO_ALPHA
		color = vec4(color.xyz, max(length(color.xyz) - 0.03, 0.0));
	#endif
    #ifdef VOX_USE_CLIP_MIX
		vec4 c1 = VOX_Texture2D(VOX_DIFFUSE_MAP, v_texUV.zw);
		#ifdef VOX_BRN_TO_ALPHA
			c1 = vec4(c1.xyz, max(length(c1.xyz) - 0.03, 0.0));
		#endif
		color = mix(color, c1,v_factor.x);
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