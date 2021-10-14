
    
    worldPosition = u_objMat * vec4(a_vs, 1.0);
    viewPosition = u_viewMat * worldPosition;
    gl_Position = u_projMat * viewPosition;
    
    v_worldPos = worldPosition.xyz;
    
    #ifndef VOX_VTX_FLAT_NORMAL
        v_worldNormal = normalize(a_nvs * inverse(mat3(u_objMat)));
    
        #ifdef VOX_NORMAL_NOISE
    
            v_worldNormal += (rand(a_nvs)) * 0.1;
    
        #endif
    #endif
    
    #ifdef VOX_USE_2D_MAP

        v_uv.xy = a_uvs.xy * u_paramLocal[1].xy;

    #endif
    /*
    #ifdef VOX_USE_SHADOW

        calcShadowPos( viewPosition );

    #endif
    
    #ifdef VOX_USE_FOG

    calcFogDepth( viewPosition );

    #endif
    //*/