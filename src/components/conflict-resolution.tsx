import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Alert, AlertDescription } from './ui/alert';
import { 
  AlertTriangle, 
  CheckCircle, 
  Bot, 
  Zap, 
  Clock, 
  Users, 
  Car, 
  Phone,
  MessageSquare,
  ArrowRight,
  RefreshCw,
  Target,
  TrendingUp,
  DollarSign
} from 'lucide-react';

interface ConflictItem {
  id: string;
  type: 'double_booking' | 'maintenance_overlap' | 'vehicle_unavailable' | 'location_conflict';
  severity: 'low' | 'medium' | 'high' | 'critical';
  status: 'detected' | 'analyzing' | 'resolving' | 'resolved' | 'escalated';
  detectedAt: Date;
  resolvedAt?: Date;
  affectedBookings: {
    id: string;
    customerName: string;
    vehicleId: string;
    vehicleName: string;
    startDate: Date;
    endDate: Date;
    channel: 'web' | 'whatsapp' | 'sms' | 'phone';
  }[];
  aiSolution?: {
    type: 'vehicle_swap' | 'time_adjustment' | 'upgrade' | 'reschedule';
    description: string;
    confidence: number;
    impactScore: number;
    customerSatisfactionScore: number;
    revenueImpact: number;
  };
  resolution?: {
    action: string;
    customerNotified: boolean;
    alternativeOffered: boolean;
    compensationOffered?: string;
    resolutionTime: number; // minutes
  };
  aiProcessingTime?: number; // milliseconds
}

interface ConflictMetrics {
  totalConflicts: number;
  resolvedAutomatically: number;
  escalatedToHuman: number;
  averageResolutionTime: number;
  customerSatisfactionRate: number;
  revenueProtected: number;
  automationRate: number;
}

const mockConflicts: ConflictItem[] = [
  {
    id: 'C001',
    type: 'double_booking',
    severity: 'high',
    status: 'resolved',
    detectedAt: new Date('2024-09-23T14:30:00'),
    resolvedAt: new Date('2024-09-23T14:33:00'),
    affectedBookings: [
      {
        id: 'B001',
        customerName: 'John Smith',
        vehicleId: 'V001',
        vehicleName: 'Honda Civic #A123',
        startDate: new Date('2024-09-25T09:00:00'),
        endDate: new Date('2024-09-27T17:00:00'),
        channel: 'web'
      },
      {
        id: 'B002',
        customerName: 'Sarah Johnson',
        vehicleId: 'V001',
        vehicleName: 'Honda Civic #A123',
        startDate: new Date('2024-09-26T10:00:00'),
        endDate: new Date('2024-09-28T15:00:00'),
        channel: 'whatsapp'
      }
    ],
    aiSolution: {
      type: 'upgrade',
      description: 'Upgrade Sarah Johnson to Toyota RAV4 at same price point',
      confidence: 0.94,
      impactScore: 0.85,
      customerSatisfactionScore: 0.92,
      revenueImpact: 0
    },
    resolution: {
      action: 'Customer upgraded to Toyota RAV4, notified via WhatsApp',
      customerNotified: true,
      alternativeOffered: true,
      resolutionTime: 3
    },
    aiProcessingTime: 1200
  },
  {
    id: 'C002',
    type: 'maintenance_overlap',
    severity: 'medium',
    status: 'analyzing',
    detectedAt: new Date('2024-09-23T16:15:00'),
    affectedBookings: [
      {
        id: 'B003',
        customerName: 'Mike Chen',
        vehicleId: 'V002',
        vehicleName: 'Toyota RAV4 #B456',
        startDate: new Date('2024-09-24T08:00:00'),
        endDate: new Date('2024-09-26T18:00:00'),
        channel: 'phone'
      }
    ],
    aiSolution: {
      type: 'reschedule',
      description: 'Reschedule maintenance to 6 AM, reduce downtime overlap',
      confidence: 0.87,
      impactScore: 0.65,
      customerSatisfactionScore: 0.88,
      revenueImpact: -25
    }
  },
  {
    id: 'C003',
    type: 'vehicle_unavailable',
    severity: 'critical',
    status: 'escalated',
    detectedAt: new Date('2024-09-23T11:45:00'),
    affectedBookings: [
      {
        id: 'B004',
        customerName: 'Lisa Wang',
        vehicleId: 'V003',
        vehicleName: 'Ford Transit #C789',
        startDate: new Date('2024-09-24T12:00:00'),
        endDate: new Date('2024-09-25T20:00:00'),
        channel: 'sms'
      }
    ],
    resolution: {
      action: 'Escalated to human agent - vehicle in accident',
      customerNotified: true,
      alternativeOffered: false,
      compensationOffered: 'Full refund + 20% credit for future booking',
      resolutionTime: 45
    }
  }
];

