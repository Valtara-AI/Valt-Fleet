import { AlertTriangle, Bot, Calendar, CheckCircle, Clock, DollarSign, MapPin, Target, TrendingUp, Zap } from 'lucide-react';
import React from 'react';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Checkbox } from './ui/checkbox';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Progress } from './ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';

interface BookingWidgetProps {
  compact?: boolean;
  onSearch?: (params: SearchParams) => void;
  className?: string;
}

interface SearchParams {
  pickupDate: string;
  pickupTime: string;
  returnDate: string;
  returnTime: string;
  pickupLocation: string;
  dropoffLocation: string;
  vehicleType: string;
  additionalDriver?: boolean;
  insurance?: boolean;
  gps?: boolean;
}

interface SearchResults {
  vehicles: Array<{
    id: string;
    name: string;
    type: string;
    basePrice: number;
    dynamicPrice: number;
    aiScore: number;
    availability: string;
    conflicts: string[];
    maintenanceStatus: 'available' | 'service_due' | 'maintenance';
    utilization: number;
    predictedDemand: number;
  }>;
  aiRecommendations: {
    cheapest: string;
    mostEfficient: string;
    bestValue: string;
    conflictFree: string;
  };
  pricingFactors: {
    demandMultiplier: number;
    locationSurcharge: number;
    timePremium: number;
  };
  conflictsDetected: number;
  autoResolved: number;
}

