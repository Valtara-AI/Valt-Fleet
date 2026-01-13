import valtLogo from '@/assets/valtlogo.png';
import {
    ArrowLeft,
    Calendar,
    Car,
    ChevronLeft,
    ChevronRight,
    Filter,
    Grid3X3,
    Heart,
    MapPin,
    Play,
    Quote,
    Share2,
    Star,
    Users
} from 'lucide-react';
import React from 'react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { ThemeToggle } from './theme-toggle';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';

interface GalleryProps {
  onBack: () => void;
  user?: any;
  onLogout?: () => void;
}

interface Vehicle {
  id: string;
  name: string;
  type: string;
  category: 'compact' | 'sedan' | 'suv' | 'van' | 'truck' | 'luxury';
  images: string[];
  pricePerDay: number;
  features: {
    passengers: number;
    transmission: string;
    fuelType: string;
    mileage: string;
  };
  rating: number;
  reviews: number;
}

interface TestimonialWithPhoto {
  id: string;
  name: string;
  role: string;
  content: string;
  avatar: string;
  rating: number;
  vehicleRented: string;
  rentalDate: string;
  location: string;
  rentalPhotos: string[];
}

const galleryVehicles: Vehicle[] = [
  {
    id: '1',
    name: 'Honda Civic',
    type: 'Compact Sedan',
    category: 'compact',
    images: [
      'https://images.unsplash.com/photo-1742997742821-3b9c571b6571?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb21wYWN0JTIwY2FyJTIwcmVudGFsJTIwaG9uZGElMjBjaXZpY3xlbnwxfHx8fDE3NTgzNTU1OTJ8MA&ixlib=rb-4.1.0&q=80&w=1080',
      'https://images.unsplash.com/photo-1684082018938-9c30f2a7045d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzZWRhbiUyMGNhciUyMHJlbnRhbHxlbnwxfHx8fDE3NTgyNjY0ODR8MA&ixlib=rb-4.1.0&q=80&w=1080',
      'https://images.unsplash.com/photo-1631295813259-7a5d6e56f2e9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb21wYWN0JTIwY2FyJTIwaW50ZXJpb3J8ZW58MXx8fHwxNzU4MzU1NjAyfDA&ixlib=rb-4.1.0&q=80&w=1080'
    ],
    pricePerDay: 18,
    features: {
      passengers: 5,
      transmission: 'Automatic',
      fuelType: 'Gas',
      mileage: '32 MPG'
    },
    rating: 4.8,
    reviews: 127
  },
  {
    id: '2',
    name: 'Toyota RAV4',
    type: 'Compact SUV',
    category: 'suv',
    images: [
      'https://images.unsplash.com/photo-1751163917838-867d8e2a2983?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdXYlMjByZW50YWwlMjBjYXIlMjB0b3lvdGF8ZW58MXx8fHwxNzU4MzU1NTk1fDA&ixlib=rb-4.1.0&q=80&w=1080',
      'https://images.unsplash.com/photo-1616003507368-9ddb1e18f1cd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdXYlMjBpbnRlcmlvcnxlbnwxfHx8fDE3NTgzNTU2MDh8MA&ixlib=rb-4.1.0&q=80&w=1080'
    ],
    pricePerDay: 28,
    features: {
      passengers: 7,
      transmission: 'Automatic',
      fuelType: 'Gas',
      mileage: '28 MPG'
    },
    rating: 4.9,
    reviews: 89
  },
  {
    id: '3',
    name: 'Ford Transit',
    type: 'Van',
    category: 'van',
    images: [
      'https://images.unsplash.com/photo-1649320101556-54e0011d3f28?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2YW4lMjByZW50YWwlMjBtaW5pdmFufGVufDF8fHx8MTc1ODM1NTU5OXww&ixlib=rb-4.1.0&q=80&w=1080',
      'https://images.unsplash.com/photo-1591880092646-1b3bb7ad8585?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2YW4lMjBpbnRlcmlvcnxlbnwxfHx8fDE3NTgzNTU2MTF8MA&ixlib=rb-4.1.0&q=80&w=1080'
    ],
    pricePerDay: 45,
    features: {
      passengers: 8,
      transmission: 'Automatic',
      fuelType: 'Gas',
      mileage: '22 MPG'
    },
    rating: 4.7,
    reviews: 54
  },
  {
    id: '4',
    name: 'BMW 3 Series',
    type: 'Luxury Sedan',
    category: 'luxury',
    images: [
      'https://images.unsplash.com/photo-1580414297497-9e5e2e35b7d5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBjYXIlMjByZW50YWx8ZW58MXx8fHwxNzU4MzU1NjE0fDA&ixlib=rb-4.1.0&q=80&w=1080',
      'https://images.unsplash.com/photo-1563258249-eede17c0e8b2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBjYXIlMjBpbnRlcmlvcnxlbnwxfHx8fDE3NTgzNTU2MTd8MA&ixlib=rb-4.1.0&q=80&w=1080'
    ],
    pricePerDay: 65,
    features: {
      passengers: 5,
      transmission: 'Automatic',
      fuelType: 'Gas',
      mileage: '26 MPG'
    },
    rating: 4.9,
    reviews: 34
  },
  {
    id: '5',
    name: 'Ford F-150',
    type: 'Pickup Truck',
    category: 'truck',
    images: [
      'https://images.unsplash.com/photo-1563298723-dcfebaa392e3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0cnVjayUyMHJlbnRhbCUyMHBpY2t1cHxlbnwxfHx8fDE3NTgzNTU2MjF8MA&ixlib=rb-4.1.0&q=80&w=1080',
      'https://images.unsplash.com/photo-1551829175-a7e3d9c5b1f0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0cnVjayUyMGludGVyaW9yfGVufDF8fHx8MTc1ODM1NTYyM3ww&ixlib=rb-4.1.0&q=80&w=1080'
    ],
    pricePerDay: 55,
    features: {
      passengers: 5,
      transmission: 'Automatic',
      fuelType: 'Gas',
      mileage: '19 MPG'
    },
    rating: 4.6,
    reviews: 72
  },
  {
    id: '6',
    name: 'Nissan Sentra',
    type: 'Compact Sedan',
    category: 'sedan',
    images: [
      'https://images.unsplash.com/photo-1684082018938-9c30f2a7045d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzZWRhbiUyMGNhciUyMHJlbnRhbHxlbnwxfHx8fDE3NTgyNjY0ODR8MA&ixlib=rb-4.1.0&q=80&w=1080'
    ],
    pricePerDay: 16,
    features: {
      passengers: 5,
      transmission: 'Manual',
      fuelType: 'Gas',
      mileage: '35 MPG'
    },
    rating: 4.5,
    reviews: 98
  }
];

