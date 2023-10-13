struct Uniforms {
  modelViewProjectionMatrix : mat4x4<f32>,
}
@binding(0) @group(0) var<uniform> uniforms : Uniforms;

struct VertexOutput {
  @builtin(position) Position : vec4<f32>,
  @location(0) fragUV : vec2<f32>,
  @location(1) fragPosition: vec4<f32>,
}
fn invertedColor( color : vec4f ) -> vec4f { // return the inverted color
   return vec4f( 1 - color.rgb, color.a );
}
@vertex
fn main(
  @location(0) position : vec4<f32>,
  @location(1) uv : vec2<f32>
) -> VertexOutput {
  var output : VertexOutput;
  output.Position = uniforms.modelViewProjectionMatrix * position;
  output.fragUV = uv;
  var pv: vec4<f32>;
  pv = 0.5 * (vec4(normalize(position.xyz) * 2.0, 1) + vec4(1.0, 1.0, 1.0, 1.0));
//   pv = 0.5 * (vec4(position.xyz * 0.01, 1) + vec4(1.0, 1.0, 1.0, 1.0));
  output.fragPosition = pv;
  return output;
}
