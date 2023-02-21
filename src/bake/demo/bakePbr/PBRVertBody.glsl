layout(location = 0) in vec3 a_vs;
layout(location = 1) in vec2 a_uvs;
layout(location = 2) in vec3 a_nvs;

uniform mat4 u_objMat;
uniform mat4 u_viewMat;
uniform mat4 u_projMat;
uniform vec4 u_offset;

out vec2 TexCoords;
out vec3 WorldPos;
out vec3 Normal;
out vec3 v_camPos;
out vec2 v_suv;

float calcValue(float v) {

    if(v > 1.0) {
        float t = fract(v);
        v = t > 0.0 ? t : 1.0;
    }else if(v < 0.0) {
        v = abs(v);
        if(v > 1.0) {
            float t = fract(v);
            v = t > 0.0 ? t : 1.0;
        }
        v = 1.0 - v;
    }
    return v;
}
vec2 getUV(vec2 uv) {
    return vec2(calcValue(uv.x), calcValue(uv.y));
}
void main(){

    vec4 wPos = u_objMat * vec4(a_vs, 1.0);
    vec4 viewPos = u_viewMat * wPos;
    gl_Position = u_projMat * viewPos;

    vec2 kfv2 = vec2(0.0166666675);
    WorldPos = wPos.xyz;
    TexCoords = a_uvs + vec2(-999.0, -999.0);
    //0.0167, 0, 0, 0, 0.0167, 0, 0, 0, 1
    mat3 m3 = mat3(vec3(0.0167, 0.0, 0.0), vec3(0.0, 0.0167, 0.0), vec3(0.0, 0.0, 1.0));
    TexCoords = (m3 * vec3(TexCoords, 1.0)).xy;
    // TexCoords = TexCoords
    Normal = normalize(a_nvs * inverse(mat3(u_objMat)));
    v_camPos = (inverse(u_viewMat) * vec4(0.0,0.0,0., 1.0)).xyz;
    
    // kfv2 = vec2(1.0);
    // vec2 puvpos = getUV(a_uvs.xy * kfv2);
    // v_suv = puvpos;

    // #ifdef BAKE
    // vec2 uvpos = getUV(a_uvs.xy * kfv2);
    // v_suv = uvpos;
    // uvpos = vec2(2.0) * vec2(uvpos - vec2(0.5));
    // uvpos += u_offset.xy;
    // // v_suv = uvpos;
    // gl_Position = vec4(uvpos, 0.0,1.0);
    // #endif
}