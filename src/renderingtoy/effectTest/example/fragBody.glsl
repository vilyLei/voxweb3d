#version 300 es
precision mediump float;
uniform sampler2D u_sampler0;
uniform vec4 u_color;
in vec3 v_nv;
in vec2 v_uvs;
layout(location = 0) out vec4 FragColor0;
void main()
{
    FragColor0 = texture(u_sampler0, v_uvs.xy) * u_color;
}
// for example