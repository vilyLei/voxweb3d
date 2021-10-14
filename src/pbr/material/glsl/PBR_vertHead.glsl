const vec4 zeroPosition = vec4(0.0,0.0,0.0, 1.0);

const vec2 noise2 = vec2(12.9898,78.233);
const vec3 noise3 = vec3(12.9898,78.233,158.5453);
vec2 rand(vec2 seed) {

  float noiseX = (fract(sin(dot(seed, noise2)) * 43758.5453));
  float noiseY = (fract(sin(dot(seed, noise2 * 2.0)) * 43758.5453));
  return vec2(noiseX,noiseY);
}
vec3 rand(vec3 seed) {
  float noiseX = (fract(sin(dot(seed, noise3)) * 43758.5453));
  float noiseY = (fract(sin(dot(seed, noise3 * 2.0)) * 43758.5453));
  float noiseZ = (fract(sin(dot(seed, noise3 * 3.0)) * 43758.5453));
  return vec3(noiseX, noiseY, noiseZ);
}