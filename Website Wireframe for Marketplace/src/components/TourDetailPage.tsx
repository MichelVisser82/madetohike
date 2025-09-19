import { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { Calendar, MapPin, Users, Clock, Star, ArrowLeft, Heart, Shield, CheckCircle, AlertTriangle } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface TourDetailPageProps {
  tour: any;
  onBookTour: (tour: any) => void;
  onBackToSearch: () => void;
}

export function TourDetailPage({ tour, onBookTour, onBackToSearch }: TourDetailPageProps) {
  const [selectedImage, setSelectedImage] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);

  // Safety check - if tour is null or images is undefined, don't render
  if (!tour || !tour.images || !Array.isArray(tour.images) || tour.images.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Tour not found</h2>
            <p className="text-muted-foreground mb-8">
              The tour you're looking for doesn't exist or couldn't be loaded.
            </p>
            <Button onClick={onBackToSearch}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Search
            </Button>
          </div>
        </div>
      </div>
    );
  }

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
    const symbol = currency === 'EUR' ? '€' : '£';
    return `${symbol}${price}`;
  };

  const mockReviews = [
    {
      id: '1',
      user_name: 'Sarah M.',
      user_avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b647?w=50&h=50&fit=crop&crop=face',
      rating: 5,
      date: '2024-05-15',
      comment: 'Absolutely incredible experience! Marco was knowledgeable, safety-focused, and made the hike enjoyable for everyone in our group. The views were breathtaking.',
      verified: true
    },
    {
      id: '2',
      user_name: 'James K.',
      user_avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=50&h=50&fit=crop&crop=face',
      rating: 5,
      date: '2024-05-08',
      comment: 'Perfect introduction to the Dolomites. The guide was patient with beginners and the pace was just right. Highly recommended!',
      verified: true
    },
    {
      id: '3',
      user_name: 'Anna L.',
      user_avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=50&h=50&fit=crop&crop=face',
      rating: 4,
      date: '2024-04-28',
      comment: 'Great tour with stunning scenery. Only minor issue was the weather, but that\'s beyond anyone\'s control. Would book again!',
      verified: true
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-white sticky top-16 z-40">
        <div className="container mx-auto px-4 py-4">
          <Button 
            variant="ghost" 
            onClick={onBackToSearch}
            className="mb-2"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Search
          </Button>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Image Gallery */}
            <div className="space-y-4">
              <div className="aspect-[16/10] relative rounded-lg overflow-hidden">
                <ImageWithFallback
                  src={tour.images[selectedImage] || tour.images[0]}
                  alt={tour.title}
                  className="w-full h-full object-cover"
                />
                <button
                  onClick={() => setIsFavorite(!isFavorite)}
                  className="absolute top-4 right-4 p-3 bg-white/90 rounded-full hover:bg-white transition-colors"
                >
                  <Heart 
                    className={`h-5 w-5 ${
                      isFavorite 
                        ? 'fill-red-500 text-red-500' 
                        : 'text-gray-600'
                    }`} 
                  />
                </button>
              </div>
              
              {tour.images.length > 1 && (
                <div className="flex gap-2 overflow-x-auto">
                  {tour.images.map((image: string, index: number) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors ${
                        selectedImage === index ? 'border-primary' : 'border-transparent'
                      }`}
                    >
                      <ImageWithFallback
                        src={image}
                        alt={`${tour.title} ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Tour Info */}
            <div className="space-y-6">
              <div>
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h1 className="text-3xl font-bold mb-2">{tour.title || 'Tour Details'}</h1>
                    <div className="flex items-center gap-4 text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        <span>{tour.region ? tour.region.charAt(0).toUpperCase() + tour.region.slice(1) : 'Unknown region'}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="font-medium">{tour.rating || 0}</span>
                        <span>({tour.reviews_count || 0} reviews)</span>
                      </div>
                    </div>
                  </div>
                  <Badge className={getDifficultyColor(tour.difficulty || 'moderate')}>
                    {tour.difficulty || 'moderate'}
                  </Badge>
                </div>

                <p className="text-muted-foreground text-lg">{tour.description || 'No description available.'}</p>
              </div>

              {/* Quick Info */}
              <div className="grid md:grid-cols-3 gap-6">
                <div className="flex items-center gap-3 p-4 bg-muted/50 rounded-lg">
                  <Clock className="h-5 w-5 text-primary" />
                  <div>
                    <div className="text-sm text-muted-foreground">Duration</div>
                    <div className="font-medium">{tour.duration || 'Duration TBD'}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4 bg-muted/50 rounded-lg">
                  <Users className="h-5 w-5 text-primary" />
                  <div>
                    <div className="text-sm text-muted-foreground">Group Size</div>
                    <div className="font-medium">Max {tour.group_size || 'TBD'} people</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4 bg-muted/50 rounded-lg">
                  <MapPin className="h-5 w-5 text-primary" />
                  <div>
                    <div className="text-sm text-muted-foreground">Meeting Point</div>
                    <div className="font-medium">{tour.meeting_point || 'Meeting point TBD'}</div>
                  </div>
                </div>
              </div>

              {/* Highlights */}
              {tour.highlights && tour.highlights.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Tour Highlights</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {tour.highlights.map((highlight: string, index: number) => (
                      <div key={index} className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                        <span>{highlight}</span>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              )}

              {/* What's Included */}
              {tour.includes && tour.includes.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>What's Included</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {tour.includes.map((item: string, index: number) => (
                      <div key={index} className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              )}

              {/* Safety Info */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5" />
                    Safety Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-start gap-2">
                    <AlertTriangle className="h-4 w-4 text-amber-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <div className="font-medium">Weather Dependent</div>
                      <div className="text-sm text-muted-foreground">Tours may be cancelled due to adverse weather conditions</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <div className="font-medium">Certified Guide</div>
                      <div className="text-sm text-muted-foreground">Led by certified mountain guide with first aid training</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <div className="font-medium">Safety Equipment</div>
                      <div className="text-sm text-muted-foreground">All necessary safety equipment provided</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Guide Info */}
              <Card>
                <CardHeader>
                  <CardTitle>Your Guide</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-start gap-4">
                    <img
                      src={tour.guide_avatar}
                      alt={tour.guide_name}
                      className="w-16 h-16 rounded-full object-cover"
                    />
                    <div className="flex-1">
                      <h4 className="font-semibold text-lg">{tour.guide_name}</h4>
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="secondary">Certified Guide</Badge>
                        <Badge variant="secondary">Local Expert</Badge>
                      </div>
                      <p className="text-muted-foreground text-sm">
                        Professional mountain guide with over 8 years of experience in the {tour.region}. 
                        Specializes in safety, local history, and creating memorable experiences for all skill levels.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Reviews */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>Reviews ({tour.reviews_count})</span>
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-medium">{tour.rating}</span>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {mockReviews.map((review) => (
                    <div key={review.id} className="space-y-2">
                      <div className="flex items-start gap-3">
                        <img
                          src={review.user_avatar}
                          alt={review.user_name}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-medium">{review.user_name}</span>
                            {review.verified && (
                              <Badge variant="secondary" className="text-xs">Verified</Badge>
                            )}
                            <span className="text-sm text-muted-foreground">
                              {new Date(review.date).toLocaleDateString()}
                            </span>
                          </div>
                          <div className="flex items-center gap-1 mb-2">
                            {[...Array(review.rating)].map((_, i) => (
                              <Star key={i} className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                            ))}
                          </div>
                          <p className="text-sm text-muted-foreground">{review.comment}</p>
                        </div>
                      </div>
                      {review.id !== mockReviews[mockReviews.length - 1].id && (
                        <Separator className="mt-4" />
                      )}
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Booking Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <Card>
                <CardContent className="p-6">
                  <div className="space-y-6">
                    <div className="text-center">
                      <div className="text-3xl font-bold">
                        {formatPrice(tour.price || 0, tour.currency || 'EUR')}
                      </div>
                      <div className="text-muted-foreground">per person</div>
                    </div>

                    <Separator />

                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium">Available Dates</label>
                        <div className="mt-2 space-y-2">
                          {tour.available_dates && tour.available_dates.length > 0 ? (
                            tour.available_dates.map((date: string, index: number) => (
                              <div key={index} className="flex items-center justify-between p-2 border rounded-lg hover:bg-muted/50 cursor-pointer">
                                <div className="flex items-center gap-2">
                                  <Calendar className="h-4 w-4" />
                                  <span className="text-sm">
                                    {new Date(date).toLocaleDateString('en-US', { 
                                      weekday: 'short', 
                                      month: 'short', 
                                      day: 'numeric' 
                                    })}
                                  </span>
                                </div>
                                <Badge variant="secondary" className="text-xs">Available</Badge>
                              </div>
                            ))
                          ) : (
                            <div className="text-sm text-muted-foreground p-2 border rounded-lg">
                              No dates currently available. Contact guide for custom dates.
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    <Button 
                      className="w-full" 
                      size="lg"
                      onClick={() => onBookTour(tour)}
                    >
                      Book This Tour
                    </Button>

                    <div className="text-center text-sm text-muted-foreground">
                      Free cancellation up to 48 hours before the tour
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}