import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Progress } from './ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { 
  Car,
  Calendar,
  Settings,
  BarChart3,
  MessageCircle,
  Shield,
  AlertTriangle,
  TrendingUp,
  DollarSign,
  Clock,
  Users,
  Wrench,
  Activity,
  MapPin,
  Zap,
  Target,
  CheckCircle,
  XCircle,
  AlertCircle,
  Gauge,
  PieChart
} from 'lucide-react';

interface AdminDashboardProps {
  onLogout: () => void;
  user: any;
}

export function AdminDashboard({ onLogout, user }: AdminDashboardProps) {
  const [activeTab, setActiveTab] = React.useState('overview');

  // Mock data - in real app would come from API
  const kpiData = {
    totalRevenue: 24580,
    activeBookings: 18,
    fleetUtilization: 73,
    avgDailyRevenue: 892,
    maintenanceAlerts: 3,
    aiAutomationRate: 87
  };

  const fleetData = [
    {
      id: '1',
      name: 'Honda Civic',
      license: 'ABC-123',
      status: 'active',
      location: 'Downtown',
      utilization: 85,
      revenue: 156,
      nextMaintenance: '2024-10-15',
      bookingId: 'BK-2024-001'
    },
    {
      id: '2',
      name: 'Toyota RAV4',
      license: 'DEF-456',
      status: 'maintenance',
      location: 'Service Center',
      utilization: 0,
      revenue: 0,
      nextMaintenance: '2024-09-25',
      bookingId: null
    },
    {
      id: '3',
      name: 'Ford Transit',
      license: 'GHI-789',
      status: 'active',
      location: 'Airport',
      utilization: 92,
      revenue: 245,
      nextMaintenance: '2024-11-02',
      bookingId: 'BK-2024-003'
    }
  ];

  const maintenanceAlerts = [
    {
      id: '1',
      vehicle: 'Honda Civic (ABC-123)',
      type: 'Scheduled Maintenance',
      severity: 'medium',
      dueDate: '2024-10-15',
      estimatedCost: 450,
      predictedDowntime: '4 hours'
    },
    {
      id: '2',
      vehicle: 'Toyota RAV4 (DEF-456)',
      type: 'Brake Inspection',
      severity: 'high',
      dueDate: '2024-09-25',
      estimatedCost: 650,
      predictedDowntime: '6 hours'
    },
    {
      id: '3',
      vehicle: 'Ford Transit (GHI-789)',
      type: 'Oil Change',
      severity: 'low',
      dueDate: '2024-11-02',
      estimatedCost: 120,
      predictedDowntime: '2 hours'
    }
  ];

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'text-destructive';
      case 'medium': return 'text-accent';
      case 'low': return 'text-secondary';
      default: return 'text-muted-foreground';
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'high': return <AlertCircle className="w-4 h-4" />;
      case 'medium': return <AlertTriangle className="w-4 h-4" />;
      case 'low': return <CheckCircle className="w-4 h-4" />;
      default: return <Activity className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-accent text-accent-foreground';
      case 'maintenance': return 'bg-destructive text-destructive-foreground';
      case 'available': return 'bg-secondary text-secondary-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <div className="space-y-6">
      {/* KPI Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <DollarSign className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Revenue</p>
                <p className="text-lg font-bold">${kpiData.totalRevenue.toLocaleString()}</p>
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
                <p className="text-sm text-muted-foreground">Active Bookings</p>
                <p className="text-lg font-bold">{kpiData.activeBookings}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-secondary/10 rounded-lg">
                <Gauge className="w-5 h-5 text-secondary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Fleet Utilization</p>
                <p className="text-lg font-bold">{kpiData.fleetUtilization}%</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <TrendingUp className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Avg Daily Revenue</p>
                <p className="text-lg font-bold">${kpiData.avgDailyRevenue}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-destructive/10 rounded-lg">
                <AlertTriangle className="w-5 h-5 text-destructive" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Maintenance Alerts</p>
                <p className="text-lg font-bold">{kpiData.maintenanceAlerts}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-accent/10 rounded-lg">
                <Zap className="w-5 h-5 text-accent" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">AI Automation</p>
                <p className="text-lg font-bold">{kpiData.aiAutomationRate}%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Fleet Utilization Heatmap */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="w-5 h-5" />
            Fleet Utilization Heatmap
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {fleetData.map((vehicle) => (
              <div key={vehicle.id} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Car className="w-4 h-4 text-muted-foreground" />
                    <span className="font-medium">{vehicle.name}</span>
                    <Badge className={getStatusColor(vehicle.status)}>
                      {vehicle.status}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span>{vehicle.utilization}%</span>
                    <span>${vehicle.revenue}/day</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Progress value={vehicle.utilization} className="flex-1" />
                  <span className="text-xs text-muted-foreground w-12">{vehicle.utilization}%</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Predictive Maintenance Alerts */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Wrench className="w-5 h-5" />
              Predictive Maintenance Alerts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {maintenanceAlerts.map((alert) => (
                <div key={alert.id} className="flex items-start gap-3 p-3 border border-border rounded-lg">
                  <div className={`p-1 rounded ${getSeverityColor(alert.severity)}`}>
                    {getSeverityIcon(alert.severity)}
                  </div>
                  <div className="flex-1 space-y-1">
                    <p className="font-medium text-sm">{alert.vehicle}</p>
                    <p className="text-sm text-muted-foreground">{alert.type}</p>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span>Due: {alert.dueDate}</span>
                      <span>Cost: ${alert.estimatedCost}</span>
                      <span>Downtime: {alert.predictedDowntime}</span>
                    </div>
                  </div>
                  <Button size="sm" variant="outline">
                    Schedule
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="w-5 h-5" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-2 border-l-2 border-primary">
                <CheckCircle className="w-4 h-4 text-primary" />
                <div className="flex-1">
                  <p className="text-sm font-medium">Honda Civic booked for 3 days</p>
                  <p className="text-xs text-muted-foreground">AI booking confirmed - 2 min ago</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-2 border-l-2 border-accent">
                <AlertTriangle className="w-4 h-4 text-accent" />
                <div className="flex-1">
                  <p className="text-sm font-medium">Toyota RAV4 scheduled maintenance</p>
                  <p className="text-xs text-muted-foreground">Predictive alert triggered - 15 min ago</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-2 border-l-2 border-secondary">
                <Users className="w-4 h-4 text-secondary" />
                <div className="flex-1">
                  <p className="text-sm font-medium">Customer escalation resolved</p>
                  <p className="text-xs text-muted-foreground">AI to human handoff - 1 hour ago</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-2 border-l-2 border-primary">
                <DollarSign className="w-4 h-4 text-primary" />
                <div className="flex-1">
                  <p className="text-sm font-medium">Revenue milestone reached</p>
                  <p className="text-xs text-muted-foreground">$25K monthly target achieved - 2 hours ago</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* AI Performance Metrics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="w-5 h-5" />
            AI Performance Metrics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center space-y-2">
              <div className="text-2xl font-bold text-primary">87%</div>
              <p className="text-sm text-muted-foreground">Automation Rate</p>
              <Progress value={87} className="h-2" />
            </div>
            <div className="text-center space-y-2">
              <div className="text-2xl font-bold text-accent">2.3s</div>
              <p className="text-sm text-muted-foreground">Avg Response Time</p>
              <Progress value={92} className="h-2" />
            </div>
            <div className="text-center space-y-2">
              <div className="text-2xl font-bold text-secondary">96%</div>
              <p className="text-sm text-muted-foreground">Customer Satisfaction</p>
              <Progress value={96} className="h-2" />
            </div>
            <div className="text-center space-y-2">
              <div className="text-2xl font-bold text-primary">$2,340</div>
              <p className="text-sm text-muted-foreground">Weekly Savings</p>
              <Progress value={78} className="h-2" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}