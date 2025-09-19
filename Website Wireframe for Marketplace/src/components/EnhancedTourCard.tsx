import { useState } from 'react';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { 
  MapPin, 
  Users, 
  Star, 
  Clock, 
  Heart, 
  Shield, 
  Wifi, 
  WifiOff,
  Camera,
  MessageCircle,
  CreditCard
} from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { useWireframeConfig } from '../utils/wireframe-config';

interface Tour {
  id: string;
  title: string;
  guide_name: string;
  guide_avatar: string;
  region: string;
  difficulty: string;
  duration: string;
  group_size: number;
  price: number;
  currency: string;
  images: string[];
  rating: number;
  reviews_count: number;
  verified_reviews: number;
  instant_booking: boolean;
  cancellation_policy: string;
  has_group_chat: boolean;
  guide_verified: boolean;
}

interface EnhancedTourCardProps {
  tour: Tour;
  onTourClick: (tour: Tour) => void;
  onBookTour: (tour: Tour) => void;
  onToggleFavorite: (tourId: string) => void;
  isFavorite: boolean;
}

export function EnhancedTourCard({ 
  tour, 
  onTourClick, 
  onBookTour, 
  onToggleFavorite, 
  isFavorite 
}: EnhancedTourCardProps) {
  const config = useWireframeConfig();
  const [imageLoaded, setImageLoaded] = useState(false);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-800';
      case 'moderate': return 'bg-yellow-100 text-yellow-800';
      case 'challenging': return 'bg-orange-100 text-orange-800';
      case 'expert': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatPrice = (price: number, currency: string) => {
    const symbols = { EUR: '€', GBP: '£', USD: '$' };
    const symbol = symbols[currency as keyof typeof symbols] || currency;
    return `${symbol}${price}`;
  };

  const getCancellationColor = (policy: string) => {
    switch (policy) {
      case 'flexible': return 'bg-green-50 text-green-700 border-green-200';
      case 'moderate': return 'bg-yellow-50 text-yellow-700 border-yellow-200';
      case 'strict': return 'bg-red-50 text-red-700 border-red-200';
      default: return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-all duration-200 group">
      <div className="aspect-[4/3] relative overflow-hidden">
        <ImageWithFallback
          src={tour.images[0]}
          alt={tour.title}
          className={`w-full h-full object-cover transition-transform duration-300 group-hover:scale-105 ${
            imageLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          onLoad={() => setImageLoaded(true)}
        />
        
        {/* Overlay badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          <Badge className={getDifficultyColor(tour.difficulty)}>
            {tour.difficulty}
          </Badge>
          
          {/* Instant Booking Badge - Q11 Decision */}
          {config.instantBooking && tour.instant_booking && (
            <Badge className="bg-blue-100 text-blue-800">
              <CreditCard className="h-3 w-3 mr-1" />
              Instant Book
            </Badge>
          )}
          
          {/* Verified Guide Badge - Q14 Decision */}
          {tour.guide_verified && (
            <Badge className="bg-purple-100 text-purple-800">
              <Shield className="h-3 w-3 mr-1" />
              Verified
            </Badge>
          )}
        </div>

        {/* Favorite Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite(tour.id);
          }}
          className="absolute top-3 right-3 p-2 bg-white/90 rounded-full hover:bg-white transition-colors"
        >
          <Heart 
            className={`h-4 w-4 ${
              isFavorite 
                ? 'fill-red-500 text-red-500' 
                : 'text-gray-600'
            }`} 
          />
        </button>

        {/* Photo Count Indicator - Q19 Decision */}
        {config.photoSharing === 'encouraged' && (
          <div className="absolute bottom-3 right-3 bg-black/70 text-white px-2 py-1 rounded text-xs flex items-center gap-1">
            <Camera className="h-3 w-3" />
            {tour.images.length}
          </div>
        )}
      </div>

      <CardContent className="p-6">
        <div className="space-y-3">
          {/* Title and Region */}
          <div>
            <h3 
              className="font-semibold hover:text-primary cursor-pointer line-clamp-2"
              onClick={() => onTourClick(tour)}
            >
              {tour.title}
            </h3>
            <p className="text-sm text-muted-foreground flex items-center gap-1">
              <MapPin className="h-3 w-3" />
              {tour.region.charAt(0).toUpperCase() + tour.region.slice(1)}
            </p>
          </div>

          {/* Tour Details */}
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-1">
              <Clock className="h-3 w-3 text-muted-foreground" />
              <span>{tour.duration}</span>
            </div>
            <div className="flex items-center gap-1">
              <Users className="h-3 w-3 text-muted-foreground" />
              <span>Max {tour.group_size}</span>
            </div>
          </div>

          {/* Enhanced Review System - Q13 Decision */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              <span className="text-sm font-medium">{tour.rating}</span>
              <span className="text-sm text-muted-foreground">
                ({tour.reviews_count})
              </span>
            </div>
            
            {/* Verified Reviews - Q13 Decision */}
            {config.reviewSystem === 'verified-only' && tour.verified_reviews > 0 && (
              <Badge variant="outline" className="text-xs">
                <Shield className="h-2 w-2 mr-1" />
                {tour.verified_reviews} verified
              </Badge>
            )}
          </div>

          {/* Guide Info */}
          <div className="flex items-center gap-2">
            <img
              src={tour.guide_avatar}
              alt={tour.guide_name}
              className="w-6 h-6 rounded-full"
            />
            <span className="text-sm text-muted-foreground">
              with {tour.guide_name}
            </span>
            
            {/* Group Chat Indicator - Q20 Decision */}
            {config.groupChat === 'pre-tour' && tour.has_group_chat && (
              <MessageCircle className="h-3 w-3 text-blue-500" />
            )}
          </div>

          {/* Cancellation Policy - Q12 Decision */}
          {config.cancellationPolicy && (
            <div className={`text-xs px-2 py-1 rounded border ${getCancellationColor(tour.cancellation_policy)}`}>
              {tour.cancellation_policy.charAt(0).toUpperCase() + tour.cancellation_policy.slice(1)} cancellation
            </div>
          )}

          {/* Connectivity Status - Q24 Decision */}
          {config.offlineMode === 'basic' && (
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <WifiOff className="h-3 w-3" />
              <span>Offline maps available</span>
            </div>
          )}

          {/* Price and Booking */}
          <div className="flex items-center justify-between pt-2">
            <div className="text-xl font-bold">
              {formatPrice(tour.price, tour.currency)}
              <span className="text-sm font-normal text-muted-foreground">
                /person
              </span>
            </div>
            <Button 
              size="sm"
              onClick={() => onBookTour(tour)}
            >
              {tour.instant_booking ? 'Book Now' : 'Request'}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}