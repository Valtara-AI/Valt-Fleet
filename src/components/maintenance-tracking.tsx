import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Progress } from './ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { 
  Wrench,
  AlertTriangle,
  CheckCircle,
  Clock,
  DollarSign,
  Calendar,
  Car,
  Activity,
  TrendingUp,
  TrendingDown,
  Plus,
  Eye,
  Settings,
  BarChart3,
  AlertCircle,
  XCircle
} from 'lucide-react';

interface MaintenanceRecord {
  id: string;
  vehicleId: string;
  vehicleName: string;
  type: 'routine' | 'repair' | 'inspection' | 'recall';
  title: string;
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  status: 'scheduled' | 'in-progress' | 'completed' | 'overdue';
  scheduledDate: Date;
  completedDate?: Date;
  estimatedCost: number;
  actualCost?: number;
  estimatedDowntime: number; // hours
  actualDowntime?: number; // hours
  technicianId?: string;
  technicianName?: string;
  serviceCenter: string;
  mileage: number;
  predictiveScore: number; // 0-100, AI confidence in prediction
  partsCost: number;
  laborCost: number;
  notes?: string;
}

interface PredictiveAlert {
  id: string;
  vehicleId: string;
  vehicleName: string;
  component: string;
  issueType: string;
  probability: number; // 0-100
  urgency: 'low' | 'medium' | 'high' | 'critical';
  predictedFailureDate: Date;
  estimatedCost: number;
  recommendedAction: string;
  dataPoints: string[];
  confidence: number;
}

