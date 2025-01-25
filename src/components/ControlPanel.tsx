import React from 'react';
import { Slider } from "@/components/ui/slider";
import { Card } from "@/components/ui/card";
import { ColorPicker } from "@/components/ui/color-picker";

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
        <h3 className="parameter-group-title">Cloud Shape</h3>
        
        <div className="space-y-4">
          <div>
            <div className="parameter-label">
              <span>Cloud Density</span>
              <span className="parameter-value">{parameters.cloudDensity.toFixed(2)}</span>
            </div>
            <Slider
              value={[parameters.cloudDensity]}
              min={0.1}
              max={2.0}
              step={0.01}
              onValueChange={([value]) => onParameterChange('cloudDensity', value)}
              className="parameter-slider"
            />
          </div>

          <div>
            <div className="parameter-label">
              <span>Cloud Height</span>
              <span className="parameter-value">{parameters.cloudHeight.toFixed(2)}</span>
            </div>
            <Slider
              value={[parameters.cloudHeight]}
              min={0.5}
              max={3.0}
              step={0.1}
              onValueChange={([value]) => onParameterChange('cloudHeight', value)}
              className="parameter-slider"
            />
          </div>
        </div>
      </div>

      <div className="parameter-group">
        <h3 className="parameter-group-title">Animation</h3>
        
        <div className="space-y-4">
          <div>
            <div className="parameter-label">
              <span>Wind Speed</span>
              <span className="parameter-value">{parameters.windSpeed.toFixed(2)}</span>
            </div>
            <Slider
              value={[parameters.windSpeed]}
              min={0.0}
              max={2.0}
              step={0.01}
              onValueChange={([value]) => onParameterChange('windSpeed', value)}
              className="parameter-slider"
            />
          </div>
        </div>
      </div>

      <div className="parameter-group">
        <h3 className="parameter-group-title">Sun Direction</h3>
        
        <div className="space-y-4">
          <div>
            <div className="parameter-label">
              <span>X</span>
              <span className="parameter-value">{parameters.sunDirection.x.toFixed(2)}</span>
            </div>
            <Slider
              value={[parameters.sunDirection.x]}
              min={-1.0}
              max={1.0}
              step={0.01}
              onValueChange={([value]) => onParameterChange('sunDirection', { ...parameters.sunDirection, x: value })}
              className="parameter-slider"
            />
          </div>

          <div>
            <div className="parameter-label">
              <span>Y</span>
              <span className="parameter-value">{parameters.sunDirection.y.toFixed(2)}</span>
            </div>
            <Slider
              value={[parameters.sunDirection.y]}
              min={-1.0}
              max={1.0}
              step={0.01}
              onValueChange={([value]) => onParameterChange('sunDirection', { ...parameters.sunDirection, y: value })}
              className="parameter-slider"
            />
          </div>

          <div>
            <div className="parameter-label">
              <span>Z</span>
              <span className="parameter-value">{parameters.sunDirection.z.toFixed(2)}</span>
            </div>
            <Slider
              value={[parameters.sunDirection.z]}
              min={-1.0}
              max={1.0}
              step={0.01}
              onValueChange={([value]) => onParameterChange('sunDirection', { ...parameters.sunDirection, z: value })}
              className="parameter-slider"
            />
          </div>
        </div>
      </div>

      <div className="parameter-group">
        <h3 className="parameter-group-title">Colors</h3>
        
        <div className="space-y-4">
          <div>
            <div className="parameter-label">
              <span>Sun Color</span>
            </div>
            <input
              type="color"
              value={parameters.sunColor}
              onChange={(e) => onParameterChange('sunColor', e.target.value)}
              className="w-full h-8 rounded cursor-pointer"
            />
          </div>

          <div>
            <div className="parameter-label">
              <span>Sky Color</span>
            </div>
            <input
              type="color"
              value={parameters.skyColor}
              onChange={(e) => onParameterChange('skyColor', e.target.value)}
              className="w-full h-8 rounded cursor-pointer"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ControlPanel;
