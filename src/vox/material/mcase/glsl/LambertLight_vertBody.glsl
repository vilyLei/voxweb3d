initLocalVtx();

worldPosition = u_objMat * localPosition;
viewPosition = u_viewMat * worldPosition;
gl_Position = u_projMat * viewPosition;

v_worldPosition = worldPosition.xyz;

#ifdef VOX_USE_NORMAL
    v_worldNormal = normalize(a_nvs.xyz * inverse(mat3(u_objMat)));
#endif