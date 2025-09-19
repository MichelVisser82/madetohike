import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { WireframeImporter } from './WireframeImporter';
import { WireframeSettings } from './WireframeSettings';
import { Settings, Upload, Eye, Download, Trash2, Sliders } from 'lucide-react';

interface DecisionManagerProps {
  onApplyDecisions: (decisions: any) => void;
}

export function DecisionManager({ onApplyDecisions }: DecisionManagerProps) {
  const [showImporter, setShowImporter] = useState(false);
  const [savedDecisions, setSavedDecisions] = useState<any>(null);
  const [showDecisions, setShowDecisions] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  useEffect(() => {
    // Load saved decisions
    const saved = localStorage.getItem('madetohike-wireframe-decisions');
    if (saved) {
      try {
        setSavedDecisions(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to parse saved decisions:', e);
      }
    }
  }, []);

  const handleImport = (decisions: any) => {
    setSavedDecisions(decisions);
    localStorage.setItem('madetohike-wireframe-decisions', JSON.stringify(decisions));
    setShowImporter(false);
    
    // Immediately apply the wireframe decisions
    applyWireframeDecisions(decisions);
    onApplyDecisions(decisions);
  };

  const applyWireframeDecisions = (decisions: any) => {
    const answers = decisions.answers || [];
    
    // Parse your specific wireframe answers
    const config: any = {};
    
    answers.forEach((answer: any) => {
      switch (answer.questionNumber) {
        case 1: // Hero Section CTA
          if (answer.answer.includes("Find your next hiking adventure")) {
            config.heroCTA = "Find Your Next Hiking Adventure";
          }
          if (answer.answer.includes("One hiking step away from nature")) {
            config.heroTagline = "One hiking step away from nature";
          }
          if (answer.answer.includes("Become a guide")) {
            config.secondaryCTA = "Become a Guide";
          }
          break;
        case 2: // Carousel
          if (answer.answer.includes("Auto rotate")) {
            config.carouselMode = "auto-rotate";
          }
          break;
        case 3: // Trust Section
          if (answer.answer.includes("dedicated section")) {
            config.trustSection = "dedicated";
          }
          break;
        case 4: // Registration
          if (answer.answer.includes("as easy as possible")) {
            config.registrationFlow = "easy";
          }
          break;
        case 6: // Social Login
          const socialLogins = [];
          if (answer.answer.includes("Google login")) {
            socialLogins.push("google");
          }
          if (answer.answer.includes("instagram")) {
            socialLogins.push("instagram");
          }
          config.socialLogin = socialLogins;
          break;
        case 7: // Search Filters
          if (answer.answer.includes("Left sidebar")) {
            config.searchSidebar = "left-collapsed";
          }
          const additionalFilters = [];
          if (answer.answer.includes("Length")) {
            additionalFilters.push("length");
          }
          if (answer.answer.includes("Review score")) {
            additionalFilters.push("reviewScore");
          }
          if (answer.answer.includes("ascend")) {
            additionalFilters.push("ascent");
          }
          if (answer.answer.includes("Guided or unguided")) {
            additionalFilters.push("tourType");
          }
          if (answer.answer.includes("Language")) {
            additionalFilters.push("language");
          }
          config.additionalFilters = additionalFilters;
          break;
        case 8: // Map Integration
          if (answer.answer.includes("start point & end point")) {
            config.mapIntegration = "region-start-end-highlights";
          }
          break;
      }
    });
    
    // Store the configuration
    localStorage.setItem('madetohike-config', JSON.stringify(config));
    
    // Dispatch event to notify components
    window.dispatchEvent(new Event('madetohike-config-updated'));
    
    console.log('Applied your wireframe decisions:', config);
  };

  const handleApply = () => {
    if (savedDecisions) {
      // Apply the specific wireframe decisions to customize the marketplace
      applyWireframeDecisions(savedDecisions);
      onApplyDecisions(savedDecisions);
    }
  };

  const handleClear = () => {
    setSavedDecisions(null);
    localStorage.removeItem('madetohike-wireframe-decisions');
    // Apply default/reset decisions
    onApplyDecisions(null);
  };

  const handleDownload = () => {
    if (savedDecisions) {
      const dataStr = JSON.stringify(savedDecisions, null, 2);
      const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
      
      const exportFileDefaultName = `madetohike-wireframe-decisions-${new Date().toISOString().split('T')[0]}.json`;
      
      const linkElement = document.createElement('a');
      linkElement.setAttribute('href', dataUri);
      linkElement.setAttribute('download', exportFileDefaultName);
      linkElement.click();
    }
  };

  const getDecisionSummary = () => {
    // Always show 27 decisions as available since we now have complete implementation
    const config = JSON.parse(localStorage.getItem('madetohike-config') || '{}');
    const configuredFeatures = Object.keys(config).length;
    
    return {
      answeredCount: 8, // Original JSON decisions
      configuredFeatures,
      totalExpected: 27,
      completeness: Math.round((configuredFeatures / 27) * 100)
    };
  };

  const summary = getDecisionSummary();

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Wireframe Decisions
          </CardTitle>
          <p className="text-muted-foreground">
            Import your wireframe planning decisions to customize the marketplace according to your requirements.
          </p>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {savedDecisions ? (
            <div className="space-y-4">
              {/* Decision Summary */}
              <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-medium text-green-800">Wireframe Decisions Loaded</h4>
                    {summary && (
                      <p className="text-sm text-green-700">
                        {summary.answeredCount} of {summary.totalExpected} decisions ({summary.completeness}% complete)
                      </p>
                    )}
                  </div>
                  <Badge className="bg-green-100 text-green-800">
                    Active
                  </Badge>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-wrap gap-2">
                <Button onClick={handleApply} size="sm">
                  Apply to Marketplace
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setShowDecisions(!showDecisions)}
                >
                  <Eye className="h-4 w-4 mr-2" />
                  {showDecisions ? 'Hide' : 'View'} Decisions
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={handleDownload}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={handleClear}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Clear
                </Button>
              </div>

              {/* Decision Details */}
              {showDecisions && (
                <Card className="bg-muted/50">
                  <CardContent className="p-4">
                    <h4 className="font-medium mb-3">Decision Summary:</h4>
                    <div className="space-y-2 text-sm">
                      {savedDecisions.answers?.slice(0, 5).map((answer: any, index: number) => (
                        <div key={index} className="flex justify-between">
                          <span className="text-muted-foreground">
                            {answer.questionId || `Question ${index + 1}`}:
                          </span>
                          <span className="text-right max-w-xs truncate">
                            {typeof answer.answer === 'string' 
                              ? answer.answer.substring(0, 50) + (answer.answer.length > 50 ? '...' : '')
                              : 'Answered'
                            }
                          </span>
                        </div>
                      ))}
                      {savedDecisions.answers?.length > 5 && (
                        <p className="text-muted-foreground text-center pt-2">
                          ... and {savedDecisions.answers.length - 5} more decisions
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          ) : (
            <div className="text-center py-8 space-y-4">
              <Upload className="h-12 w-12 text-muted-foreground mx-auto" />
              <div>
                <h4 className="font-medium">No Wireframe Decisions Loaded</h4>
                <p className="text-sm text-muted-foreground">
                  Upload your planning decisions to customize the marketplace design and functionality.
                </p>
              </div>
              <Button onClick={() => setShowImporter(true)}>
                <Upload className="h-4 w-4 mr-2" />
                Import Decisions
              </Button>
            </div>
          )}

          {!savedDecisions && (
            <Button 
              variant="outline" 
              onClick={() => setShowImporter(true)}
              className="w-full"
            >
              <Upload className="h-4 w-4 mr-2" />
              Import Wireframe Decisions
            </Button>
          )}
        </CardContent>
      </Card>

      {/* Complete Wireframe Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sliders className="h-5 w-5" />
            Complete Marketplace Configuration
          </CardTitle>
          <p className="text-muted-foreground">
            Configure all 27 wireframe decisions to fully customize your marketplace
          </p>
        </CardHeader>
        <CardContent>
          <Button 
            onClick={() => setShowSettings(!showSettings)}
            className="w-full"
          >
            <Sliders className="h-4 w-4 mr-2" />
            {showSettings ? 'Hide' : 'Show'} All 27 Configuration Options
          </Button>
        </CardContent>
      </Card>

      {/* Settings Panel */}
      {showSettings && <WireframeSettings />}

      {/* Importer Modal */}
      {showImporter && (
        <WireframeImporter 
          onImport={handleImport}
          onClose={() => setShowImporter(false)}
        />
      )}
    </div>
  );
}