const clientTestimonials: TestimonialWithPhoto[] = [
  {
    id: '1',
    name: 'Sarah Chen',
    role: 'Business Professional',
    content: 'Rented the BMW 3 Series for a client meeting. The car was immaculate and the service was exceptional. Easy Rent Auto made the whole process seamless!',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b890?w=100&h=100&fit=crop&crop=face',
    rating: 5,
    vehicleRented: 'BMW 3 Series',
    rentalDate: 'March 15, 2024',
    location: 'Downtown Saskatoon',
    rentalPhotos: [
      'https://images.unsplash.com/photo-1580414297497-9e5e2e35b7d5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBjYXIlMjByZW50YWx8ZW58MXx8fHwxNzU4MzU1NjE0fDA&ixlib=rb-4.1.0&q=80&w=300',
      'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidXNpbmVzcyUyMG1lZXRpbmd8ZW58MXx8fHwxNzU4MzU1NjI3fDA&ixlib=rb-4.1.0&q=80&w=300'
    ]
  },
  {
    id: '2',
    name: 'Mike Rodriguez',
    role: 'Family Vacation',
    content: 'The Toyota RAV4 was perfect for our family road trip to Banff. Spacious, comfortable, and great fuel economy. The kids loved it!',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
    rating: 5,
    vehicleRented: 'Toyota RAV4',
    rentalDate: 'July 8, 2024',
    location: 'YXE Airport',
    rentalPhotos: [
      'https://images.unsplash.com/photo-1751163917838-867d8e2a2983?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdXYlMjByZW50YWwlMjBjYXIlMjB0b3lvdGF8ZW58MXx8fHwxNzU4MzU1NTk1fDA&ixlib=rb-4.1.0&q=80&w=300',
      'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYW1pbHklMjB2YWNhdGlvbiUyMG1vdW50YWluc3xlbnwxfHx8fDE3NTgzNTU2MzB8MA&ixlib=rb-4.1.0&q=80&w=300'
    ]
  },
  {
    id: '3',
    name: 'Emma Thompson',
    role: 'Moving & Relocation',
    content: 'Needed a van for moving day and the Ford Transit was exactly what we needed. Clean, reliable, and made our move so much easier.',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face',
    rating: 5,
    vehicleRented: 'Ford Transit',
    rentalDate: 'September 12, 2024',
    location: 'University Area',
    rentalPhotos: [
      'https://images.unsplash.com/photo-1649320101556-54e0011d3f28?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2YW4lMjByZW50YWwlMjBtaW5pdmFufGVufDF8fHx8MTc1ODM1NTU5OXww&ixlib=rb-4.1.0&q=80&w=300',
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb3ZpbmclMjBib3hlc3xlbnwxfHx8fDE3NTgzNTU2MzN8MA&ixlib=rb-4.1.0&q=80&w=300'
    ]
  },
  {
    id: '4',
    name: 'James Wilson',
    role: 'Weekend Adventure',
    content: 'The Ford F-150 was perfect for our camping trip. Handled the rough terrain like a champ and had plenty of space for all our gear.',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
    rating: 5,
    vehicleRented: 'Ford F-150',
    rentalDate: 'August 20, 2024',
    location: 'North Industrial',
    rentalPhotos: [
      'https://images.unsplash.com/photo-1563298723-dcfebaa392e3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0cnVjayUyMHJlbnRhbCUyMHBpY2t1cHxlbnwxfHx8fDE3NTgzNTU2MjF8MA&ixlib=rb-4.1.0&q=80&w=300',
      'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYW1waW5nJTIwYWR2ZW50dXJlfGVufDF8fHx8MTc1ODM1NTYzNnww&ixlib=rb-4.1.0&q=80&w=300'
    ]
  }
];

