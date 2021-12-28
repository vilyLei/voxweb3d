
#ifdef VOX_DISPLACEMENT_MAP
void displaceLocalVtx(in vec2 param) {
    float dispFactor = VOX_Texture2D(VOX_DISPLACEMENT_MAP, v_uv.xy).x;
    localPosition.xyz += normalize( a_nvs.xyz ) * vec3( dispFactor * param.x + param.y );
}
#endif

void initLocalVtx() {
    localPosition = vec4(a_vs.xyz, 1.0);
    // vertex transform calculation
    #ifdef VOX_VTX_CURVE_MOVE_PARAM_INDEX
        vec4 params = u_vertLocalParams[VOX_VTX_CURVE_MOVE_PARAM_INDEX];
        float index = abs(mod((a_vs.w + params[1]),params[2]));
        index *= params[0];
        vec2 puv = vec2(fract(index), floor(index) * params[0]);
        localPosition.xyz += VOX_Texture2D(VTX_CURVE_MOVE_MAP, puv).xyz;
    #endif
        
    #ifdef VOX_USE_UV_VTX_TRANSFORM
        v_uv = a_uvs.xy * u_vertLocalParams[0].xy + u_vertLocalParams[0].zw;
    #elif VOX_USE_2D_MAP
        v_uv = a_uvs.xy;
    #endif

    #ifdef VOX_DISPLACEMENT_MAP
        displaceLocalVtx( u_vertLocalParams[VOX_DISPLACEMENT_PARAMS_INDEX].xy );
    #endif
}