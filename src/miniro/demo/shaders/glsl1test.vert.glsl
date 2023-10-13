precision highp float;
attribute vec3 a_vs;
void main(){
    gl_Position = vec4(a_vs,1.0);
}