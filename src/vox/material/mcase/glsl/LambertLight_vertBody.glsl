initLocalVtx();

#ifdef VOX_USE_UV_VTX_TRANSFORM
    v_uv = a_uvs.xy * u_vertLocalParams[0].xy + u_vertLocalParams[0].zw;
#elif VOX_USE_2D_MAP
    v_uv = a_uvs.xy;
#endif


worldPosition = u_objMat * localPosition;
viewPosition = u_viewMat * worldPosition;
gl_Position = u_projMat * viewPosition;
v_worldPosition = worldPosition.xyz;

v_worldNormal = normalize(a_nvs * inverse(mat3(u_objMat)));