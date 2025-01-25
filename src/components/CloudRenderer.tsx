import React, { useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { toast } from "sonner";

interface CloudRendererProps {
  parameters: {
    stepSize: number;
    maxSteps: number;
    lightSampleDist: number;
    sunIntensity: number;
    noiseScale: number;
    noiseOctaves: number;
    cloudDensity: number;
    cloudHeight: number;
    windSpeed: number;
    sunDirection: { x: number; y: number; z: number };
    sunColor: string;
    skyColor: string;
  };
}

const CloudRenderer: React.FC<CloudRendererProps> = ({ parameters }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const glRef = useRef<WebGLRenderingContext | null>(null);
  const programRef = useRef<WebGLProgram | null>(null);
  const frameRef = useRef<number>(0);

  const generateShaderCode = () => {
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

  const handleDownload = () => {
    try {
      const shaderCode = generateShaderCode();
      const blob = new Blob([shaderCode], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'cloudShader.glsl';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      toast.success("Shader code downloaded successfully");
    } catch (error) {
      toast.error("Failed to download shader code");
      console.error("Download error:", error);
    }
  };

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
    gl.uniform1f(gl.getUniformLocation(program, 'uCloudDensity'), parameters.cloudDensity);
    gl.uniform1f(gl.getUniformLocation(program, 'uCloudHeight'), parameters.cloudHeight);
    gl.uniform1f(gl.getUniformLocation(program, 'uWindSpeed'), parameters.windSpeed);
    gl.uniform3f(gl.getUniformLocation(program, 'uSunDirection'), parameters.sunDirection.x, parameters.sunDirection.y, parameters.sunDirection.z);
    gl.uniform3f(gl.getUniformLocation(program, 'uSunColor'), parseInt(parameters.sunColor.slice(1), 16) / 0xFFFFFF, parseInt(parameters.sunColor.slice(1), 16) / 0xFFFFFF, parseInt(parameters.sunColor.slice(1), 16) / 0xFFFFFF);
    gl.uniform3f(gl.getUniformLocation(program, 'uSkyColor'), parseInt(parameters.skyColor.slice(1), 16) / 0xFFFFFF, parseInt(parameters.skyColor.slice(1), 16) / 0xFFFFFF, parseInt(parameters.skyColor.slice(1), 16) / 0xFFFFFF);
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
    <div className="relative w-full h-full">
      <canvas 
        ref={canvasRef}
        className="fixed inset-0 w-full h-full"
        style={{ touchAction: 'none' }}
      />
      <Button
        onClick={handleDownload}
        className="fixed top-4 right-4 z-10"
        variant="secondary"
      >
        <Download className="mr-2" />
        Download Shader
      </Button>
    </div>
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
  uniform float uCloudDensity;
  uniform float uCloudHeight;
  uniform float uWindSpeed;
  uniform vec3 uSunDirection;
  uniform vec3 uSunColor;
  uniform vec3 uSkyColor;

  const vec3 SUN_DIR = normalize(vec3(-0.8, 0.6, 0.3));
  const vec3 SUN_COLOR = vec3(1.0, 0.6, 0.3);
  const vec3 SKY_COLOR = vec3(0.6, 0.6, 0.75);

  float hash(vec3 p) {
    p = fract(p * vec3(123.34, 456.21, 789.92));
    p += dot(p, p + 45.32);
    return fract(p.x * p.y * p.z);
  }

  float noise(vec3 p) {
    vec3 i = floor(p);
    vec3 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    
    return mix(
      mix(mix(hash(i), hash(i + vec3(1,0,0)), f.x),
          mix(hash(i + vec3(0,1,0)), hash(i + vec3(1,1,0)), f.x),
          f.y),
      mix(mix(hash(i + vec3(0,0,1)), hash(i + vec3(1,0,1)), f.x),
          mix(hash(i + vec3(0,1,1)), hash(i + vec3(1,1,1)), f.x),
          f.y),
      f.z
    ) * 2.0 - 1.0;
  }

  float fbm(vec3 p) {
    float f = 0.0;
    float amplitude = 0.5;
    float frequency = uNoiseScale;
    
    for(int i = 0; i < 8; i++) {
      if(i >= uNoiseOctaves) break;
      f += amplitude * noise(frequency * p);
      frequency *= 2.0;
      amplitude *= 0.5;
    }
    
    return f;
  }

  float sampleDensity(vec3 p) {
    float base = 1.0 - length(p) / (1.5 * uCloudHeight);
    float noise = fbm(p + vec3(uTime * uWindSpeed, 0.0, 0.0));
    return max(0.0, base + noise * 0.5) * uCloudDensity;
  }

  vec3 raymarch(vec3 ro, vec3 rd) {
    vec3 color = vec3(0.0);
    float transmittance = 1.0;
    
    float t = 0.0;
    for(int i = 0; i < 100; i++) {
      if(i >= uMaxSteps) break;
      
      vec3 p = ro + rd * t;
      float density = sampleDensity(p);
      
      if(density > 0.0) {
        float lightDensity = sampleDensity(p + uSunDirection * uLightSampleDist);
        float shadow = exp(-lightDensity * uLightSampleDist * 2.0);
        
        vec3 illumination = mix(uSkyColor, uSunColor * uSunIntensity * shadow, 0.5);
        color += transmittance * density * uStepSize * illumination;
        transmittance *= exp(-density * uStepSize);
        
        if(transmittance < 0.01) break;
      }
      
      t += uStepSize;
    }
    
    return color + uSkyColor * transmittance;
  }

  void main() {
    vec2 uv = (gl_FragCoord.xy / vec2(800.0, 600.0)) * 2.0 - 1.0;
    vec3 ro = vec3(0.0, 0.0, -3.0);
    vec3 rd = normalize(vec3(uv, 1.0));
    
    vec3 color = raymarch(ro, rd);
    gl_FragColor = vec4(color, 1.0);
  }
`;

export default CloudRenderer;
