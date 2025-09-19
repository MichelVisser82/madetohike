import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Shield, Database, CreditCard, MessageSquare, Users, Map } from 'lucide-react';

interface SecurityFeature {
  category: string;
  icon: React.ReactNode;
  features: string[];
  implementation: string[];
}

const securityFeatures: SecurityFeature[] = [
  {
    category: "User Authentication & Authorization",
    icon: <Users className="h-5 w-5" />,
    features: [
      "Multi-factor authentication for guides",
      "Role-based access control (Guide vs Hiker)",
      "Email verification and phone verification",
      "Social login integration"
    ],
    implementation: [
      "Supabase Auth with RLS policies",
      "JWT token management",
      "OAuth providers (Google, Apple)",
      "Session management and refresh tokens"
    ]
  },
  {
    category: "Payment Security",
    icon: <CreditCard className="h-5 w-5" />,
    features: [
      "PCI DSS compliance",
      "Secure payment processing",
      "Escrow system for bookings",
      "Refund and cancellation policies"
    ],
    implementation: [
      "Stripe integration",
      "Webhook verification",
      "Payment status tracking",
      "Encrypted payment data storage"
    ]
  },
  {
    category: "Data Protection",
    icon: <Database className="h-5 w-5" />,
    features: [
      "GDPR compliance",
      "Data encryption at rest",
      "Personal data anonymization",
      "Right to be forgotten"
    ],
    implementation: [
      "Supabase RLS policies",
      "Database encryption",
      "Data retention policies",
      "Audit logging"
    ]
  },
  {
    category: "Communication Security",
    icon: <MessageSquare className="h-5 w-5" />,
    features: [
      "End-to-end message encryption",
      "Content moderation",
      "Spam prevention",
      "Block and report functionality"
    ],
    implementation: [
      "Encrypted messaging system",
      "AI content filtering",
      "User reporting workflows",
      "Admin moderation tools"
    ]
  },
  {
    category: "Location & Safety",
    icon: <Map className="h-5 w-5" />,
    features: [
      "GPS tracking for tours",
      "Emergency contact system",
      "Weather integration",
      "Route safety verification"
    ],
    implementation: [
      "Real-time location sharing",
      "Emergency alert system",
      "Weather API integration",
      "Route validation algorithms"
    ]
  },
  {
    category: "Platform Security",
    icon: <Shield className="h-5 w-5" />,
    features: [
      "Rate limiting and DDoS protection",
      "Input validation and sanitization",
      "SQL injection prevention",
      "Regular security audits"
    ],
    implementation: [
      "Supabase built-in protections",
      "Input validation middleware",
      "Parameterized queries",
      "Automated vulnerability scanning"
    ]
  }
];

export function BackendSecurity() {
  return (
    <div>
      <h3 className="mb-4">Backend Architecture & Security Requirements</h3>
      <div className="grid md:grid-cols-2 gap-6">
        {securityFeatures.map((feature, index) => (
          <Card key={index}>
            <CardHeader>
              <div className="flex items-center gap-2">
                <div className="p-2 bg-red-50 rounded-lg">
                  {feature.icon}
                </div>
                <CardTitle className="text-lg">{feature.category}</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h5 className="text-sm mb-2 text-red-700">Security Features:</h5>
                  <ul className="text-xs space-y-1">
                    {feature.features.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="w-1 h-1 bg-red-600 rounded-full mt-2"></span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div>
                  <h5 className="text-sm mb-2 text-purple-700">Implementation:</h5>
                  <ul className="text-xs space-y-1">
                    {feature.implementation.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="w-1 h-1 bg-purple-600 rounded-full mt-2"></span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}