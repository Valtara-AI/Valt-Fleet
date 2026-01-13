import { AlertTriangle, Bot, CheckCircle, DollarSign, Filter, Target, TrendingUp, Wrench } from 'lucide-react';
import React from 'react';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Progress } from './ui/progress';
import { Vehicle } from './vehicle-card';

interface SearchResult extends Vehicle {
  aiScore: number;
  dynamicPrice: number;
  basePrice: number;
  conflicts: string[];
  maintenanceStatus: 'available' | 'service_due' | 'maintenance';
  utilization: number;
  predictedDemand: number;
  savings?: number;
  recommendation?: 'cheapest' | 'best_value' | 'most_efficient' | 'conflict_free';
}

interface SearchResultsProps {
  results: SearchResult[];
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
  onVehicleSelect?: (vehicleId: string) => void;
  onVehicleBook?: (vehicleId: string) => void;
}

export function SearchResults({ 
  results, 
  aiRecommendations, 
  pricingFactors, 
  conflictsDetected, 
  autoResolved,
  onVehicleSelect,
  onVehicleBook
}: SearchResultsProps) {
  const [sortBy, setSortBy] = React.useState<'ai_score' | 'price' | 'availability'>('ai_score');
  const [showAIInsights, setShowAIInsights] = React.useState(true);

  const sortedResults = React.useMemo(() => {
    const sorted = [...results];
    switch (sortBy) {
      case 'price':
        return sorted.sort((a, b) => a.dynamicPrice - b.dynamicPrice);
      case 'availability':
        return sorted.sort((a, b) => a.conflicts.length - b.conflicts.length);
      default:
        return sorted.sort((a, b) => b.aiScore - a.aiScore);
    }
  }, [results, sortBy]);

  const getRecommendationBadge = (vehicleId: string) => {
    if (vehicleId === aiRecommendations.bestValue) {
      return <Badge className="bg-primary text-primary-foreground">🏆 AI Best Value</Badge>;
    }
    if (vehicleId === aiRecommendations.cheapest) {
      return <Badge variant="secondary">💰 Cheapest</Badge>;
    }
    if (vehicleId === aiRecommendations.mostEfficient) {
      return <Badge variant="outline" className="border-accent text-accent">⚡ Most Efficient</Badge>;
    }
    if (vehicleId === aiRecommendations.conflictFree) {
      return <Badge variant="outline" className="border-green-500 text-green-600">✅ Conflict-Free</Badge>;
    }
    return null;
  };

  const getMaintenanceIcon = (status: string) => {
    switch (status) {
      case 'service_due':
        return <AlertTriangle className="w-4 h-4 text-orange-500" />;
      case 'maintenance':
        return <Wrench className="w-4 h-4 text-red-500" />;
      default:
        return <CheckCircle className="w-4 h-4 text-green-500" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* AI Insights Panel */}
      {showAIInsights && (
        <Card className="border-l-4 border-l-accent">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Bot className="w-5 h-5 text-accent" />
                AI Fleet Management Insights
              </CardTitle>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setShowAIInsights(false)}
              >
                ×
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div className="text-center p-3 bg-primary/10 rounded-lg">
                <div className="text-2xl font-bold text-primary">{results.length}</div>
                <div className="text-sm text-muted-foreground">Vehicles Analyzed</div>
              </div>
              <div className="text-center p-3 bg-accent/10 rounded-lg">
                <div className="text-2xl font-bold text-accent">{autoResolved}</div>
                <div className="text-sm text-muted-foreground">Conflicts Auto-Resolved</div>
              </div>
              <div className="text-center p-3 bg-green-100 rounded-lg">
                <div className="text-2xl font-bold text-green-600">${Math.round((pricingFactors.demandMultiplier - 1) * 100)}</div>
                <div className="text-sm text-muted-foreground">Avg. Dynamic Savings</div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-muted/50 rounded">
                <div className="flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-green-600" />
                  <span className="text-sm">Dynamic Pricing Applied</span>
                </div>
                <span className="text-sm font-medium">
                  {Math.round((pricingFactors.demandMultiplier - 1) * 100)}% demand adjustment
                </span>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-muted/50 rounded">
                <div className="flex items-center gap-2">
                  <Target className="w-4 h-4 text-accent" />
                  <span className="text-sm">Conflict Resolution</span>
                </div>
                <span className="text-sm font-medium">
                  {conflictsDetected} detected, {autoResolved} resolved automatically
                </span>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-muted/50 rounded">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-primary" />
                  <span className="text-sm">Fleet Optimization</span>
                </div>
                <span className="text-sm font-medium">87% automation rate active</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Sorting and Filters */}
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold">Available Vehicles ({results.length})</h3>
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-muted-foreground" />
          <select 
            aria-label="Sort results"
            title="Sort results"
            value={sortBy} 
            onChange={(e) => setSortBy(e.target.value as any)}
            className="px-3 py-1 border border-input rounded-md bg-background text-sm"
          >
            <option value="ai_score">AI Recommendation</option>
            <option value="price">Price: Low to High</option>
            <option value="availability">Availability</option>
          </select>
        </div>
      </div>

      {/* Vehicle Results */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sortedResults.map((vehicle) => (
          <Card key={vehicle.id} className="relative overflow-hidden">
            {/* AI Recommendation Badge */}
            <div className="absolute top-3 right-3 z-10">
              {getRecommendationBadge(vehicle.id)}
            </div>

            <div className="relative">
              <img 
                src={vehicle.images[0]} 
                alt={vehicle.name} 
                className="w-full h-48 object-cover"
              />
              <div className="absolute top-3 left-3">
                <Badge 
                  variant={vehicle.conflicts.length === 0 ? "default" : "destructive"}
                  className="text-xs"
                >
                  {vehicle.conflicts.length === 0 ? 'Available Now' : 'Conflict Detected'}
                </Badge>
              </div>
            </div>

            <CardContent className="p-4">
              <div className="space-y-3">
                <div>
                  <h4 className="font-semibold">{vehicle.name}</h4>
                  <p className="text-sm text-muted-foreground">{vehicle.type}</p>
                </div>

                {/* AI Score */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-1">
                      <Bot className="w-3 h-3" />
                      AI Score
                    </span>
                    <span className="font-medium">{vehicle.aiScore}/100</span>
                  </div>
                  <Progress value={vehicle.aiScore} className="h-2" />
                </div>

                {/* Pricing */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Base Price</span>
                    <span className="text-sm line-through">${vehicle.basePrice}/day</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-medium">AI Optimized Price</span>
                    <span className="text-lg font-bold text-primary">${vehicle.dynamicPrice}/day</span>
                  </div>
                  {vehicle.dynamicPrice < vehicle.basePrice && (
                    <div className="text-xs text-green-600">
                      Save ${vehicle.basePrice - vehicle.dynamicPrice}/day with AI pricing
                    </div>
                  )}
                </div>

                {/* Vehicle Features */}
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="flex items-center gap-1">
                    <span>👥</span>
                    <span>{vehicle.features.passengers} passengers</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span>⛽</span>
                    <span>{vehicle.features.mileage}</span>
                  </div>
                </div>

                {/* Maintenance Status */}
                <div className="flex items-center justify-between p-2 bg-muted/50 rounded text-sm">
                  <div className="flex items-center gap-2">
                    {getMaintenanceIcon(vehicle.maintenanceStatus)}
                    <span>Maintenance</span>
                  </div>
                  <span className="capitalize">{vehicle.maintenanceStatus.replace('_', ' ')}</span>
                </div>

                {/* Utilization */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-sm">
                    <span>Fleet Utilization</span>
                    <span>{vehicle.utilization}%</span>
                  </div>
                  <Progress value={vehicle.utilization} className="h-1" />
                </div>

                {/* Conflicts */}
                {vehicle.conflicts.length > 0 && (
                  <div className="p-2 bg-orange-50 border border-orange-200 rounded text-sm">
                    <div className="flex items-center gap-1 text-orange-600 mb-1">
                      <AlertTriangle className="w-3 h-3" />
                      <span className="font-medium">Scheduling Conflict</span>
                    </div>
                    <p className="text-orange-700">{vehicle.conflicts[0]}</p>
                    <p className="text-xs text-orange-600 mt-1">AI is resolving automatically...</p>
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex-1"
                    onClick={() => onVehicleSelect?.(vehicle.id)}
                  >
                    View Details
                  </Button>
                  <Button 
                    size="sm" 
                    className="flex-1"
                    onClick={() => onVehicleBook?.(vehicle.id)}
                    disabled={vehicle.conflicts.length > 0}
                  >
                    {vehicle.conflicts.length > 0 ? 'Resolving...' : 'Book Now'}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* No Results */}
      {results.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <Bot className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Vehicles Match Your Criteria</h3>
            <p className="text-muted-foreground mb-4">
              Our AI couldn't find any vehicles matching your search parameters. 
              Try adjusting your dates or vehicle type.
            </p>
            <Button variant="outline">
              Modify Search Criteria
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}