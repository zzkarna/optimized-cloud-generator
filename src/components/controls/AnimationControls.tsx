import React from 'react';
import { Slider } from "@/components/ui/slider";

interface AnimationControlsProps {
  windSpeed: number;
  onParameterChange: (param: string, value: number) => void;
}

const AnimationControls: React.FC<AnimationControlsProps> = ({
  windSpeed,
  onParameterChange,
}) => {
  return (
    <div className="parameter-group">
      <h3 className="parameter-group-title">Animation</h3>
      
      <div className="space-y-4">
        <div>
          <div className="parameter-label">
            <span>Wind Speed</span>
            <span className="parameter-value">{windSpeed.toFixed(2)}</span>
          </div>
          <Slider
            value={[windSpeed]}
            min={0.0}
            max={2.0}
            step={0.01}
            onValueChange={([value]) => onParameterChange('windSpeed', value)}
            className="parameter-slider"
          />
        </div>
      </div>
    </div>
  );
};

export default AnimationControls;