#ifdef VOX_USE_FOG
    #ifdef VOX_FOG_COLOR_MAP
        vec3 fogEnvColor = vec3(1.0);
        vec4 getFogColorFromTexture2D(sampler2D tex) {
            vec4 color = VOX_Texture2D(tex, (u_envLightParams[3].xy + worldPosition.xz) / u_envLightParams[3].zw);
            fogEnvColor = color.xyz;
            return color;
        }
    #endif
    void useFog(inout vec4 color) {
        vec3 fogColor = u_envLightParams[2].xyz;
        #ifdef VOX_FOG_COLOR_MAP
            fogColor *= fogEnvColor;
        #endif
        #ifdef VOX_FOG_EXP2
            float fogDensity = u_envLightParams[2].w;
            float fogFactor = 1.0 - exp( - fogDensity * fogDensity * v_fogDepth * v_fogDepth );
        #else
            float fogNear = u_envLightParams[1].z;
            float fogFar = u_envLightParams[1].w;
            float fogFactor = smoothstep( fogNear, fogFar, v_fogDepth );
        #endif
        #ifdef VOX_USE_BRIGHTNESS_OVERLAY_COLOR
            color.xyz = mix( color.rgb, fogColor, fogFactor ) * length(color.rgb) * (1.0 - fogFactor);
        #else
            color.xyz = mix( color.rgb, fogColor, fogFactor );
            #ifdef VOX_PREMULTIPLY_ALPHA
                color.xyz *= color.w;
            #endif
        #endif
    }
#endif