export function MaintenanceTracking() {
  const [activeTab, setActiveTab] = React.useState('overview');
  const [filterSeverity, setFilterSeverity] = React.useState('all');
  const [filterStatus, setFilterStatus] = React.useState('all');
  const [selectedRecord, setSelectedRecord] = React.useState<MaintenanceRecord | null>(null);

  // Mock data - in real app would come from API
  const maintenanceRecords: MaintenanceRecord[] = [
    {
      id: '1',
      vehicleId: '1',
      vehicleName: 'Honda Civic (ABC-123)',
      type: 'routine',
      title: 'Oil Change & Filter',
      description: 'Routine oil change and oil filter replacement',
      severity: 'low',
      status: 'scheduled',
      scheduledDate: new Date(2024, 9, 15),
      estimatedCost: 85,
      estimatedDowntime: 2,
      serviceCenter: 'Downtown Service',
      mileage: 15420,
      predictiveScore: 95,
      partsCost: 35,
      laborCost: 50
    },
    {
      id: '2',
      vehicleId: '2',
      vehicleName: 'Toyota RAV4 (DEF-456)',
      type: 'repair',
      title: 'Brake Pad Replacement',
      description: 'Front brake pads showing 15% remaining life',
      severity: 'high',
      status: 'in-progress',
      scheduledDate: new Date(2024, 8, 25),
      estimatedCost: 450,
      actualCost: 485,
      estimatedDowntime: 4,
      actualDowntime: 5,
      technicianId: 'tech-001',
      technicianName: 'Mike Thompson',
      serviceCenter: 'Service Center North',
      mileage: 28750,
      predictiveScore: 89,
      partsCost: 285,
      laborCost: 200,
      notes: 'Also replaced brake fluid as it was due'
    },
    {
      id: '3',
      vehicleId: '3',
      vehicleName: 'Ford Transit (GHI-789)',
      type: 'inspection',
      title: 'Safety Inspection',
      description: 'Annual safety inspection required',
      severity: 'medium',
      status: 'overdue',
      scheduledDate: new Date(2024, 8, 20),
      estimatedCost: 125,
      estimatedDowntime: 3,
      serviceCenter: 'Fleet Inspection Center',
      mileage: 8930,
      predictiveScore: 78,
      partsCost: 25,
      laborCost: 100
    }
  ];

  const predictiveAlerts: PredictiveAlert[] = [
    {
      id: '1',
      vehicleId: '1',
      vehicleName: 'Honda Civic (ABC-123)',
      component: 'Transmission',
      issueType: 'Fluid Leak',
      probability: 78,
      urgency: 'medium',
      predictedFailureDate: new Date(2024, 10, 15),
      estimatedCost: 650,
      recommendedAction: 'Schedule transmission fluid inspection within 2 weeks',
      dataPoints: ['Oil temperature patterns', 'Shift timing irregularities', 'Mileage analysis'],
      confidence: 85
    },
    {
      id: '2',
      vehicleId: '2',
      vehicleName: 'Toyota RAV4 (DEF-456)',
      component: 'Air Filter',
      issueType: 'Clogged Filter',
      probability: 92,
      urgency: 'low',
      predictedFailureDate: new Date(2024, 11, 30),
      estimatedCost: 45,
      recommendedAction: 'Replace air filter during next routine service',
      dataPoints: ['Engine performance metrics', 'Fuel efficiency decline', 'Usage patterns'],
      confidence: 95
    },
    {
      id: '3',
      vehicleId: '3',
      vehicleName: 'Ford Transit (GHI-789)',
      component: 'Battery',
      issueType: 'Capacity Degradation',
      probability: 85,
      urgency: 'high',
      predictedFailureDate: new Date(2024, 9, 30),
      estimatedCost: 180,
      recommendedAction: 'Schedule battery replacement within 1 week',
      dataPoints: ['Charging patterns', 'Voltage readings', 'Cold weather performance'],
      confidence: 91
    }
  ];

  const metrics = {
    totalMaintenanceCost: 12450,
    avgDowntimePerVehicle: 18, // hours
    preventiveMaintenanceRate: 73,
    costSavings: 3200, // from predictive maintenance
    upcomingMaintenance: 8,
    overdueItems: 2
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-destructive text-destructive-foreground';
      case 'high': return 'bg-destructive text-destructive-foreground';
      case 'medium': return 'bg-accent text-accent-foreground';
      case 'low': return 'bg-secondary text-secondary-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-secondary text-secondary-foreground';
      case 'in-progress': return 'bg-primary text-primary-foreground';
      case 'scheduled': return 'bg-accent text-accent-foreground';
      case 'overdue': return 'bg-destructive text-destructive-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-4 h-4" />;
      case 'in-progress': return <Clock className="w-4 h-4" />;
      case 'scheduled': return <Calendar className="w-4 h-4" />;
      case 'overdue': return <AlertTriangle className="w-4 h-4" />;
      default: return <Activity className="w-4 h-4" />;
    }
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'critical': return 'text-destructive';
      case 'high': return 'text-destructive';
      case 'medium': return 'text-accent';
      case 'low': return 'text-secondary';
      default: return 'text-muted-foreground';
    }
  };

  const filteredRecords = maintenanceRecords.filter(record => {
    const severityMatch = filterSeverity === 'all' || record.severity === filterSeverity;
    const statusMatch = filterStatus === 'all' || record.status === filterStatus;
    return severityMatch && statusMatch;
  });

  const getMaintenanceTypeIcon = (type: string) => {
    switch (type) {
      case 'routine': return <Settings className="w-4 h-4" />;
      case 'repair': return <Wrench className="w-4 h-4" />;
      case 'inspection': return <Eye className="w-4 h-4" />;
      case 'recall': return <AlertCircle className="w-4 h-4" />;
      default: return <Activity className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Maintenance Tracking</h2>
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Schedule Maintenance
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Schedule New Maintenance</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="vehicle">Vehicle</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select vehicle" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">Honda Civic (ABC-123)</SelectItem>
                    <SelectItem value="2">Toyota RAV4 (DEF-456)</SelectItem>
                    <SelectItem value="3">Ford Transit (GHI-789)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="type">Type</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="routine">Routine</SelectItem>
                      <SelectItem value="repair">Repair</SelectItem>
                      <SelectItem value="inspection">Inspection</SelectItem>
                      <SelectItem value="recall">Recall</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="severity">Severity</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select severity" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="critical">Critical</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label htmlFor="title">Title</Label>
                <Input id="title" placeholder="Oil Change & Filter" />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" placeholder="Routine maintenance description..." />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="scheduledDate">Scheduled Date</Label>
                  <Input id="scheduledDate" type="date" />
                </div>
                <div>
                  <Label htmlFor="estimatedCost">Estimated Cost ($)</Label>
                  <Input id="estimatedCost" type="number" placeholder="150" />
                </div>
              </div>
              <Button className="w-full">Schedule Maintenance</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Metrics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-destructive/10 rounded-lg">
                <DollarSign className="w-5 h-5 text-destructive" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Cost</p>
                <p className="text-lg font-bold">${metrics.totalMaintenanceCost.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-accent/10 rounded-lg">
                <Clock className="w-5 h-5 text-accent" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Avg Downtime</p>
                <p className="text-lg font-bold">{metrics.avgDowntimePerVehicle}h</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-secondary/10 rounded-lg">
                <TrendingUp className="w-5 h-5 text-secondary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Preventive Rate</p>
                <p className="text-lg font-bold">{metrics.preventiveMaintenanceRate}%</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <TrendingDown className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Cost Savings</p>
                <p className="text-lg font-bold">${metrics.costSavings.toLocaleString()}</p>
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
                <p className="text-sm text-muted-foreground">Upcoming</p>
                <p className="text-lg font-bold">{metrics.upcomingMaintenance}</p>
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
                <p className="text-sm text-muted-foreground">Overdue</p>
                <p className="text-lg font-bold">{metrics.overdueItems}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="scheduled">Scheduled</TabsTrigger>
          <TabsTrigger value="predictive">Predictive Alerts</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Filters */}
          <div className="flex items-center gap-4">
            <Select value={filterSeverity} onValueChange={setFilterSeverity}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by severity" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Severities</SelectItem>
                <SelectItem value="critical">Critical</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="low">Low</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="overdue">Overdue</SelectItem>
                <SelectItem value="in-progress">In Progress</SelectItem>
                <SelectItem value="scheduled">Scheduled</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Maintenance Records */}
          <div className="space-y-4">
            {filteredRecords.map((record) => (
              <Card key={record.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-4">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        {getMaintenanceTypeIcon(record.type)}
                      </div>
                      <div>
                        <h3 className="font-bold text-lg">{record.title}</h3>
                        <p className="text-sm text-muted-foreground">{record.vehicleName}</p>
                        <p className="text-sm text-muted-foreground">{record.description}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={getSeverityColor(record.severity)}>
                        {record.severity}
                      </Badge>
                      <Badge className={getStatusColor(record.status)}>
                        {getStatusIcon(record.status)}
                        {record.status}
                      </Badge>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                    <div className="text-center p-3 bg-muted/50 rounded-lg">
                      <Calendar className="w-5 h-5 mx-auto mb-1 text-muted-foreground" />
                      <p className="text-sm font-medium">Scheduled</p>
                      <p className="text-sm text-muted-foreground">
                        {record.scheduledDate.toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-center p-3 bg-muted/50 rounded-lg">
                      <DollarSign className="w-5 h-5 mx-auto mb-1 text-muted-foreground" />
                      <p className="text-sm font-medium">Cost</p>
                      <p className="text-sm text-muted-foreground">
                        ${record.actualCost || record.estimatedCost}
                        {record.actualCost !== record.estimatedCost && record.actualCost && (
                          <span className="text-xs"> (est. ${record.estimatedCost})</span>
                        )}
                      </p>
                    </div>
                    <div className="text-center p-3 bg-muted/50 rounded-lg">
                      <Clock className="w-5 h-5 mx-auto mb-1 text-muted-foreground" />
                      <p className="text-sm font-medium">Downtime</p>
                      <p className="text-sm text-muted-foreground">
                        {record.actualDowntime || record.estimatedDowntime}h
                        {record.actualDowntime !== record.estimatedDowntime && record.actualDowntime && (
                          <span className="text-xs"> (est. {record.estimatedDowntime}h)</span>
                        )}
                      </p>
                    </div>
                    <div className="text-center p-3 bg-muted/50 rounded-lg">
                      <BarChart3 className="w-5 h-5 mx-auto mb-1 text-muted-foreground" />
                      <p className="text-sm font-medium">AI Confidence</p>
                      <p className="text-sm text-muted-foreground">{record.predictiveScore}%</p>
                    </div>
                  </div>

                  {record.technicianName && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                      <span>Technician: {record.technicianName}</span>
                      <span>•</span>
                      <span>{record.serviceCenter}</span>
                    </div>
                  )}

                  {record.notes && (
                    <div className="bg-muted/50 p-3 rounded-lg">
                      <p className="text-sm">{record.notes}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="predictive" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5" />
                Predictive Maintenance Alerts
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {predictiveAlerts.map((alert) => (
                  <div key={alert.id} className="border border-border rounded-lg p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="font-bold">{alert.vehicleName}</h4>
                        <p className="text-sm text-muted-foreground">{alert.component} - {alert.issueType}</p>
                      </div>
                      <div className="text-right">
                        <Badge className={getSeverityColor(alert.urgency)}>
                          {alert.urgency} urgency
                        </Badge>
                        <p className="text-sm font-medium mt-1">{alert.probability}% probability</p>
                      </div>
                    </div>

                    <div className="space-y-2 mb-4">
                      <div className="flex justify-between text-sm">
                        <span>Failure Probability</span>
                        <span>{alert.probability}%</span>
                      </div>
                      <Progress value={alert.probability} className="h-2" />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div className="text-center p-2 bg-muted/50 rounded">
                        <p className="text-xs text-muted-foreground">Predicted Failure</p>
                        <p className="text-sm font-medium">{alert.predictedFailureDate.toLocaleDateString()}</p>
                      </div>
                      <div className="text-center p-2 bg-muted/50 rounded">
                        <p className="text-xs text-muted-foreground">Estimated Cost</p>
                        <p className="text-sm font-medium">${alert.estimatedCost}</p>
                      </div>
                      <div className="text-center p-2 bg-muted/50 rounded">
                        <p className="text-xs text-muted-foreground">AI Confidence</p>
                        <p className="text-sm font-medium">{alert.confidence}%</p>
                      </div>
                    </div>

                    <div className="bg-accent/10 p-3 rounded-lg mb-3">
                      <p className="text-sm font-medium mb-1">Recommended Action:</p>
                      <p className="text-sm">{alert.recommendedAction}</p>
                    </div>

                    <div className="mb-3">
                      <p className="text-sm font-medium mb-1">AI Analysis Based On:</p>
                      <div className="flex flex-wrap gap-1">
                        {alert.dataPoints.map((point, index) => (
                          <Badge key={index} variant="outline" size="sm">
                            {point}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button size="sm">Schedule Maintenance</Button>
                      <Button size="sm" variant="outline">Inspect Now</Button>
                      <Button size="sm" variant="outline">Dismiss Alert</Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Cost Breakdown</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm">Parts</span>
                      <span className="text-sm">$7,200 (58%)</span>
                    </div>
                    <Progress value={58} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm">Labor</span>
                      <span className="text-sm">$4,150 (33%)</span>
                    </div>
                    <Progress value={33} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm">Emergency Repairs</span>
                      <span className="text-sm">$1,100 (9%)</span>
                    </div>
                    <Progress value={9} className="h-2" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Maintenance Trends</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Preventive Maintenance</span>
                    <div className="flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-green-600" />
                      <span className="text-sm font-medium">+15%</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Emergency Repairs</span>
                    <div className="flex items-center gap-2">
                      <TrendingDown className="w-4 h-4 text-green-600" />
                      <span className="text-sm font-medium">-23%</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Average Downtime</span>
                    <div className="flex items-center gap-2">
                      <TrendingDown className="w-4 h-4 text-green-600" />
                      <span className="text-sm font-medium">-18%</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Cost per Vehicle</span>
                    <div className="flex items-center gap-2">
                      <TrendingDown className="w-4 h-4 text-green-600" />
                      <span className="text-sm font-medium">-12%</span>
                    </div>
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