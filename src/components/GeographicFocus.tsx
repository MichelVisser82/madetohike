import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface Region {
  name: string;
  image: string;
  highlights: string[];
  considerations: string[];
}

const regions: Region[] = [
  {
    name: "Dolomites",
    image: "https://images.unsplash.com/photo-1699388714024-1a9f6e154827?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkb2xvbWl0ZXMlMjBtb3VudGFpbnMlMjBoaWtpbmd8ZW58MXx8fHwxNzU4MDE1NTYwfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    highlights: ["Via Ferrata routes", "Dramatic limestone peaks", "Mountain huts system", "Multi-day treks"],
    considerations: ["Italian/German language support", "Seasonal accessibility", "Mountain rescue protocols", "Hut booking integration"]
  },
  {
    name: "Pyrenees",
    image: "https://images.unsplash.com/photo-1731500851322-a69efdb14e87?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHhweXJlbmVlcyUyMG1vdW50YWlucyUyMGhpa2luZ3xlbnwxfHx8fDE3NTgwMTU1NjN8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    highlights: ["Cross-border trails", "GR routes", "Varied ecosystems", "Cultural diversity"],
    considerations: ["Multi-country regulations", "Currency differences", "Weather variations", "Border crossing logistics"]
  },
  {
    name: "Scotland",
    image: "https://images.unsplash.com/photo-1650195482663-639447e1bea2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzY290bGFuZCUyMGhpZ2hsYW5kcyUyMGhpa2luZ3xlbnwxfHx8fDE3NTgwMTU1NjV8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    highlights: ["Munro bagging", "Island hopping", "Right to roam", "Historic castles"],
    considerations: ["Unpredictable weather", "Remote area safety", "Midges seasonality", "Transport logistics"]
  }
];

export function GeographicFocus() {
  return (
    <div>
      <h3 className="mb-4">Geographic Focus Areas</h3>
      <div className="grid md:grid-cols-3 gap-6">
        {regions.map((region) => (
          <Card key={region.name} className="overflow-hidden">
            <div className="relative h-48">
              <ImageWithFallback
                src={region.image}
                alt={`${region.name} landscape`}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-4 left-4">
                <Badge variant="secondary" className="bg-white/90 text-gray-800">
                  {region.name}
                </Badge>
              </div>
            </div>
            <CardHeader>
              <CardTitle className="text-lg">{region.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h5 className="text-sm mb-2 text-green-700">Tour Highlights:</h5>
                  <ul className="text-xs space-y-1">
                    {region.highlights.map((highlight, index) => (
                      <li key={index} className="flex items-center gap-2">
                        <span className="w-1 h-1 bg-green-600 rounded-full"></span>
                        {highlight}
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div>
                  <h5 className="text-sm mb-2 text-blue-700">Platform Considerations:</h5>
                  <ul className="text-xs space-y-1">
                    {region.considerations.map((consideration, index) => (
                      <li key={index} className="flex items-center gap-2">
                        <span className="w-1 h-1 bg-blue-600 rounded-full"></span>
                        {consideration}
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