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

  // Create and bind vertex buffer
  const positions = new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]);
  const positionBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);

  return program;
};

export const updateUniforms = (
  gl: WebGLRenderingContext,
  program: WebGLProgram,
  parameters: any
) => {
  gl.useProgram(program);
  gl.uniform1f(gl.getUniformLocation(program, 'uStepSize'), parameters.stepSize);
  gl.uniform1i(gl.getUniformLocation(program, 'uMaxSteps'), parameters.maxSteps);
  gl.uniform1f(gl.getUniformLocation(program, 'uLightSampleDist'), parameters.lightSampleDist);
  gl.uniform1f(gl.getUniformLocation(program, 'uSunIntensity'), parameters.sunIntensity);
  gl.uniform1f(gl.getUniformLocation(program, 'uNoiseScale'), parameters.noiseScale);
  gl.uniform1i(gl.getUniformLocation(program, 'uNoiseOctaves'), parameters.noiseOctaves);
  gl.uniform1f(gl.getUniformLocation(program, 'uCloudDensity'), parameters.cloudDensity);
  gl.uniform1f(gl.getUniformLocation(program, 'uCloudHeight'), parameters.cloudHeight);
  gl.uniform1f(gl.getUniformLocation(program, 'uWindSpeed'), parameters.windSpeed);
  gl.uniform3f(
    gl.getUniformLocation(program, 'uSunDirection'),
    parameters.sunDirection.x,
    parameters.sunDirection.y,
    parameters.sunDirection.z
  );
  gl.uniform3f(
    gl.getUniformLocation(program, 'uSunColor'),
    parseInt(parameters.sunColor.slice(1), 16) / 0xFFFFFF,
    parseInt(parameters.sunColor.slice(1), 16) / 0xFFFFFF,
    parseInt(parameters.sunColor.slice(1), 16) / 0xFFFFFF
  );
  gl.uniform3f(
    gl.getUniformLocation(program, 'uSkyColor'),
    parseInt(parameters.skyColor.slice(1), 16) / 0xFFFFFF,
    parseInt(parameters.skyColor.slice(1), 16) / 0xFFFFFF,
    parseInt(parameters.skyColor.slice(1), 16) / 0xFFFFFF
  );
};