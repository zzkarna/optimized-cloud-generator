import React from 'react';
import { Slider } from "@/components/ui/slider";

interface SunDirectionControlsProps {
  sunDirection: { x: number; y: number; z: number };
  onParameterChange: (param: string, value: { x: number; y: number; z: number }) => void;
}

const SunDirectionControls: React.FC<SunDirectionControlsProps> = ({
  sunDirection,
  onParameterChange,
}) => {
  return (
    <div className="parameter-group">
      <h3 className="parameter-group-title">Sun Direction</h3>
      
      <div className="space-y-4">
        <div>
          <div className="parameter-label">
            <span>X</span>
            <span className="parameter-value">{sunDirection.x.toFixed(2)}</span>
          </div>
          <Slider
            value={[sunDirection.x]}
            min={-1.0}
            max={1.0}
            step={0.01}
            onValueChange={([value]) => onParameterChange('sunDirection', { ...sunDirection, x: value })}
            className="parameter-slider"
          />
        </div>

        <div>
          <div className="parameter-label">
            <span>Y</span>
            <span className="parameter-value">{sunDirection.y.toFixed(2)}</span>
          </div>
          <Slider
            value={[sunDirection.y]}
            min={-1.0}
            max={1.0}
            step={0.01}
            onValueChange={([value]) => onParameterChange('sunDirection', { ...sunDirection, y: value })}
            className="parameter-slider"
          />
        </div>

        <div>
          <div className="parameter-label">
            <span>Z</span>
            <span className="parameter-value">{sunDirection.z.toFixed(2)}</span>
          </div>
          <Slider
            value={[sunDirection.z]}
            min={-1.0}
            max={1.0}
            step={0.01}
            onValueChange={([value]) => onParameterChange('sunDirection', { ...sunDirection, z: value })}
            className="parameter-slider"
          />
        </div>
      </div>
    </div>
  );
};

export default SunDirectionControls;