export function BookingWidget({ compact = false, onSearch, className }: BookingWidgetProps) {
  const [searchParams, setSearchParams] = React.useState<SearchParams>({
    pickupDate: '',
    pickupTime: '09:00',
    returnDate: '',
    returnTime: '17:00',
    pickupLocation: 'downtown-saskatoon',
    dropoffLocation: 'downtown-saskatoon',
    vehicleType: 'any',
    additionalDriver: false,
    insurance: false,
    gps: false
  });
  const [isSearching, setIsSearching] = React.useState(false);
  const [searchResults, setSearchResults] = React.useState<SearchResults | null>(null);
  const [aiProcessing, setAiProcessing] = React.useState(false);

  const handleSearch = async () => {
    if (!searchParams.pickupDate || !searchParams.returnDate) {
      alert('Please select pickup and return dates');
      return;
    }

    setIsSearching(true);
    setAiProcessing(true);

    // Simulate AI-powered search with real-time availability and conflict detection
    setTimeout(() => {
      const results = performAISearch(searchParams);
      setSearchResults(results);
      setAiProcessing(false);
      onSearch?.(searchParams);
      
      // Show AI processing results
      console.log('AI Search Results:', results);
    }, 2000);

    setTimeout(() => {
      setIsSearching(false);
    }, 3000);
  };

  const performAISearch = (params: SearchParams): SearchResults => {
    // Mock AI-powered search algorithm
    const baseVehicles = [
      { id: '1', name: 'Honda Civic', type: 'Compact Sedan', basePrice: 18, utilization: 72 },
      { id: '2', name: 'Toyota RAV4', type: 'Compact SUV', basePrice: 28, utilization: 84 },
      { id: '3', name: 'Ford Transit', type: 'Van', basePrice: 45, utilization: 56 },
      { id: '4', name: 'Nissan Sentra', type: 'Compact Sedan', basePrice: 16, utilization: 68 }
    ];

    // AI dynamic pricing calculation
    const demandMultiplier = Math.random() * 0.4 + 0.8; // 0.8 to 1.2
    const pickupSurcharge = params.pickupLocation === 'airport' ? 25 : params.pickupLocation === 'delivery' ? 35 : 0;
    const dropoffSurcharge = params.dropoffLocation === 'airport' ? 15 : params.dropoffLocation === 'delivery' ? 25 : 0;
    const differentLocationFee = params.pickupLocation !== params.dropoffLocation ? 20 : 0;
    const locationSurcharge = pickupSurcharge + dropoffSurcharge + differentLocationFee;
    const timePremium = params.pickupTime > '17:00' || params.pickupTime < '08:00' ? 1.15 : 1.0;

    const vehicles = baseVehicles
      .filter(v => params.vehicleType === 'any' || v.type.toLowerCase().includes(params.vehicleType))
      .map(vehicle => {
        const dynamicPrice = Math.round(vehicle.basePrice * demandMultiplier * timePremium);
        const conflicts = Math.random() < 0.3 ? [`Overlaps with existing booking`] : [];
        const maintenanceStatus = Math.random() < 0.1 ? 'service_due' : 'available';
        
        // AI scoring algorithm (factors: price, availability, utilization, maintenance)
        const aiScore = Math.round(
          (100 - dynamicPrice) * 0.3 + // Lower price = higher score
          (conflicts.length === 0 ? 30 : 10) + // No conflicts = bonus
          (100 - vehicle.utilization) * 0.2 + // Lower utilization = more available
          (maintenanceStatus === 'available' ? 20 : 5) // Good maintenance = bonus
        );

        return {
          ...vehicle,
          dynamicPrice,
          aiScore,
          availability: conflicts.length === 0 ? 'Available now' : 'Conflict detected - AI resolving',
          conflicts,
          maintenanceStatus: maintenanceStatus as 'available' | 'service_due' | 'maintenance',
          predictedDemand: Math.round(Math.random() * 100)
        };
      })
      .sort((a, b) => b.aiScore - a.aiScore); // Sort by AI score

    // AI recommendations
    const cheapest = vehicles.reduce((prev, curr) => prev.dynamicPrice < curr.dynamicPrice ? prev : curr).id;
    const mostEfficient = vehicles.reduce((prev, curr) => prev.utilization < curr.utilization ? prev : curr).id;
    const bestValue = vehicles.reduce((prev, curr) => prev.aiScore > curr.aiScore ? prev : curr).id;
    const conflictFree = vehicles.find(v => v.conflicts.length === 0)?.id || vehicles[0].id;

    return {
      vehicles,
      aiRecommendations: {
        cheapest,
        mostEfficient,
        bestValue,
        conflictFree
      },
      pricingFactors: {
        demandMultiplier,
        locationSurcharge,
        timePremium
      },
      conflictsDetected: vehicles.filter(v => v.conflicts.length > 0).length,
      autoResolved: Math.floor(Math.random() * 3)
    };
  };

  const updateParam = (key: keyof SearchParams, value: string | boolean) => {
    setSearchParams(prev => ({ ...prev, [key]: value }));
  };

  if (compact) {
    return (
      <Card className={`w-full max-w-5xl mx-auto ${className}`}>
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-6 gap-3 items-end">
            <div className="space-y-2">
              <Label htmlFor="pickup-date">Pickup Date</Label>
              <div className="relative">
                <Input
                  id="pickup-date"
                  type="date"
                  value={searchParams.pickupDate}
                  onChange={(e) => updateParam('pickupDate', e.target.value)}
                />
                <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="return-date">Return Date</Label>
              <div className="relative">
                <Input
                  id="return-date"
                  type="date"
                  value={searchParams.returnDate}
                  onChange={(e) => updateParam('returnDate', e.target.value)}
                />
                <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="pickup-location">Pickup Location</Label>
              <Select value={searchParams.pickupLocation} onValueChange={(value: string) => updateParam('pickupLocation', value)}>
                <SelectTrigger>
                  <MapPin className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="Select location" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="downtown-saskatoon">Downtown Saskatoon</SelectItem>
                  <SelectItem value="airport">YXE Airport</SelectItem>
                  <SelectItem value="university">University Area</SelectItem>
                  <SelectItem value="north-industrial">North Industrial</SelectItem>
                  <SelectItem value="delivery">Delivery to Location</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="dropoff-location">Drop-off Location</Label>
              <Select value={searchParams.dropoffLocation} onValueChange={(value: string) => updateParam('dropoffLocation', value)}>
                <SelectTrigger>
                  <MapPin className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="Select location" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="downtown-saskatoon">Downtown Saskatoon</SelectItem>
                  <SelectItem value="airport">YXE Airport</SelectItem>
                  <SelectItem value="university">University Area</SelectItem>
                  <SelectItem value="north-industrial">North Industrial</SelectItem>
                  <SelectItem value="delivery">Pick-up from Location</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="vehicle-type">Vehicle Type</Label>
              <Select value={searchParams.vehicleType} onValueChange={(value: string) => updateParam('vehicleType', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Any vehicle" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="any">Any Vehicle</SelectItem>
                  <SelectItem value="compact">Compact</SelectItem>
                  <SelectItem value="sedan">Sedan</SelectItem>
                  <SelectItem value="suv">SUV</SelectItem>
                  <SelectItem value="van">Van</SelectItem>
                  <SelectItem value="truck">Pickup Truck</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button 
              onClick={handleSearch} 
              className="h-10" 
              disabled={isSearching}
            >
              {isSearching ? (
                <div className="flex items-center gap-2">
                  <Bot className="w-4 h-4 animate-spin" />
                  AI Searching...
                </div>
              ) : (
                'Search Vehicles'
              )}
            </Button>
          </div>

          {/* AI Processing Indicator */}
          {aiProcessing && (
            <div className="mt-4 p-3 bg-accent/10 border border-accent/20 rounded-lg">
              <div className="flex items-center gap-2">
                <Bot className="w-4 h-4 text-accent animate-pulse" />
                <span className="text-sm">AI analyzing availability, pricing, and conflicts...</span>
              </div>
              <Progress value={75} className="mt-2" />
            </div>
          )}

          {/* Search Results Summary */}
          {searchResults && !aiProcessing && (
            <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="p-3 bg-primary/10 rounded-lg text-center">
                <div className="text-lg font-bold text-primary">{searchResults.vehicles.length}</div>
                <div className="text-xs text-muted-foreground">AI-Matched Vehicles</div>
              </div>
              <div className="p-3 bg-accent/10 rounded-lg text-center">
                <div className="text-lg font-bold text-accent">{searchResults.autoResolved}</div>
                <div className="text-xs text-muted-foreground">Conflicts Auto-Resolved</div>
              </div>
              <div className="p-3 bg-green-100 rounded-lg text-center">
                <div className="text-lg font-bold text-green-600">${Math.round(searchResults.pricingFactors.demandMultiplier * 100)}%</div>
                <div className="text-xs text-muted-foreground">Dynamic Pricing</div>
              </div>
              <div className="p-3 bg-orange-100 rounded-lg text-center">
                <div className="text-lg font-bold text-orange-600">{searchResults.conflictsDetected}</div>
                <div className="text-xs text-muted-foreground">Conflicts Detected</div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={`w-full max-w-2xl mx-auto ${className}`}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bot className="w-5 h-5 text-primary" />
          AI-Powered Vehicle Search
        </CardTitle>
        <p className="text-muted-foreground">Smart recommendations • Dynamic pricing • Conflict-free booking</p>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="pickup-date-full">Pickup Date</Label>
            <div className="relative">
              <Input
                id="pickup-date-full"
                type="date"
                value={searchParams.pickupDate}
                onChange={(e) => updateParam('pickupDate', e.target.value)}
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
                value={searchParams.pickupTime}
                onChange={(e) => updateParam('pickupTime', e.target.value)}
              />
              <Clock className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="return-date-full">Return Date</Label>
            <div className="relative">
              <Input
                id="return-date-full"
                type="date"
                value={searchParams.returnDate}
                onChange={(e) => updateParam('returnDate', e.target.value)}
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
                value={searchParams.returnTime}
                onChange={(e) => updateParam('returnTime', e.target.value)}
              />
              <Clock className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="pickup-location-full">Pickup Location</Label>
            <Select value={searchParams.pickupLocation} onValueChange={(value: string) => updateParam('pickupLocation', value)}>
              <SelectTrigger>
                <MapPin className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Select pickup location" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="downtown-saskatoon">Downtown Saskatoon</SelectItem>
                <SelectItem value="airport">YXE Airport (+$25 pickup fee)</SelectItem>
                <SelectItem value="university">University Area</SelectItem>
                <SelectItem value="north-industrial">North Industrial</SelectItem>
                <SelectItem value="delivery">Delivery to Your Location (+$35)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="dropoff-location-full">Drop-off Location</Label>
            <Select value={searchParams.dropoffLocation} onValueChange={(value: string) => updateParam('dropoffLocation', value)}>
              <SelectTrigger>
                <MapPin className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Select drop-off location" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="downtown-saskatoon">Downtown Saskatoon</SelectItem>
                <SelectItem value="airport">YXE Airport (+$15 drop-off fee)</SelectItem>
                <SelectItem value="university">University Area</SelectItem>
                <SelectItem value="north-industrial">North Industrial</SelectItem>
                <SelectItem value="delivery">Pick-up from Your Location (+$25)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Different Location Fee Notice */}
        {searchParams.pickupLocation !== searchParams.dropoffLocation && (
          <div className="p-3 bg-accent/10 border border-accent/20 rounded-lg">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-accent" />
              <span className="text-sm font-medium">Different Location Fee:</span>
              <Badge variant="outline" className="border-accent/30 text-accent">
                +$20 one-way charge
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Additional fee applies when pickup and drop-off locations are different
            </p>
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="vehicle-type-full">Preferred Vehicle Type</Label>
          <Select value={searchParams.vehicleType} onValueChange={(value: string) => updateParam('vehicleType', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Any vehicle type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="any">Any Vehicle</SelectItem>
              <SelectItem value="compact">Compact Car ($15-18/day)</SelectItem>
              <SelectItem value="sedan">Mid-size Sedan ($20-25/day)</SelectItem>
              <SelectItem value="suv">SUV ($25-35/day)</SelectItem>
              <SelectItem value="van">Van ($40-50/day)</SelectItem>
              <SelectItem value="truck">Pickup Truck ($35-45/day)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-3">
          <h4 className="font-medium">Add-ons</h4>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Checkbox 
                  id="additional-driver"
                  checked={searchParams.additionalDriver}
                  onCheckedChange={(checked: boolean | 'indeterminate') => updateParam('additionalDriver', Boolean(checked))}
                />
              <Label htmlFor="additional-driver" className="font-normal">
                Additional Driver (+$5/day)
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox 
                  id="insurance"
                  checked={searchParams.insurance}
                  onCheckedChange={(checked: boolean | 'indeterminate') => updateParam('insurance', Boolean(checked))}
                />
              <Label htmlFor="insurance" className="font-normal">
                Basic Insurance Coverage (+$8/day)
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox 
                  id="gps"
                  checked={searchParams.gps}
                  onCheckedChange={(checked: boolean | 'indeterminate') => updateParam('gps', Boolean(checked))}
                />
              <Label htmlFor="gps" className="font-normal">
                GPS Navigation (+$3/day)
              </Label>
            </div>
          </div>
        </div>

        {/* AI Processing Indicator */}
        {aiProcessing && (
          <div className="p-4 bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/20 rounded-lg">
            <div className="flex items-center gap-3 mb-3">
              <Bot className="w-5 h-5 text-primary animate-pulse" />
              <span className="font-medium">AI Fleet Management Processing</span>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <Zap className="w-3 h-3 text-accent" />
                <span>Analyzing real-time availability across 45 vehicles...</span>
              </div>
              <div className="flex items-center gap-2">
                <Target className="w-3 h-3 text-primary" />
                <span>Calculating dynamic pricing and demand factors...</span>
              </div>
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-3 h-3 text-orange-500" />
                <span>Detecting and resolving potential booking conflicts...</span>
              </div>
            </div>
            <Progress value={65} className="mt-3" />
          </div>
        )}

        {/* AI Search Results */}
        {searchResults && !aiProcessing && (
          <div className="space-y-4">
            <div className="p-4 bg-accent/10 border border-accent/20 rounded-lg">
              <div className="flex items-center gap-2 mb-3">
                <CheckCircle className="w-5 h-5 text-accent" />
                <span className="font-medium">AI Search Complete</span>
              </div>
              
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="text-center p-2 bg-white rounded border">
                  <div className="text-xl font-bold text-primary">{searchResults.vehicles.length}</div>
                  <div className="text-xs text-muted-foreground">Vehicles Found</div>
                </div>
                <div className="text-center p-2 bg-white rounded border">
                  <div className="text-xl font-bold text-accent">{searchResults.autoResolved}</div>
                  <div className="text-xs text-muted-foreground">Auto-Resolved</div>
                </div>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <span>AI Recommendation:</span>
                  <Badge variant="secondary">Best Value Vehicle Selected</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span>Dynamic Pricing:</span>
                  <span className="font-medium">{Math.round((searchResults.pricingFactors.demandMultiplier - 1) * 100)}% demand adjustment</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Conflicts:</span>
                  <span className="font-medium">{searchResults.conflictsDetected} detected, {searchResults.autoResolved} resolved</span>
                </div>
              </div>
            </div>
          </div>
        )}

        <Button 
          onClick={handleSearch} 
          className="w-full" 
          size="lg"
          disabled={isSearching}
        >
          {isSearching ? (
            <div className="flex items-center gap-2">
              <Bot className="w-5 h-5 animate-spin" />
              AI Processing Search...
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Bot className="w-5 h-5" />
              AI-Powered Vehicle Search
            </div>
          )}
        </Button>

        <div className="text-center text-sm text-muted-foreground">
          <div className="flex items-center justify-center gap-4 text-xs">
            <span className="flex items-center gap-1">
              <DollarSign className="w-3 h-3" />
              Dynamic Pricing
            </span>
            <span className="flex items-center gap-1">
              <TrendingUp className="w-3 h-3" />
              87% Automation
            </span>
            <span className="flex items-center gap-1">
              <Bot className="w-3 h-3" />
              Multi-Channel
            </span>
          </div>
          <div className="mt-1">
            Need help? AI support available 24/7 at (639) 471-4669
          </div>
        </div>
      </CardContent>
    </Card>
  );
}