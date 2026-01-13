import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Alert, AlertDescription } from './ui/alert';
import { 
  TrendingUp, 
  TrendingDown, 
  Bot, 
  Zap, 
  Target, 
  AlertTriangle, 
  CheckCircle, 
  DollarSign,
  Users,
  Car,
  Calendar,
  BarChart3,
  Activity,
  Brain,
  Eye,
  Lightbulb
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  BarChart, 
  Bar,
  PieChart,
  Pie,
  Cell,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar
} from 'recharts';

interface Prediction {
  id: string;
  type: 'demand' | 'maintenance' | 'revenue' | 'utilization' | 'pricing';
  title: string;
  description: string;
  confidence: number;
  timeframe: string;
  impact: 'low' | 'medium' | 'high' | 'critical';
  trend: 'up' | 'down' | 'stable';
  currentValue: number;
  predictedValue: number;
  unit: string;
  dataPoints: Array<{
    date: string;
    actual?: number;
    predicted: number;
  }>;
  recommendations: string[];
  aiModel: string;
  lastUpdated: Date;
}

interface AnalyticsMetrics {
  predictionAccuracy: number;
  modelsRunning: number;
  dataPointsProcessed: number;
  recommendationsGenerated: number;
  costSavingsProjected: number;
  revenueOptimization: number;
}

const mockPredictions: Prediction[] = [
  {
    id: 'P001',
    type: 'demand',
    title: 'Weekend Demand Surge Predicted',
    description: 'AI forecasts 34% increase in compact car bookings for Sept 28-29 weekend',
    confidence: 0.92,
    timeframe: '48 hours',
    impact: 'high',
    trend: 'up',
    currentValue: 18,
    predictedValue: 24,
    unit: 'bookings',
    dataPoints: [
      { date: 'Sep 23', actual: 16, predicted: 16 },
      { date: 'Sep 24', actual: 18, predicted: 17 },
      { date: 'Sep 25', predicted: 19 },
      { date: 'Sep 26', predicted: 21 },
      { date: 'Sep 27', predicted: 22 },
      { date: 'Sep 28', predicted: 24 },
      { date: 'Sep 29', predicted: 23 }
    ],
    recommendations: [
      'Increase compact car inventory by 15%',
      'Implement dynamic pricing for weekend premium',
      'Prepare additional maintenance capacity'
    ],
    aiModel: 'Demand Forecasting v3.2',
    lastUpdated: new Date('2024-09-23T16:30:00')
  },
  {
    id: 'P002',
    type: 'maintenance',
    title: 'Preventive Maintenance Optimization',
    description: 'Honda Civic #A123 showing early wear patterns - service recommended within 7 days',
    confidence: 0.87,
    timeframe: '7 days',
    impact: 'medium',
    trend: 'down',
    currentValue: 89,
    predictedValue: 72,
    unit: '% condition',
    dataPoints: [
      { date: 'Week 1', actual: 95, predicted: 95 },
      { date: 'Week 2', actual: 92, predicted: 91 },
      { date: 'Week 3', actual: 89, predicted: 88 },
      { date: 'Week 4', predicted: 84 },
      { date: 'Week 5', predicted: 78 },
      { date: 'Week 6', predicted: 72 }
    ],
    recommendations: [
      'Schedule engine diagnostic within 3 days',
      'Prepare replacement parts inventory',
      'Block vehicle from long-term bookings'
    ],
    aiModel: 'Predictive Maintenance v2.1',
    lastUpdated: new Date('2024-09-23T14:15:00')
  },
  {
    id: 'P003',
    type: 'revenue',
    title: 'Dynamic Pricing Opportunity',
    description: 'AI identifies $450 weekly revenue uplift through optimized pricing strategy',
    confidence: 0.94,
    timeframe: '1 week',
    impact: 'high',
    trend: 'up',
    currentValue: 2340,
    predictedValue: 2790,
    unit: '$ weekly',
    dataPoints: [
      { date: 'Mon', actual: 380, predicted: 380 },
      { date: 'Tue', actual: 340, predicted: 345 },
      { date: 'Wed', predicted: 420 },
      { date: 'Thu', predicted: 445 },
      { date: 'Fri', predicted: 480 },
      { date: 'Sat', predicted: 520 },
      { date: 'Sun', predicted: 485 }
    ],
    recommendations: [
      'Implement surge pricing for peak hours',
      'Offer early-bird discounts for off-peak',
      'Bundle insurance with weekend rentals'
    ],
    aiModel: 'Revenue Optimization v4.0',
    lastUpdated: new Date('2024-09-23T18:45:00')
  }
];

