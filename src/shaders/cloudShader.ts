export const fragmentShaderSource = `
  precision highp float;
  
  uniform float uTime;
  uniform float uFrame;
  uniform float uStepSize;
  uniform int uMaxSteps;
  uniform float uLightSampleDist;
  uniform float uSunIntensity;
  uniform float uNoiseScale;
  uniform int uNoiseOctaves;
  uniform float uCloudDensity;
  uniform float uCloudHeight;
  uniform float uWindSpeed;
  uniform vec3 uSunDirection;
  uniform vec3 uSunColor;
  uniform vec3 uSkyColor;

  const vec3 SUN_DIR = normalize(vec3(-0.8, 0.6, 0.3));
  const vec3 SUN_COLOR = vec3(1.0, 0.6, 0.3);
  const vec3 SKY_COLOR = vec3(0.6, 0.6, 0.75);

  float hash(vec3 p) {
    p = fract(p * vec3(123.34, 456.21, 789.92));
    p += dot(p, p + 45.32);
    return fract(p.x * p.y * p.z);
  }

  float noise(vec3 p) {
    vec3 i = floor(p);
    vec3 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    
    return mix(
      mix(mix(hash(i), hash(i + vec3(1,0,0)), f.x),
          mix(hash(i + vec3(0,1,0)), hash(i + vec3(1,1,0)), f.x),
          f.y),
      mix(mix(hash(i + vec3(0,0,1)), hash(i + vec3(1,0,1)), f.x),
          mix(hash(i + vec3(0,1,1)), hash(i + vec3(1,1,1)), f.x),
          f.y),
      f.z
    ) * 2.0 - 1.0;
  }

  float fbm(vec3 p) {
    float f = 0.0;
    float amplitude = 0.5;
    float frequency = uNoiseScale;
    
    for(int i = 0; i < 8; i++) {
      if(i >= uNoiseOctaves) break;
      f += amplitude * noise(frequency * p);
      frequency *= 2.0;
      amplitude *= 0.5;
    }
    
    return f;
  }

  float sampleDensity(vec3 p) {
    float base = 1.0 - length(p) / (1.5 * uCloudHeight);
    float noise = fbm(p + vec3(uTime * uWindSpeed, 0.0, 0.0));
    return max(0.0, base + noise * 0.5) * uCloudDensity;
  }

  vec3 raymarch(vec3 ro, vec3 rd) {
    vec3 color = vec3(0.0);
    float transmittance = 1.0;
    
    float t = 0.0;
    for(int i = 0; i < 100; i++) {
      if(i >= uMaxSteps) break;
      
      vec3 p = ro + rd * t;
      float density = sampleDensity(p);
      
      if(density > 0.0) {
        float lightDensity = sampleDensity(p + uSunDirection * uLightSampleDist);
        float shadow = exp(-lightDensity * uLightSampleDist * 2.0);
        
        vec3 illumination = mix(uSkyColor, uSunColor * uSunIntensity * shadow, 0.5);
        color += transmittance * density * uStepSize * illumination;
        transmittance *= exp(-density * uStepSize);
        
        if(transmittance < 0.01) break;
      }
      
      t += uStepSize;
    }
    
    return color + uSkyColor * transmittance;
  }

  void main() {
    vec2 uv = (gl_FragCoord.xy / vec2(800.0, 600.0)) * 2.0 - 1.0;
    vec3 ro = vec3(0.0, 0.0, -3.0);
    vec3 rd = normalize(vec3(uv, 1.0));
    
    vec3 color = raymarch(ro, rd);
    gl_FragColor = vec4(color, 1.0);
  }
`;