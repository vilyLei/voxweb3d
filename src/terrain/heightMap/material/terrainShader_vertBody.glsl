
localPosition.xyz = a_vs.xyz;
#ifdef VOX_USE_2D_MAP
    v_uv = a_uvs.xy;
#endif
#ifdef VOX_DISPLACEMENT_MAP
    v_param = VOX_Texture2D(VOX_DISPLACEMENT_MAP, v_uv.xy);
    localPosition.xyz += normalize( a_nvs ) * vec3( v_param.x * u_displacement.x + u_displacement.y );
    //localPosition += normalize( a_nvs ) * vec3( (1.0 - v_param.x) * u_displacement.x + u_displacement.y );
#endif

worldPosition = u_objMat * localPosition;
viewPosition = u_viewMat * worldPosition;
gl_Position = u_projMat * viewPosition;

v_wpos.xyz = worldPosition.xyz;