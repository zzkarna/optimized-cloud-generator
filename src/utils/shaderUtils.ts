export const createShader = (gl: WebGLRenderingContext, type: number, source: string) => {
  const shader = gl.createShader(type);
  if (!shader) return null;

  gl.shaderSource(shader, source);
  gl.compileShader(shader);

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.error('Shader compile error:', gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
    return null;
  }

  return shader;
};

export const vertexShaderSource = `
  attribute vec2 position;
  void main() {
    gl_Position = vec4(position, 0.0, 1.0);
  }
`;

export const generateShaderCode = (fragmentShaderSource: string) => {
  return `
// Cloud Shader for Three.js
uniform float uTime;
uniform vec3 uCameraPosition;
uniform float uStepSize;
uniform int uMaxSteps;
uniform float uLightSampleDist;
uniform float uSunIntensity;
uniform float uNoiseScale;
uniform int uNoiseOctaves;
uniform float uCloudDensity;
uniform float uCloudHeight;
uniform float uWindSpeed;
uniform vec3 uSunDirection;
uniform vec3 uSunColor;
uniform vec3 uSkyColor;

const vec3 SUN_DIR = normalize(vec3(-0.8, 0.6, 0.3));
const vec3 SUN_COLOR = vec3(1.0, 0.6, 0.3);
const vec3 SKY_COLOR = vec3(0.6, 0.6, 0.75);

${fragmentShaderSource}
`;
};