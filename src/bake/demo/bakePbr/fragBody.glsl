#version 300 es
precision mediump float;
uniform sampler2D u_sampler0;
uniform sampler2D u_sampler1;
uniform vec4 u_color;
in vec3 v_nv;
in vec2 v_uvs;
layout(location = 0) out vec4 FragColor0;
void main()
{
    vec4 color0 = texture(u_sampler0, v_uvs.xy);
    vec4 color1 = texture(u_sampler1, v_uvs.xy);
    FragColor0 = mix(color0, color1, 0.6) * u_color;
    // FragColor0 = vec4(fract(1.0), fract(0.0), 0.0, 1.0) * u_color;
}
// for example