const mockMetrics: AnalyticsMetrics = {
  predictionAccuracy: 87.3,
  modelsRunning: 12,
  dataPointsProcessed: 2450000,
  recommendationsGenerated: 89,
  costSavingsProjected: 8940,
  revenueOptimization: 12.4
};

const performanceData = [
  { model: 'Demand Forecast', accuracy: 92, speed: 850, reliability: 94 },
  { model: 'Maintenance Predict', accuracy: 87, speed: 920, reliability: 91 },
  { model: 'Revenue Optimize', accuracy: 94, speed: 780, reliability: 96 },
  { model: 'Utilization AI', accuracy: 89, speed: 890, reliability: 88 },
  { model: 'Pricing Dynamic', accuracy: 91, speed: 810, reliability: 93 }
];

const impactCategories = [
  { name: 'Cost Reduction', value: 35, color: '#21A179' },
  { name: 'Revenue Growth', value: 28, color: '#0B5FFF' },
  { name: 'Efficiency Gains', value: 22, color: '#FF6B35' },
  { name: 'Risk Mitigation', value: 15, color: '#9333EA' }
];

export function PredictiveAnalytics() {
  const [selectedPrediction, setSelectedPrediction] = React.useState<Prediction | null>(null);
  const [activeTimeframe, setActiveTimeframe] = React.useState<'24h' | '7d' | '30d'>('7d');

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'critical':
        return 'border-red-500 bg-red-50';
      case 'high':
        return 'border-orange-500 bg-orange-50';
      case 'medium':
        return 'border-yellow-500 bg-yellow-50';
      default:
        return 'border-blue-500 bg-blue-50';
    }
  };

  const getTrendIcon = (trend: string, impact: string) => {
    const colorClass = impact === 'high' || impact === 'critical' ? 'text-red-500' : 
                      trend === 'up' ? 'text-green-500' : 
                      trend === 'down' ? 'text-orange-500' : 'text-blue-500';
    
    if (trend === 'up') return <TrendingUp className={`w-4 h-4 ${colorClass}`} />;
    if (trend === 'down') return <TrendingDown className={`w-4 h-4 ${colorClass}`} />;
    return <Activity className={`w-4 h-4 ${colorClass}`} />;
  };

  return (
    <div className="space-y-6">
      {/* AI Analytics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card className="border-l-4 border-l-accent">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Brain className="w-4 h-4 text-accent" />
              Prediction Accuracy
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-accent">{mockMetrics.predictionAccuracy}%</div>
            <Progress value={mockMetrics.predictionAccuracy} className="mt-2" />
            <p className="text-xs text-muted-foreground mt-1">
              Across {mockMetrics.modelsRunning} active AI models
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-primary">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-primary" />
              Revenue Optimization
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">+{mockMetrics.revenueOptimization}%</div>
            <p className="text-xs text-muted-foreground">
              ${mockMetrics.costSavingsProjected} projected monthly savings
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Lightbulb className="w-4 h-4 text-green-500" />
              AI Recommendations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{mockMetrics.recommendationsGenerated}</div>
            <p className="text-xs text-muted-foreground">
              Generated from {(mockMetrics.dataPointsProcessed / 1000000).toFixed(1)}M data points
            </p>
          </CardContent>
        </Card>
      </div>

      {/* AI Model Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>AI Model Performance</CardTitle>
            <p className="text-sm text-muted-foreground">Accuracy, speed, and reliability metrics</p>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <RadarChart data={performanceData}>
                <PolarGrid />
                <PolarAngleAxis dataKey="model" tick={{ fontSize: 10 }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} />
                <Radar name="Accuracy" dataKey="accuracy" stroke="#0B5FFF" fill="#0B5FFF" fillOpacity={0.3} />
                <Radar name="Speed" dataKey="speed" stroke="#21A179" fill="#21A179" fillOpacity={0.3} />
                <Radar name="Reliability" dataKey="reliability" stroke="#FF6B35" fill="#FF6B35" fillOpacity={0.3} />
                <Tooltip />
              </RadarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Impact Distribution</CardTitle>
            <p className="text-sm text-muted-foreground">Where AI analytics drives the most value</p>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={impactCategories}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {impactCategories.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `${value}%`} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Predictions & Forecasts */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Eye className="w-5 h-5 text-primary" />
                AI Predictions & Forecasts
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Real-time predictions across demand, maintenance, and revenue
              </p>
            </div>
            <div className="flex gap-1">
              {['24h', '7d', '30d'].map(timeframe => (
                <button
                  key={timeframe}
                  onClick={() => setActiveTimeframe(timeframe as any)}
                  className={`px-3 py-1 text-sm rounded-md border transition-colors ${
                    activeTimeframe === timeframe
                      ? 'bg-primary text-primary-foreground border-primary'
                      : 'bg-background text-muted-foreground border-input hover:bg-muted'
                  }`}
                >
                  {timeframe}
                </button>
              ))}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockPredictions.map((prediction) => (
              <div 
                key={prediction.id} 
                className={`p-4 border-2 rounded-lg cursor-pointer transition-all hover:shadow-md ${
                  getImpactColor(prediction.impact)
                } ${selectedPrediction?.id === prediction.id ? 'ring-2 ring-primary' : ''}`}
                onClick={() => setSelectedPrediction(prediction)}
              >
                <div className="space-y-3">
                  {/* Prediction Header */}
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center gap-3">
                        {getTrendIcon(prediction.trend, prediction.impact)}
                        <h4 className="font-semibold">{prediction.title}</h4>
                        <Badge variant="outline" className="border-accent text-accent">
                          <Bot className="w-3 h-3 mr-1" />
                          {Math.round(prediction.confidence * 100)}% confidence
                        </Badge>
                        <Badge className={`${
                          prediction.impact === 'critical' ? 'bg-red-100 text-red-800' :
                          prediction.impact === 'high' ? 'bg-orange-100 text-orange-800' :
                          prediction.impact === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-blue-100 text-blue-800'
                        }`}>
                          {prediction.impact.toUpperCase()}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{prediction.description}</p>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span>Model: {prediction.aiModel}</span>
                        <span>Updated: {prediction.lastUpdated.toLocaleString()}</span>
                        <span>Timeframe: {prediction.timeframe}</span>
                      </div>
                    </div>

                    <div className="text-right space-y-1">
                      <div className="text-lg font-bold">
                        {prediction.currentValue} → {prediction.predictedValue} {prediction.unit}
                      </div>
                      <div className={`text-sm ${
                        prediction.trend === 'up' ? 'text-green-600' : 
                        prediction.trend === 'down' ? 'text-red-600' : 'text-blue-600'
                      }`}>
                        {prediction.trend === 'up' ? '+' : prediction.trend === 'down' ? '' : '±'}
                        {Math.abs(prediction.predictedValue - prediction.currentValue)} {prediction.unit}
                      </div>
                    </div>
                  </div>

                  {/* Mini Chart */}
                  <div className="h-20">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={prediction.dataPoints}>
                        <defs>
                          <linearGradient id={`gradient-${prediction.id}`} x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#0B5FFF" stopOpacity={0.3}/>
                            <stop offset="95%" stopColor="#0B5FFF" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <XAxis dataKey="date" hide />
                        <YAxis hide />
                        <Tooltip 
                          labelFormatter={(label) => `Date: ${label}`}
                          formatter={(value, name) => [value, name === 'actual' ? 'Actual' : 'Predicted']}
                        />
                        <Area 
                          type="monotone" 
                          dataKey="actual" 
                          stroke="#21A179" 
                          strokeWidth={2}
                          fill="none"
                          connectNulls={false}
                        />
                        <Area 
                          type="monotone" 
                          dataKey="predicted" 
                          stroke="#0B5FFF" 
                          strokeWidth={2}
                          fill={`url(#gradient-${prediction.id})`}
                          strokeDasharray="5,5"
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>

                  {/* Top Recommendations */}
                  <div className="space-y-2">
                    <h5 className="text-sm font-medium">AI Recommendations:</h5>
                    <div className="space-y-1">
                      {prediction.recommendations.slice(0, 2).map((rec, index) => (
                        <div key={index} className="flex items-center gap-2 text-sm">
                          <CheckCircle className="w-3 h-3 text-accent" />
                          <span>{rec}</span>
                        </div>
                      ))}
                      {prediction.recommendations.length > 2 && (
                        <button className="text-xs text-primary hover:underline">
                          +{prediction.recommendations.length - 2} more recommendations
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Detailed Prediction View */}
      {selectedPrediction && (
        <Card className="border-l-4 border-l-primary">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Brain className="w-5 h-5 text-primary" />
                Detailed Analysis: {selectedPrediction.title}
              </CardTitle>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setSelectedPrediction(null)}
              >
                ×
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Prediction Details</h4>
                  <div className="space-y-2 text-sm">
                    <div className="grid grid-cols-2 gap-2">
                      <span className="text-muted-foreground">AI Model:</span>
                      <span className="font-medium">{selectedPrediction.aiModel}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <span className="text-muted-foreground">Confidence:</span>
                      <span className="font-medium">{Math.round(selectedPrediction.confidence * 100)}%</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <span className="text-muted-foreground">Impact Level:</span>
                      <Badge className={`${
                        selectedPrediction.impact === 'critical' ? 'bg-red-100 text-red-800' :
                        selectedPrediction.impact === 'high' ? 'bg-orange-100 text-orange-800' :
                        selectedPrediction.impact === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-blue-100 text-blue-800'
                      }`}>
                        {selectedPrediction.impact}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <span className="text-muted-foreground">Timeframe:</span>
                      <span className="font-medium">{selectedPrediction.timeframe}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-2">All Recommendations</h4>
                  <div className="space-y-2">
                    {selectedPrediction.recommendations.map((rec, index) => (
                      <div key={index} className="flex items-start gap-2 text-sm">
                        <Lightbulb className="w-4 h-4 text-accent mt-0.5 flex-shrink-0" />
                        <span>{rec}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-2">Trend Analysis</h4>
                <ResponsiveContainer width="100%" height={200}>
                  <LineChart data={selectedPrediction.dataPoints}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Line 
                      type="monotone" 
                      dataKey="actual" 
                      stroke="#21A179" 
                      strokeWidth={3}
                      name="Actual"
                      connectNulls={false}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="predicted" 
                      stroke="#0B5FFF" 
                      strokeWidth={3}
                      strokeDasharray="5,5"
                      name="Predicted"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="mt-6 flex gap-2">
              <Button className="flex-1">
                <Target className="w-4 h-4 mr-2" />
                Implement Recommendations
              </Button>
              <Button variant="outline" className="flex-1">
                <BarChart3 className="w-4 h-4 mr-2" />
                Export Analysis
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* AI Insights Summary */}
      <Alert className="border-accent bg-accent/10">
        <Brain className="h-4 w-4 text-accent" />
        <AlertDescription>
          <div className="space-y-2">
            <p className="font-medium">AI Performance Summary</p>
            <p className="text-sm">
              Your fleet management AI has processed <strong>{(mockMetrics.dataPointsProcessed / 1000000).toFixed(1)}M data points</strong> today, 
              generating <strong>{mockMetrics.recommendationsGenerated} actionable recommendations</strong> with an average accuracy of <strong>{mockMetrics.predictionAccuracy}%</strong>. 
              Projected monthly optimization value: <strong>${mockMetrics.costSavingsProjected}</strong>.
            </p>
          </div>
        </AlertDescription>
      </Alert>
    </div>
  );
}