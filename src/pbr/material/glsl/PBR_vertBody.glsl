    initLocalVtx();
    
    worldPosition = u_objMat * localPosition;
    viewPosition = u_viewMat * worldPosition;
    gl_Position = u_projMat * viewPosition;

    // temporary code plan
    #ifdef VOX_DISPLACEMENT_MAP
        v_worldPosition = (u_objMat * vec4(a_vs.xyz, 1.0)).xyz;
    #else
        v_worldPosition = worldPosition.xyz;
    #endif
    
    #ifndef VOX_VTX_FLAT_NORMAL
        v_worldNormal = normalize(a_nvs * inverse(mat3(u_objMat)));
    
        #ifdef VOX_NORMAL_NOISE
    
            v_worldNormal += (rand(a_nvs)) * 0.1;
    
        #endif
    #endif
