#version 300 es

precision mediump float;

layout(location = 0) in vec3 a_vs;
layout(location = 1) in vec2 a_uvs;
layout(location = 2) in vec3 a_nvs;

uniform vec4 u_uvTrans;
uniform mat4 u_objMat;
uniform mat4 u_viewMat;
uniform mat4 u_projMat;

out vec2 v_uv;
out vec2 v_uv2;

vec4 localPosition;
vec4 worldPosition;
vec4 viewPosition;

void main() {

    localPosition = vec4(a_vs.xyz,1.0);
    worldPosition = u_objMat * localPosition;
    viewPosition = u_viewMat * worldPosition;
    // gl_Position = u_projMat * u_viewMat * worldPosition;
    gl_Position = u_projMat * viewPosition;
    // gl_Position = u_projMat * u_viewMat * u_objMat * vec4(a_vs.xyz,1.0);
    v_uv = a_uvs.xy;
    v_uv2 = (a_uvs.xy * u_uvTrans.zw) + u_uvTrans.xy;

}