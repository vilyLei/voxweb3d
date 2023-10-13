precision mediump float;
uniform sampler2D tex01;
uniform vec4 param;
uniform vec4 color;
void main(){
    vec2 pos = gl_FragCoord.xy/param.zw;
	vec4 tcolor = texture2D( tex01, pos );
    gl_FragColor = color * tcolor;
}