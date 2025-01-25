import React from 'react';
import { Slider } from "@/components/ui/slider";

interface CloudShapeControlsProps {
  cloudDensity: number;
  cloudHeight: number;
  onParameterChange: (param: string, value: number) => void;
}

const CloudShapeControls: React.FC<CloudShapeControlsProps> = ({
  cloudDensity,
  cloudHeight,
  onParameterChange,
}) => {
  return (
    <div className="parameter-group">
      <h3 className="parameter-group-title">Cloud Shape</h3>
      
      <div className="space-y-4">
        <div>
          <div className="parameter-label">
            <span>Cloud Density</span>
            <span className="parameter-value">{cloudDensity.toFixed(2)}</span>
          </div>
          <Slider
            value={[cloudDensity]}
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
            <span className="parameter-value">{cloudHeight.toFixed(2)}</span>
          </div>
          <Slider
            value={[cloudHeight]}
            min={0.5}
            max={3.0}
            step={0.1}
            onValueChange={([value]) => onParameterChange('cloudHeight', value)}
            className="parameter-slider"
          />
        </div>
      </div>
    </div>
  );
};

export default CloudShapeControls;