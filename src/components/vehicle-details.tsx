import {
  ArrowLeft,
  BarChart3,
  Bot,
  Car,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  Clock,
  DollarSign,
  Fuel,
  Gauge,
  MessageSquare,
  Phone,
  Star,
  Target,
  TrendingUp,
  Users,
  Wrench,
  Zap
} from 'lucide-react';
import React from 'react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Progress } from './ui/progress';
import { Separator } from './ui/separator';
import { Vehicle } from './vehicle-card';

interface VehicleDetailsProps {
  vehicle: Vehicle;
  onBack: () => void;
  onBook: (vehicleId: string) => void;
}

interface MaintenanceRecord {
  id: string;
  date: string;
  type: string;
  status: 'completed' | 'scheduled' | 'overdue';
  cost: number;
  description: string;
  aiPredicted?: boolean;
}

interface BookingHistory {
  id: string;
  customerName: string;
  dates: string;
  duration: number;
  revenue: number;
  rating: number;
  channel: 'web' | 'whatsapp' | 'sms' | 'phone';
}

// Mock data for enhanced details
const mockMaintenanceRecords: MaintenanceRecord[] = [
  {
    id: 'M001',
    date: '2024-09-15',
    type: 'Oil Change',
    status: 'completed',
    cost: 89.99,
    description: 'Regular oil change and filter replacement',
    aiPredicted: true
  },
  {
    id: 'M002',
    date: '2024-09-25',
    type: 'Brake Inspection',
    status: 'scheduled',
    cost: 150.00,
    description: 'AI-predicted brake maintenance based on usage patterns',
    aiPredicted: true
  },
  {
    id: 'M003',
    date: '2024-08-20',
    type: 'Tire Rotation',
    status: 'completed',
    cost: 45.00,
    description: 'Tire rotation and pressure check'
  }
];

const mockBookingHistory: BookingHistory[] = [
  {
    id: 'B001',
    customerName: 'Sarah Chen',
    dates: 'Sep 10-12, 2024',
    duration: 2,
    revenue: 54.00,
    rating: 5,
    channel: 'whatsapp'
  },
  {
    id: 'B002',
    customerName: 'Mike Johnson',
    dates: 'Sep 5-7, 2024',
    duration: 2,
    revenue: 48.00,
    rating: 4,
    channel: 'web'
  },
  {
    id: 'B003',
    customerName: 'Emily Davis',
    dates: 'Aug 28-30, 2024',
    duration: 2,
    revenue: 52.00,
    rating: 5,
    channel: 'sms'
  }
];

