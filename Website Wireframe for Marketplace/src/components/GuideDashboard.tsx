import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Calendar, MapPin, Star, User, Clock, CreditCard, Plus, Edit, Eye, BarChart3, MessageCircle, Shield } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface GuideDashboardProps {
  user: any;
  onTourClick: (tour: any) => void;
  onStartVerification?: () => void;
}

export function GuideDashboard({ user, onTourClick, onStartVerification }: GuideDashboardProps) {
  const [tours, setTours] = useState<any[]>([]);
  const [bookings, setBookings] = useState<any[]>([]);
  const [showCreateTour, setShowCreateTour] = useState(false);
  const [newTour, setNewTour] = useState({
    title: '',
    region: '',
    difficulty: '',
    duration: '',
    group_size: 8,
    price: 0,
    description: '',
    highlights: [''],
    includes: [''],
    meeting_point: ''
  });

  useEffect(() => {
    // Mock guide tours
    const mockTours = [
      {
        id: '1',
        title: 'Tre Cime di Lavaredo Circuit',
        region: 'dolomites',
        difficulty: 'moderate',
        duration: '8 hours',
        group_size: 8,
        price: 95,
        currency: 'EUR',
        description: 'Experience the iconic Three Peaks with stunning alpine views and rich WWI history.',
        status: 'active',
        bookings_count: 12,
        rating: 4.9,
        reviews_count: 47,
        created_at: '2024-01-15'
      },
      {
        id: '2',
        title: 'Seceda Ridge Adventure',
        region: 'dolomites',
        difficulty: 'challenging',
        duration: '10 hours',
        group_size: 6,
        price: 120,
        currency: 'EUR',
        description: 'Challenging hike to one of the most photographed viewpoints in the Dolomites.',
        status: 'active',
        bookings_count: 8,
        rating: 4.8,
        reviews_count: 32,
        created_at: '2024-01-20'
      }
    ];
    setTours(mockTours);

    // Mock bookings for this guide
    const mockBookings = [
      {
        id: '1',
        tour_id: '1',
        tour_title: 'Tre Cime di Lavaredo Circuit',
        user_name: 'Sarah Johnson',
        date: '2024-07-15',
        group_size: 4,
        total_price: 380,
        currency: 'EUR',
        status: 'confirmed',
        created_at: '2024-06-01'
      },
      {
        id: '2',
        tour_id: '2',
        tour_title: 'Seceda Ridge Adventure',
        user_name: 'Mike Chen',
        date: '2024-07-22',
        group_size: 2,
        total_price: 240,
        currency: 'EUR',
        status: 'confirmed',
        created_at: '2024-06-05'
      }
    ];
    setBookings(mockBookings);
  }, []);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-800';
      case 'moderate': return 'bg-yellow-100 text-yellow-800';
      case 'challenging': return 'bg-orange-100 text-orange-800';
      case 'expert': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'draft': return 'bg-yellow-100 text-yellow-800';
      case 'paused': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatPrice = (price: number, currency: string) => {
    const symbol = currency === 'EUR' ? '€' : '£';
    return `${symbol}${price}`;
  };

  const totalEarnings = bookings.reduce((sum, booking) => sum + (booking.total_price * 0.85), 0); // 85% after platform fee
  const upcomingBookings = bookings.filter(booking => new Date(booking.date) > new Date());

  const handleCreateTour = () => {
    // In real app, this would save to Supabase
    const tour = {
      ...newTour,
      id: Date.now().toString(),
      guide_id: user.id,
      currency: 'EUR',
      status: user.verified ? 'active' : 'draft',
      bookings_count: 0,
      rating: 0,
      reviews_count: 0,
      created_at: new Date().toISOString()
    };

    setTours(prev => [...prev, tour]);
    setShowCreateTour(false);
    setNewTour({
      title: '',
      region: '',
      difficulty: '',
      duration: '',
      group_size: 8,
      price: 0,
      description: '',
      highlights: [''],
      includes: [''],
      meeting_point: ''
    });
  };

  const updateNewTour = (field: string, value: any) => {
    setNewTour(prev => ({ ...prev, [field]: value }));
  };

  const addArrayField = (field: 'highlights' | 'includes') => {
    setNewTour(prev => ({
      ...prev,
      [field]: [...prev[field], '']
    }));
  };

  const updateArrayField = (field: 'highlights' | 'includes', index: number, value: string) => {
    setNewTour(prev => ({
      ...prev,
      [field]: prev[field].map((item, i) => i === index ? value : item)
    }));
  };

  // Show verification status banner for unverified guides
  const getVerificationStatus = () => {
    switch (user.verification_status) {
      case 'pending':
        return (
          <Card className="mb-8 border-yellow-200 bg-yellow-50">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                  <Clock className="h-6 w-6 text-yellow-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-yellow-800">Verification In Progress</h3>
                  <p className="text-yellow-700">Your verification request is being reviewed. We'll notify you once it's complete.</p>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      case 'rejected':
        return (
          <Card className="mb-8 border-red-200 bg-red-50">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                  <Shield className="h-6 w-6 text-red-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-red-800">Verification Required</h3>
                  <p className="text-red-700">Your previous verification was rejected. Please review the requirements and try again.</p>
                </div>
                <Button onClick={onStartVerification} className="bg-red-600 hover:bg-red-700">
                  Restart Verification
                </Button>
              </div>
            </CardContent>
          </Card>
        );
      case 'not_requested':
        return (
          <Card className="mb-8 border-blue-200 bg-blue-50">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <Shield className="h-6 w-6 text-blue-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-blue-800">Complete Verification to Go Live</h3>
                  <p className="text-blue-700">Submit required documents to start accepting bookings and earning from your tours.</p>
                </div>
                <Button onClick={onStartVerification} className="bg-blue-600 hover:bg-blue-700">
                  Start Verification
                </Button>
              </div>
            </CardContent>
          </Card>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Verification Status */}
        {getVerificationStatus()}

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Guide Dashboard</h1>
            <p className="text-muted-foreground">Manage your tours and bookings</p>
          </div>
          <Button onClick={() => setShowCreateTour(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Create New Tour
          </Button>
        </div>

        {/* Stats Overview */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-2xl font-bold text-primary">{tours.length}</div>
              <div className="text-sm text-muted-foreground">Active Tours</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-2xl font-bold text-green-600">{upcomingBookings.length}</div>
              <div className="text-sm text-muted-foreground">Upcoming Bookings</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-2xl font-bold text-blue-600">€{Math.round(totalEarnings)}</div>
              <div className="text-sm text-muted-foreground">Total Earnings</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-2xl font-bold text-purple-600">4.9</div>
              <div className="text-sm text-muted-foreground">Average Rating</div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="tours" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="tours">My Tours</TabsTrigger>
            <TabsTrigger value="bookings">Bookings</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="profile">Profile</TabsTrigger>
          </TabsList>

          <TabsContent value="tours" className="space-y-6">
            <div className="space-y-4">
              {tours.map((tour) => (
                <Card key={tour.id}>
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="w-20 h-20 bg-muted rounded-lg flex items-center justify-center">
                        <MapPin className="h-8 w-8 text-muted-foreground" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h3 className="font-semibold text-lg">{tour.title}</h3>
                            <p className="text-muted-foreground">{tour.region.charAt(0).toUpperCase() + tour.region.slice(1)} • {tour.duration}</p>
                          </div>
                          <div className="flex gap-2">
                            <Badge className={getStatusColor(tour.status)}>
                              {tour.status}
                            </Badge>
                            <Badge className={getDifficultyColor(tour.difficulty)}>
                              {tour.difficulty}
                            </Badge>
                          </div>
                        </div>
                        
                        <p className="text-sm text-muted-foreground mb-4">{tour.description}</p>
                        
                        <div className="grid md:grid-cols-4 gap-4 text-sm mb-4">
                          <div>
                            <div className="text-muted-foreground">Price</div>
                            <div className="font-medium">{formatPrice(tour.price, tour.currency)}/person</div>
                          </div>
                          <div>
                            <div className="text-muted-foreground">Bookings</div>
                            <div className="font-medium">{tour.bookings_count}</div>
                          </div>
                          <div>
                            <div className="text-muted-foreground">Rating</div>
                            <div className="font-medium flex items-center gap-1">
                              <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                              {tour.rating > 0 ? tour.rating : 'No reviews'}
                            </div>
                          </div>
                          <div>
                            <div className="text-muted-foreground">Reviews</div>
                            <div className="font-medium">{tour.reviews_count}</div>
                          </div>
                        </div>

                        <div className="flex gap-2">
                          <Button size="sm" variant="outline">
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => onTourClick(tour)}>
                            <Eye className="h-4 w-4 mr-2" />
                            View
                          </Button>
                          <Button size="sm" variant="outline">
                            <BarChart3 className="h-4 w-4 mr-2" />
                            Analytics
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="bookings" className="space-y-6">
            <div className="space-y-4">
              {bookings.map((booking) => (
                <Card key={booking.id}>
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                        <User className="h-6 w-6 text-primary" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h3 className="font-semibold">{booking.user_name}</h3>
                            <p className="text-muted-foreground">{booking.tour_title}</p>
                          </div>
                          <Badge className="bg-green-100 text-green-800">Confirmed</Badge>
                        </div>
                        
                        <div className="grid md:grid-cols-4 gap-4 text-sm">
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            <span>{new Date(booking.date).toLocaleDateString()}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <User className="h-4 w-4 text-muted-foreground" />
                            <span>{booking.group_size} {booking.group_size === 1 ? 'person' : 'people'}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <CreditCard className="h-4 w-4 text-muted-foreground" />
                            <span>{formatPrice(booking.total_price, booking.currency)}</span>
                          </div>
                          <div className="text-muted-foreground text-right">
                            Your share: {formatPrice(Math.round(booking.total_price * 0.85), booking.currency)}
                          </div>
                        </div>

                        <div className="flex gap-2 mt-4">
                          <Button size="sm" variant="outline">
                            <MessageCircle className="h-4 w-4 mr-2" />
                            Contact Customer
                          </Button>
                          <Button size="sm" variant="outline">
                            View Details
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Earnings Overview</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span>Total Bookings:</span>
                      <span className="font-medium">{formatPrice(bookings.reduce((sum, b) => sum + b.total_price, 0), 'EUR')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Platform Fee (15%):</span>
                      <span className="font-medium">-{formatPrice(bookings.reduce((sum, b) => sum + (b.total_price * 0.15), 0), 'EUR')}</span>
                    </div>
                    <div className="flex justify-between text-lg font-semibold">
                      <span>Your Earnings:</span>
                      <span>{formatPrice(totalEarnings, 'EUR')}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Performance Metrics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span>Average Rating:</span>
                      <span className="font-medium flex items-center gap-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        4.9
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Total Reviews:</span>
                      <span className="font-medium">79</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Response Rate:</span>
                      <span className="font-medium">98%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="profile" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Guide Profile</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                    <User className="h-8 w-8 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">{user.name}</h3>
                    <p className="text-muted-foreground">{user.email}</p>
                    <div className="flex gap-2 mt-1">
                      <Badge className="bg-green-100 text-green-800">Verified Guide</Badge>
                      <Badge variant="secondary">Mountain Expert</Badge>
                    </div>
                  </div>
                </div>
                
                <div className="pt-4">
                  <Button variant="outline">Edit Profile</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Create Tour Modal/Form */}
        {showCreateTour && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <CardHeader>
                <CardTitle>Create New Tour</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label>Tour Title</Label>
                    <Input
                      value={newTour.title}
                      onChange={(e) => updateNewTour('title', e.target.value)}
                      placeholder="e.g., Tre Cime di Lavaredo Circuit"
                    />
                  </div>
                  
                  <div>
                    <Label>Region</Label>
                    <Select value={newTour.region} onValueChange={(value) => updateNewTour('region', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select region" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="dolomites">Dolomites</SelectItem>
                        <SelectItem value="pyrenees">Pyrenees</SelectItem>
                        <SelectItem value="scotland">Scottish Highlands</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <Label>Difficulty</Label>
                    <Select value={newTour.difficulty} onValueChange={(value) => updateNewTour('difficulty', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select difficulty" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="easy">Easy</SelectItem>
                        <SelectItem value="moderate">Moderate</SelectItem>
                        <SelectItem value="challenging">Challenging</SelectItem>
                        <SelectItem value="expert">Expert</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label>Duration</Label>
                    <Input
                      value={newTour.duration}
                      onChange={(e) => updateNewTour('duration', e.target.value)}
                      placeholder="e.g., 8 hours"
                    />
                  </div>
                  
                  <div>
                    <Label>Price (€)</Label>
                    <Input
                      type="number"
                      value={newTour.price}
                      onChange={(e) => updateNewTour('price', parseInt(e.target.value) || 0)}
                      placeholder="95"
                    />
                  </div>
                </div>

                <div>
                  <Label>Description</Label>
                  <Textarea
                    value={newTour.description}
                    onChange={(e) => updateNewTour('description', e.target.value)}
                    placeholder="Describe your tour experience..."
                  />
                </div>

                <div className="flex gap-4 justify-end">
                  <Button variant="outline" onClick={() => setShowCreateTour(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleCreateTour}>
                    Create Tour
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}