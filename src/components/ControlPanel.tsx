import React from 'react';
import { Slider } from "@/components/ui/slider";
import { Card } from "@/components/ui/card";

interface ControlPanelProps {
  parameters: {
    stepSize: number;
    maxSteps: number;
    lightSampleDist: number;
    sunIntensity: number;
    noiseScale: number;
    noiseOctaves: number;
  };
  onParameterChange: (param: string, value: number) => void;
}

const ControlPanel: React.FC<ControlPanelProps> = ({ parameters, onParameterChange }) => {
  return (
    <div className="control-panel">
      <h2 className="text-lg font-bold mb-4">Cloud Parameters</h2>

      <div className="parameter-group">
        <h3 className="parameter-group-title">Rendering</h3>
        
        <div className="space-y-4">
          <div>
            <div className="parameter-label">
              <span>Step Size</span>
              <span className="parameter-value">{parameters.stepSize.toFixed(3)}</span>
            </div>
            <Slider
              value={[parameters.stepSize]}
              min={0.01}
              max={0.2}
              step={0.001}
              onValueChange={([value]) => onParameterChange('stepSize', value)}
              className="parameter-slider"
            />
          </div>

          <div>
            <div className="parameter-label">
              <span>Max Steps</span>
              <span className="parameter-value">{parameters.maxSteps}</span>
            </div>
            <Slider
              value={[parameters.maxSteps]}
              min={50}
              max={200}
              step={1}
              onValueChange={([value]) => onParameterChange('maxSteps', value)}
              className="parameter-slider"
            />
          </div>
        </div>
      </div>

      <div className="parameter-group">
        <h3 className="parameter-group-title">Lighting</h3>
        
        <div className="space-y-4">
          <div>
            <div className="parameter-label">
              <span>Light Sample Distance</span>
              <span className="parameter-value">{parameters.lightSampleDist.toFixed(2)}</span>
            </div>
            <Slider
              value={[parameters.lightSampleDist]}
              min={0.1}
              max={1.0}
              step={0.01}
              onValueChange={([value]) => onParameterChange('lightSampleDist', value)}
              className="parameter-slider"
            />
          </div>

          <div>
            <div className="parameter-label">
              <span>Sun Intensity</span>
              <span className="parameter-value">{parameters.sunIntensity.toFixed(2)}</span>
            </div>
            <Slider
              value={[parameters.sunIntensity]}
              min={0.1}
              max={2.0}
              step={0.01}
              onValueChange={([value]) => onParameterChange('sunIntensity', value)}
              className="parameter-slider"
            />
          </div>
        </div>
      </div>

      <div className="parameter-group">
        <h3 className="parameter-group-title">Noise</h3>
        
        <div className="space-y-4">
          <div>
            <div className="parameter-label">
              <span>Noise Scale</span>
              <span className="parameter-value">{parameters.noiseScale.toFixed(2)}</span>
            </div>
            <Slider
              value={[parameters.noiseScale]}
              min={0.5}
              max={5.0}
              step={0.1}
              onValueChange={([value]) => onParameterChange('noiseScale', value)}
              className="parameter-slider"
            />
          </div>

          <div>
            <div className="parameter-label">
              <span>Noise Octaves</span>
              <span className="parameter-value">{parameters.noiseOctaves}</span>
            </div>
            <Slider
              value={[parameters.noiseOctaves]}
              min={1}
              max={8}
              step={1}
              onValueChange={([value]) => onParameterChange('noiseOctaves', value)}
              className="parameter-slider"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ControlPanel;