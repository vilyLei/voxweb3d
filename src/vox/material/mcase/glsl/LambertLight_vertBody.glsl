initLocalVtx();

worldPosition = u_objMat * localPosition;
viewPosition = u_viewMat * worldPosition;
gl_Position = u_projMat * viewPosition;
v_worldPosition = worldPosition.xyz;

v_worldNormal = normalize(a_nvs * inverse(mat3(u_objMat)));