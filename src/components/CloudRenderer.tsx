import React, { useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { toast } from "sonner";
import { createShader, vertexShaderSource, generateShaderCode } from '../utils/shaderUtils';
import { initWebGL, updateUniforms } from '../utils/webglUtils';
import { fragmentShaderSource } from '../shaders/cloudShader';

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

  const handleDownload = () => {
    try {
      const shaderCode = generateShaderCode(fragmentShaderSource);
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

    const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
    const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);
    const program = initWebGL(gl, vertexShader, fragmentShader);
    
    if (!program) return;
    programRef.current = program;

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
    updateUniforms(glRef.current, programRef.current, parameters);
  }, [parameters]);

  const render = (time: number) => {
    const gl = glRef.current;
    const program = programRef.current;
    if (!gl || !program) return;

    const canvas = gl.canvas as HTMLCanvasElement;
    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;
    gl.viewport(0, 0, canvas.width, canvas.height);

    gl.useProgram(program);
    const positionLocation = gl.getAttribLocation(program, 'position');
    gl.enableVertexAttribArray(positionLocation);
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

    gl.uniform1f(gl.getUniformLocation(program, 'uTime'), time * 0.001);
    gl.uniform1f(gl.getUniformLocation(program, 'uFrame'), frameRef.current);

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

export default CloudRenderer;