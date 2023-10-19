struct TransUniform {
  modelViewProjectionMatrix : mat4x4<f32>,
}
@group(0) @binding(0) var<uniform> uniforms : TransUniform;

struct VertexOutput {
  @builtin(position) Position : vec4<f32>,
  @location(0) fragUV : vec2<f32>,
  @location(1) fragPosition: vec4<f32>,
}
fn invertedColor( color : vec4<f32>) -> vec4<f32> {
   return vec4( 1.0 - color.rgb, color.a );
}
@vertex
fn main(
  @location(0) position : vec3<f32>,
  @location(1) uv : vec2<f32>
) -> VertexOutput {
  var output : VertexOutput;
  output.Position = uniforms.modelViewProjectionMatrix * vec4(position.xyz, 1.0);
  output.fragUV = uv;
  var pv: vec4<f32>;
  pv = 0.5 * (vec4<f32>(normalize(position.xyz) * 2.0, 1.0) + vec4<f32>(1.0, 1.0, 1.0, 1.0));
  output.fragPosition = pv;
  return output;
}
