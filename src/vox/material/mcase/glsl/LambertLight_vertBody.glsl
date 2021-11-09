localPosition.xyz = a_vs;

#ifdef VOX_USE_2D_MAP
    v_uv = a_uvs.xy * u_vtxParams[0].xy;
#endif

#ifdef VOX_DISPLACEMENT_MAP
    displaceLocalVtx( u_vtxParams[1].xy );
#endif

worldPosition = u_objMat * localPosition;
viewPosition = u_viewMat * worldPosition;
gl_Position = u_projMat * viewPosition;
v_worldPosition = worldPosition.xyz;

v_worldNormal = normalize(a_nvs * inverse(mat3(u_objMat)));