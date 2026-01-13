import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Calendar } from './ui/calendar';
import { 
  Wrench, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  TrendingUp, 
  DollarSign, 
  Bot, 
  Zap,
  Car,
  Calendar as CalendarIcon,
  Filter,
  Download,
  Plus
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';

interface MaintenanceItem {
  id: string;
  vehicleId: string;
  vehicleName: string;
  type: 'preventive' | 'corrective' | 'predictive';
  priority: 'low' | 'medium' | 'high' | 'critical';
  status: 'scheduled' | 'in_progress' | 'completed' | 'overdue';
  title: string;
  description: string;
  scheduledDate: Date;
  estimatedDuration: string;
  estimatedCost: number;
  actualCost?: number;
  aiPredicted: boolean;
  downtime: number;
  technician?: string;
  completedDate?: Date;
  mileage: number;
  nextService: Date;
}

interface MaintenanceMetrics {
  totalItems: number;
  overdue: number;
  inProgress: number;
  completed: number;
  predictiveAlerts: number;
  costSavings: number;
  averageDowntime: number;
  preventiveRatio: number;
}

const mockMaintenanceData: MaintenanceItem[] = [
  {
    id: 'M001',
    vehicleId: 'V001',
    vehicleName: 'Honda Civic #A123',
    type: 'predictive',
    priority: 'high',
    status: 'scheduled',
    title: 'Engine Diagnostic Required',
    description: 'AI detected anomalous engine temperature patterns. Preventive check recommended.',
    scheduledDate: new Date('2024-09-25'),
    estimatedDuration: '3 hours',
    estimatedCost: 150,
    aiPredicted: true,
    downtime: 180,
    mileage: 45230,
    nextService: new Date('2024-12-25')
  },
  {
    id: 'M002',
    vehicleId: 'V002',
    vehicleName: 'Toyota RAV4 #B456',
    type: 'preventive',
    priority: 'medium',
    status: 'in_progress',
    title: 'Regular Service - 50k km',
    description: 'Scheduled maintenance at 50,000 km milestone.',
    scheduledDate: new Date('2024-09-23'),
    estimatedDuration: '4 hours',
    estimatedCost: 280,
    actualCost: 245,
    aiPredicted: false,
    downtime: 240,
    technician: 'Mike Johnson',
    mileage: 50100,
    nextService: new Date('2025-03-23')
  },
  {
    id: 'M003',
    vehicleId: 'V003',
    vehicleName: 'Ford Transit #C789',
    type: 'corrective',
    priority: 'critical',
    status: 'overdue',
    title: 'Brake System Repair',
    description: 'Customer reported brake performance issue. Requires immediate attention.',
    scheduledDate: new Date('2024-09-20'),
    estimatedDuration: '6 hours',
    estimatedCost: 450,
    aiPredicted: false,
    downtime: 360,
    mileage: 67890,
    nextService: new Date('2024-11-20')
  },
  {
    id: 'M004',
    vehicleId: 'V004',
    vehicleName: 'Nissan Sentra #D012',
    type: 'predictive',
    priority: 'low',
    status: 'completed',
    title: 'Tire Rotation & Inspection',
    description: 'AI-scheduled based on wear pattern analysis.',
    scheduledDate: new Date('2024-09-18'),
    estimatedDuration: '1.5 hours',
    estimatedCost: 85,
    actualCost: 75,
    aiPredicted: true,
    downtime: 90,
    technician: 'Sarah Chen',
    completedDate: new Date('2024-09-18'),
    mileage: 32100,
    nextService: new Date('2024-12-18')
  }
];

const mockMetrics: MaintenanceMetrics = {
  totalItems: 24,
  overdue: 3,
  inProgress: 5,
  completed: 16,
  predictiveAlerts: 8,
  costSavings: 2340,
  averageDowntime: 185,
  preventiveRatio: 73
};

const maintenanceTrendData = [
  { month: 'Jul', preventive: 12, corrective: 8, predictive: 4 },
  { month: 'Aug', preventive: 15, corrective: 6, predictive: 7 },
  { month: 'Sep', preventive: 18, corrective: 4, predictive: 9 },
  { month: 'Oct', preventive: 14, corrective: 5, predictive: 11 }
];

const costAnalysisData = [
  { category: 'Preventive', cost: 4200, savings: 1800 },
  { category: 'Predictive AI', cost: 2100, savings: 3200 },
  { category: 'Corrective', cost: 6800, savings: 0 }
];

const COLORS = {
  preventive: '#21A179',
  corrective: '#E04B4B', 
  predictive: '#0B5FFF'
};

export function MaintenanceDashboard() {
  const [selectedFilter, setSelectedFilter] = React.useState<'all' | 'overdue' | 'scheduled' | 'ai_predicted'>('all');
  const [selectedDate, setSelectedDate] = React.useState<Date | undefined>(new Date());

  const filteredMaintenance = React.useMemo(() => {
    let filtered = [...mockMaintenanceData];
    
    switch (selectedFilter) {
      case 'overdue':
        filtered = filtered.filter(item => item.status === 'overdue');
        break;
      case 'scheduled':
        filtered = filtered.filter(item => item.status === 'scheduled');
        break;
      case 'ai_predicted':
        filtered = filtered.filter(item => item.aiPredicted);
        break;
    }
    
    return filtered;
  }, [selectedFilter]);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'high':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-blue-100 text-blue-800 border-blue-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'in_progress':
        return <Clock className="w-4 h-4 text-blue-500 animate-pulse" />;
      case 'overdue':
        return <AlertTriangle className="w-4 h-4 text-red-500" />;
      default:
        return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  const getTypeColor = (type: string) => {
    return type === 'predictive' ? COLORS.predictive : 
           type === 'preventive' ? COLORS.preventive : 
           COLORS.corrective;
  };

  return (
    <div className="space-y-6">
      {/* Metrics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-l-4 border-l-red-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-red-500" />
              Overdue Items
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{mockMetrics.overdue}</div>
            <p className="text-xs text-muted-foreground">Require immediate attention</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-accent">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Bot className="w-4 h-4 text-accent" />
              AI Predictive Alerts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-accent">{mockMetrics.predictiveAlerts}</div>
            <p className="text-xs text-muted-foreground">Preventing future breakdowns</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-green-500" />
              Cost Savings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">${mockMetrics.costSavings}</div>
            <p className="text-xs text-muted-foreground">Through AI optimization</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-primary">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-primary" />
              Preventive Ratio
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{mockMetrics.preventiveRatio}%</div>
            <p className="text-xs text-muted-foreground">vs corrective maintenance</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Maintenance Trend Analysis</CardTitle>
            <p className="text-sm text-muted-foreground">Monthly breakdown by maintenance type</p>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={maintenanceTrendData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="preventive" fill={COLORS.preventive} name="Preventive" />
                <Bar dataKey="corrective" fill={COLORS.corrective} name="Corrective" />
                <Bar dataKey="predictive" fill={COLORS.predictive} name="AI Predictive" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Cost Analysis & Savings</CardTitle>
            <p className="text-sm text-muted-foreground">Maintenance costs vs AI-driven savings</p>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={costAnalysisData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="category" />
                <YAxis />
                <Tooltip formatter={(value, name) => [`$${value}`, name === 'cost' ? 'Cost' : 'Savings']} />
                <Bar dataKey="cost" fill="#E5E7EB" name="cost" />
                <Bar dataKey="savings" fill="#21A179" name="savings" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Maintenance Items */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Maintenance Schedule</CardTitle>
              <p className="text-sm text-muted-foreground">
                AI-optimized maintenance planning and execution
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
              <Button size="sm">
                <Plus className="w-4 h-4 mr-2" />
                Schedule Maintenance
              </Button>
            </div>
          </div>
          
          {/* Filter Tabs */}
          <div className="flex gap-1 mt-4">
            {[
              { key: 'all', label: 'All Items', count: mockMaintenanceData.length },
              { key: 'overdue', label: 'Overdue', count: mockMetrics.overdue },
              { key: 'scheduled', label: 'Scheduled', count: mockMaintenanceData.filter(i => i.status === 'scheduled').length },
              { key: 'ai_predicted', label: 'AI Predicted', count: mockMaintenanceData.filter(i => i.aiPredicted).length }
            ].map(filter => (
              <button
                key={filter.key}
                onClick={() => setSelectedFilter(filter.key as any)}
                className={`px-3 py-1 text-sm rounded-md border transition-colors ${
                  selectedFilter === filter.key
                    ? 'bg-primary text-primary-foreground border-primary'
                    : 'bg-background text-muted-foreground border-input hover:bg-muted'
                }`}
              >
                {filter.label} ({filter.count})
              </button>
            ))}
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredMaintenance.map((item) => (
              <div 
                key={item.id} 
                className="p-4 border border-input rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center gap-3">
                      {getStatusIcon(item.status)}
                      <h4 className="font-semibold">{item.title}</h4>
                      {item.aiPredicted && (
                        <Badge variant="outline" className="border-accent text-accent">
                          <Bot className="w-3 h-3 mr-1" />
                          AI Predicted
                        </Badge>
                      )}
                      <Badge className={getPriorityColor(item.priority)}>
                        {item.priority.toUpperCase()}
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Vehicle:</span>
                        <p className="font-medium">{item.vehicleName}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Scheduled:</span>
                        <p className="font-medium">{item.scheduledDate.toLocaleDateString()}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Duration:</span>
                        <p className="font-medium">{item.estimatedDuration}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Cost:</span>
                        <p className="font-medium">
                          ${item.actualCost || item.estimatedCost}
                          {item.actualCost && item.actualCost < item.estimatedCost && (
                            <span className="text-green-600 text-xs ml-1">
                              (${item.estimatedCost - item.actualCost} saved)
                            </span>
                          )}
                        </p>
                      </div>
                    </div>
                    
                    <p className="text-sm text-muted-foreground">{item.description}</p>
                    
                    {item.aiPredicted && (
                      <div className="flex items-center gap-1 text-xs text-accent">
                        <Zap className="w-3 h-3" />
                        <span>AI detected potential issue based on telemetry data</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex flex-col items-end gap-2 ml-4">
                    <div 
                      className="w-2 h-16 rounded-full"
                      style={{ backgroundColor: getTypeColor(item.type) }}
                    />
                    <Button variant="outline" size="sm">
                      {item.status === 'completed' ? 'View Report' : 
                       item.status === 'in_progress' ? 'Update Status' : 
                       'Modify Schedule'}
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {filteredMaintenance.length === 0 && (
            <div className="text-center py-12">
              <Wrench className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Maintenance Items</h3>
              <p className="text-muted-foreground mb-4">
                {selectedFilter === 'all' 
                  ? 'No maintenance items scheduled or in progress.'
                  : `No ${selectedFilter.replace('_', ' ')} maintenance items found.`
                }
              </p>
              <Button variant="outline">
                <Plus className="w-4 h-4 mr-2" />
                Schedule New Maintenance
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* AI Recommendations */}
      <Card className="border-l-4 border-l-accent">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bot className="w-5 h-5 text-accent" />
            AI Maintenance Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-accent/10 border border-accent/20 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Zap className="w-4 h-4 text-accent" />
                <span className="font-medium">Optimize Schedule</span>
              </div>
              <p className="text-sm text-muted-foreground mb-3">
                Reschedule 3 maintenance items to reduce total fleet downtime by 15%
              </p>
              <Button size="sm" className="w-full">Apply Optimization</Button>
            </div>
            
            <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="w-4 h-4 text-orange-500" />
                <span className="font-medium">Predictive Alert</span>
              </div>
              <p className="text-sm text-muted-foreground mb-3">
                Toyota RAV4 #B789 showing early brake wear patterns - schedule inspection
              </p>
              <Button variant="outline" size="sm" className="w-full">Schedule Check</Button>
            </div>
            
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <DollarSign className="w-4 h-4 text-green-500" />
                <span className="font-medium">Cost Optimization</span>
              </div>
              <p className="text-sm text-muted-foreground mb-3">
                Bulk maintenance for 5 vehicles could save $340 in labor costs
              </p>
              <Button variant="outline" size="sm" className="w-full">View Details</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}