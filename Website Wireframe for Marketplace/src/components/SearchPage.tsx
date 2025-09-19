import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Slider } from './ui/slider';
import { Calendar, MapPin, Users, Star, Clock, Filter, Search, Heart, Euro, PoundSterling, Mountain, Languages, TrendingUp } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { useWireframeConfig } from '../utils/wireframe-config';

interface SearchPageProps {
  filters: any;
  onFiltersChange: (filters: any) => void;
  onTourClick: (tour: any) => void;
  onBookTour: (tour: any) => void;
}

// Mock tour data - in real app this would come from Supabase
const mockTours = [
  {
    id: '1',
    title: 'Tre Cime di Lavaredo Circuit',
    guide_id: 'guide1',
    guide_name: 'Marco Rossi',
    guide_avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
    region: 'dolomites',
    difficulty: 'moderate',
    duration: '8 hours',
    group_size: 8,
    price: 95,
    currency: 'EUR',
    description: 'Experience the iconic Three Peaks with stunning alpine views and rich WWI history.',
    highlights: ['UNESCO World Heritage site', 'Dramatic limestone towers', 'Alpine lake views'],
    includes: ['Professional guide', 'Safety equipment', 'Trail snacks'],
    meeting_point: 'Rifugio Auronzo parking',
    images: ['https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop'],
    available_dates: ['2024-06-15', '2024-06-22', '2024-06-29'],
    rating: 4.9,
    reviews_count: 47,
    created_at: '2024-01-15'
  },
  {
    id: '2',
    title: 'Seceda Ridge Adventure',
    guide_id: 'guide2',
    guide_name: 'Anna Schmidt',
    guide_avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b647?w=100&h=100&fit=crop&crop=face',
    region: 'dolomites',
    difficulty: 'challenging',
    duration: '10 hours',
    group_size: 6,
    price: 120,
    currency: 'EUR',
    description: 'Challenging hike to one of the most photographed viewpoints in the Dolomites.',
    highlights: ['Seceda ridge walk', 'Odle mountain views', 'Val di Funes panorama'],
    includes: ['Certified mountain guide', 'Cable car ticket', 'Emergency equipment'],
    meeting_point: 'Ortisei cable car station',
    images: ['https://images.unsplash.com/photo-1551524164-6cf2ac21c6d8?w=400&h=300&fit=crop'],
    available_dates: ['2024-06-18', '2024-06-25', '2024-07-02'],
    rating: 4.8,
    reviews_count: 32,
    created_at: '2024-01-20'
  },
  {
    id: '3',
    title: 'Ordesa Valley Discovery',
    guide_id: 'guide3',
    guide_name: 'Carlos Mendez',
    guide_avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
    region: 'pyrenees',
    difficulty: 'easy',
    duration: '6 hours',
    group_size: 10,
    price: 75,
    currency: 'EUR',
    description: 'Gentle walk through the stunning Ordesa Valley with waterfalls and wildlife.',
    highlights: ['Cola de Caballo waterfall', 'Ordesa National Park', 'Wildlife spotting'],
    includes: ['Local expert guide', 'Park entrance fee', 'Binoculars'],
    meeting_point: 'Ordesa visitor center',
    images: ['https://images.unsplash.com/photo-1464822759844-d150ad6d1db8?w=400&h=300&fit=crop'],
    available_dates: ['2024-06-20', '2024-06-27', '2024-07-04'],
    rating: 4.7,
    reviews_count: 28,
    created_at: '2024-02-01'
  },
  {
    id: '4',
    title: 'Ben Nevis Summit Challenge',
    guide_id: 'guide4',
    guide_name: 'Hamish MacDougall',
    guide_avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=100&h=100&fit=crop&crop=face',
    region: 'scotland',
    difficulty: 'expert',
    duration: '12 hours',
    group_size: 4,
    price: 180,
    currency: 'GBP',
    description: 'Conquer the UK\'s highest peak with an experienced Highland guide.',
    highlights: ['UK\'s highest summit', 'Observatory ruins', 'Highland views'],
    includes: ['Mountain guide', 'Safety equipment', 'Hot drinks'],
    meeting_point: 'Ben Nevis visitor center',
    images: ['https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?w=400&h=300&fit=crop'],
    available_dates: ['2024-06-16', '2024-06-23', '2024-06-30'],
    rating: 4.9,
    reviews_count: 15,
    created_at: '2024-02-10'
  },
  {
    id: '5',
    title: 'Isle of Skye Fairy Pools',
    guide_id: 'guide4',
    guide_name: 'Hamish MacDougall',
    guide_avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=100&h=100&fit=crop&crop=face',
    region: 'scotland',
    difficulty: 'easy',
    duration: '5 hours',
    group_size: 12,
    price: 65,
    currency: 'GBP',
    description: 'Magical walk to the famous Fairy Pools with crystal clear waters.',
    highlights: ['Fairy Pools waterfalls', 'Cuillin mountains backdrop', 'Photography spots'],
    includes: ['Local guide', 'Transport from Portree', 'Waterproof maps'],
    meeting_point: 'Portree town center',
    images: ['https://images.unsplash.com/photo-1571842971115-ba0a99c7c5f4?w=400&h=300&fit=crop'],
    available_dates: ['2024-06-17', '2024-06-24', '2024-07-01'],
    rating: 4.6,
    reviews_count: 42,
    created_at: '2024-02-15'
  }
];

