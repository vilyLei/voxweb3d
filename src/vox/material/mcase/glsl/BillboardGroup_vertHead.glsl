// 3.141592653589793
#define MATH_PI 3.14159265
// 4.71238898038469
#define MATH_3PER2PI 4.71238898
// 1.5707963267948966
#define MATH_1PER2PI 1.57079633

float getRadianByXY(float dx, float dy) {

    if(abs(dx) < 0.00001) {
        return (dy >= 0.0) ? MATH_1PER2PI : MATH_3PER2PI;
    }
    float rad = atan(dy/dx);
    return dx >= 0.0 ? rad: (MATH_PI + rad);
}
void calculateClipUV() {

    #ifdef VOX_USE_CLIP_MIX
        // calculate clip uv
        temp = u_billParam[ BILL_PARAM_INDEX ];//(x:cn,y:total,z:du,w:dv)
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
        temp = u_billParam[ BILL_PARAM_INDEX ];//(x:cn,y:total,z:du,w:dv)
        float clipf = floor(fi * temp.y);
        clipf /= temp.x;
        // vec2(floor(fract(clipf) * temp.x), floor(clipf)) -> vec2(cn u,rn v)
        v_texUV.xy = (vec2(floor(fract(clipf) * temp.x), floor(clipf)) + a_uvs.xy) * temp.zw;
    #endif
}