#version 300 es
precision mediump float;
layout(location = 0) in vec3 a_vs;
layout(location = 1) in vec2 a_uvs;
layout(location = 2) in vec3 a_nvs;
uniform mat4 u_objMat;
uniform mat4 u_viewMat;
uniform mat4 u_projMat;
out vec3 v_nv;
out vec2 v_uvs;
void main()
{
    gl_Position = u_projMat * u_viewMat * u_objMat * vec4(a_vs,1.0);
    v_nv = a_nvs;
    v_uvs = a_uvs;
    vec2 uvpos = v_uvs.xy;
    // uvpos = fract(uvpos + vec2(2.0));
    uvpos = vec2(2.0) * vec2(uvpos - vec2(0.5));
    gl_Position = vec4(uvpos, 0.0,1.0);
}