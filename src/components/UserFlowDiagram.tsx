import { Card, CardContent } from './ui/card';
import { ArrowDown, ArrowRight, Users, MapPin, Calendar, MessageCircle, Star, CreditCard } from 'lucide-react';

interface FlowStepProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  className?: string;
}

function FlowStep({ icon, title, description, className = "" }: FlowStepProps) {
  return (
    <Card className={`p-4 ${className}`}>
      <CardContent className="p-0">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-primary/10 rounded-lg">
            {icon}
          </div>
          <h4>{title}</h4>
        </div>
        <p className="text-sm text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
}

export function UserFlowDiagram() {
  return (
    <div className="space-y-8">
      {/* Guide Flow */}
      <div>
        <h3 className="mb-4 text-green-700">Guide User Flow</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <FlowStep
            icon={<Users className="h-5 w-5 text-green-600" />}
            title="Sign Up"
            description="Register as guide, verify credentials, set up profile"
            className="border-green-200"
          />
          <FlowStep
            icon={<MapPin className="h-5 w-5 text-green-600" />}
            title="Create Tours"
            description="Add tour details, routes, pricing, availability"
            className="border-green-200"
          />
          <FlowStep
            icon={<Calendar className="h-5 w-5 text-green-600" />}
            title="Manage Bookings"
            description="Accept/decline requests, manage calendar"
            className="border-green-200"
          />
          <FlowStep
            icon={<MessageCircle className="h-5 w-5 text-green-600" />}
            title="Lead Tours"
            description="Communicate with hikers, conduct tours"
            className="border-green-200"
          />
        </div>
      </div>

      {/* Hiker Flow */}
      <div>
        <h3 className="mb-4 text-blue-700">Hiker User Flow</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <FlowStep
            icon={<Users className="h-5 w-5 text-blue-600" />}
            title="Sign Up"
            description="Create account, set preferences, experience level"
            className="border-blue-200"
          />
          <FlowStep
            icon={<MapPin className="h-5 w-5 text-blue-600" />}
            title="Discover"
            description="Search tours by location, difficulty, dates"
            className="border-blue-200"
          />
          <FlowStep
            icon={<CreditCard className="h-5 w-5 text-blue-600" />}
            title="Book"
            description="Select tour, make payment, confirm booking"
            className="border-blue-200"
          />
          <FlowStep
            icon={<MessageCircle className="h-5 w-5 text-blue-600" />}
            title="Prepare"
            description="Communicate with guide, get trip details"
            className="border-blue-200"
          />
          <FlowStep
            icon={<Star className="h-5 w-5 text-blue-600" />}
            title="Experience"
            description="Join tour, provide feedback and reviews"
            className="border-blue-200"
          />
        </div>
      </div>
    </div>
  );
}