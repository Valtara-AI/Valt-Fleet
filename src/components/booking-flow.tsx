import {
    ArrowLeft,
    Bot,
    Calendar,
    Car,
    CheckCircle,
    Clock,
    CreditCard,
    Gauge,
    Loader2,
    Mail,
    MapPin,
    Phone,
    Shield,
    User,
    Users
} from 'lucide-react';
import React from 'react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Checkbox } from './ui/checkbox';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Progress } from './ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Separator } from './ui/separator';
import { Vehicle } from './vehicle-card';

interface BookingFlowProps {
  vehicle: Vehicle;
  onBack: () => void;
  onComplete: (bookingData: BookingData) => void;
}

interface BookingData {
  vehicleId: string;
  customerInfo: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    licenseNumber: string;
  };
  rentalDetails: {
    pickupDate: string;
    pickupTime: string;
    returnDate: string;
    returnTime: string;
    pickupLocation: string;
    additionalDriver: boolean;
    insurance: boolean;
    gps: boolean;
  };
  pricing: {
    baseRate: number;
    days: number;
    addons: number;
    taxes: number;
    total: number;
  };
}

export function BookingFlow({ vehicle, onBack, onComplete }: BookingFlowProps) {
  const [currentStep, setCurrentStep] = React.useState(1);
  const [bookingData, setBookingData] = React.useState<Partial<BookingData>>({
    vehicleId: vehicle.id,
    customerInfo: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      licenseNumber: ''
    },
    rentalDetails: {
      pickupDate: '',
      pickupTime: '09:00',
      returnDate: '',
      returnTime: '17:00',
      pickupLocation: 'downtown-saskatoon',
      additionalDriver: false,
      insurance: false,
      gps: false
    }
  });
  const [isProcessing, setIsProcessing] = React.useState(false);
  const [aiOptimizing, setAiOptimizing] = React.useState(false);

  // Calculate pricing
  const calculatePricing = () => {
    const pickupDate = new Date(bookingData.rentalDetails?.pickupDate || '');
    const returnDate = new Date(bookingData.rentalDetails?.returnDate || '');
    const days = Math.max(1, Math.ceil((returnDate.getTime() - pickupDate.getTime()) / (1000 * 60 * 60 * 24)));
    
    const baseRate = vehicle.pricePerDay * days;
    let addons = 0;
    
    if (bookingData.rentalDetails?.additionalDriver) addons += 5 * days;
    if (bookingData.rentalDetails?.insurance) addons += 8 * days;
    if (bookingData.rentalDetails?.gps) addons += 3 * days;
    
    const subtotal = baseRate + addons;
    const taxes = subtotal * 0.11; // 11% tax
    const total = subtotal + taxes;

    return {
      baseRate,
      days,
      addons,
      taxes,
      total
    };
  };

  const pricing = calculatePricing();

  const updateCustomerInfo = (field: string, value: string) => {
    setBookingData(prev => ({
      ...prev,
      customerInfo: {
        ...prev.customerInfo!,
        [field]: value
      }
    }));
  };

  const updateRentalDetails = (field: string, value: string | boolean) => {
    setBookingData(prev => ({
      ...prev,
      rentalDetails: {
        ...prev.rentalDetails!,
        [field]: value
      }
    }));
  };

  const handleNextStep = async () => {
    if (currentStep === 2) {
      // AI optimization simulation
      setAiOptimizing(true);
      await new Promise(resolve => setTimeout(resolve, 2000));
      setAiOptimizing(false);
    }
    setCurrentStep(prev => prev + 1);
  };

  const handlePreviousStep = () => {
    setCurrentStep(prev => prev - 1);
  };

  const handleCompleteBooking = async () => {
    setIsProcessing(true);
    
    // Simulate booking process
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    const completedBooking: BookingData = {
      ...bookingData as BookingData,
      pricing
    };
    
    onComplete(completedBooking);
    setIsProcessing(false);
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-4">Rental Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="pickup-date">Pickup Date</Label>
                  <div className="relative">
                    <Input
                      id="pickup-date"
                      type="date"
                      value={bookingData.rentalDetails?.pickupDate}
                      onChange={(e) => updateRentalDetails('pickupDate', e.target.value)}
                      min={new Date().toISOString().split('T')[0]}
                    />
                    <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="pickup-time">Pickup Time</Label>
                  <div className="relative">
                    <Input
                      id="pickup-time"
                      type="time"
                      value={bookingData.rentalDetails?.pickupTime}
                      onChange={(e) => updateRentalDetails('pickupTime', e.target.value)}
                    />
                    <Clock className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="return-date">Return Date</Label>
                  <div className="relative">
                    <Input
                      id="return-date"
                      type="date"
                      value={bookingData.rentalDetails?.returnDate}
                      onChange={(e) => updateRentalDetails('returnDate', e.target.value)}
                      min={bookingData.rentalDetails?.pickupDate || new Date().toISOString().split('T')[0]}
                    />
                    <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="return-time">Return Time</Label>
                  <div className="relative">
                    <Input
                      id="return-time"
                      type="time"
                      value={bookingData.rentalDetails?.returnTime}
                      onChange={(e) => updateRentalDetails('returnTime', e.target.value)}
                    />
                    <Clock className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  </div>
                </div>
              </div>

              <div className="mt-4 space-y-2">
                <Label htmlFor="pickup-location">Pickup Location</Label>
                <Select 
                  value={bookingData.rentalDetails?.pickupLocation} 
                  onValueChange={(value: string) => updateRentalDetails('pickupLocation', value)}
                >
                  <SelectTrigger>
                    <MapPin className="w-4 h-4 mr-2" />
                    <SelectValue placeholder="Select pickup location" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="downtown-saskatoon">Downtown Saskatoon</SelectItem>
                    <SelectItem value="airport">YXE Airport (+$25 fee)</SelectItem>
                    <SelectItem value="university">University Area</SelectItem>
                    <SelectItem value="north-industrial">North Industrial</SelectItem>
                    <SelectItem value="delivery">Delivery to Your Location (+$35)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <h4 className="font-medium mb-3">Add-ons</h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="additional-driver"
                      checked={bookingData.rentalDetails?.additionalDriver}
                      onCheckedChange={(checked: boolean | 'indeterminate') => updateRentalDetails('additionalDriver', Boolean(checked))}
                    />
                    <Label htmlFor="additional-driver" className="font-normal">
                      Additional Driver
                    </Label>
                  </div>
                  <span className="text-sm text-muted-foreground">+$5/day</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="insurance"
                      checked={bookingData.rentalDetails?.insurance}
                      onCheckedChange={(checked: boolean | 'indeterminate') => updateRentalDetails('insurance', Boolean(checked))}
                    />
                    <Label htmlFor="insurance" className="font-normal">
                      Basic Insurance Coverage
                    </Label>
                  </div>
                  <span className="text-sm text-muted-foreground">+$8/day</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="gps"
                      checked={bookingData.rentalDetails?.gps}
                      onCheckedChange={(checked: boolean | 'indeterminate') => updateRentalDetails('gps', Boolean(checked))}
                    />
                    <Label htmlFor="gps" className="font-normal">
                      GPS Navigation
                    </Label>
                  </div>
                  <span className="text-sm text-muted-foreground">+$3/day</span>
                </div>
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-4">Customer Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="first-name">First Name</Label>
                  <div className="relative">
                    <Input
                      id="first-name"
                      value={bookingData.customerInfo?.firstName}
                      onChange={(e) => updateCustomerInfo('firstName', e.target.value)}
                      placeholder="John"
                    />
                    <User className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="last-name">Last Name</Label>
                  <div className="relative">
                    <Input
                      id="last-name"
                      value={bookingData.customerInfo?.lastName}
                      onChange={(e) => updateCustomerInfo('lastName', e.target.value)}
                      placeholder="Doe"
                    />
                    <User className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <div className="relative">
                    <Input
                      id="email"
                      type="email"
                      value={bookingData.customerInfo?.email}
                      onChange={(e) => updateCustomerInfo('email', e.target.value)}
                      placeholder="john.doe@example.com"
                    />
                    <Mail className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <div className="relative">
                    <Input
                      id="phone"
                      type="tel"
                      value={bookingData.customerInfo?.phone}
                      onChange={(e) => updateCustomerInfo('phone', e.target.value)}
                      placeholder="(639) 123-4567"
                    />
                    <Phone className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  </div>
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="license">Driver's License Number</Label>
                  <div className="relative">
                    <Input
                      id="license"
                      value={bookingData.customerInfo?.licenseNumber}
                      onChange={(e) => updateCustomerInfo('licenseNumber', e.target.value)}
                      placeholder="SK123456789"
                    />
                    <Shield className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  </div>
                </div>
              </div>
            </div>

            {aiOptimizing && (
              <Card className="border-accent bg-accent/5">
                <CardContent className="flex items-center gap-3 py-4">
                  <Bot className="w-5 h-5 text-accent animate-pulse" />
                  <div className="flex-1">
                    <p className="font-medium text-accent">AI Optimizing Your Booking</p>
                    <p className="text-sm text-muted-foreground">Checking availability, pricing, and scheduling conflicts...</p>
                  </div>
                  <Loader2 className="w-4 h-4 animate-spin text-accent" />
                </CardContent>
              </Card>
            )}
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-4">Review & Confirm</h3>
              
              {/* Booking Summary */}
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle>Booking Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex gap-4">
                    <div className="w-20 h-16 rounded-lg overflow-hidden">
                      <ImageWithFallback
                        src={vehicle.images[0]}
                        alt={vehicle.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium">{vehicle.name}</h4>
                      <p className="text-sm text-muted-foreground">{vehicle.type}</p>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground mt-1">
                        <span className="flex items-center gap-1">
                          <Users className="w-3 h-3" />
                          {vehicle.features.passengers} seats
                        </span>
                        <span className="flex items-center gap-1">
                          <Gauge className="w-3 h-3" />
                          {vehicle.features.transmission}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">${vehicle.pricePerDay}/day</p>
                      <Badge className="text-xs bg-accent text-accent-foreground">Available</Badge>
                    </div>
                  </div>

                  <Separator />

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Pickup</p>
                      <p className="font-medium">{bookingData.rentalDetails?.pickupDate}</p>
                      <p className="text-xs text-muted-foreground">{bookingData.rentalDetails?.pickupTime}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Return</p>
                      <p className="font-medium">{bookingData.rentalDetails?.returnDate}</p>
                      <p className="text-xs text-muted-foreground">{bookingData.rentalDetails?.returnTime}</p>
                    </div>
                  </div>

                  <div>
                    <p className="text-sm text-muted-foreground">Pickup Location</p>
                    <p className="font-medium">
                      {bookingData.rentalDetails?.pickupLocation === 'downtown-saskatoon' && 'Downtown Saskatoon'}
                      {bookingData.rentalDetails?.pickupLocation === 'airport' && 'YXE Airport'}
                      {bookingData.rentalDetails?.pickupLocation === 'university' && 'University Area'}
                      {bookingData.rentalDetails?.pickupLocation === 'north-industrial' && 'North Industrial'}
                      {bookingData.rentalDetails?.pickupLocation === 'delivery' && 'Delivery to Your Location'}
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Customer Information */}
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle>Customer Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Name</p>
                      <p className="font-medium">
                        {bookingData.customerInfo?.firstName} {bookingData.customerInfo?.lastName}
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Phone</p>
                      <p className="font-medium">{bookingData.customerInfo?.phone}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Email</p>
                      <p className="font-medium">{bookingData.customerInfo?.email}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">License</p>
                      <p className="font-medium">{bookingData.customerInfo?.licenseNumber}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Pricing Breakdown */}
              <Card>
                <CardHeader>
                  <CardTitle>Pricing Breakdown</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span>Base Rate ({pricing.days} days)</span>
                    <span>${pricing.baseRate.toFixed(2)}</span>
                  </div>
                  {pricing.addons > 0 && (
                    <div className="flex justify-between">
                      <span>Add-ons</span>
                      <span>${pricing.addons.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span>Taxes (11%)</span>
                    <span>${pricing.taxes.toFixed(2)}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-medium text-lg">
                    <span>Total</span>
                    <span>${pricing.total.toFixed(2)}</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="text-center space-y-6">
            {isProcessing ? (
              <div className="space-y-4">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                  <Loader2 className="w-8 h-8 text-primary animate-spin" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">Processing Your Booking</h3>
                  <p className="text-muted-foreground">AI is optimizing your reservation across all channels...</p>
                </div>
                <div className="space-y-2 text-sm text-left max-w-md mx-auto">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-accent" />
                    <span>Checking vehicle availability</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-accent" />
                    <span>Verifying customer information</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin text-primary" />
                    <span>Processing payment authorization</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <div className="w-4 h-4 rounded-full border-2 border-muted"></div>
                    <span>Sending confirmation</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle className="w-8 h-8 text-accent" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-accent">Booking Confirmed!</h3>
                  <p className="text-muted-foreground">Your reservation has been successfully processed</p>
                </div>
                <Card className="text-left">
                  <CardContent className="pt-6">
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between">
                        <span>Confirmation Number</span>
                        <span className="font-mono font-medium">ER{Date.now().toString().slice(-6)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Total Amount</span>
                        <span className="font-medium">${pricing.total.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Payment Status</span>
                        <Badge className="bg-accent text-accent-foreground">Authorized</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <div className="bg-muted/30 p-4 rounded-lg text-sm">
                  <div className="flex items-start gap-2">
                    <Bot className="w-4 h-4 text-accent mt-0.5" />
                    <div className="text-left">
                      <p className="font-medium text-accent">AI Booking Confirmation</p>
                      <p className="text-muted-foreground">
                        Confirmation sent via SMS, email, and WhatsApp. Vehicle reserved and ready for pickup.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  const isStepValid = () => {
    switch (currentStep) {
      case 1:
        return bookingData.rentalDetails?.pickupDate && 
               bookingData.rentalDetails?.returnDate && 
               bookingData.rentalDetails?.pickupLocation;
      case 2:
        return bookingData.customerInfo?.firstName && 
               bookingData.customerInfo?.lastName && 
               bookingData.customerInfo?.email && 
               bookingData.customerInfo?.phone && 
               bookingData.customerInfo?.licenseNumber;
      case 3:
        return true;
      default:
        return false;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-white sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="sm" onClick={onBack}>
                <ArrowLeft className="w-4 h-4" />
              </Button>
              <div className="flex items-center gap-3">
                <Car className="w-8 h-8 text-primary" />
                <div>
                  <h1 className="text-xl font-bold text-primary">Book {vehicle.name}</h1>
                  <p className="text-sm text-muted-foreground">AI-Powered Booking Process</p>
                </div>
              </div>
            </div>
            <Badge variant="secondary" className="bg-accent text-accent-foreground">
              <Bot className="w-3 h-3 mr-1" />
              AI Optimized
            </Badge>
          </div>
        </div>
      </header>

      {/* Progress */}
      <div className="bg-muted/30 border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Step {currentStep} of 4</span>
            <span className="text-sm text-muted-foreground">
              {currentStep === 1 && 'Rental Details'}
              {currentStep === 2 && 'Customer Information'}
              {currentStep === 3 && 'Review & Confirm'}
              {currentStep === 4 && 'Confirmation'}
            </span>
          </div>
          <Progress value={(currentStep / 4) * 100} className="h-2" />
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardContent className="p-6">
              {renderStepContent()}
            </CardContent>
          </Card>

          {/* Navigation */}
          <div className="flex justify-between mt-6">
            <Button 
              variant="outline" 
              onClick={currentStep === 1 ? onBack : handlePreviousStep}
              disabled={isProcessing}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              {currentStep === 1 ? 'Back to Vehicles' : 'Previous'}
            </Button>
            
            {currentStep < 3 ? (
              <Button 
                onClick={handleNextStep}
                disabled={!isStepValid() || aiOptimizing}
              >
                {aiOptimizing ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    AI Processing...
                  </>
                ) : (
                  'Continue'
                )}
              </Button>
            ) : currentStep === 3 ? (
              <Button 
                onClick={handleCompleteBooking}
                disabled={isProcessing}
                className="bg-accent hover:bg-accent/90 text-accent-foreground"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    Confirm Booking
                    <CreditCard className="w-4 h-4 ml-2" />
                  </>
                )}
              </Button>
            ) : (
              <Button onClick={onBack} className="bg-accent hover:bg-accent/90 text-accent-foreground">
                Done
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}