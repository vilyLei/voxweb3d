@group(0) @binding(1) var mySampler0: sampler;
@group(0) @binding(2) var myTexture0: texture_2d<f32>;
@group(0) @binding(3) var mySampler1: sampler;
@group(0) @binding(4) var myTexture1: texture_2d<f32>;

@fragment
fn main(
    @location(0) fragUV: vec2<f32>,
    @location(1) fragPosition: vec4<f32>
) -> @location(0) vec4<f32> {
    let factor: f32 = 0.5;
    var color0: vec4<f32>;
    var color1: vec4<f32>;
    color0 = textureSample(myTexture0, mySampler0, fragUV) * fragPosition;
    color1 = textureSample(myTexture1, mySampler1, fragUV) * fragPosition;
    return color0 * vec4<f32>(1.0 - factor) + color1 * vec4<f32>(factor);
}
