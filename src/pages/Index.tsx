import { useState } from 'react';
import CloudRenderer from '@/components/CloudRenderer';
import ControlPanel from '@/components/ControlPanel';

const Index = () => {
  const [parameters, setParameters] = useState({
    stepSize: 0.05,
    maxSteps: 100,
    lightSampleDist: 0.3,
    sunIntensity: 0.8,
    noiseScale: 2.0,
    noiseOctaves: 5
  });

  const handleParameterChange = (param: string, value: number) => {
    setParameters(prev => ({
      ...prev,
      [param]: value
    }));
  };

  return (
    <div className="relative w-screen h-screen">
      <CloudRenderer parameters={parameters} />
      <ControlPanel 
        parameters={parameters}
        onParameterChange={handleParameterChange}
      />
    </div>
  );
};

export default Index;