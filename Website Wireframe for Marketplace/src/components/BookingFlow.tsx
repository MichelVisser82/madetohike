import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Textarea } from './ui/textarea';
import { Calendar, Users, CreditCard, Shield, ArrowLeft, CheckCircle, MapPin, Clock } from 'lucide-react';

interface BookingFlowProps {
  tour: any;
  user: any;
  onComplete: () => void;
  onCancel: () => void;
  onNeedHikerRegistration?: () => void;
}

export function BookingFlow({ tour, user, onComplete, onCancel, onNeedHikerRegistration }: BookingFlowProps) {
  const [step, setStep] = useState(1);

  // If no user, trigger hiker registration
  if (!user && onNeedHikerRegistration) {
    onNeedHikerRegistration();
    return null;
  }

  // If still no user, show error
  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto text-center">
          <p>Please sign in to continue with booking.</p>
        </div>
      </div>
    );
  }
  const [bookingData, setBookingData] = useState({
    date: '',
    groupSize: 1,
    participants: [{ name: user?.name || '', email: user?.email || '', phone: '', emergencyContact: '' }],
    specialRequests: '',
    paymentMethod: 'card'
  });
  const [processing, setProcessing] = useState(false);

  const formatPrice = (price: number, currency: string) => {
    const symbol = currency === 'EUR' ? '€' : '£';
    return `${symbol}${price}`;
  };

  const totalPrice = tour.price * bookingData.groupSize;
  const platformFee = Math.round(totalPrice * 0.05); // 5% platform fee
  const finalTotal = totalPrice + platformFee;

  const updateBookingData = (field: string, value: any) => {
    setBookingData(prev => ({ ...prev, [field]: value }));
  };

  const updateParticipant = (index: number, field: string, value: string) => {
    const updated = [...bookingData.participants];
    updated[index] = { ...updated[index], [field]: value };
    updateBookingData('participants', updated);
  };

  const addParticipant = () => {
    if (bookingData.participants.length < tour.group_size) {
      updateBookingData('participants', [
        ...bookingData.participants,
        { name: '', email: '', phone: '', emergencyContact: '' }
      ]);
    }
  };

  const removeParticipant = (index: number) => {
    if (bookingData.participants.length > 1) {
      const updated = bookingData.participants.filter((_, i) => i !== index);
      updateBookingData('participants', updated);
      updateBookingData('groupSize', updated.length);
    }
  };

  const handleGroupSizeChange = (size: number) => {
    updateBookingData('groupSize', size);
    
    // Adjust participants array
    const current = bookingData.participants.length;
    if (size > current) {
      const newParticipants = [...bookingData.participants];
      for (let i = current; i < size; i++) {
        newParticipants.push({ name: '', email: '', phone: '', emergencyContact: '' });
      }
      updateBookingData('participants', newParticipants);
    } else if (size < current) {
      updateBookingData('participants', bookingData.participants.slice(0, size));
    }
  };

  const processBooking = async () => {
    setProcessing(true);
    
    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Save booking to localStorage (in real app would go to Supabase)
    const booking = {
      id: Date.now().toString(),
      tour_id: tour.id,
      tour_title: tour.title,
      guide_name: tour.guide_name,
      user_id: user.id,
      date: bookingData.date,
      group_size: bookingData.groupSize,
      participants: bookingData.participants,
      total_price: finalTotal,
      currency: tour.currency,
      status: 'confirmed',
      created_at: new Date().toISOString()
    };
    
    const existingBookings = JSON.parse(localStorage.getItem('madetohike-bookings') || '[]');
    localStorage.setItem('madetohike-bookings', JSON.stringify([...existingBookings, booking]));
    
    setProcessing(false);
    setStep(4); // Success step
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-semibold mb-2">Select Date & Group Size</h2>
              <p className="text-muted-foreground">Choose your preferred date and number of participants</p>
            </div>

            <div className="space-y-4">
              <div>
                <Label>Select Date</Label>
                <Select value={bookingData.date} onValueChange={(value) => updateBookingData('date', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a date" />
                  </SelectTrigger>
                  <SelectContent>
                    {(tour.available_dates || []).map((date: string) => (
                      <SelectItem key={date} value={date}>
                        {new Date(date).toLocaleDateString('en-US', { 
                          weekday: 'long', 
                          year: 'numeric',
                          month: 'long', 
                          day: 'numeric' 
                        })}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Group Size</Label>
                <Select 
                  value={bookingData.groupSize.toString()} 
                  onValueChange={(value) => handleGroupSizeChange(parseInt(value))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {[...Array(Math.min(8, tour.group_size))].map((_, i) => (
                      <SelectItem key={i + 1} value={(i + 1).toString()}>
                        {i + 1} {i === 0 ? 'person' : 'people'}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex justify-between">
              <Button variant="outline" onClick={onCancel}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Tour
              </Button>
              <Button 
                onClick={() => setStep(2)}
                disabled={!bookingData.date || bookingData.groupSize < 1}
              >
                Continue
              </Button>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-semibold mb-2">Participant Information</h2>
              <p className="text-muted-foreground">Please provide details for all participants</p>
            </div>

            <div className="space-y-6">
              {bookingData.participants.map((participant, index) => (
                <Card key={index}>
                  <CardHeader>
                    <CardTitle className="text-lg">
                      Participant {index + 1}
                      {index === 0 && <Badge className="ml-2">You</Badge>}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label>Full Name</Label>
                        <Input
                          value={participant.name}
                          onChange={(e) => updateParticipant(index, 'name', e.target.value)}
                          placeholder="Full name"
                          required
                        />
                      </div>
                      <div>
                        <Label>Email</Label>
                        <Input
                          type="email"
                          value={participant.email}
                          onChange={(e) => updateParticipant(index, 'email', e.target.value)}
                          placeholder="Email address"
                          required
                        />
                      </div>
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label>Phone Number</Label>
                        <Input
                          value={participant.phone}
                          onChange={(e) => updateParticipant(index, 'phone', e.target.value)}
                          placeholder="Phone number"
                          required
                        />
                      </div>
                      <div>
                        <Label>Emergency Contact</Label>
                        <Input
                          value={participant.emergencyContact}
                          onChange={(e) => updateParticipant(index, 'emergencyContact', e.target.value)}
                          placeholder="Emergency contact number"
                          required
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div>
              <Label>Special Requests or Dietary Requirements</Label>
              <Textarea
                value={bookingData.specialRequests}
                onChange={(e) => updateBookingData('specialRequests', e.target.value)}
                placeholder="Any special requests, dietary requirements, or medical conditions we should know about..."
                className="mt-2"
              />
            </div>

            <div className="flex justify-between">
              <Button variant="outline" onClick={() => setStep(1)}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
              <Button 
                onClick={() => setStep(3)}
                disabled={bookingData.participants.some(p => !p.name || !p.email || !p.phone)}
              >
                Continue to Payment
              </Button>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-semibold mb-2">Payment & Confirmation</h2>
              <p className="text-muted-foreground">Review your booking and complete payment</p>
            </div>

            {/* Booking Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Booking Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span>Tour:</span>
                  <span className="font-medium">{tour.title}</span>
                </div>
                <div className="flex justify-between">
                  <span>Date:</span>
                  <span>{new Date(bookingData.date).toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    year: 'numeric',
                    month: 'long', 
                    day: 'numeric' 
                  })}</span>
                </div>
                <div className="flex justify-between">
                  <span>Participants:</span>
                  <span>{bookingData.groupSize} {bookingData.groupSize === 1 ? 'person' : 'people'}</span>
                </div>
                <div className="flex justify-between">
                  <span>Guide:</span>
                  <span>{tour.guide_name}</span>
                </div>
                <Separator />
                <div className="flex justify-between">
                  <span>Tour price ({bookingData.groupSize}x {formatPrice(tour.price, tour.currency)}):</span>
                  <span>{formatPrice(totalPrice, tour.currency)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Platform fee:</span>
                  <span>{formatPrice(platformFee, tour.currency)}</span>
                </div>
                <Separator />
                <div className="flex justify-between font-semibold text-lg">
                  <span>Total:</span>
                  <span>{formatPrice(finalTotal, tour.currency)}</span>
                </div>
              </CardContent>
            </Card>

            {/* Payment Method */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Payment Method
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label>Card Number</Label>
                    <Input placeholder="1234 5678 9012 3456" />
                  </div>
                  <div>
                    <Label>Cardholder Name</Label>
                    <Input placeholder="Full name on card" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Expiry Date</Label>
                    <Input placeholder="MM/YY" />
                  </div>
                  <div>
                    <Label>CVV</Label>
                    <Input placeholder="123" />
                  </div>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Shield className="h-4 w-4" />
                  <span>Your payment is secured with SSL encryption</span>
                </div>
              </CardContent>
            </Card>

            <div className="bg-amber-50 p-4 rounded-lg text-sm">
              <p className="text-amber-800">
                <strong>Cancellation Policy:</strong> Free cancellation up to 48 hours before the tour. 
                Cancellations within 48 hours are subject to a 50% charge.
              </p>
            </div>

            <div className="flex justify-between">
              <Button variant="outline" onClick={() => setStep(2)}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
              <Button 
                onClick={processBooking}
                disabled={processing}
                className="min-w-32"
              >
                {processing ? 'Processing...' : `Pay ${formatPrice(finalTotal, tour.currency)}`}
              </Button>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="text-center space-y-6">
            <div className="flex justify-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
            </div>
            
            <div>
              <h2 className="text-2xl font-semibold mb-2">Booking Confirmed!</h2>
              <p className="text-muted-foreground">
                Your hiking adventure is confirmed. You'll receive a confirmation email shortly.
              </p>
            </div>

            <Card>
              <CardContent className="p-6 space-y-4">
                <div className="flex justify-between">
                  <span>Booking ID:</span>
                  <span className="font-mono">#{Date.now().toString().slice(-6)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tour:</span>
                  <span className="font-medium">{tour.title}</span>
                </div>
                <div className="flex justify-between">
                  <span>Date:</span>
                  <span>{new Date(bookingData.date).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Total Paid:</span>
                  <span className="font-semibold">{formatPrice(finalTotal, tour.currency)}</span>
                </div>
              </CardContent>
            </Card>

            <div className="space-y-3">
              <h3 className="font-semibold">What's Next?</h3>
              <div className="text-left space-y-2 text-sm">
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>You'll receive a confirmation email with tour details</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Your guide will contact you 24-48 hours before the tour</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>You can find all booking details in your dashboard</span>
                </div>
              </div>
            </div>

            <Button onClick={onComplete} className="w-full">
              Go to Dashboard
            </Button>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          {/* Progress Bar */}
          {step < 4 && (
            <div className="mb-8">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Step {step} of 3</span>
                <span className="text-sm text-muted-foreground">{Math.round((step / 3) * 100)}% Complete</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div 
                  className="bg-primary h-2 rounded-full transition-all duration-300"
                  style={{ width: `${(step / 3) * 100}%` }}
                />
              </div>
            </div>
          )}

          {/* Tour Header (except on success page) */}
          {step < 4 && (
            <Card className="mb-6">
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  {tour.images && tour.images.length > 0 && (
                   <img
                     src={tour.images[0]}
                     alt={tour.title}
                     className="w-16 h-16 rounded-lg object-cover"
                   />
                 )}
                  <div className="flex-1">
                    <h3 className="font-semibold">{tour.title}</h3>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        <span>{tour.region.charAt(0).toUpperCase() + tour.region.slice(1)}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        <span>{tour.duration}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="h-3 w-3" />
                        <span>with {tour.guide_name}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step Content */}
          <Card>
            <CardContent className="p-6">
              {renderStep()}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}