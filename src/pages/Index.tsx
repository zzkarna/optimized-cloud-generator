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
    noiseOctaves: 5,
    cloudDensity: 1.0,
    cloudHeight: 1.5,
    windSpeed: 0.5,
    sunDirection: { x: -0.8, y: 0.6, z: 0.3 },
    sunColor: '#ffa94d',
    skyColor: '#99bdff'
  });

  const handleParameterChange = (param: string, value: number | string | { x: number; y: number; z: number }) => {
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