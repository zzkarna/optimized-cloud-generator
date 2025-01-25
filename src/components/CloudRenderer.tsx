import React, { useEffect, useRef } from 'react';

interface CloudRendererProps {
  parameters: {
    stepSize: number;
    maxSteps: number;
    lightSampleDist: number;
    sunIntensity: number;
    noiseScale: number;
    noiseOctaves: number;
  };
}

const CloudRenderer: React.FC<CloudRendererProps> = ({ parameters }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const glRef = useRef<WebGLRenderingContext | null>(null);
  const programRef = useRef<WebGLProgram | null>(null);
  const frameRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext('webgl');
    if (!gl) {
      console.error('WebGL not supported');
      return;
    }
    glRef.current = gl;

    // Initialize WebGL context and program
    initWebGL(gl);

    // Start render loop
    const animate = (time: number) => {
      render(time);
      frameRef.current = requestAnimationFrame(animate);
    };
    frameRef.current = requestAnimationFrame(animate);

    return () => {
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (!glRef.current || !programRef.current) return;
    
    const gl = glRef.current;
    const program = programRef.current;

    // Update uniforms based on parameters
    gl.useProgram(program);
    gl.uniform1f(gl.getUniformLocation(program, 'uStepSize'), parameters.stepSize);
    gl.uniform1i(gl.getUniformLocation(program, 'uMaxSteps'), parameters.maxSteps);
    gl.uniform1f(gl.getUniformLocation(program, 'uLightSampleDist'), parameters.lightSampleDist);
    gl.uniform1f(gl.getUniformLocation(program, 'uSunIntensity'), parameters.sunIntensity);
    gl.uniform1f(gl.getUniformLocation(program, 'uNoiseScale'), parameters.noiseScale);
    gl.uniform1i(gl.getUniformLocation(program, 'uNoiseOctaves'), parameters.noiseOctaves);
  }, [parameters]);

  const initWebGL = (gl: WebGLRenderingContext) => {
    const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
    const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);
    
    if (!vertexShader || !fragmentShader) return;

    const program = gl.createProgram();
    if (!program) return;

    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error('Program link failed:', gl.getProgramInfoLog(program));
      return;
    }

    programRef.current = program;

    // Create and bind vertex buffer
    const positions = new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]);
    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);
  };

  const render = (time: number) => {
    const gl = glRef.current;
    const program = programRef.current;
    if (!gl || !program) return;

    // Update canvas size
    const canvas = gl.canvas as HTMLCanvasElement;
    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;
    gl.viewport(0, 0, canvas.width, canvas.height);

    // Set up rendering
    gl.useProgram(program);
    const positionLocation = gl.getAttribLocation(program, 'position');
    gl.enableVertexAttribArray(positionLocation);
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

    // Update uniforms
    gl.uniform1f(gl.getUniformLocation(program, 'uTime'), time * 0.001);
    gl.uniform1f(gl.getUniformLocation(program, 'uFrame'), frameRef.current);

    // Draw
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
  };

  return (
    <canvas 
      ref={canvasRef}
      className="fixed inset-0 w-full h-full"
      style={{ touchAction: 'none' }}
    />
  );
};

const createShader = (gl: WebGLRenderingContext, type: number, source: string) => {
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

const vertexShaderSource = `
  attribute vec2 position;
  void main() {
    gl_Position = vec4(position, 0.0, 1.0);
  }
`;

const fragmentShaderSource = `
  precision highp float;
  
  uniform float uTime;
  uniform float uFrame;
  uniform float uStepSize;
  uniform int uMaxSteps;
  uniform float uLightSampleDist;
  uniform float uSunIntensity;
  uniform float uNoiseScale;
  uniform int uNoiseOctaves;

  // ... rest of your existing fragment shader code ...
`;

export default CloudRenderer;