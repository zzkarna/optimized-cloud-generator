export const initWebGL = (
  gl: WebGLRenderingContext,
  vertexShader: WebGLShader | null,
  fragmentShader: WebGLShader | null
) => {
  if (!vertexShader || !fragmentShader) return null;

  const program = gl.createProgram();
  if (!program) return null;

  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);

  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.error('Program link failed:', gl.getProgramInfoLog(program));
    return null;
  }

  // Create and bind vertex buffer (only once)
  const positions = new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]);
  const positionBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);

  // Cache uniform locations
  const uniformLocations = {
    uTime: gl.getUniformLocation(program, 'uTime'),
    uFrame: gl.getUniformLocation(program, 'uFrame'),
    uStepSize: gl.getUniformLocation(program, 'uStepSize'),
    uMaxSteps: gl.getUniformLocation(program, 'uMaxSteps'),
    uLightSampleDist: gl.getUniformLocation(program, 'uLightSampleDist'),
    uSunIntensity: gl.getUniformLocation(program, 'uSunIntensity'),
    uNoiseScale: gl.getUniformLocation(program, 'uNoiseScale'),
    uNoiseOctaves: gl.getUniformLocation(program, 'uNoiseOctaves'),
    uCloudDensity: gl.getUniformLocation(program, 'uCloudDensity'),
    uCloudHeight: gl.getUniformLocation(program, 'uCloudHeight'),
    uWindSpeed: gl.getUniformLocation(program, 'uWindSpeed'),
    uSunDirection: gl.getUniformLocation(program, 'uSunDirection'),
    uSunColor: gl.getUniformLocation(program, 'uSunColor'),
    uSkyColor: gl.getUniformLocation(program, 'uSkyColor')
  };

  return { program, uniformLocations };
};

export const updateUniforms = (
  gl: WebGLRenderingContext,
  programInfo: { program: WebGLProgram; uniformLocations: any },
  parameters: any
) => {
  const { program, uniformLocations } = programInfo;
  gl.useProgram(program);

  // Update uniforms using cached locations
  gl.uniform1f(uniformLocations.uStepSize, parameters.stepSize);
  gl.uniform1i(uniformLocations.uMaxSteps, parameters.maxSteps);
  gl.uniform1f(uniformLocations.uLightSampleDist, parameters.lightSampleDist);
  gl.uniform1f(uniformLocations.uSunIntensity, parameters.sunIntensity);
  gl.uniform1f(uniformLocations.uNoiseScale, parameters.noiseScale);
  gl.uniform1i(uniformLocations.uNoiseOctaves, parameters.noiseOctaves);
  gl.uniform1f(uniformLocations.uCloudDensity, parameters.cloudDensity);
  gl.uniform1f(uniformLocations.uCloudHeight, parameters.cloudHeight);
  gl.uniform1f(uniformLocations.uWindSpeed, parameters.windSpeed);
  gl.uniform3f(
    uniformLocations.uSunDirection,
    parameters.sunDirection.x,
    parameters.sunDirection.y,
    parameters.sunDirection.z
  );

  // Convert hex colors to RGB
  const sunColor = hexToRGB(parameters.sunColor);
  const skyColor = hexToRGB(parameters.skyColor);
  gl.uniform3f(uniformLocations.uSunColor, sunColor.r, sunColor.g, sunColor.b);
  gl.uniform3f(uniformLocations.uSkyColor, skyColor.r, skyColor.g, skyColor.b);
};

const hexToRGB = (hex: string) => {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;
  return { r, g, b };
};