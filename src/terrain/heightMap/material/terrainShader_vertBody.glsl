
vec3 localPosition = a_vs;
#ifdef VOX_USE_2D_MAP
    v_uv = a_uvs.xy;
#endif
#ifdef VOX_DISPLACEMENT_MAP
    v_param = VOX_Texture2D(VOX_DISPLACEMENT_MAP, v_uv.xy);
    localPosition += normalize( a_nvs ) * vec3( v_param.x * u_displacement.x + u_displacement.y );
    //localPosition += normalize( a_nvs ) * vec3( (1.0 - v_param.x) * u_displacement.x + u_displacement.y );
#endif

v_wpos = u_objMat * vec4(localPosition, 1.0);
vec4 viewPos = u_viewMat * v_wpos;
gl_Position = u_projMat * viewPos;