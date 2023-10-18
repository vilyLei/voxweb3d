struct Uniforms {
  modelViewProjectionMatrix : array<mat4x4<f32>, INS_SIZE>,
}

@binding(0) @group(0) var<uniform> uniforms : Uniforms;

struct VertexOutput {
  @builtin(position) Position : vec4<f32>,
  @location(0) fragUV : vec2<f32>,
  @location(1) fragPosition: vec4<f32>,
}

@vertex
fn main(
  @builtin(instance_index) instanceIdx : u32,
  @location(0) position : vec3<f32>,
  @location(1) uv : vec2<f32>
) -> VertexOutput {

  var output : VertexOutput;
  output.Position = uniforms.modelViewProjectionMatrix[instanceIdx] * vec4(position.xyz, 1);
  output.fragUV = uv;
  var pv: vec4<f32>;
  pv = 0.5 * (vec4(normalize(position.xyz) * 2.0, 1) + vec4(1.0, 1.0, 1.0, 1.0));
  output.fragPosition = pv;
  return output;
}
