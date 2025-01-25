export const fragmentShaderSource = `
  precision mediump float;
  
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

  // Optimized hash function
  float hash(vec3 p) {
    p = fract(p * vec3(123.34, 456.21, 789.92));
    p += dot(p, p + 45.32);
    return fract(p.x * p.y * p.z);
  }

  // Optimized noise function with fewer texture lookups
  float noise(vec3 p) {
    vec3 i = floor(p);
    vec3 f = fract(p);
    f = f * f * (3.0 - 2.0 * f); // Optimized smoothstep
    
    float n = mix(
      mix(mix(hash(i), hash(i + vec3(1,0,0)), f.x),
          mix(hash(i + vec3(0,1,0)), hash(i + vec3(1,1,0)), f.x),
          f.y),
      mix(mix(hash(i + vec3(0,0,1)), hash(i + vec3(1,0,1)), f.x),
          mix(hash(i + vec3(0,1,1)), hash(i + vec3(1,1,1)), f.x),
          f.y),
      f.z
    );
    
    return n * 2.0 - 1.0;
  }

  // Optimized FBM with early exit
  float fbm(vec3 p) {
    float f = 0.0;
    float amplitude = 0.5;
    float frequency = uNoiseScale;
    float maxAmplitude = 0.0;
    
    for(int i = 0; i < 8; i++) {
      if(i >= uNoiseOctaves || amplitude < 0.01) break;
      f += amplitude * noise(frequency * p);
      maxAmplitude += amplitude;
      frequency *= 2.0;
      amplitude *= 0.5;
    }
    
    return f / maxAmplitude;
  }

  // Optimized density sampling with distance-based early exit
  float sampleDensity(vec3 p) {
    float dist = length(p);
    if(dist > 2.0 * uCloudHeight) return 0.0;
    
    float base = 1.0 - dist / (1.5 * uCloudHeight);
    if(base <= 0.0) return 0.0;
    
    float noise = fbm(p + vec3(uTime * uWindSpeed, 0.0, 0.0));
    return max(0.0, base + noise * 0.5) * uCloudDensity;
  }

  // Optimized raymarching with adaptive step size and early termination
  vec3 raymarch(vec3 ro, vec3 rd) {
    vec3 color = vec3(0.0);
    float transmittance = 1.0;
    float stepSize = uStepSize;
    
    float t = 0.0;
    for(int i = 0; i < 100; i++) {
      if(i >= uMaxSteps || transmittance < 0.01) break;
      
      vec3 p = ro + rd * t;
      float density = sampleDensity(p);
      
      if(density > 0.0) {
        float dt = stepSize * (1.0 + 2.0 * transmittance); // Adaptive step size
        float lightDensity = sampleDensity(p + uSunDirection * uLightSampleDist);
        float shadow = exp(-lightDensity * uLightSampleDist * 2.0);
        
        vec3 illumination = mix(uSkyColor, uSunColor * uSunIntensity * shadow, 0.5);
        color += transmittance * density * dt * illumination;
        transmittance *= exp(-density * dt);
      }
      
      t += stepSize * (1.0 + transmittance); // Adaptive step size
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