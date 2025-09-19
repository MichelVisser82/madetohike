import { useState } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';

export function WireframeDesign() {
  const [selectedPage, setSelectedPage] = useState<string>('landing');

  const pages = {
    landing: {
      title: 'Landing Page',
      sections: [
        'Navigation Header',
        'Hero Section with Search',
        'Featured Regions (Dolomites, Pyrenees, Scotland)',
        'How It Works Section',
        'Trust Section',
        'Featured Tours',
        'Footer'
      ]
    },
    search: {
      title: 'Search & Discovery',
      sections: [
        'Navigation Header',
        'Search Filters Sidebar',
        'Tour Grid with Enhanced Cards',
        'Map View Toggle',
        'Pagination',
        'Sort Options'
      ]
    },
    'tour-detail': {
      title: 'Tour Detail Page',
      sections: [
        'Navigation Header',
        'Tour Image Gallery',
        'Tour Information & Pricing',
        'Guide Profile Section',
        'Booking Calendar',
        'Reviews & Ratings',
        'Similar Tours'
      ]
    },
    'user-dashboard': {
      title: 'Hiker Dashboard',
      sections: [
        'Navigation Header',
        'Profile Overview',
        'My Bookings',
        'Saved Tours',
        'Message Center',
        'Payment History',
        'Settings Panel'
      ]
    },
    'guide-dashboard': {
      title: 'Guide Dashboard',
      sections: [
        'Navigation Header',
        'Earnings Overview',
        'Tour Management',
        'Calendar & Availability',
        'Booking Requests',
        'Reviews Management',
        'Profile Settings'
      ]
    },
    booking: {
      title: 'Booking Flow',
      sections: [
        'Navigation Header',
        'Tour Summary',
        'Date Selection',
        'Group Size Selection',
        'Personal Information',
        'Payment Processing',
        'Confirmation'
      ]
    },
    auth: {
      title: 'Authentication',
      sections: [
        'Login Form',
        'Registration Form',
        'Role Selection (Hiker/Guide)',
        'Social Login Options',
        'Password Reset',
        'Email Verification'
      ]
    }
  };

  const userFlows = [
    {
      title: 'Hiker Journey',
      steps: [
        'Land on homepage',
        'Search for tours',
        'Filter by region/difficulty',
        'View tour details',
        'Check guide profile',
        'Select dates & book',
        'Make payment',
        'Receive confirmation'
      ],
      color: 'bg-blue-100 text-blue-800'
    },
    {
      title: 'Guide Journey',
      steps: [
        'Register as guide',
        'Complete profile',
        'Create tour listings',
        'Set availability',
        'Manage bookings',
        'Communicate with hikers',
        'Receive payments',
        'Get reviews'
      ],
      color: 'bg-green-100 text-green-800'
    }
  ];

  const wireframeLayout = (pageName: string) => {
    const page = pages[pageName as keyof typeof pages];
    
    return (
      <div className="border-2 border-dashed border-gray-300 p-4 bg-white min-h-[600px]">
        <div className="text-center mb-4 p-2 bg-gray-100 rounded">
          <h3 className="font-medium">{page.title}</h3>
        </div>
        
        <div className="space-y-3">
          {page.sections.map((section, index) => (
            <div 
              key={index} 
              className="border border-gray-200 p-3 rounded bg-gray-50"
            >
              <div className="text-sm font-medium text-gray-700">{section}</div>
              <div className="mt-1 space-y-1">
                {section === 'Navigation Header' && (
                  <div className="flex justify-between items-center text-xs text-gray-500">
                    <div>Logo | MadeToHike</div>
                    <div>Find Tours | Settings | Dashboard | Sign In</div>
                  </div>
                )}
                {section === 'Hero Section with Search' && (
                  <div className="space-y-1 text-xs text-gray-500">
                    <div>[Hero Image Background]</div>
                    <div>Find Your Next Adventure</div>
                    <div>[Search Bar with Region/Date filters]</div>
                  </div>
                )}
                {section === 'Tour Grid with Enhanced Cards' && (
                  <div className="grid grid-cols-3 gap-2 text-xs text-gray-500">
                    <div className="border p-2 rounded">[Tour Card 1]</div>
                    <div className="border p-2 rounded">[Tour Card 2]</div>
                    <div className="border p-2 rounded">[Tour Card 3]</div>
                  </div>
                )}
                {section === 'Tour Information & Pricing' && (
                  <div className="space-y-1 text-xs text-gray-500">
                    <div>Title | Difficulty | Duration</div>
                    <div>Price | Group Size | Location</div>
                    <div>Description | Highlights | Includes</div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">MadeToHike Marketplace Wireframes</h1>
        <p className="text-muted-foreground">
          Interactive wireframe visualization of the hiking tour marketplace
        </p>
      </div>

      {/* Page Navigation */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-3">Page Layouts</h2>
        <div className="flex flex-wrap gap-2 mb-4">
          {Object.entries(pages).map(([key, page]) => (
            <Button
              key={key}
              variant={selectedPage === key ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedPage(key)}
            >
              {page.title}
            </Button>
          ))}
        </div>
      </div>

      {/* Wireframe Display */}
      <div className="mb-8">
        <Card className="p-6">
          {wireframeLayout(selectedPage)}
        </Card>
      </div>

      {/* User Flows */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">User Flows</h2>
        <div className="grid md:grid-cols-2 gap-6">
          {userFlows.map((flow, index) => (
            <Card key={index} className="p-6">
              <h3 className="font-semibold mb-4">{flow.title}</h3>
              <div className="space-y-2">
                {flow.steps.map((step, stepIndex) => (
                  <div key={stepIndex} className="flex items-center gap-3">
                    <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs">
                      {stepIndex + 1}
                    </div>
                    <div className="text-sm">{step}</div>
                  </div>
                ))}
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Technical Architecture */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Technical Architecture</h2>
        <div className="grid md:grid-cols-3 gap-4">
          <Card className="p-4">
            <h3 className="font-semibold mb-3">Frontend</h3>
            <div className="space-y-1 text-sm text-muted-foreground">
              <div>• React + TypeScript</div>
              <div>• Tailwind CSS</div>
              <div>• ShadCN Components</div>
              <div>• Client-side routing</div>
              <div>• Local storage for demo</div>
            </div>
          </Card>
          
          <Card className="p-4">
            <h3 className="font-semibold mb-3">Backend Ready</h3>
            <div className="space-y-1 text-sm text-muted-foreground">
              <div>• Supabase integration</div>
              <div>• Authentication system</div>
              <div>• Database schema</div>
              <div>• File storage</div>
              <div>• Real-time features</div>
            </div>
          </Card>
          
          <Card className="p-4">
            <h3 className="font-semibold mb-3">Features</h3>
            <div className="space-y-1 text-sm text-muted-foreground">
              <div>• Multi-role support</div>
              <div>• Payment processing</div>
              <div>• Booking management</div>
              <div>• Review system</div>
              <div>• Multi-language ready</div>
            </div>
          </Card>
        </div>
      </div>

      {/* Key Components */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Key Components Built</h2>
        <div className="grid md:grid-cols-4 gap-4">
          {[
            'LandingPage', 'SearchPage', 'TourDetailPage', 'UserDashboard',
            'GuideDashboard', 'BookingFlow', 'AuthModal', 'EnhancedTourCard',
            'TrustSection', 'DecisionManager', 'WireframeSettings', 'BackendSecurity'
          ].map((component, index) => (
            <Badge key={index} variant="secondary" className="p-2 justify-center">
              {component}
            </Badge>
          ))}
        </div>
      </div>
    </div>
  );
}