export function VehicleDetails({ vehicle, onBack, onBook }: VehicleDetailsProps) {
  const [currentImageIndex, setCurrentImageIndex] = React.useState(0);
  const [activeTab, setActiveTab] = React.useState<'overview' | 'maintenance' | 'analytics'>('overview');

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % vehicle.images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + vehicle.images.length) % vehicle.images.length);
  };

  const getStatusColor = () => {
    switch (vehicle.status) {
      case 'available':
        return 'bg-accent text-accent-foreground';
      case 'booked':
        return 'bg-destructive text-destructive-foreground';
      case 'maintenance':
        return 'bg-orange-500 text-white';
      case 'limited':
        return 'bg-yellow-500 text-white';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const getMaintenanceStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-accent text-accent-foreground';
      case 'scheduled':
        return 'bg-blue-500 text-white';
      case 'overdue':
        return 'bg-destructive text-destructive-foreground';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const getChannelIcon = (channel: string) => {
    switch (channel) {
      case 'whatsapp':
        return <MessageSquare className="w-3 h-3 text-green-500" />;
      case 'sms':
        return <MessageSquare className="w-3 h-3 text-blue-500" />;
      case 'phone':
        return <Phone className="w-3 h-3 text-orange-500" />;
      default:
        return <Car className="w-3 h-3 text-primary" />;
    }
  };

  const calculateUtilization = () => {
    // Mock calculation - in real app would be based on actual data
    const totalDays = 30;
    const bookedDays = mockBookingHistory.reduce((sum, booking) => sum + booking.duration, 0);
    return Math.round((bookedDays / totalDays) * 100);
  };

  const calculateMonthlyRevenue = () => {
    return mockBookingHistory.reduce((sum, booking) => sum + booking.revenue, 0);
  };

  const averageRating = mockBookingHistory.reduce((sum, booking) => sum + booking.rating, 0) / mockBookingHistory.length;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-white sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="sm" onClick={onBack} aria-label="Back" title="Back">
                <ArrowLeft className="w-4 h-4" />
              </Button>
              <div className="flex items-center gap-3">
                <Car className="w-8 h-8 text-primary" />
                <div>
                  <h1 className="text-xl font-bold text-primary">{vehicle.name}</h1>
                  <p className="text-sm text-muted-foreground">Vehicle ID: {vehicle.id.toUpperCase()}-2024</p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge className={getStatusColor()}>
                {vehicle.status === 'available' && 'Available'}
                {vehicle.status === 'booked' && 'Booked'}
                {vehicle.status === 'maintenance' && 'In Service'}
                {vehicle.status === 'limited' && 'Limited Stock'}
              </Badge>
              <Badge variant="secondary" className="bg-accent/10 text-accent">
                <Bot className="w-3 h-3 mr-1" />
                AI Managed
              </Badge>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Images & Basic Info */}
          <div className="space-y-6">
            {/* Image Gallery */}
            <Card className="overflow-hidden">
              <div className="relative h-80">
                <ImageWithFallback
                  src={vehicle.images[currentImageIndex]}
                  alt={vehicle.name}
                  className="w-full h-full object-cover"
                />
                {vehicle.images.length > 1 && (
                  <>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/20 hover:bg-black/40 text-white"
                      onClick={prevImage}
                      aria-label="Previous image"
                      title="Previous image"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/20 hover:bg-black/40 text-white"
                      onClick={nextImage}
                      aria-label="Next image"
                      title="Next image"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                      {vehicle.images.map((_, index) => (
                        <button
                          key={index}
                          className={`w-3 h-3 rounded-full transition-colors ${
                            index === currentImageIndex ? 'bg-white' : 'bg-white/50'
                          }`}
                          onClick={() => setCurrentImageIndex(index)}
                          aria-label={`Go to image ${index + 1}`}
                          title={`Go to image ${index + 1}`}
                        />
                      ))}
                    </div>
                  </>
                )}
                <div className="absolute top-4 right-4">
                  <div className="bg-primary text-primary-foreground px-3 py-2 rounded-lg font-medium">
                    ${vehicle.pricePerDay}/day
                  </div>
                </div>
              </div>
            </Card>

            {/* Vehicle Specifications */}
            <Card>
              <CardHeader>
                <CardTitle>Vehicle Specifications</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">{vehicle.features.passengers} Passengers</p>
                      <p className="text-xs text-muted-foreground">Seating capacity</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Gauge className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">{vehicle.features.transmission}</p>
                      <p className="text-xs text-muted-foreground">Transmission</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Fuel className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">{vehicle.features.fuelType}</p>
                      <p className="text-xs text-muted-foreground">Fuel type</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <BarChart3 className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">{vehicle.features.mileage}</p>
                      <p className="text-xs text-muted-foreground">Fuel economy</p>
                    </div>
                  </div>
                </div>

                <Separator />

                <div>
                  <h4 className="font-medium mb-3">Standard Features</h4>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-3 h-3 text-accent" />
                      <span>Air Conditioning</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-3 h-3 text-accent" />
                      <span>Bluetooth Audio</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-3 h-3 text-accent" />
                      <span>Backup Camera</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-3 h-3 text-accent" />
                      <span>USB Charging</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-3 h-3 text-accent" />
                      <span>Keyless Entry</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-3 h-3 text-accent" />
                      <span>Safety Package</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Booking Action */}
            <Card>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Ready to book?</h4>
                      <p className="text-sm text-muted-foreground">
                        {vehicle.availability || 'Available for immediate pickup'}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-primary">${vehicle.pricePerDay}</p>
                      <p className="text-sm text-muted-foreground">per day</p>
                    </div>
                  </div>
                  <Button 
                    onClick={() => onBook(vehicle.id)} 
                    disabled={vehicle.status !== 'available'}
                    className="w-full"
                    size="lg"
                  >
                    {vehicle.status === 'available' ? 'Book This Vehicle' : 'Currently Unavailable'}
                  </Button>
                  <div className="text-center text-xs text-muted-foreground">
                    AI-optimized pricing • 24/7 support • Instant confirmation
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Detailed Information */}
          <div className="space-y-6">
            {/* AI Analytics Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bot className="w-5 h-5 text-accent" />
                  AI Fleet Analytics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-accent" />
                      <span className="text-sm">Utilization Rate</span>
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-2xl font-bold text-accent">{calculateUtilization()}%</span>
                        <Badge variant="secondary" className="bg-accent/10 text-accent">
                          +8% vs avg
                        </Badge>
                      </div>
                      <Progress value={calculateUtilization()} className="h-2" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <DollarSign className="w-4 h-4 text-green-600" />
                      <span className="text-sm">Monthly Revenue</span>
                    </div>
                    <div>
                      <span className="text-2xl font-bold text-green-600">${calculateMonthlyRevenue().toFixed(0)}</span>
                      <p className="text-xs text-muted-foreground">This month</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Star className="w-4 h-4 text-yellow-500" />
                      <span className="text-sm">Customer Rating</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-2xl font-bold text-yellow-600">{averageRating.toFixed(1)}</span>
                      <div className="flex">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star 
                            key={star} 
                            className={`w-3 h-3 ${star <= averageRating ? 'text-yellow-500 fill-current' : 'text-muted-foreground'}`} 
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Target className="w-4 h-4 text-primary" />
                      <span className="text-sm">AI Predictions</span>
                    </div>
                    <div>
                      <span className="text-2xl font-bold text-primary">94%</span>
                      <p className="text-xs text-muted-foreground">Accuracy rate</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Tabs */}
            <Card>
              <CardHeader>
                <div className="flex space-x-4 border-b">
                  <button
                    className={`pb-2 px-1 border-b-2 transition-colors ${
                      activeTab === 'overview' 
                        ? 'border-primary text-primary' 
                        : 'border-transparent text-muted-foreground hover:text-foreground'
                    }`}
                    onClick={() => setActiveTab('overview')}
                  >
                    Overview
                  </button>
                  <button
                    className={`pb-2 px-1 border-b-2 transition-colors ${
                      activeTab === 'maintenance' 
                        ? 'border-primary text-primary' 
                        : 'border-transparent text-muted-foreground hover:text-foreground'
                    }`}
                    onClick={() => setActiveTab('maintenance')}
                  >
                    Maintenance
                  </button>
                  <button
                    className={`pb-2 px-1 border-b-2 transition-colors ${
                      activeTab === 'analytics' 
                        ? 'border-primary text-primary' 
                        : 'border-transparent text-muted-foreground hover:text-foreground'
                    }`}
                    onClick={() => setActiveTab('analytics')}
                  >
                    Booking History
                  </button>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                {activeTab === 'overview' && (
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium mb-2">Current Status</h4>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Availability</span>
                          <Badge className={getStatusColor()}>
                            {vehicle.status === 'available' && 'Ready for Rental'}
                            {vehicle.status === 'booked' && 'Currently Rented'}
                            {vehicle.status === 'maintenance' && 'In Service'}
                            {vehicle.status === 'limited' && 'Limited Availability'}
                          </Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Last Cleaned</span>
                          <span className="text-sm text-muted-foreground">Today, 8:00 AM</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Fuel Level</span>
                          <span className="text-sm text-muted-foreground">100% (Full Tank)</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Mileage</span>
                          <span className="text-sm text-muted-foreground">45,230 km</span>
                        </div>
                      </div>
                    </div>

                    <Separator />

                    <div>
                      <h4 className="font-medium mb-2">AI Insights</h4>
                      <div className="space-y-3">
                        <div className="flex items-start gap-2 p-3 bg-accent/5 rounded-lg border border-accent/20">
                          <Zap className="w-4 h-4 text-accent mt-0.5" />
                          <div>
                            <p className="text-sm font-medium text-accent">High Demand Predicted</p>
                            <p className="text-xs text-muted-foreground">
                              AI predicts 85% booking probability for this weekend. Consider dynamic pricing.
                            </p>
                          </div>
                        </div>
                        <div className="flex items-start gap-2 p-3 bg-blue-50 rounded-lg border border-blue-200">
                          <Clock className="w-4 h-4 text-blue-600 mt-0.5" />
                          <div>
                            <p className="text-sm font-medium text-blue-600">Maintenance Due Soon</p>
                            <p className="text-xs text-muted-foreground">
                              Brake inspection recommended in 5 days based on usage patterns.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'maintenance' && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">Maintenance History</h4>
                      <Badge variant="secondary" className="bg-accent/10 text-accent">
                        <Bot className="w-3 h-3 mr-1" />
                        AI Predicted
                      </Badge>
                    </div>
                    
                    <div className="space-y-3">
                      {mockMaintenanceRecords.map((record) => (
                        <div key={record.id} className="border rounded-lg p-3">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <Wrench className="w-4 h-4 text-muted-foreground" />
                              <span className="font-medium text-sm">{record.type}</span>
                              {record.aiPredicted && (
                                <Bot className="w-3 h-3 text-accent" />
                              )}
                            </div>
                            <Badge className={getMaintenanceStatusColor(record.status)}>
                              {record.status}
                            </Badge>
                          </div>
                          <p className="text-xs text-muted-foreground mb-2">{record.description}</p>
                          <div className="flex items-center justify-between text-xs text-muted-foreground">
                            <span>{record.date}</span>
                            <span>${record.cost.toFixed(2)}</span>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="bg-muted/30 p-3 rounded-lg">
                      <div className="flex items-start gap-2">
                        <Bot className="w-4 h-4 text-accent mt-0.5" />
                        <div>
                          <p className="text-sm font-medium text-accent">AI Maintenance Optimization</p>
                          <p className="text-xs text-muted-foreground">
                            Predictive maintenance has reduced unexpected breakdowns by 78% and saved $1,240 in emergency repairs.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'analytics' && (
                  <div className="space-y-4">
                    <h4 className="font-medium">Recent Bookings</h4>
                    
                    <div className="space-y-3">
                      {mockBookingHistory.map((booking) => (
                        <div key={booking.id} className="border rounded-lg p-3">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              {getChannelIcon(booking.channel)}
                              <span className="font-medium text-sm">{booking.customerName}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <Star 
                                  key={star} 
                                  className={`w-3 h-3 ${star <= booking.rating ? 'text-yellow-500 fill-current' : 'text-muted-foreground'}`} 
                                />
                              ))}
                            </div>
                          </div>
                          <div className="flex items-center justify-between text-xs text-muted-foreground">
                            <span>{booking.dates}</span>
                            <span className="font-medium text-green-600">${booking.revenue.toFixed(2)}</span>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="bg-muted/30 p-3 rounded-lg">
                      <div className="flex items-start gap-2">
                        <BarChart3 className="w-4 h-4 text-primary mt-0.5" />
                        <div>
                          <p className="text-sm font-medium text-primary">Performance Summary</p>
                          <p className="text-xs text-muted-foreground">
                            This vehicle generates 15% above average revenue with 95% customer satisfaction across all channels.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}