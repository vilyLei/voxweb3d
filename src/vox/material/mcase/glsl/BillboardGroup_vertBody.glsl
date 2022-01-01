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


    vec3 timeV = vec3(time);
    vec3 acc3 = u_billParam[3].xyz + a_nvs2.xyz;
    #ifdef ROTATION_DIRECT
        #ifdef SPEED_SCALE
            float v0scale = clamp(length(a_nvs.xyz + acc3 * timeV)/u_billParam[1].w,1.0,u_billParam[3].w);
            vtx *= vec2(v0scale, 1.0);
        #endif
        vec3 pv0 = a_vs2.xyz + (a_nvs.xyz + acc3 * timeV) * timeV;
        timeV += biasV3;
        vec3 pv1 = a_vs2.xyz + (a_nvs.xyz + acc3 * timeV) * timeV;

        mat4 voMat = u_viewMat * u_objMat;
        vec4 pos = voMat * vec4(pv0,1.0);
        vec4 pos1 = voMat * vec4(pv1,1.0);
        float rad = getRadianByXY(pos1.x - pos.x, pos1.y - pos.y);
        float cosv = cos(rad);
        float sinv = sin(rad);

        // rotate
        vtx = vec2(vtx.x * cosv - vtx.y * sinv, vtx.x * sinv + vtx.y * cosv);
    #else
        vec4 pos = u_viewMat * u_objMat * vec4(a_vs2.xyz + (a_nvs.xyz + acc3 * timeV) * timeV,1.0);
    #endif

    pos.xy += vtx.xy;
    gl_Position =  u_projMat * pos;
    v_factor = vec4(0.0,0.0, kf * a_vs2.w, fi);
    
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
