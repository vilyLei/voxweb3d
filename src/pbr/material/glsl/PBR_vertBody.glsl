    initLocalVtx();
    
    worldPosition = u_objMat * localPosition;
    viewPosition = u_viewMat * worldPosition;
    gl_Position = u_projMat * viewPosition;

    #ifdef VOX_DISPLACEMENT_MAP
        oWorldPosition = (u_objMat * vec4(a_vs.xyz, 1.0));
    #else
        oWorldPosition = worldPosition;
    #endif
    v_worldPosition.xyz = oWorldPosition.xyz;
    
    #ifndef VOX_VTX_FLAT_NORMAL
        v_worldNormal = normalize(a_nvs * inverse(mat3(u_objMat)));
    
        #ifdef VOX_NORMAL_NOISE
    
            v_worldNormal += (rand(a_nvs)) * 0.1;
    
        #endif
    #endif

    #ifdef VOX_DEPTH_FOG
        v_fogParam = vec4(viewPos.xyz, length(viewPosition.xyz)/u_frustumParam.y);
    #else
