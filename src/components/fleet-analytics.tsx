import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Progress } from './ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { 
  BarChart3,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Car,
  Activity,
  Users,
  Calendar,
  MapPin,
  Zap,
  Target,
  PieChart,
  LineChart,
  Settings,
  Download,
  Filter
} from 'lucide-react';

interface AnalyticsData {
  period: string;
  revenue: number;
  bookings: number;
  utilization: number;
  maintenance: number;
}

interface VehiclePerformance {
  id: string;
  name: string;
  license: string;
  revenue: number;
  bookings: number;
  utilization: number;
  efficiency: number;
  maintenanceCost: number;
  profitMargin: number;
}

export function FleetAnalytics() {
  const [timeRange, setTimeRange] = React.useState('30d');
  const [selectedMetric, setSelectedMetric] = React.useState('revenue');
  const [comparisonPeriod, setComparisonPeriod] = React.useState('previous');

  // Mock data - in real app would come from API
  const analyticsData: AnalyticsData[] = [
    { period: 'Week 1', revenue: 3200, bookings: 45, utilization: 68, maintenance: 450 },
    { period: 'Week 2', revenue: 3850, bookings: 52, utilization: 72, maintenance: 320 },
    { period: 'Week 3', revenue: 4100, bookings: 58, utilization: 78, maintenance: 280 },
    { period: 'Week 4', revenue: 3950, bookings: 55, utilization: 75, maintenance: 390 }
  ];

  const vehiclePerformance: VehiclePerformance[] = [
    {
      id: '1',
      name: 'Honda Civic',
      license: 'ABC-123',
      revenue: 3240,
      bookings: 28,
      utilization: 78,
      efficiency: 85,
      maintenanceCost: 340,
      profitMargin: 89
    },
    {
      id: '2',
      name: 'Toyota RAV4',
      license: 'DEF-456',
      revenue: 5180,
      bookings: 32,
      utilization: 82,
      efficiency: 91,
      maintenanceCost: 520,
      profitMargin: 90
    },
    {
      id: '3',
      name: 'Ford Transit',
      license: 'GHI-789',
      revenue: 7650,
      bookings: 24,
      utilization: 92,
      efficiency: 88,
      maintenanceCost: 680,
      profitMargin: 91
    }
  ];

  const kpiMetrics = {
    totalRevenue: 16070,
    totalBookings: 84,
    avgDailyRate: 48,
    fleetUtilization: 84,
    customerSatisfaction: 4.7,
    aiAutomationRate: 87,
    maintenanceEfficiency: 92,
    fuelEfficiency: 28.5
  };

  const trends = {
    revenue: { value: 15.2, direction: 'up' },
    bookings: { value: 8.7, direction: 'up' },
    utilization: { value: 12.3, direction: 'up' },
    maintenance: { value: -18.5, direction: 'down' },
    satisfaction: { value: 5.1, direction: 'up' },
    efficiency: { value: 22.8, direction: 'up' }
  };

  const locationData = [
    { location: 'Downtown Saskatoon', bookings: 45, revenue: 6750, utilization: 89 },
    { location: 'YXE Airport', bookings: 28, revenue: 5200, utilization: 76 },
    { location: 'University Area', bookings: 22, revenue: 3300, utilization: 68 },
    { location: 'North Industrial', bookings: 15, revenue: 2250, utilization: 55 }
  ];

  const channelData = [
    { channel: 'Web Portal', bookings: 38, percentage: 45.2, revenue: 7260 },
    { channel: 'AI WhatsApp', bookings: 22, percentage: 26.2, revenue: 4180 },
    { channel: 'Phone (AI)', bookings: 15, percentage: 17.9, revenue: 2850 },
    { channel: 'SMS Booking', bookings: 9, percentage: 10.7, revenue: 1710 }
  ];

  const getTrendIcon = (direction: string) => {
    return direction === 'up' ? (
      <TrendingUp className="w-4 h-4 text-green-600" />
    ) : (
      <TrendingDown className="w-4 h-4 text-red-600" />
    );
  };

  const getTrendColor = (direction: string) => {
    return direction === 'up' ? 'text-green-600' : 'text-red-600';
  };

  const getEfficiencyColor = (efficiency: number) => {
    if (efficiency >= 90) return 'text-green-600';
    if (efficiency >= 75) return 'text-accent';
    if (efficiency >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Fleet Analytics</h2>
        <div className="flex items-center gap-4">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
              <SelectItem value="1y">Last year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* KPI Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-8 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <DollarSign className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Revenue</p>
                <p className="text-lg font-bold">${kpiMetrics.totalRevenue.toLocaleString()}</p>
                <div className="flex items-center gap-1">
                  {getTrendIcon(trends.revenue.direction)}
                  <span className={`text-xs ${getTrendColor(trends.revenue.direction)}`}>
                    {trends.revenue.value}%
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-accent/10 rounded-lg">
                <Calendar className="w-5 h-5 text-accent" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Bookings</p>
                <p className="text-lg font-bold">{kpiMetrics.totalBookings}</p>
                <div className="flex items-center gap-1">
                  {getTrendIcon(trends.bookings.direction)}
                  <span className={`text-xs ${getTrendColor(trends.bookings.direction)}`}>
                    {trends.bookings.value}%
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-secondary/10 rounded-lg">
                <Activity className="w-5 h-5 text-secondary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Utilization</p>
                <p className="text-lg font-bold">{kpiMetrics.fleetUtilization}%</p>
                <div className="flex items-center gap-1">
                  {getTrendIcon(trends.utilization.direction)}
                  <span className={`text-xs ${getTrendColor(trends.utilization.direction)}`}>
                    {trends.utilization.value}%
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <DollarSign className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Daily Rate</p>
                <p className="text-lg font-bold">${kpiMetrics.avgDailyRate}</p>
                <div className="flex items-center gap-1">
                  {getTrendIcon(trends.revenue.direction)}
                  <span className={`text-xs ${getTrendColor(trends.revenue.direction)}`}>
                    {trends.revenue.value}%
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-accent/10 rounded-lg">
                <Users className="w-5 h-5 text-accent" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Satisfaction</p>
                <p className="text-lg font-bold">{kpiMetrics.customerSatisfaction}/5</p>
                <div className="flex items-center gap-1">
                  {getTrendIcon(trends.satisfaction.direction)}
                  <span className={`text-xs ${getTrendColor(trends.satisfaction.direction)}`}>
                    {trends.satisfaction.value}%
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-secondary/10 rounded-lg">
                <Zap className="w-5 h-5 text-secondary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">AI Rate</p>
                <p className="text-lg font-bold">{kpiMetrics.aiAutomationRate}%</p>
                <div className="flex items-center gap-1">
                  {getTrendIcon(trends.efficiency.direction)}
                  <span className={`text-xs ${getTrendColor(trends.efficiency.direction)}`}>
                    {trends.efficiency.value}%
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Settings className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Maintenance</p>
                <p className="text-lg font-bold">{kpiMetrics.maintenanceEfficiency}%</p>
                <div className="flex items-center gap-1">
                  {getTrendIcon(trends.maintenance.direction)}
                  <span className={`text-xs ${getTrendColor(trends.maintenance.direction)}`}>
                    {Math.abs(trends.maintenance.value)}%
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-accent/10 rounded-lg">
                <Target className="w-5 h-5 text-accent" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Fuel Eff.</p>
                <p className="text-lg font-bold">{kpiMetrics.fuelEfficiency} MPG</p>
                <div className="flex items-center gap-1">
                  {getTrendIcon(trends.efficiency.direction)}
                  <span className={`text-xs ${getTrendColor(trends.efficiency.direction)}`}>
                    {trends.efficiency.value}%
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="performance" className="w-full">
        <TabsList>
          <TabsTrigger value="performance">Vehicle Performance</TabsTrigger>
          <TabsTrigger value="locations">Locations</TabsTrigger>
          <TabsTrigger value="channels">Booking Channels</TabsTrigger>
          <TabsTrigger value="predictive">Predictive Insights</TabsTrigger>
        </TabsList>

        <TabsContent value="performance" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Car className="w-5 h-5" />
                Vehicle Performance Analysis
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {vehiclePerformance.map((vehicle) => (
                  <div key={vehicle.id} className="border border-border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h4 className="font-bold text-lg">{vehicle.name}</h4>
                        <p className="text-sm text-muted-foreground">{vehicle.license}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold">${vehicle.revenue.toLocaleString()}</p>
                        <p className="text-sm text-muted-foreground">Revenue</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
                      <div className="text-center">
                        <p className="text-sm text-muted-foreground">Bookings</p>
                        <p className="text-lg font-medium">{vehicle.bookings}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-sm text-muted-foreground">Utilization</p>
                        <p className="text-lg font-medium">{vehicle.utilization}%</p>
                        <Progress value={vehicle.utilization} className="h-1 mt-1" />
                      </div>
                      <div className="text-center">
                        <p className="text-sm text-muted-foreground">Efficiency</p>
                        <p className={`text-lg font-medium ${getEfficiencyColor(vehicle.efficiency)}`}>
                          {vehicle.efficiency}%
                        </p>
                      </div>
                      <div className="text-center">
                        <p className="text-sm text-muted-foreground">Maintenance</p>
                        <p className="text-lg font-medium">${vehicle.maintenanceCost}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-sm text-muted-foreground">Profit Margin</p>
                        <p className={`text-lg font-medium ${getEfficiencyColor(vehicle.profitMargin)}`}>
                          {vehicle.profitMargin}%
                        </p>
                      </div>
                      <div className="text-center">
                        <p className="text-sm text-muted-foreground">Actions</p>
                        <Button size="sm" variant="outline">
                          <BarChart3 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="locations" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                Location Performance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {locationData.map((location, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border border-border rounded-lg">
                    <div className="flex items-center gap-4">
                      <MapPin className="w-5 h-5 text-muted-foreground" />
                      <div>
                        <h4 className="font-medium">{location.location}</h4>
                        <p className="text-sm text-muted-foreground">{location.bookings} bookings</p>
                      </div>
                    </div>
                    <div className="text-right space-y-1">
                      <p className="font-bold">${location.revenue.toLocaleString()}</p>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">{location.utilization}%</span>
                        <Progress value={location.utilization} className="w-16 h-2" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="channels" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="w-5 h-5" />
                Booking Channel Analysis
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {channelData.map((channel, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-4 h-4 bg-primary rounded-full"></div>
                        <span className="font-medium">{channel.channel}</span>
                      </div>
                      <div className="text-right">
                        <span className="font-bold">{channel.bookings} bookings</span>
                        <span className="text-sm text-muted-foreground ml-2">
                          ({channel.percentage}%)
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <Progress value={channel.percentage} className="flex-1 mr-4" />
                      <span className="text-sm font-medium">${channel.revenue.toLocaleString()}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="predictive" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  Revenue Predictions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 bg-primary/10 rounded-lg">
                    <p className="text-sm text-muted-foreground">Next 30 Days</p>
                    <p className="text-2xl font-bold">$18,450</p>
                    <p className="text-sm text-green-600 flex items-center gap-1">
                      <TrendingUp className="w-3 h-3" />
                      +14.8% vs previous period
                    </p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm font-medium">Key Factors:</p>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Increased demand in University Area (+25%)</li>
                      <li>• AI booking automation improvements</li>
                      <li>• Seasonal demand increase</li>
                      <li>• New vehicle additions</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="w-5 h-5" />
                  Maintenance Predictions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 bg-accent/10 rounded-lg">
                    <p className="text-sm text-muted-foreground">Upcoming Costs</p>
                    <p className="text-2xl font-bold">$2,850</p>
                    <p className="text-sm text-green-600 flex items-center gap-1">
                      <TrendingDown className="w-3 h-3" />
                      -22% through predictive maintenance
                    </p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm font-medium">Optimization Opportunities:</p>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Honda Civic: Oil change due in 2 weeks</li>
                      <li>• Ford Transit: Brake inspection recommended</li>
                      <li>• Toyota RAV4: Battery replacement in 45 days</li>
                      <li>• Fleet-wide: Tire rotation scheduled</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}