localPosition.xyz = a_vs;

#ifdef VOX_USE_2D_MAP
    v_uv = a_uvs.xy;
#endif

#ifdef VOX_DISPLACEMENT_MAP
    displaceLocalVtx( u_localParams[2].xy );
#endif

worldPosition = u_objMat * localPosition;
viewPosition = u_viewMat * worldPosition;
gl_Position = u_projMat * viewPosition;
v_worldPosition = worldPosition.xyz;

v_worldNormal = normalize(a_nvs * inverse(mat3(u_objMat)));