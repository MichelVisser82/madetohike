import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { Star, MapPin, Users, Shield, Calendar, Search, CheckCircle } from 'lucide-react';
import { useWireframeConfig } from '../utils/wireframe-config';
import { TrustSection } from './TrustSection';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface LandingPageProps {
  onNavigateToSearch: (filters?: any) => void;
  onShowAuth: () => void;
  onShowGuideSignup: () => void;
  user: any;
  onNavigateToDashboard: () => void;
}

interface User {
  role: 'hiker' | 'guide';
}

export function LandingPage({ onNavigateToSearch, onShowAuth, onShowGuideSignup, user, onNavigateToDashboard }: LandingPageProps) {
  const [selectedRegion, setSelectedRegion] = useState(0);
  const config = useWireframeConfig();

  // Auto-rotate carousel based on wireframe decisions
  useEffect(() => {
    if (config.carouselMode === 'auto-rotate') {
      const interval = setInterval(() => {
        setSelectedRegion(prev => (prev + 1) % regions.length);
      }, 4000);
      return () => clearInterval(interval);
    }
  }, [config.carouselMode]);

  const regions = [
    {
      name: 'Dolomites',
      country: 'Italy',
      tours: 47,
      difficulty: 'Easy - Expert',
      bestSeason: 'May - October',
      description: 'Dramatic limestone peaks and alpine meadows',
      image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=500&fit=crop'
    },
    {
      name: 'Pyrenees',
      country: 'France/Spain',
      tours: 32,
      difficulty: 'Moderate - Expert',
      bestSeason: 'June - September',
      description: 'Wild mountain ranges between France and Spain',
      image: 'https://images.unsplash.com/photo-1464822759844-d150ad6d1db8?w=800&h=500&fit=crop'
    },
    {
      name: 'Scottish Highlands',
      country: 'Scotland',
      tours: 28,
      difficulty: 'Easy - Challenging',
      bestSeason: 'April - October',
      description: 'Rugged landscapes and ancient castles',
      image: 'https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?w=800&h=500&fit=crop'
    }
  ];

  const features = [
    {
      icon: <Shield className="h-8 w-8 text-green-600" />,
      title: 'Verified Guides',
      description: 'All guides are certified professionals with local expertise and safety training'
    },
    {
      icon: <Calendar className="h-8 w-8 text-blue-600" />,
      title: 'Flexible Booking',
      description: 'Easy booking with free cancellation up to 48 hours before your adventure'
    },
    {
      icon: <Users className="h-8 w-8 text-purple-600" />,
      title: 'Small Groups',
      description: 'Intimate group sizes for personalized experiences and better safety'
    }
  ];

  const testimonials = [
    {
      name: 'Sarah M.',
      location: 'London, UK',
      rating: 5,
      text: 'Amazing experience in the Dolomites! Our guide Marco was incredibly knowledgeable and made us feel safe throughout the challenging route.',
      tour: 'Tre Cime di Lavaredo Circuit'
    },
    {
      name: 'James K.',
      location: 'Berlin, Germany',
      rating: 5,
      text: 'Perfect introduction to the Pyrenees. The guide adapted the difficulty to our group and showed us hidden gems off the beaten path.',
      tour: 'Ordesa Valley Adventure'
    }
  ];

  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-b from-slate-50 to-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <div className="space-y-4">
              <h1 className="text-4xl md:text-6xl font-bold text-foreground">
                <span className="text-primary block">Find Your Next</span>
                Hiking Adventure
              </h1>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                {config.heroTagline}. Join hand-selected, certified guides for unforgettable experiences across Europe's most stunning mountain ranges.
              </p>
            </div>

            <div className="flex justify-center">
              <Button 
                size="lg" 
                onClick={() => onNavigateToSearch()}
                className="px-10 py-6 text-xl"
              >
                <Search className="h-5 w-5 mr-3" />
                {config.heroCTA}
              </Button>
            </div>

            <div className="flex items-center justify-center gap-8 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span>4.9/5 Average Rating</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                <span>1,200+ Happy Hikers</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4" />
                <span>100% Verified Guides</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Regions Showcase */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-4 mb-12">
            <h2 className="text-3xl font-bold">Explore Our Regions</h2>
            <p className="text-muted-foreground">
              Three incredible mountain ranges, countless adventures waiting for you
            </p>
          </div>

          {/* Auto-rotating Featured Region */}
          <div className="max-w-4xl mx-auto">
            <Card className="overflow-hidden hover:shadow-lg transition-all duration-500">
              <div className="aspect-[16/9] relative">
                <ImageWithFallback
                  src={regions[selectedRegion].image}
                  alt={regions[selectedRegion].name}
                  className="w-full h-full object-cover transition-all duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
                  <div className="flex items-center justify-between">
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <Badge className="bg-white/20 text-white border-white/20">
                          Featured Region
                        </Badge>
                        <Badge className="bg-primary text-primary-foreground">
                          {regions[selectedRegion].tours} Tours Available
                        </Badge>
                      </div>
                      <h3 className="text-3xl font-bold">{regions[selectedRegion].name}</h3>
                      <p className="text-white/90 flex items-center gap-2 text-lg">
                        <MapPin className="h-5 w-5" />
                        {regions[selectedRegion].country}
                      </p>
                      <p className="text-white/80 max-w-md">{regions[selectedRegion].description}</p>
                    </div>
                    <Button 
                      size="lg"
                      onClick={() => onNavigateToSearch({ region: regions[selectedRegion].name.toLowerCase() })}
                      className="bg-white text-black hover:bg-white/90"
                    >
                      Explore {regions[selectedRegion].name}
                    </Button>
                  </div>
                </div>
              </div>
            </Card>

            {/* Region Benefits/Highlights */}
            <div className="mt-8 grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <h4 className="font-semibold mb-2">Difficulty Range</h4>
                <p className="text-muted-foreground">{regions[selectedRegion].difficulty}</p>
              </div>
              <div className="text-center">
                <h4 className="font-semibold mb-2">Best Season</h4>
                <p className="text-muted-foreground">{regions[selectedRegion].bestSeason}</p>
              </div>
              <div className="text-center">
                <h4 className="font-semibold mb-2">Available Tours</h4>
                <p className="text-muted-foreground">{regions[selectedRegion].tours} guided experiences</p>
              </div>
            </div>

            {/* Region Indicators */}
            <div className="flex justify-center gap-3 mt-6">
              {regions.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedRegion(index)}
                  className={`w-3 h-3 rounded-full transition-colors ${
                    selectedRegion === index ? 'bg-primary' : 'bg-muted-foreground/30'
                  }`}
                />
              ))}
            </div>

            {/* All Regions Quick Access */}
            <div className="mt-12 grid md:grid-cols-3 gap-4">
              {regions.map((region, index) => (
                <Card 
                  key={index}
                  className={`cursor-pointer transition-all ${
                    selectedRegion === index ? 'ring-2 ring-primary' : 'hover:shadow-md'
                  }`}
                  onClick={() => {
                    setSelectedRegion(index);
                    onNavigateToSearch({ region: region.name.toLowerCase() });
                  }}
                >
                  <CardContent className="p-4">
                    <h4 className="font-semibold">{region.name}</h4>
                    <p className="text-sm text-muted-foreground">{region.tours} tours</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Become a Guide Section - Secondary CTA */}
      <section className="py-16 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <div className="space-y-4">
              <h2 className="text-3xl font-bold">Share Your Mountain Expertise</h2>
              <p className="text-xl text-muted-foreground">
                Turn your passion for hiking into income. Join our community of hand-selected, certified mountain guides.
              </p>
            </div>
            {!user && (
              <Button 
                size="lg" 
                onClick={onShowGuideSignup}
                className="px-8 py-6 text-lg"
              >
                {config.secondaryCTA}
              </Button>
            )}
            {user?.role === 'guide' && (
              <Button 
                size="lg" 
                onClick={onNavigateToDashboard}
                className="px-8 py-6 text-lg"
              >
                Guide Dashboard
              </Button>
            )}
          </div>
        </div>
      </section>

      {/* Trust Section - Based on wireframe decision Q3 */}
      <TrustSection />

      {/* Testimonials */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-4 mb-12">
            <h2 className="text-3xl font-bold">What Our Hikers Say</h2>
            <p className="text-muted-foreground">
              Real experiences from real adventurers
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="p-6">
                <CardContent className="space-y-4 p-0">
                  <div className="flex items-center gap-1">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-muted-foreground italic">"{testimonial.text}"</p>
                  <div>
                    <p className="font-semibold">{testimonial.name}</p>
                    <p className="text-sm text-muted-foreground">{testimonial.location}</p>
                    <p className="text-sm text-primary">{testimonial.tour}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center space-y-8">
          <div className="space-y-4">
            <h2 className="text-3xl font-bold">Ready for Your Next Adventure?</h2>
            <p className="text-lg opacity-90">
              Join thousands of hikers who've discovered amazing trails with expert guides
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              variant="secondary"
              onClick={() => onNavigateToSearch()}
              className="px-8 py-6 text-lg"
            >
              Browse All Tours
            </Button>
            {!user && (
              <Button 
                size="lg" 
                variant="outline"
                onClick={onShowGuideSignup}
                className="px-8 py-6 text-lg border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary"
              >
                Join as a Guide
              </Button>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}