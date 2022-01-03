
#ifdef ROTATION_DIRECT

// 4.71238898038469
#define MATH_3PER2PI 4.71238898
// 1.5707963267948966
#define MATH_1PER2PI 1.57079633

float getRadianByXY(float dx, float dy) {

    if(abs(dx) < 0.00001) {
        return (dy >= 0.0) ? MATH_1PER2PI : MATH_3PER2PI;
    }
    float rad = atan(dy/dx);
    return dx >= 0.0 ? rad: (PI + rad);
}
#endif

const vec3 biasV3 = vec3(0.1);

#ifdef VOX_USE_CLIP
void calculateClipUV(float fi) {
    
    #ifdef VOX_USE_CLIP_MIX
        // calculate clip uv
        vec4 temp = u_billParam[ BILL_PARAM_INDEX ];//(x:cn,y:total,z:du,w:dv)
        float clipf0 = floor(fi * temp.y);
        float clipf1 = min(clipf0 + 1.0, temp.y - 1.0);
        clipf0 /= temp.x;
        // vec2(floor(fract(clipf0) * temp.x), floor(clipf0)) -> vec2(cn u,rn v)
        v_texUV.xy = (vec2(floor(fract(clipf0) * temp.x), floor(clipf0)) + a_uvs.xy) * temp.zw;

        v_factor.x = fract(fi * temp.y);

        clipf1 /= temp.x;
        v_texUV.zw = (vec2(floor(fract(clipf1) * temp.x), floor(clipf1)) + a_uvs.xy) * temp.zw;
    #else
        // calculate clip uv
        vec4 temp = u_billParam[ BILL_PARAM_INDEX ];//(x:cn,y:total,z:du,w:dv)
        float clipf = floor(fi * temp.y);
        clipf /= temp.x;
        // vec2(floor(fract(clipf) * temp.x), floor(clipf)) -> vec2(cn u,rn v)
        v_texUV.xy = (vec2(floor(fract(clipf) * temp.x), floor(clipf)) + a_uvs.xy) * temp.zw;
    #endif
}
#endif

vec4 motionCalc(float time, inout vec2 vtx) {
    vec3 timeV = vec3(time);
    vec3 acc3 = u_billParam[3].xyz + a_nvs2.xyz;
    #ifdef ROTATION_DIRECT
        #ifdef SPEED_SCALE
            float v0scale = clamp(length(a_nvs.xyz + acc3 * timeV)/u_billParam[1].w,1.0,u_billParam[3].w);
            vtx *= vec2(v0scale, 1.0);
        #endif

        vec3 pv0 = a_vs2.xyz + (a_nvs.xyz + acc3 * timeV) * timeV;
        timeV += biasV3;
        vec3 pv1 = a_vs2.xyz + (a_nvs.xyz + acc3 * timeV) * timeV;

        mat4 voMat = u_viewMat * u_objMat;
        vec4 pos = voMat * vec4(pv0,1.0);
        vec4 pos1 = voMat * vec4(pv1,1.0);
        float rad = getRadianByXY(pos1.x - pos.x, pos1.y - pos.y);
        float cosv = cos(rad);
        float sinv = sin(rad);

        // rotate
        vtx = vec2(vtx.x * cosv - vtx.y * sinv, vtx.x * sinv + vtx.y * cosv);
    #else
        vec4 pos = u_viewMat * u_objMat * vec4(a_vs2.xyz + (a_nvs.xyz + acc3 * timeV) * timeV,1.0);
    #endif
    return pos;
}