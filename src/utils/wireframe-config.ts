import { useState, useEffect } from 'react';

interface WireframeConfig {
  heroCTA: string;
  heroTagline: string;
  secondaryCTA: string;
  carouselMode: 'auto-rotate' | 'manual' | 'simultaneous';
  trustSection: 'header' | 'hero' | 'dedicated';
  registrationFlow: 'easy' | 'multi-step' | 'role-specific';
  socialLogin: string[];
  searchSidebar: 'left-collapsed' | 'left-open' | 'top-bar';
  mapIntegration: 'region-start-end-highlights' | 'routes' | 'regions-only';
  additionalFilters: string[];
}

const defaultConfig: WireframeConfig = {
  heroCTA: "Find Your Adventure",
  heroTagline: "Discover epic hiking adventures",
  secondaryCTA: "Become a Guide",
  carouselMode: "manual",
  trustSection: "header",
  registrationFlow: "multi-step",
  socialLogin: ["google"],
  searchSidebar: "left-open",
  mapIntegration: "regions-only",
  additionalFilters: []
};

export function useWireframeConfig(): WireframeConfig {
  const [config, setConfig] = useState<WireframeConfig>(defaultConfig);

  useEffect(() => {
    const savedConfig = localStorage.getItem('madetohike-config');
    if (savedConfig) {
      try {
        const parsedConfig = JSON.parse(savedConfig);
        setConfig({ ...defaultConfig, ...parsedConfig });
      } catch (e) {
        console.error('Failed to parse wireframe config:', e);
      }
    }

    // Listen for config changes
    const handleConfigChange = () => {
      const updatedConfig = localStorage.getItem('madetohike-config');
      if (updatedConfig) {
        try {
          const parsedConfig = JSON.parse(updatedConfig);
          setConfig({ ...defaultConfig, ...parsedConfig });
        } catch (e) {
          console.error('Failed to parse updated wireframe config:', e);
        }
      }
    };

    window.addEventListener('madetohike-config-updated', handleConfigChange);
    return () => {
      window.removeEventListener('madetohike-config-updated', handleConfigChange);
    };
  }, []);

  return config;
}

export function getWireframeConfig(): WireframeConfig {
  try {
    const savedConfig = localStorage.getItem('madetohike-config');
    if (savedConfig) {
      const parsedConfig = JSON.parse(savedConfig);
      return { ...defaultConfig, ...parsedConfig };
    }
  } catch (e) {
    console.error('Failed to get wireframe config:', e);
  }
  return defaultConfig;
}

export function updateWireframeConfig(newConfig: Partial<WireframeConfig>) {
  const currentConfig = getWireframeConfig();
  const updatedConfig = { ...currentConfig, ...newConfig };
  localStorage.setItem('madetohike-config', JSON.stringify(updatedConfig));
  
  // Dispatch event to notify components
  window.dispatchEvent(new Event('madetohike-config-updated'));
}