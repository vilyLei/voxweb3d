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

    #ifdef VOX_USE_DIFFUSEMAP2_MAT
        v_map2Pos = u_map2ViewMat * oWorldPosition;
    #endif

    #ifdef VOX_USE_NORMAL
        v_worldNormal.xyz = normalize(a_nvs.xyz * inverse(mat3(u_objMat)));
    #endif
    #ifdef VOX_USE_VTX_COLOR
        v_cv.xyz = a_cvs.xyz;
    #endif