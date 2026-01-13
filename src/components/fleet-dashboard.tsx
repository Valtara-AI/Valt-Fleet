import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Progress } from './ui/progress';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { Car, AlertTriangle, DollarSign, Users, Calendar, Wrench, TrendingUp, Clock, Bot, Zap, Target, Smartphone, MessageSquare, Phone, MessageCircle } from 'lucide-react';

interface FleetMetrics {
  totalVehicles: number;
  availableVehicles: number;
  bookedVehicles: number;
  maintenanceVehicles: number;
  utilization: number;
  revenue: number;
  activeBookings: number;
  maintenanceAlerts: number;
  automationRate: number;
  costSavings: number;
  aiProcessedBookings: number;
}

const mockMetrics: FleetMetrics = {
  totalVehicles: 45,
  availableVehicles: 28,
  bookedVehicles: 12,
  maintenanceVehicles: 5,
  utilization: 87.3,
  revenue: 12450,
  activeBookings: 24,
  maintenanceAlerts: 3,
  automationRate: 87,
  costSavings: 2340,
  aiProcessedBookings: 156
};

const utilizationData = [
  { name: 'Mon', utilization: 68, automation: 85 },
  { name: 'Tue', utilization: 72, automation: 89 },
  { name: 'Wed', utilization: 85, automation: 91 },
  { name: 'Thu', utilization: 79, automation: 88 },
  { name: 'Fri', utilization: 92, automation: 94 },
  { name: 'Sat', utilization: 88, automation: 86 },
  { name: 'Sun', utilization: 65, automation: 82 }
];

const channelData = [
  { name: 'WhatsApp', bookings: 45, automated: 43, color: '#25D366' },
  { name: 'SMS', bookings: 28, automated: 26, color: '#1DA1F2' },
  { name: 'Web', bookings: 52, automated: 47, color: '#0B5FFF' },
  { name: 'Phone', bookings: 31, automated: 19, color: '#FF6B35' }
];

const costSavingsData = [
  { week: 'Week 1', manual: 4200, automated: 1850, savings: 2350 },
  { week: 'Week 2', manual: 4100, automated: 1720, savings: 2380 },
  { week: 'Week 3', manual: 4300, automated: 1680, savings: 2620 },
  { week: 'Week 4', manual: 4050, automated: 1710, savings: 2340 }
];

const aiOperations = [
  {
    id: 'AI001',
    operation: 'Booking Conflict Resolution',
    status: 'completed',
    timeSaved: '42 minutes',
    costSaved: '$125',
    channel: 'whatsapp'
  },
  {
    id: 'AI002',
    operation: 'Predictive Maintenance Scheduling',
    status: 'active',
    timeSaved: '2.5 hours',
    costSaved: '$890',
    channel: 'system'
  },
  {
    id: 'AI003',
    operation: 'Dynamic Pricing Optimization',
    status: 'completed',
    timeSaved: '1.8 hours',
    costSaved: '$340',
    channel: 'web'
  },
  {
    id: 'AI004',
    operation: 'Multi-Channel Booking Sync',
    status: 'active',
    timeSaved: '3.2 hours',
    costSaved: '$460',
    channel: 'sms'
  }
];

