import React from 'react';
import RenderingControls from './controls/RenderingControls';
import CloudShapeControls from './controls/CloudShapeControls';
import AnimationControls from './controls/AnimationControls';
import SunDirectionControls from './controls/SunDirectionControls';
import ColorControls from './controls/ColorControls';

interface ControlPanelProps {
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
  onParameterChange: (param: string, value: number | string | { x: number; y: number; z: number }) => void;
}

const ControlPanel: React.FC<ControlPanelProps> = ({ parameters, onParameterChange }) => {
  return (
    <div className="control-panel">
      <h2 className="text-lg font-bold mb-4">Cloud Parameters</h2>

      <RenderingControls
        stepSize={parameters.stepSize}
        maxSteps={parameters.maxSteps}
        onParameterChange={onParameterChange}
      />

      <CloudShapeControls
        cloudDensity={parameters.cloudDensity}
        cloudHeight={parameters.cloudHeight}
        onParameterChange={onParameterChange}
      />

      <AnimationControls
        windSpeed={parameters.windSpeed}
        onParameterChange={onParameterChange}
      />

      <SunDirectionControls
        sunDirection={parameters.sunDirection}
        onParameterChange={onParameterChange}
      />

      <ColorControls
        sunColor={parameters.sunColor}
        skyColor={parameters.skyColor}
        onParameterChange={onParameterChange}
      />
    </div>
  );
};

export default ControlPanel;