const mockMetrics: ConflictMetrics = {
  totalConflicts: 156,
  resolvedAutomatically: 142,
  escalatedToHuman: 14,
  averageResolutionTime: 4.2,
  customerSatisfactionRate: 89,
  revenueProtected: 8940,
  automationRate: 91
};

export function ConflictResolution() {
  const [activeFilter, setActiveFilter] = React.useState<'all' | 'active' | 'resolved' | 'escalated'>('all');
  const [isProcessing, setIsProcessing] = React.useState(false);

  const filteredConflicts = React.useMemo(() => {
    switch (activeFilter) {
      case 'active':
        return mockConflicts.filter(c => ['detected', 'analyzing', 'resolving'].includes(c.status));
      case 'resolved':
        return mockConflicts.filter(c => c.status === 'resolved');
      case 'escalated':
        return mockConflicts.filter(c => c.status === 'escalated');
      default:
        return mockConflicts;
    }
  }, [activeFilter]);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
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
      case 'resolved':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'analyzing':
      case 'resolving':
        return <RefreshCw className="w-4 h-4 text-blue-500 animate-spin" />;
      case 'escalated':
        return <AlertTriangle className="w-4 h-4 text-red-500" />;
      default:
        return <Clock className="w-4 h-4 text-orange-500" />;
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

  const handleAutoResolve = (conflictId: string) => {
    setIsProcessing(true);
    // Simulate AI processing
    setTimeout(() => {
      setIsProcessing(false);
      console.log('Auto-resolving conflict:', conflictId);
    }, 3000);
  };

  return (
    <div className="space-y-6">
      {/* Metrics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-l-4 border-l-accent">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Bot className="w-4 h-4 text-accent" />
              Automation Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-accent">{mockMetrics.automationRate}%</div>
            <Progress value={mockMetrics.automationRate} className="mt-2" />
            <p className="text-xs text-muted-foreground mt-1">
              {mockMetrics.resolvedAutomatically} of {mockMetrics.totalConflicts} auto-resolved
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-green-500" />
              Customer Satisfaction
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{mockMetrics.customerSatisfactionRate}%</div>
            <p className="text-xs text-muted-foreground">Average across all resolutions</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-primary">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Clock className="w-4 h-4 text-primary" />
              Avg Resolution Time
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{mockMetrics.averageResolutionTime}min</div>
            <p className="text-xs text-muted-foreground">95% faster than manual process</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-orange-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-orange-500" />
              Revenue Protected
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">${mockMetrics.revenueProtected}</div>
            <p className="text-xs text-muted-foreground">Through AI conflict resolution</p>
          </CardContent>
        </Card>
      </div>

      {/* Real-time AI Processing Alert */}
      {isProcessing && (
        <Alert className="border-accent bg-accent/10">
          <Bot className="h-4 w-4 text-accent animate-pulse" />
          <AlertDescription className="flex items-center gap-2">
            <span>AI is analyzing booking patterns and customer preferences to find optimal resolution...</span>
            <Progress value={65} className="w-32" />
          </AlertDescription>
        </Alert>
      )}

      {/* Conflict List */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5 text-primary" />
                Conflict Resolution Center
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                AI-powered automatic conflict detection and resolution
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Zap className="w-4 h-4 mr-2" />
                Auto-Resolve All
              </Button>
              <Button size="sm">
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh
              </Button>
            </div>
          </div>

          {/* Filter Tabs */}
          <div className="flex gap-1 mt-4">
            {[
              { key: 'all', label: 'All Conflicts', count: mockConflicts.length },
              { key: 'active', label: 'Active', count: mockConflicts.filter(c => ['detected', 'analyzing', 'resolving'].includes(c.status)).length },
              { key: 'resolved', label: 'Resolved', count: mockConflicts.filter(c => c.status === 'resolved').length },
              { key: 'escalated', label: 'Escalated', count: mockConflicts.filter(c => c.status === 'escalated').length }
            ].map(filter => (
              <button
                key={filter.key}
                onClick={() => setActiveFilter(filter.key as any)}
                className={`px-3 py-1 text-sm rounded-md border transition-colors ${
                  activeFilter === filter.key
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
            {filteredConflicts.map((conflict) => (
              <div 
                key={conflict.id} 
                className="p-4 border border-input rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className="space-y-4">
                  {/* Conflict Header */}
                  <div className="flex items-start justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center gap-3">
                        {getStatusIcon(conflict.status)}
                        <h4 className="font-semibold">
                          {conflict.type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                        </h4>
                        <Badge className={getSeverityColor(conflict.severity)}>
                          {conflict.severity.toUpperCase()}
                        </Badge>
                        <Badge variant="outline" className="border-accent text-accent">
                          <Bot className="w-3 h-3 mr-1" />
                          AI {conflict.status === 'resolved' ? 'Resolved' : 'Processing'}
                        </Badge>
                      </div>
                      
                      <div className="text-sm text-muted-foreground">
                        Detected: {conflict.detectedAt.toLocaleString()}
                        {conflict.resolvedAt && (
                          <span> • Resolved: {conflict.resolvedAt.toLocaleString()}</span>
                        )}
                        {conflict.aiProcessingTime && (
                          <span> • AI Processing: {conflict.aiProcessingTime}ms</span>
                        )}
                      </div>
                    </div>

                    <div className="flex gap-2">
                      {conflict.status === 'detected' && (
                        <Button 
                          size="sm"
                          onClick={() => handleAutoResolve(conflict.id)}
                          disabled={isProcessing}
                        >
                          <Bot className="w-4 h-4 mr-2" />
                          Auto-Resolve
                        </Button>
                      )}
                      <Button variant="outline" size="sm">
                        View Details
                      </Button>
                    </div>
                  </div>

                  {/* Affected Bookings */}
                  <div className="space-y-2">
                    <h5 className="font-medium text-sm">Affected Bookings:</h5>
                    <div className="grid gap-2">
                      {conflict.affectedBookings.map((booking, index) => (
                        <div key={booking.id} className="flex items-center justify-between p-3 bg-muted/30 rounded border">
                          <div className="flex items-center gap-3">
                            <div className="flex items-center gap-1">
                              {getChannelIcon(booking.channel)}
                              <span className="text-sm font-medium">{booking.customerName}</span>
                            </div>
                            <ArrowRight className="w-3 h-3 text-muted-foreground" />
                            <span className="text-sm">{booking.vehicleName}</span>
                            <span className="text-sm text-muted-foreground">
                              {booking.startDate.toLocaleDateString()} - {booking.endDate.toLocaleDateString()}
                            </span>
                          </div>
                          <Badge variant="secondary" className="text-xs">
                            {booking.channel.toUpperCase()}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* AI Solution */}
                  {conflict.aiSolution && (
                    <div className="p-3 bg-accent/10 border border-accent/20 rounded">
                      <div className="flex items-center gap-2 mb-2">
                        <Zap className="w-4 h-4 text-accent" />
                        <span className="font-medium">AI Recommended Solution</span>
                        <Badge variant="outline" className="text-xs">
                          {Math.round(conflict.aiSolution.confidence * 100)}% confidence
                        </Badge>
                      </div>
                      <p className="text-sm mb-3">{conflict.aiSolution.description}</p>
                      
                      <div className="grid grid-cols-3 gap-3 text-xs">
                        <div className="text-center p-2 bg-white rounded border">
                          <div className="font-semibold">{Math.round(conflict.aiSolution.impactScore * 100)}%</div>
                          <div className="text-muted-foreground">Impact Score</div>
                        </div>
                        <div className="text-center p-2 bg-white rounded border">
                          <div className="font-semibold">{Math.round(conflict.aiSolution.customerSatisfactionScore * 100)}%</div>
                          <div className="text-muted-foreground">Satisfaction</div>
                        </div>
                        <div className="text-center p-2 bg-white rounded border">
                          <div className="font-semibold">${conflict.aiSolution.revenueImpact}</div>
                          <div className="text-muted-foreground">Revenue Impact</div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Resolution Details */}
                  {conflict.resolution && (
                    <div className="p-3 bg-green-50 border border-green-200 rounded">
                      <div className="flex items-center gap-2 mb-2">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <span className="font-medium">Resolution Applied</span>
                      </div>
                      <p className="text-sm mb-2">{conflict.resolution.action}</p>
                      
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span className={`flex items-center gap-1 ${conflict.resolution.customerNotified ? 'text-green-600' : 'text-orange-600'}`}>
                          {conflict.resolution.customerNotified ? '✓' : '⚠'} Customer Notified
                        </span>
                        <span className={`flex items-center gap-1 ${conflict.resolution.alternativeOffered ? 'text-green-600' : 'text-gray-600'}`}>
                          {conflict.resolution.alternativeOffered ? '✓' : '○'} Alternative Offered
                        </span>
                        <span className="text-primary">
                          ⏱ Resolved in {conflict.resolution.resolutionTime}min
                        </span>
                      </div>
                      
                      {conflict.resolution.compensationOffered && (
                        <div className="mt-2 text-sm">
                          <strong>Compensation:</strong> {conflict.resolution.compensationOffered}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Empty State */}
          {filteredConflicts.length === 0 && (
            <div className="text-center py-12">
              <Target className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Conflicts Found</h3>
              <p className="text-muted-foreground mb-4">
                {activeFilter === 'all' 
                  ? 'Great! No booking conflicts detected in the system.'
                  : `No ${activeFilter} conflicts found.`
                }
              </p>
              <Button variant="outline">
                <RefreshCw className="w-4 h-4 mr-2" />
                Check for New Conflicts
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* AI Performance Insights */}
      <Card className="border-l-4 border-l-accent">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bot className="w-5 h-5 text-accent" />
            AI Performance Insights
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-accent/10 border border-accent/20 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Zap className="w-4 h-4 text-accent" />
                <span className="font-medium">Speed Advantage</span>
              </div>
              <div className="text-2xl font-bold text-accent mb-1">95%</div>
              <p className="text-sm text-muted-foreground">
                Faster than manual conflict resolution
              </p>
            </div>
            
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Users className="w-4 h-4 text-green-500" />
                <span className="font-medium">Customer Impact</span>
              </div>
              <div className="text-2xl font-bold text-green-600 mb-1">89%</div>
              <p className="text-sm text-muted-foreground">
                Customer satisfaction with AI resolutions
              </p>
            </div>
            
            <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <DollarSign className="w-4 h-4 text-orange-500" />
                <span className="font-medium">Cost Savings</span>
              </div>
              <div className="text-2xl font-bold text-orange-600 mb-1">$2,340</div>
              <p className="text-sm text-muted-foreground">
                Weekly savings through automation
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}