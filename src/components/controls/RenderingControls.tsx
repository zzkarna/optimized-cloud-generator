import React from 'react';
import { Slider } from "@/components/ui/slider";

interface RenderingControlsProps {
  stepSize: number;
  maxSteps: number;
  onParameterChange: (param: string, value: number) => void;
}

const RenderingControls: React.FC<RenderingControlsProps> = ({
  stepSize,
  maxSteps,
  onParameterChange,
}) => {
  return (
    <div className="parameter-group">
      <h3 className="parameter-group-title">Rendering</h3>
      
      <div className="space-y-4">
        <div>
          <div className="parameter-label">
            <span>Step Size</span>
            <span className="parameter-value">{stepSize.toFixed(3)}</span>
          </div>
          <Slider
            value={[stepSize]}
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
            <span className="parameter-value">{maxSteps}</span>
          </div>
          <Slider
            value={[maxSteps]}
            min={50}
            max={200}
            step={1}
            onValueChange={([value]) => onParameterChange('maxSteps', value)}
            className="parameter-slider"
          />
        </div>
      </div>
    </div>
  );
};

export default RenderingControls;