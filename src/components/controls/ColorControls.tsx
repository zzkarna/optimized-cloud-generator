import React from 'react';

interface ColorControlsProps {
  sunColor: string;
  skyColor: string;
  onParameterChange: (param: string, value: string) => void;
}

const ColorControls: React.FC<ColorControlsProps> = ({
  sunColor,
  skyColor,
  onParameterChange,
}) => {
  return (
    <div className="parameter-group">
      <h3 className="parameter-group-title">Colors</h3>
      
      <div className="space-y-4">
        <div>
          <div className="parameter-label">
            <span>Sun Color</span>
          </div>
          <input
            type="color"
            value={sunColor}
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
            value={skyColor}
            onChange={(e) => onParameterChange('skyColor', e.target.value)}
            className="w-full h-8 rounded cursor-pointer"
          />
        </div>
      </div>
    </div>
  );
};

export default ColorControls;