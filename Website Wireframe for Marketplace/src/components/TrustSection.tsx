import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { useWireframeConfig } from '../utils/wireframe-config';
import { 
  Shield, 
  Award, 
  Users, 
  CheckCircle, 
  Star, 
  Camera,
  MapPin,
  Clock
} from 'lucide-react';

export function TrustSection() {
  const config = useWireframeConfig();

  // Only show if wireframe decision #3 specifies dedicated trust section
  if (config.trustSection !== 'dedicated') {
    return null;
  }

  const trustFeatures = [
    {
      icon: <Shield className="h-8 w-8 text-blue-600" />,
      title: "Hand-Selected Guides",
      description: "Every guide is personally vetted by our mountain experts",
      details: "We verify certifications, experience, and local knowledge before approval"
    },
    {
      icon: <Award className="h-8 w-8 text-green-600" />,
      title: "Verified Certifications",
      description: "All guiding certifications are hand-checked and verified",
      details: "International Mountain Leader, Wilderness First Aid, and regional permits"
    },
    {
      icon: <Camera className="h-8 w-8 text-purple-600" />,
      title: "Authentic Photos Only",
      description: "Guides provide genuine, owned pictures - no stock photos",
      details: "Every image is taken by the guide on actual tours they've led"
    },
    {
      icon: <Users className="h-8 w-8 text-orange-600" />,
      title: "Verified Reviews",
      description: "Only genuine reviews from verified tour participants",
      details: "Review system prevents fake reviews and ensures authentic feedback"
    }
  ];

  const certifications = [
    "International Mountain Leader (IML)",
    "Wilderness First Aid (WFA)", 
    "Mountain Leader Training Association",
    "Local Regional Permits",
    "Avalanche Safety Training",
    "Rock Climbing Instructor"
  ];

  return (
    <section className="py-16 bg-gradient-to-br from-blue-50 to-green-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <Badge className="mb-4 bg-blue-100 text-blue-800">
            <Shield className="h-3 w-3 mr-1" />
            Trust & Safety
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Hand-Selected & Verified Guides
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            We hand-check all certifications and display them prominently. Every guide is personally vetted 
            for safety, expertise, and authentic mountain experience.
          </p>
        </div>

        {/* Trust Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {trustFeatures.map((feature, index) => (
            <Card key={index} className="text-center p-6 hover:shadow-lg transition-shadow">
              <CardContent className="p-0">
                <div className="mb-4 flex justify-center">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground mb-3">{feature.description}</p>
                <p className="text-xs text-muted-foreground">{feature.details}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Certification Details */}
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <h3 className="text-2xl font-bold mb-6">Recognized Certifications</h3>
            <div className="grid gap-3">
              {certifications.map((cert, index) => (
                <div key={index} className="flex items-center gap-3 p-3 bg-white rounded-lg border">
                  <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
                  <span className="text-sm font-medium">{cert}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <Card className="p-6 bg-white border-2 border-green-100">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <Star className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-green-800 mb-2">Verification Process</h4>
                  <ul className="text-sm text-green-700 space-y-1">
                    <li>• Document verification by mountain professionals</li>
                    <li>• Reference checks with previous clients</li>
                    <li>• Local knowledge assessment</li>
                    <li>• Safety protocol evaluation</li>
                    <li>• Ongoing performance monitoring</li>
                  </ul>
                </div>
              </div>
            </Card>

            <Card className="p-6 bg-white border-2 border-blue-100">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <MapPin className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-blue-800 mb-2">Authentic Experience</h4>
                  <ul className="text-sm text-blue-700 space-y-1">
                    <li>• All photos taken by guides themselves</li>
                    <li>• Real routes and actual tour locations</li>
                    <li>• Transparent difficulty ratings</li>
                    <li>• Honest weather and season information</li>
                    <li>• No misleading marketing content</li>
                  </ul>
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* Trust Statistics */}
        <div className="mt-12 text-center">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="p-4">
              <div className="text-2xl font-bold text-blue-600 mb-1">100%</div>
              <div className="text-sm text-muted-foreground">Certification Verified</div>
            </div>
            <div className="p-4">
              <div className="text-2xl font-bold text-green-600 mb-1">500+</div>
              <div className="text-sm text-muted-foreground">Verified Guides</div>
            </div>
            <div className="p-4">
              <div className="text-2xl font-bold text-purple-600 mb-1">4.9</div>
              <div className="text-sm text-muted-foreground">Average Rating</div>
            </div>
            <div className="p-4">
              <div className="text-2xl font-bold text-orange-600 mb-1">24/7</div>
              <div className="text-sm text-muted-foreground">Safety Support</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}