export function Gallery({ onBack, user, onLogout }: GalleryProps) {
  const [selectedCategory, setSelectedCategory] = React.useState<string>('all');
  const [currentTestimonial, setCurrentTestimonial] = React.useState(0);
  const [activeTab, setActiveTab] = React.useState('vehicles');

  const filteredVehicles = selectedCategory === 'all' 
    ? galleryVehicles 
    : galleryVehicles.filter(vehicle => vehicle.category === selectedCategory);

  const nextTestimonial = () => {
    setCurrentTestimonial((prev) => (prev + 1) % clientTestimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentTestimonial((prev) => (prev - 1 + clientTestimonials.length) % clientTestimonials.length);
  };

  React.useEffect(() => {
    const interval = setInterval(() => {
      nextTestimonial();
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card/80 backdrop-blur-md sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" onClick={onBack} className="p-2">
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <div className="flex items-center gap-3">
                <img src={(valtLogo as any).src ?? (valtLogo as unknown as string)} alt="Easy Rent Auto" className="w-8 h-8" />
                <div>
                  <h1 className="text-xl font-bold text-primary">Easy Rent Auto Gallery</h1>
                  <p className="text-sm text-muted-foreground">Explore our fleet and client experiences</p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <ThemeToggle />
              <div className="hidden md:flex items-center gap-2 text-sm text-muted-foreground">
                <span>(639) 471-4669</span>
              </div>
              {user && (
                <div className="flex items-center gap-3">
                  <Badge variant="outline" className="border-primary/20">
                    {user.email}
                  </Badge>
                  <Button variant="outline" size="sm" onClick={onLogout}>
                    Logout
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Gallery Content */}
      <div className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="vehicles" className="flex items-center gap-2">
              <Car className="w-4 h-4" />
              Vehicle Gallery
            </TabsTrigger>
            <TabsTrigger value="testimonials" className="flex items-center gap-2">
              <Quote className="w-4 h-4" />
              Client Stories
            </TabsTrigger>
            <TabsTrigger value="experiences" className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              Rental Experiences
            </TabsTrigger>
          </TabsList>

          {/* Vehicle Gallery Tab */}
          <TabsContent value="vehicles" className="space-y-6">
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
              <div>
                <h2 className="text-3xl font-bold mb-2">Our Premium Fleet</h2>
                <p className="text-muted-foreground">From compact cars to luxury vehicles, find the perfect ride for any occasion</p>
              </div>
              
              <div className="flex gap-3">
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="w-48">
                    <Filter className="w-4 h-4 mr-2" />
                    <SelectValue placeholder="Filter by category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Vehicles</SelectItem>
                    <SelectItem value="compact">Compact Cars</SelectItem>
                    <SelectItem value="sedan">Sedans</SelectItem>
                    <SelectItem value="suv">SUVs</SelectItem>
                    <SelectItem value="van">Vans</SelectItem>
                    <SelectItem value="truck">Pickup Trucks</SelectItem>
                    <SelectItem value="luxury">Luxury Cars</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredVehicles.map((vehicle) => (
                <Card key={vehicle.id} className="group overflow-hidden hover:shadow-xl transition-all duration-300 border border-border">
                  <div className="relative overflow-hidden">
                    <ImageWithFallback
                      src={vehicle.images[0]}
                      alt={vehicle.name}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-4 left-4">
                      <Badge className="bg-background/90 text-foreground border border-border">
                        From ${vehicle.pricePerDay}/day
                      </Badge>
                    </div>
                    <div className="absolute top-4 right-4 flex gap-2">
                      <Button size="sm" variant="secondary" className="bg-background/90 border border-border">
                        <Heart className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="secondary" className="bg-background/90 border border-border">
                        <Share2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  
                  <CardContent className="p-6">
                    <div className="space-y-3">
                      <div>
                        <h3 className="font-bold text-lg">{vehicle.name}</h3>
                        <p className="text-sm text-muted-foreground">{vehicle.type}</p>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-4 h-4 ${
                                i < Math.floor(vehicle.rating)
                                  ? 'text-accent fill-accent'
                                  : 'text-muted-foreground'
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-sm font-medium">{vehicle.rating}</span>
                        <span className="text-sm text-muted-foreground">({vehicle.reviews} reviews)</span>
                      </div>

                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div className="flex items-center gap-2">
                          <Users className="w-4 h-4 text-muted-foreground" />
                          <span>{vehicle.features.passengers} passengers</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Car className="w-4 h-4 text-muted-foreground" />
                          <span>{vehicle.features.transmission}</span>
                        </div>
                      </div>

                      <div className="flex gap-2 mt-4">
                        <Button className="flex-1">
                          Book Now
                        </Button>
                        <Button variant="outline" size="sm">
                          <Grid3X3 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Client Testimonials Tab */}
          <TabsContent value="testimonials" className="space-y-6">
            <div className="text-center space-y-4">
              <h2 className="text-3xl font-bold">What Our Clients Say</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Real experiences from real customers who have trusted Easy Rent Auto for their transportation needs
              </p>
            </div>

            <div className="max-w-4xl mx-auto">
              <Card className="border-2 border-primary/20 shadow-xl">
                <CardContent className="p-8">
                  <div className="relative">
                    <Quote className="w-8 h-8 text-primary/20 absolute -top-2 -left-2" />
                    <div className="flex flex-col md:flex-row gap-6">
                      <div className="flex-shrink-0">
                        <div className="w-20 h-20 rounded-full overflow-hidden border-4 border-primary/20">
                          <ImageWithFallback
                            src={clientTestimonials[currentTestimonial].avatar}
                            alt={clientTestimonials[currentTestimonial].name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </div>
                      
                      <div className="flex-1 space-y-4">
                        <div className="flex items-center gap-2">
                          {[...Array(clientTestimonials[currentTestimonial].rating)].map((_, i) => (
                            <Star key={i} className="w-5 h-5 text-accent fill-accent" />
                          ))}
                        </div>
                        
                        <p className="text-lg italic leading-relaxed">
                          "{clientTestimonials[currentTestimonial].content}"
                        </p>
                        
                        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                          <div>
                            <p className="font-bold">{clientTestimonials[currentTestimonial].name}</p>
                            <p className="text-sm text-muted-foreground">{clientTestimonials[currentTestimonial].role}</p>
                          </div>
                          <div className="flex gap-4 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Car className="w-4 h-4" />
                              <span>{clientTestimonials[currentTestimonial].vehicleRented}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              <span>{clientTestimonials[currentTestimonial].rentalDate}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <MapPin className="w-4 h-4" />
                              <span>{clientTestimonials[currentTestimonial].location}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="flex items-center justify-center gap-4 mt-6">
                <Button variant="outline" size="sm" onClick={prevTestimonial}>
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <div className="flex gap-2">
                  {clientTestimonials.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentTestimonial(index)}
                      aria-label={`Go to testimonial ${index + 1}`}
                      title={`Go to testimonial ${index + 1}`}
                      className={`w-3 h-3 rounded-full transition-colors ${
                        index === currentTestimonial ? 'bg-primary' : 'bg-muted'
                      }`}
                    />
                  ))}
                </div>
                <Button variant="outline" size="sm" onClick={nextTestimonial}>
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </TabsContent>

          {/* Rental Experiences Tab */}
          <TabsContent value="experiences" className="space-y-6">
            <div className="text-center space-y-4">
              <h2 className="text-3xl font-bold">Rental Experiences Gallery</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                See how our clients have used our vehicles for their adventures, business trips, and special occasions
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {clientTestimonials.map((testimonial) => (
                <Card key={testimonial.id} className="overflow-hidden hover:shadow-lg transition-shadow border border-border">
                  <div className="grid grid-cols-2 gap-1">
                    {testimonial.rentalPhotos.map((photo, index) => (
                      <div key={index} className="relative aspect-square overflow-hidden">
                        <ImageWithFallback
                          src={photo}
                          alt={`${testimonial.name}'s rental experience`}
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    ))}
                  </div>
                  
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-primary/20">
                        <ImageWithFallback
                          src={testimonial.avatar}
                          alt={testimonial.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-bold">{testimonial.name}</h3>
                          <div className="flex items-center">
                            {[...Array(testimonial.rating)].map((_, i) => (
                              <Star key={i} className="w-3 h-3 text-accent fill-accent" />
                            ))}
                          </div>
                        </div>
                        
                        <p className="text-sm text-muted-foreground mb-3">
                          {testimonial.role} • {testimonial.vehicleRented}
                        </p>
                        
                        <p className="text-sm leading-relaxed">
                          {testimonial.content}
                        </p>
                        
                        <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            <span>{testimonial.rentalDate}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            <span>{testimonial.location}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Call to Action */}
      <section className="bg-gradient-to-r from-primary to-accent text-primary-foreground py-16">
        <div className="container mx-auto px-4 text-center">
          <h3 className="text-3xl font-bold mb-4">Ready to Start Your Adventure?</h3>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of satisfied customers who have chosen Easy Rent Auto
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" className="bg-background text-foreground hover:bg-muted">
              Book Your Vehicle Now
            </Button>
            <Button size="lg" variant="outline" className="border-current text-current hover:bg-background/10">
              <Play className="w-5 h-5 mr-2" />
              Watch Customer Stories
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}