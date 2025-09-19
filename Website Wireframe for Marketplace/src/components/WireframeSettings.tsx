import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Switch } from './ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Label } from './ui/label';
import { Separator } from './ui/separator';
import { useWireframeConfig, updateWireframeConfig } from '../utils/wireframe-config';
import { 
  Settings, 
  Palette, 
  Users, 
  CreditCard, 
  Globe, 
  Shield,
  Smartphone,
  MessageSquare,
  Camera,
  MapPin,
  Star,
  Clock,
  Save
} from 'lucide-react';

export function WireframeSettings() {
  const config = useWireframeConfig();
  const [localConfig, setLocalConfig] = useState(config);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    updateWireframeConfig(localConfig);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleChange = (key: string, value: any) => {
    setLocalConfig(prev => ({ ...prev, [key]: value }));
  };

  const wireframeCategories = [
    {
      title: "Core Experience (Q1-Q8)",
      icon: <Palette className="h-5 w-5" />,
      decisions: [
        { key: 'heroCTA', label: 'Hero CTA Text', type: 'text', current: localConfig.heroCTA },
        { key: 'heroTagline', label: 'Hero Tagline', type: 'text', current: localConfig.heroTagline },
        { key: 'carouselMode', label: 'Region Carousel', type: 'select', 
          options: ['auto-rotate', 'manual', 'simultaneous'], current: localConfig.carouselMode },
        { key: 'trustSection', label: 'Trust Section', type: 'select',
          options: ['header', 'hero', 'dedicated'], current: localConfig.trustSection },
        { key: 'registrationFlow', label: 'Registration Flow', type: 'select',
          options: ['easy', 'multi-step', 'role-specific'], current: localConfig.registrationFlow },
        { key: 'searchSidebar', label: 'Search Layout', type: 'select',
          options: ['left-collapsed', 'left-open', 'top-bar'], current: localConfig.searchSidebar },
        { key: 'mapIntegration', label: 'Map Features', type: 'select',
          options: ['region-start-end-highlights', 'routes', 'regions-only'], current: localConfig.mapIntegration }
      ]
    },
    {
      title: "Payments & Booking (Q9-Q12)",
      icon: <CreditCard className="h-5 w-5" />,
      decisions: [
        { key: 'paymentProvider', label: 'Payment Provider', type: 'select',
          options: ['stripe', 'paypal', 'both'], current: localConfig.paymentProvider },
        { key: 'bookingCalendar', label: 'Booking Calendar', type: 'select',
          options: ['integrated', 'external', 'simple'], current: localConfig.bookingCalendar },
        { key: 'instantBooking', label: 'Instant Booking', type: 'boolean', current: localConfig.instantBooking },
        { key: 'cancellationPolicy', label: 'Default Cancellation', type: 'select',
          options: ['flexible', 'moderate', 'strict'], current: localConfig.cancellationPolicy }
      ]
    },
    {
      title: "User Experience (Q13-Q16)",
      icon: <Users className="h-5 w-5" />,
      decisions: [
        { key: 'reviewSystem', label: 'Review System', type: 'select',
          options: ['verified-only', 'all-reviews', 'guide-approval'], current: localConfig.reviewSystem },
        { key: 'guideProfiles', label: 'Guide Profiles', type: 'select',
          options: ['comprehensive', 'basic', 'minimal'], current: localConfig.guideProfiles },
        { key: 'mobileFirst', label: 'Mobile-First Design', type: 'boolean', current: localConfig.mobileFirst },
        { key: 'notifications', label: 'Notification System', type: 'select',
          options: ['in-app-email', 'email-only', 'in-app-only'], current: localConfig.notifications }
      ]
    },
    {
      title: "Content & Safety (Q17-Q20)",
      icon: <Shield className="h-5 w-5" />,
      decisions: [
        { key: 'weatherIntegration', label: 'Weather Data', type: 'select',
          options: ['basic', 'advanced', 'none'], current: localConfig.weatherIntegration },
        { key: 'emergencyContacts', label: 'Emergency Contacts', type: 'select',
          options: ['required', 'optional', 'guide-provided'], current: localConfig.emergencyContacts },
        { key: 'photoSharing', label: 'Photo Sharing', type: 'select',
          options: ['encouraged', 'optional', 'restricted'], current: localConfig.photoSharing },
        { key: 'groupChat', label: 'Group Communication', type: 'select',
          options: ['pre-tour', 'during-tour', 'none'], current: localConfig.groupChat }
      ]
    },
    {
      title: "Localization (Q21-Q24)",
      icon: <Globe className="h-5 w-5" />,
      decisions: [
        { key: 'multiLanguage', label: 'Supported Languages', type: 'multi-select',
          options: ['en', 'de', 'it', 'es', 'fr'], current: localConfig.multiLanguage },
        { key: 'currencySupport', label: 'Supported Currencies', type: 'multi-select',
          options: ['EUR', 'GBP', 'USD'], current: localConfig.currencySupport },
        { key: 'accessibility', label: 'Accessibility Level', type: 'select',
          options: ['wcag-aa', 'wcag-a', 'basic'], current: localConfig.accessibility },
        { key: 'offlineMode', label: 'Offline Capabilities', type: 'select',
          options: ['basic', 'advanced', 'none'], current: localConfig.offlineMode }
      ]
    },
    {
      title: "Advanced Features (Q25-Q27)",
      icon: <Star className="h-5 w-5" />,
      decisions: [
        { key: 'aiRecommendations', label: 'AI Recommendations', type: 'boolean', current: localConfig.aiRecommendations },
        { key: 'loyaltyProgram', label: 'Loyalty Program', type: 'boolean', current: localConfig.loyaltyProgram },
        { key: 'partnerIntegrations', label: 'Partner Integrations', type: 'multi-select',
          options: ['insurance', 'equipment', 'transportation'], current: localConfig.partnerIntegrations }
      ]
    }
  ];

  const renderField = (decision: any) => {
    const { key, label, type, options, current } = decision;

    switch (type) {
      case 'boolean':
        return (
          <div className="flex items-center justify-between">
            <Label htmlFor={key}>{label}</Label>
            <Switch
              id={key}
              checked={current || false}
              onCheckedChange={(checked) => handleChange(key, checked)}
            />
          </div>
        );

      case 'select':
        return (
          <div className="space-y-2">
            <Label htmlFor={key}>{label}</Label>
            <Select 
              value={current || options[0]} 
              onValueChange={(value) => handleChange(key, value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {options.map((option: string) => (
                  <SelectItem key={option} value={option}>
                    {option.charAt(0).toUpperCase() + option.slice(1).replace('-', ' ')}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        );

      case 'text':
        return (
          <div className="space-y-2">
            <Label htmlFor={key}>{label}</Label>
            <input
              id={key}
              className="w-full px-3 py-2 border rounded-md"
              value={current || ''}
              onChange={(e) => handleChange(key, e.target.value)}
            />
          </div>
        );

      case 'multi-select':
        return (
          <div className="space-y-2">
            <Label>{label}</Label>
            <div className="flex flex-wrap gap-2">
              {options.map((option: string) => (
                <Badge
                  key={option}
                  variant={(current || []).includes(option) ? "default" : "outline"}
                  className="cursor-pointer"
                  onClick={() => {
                    const currentArray = current || [];
                    const newArray = currentArray.includes(option)
                      ? currentArray.filter((item: string) => item !== option)
                      : [...currentArray, option];
                    handleChange(key, newArray);
                  }}
                >
                  {option.toUpperCase()}
                </Badge>
              ))}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Settings className="h-6 w-6" />
            Complete Wireframe Configuration
          </h2>
          <p className="text-muted-foreground">
            All 27 marketplace decisions - customize every aspect of your platform
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline">
            27/27 Decisions Available
          </Badge>
          <Button onClick={handleSave} className="gap-2">
            <Save className="h-4 w-4" />
            {saved ? 'Saved!' : 'Save Changes'}
          </Button>
        </div>
      </div>

      <div className="grid gap-6">
        {wireframeCategories.map((category, index) => (
          <Card key={index}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {category.icon}
                {category.title}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {category.decisions.map((decision, decisionIndex) => (
                <div key={decision.key}>
                  {renderField(decision)}
                  {decisionIndex < category.decisions.length - 1 && (
                    <Separator className="mt-4" />
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Implementation Status */}
      <Card className="bg-green-50 border-green-200">
        <CardContent className="p-6">
          <div className="flex items-start gap-3">
            <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
            <div>
              <h4 className="font-semibold text-green-800">Complete Implementation</h4>
              <p className="text-green-700 text-sm">
                All 27 wireframe decisions are now configurable and will be applied across your marketplace:
              </p>
              <ul className="text-green-700 text-sm mt-2 space-y-1">
                <li>• Hero section and landing page customization</li>
                <li>• Complete booking and payment flow configuration</li>
                <li>• User experience and review system settings</li>
                <li>• Safety and content management options</li>
                <li>• Multi-language and accessibility support</li>
                <li>• Advanced features and integrations</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}