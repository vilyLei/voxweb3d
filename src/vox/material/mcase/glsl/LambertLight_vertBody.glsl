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

    #ifdef VOX_USE_NORMAL
        v_worldNormal = normalize(a_nvs.xyz * inverse(mat3(u_objMat)));
    #endif