import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Calendar, MapPin, Star, User, Clock, CreditCard, Search, MessageCircle, Heart, CheckCircle } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface UserDashboardProps {
  user: any;
  onNavigateToSearch: () => void;
  onTourClick: (tour: any) => void;
}

export function UserDashboard({ user, onNavigateToSearch, onTourClick }: UserDashboardProps) {
  const [bookings, setBookings] = useState<any[]>([]);
  const [favorites, setFavorites] = useState<any[]>([]);

  useEffect(() => {
    // Load bookings from localStorage
    const savedBookings = JSON.parse(localStorage.getItem('madetohike-bookings') || '[]');
    const userBookings = savedBookings.filter((booking: any) => booking.user_id === user.id);
    setBookings(userBookings);

    // Mock favorites for demo
    const mockFavorites = [
      {
        id: '1',
        title: 'Tre Cime di Lavaredo Circuit',
        region: 'dolomites',
        price: 95,
        currency: 'EUR',
        rating: 4.9,
        image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300&h=200&fit=crop'
      },
      {
        id: '5',
        title: 'Isle of Skye Fairy Pools',
        region: 'scotland',
        price: 65,
        currency: 'GBP',
        rating: 4.6,
        image: 'https://images.unsplash.com/photo-1571842971115-ba0a99c7c5f4?w=300&h=200&fit=crop'
      }
    ];
    setFavorites(mockFavorites);
  }, [user.id]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatPrice = (price: number, currency: string) => {
    const symbol = currency === 'EUR' ? '€' : '£';
    return `${symbol}${price}`;
  };

  const upcomingBookings = bookings.filter(booking => 
    new Date(booking.date) > new Date() && booking.status === 'confirmed'
  );
  const pastBookings = bookings.filter(booking => 
    new Date(booking.date) <= new Date() || booking.status === 'completed'
  );

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Welcome back, {user.name}!</h1>
            <p className="text-muted-foreground">Manage your hiking adventures</p>
          </div>
          <Button onClick={onNavigateToSearch}>
            <Search className="h-4 w-4 mr-2" />
            Find More Tours
          </Button>
        </div>

        {/* Stats Overview */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-2xl font-bold text-primary">{bookings.length}</div>
              <div className="text-sm text-muted-foreground">Total Bookings</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-2xl font-bold text-green-600">{upcomingBookings.length}</div>
              <div className="text-sm text-muted-foreground">Upcoming Tours</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-2xl font-bold text-blue-600">{pastBookings.length}</div>
              <div className="text-sm text-muted-foreground">Completed Tours</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-2xl font-bold text-purple-600">{favorites.length}</div>
              <div className="text-sm text-muted-foreground">Favorite Tours</div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="upcoming" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="upcoming">Upcoming Tours</TabsTrigger>
            <TabsTrigger value="past">Past Tours</TabsTrigger>
            <TabsTrigger value="favorites">Favorites</TabsTrigger>
            <TabsTrigger value="profile">Profile</TabsTrigger>
          </TabsList>

          <TabsContent value="upcoming" className="space-y-6">
            {upcomingBookings.length > 0 ? (
              <div className="space-y-4">
                {upcomingBookings.map((booking) => (
                  <Card key={booking.id}>
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className="w-20 h-20 bg-muted rounded-lg flex items-center justify-center">
                          <Calendar className="h-8 w-8 text-muted-foreground" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <h3 className="font-semibold text-lg">{booking.tour_title}</h3>
                              <p className="text-muted-foreground">with {booking.guide_name}</p>
                            </div>
                            <Badge className={getStatusColor(booking.status)}>
                              {booking.status}
                            </Badge>
                          </div>
                          
                          <div className="grid md:grid-cols-3 gap-4 text-sm">
                            <div className="flex items-center gap-2">
                              <Calendar className="h-4 w-4 text-muted-foreground" />
                              <span>{new Date(booking.date).toLocaleDateString('en-US', { 
                                weekday: 'long', 
                                year: 'numeric',
                                month: 'long', 
                                day: 'numeric' 
                              })}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <User className="h-4 w-4 text-muted-foreground" />
                              <span>{booking.group_size} {booking.group_size === 1 ? 'person' : 'people'}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <CreditCard className="h-4 w-4 text-muted-foreground" />
                              <span>{formatPrice(booking.total_price, booking.currency)}</span>
                            </div>
                          </div>

                          <div className="flex gap-2 mt-4">
                            <Button size="sm" variant="outline">
                              <MessageCircle className="h-4 w-4 mr-2" />
                              Contact Guide
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
            ) : (
              <Card>
                <CardContent className="p-12 text-center">
                  <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No Upcoming Tours</h3>
                  <p className="text-muted-foreground mb-4">
                    Ready for your next adventure? Browse our available tours.
                  </p>
                  <Button onClick={onNavigateToSearch}>
                    <Search className="h-4 w-4 mr-2" />
                    Find Tours
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="past" className="space-y-6">
            {pastBookings.length > 0 ? (
              <div className="space-y-4">
                {pastBookings.map((booking) => (
                  <Card key={booking.id}>
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className="w-20 h-20 bg-muted rounded-lg flex items-center justify-center">
                          <CheckCircle className="h-8 w-8 text-green-600" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <h3 className="font-semibold text-lg">{booking.tour_title}</h3>
                              <p className="text-muted-foreground">with {booking.guide_name}</p>
                            </div>
                            <Badge className="bg-blue-100 text-blue-800">Completed</Badge>
                          </div>
                          
                          <div className="grid md:grid-cols-3 gap-4 text-sm mb-4">
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
                          </div>

                          <div className="flex gap-2">
                            <Button size="sm" variant="outline">
                              <Star className="h-4 w-4 mr-2" />
                              Write Review
                            </Button>
                            <Button size="sm" variant="outline">
                              Book Again
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="p-12 text-center">
                  <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No Past Tours</h3>
                  <p className="text-muted-foreground">
                    Your completed tours will appear here after your adventures.
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="favorites" className="space-y-6">
            {favorites.length > 0 ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {favorites.map((tour) => (
                  <Card key={tour.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                    <div className="aspect-[4/3] relative">
                      <ImageWithFallback
                        src={tour.image}
                        alt={tour.title}
                        className="w-full h-full object-cover"
                      />
                      <button className="absolute top-3 right-3 p-2 bg-white/90 rounded-full">
                        <Heart className="h-4 w-4 fill-red-500 text-red-500" />
                      </button>
                    </div>
                    <CardContent className="p-4">
                      <div className="space-y-2">
                        <h3 className="font-semibold">{tour.title}</h3>
                        <div className="flex items-center justify-between text-sm">
                          <div className="flex items-center gap-1">
                            <MapPin className="h-3 w-3 text-muted-foreground" />
                            <span>{tour.region.charAt(0).toUpperCase() + tour.region.slice(1)}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                            <span>{tour.rating}</span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between pt-2">
                          <span className="font-semibold">{formatPrice(tour.price, tour.currency)}</span>
                          <Button size="sm" onClick={() => onTourClick(tour)}>
                            View Tour
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="p-12 text-center">
                  <Heart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No Favorite Tours</h3>
                  <p className="text-muted-foreground mb-4">
                    Save tours you're interested in to easily find them later.
                  </p>
                  <Button onClick={onNavigateToSearch}>
                    <Search className="h-4 w-4 mr-2" />
                    Browse Tours
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="profile" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                    <User className="h-8 w-8 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">{user.name}</h3>
                    <p className="text-muted-foreground">{user.email}</p>
                    <Badge className="mt-1">Verified Hiker</Badge>
                  </div>
                </div>
                
                <div className="pt-4">
                  <Button variant="outline">Edit Profile</Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Preferences</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Difficulty Preference</h4>
                  <div className="flex gap-2">
                    <Badge variant="secondary">Easy</Badge>
                    <Badge variant="secondary">Moderate</Badge>
                  </div>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Favorite Regions</h4>
                  <div className="flex gap-2">
                    <Badge variant="secondary">Dolomites</Badge>
                    <Badge variant="secondary">Scottish Highlands</Badge>
                  </div>
                </div>
                <Button variant="outline">Update Preferences</Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}