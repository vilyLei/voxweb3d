const vec4 zeroPosition = vec4(0.0,0.0,0.0, 1.0);

#ifdef VOX_DISPLACEMENT_MAP
void displaceLocalVtx(in vec2 param) {    
    float dispFactor = VOX_Texture2D(VOX_DISPLACEMENT_MAP, v_uv.xy).x;
    localPosition.xyz += normalize( a_nvs ) * vec3( dispFactor * param.x + param.y );
}
#endif

const vec2 noise2 = vec2(12.9898,78.233);
const vec3 noise3 = vec3(12.9898,78.233,158.5453);
vec2 rand(vec2 seed) {

  float noiseX = (fract(sin(dot(seed, noise2)) * 43758.5453));
  float noiseY = (fract(sin(dot(seed, noise2 * 2.0)) * 43758.5453));
  return vec2(noiseX,noiseY);
}
vec3 rand(vec3 seed) {
  float noiseX = (fract(sin(dot(seed, noise3)) * 43758.5453));
  float noiseY = (fract(sin(dot(seed, noise3 * 2.0)) * 43758.5453));
  float noiseZ = (fract(sin(dot(seed, noise3 * 3.0)) * 43758.5453));
  return vec3(noiseX, noiseY, noiseZ);
}

void initLocalVtx() {
    localPosition = vec4(a_vs.xyz, 1.0);
    int paramIndex = 0;
    // vertex transform calculation
    #ifdef VOX_VTX_CURVE_MOVE_PARAM_INDEX
        vec4 params = u_vertLocalParams[VOX_VTX_CURVE_MOVE_PARAM_INDEX];
        float index = abs(mod((a_vs.w + params[1]),params[2]));
        index *= params[0];
        vec2 puv = vec2(fract(index), floor(index) * params[0]);
        localPosition.xyz += VOX_Texture2D(VTX_CURVE_MOVE_MAP, puv).xyz;
    #endif
    #ifdef VOX_USE_2D_MAP
        #ifdef VOX_VTX_TRANSFORM_PARAM_INDEX
            paramIndex = VOX_VTX_TRANSFORM_PARAM_INDEX;
            v_uv = a_uvs.xy * u_vertLocalParams[paramIndex].xy + u_vertLocalParams[paramIndex].zw;
        #else
            v_uv = a_uvs.xy;
        #endif
    #endif

    #ifdef VOX_DISPLACEMENT_MAP
        displaceLocalVtx( u_vertLocalParams[VOX_DISPLACEMENT_PARAMS_INDEX].xy );
    #endif
}