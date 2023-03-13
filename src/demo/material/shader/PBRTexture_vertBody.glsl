

    vec4 wPos = u_objMat * vec4(a_vs, 1.0);
    vec4 viewPos = u_viewMat * wPos;
    gl_Position = u_projMat * viewPos;

    v_worldPos = wPos.xyz;
    v_normal = normalize(a_nvs * inverse(mat3(u_objMat)));
    v_camPos = (inverse(u_viewMat) * vec4(0.0,0.0,0.0, 1.0)).xyz;
    
    #ifdef VOX_USE_2D_MAP
        v_uv = (a_uvs.xy * u_uvTrans.zw) + u_uvTrans.xy;
    #endif