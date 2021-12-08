#ifdef VOX_DISPLACEMENT_MAP
void displaceLocalVtx(in vec2 param) {    
    float dispFactor = VOX_Texture2D(VOX_DISPLACEMENT_MAP, v_uv.xy).x;
    localPosition.xyz += normalize( a_nvs ) * vec3( dispFactor * param.x + param.y );
}
#endif