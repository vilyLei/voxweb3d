    vec4 temp = u_billParam[0];
    float time = max(a_nvs.w * temp.z - a_uvs2.w, 0.0);

    #ifdef PLAY_ONCE
        time = min(time, a_uvs2.x);
    #endif

    float kf = fract(time/a_uvs2.x);
    float fi = kf;
    time = kf * a_uvs2.x;
    kf = min(kf/a_uvs2.y,1.0) * (1.0 - max((kf - a_uvs2.z)/(1.0 - a_uvs2.z),0.0));
    // scale
    vec2 vtx = a_vs.xy * temp.xy * vec2(a_vs.z + kf * a_vs.w);

    viewPosition = motionCalc(time, vtx);
    
    viewPosition.xy += vtx.xy;
    gl_Position =  u_projMat * viewPosition;
    v_factor = vec4(0.0,0.0, kf * a_vs2.w,fi);

    #ifdef VOX_USE_RAW_UV
        v_uv = vec4(a_uvs.xy,0.0,0.0);
    #endif
    #ifdef VOX_USE_CLIP
        calculateClipUV( fi );
    #else
        v_texUV = vec4(a_uvs.xy, a_uvs.xy);
    #endif
    
    v_colorMult = u_billParam[1];
    v_colorOffset = u_billParam[2];
