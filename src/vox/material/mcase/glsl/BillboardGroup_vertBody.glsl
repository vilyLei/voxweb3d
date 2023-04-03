    vec4 temp = u_billParam[0];
    float zfk = 0.0;
    #ifndef VOX_PARTICLE_FLARE
        float time = max(a_nvs.w * temp.z - a_uvs2.w, 0.0);
        #ifdef PLAY_ONCE
            time = min(time, a_uvs2.x);
        #endif
        float kf = fract(time/a_uvs2.x);
        // discard the invisible vtx
        zfk = 1.0 - max(sign(kf - 0.001), 0.0);
        time = kf * a_uvs2.x;
    #else
        float kf = fract(a_uvs2.w * temp.z/a_uvs2.x);
    #endif

    float fi = kf;
    kf = min(kf/a_uvs2.y,1.0) * (1.0 - max((kf - a_uvs2.z)/(1.0 - a_uvs2.z), 0.0));
    // scale
    vec2 vtx = a_vs.xy * temp.xy * vec2(a_vs.z + kf * a_vs.w);
    #ifndef VOX_PARTICLE_FLARE
        viewPosition = motionCalc(time, vtx);
    #else
        viewPosition = u_viewMat * u_objMat * vec4(a_vs2.xyz,1.0);
    #endif

    viewPosition.xy += vtx.xy;
    gl_Position =  u_projMat * viewPosition;
    temp = u_billParam[0];
    // use depth offset
    gl_Position.z = ((gl_Position.z / gl_Position.w) + temp.w) * gl_Position.w;
    gl_Position.z -= zfk * 999999.0;

    v_factor = vec4(0.0,0.0, kf * a_vs2.w, fi);

    #ifdef VOX_USE_RAW_UV
        v_uv = vec4(a_uvs.xy,0.0,0.0);
    #endif

    #ifdef VOX_USE_CLIP
        calculateClipUV( fi );
    #else
        v_texUV = vec4(a_uvs.xy, a_uvs.xy);
    #endif

    #ifdef VOX_VERTEX_COLOR
        v_vtxColor = a_cvs;
    #endif
    v_colorMult = u_billParam[1];
    v_colorOffset = u_billParam[2];
