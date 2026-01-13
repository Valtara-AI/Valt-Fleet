import React from 'react';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { ChevronLeft, ChevronRight, Car, Users, Fuel, Gauge, Loader2, CheckCircle, AlertCircle, Eye, ArrowRight } from 'lucide-react';

export interface Vehicle {
  id: string;
  name: string;
  type: string;
  images: string[];
  pricePerDay: number;
  status: 'available' | 'booked' | 'maintenance' | 'limited';
  features: {
    passengers: number;
    transmission: string;
    fuelType: string;
    mileage: string;
  };
  availability?: string;
}

interface VehicleCardProps {
  vehicle: Vehicle;
  onBook: (vehicleId: string) => void;
  onViewDetails: (vehicleId: string) => void;
  compact?: boolean;
}

export function VehicleCard({ vehicle, onBook, onViewDetails, compact = false }: VehicleCardProps) {
  const [currentImageIndex, setCurrentImageIndex] = React.useState(0);
  const [bookingState, setBookingState] = React.useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [detailsState, setDetailsState] = React.useState<'idle' | 'loading' | 'success'>('idle');

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
        return 'bg-muted text-muted-foreground';
      case 'limited':
        return 'bg-orange-500 text-white';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const getStatusText = () => {
    switch (vehicle.status) {
      case 'available':
        return 'Available';
      case 'booked':
        return 'Booked';
      case 'maintenance':
        return 'In Service';
      case 'limited':
        return 'Limited Stock';
      default:
        return 'Unknown';
    }
  };

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-all duration-200 hover:-translate-y-1">
      <div className="relative">
        <div className="relative h-48 overflow-hidden">
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
                className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/20 hover:bg-black/40 text-white"
                onClick={prevImage}
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/20 hover:bg-black/40 text-white"
                onClick={nextImage}
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
                {vehicle.images.map((_, index) => (
                  <div
                    key={index}
                    className={`w-2 h-2 rounded-full ${
                      index === currentImageIndex ? 'bg-white' : 'bg-white/50'
                    }`}
                  />
                ))}
              </div>
            </>
          )}
        </div>
        
        <div className="absolute top-3 right-3">
          <Badge className={getStatusColor()}>
            {getStatusText()}
          </Badge>
        </div>
        
        <div className="absolute top-3 left-3">
          <div className="bg-primary text-primary-foreground px-3 py-1 rounded-lg font-medium text-sm">
            ${vehicle.pricePerDay}/day
          </div>
        </div>
      </div>

      <CardContent className="p-4">
        <div className="space-y-3">
          <div>
            <h3 className="font-semibold text-lg">{vehicle.name}</h3>
            <p className="text-muted-foreground text-sm">{vehicle.type}</p>
          </div>

          {!compact && (
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="flex items-center gap-1 text-muted-foreground">
                <Users className="w-4 h-4" />
                {vehicle.features.passengers} seats
              </div>
              <div className="flex items-center gap-1 text-muted-foreground">
                <Gauge className="w-4 h-4" />
                {vehicle.features.transmission}
              </div>
              <div className="flex items-center gap-1 text-muted-foreground">
                <Fuel className="w-4 h-4" />
                {vehicle.features.fuelType}
              </div>
              <div className="flex items-center gap-1 text-muted-foreground">
                <Car className="w-4 h-4" />
                {vehicle.features.mileage}
              </div>
            </div>
          )}

          {vehicle.availability && (
            <p className="text-sm text-muted-foreground">{vehicle.availability}</p>
          )}

          <div className="flex gap-2 pt-2">
            <Button
              onClick={async () => {
                if (detailsState === 'loading') return;
                
                setDetailsState('loading');
                
                // Simulate loading details
                try {
                  await new Promise(resolve => setTimeout(resolve, 1200));
                  onViewDetails(vehicle.id);
                  setDetailsState('success');
                  
                  // Reset after showing success briefly
                  setTimeout(() => {
                    setDetailsState('idle');
                  }, 1500);
                } catch (error) {
                  setDetailsState('idle');
                }
              }}
              variant="outline"
              disabled={detailsState === 'loading'}
              className={`flex-1 transition-all duration-300 hover:bg-muted/50 hover:border-primary/30 hover:shadow-sm group ${
                detailsState === 'success' 
                  ? 'border-accent bg-accent/5 text-accent hover:bg-accent/10' 
                  : ''
              }`}
            >
              {detailsState === 'loading' ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Loading...
                </>
              ) : detailsState === 'success' ? (
                <>
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Opened
                </>
              ) : (
                <>
                  <Eye className="w-4 h-4 mr-2 transition-transform group-hover:scale-110" />
                  View Details
                  <ArrowRight className="w-4 h-4 ml-2 opacity-0 -translate-x-2 transition-all group-hover:opacity-100 group-hover:translate-x-0" />
                </>
              )}
            </Button>
            <Button
              onClick={async () => {
                if (bookingState === 'loading' || bookingState === 'success') return;
                
                setBookingState('loading');
                
                // Simulate booking process
                try {
                  await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate API call
                  onBook(vehicle.id);
                  setBookingState('success');
                  
                  // Reset to idle after showing success
                  setTimeout(() => {
                    setBookingState('idle');
                  }, 3000);
                } catch (error) {
                  setBookingState('error');
                  setTimeout(() => {
                    setBookingState('idle');
                  }, 3000);
                }
              }}
              disabled={vehicle.status !== 'available' || bookingState === 'loading'}
              className={`flex-1 transition-all duration-300 ${
                bookingState === 'success' 
                  ? 'bg-accent hover:bg-accent text-accent-foreground' 
                  : bookingState === 'error'
                  ? 'bg-destructive hover:bg-destructive text-destructive-foreground'
                  : ''
              }`}
            >
              {bookingState === 'loading' ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : bookingState === 'success' ? (
                <>
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Booked!
                </>
              ) : bookingState === 'error' ? (
                <>
                  <AlertCircle className="w-4 h-4 mr-2" />
                  Try Again
                </>
              ) : (
                'Book Now'
              )}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}