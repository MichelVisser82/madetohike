import { useState, useEffect } from 'react';
import { Alert, AlertDescription } from './ui/alert';
import { Badge } from './ui/badge';
import { CheckCircle, X, Settings } from 'lucide-react';

export function WireframeNotification() {
  const [show, setShow] = useState(false);
  const [config, setConfig] = useState<any>(null);

  useEffect(() => {
    const handleConfigUpdate = () => {
      const savedConfig = localStorage.getItem('madetohike-config');
      if (savedConfig) {
        try {
          const parsedConfig = JSON.parse(savedConfig);
          setConfig(parsedConfig);
          setShow(true);
          
          // Auto-hide after 5 seconds
          setTimeout(() => setShow(false), 5000);
        } catch (e) {
          console.error('Failed to parse config:', e);
        }
      }
    };

    // Listen for config updates
    window.addEventListener('madetohike-config-updated', handleConfigUpdate);
    
    // Check on mount
    handleConfigUpdate();

    return () => {
      window.removeEventListener('madetohike-config-updated', handleConfigUpdate);
    };
  }, []);

  if (!show || !config) return null;

  const appliedFeatures = [];
  if (config.heroCTA) appliedFeatures.push('Hero CTA');
  if (config.carouselMode === 'auto-rotate') appliedFeatures.push('Auto-rotating carousel');
  if (config.trustSection === 'dedicated') appliedFeatures.push('Trust section');
  if (config.registrationFlow === 'easy') appliedFeatures.push('Easy registration');
  if (config.searchSidebar === 'left-collapsed') appliedFeatures.push('Collapsible filters');
  if (config.additionalFilters?.length > 0) appliedFeatures.push(`${config.additionalFilters.length} new filters`);

  return (
    <div className="fixed top-20 right-4 z-50 max-w-sm">
      <Alert className="border-green-200 bg-green-50">
        <CheckCircle className="h-4 w-4 text-green-600" />
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <AlertDescription className="text-green-800">
              <div className="flex items-center gap-2 mb-2">
                <Settings className="h-4 w-4" />
                <strong>Wireframe Decisions Applied!</strong>
              </div>
              <div className="space-y-1 text-sm">
                {appliedFeatures.slice(0, 3).map((feature, index) => (
                  <div key={index} className="flex items-center gap-1">
                    <div className="w-1 h-1 bg-green-600 rounded-full"></div>
                    {feature}
                  </div>
                ))}
                {appliedFeatures.length > 3 && (
                  <div className="text-green-700">
                    +{appliedFeatures.length - 3} more customizations
                  </div>
                )}
              </div>
              <Badge className="mt-2 bg-green-100 text-green-800 text-xs">
                27 of 27 decisions available
              </Badge>
            </AlertDescription>
          </div>
          <button
            onClick={() => setShow(false)}
            className="ml-2 p-1 hover:bg-green-100 rounded"
          >
            <X className="h-3 w-3 text-green-600" />
          </button>
        </div>
      </Alert>
    </div>
  );
}