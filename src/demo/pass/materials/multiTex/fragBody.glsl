#version 300 es

precision mediump float;

uniform sampler2D u_sampler0;
uniform sampler2D u_sampler1;
uniform vec4 u_color;
in vec2 v_uv;
in vec2 v_uv2;

layout(location = 0) out vec4 FragColor0;
void main() {

    vec4 color0 = texture(u_sampler0, v_uv.xy);
    vec4 color1 = texture(u_sampler1, v_uv2.xy);
    FragColor0 = vec4(color0.xyz + color1.xyz, 1.0) * u_color;
}