export function SearchPage({ filters, onFiltersChange, onTourClick, onBookTour }: SearchPageProps) {
  const [filteredTours, setFilteredTours] = useState(mockTours);
  const config = useWireframeConfig();
  const [showFilters, setShowFilters] = useState(config.searchSidebar === 'left-open'); // Based on wireframe decision
  const [priceRange, setPriceRange] = useState([0, 200]);
  const [reviewScore, setReviewScore] = useState([0, 5]);
  const [favorites, setFavorites] = useState<string[]>([]);

  useEffect(() => {
    let filtered = mockTours;

    // Apply filters based on wireframe decisions
    if (filters.region) {
      filtered = filtered.filter(tour => tour.region === filters.region);
    }
    if (filters.difficulty) {
      filtered = filtered.filter(tour => tour.difficulty === filters.difficulty);
    }
    if (priceRange[1] < 200) {
      filtered = filtered.filter(tour => tour.price <= priceRange[1]);
    }
    if (reviewScore[0] > 0) {
      filtered = filtered.filter(tour => tour.rating >= reviewScore[0]);
    }
    if (filters.length) {
      // Filter by duration/length 
      if (filters.length === 'short') {
        filtered = filtered.filter(tour => parseInt(tour.duration) <= 6);
      } else if (filters.length === 'medium') {
        filtered = filtered.filter(tour => parseInt(tour.duration) > 6 && parseInt(tour.duration) <= 10);
      } else if (filters.length === 'long') {
        filtered = filtered.filter(tour => parseInt(tour.duration) > 10);
      }
    }

    setFilteredTours(filtered);
  }, [filters, priceRange, reviewScore]);

  const toggleFavorite = (tourId: string) => {
    setFavorites(prev => 
      prev.includes(tourId) 
        ? prev.filter(id => id !== tourId)
        : [...prev, tourId]
    );
  };

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

  return (
    <div className="min-h-screen bg-background">
      {/* Search Header */}
      <div className="border-b bg-white sticky top-16 z-40">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Find Your Adventure</h1>
              <p className="text-muted-foreground">
                {filteredTours.length} tours available
              </p>
            </div>
            
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className="lg:hidden"
              >
                <Filter className="h-4 w-4 mr-2" />
                Filters
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <div className={`lg:block ${showFilters ? 'block' : 'hidden'} space-y-6`}>
            <Card className="p-6">
              <h3 className="font-semibold mb-4">Filters</h3>
              
              <div className="space-y-6">
                {/* Region Filter */}
                <div className="space-y-2">
                  <Label>Region</Label>
                  <Select 
                    value={filters.region || "all"} 
                    onValueChange={(value) => onFiltersChange({ ...filters, region: value === "all" ? "" : value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="All regions" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All regions</SelectItem>
                      <SelectItem value="dolomites">Dolomites</SelectItem>
                      <SelectItem value="pyrenees">Pyrenees</SelectItem>
                      <SelectItem value="scotland">Scottish Highlands</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Difficulty Filter */}
                <div className="space-y-2">
                  <Label>Difficulty</Label>
                  <Select 
                    value={filters.difficulty || "all"} 
                    onValueChange={(value) => onFiltersChange({ ...filters, difficulty: value === "all" ? "" : value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="All difficulties" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All difficulties</SelectItem>
                      <SelectItem value="easy">Easy</SelectItem>
                      <SelectItem value="moderate">Moderate</SelectItem>
                      <SelectItem value="challenging">Challenging</SelectItem>
                      <SelectItem value="expert">Expert</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Review Score Filter - Priority per wireframe */}
                <div className="space-y-2">
                  <Label>Review Score</Label>
                  <div className="px-2">
                    <Slider
                      value={reviewScore}
                      onValueChange={setReviewScore}
                      max={5}
                      step={0.1}
                      className="w-full"
                    />
                    <div className="flex justify-between text-sm text-muted-foreground mt-1">
                      <span>{reviewScore[0].toFixed(1)}+ stars</span>
                      <span>5.0 stars</span>
                    </div>
                  </div>
                </div>

                {/* Length/Duration Filter - From wireframe decisions */}
                <div className="space-y-2">
                  <Label>Tour Length</Label>
                  <Select 
                    value={filters.length || "all"} 
                    onValueChange={(value) => onFiltersChange({ ...filters, length: value === "all" ? "" : value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="All lengths" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All lengths</SelectItem>
                      <SelectItem value="short">Short (≤6 hours)</SelectItem>
                      <SelectItem value="medium">Medium (6-10 hours)</SelectItem>
                      <SelectItem value="long">Long (&gt;10 hours)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Price Range */}
                <div className="space-y-2">
                  <Label>Price Range</Label>
                  <div className="px-2">
                    <Slider
                      value={priceRange}
                      onValueChange={setPriceRange}
                      max={200}
                      step={10}
                      className="w-full"
                    />
                    <div className="flex justify-between text-sm text-muted-foreground mt-1">
                      <span>€0</span>
                      <span>€{priceRange[1]}</span>
                    </div>
                  </div>
                </div>

                {/* Average Ascent Filter - From wireframe */}
                <div className="space-y-2">
                  <Label>Average Ascent</Label>
                  <Select 
                    value={filters.ascent || "all"} 
                    onValueChange={(value) => onFiltersChange({ ...filters, ascent: value === "all" ? "" : value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="All ascents" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All ascents</SelectItem>
                      <SelectItem value="low">Low (0-500m)</SelectItem>
                      <SelectItem value="moderate">Moderate (500-1000m)</SelectItem>
                      <SelectItem value="high">High (1000m+)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Tour Type: Guided vs Unguided - From wireframe */}
                <div className="space-y-2">
                  <Label>Tour Type</Label>
                  <Select 
                    value={filters.tourType || "all"} 
                    onValueChange={(value) => onFiltersChange({ ...filters, tourType: value === "all" ? "" : value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="All tours" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All tours</SelectItem>
                      <SelectItem value="guided">Guided tours</SelectItem>
                      <SelectItem value="self-guided">Self-guided tours</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Language Spoken - From wireframe */}
                <div className="space-y-2">
                  <Label>Language Spoken</Label>
                  <Select 
                    value={filters.language || "all"} 
                    onValueChange={(value) => onFiltersChange({ ...filters, language: value === "all" ? "" : value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="All languages" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All languages</SelectItem>
                      <SelectItem value="english">English</SelectItem>
                      <SelectItem value="german">German</SelectItem>
                      <SelectItem value="italian">Italian</SelectItem>
                      <SelectItem value="spanish">Spanish</SelectItem>
                      <SelectItem value="french">French</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Clear Filters */}
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => {
                    onFiltersChange({ 
                      region: '', 
                      difficulty: '', 
                      dateRange: '', 
                      maxPrice: '',
                      length: '',
                      ascent: '',
                      tourType: '',
                      language: ''
                    });
                    setPriceRange([0, 200]);
                    setReviewScore([0, 5]);
                  }}
                >
                  Clear Filters
                </Button>
              </div>
            </Card>
          </div>

          {/* Tours Grid */}
          <div className="lg:col-span-3">
            <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredTours.map((tour) => (
                <Card key={tour.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="aspect-[4/3] relative">
                    <ImageWithFallback
                      src={tour.images[0]}
                      alt={tour.title}
                      className="w-full h-full object-cover"
                    />
                    <button
                      onClick={() => toggleFavorite(tour.id)}
                      className="absolute top-3 right-3 p-2 bg-white/90 rounded-full hover:bg-white transition-colors"
                    >
                      <Heart 
                        className={`h-4 w-4 ${
                          favorites.includes(tour.id) 
                            ? 'fill-red-500 text-red-500' 
                            : 'text-gray-600'
                        }`} 
                      />
                    </button>
                    <div className="absolute top-3 left-3">
                      <Badge className={getDifficultyColor(tour.difficulty)}>
                        {tour.difficulty}
                      </Badge>
                    </div>
                  </div>

                  <CardContent className="p-6">
                    <div className="space-y-3">
                      <div>
                        <h3 
                          className="font-semibold hover:text-primary cursor-pointer"
                          onClick={() => onTourClick(tour)}
                        >
                          {tour.title}
                        </h3>
                        <p className="text-sm text-muted-foreground flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {tour.region.charAt(0).toUpperCase() + tour.region.slice(1)}
                        </p>
                      </div>

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

                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <span className="text-sm font-medium">{tour.rating}</span>
                          <span className="text-sm text-muted-foreground">
                            ({tour.reviews_count})
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <img
                          src={tour.guide_avatar}
                          alt={tour.guide_name}
                          className="w-6 h-6 rounded-full"
                        />
                        <span className="text-sm text-muted-foreground">
                          with {tour.guide_name}
                        </span>
                      </div>

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
                          Book Now
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {filteredTours.length === 0 && (
              <div className="text-center py-12">
                <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No tours found</h3>
                <p className="text-muted-foreground">
                  Try adjusting your filters to see more results
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}