export function FleetDashboard() {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-accent text-accent-foreground';
      case 'active':
        return 'bg-primary text-primary-foreground';
      case 'pending':
        return 'bg-orange-500 text-white';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const getChannelIcon = (channel: string) => {
    switch (channel) {
      case 'whatsapp':
        return <MessageSquare className="w-4 h-4 text-green-500" />;
      case 'sms':
        return <Smartphone className="w-4 h-4 text-blue-500" />;
      case 'phone':
        return <Phone className="w-4 h-4 text-orange-500" />;
      case 'web':
        return <MessageCircle className="w-4 h-4 text-primary" />;
      default:
        return <Bot className="w-4 h-4 text-accent" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* AI Performance KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-l-4 border-l-accent">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">AI Automation Rate</CardTitle>
            <Bot className="h-4 w-4 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-accent">{mockMetrics.automationRate}%</div>
            <Progress value={mockMetrics.automationRate} className="mt-2" />
            <p className="text-xs text-muted-foreground mt-1">
              {mockMetrics.aiProcessedBookings} of 179 tasks automated
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Weekly Cost Savings</CardTitle>
            <DollarSign className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">${mockMetrics.costSavings.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              +15% vs last week • 340% ROI
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-primary">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Fleet Utilization</CardTitle>
            <TrendingUp className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{mockMetrics.utilization}%</div>
            <Progress value={mockMetrics.utilization} className="mt-2" />
            <p className="text-xs text-muted-foreground">
              AI-optimized scheduling
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-orange-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">AI Operations</CardTitle>
            <Zap className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{aiOperations.filter(op => op.status === 'active').length}</div>
            <p className="text-xs text-muted-foreground">
              Currently optimizing fleet
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Utilization vs Automation Rate</CardTitle>
            <p className="text-sm text-muted-foreground">Higher automation leads to better utilization</p>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={utilizationData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="utilization" fill="#0B5FFF" name="Utilization %" />
                <Bar dataKey="automation" fill="#21A179" name="Automation %" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Multi-Channel Automation</CardTitle>
            <p className="text-sm text-muted-foreground">AI processing across all communication channels</p>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={channelData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip formatter={(value, name) => [value, name === 'bookings' ? 'Total Bookings' : 'AI Automated']} />
                <Bar dataKey="bookings" fill="#E5E7EB" name="bookings" />
                <Bar dataKey="automated" fill="#21A179" name="automated" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Cost Savings Trend */}
      <Card>
        <CardHeader>
          <CardTitle>AI Cost Savings Trend</CardTitle>
          <p className="text-sm text-muted-foreground">Weekly comparison: Manual operations vs AI automation</p>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={costSavingsData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="week" />
              <YAxis />
              <Tooltip formatter={(value, name) => [`$${value}`, name === 'manual' ? 'Manual Cost' : name === 'automated' ? 'AI Cost' : 'Savings']} />
              <Line type="monotone" dataKey="manual" stroke="#E04B4B" strokeWidth={2} name="manual" />
              <Line type="monotone" dataKey="automated" stroke="#0B5FFF" strokeWidth={2} name="automated" />
              <Line type="monotone" dataKey="savings" stroke="#21A179" strokeWidth={3} name="savings" />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* AI Operations & Channel Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Active AI Operations</CardTitle>
            <Badge variant="secondary" className="bg-accent text-accent-foreground">
              <Bot className="w-3 h-3 mr-1" />
              {aiOperations.filter(op => op.status === 'active').length} Running
            </Badge>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {aiOperations.map((operation) => (
                <div key={operation.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      {getChannelIcon(operation.channel)}
                      <Badge className={getStatusColor(operation.status)}>
                        {operation.status}
                      </Badge>
                      <span className="font-medium text-sm">{operation.operation}</span>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {operation.timeSaved} saved
                      </div>
                      <div className="flex items-center gap-1">
                        <DollarSign className="w-3 h-3" />
                        {operation.costSaved} saved
                      </div>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    {operation.status === 'active' ? 'Monitor' : 'View'}
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Multi-Channel Performance</CardTitle>
            <p className="text-sm text-muted-foreground">Real-time activity across all communication channels</p>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {channelData.map((channel) => (
                <div key={channel.name} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {getChannelIcon(channel.name.toLowerCase())}
                      <span className="font-medium">{channel.name}</span>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {channel.automated}/{channel.bookings} automated
                    </div>
                  </div>
                  <Progress 
                    value={(channel.automated / channel.bookings) * 100} 
                    className="h-2"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>{Math.round((channel.automated / channel.bookings) * 100)}% automation</span>
                    <span>{channel.bookings} total bookings</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>AI Fleet Management Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button className="h-auto p-4 flex-col gap-2">
              <Bot className="w-6 h-6" />
              <span>Optimize Routes</span>
              <span className="text-xs opacity-75">AI-powered</span>
            </Button>
            <Button variant="outline" className="h-auto p-4 flex-col gap-2">
              <Wrench className="w-6 h-6" />
              <span>Schedule Maintenance</span>
              <span className="text-xs opacity-75">Predictive</span>
            </Button>
            <Button variant="outline" className="h-auto p-4 flex-col gap-2">
              <Target className="w-6 h-6" />
              <span>Resolve Conflicts</span>
              <span className="text-xs opacity-75">Auto-resolve</span>
            </Button>
            <Button variant="outline" className="h-auto p-4 flex-col gap-2">
              <TrendingUp className="w-6 h-6" />
              <span>Cost Analysis</span>
              <span className="text-xs opacity-75">Real-time</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}