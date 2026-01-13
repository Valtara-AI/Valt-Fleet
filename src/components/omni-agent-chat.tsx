import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback } from './ui/avatar';
import { MessageCircle, Send, Phone, ArrowUp, Minimize2, Maximize2, AlertTriangle, Smartphone, MessageSquare, Bot, CheckCircle, Clock, Car } from 'lucide-react';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'agent' | 'system';
  timestamp: Date;
  confidence?: number;
  suggestedActions?: string[];
  channel?: 'web' | 'whatsapp' | 'sms' | 'phone';
  automated?: boolean;
}

interface ChatProps {
  minimized?: boolean;
  onToggleMinimize?: () => void;
  onEscalate?: () => void;
  className?: string;
  isAdmin?: boolean;
}

export function OmniAgentChat({ minimized = false, onToggleMinimize, onEscalate, className, isAdmin = false }: ChatProps) {
  const [messages, setMessages] = React.useState<Message[]>([
    {
      id: '1',
      content: isAdmin 
        ? "Fleet Management AI active. I can help with vehicle scheduling, maintenance optimization, booking conflicts, and cost analysis. Current system status: 87% automation rate, saving $2,340/week in manual operations."
        : "Hi! I'm your Valt Fleet Suite AI assistant. I handle bookings across web, WhatsApp, SMS, and phone. I can book vehicles, schedule maintenance, resolve conflicts, and optimize your fleet automatically. How can I help?",
      sender: 'agent',
      timestamp: new Date(),
      confidence: 1.0,
      automated: true,
      channel: 'web'
    }
  ]);
  const [input, setInput] = React.useState('');
  const [isTyping, setIsTyping] = React.useState(false);

  // Simulate incoming messages from different channels
  React.useEffect(() => {
    if (isAdmin) {
      const simulateMultiChannelActivity = () => {
        const channels = ['whatsapp', 'sms', 'phone', 'web'] as const;
        const activities = [
          "📱 WhatsApp: Auto-booked Honda Civic for Sep 25-27, customer verified via OTP",
          "💬 SMS: Maintenance alert sent for Toyota RAV4 #B456, customer rescheduled automatically",
          "📞 Phone: Booking conflict resolved - moved customer to equivalent SUV, saved cancellation",
          "🌐 Web: Predictive maintenance scheduled for 3 vehicles, prevented 2 potential breakdowns"
        ];
        
        setTimeout(() => {
          const randomActivity = activities[Math.floor(Math.random() * activities.length)];
          const randomChannel = channels[Math.floor(Math.random() * channels.length)];
          
          setMessages(prev => [...prev, {
            id: Date.now().toString(),
            content: randomActivity,
            sender: 'system',
            timestamp: new Date(),
            confidence: 0.95,
            automated: true,
            channel: randomChannel
          }]);
        }, Math.random() * 10000 + 5000);
      };

      simulateMultiChannelActivity();
    }
  }, [isAdmin]);

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: input,
      sender: 'user',
      timestamp: new Date(),
      channel: 'web'
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const aiResponse = generateAIResponse(input);
      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1500);
  };

  const generateAIResponse = (userInput: string): Message => {
    const lowerInput = userInput.toLowerCase();
    
    if (lowerInput.includes('book') || lowerInput.includes('rent') || lowerInput.includes('car')) {
      return {
        id: Date.now().toString(),
        content: isAdmin 
          ? "Booking request processed. I've automatically:\n\n✅ Checked availability across all 45 vehicles\n✅ Optimized for highest utilization\n✅ Applied dynamic pricing ($18/day)\n✅ Sent confirmation via customer's preferred channel\n\nFleet utilization increased by 3.2% with this booking."
          : "Perfect! I can book that for you right now. I'll check availability across all channels and find the best vehicle at the lowest price. What dates do you need?\n\n• Sep 25-27: Honda Civic available at $16/day\n• Sep 25-27: Toyota Camry available at $22/day\n\nBoth include insurance and 24/7 support.",
        sender: 'agent',
        timestamp: new Date(),
        confidence: 0.95,
        automated: true,
        suggestedActions: isAdmin 
          ? ['View Booking Details', 'Fleet Analytics', 'Revenue Impact']
          : ['Book Honda Civic', 'Book Toyota Camry', 'See More Options', 'Add Insurance'],
        channel: 'web'
      };
    }
    
    if (lowerInput.includes('maintenance') || lowerInput.includes('service') || lowerInput.includes('repair')) {
      return {
        id: Date.now().toString(),
        content: isAdmin
          ? "AI Maintenance Optimization activated:\n\n🔧 Detected: Engine diagnostic needed for Honda Civic #A123\n📊 Predicted downtime: 18 hours\n🔄 Auto-rescheduled: 2 affected bookings to similar vehicles\n💰 Cost impact: -$45 vs manual scheduling\n⚡ Estimated completion: Tomorrow 2:00 PM\n\nMaintenance request sent to certified technician."
          : "I've logged your maintenance request and automatically optimized the schedule:\n\n✅ Booked service appointment for tomorrow 9 AM\n✅ Alternative vehicle reserved for your existing bookings\n✅ Estimated completion: 18 hours\n✅ No disruption to your travel plans\n\nTotal cost: $120 (includes parts & labor). Proceed?",
        sender: 'agent',
        timestamp: new Date(),
        confidence: 0.88,
        automated: true,
        suggestedActions: isAdmin
          ? ['Approve Schedule', 'View Technician Details', 'Cost Analysis', 'Fleet Status']
          : ['Confirm Service', 'Choose Different Time', 'Call Technician'],
        channel: 'web'
      };
    }

    if (lowerInput.includes('conflict') || lowerInput.includes('double') || lowerInput.includes('overlap')) {
      return {
        id: Date.now().toString(),
        content: "🚨 Booking Conflict Detected & Auto-Resolved:\n\n❌ Original: Honda Civic booked for overlapping times\n✅ Solution: Upgraded customer to Toyota RAV4 (same price)\n📞 Customer notified via WhatsApp - confirmed in 2 minutes\n💰 Revenue preserved: $54\n📈 Customer satisfaction: Increased (free upgrade)\n\nConflict resolution time: 4 minutes (vs 45 minutes manual)",
        sender: 'agent',
        timestamp: new Date(),
        confidence: 0.92,
        automated: true,
        suggestedActions: ['View Resolution Details', 'Customer Communication Log', 'Similar Cases'],
        channel: 'web'
      };
    }

    if (lowerInput.includes('cost') || lowerInput.includes('save') || lowerInput.includes('efficiency')) {
      return {
        id: Date.now().toString(),
        content: "💰 AI Cost Savings Report (This Week):\n\n🤖 Automation Rate: 87% (156 of 179 tasks)\n⏱️ Time Saved: 23.5 hours of manual work\n💵 Cost Reduction: $2,340/week\n📞 Call Volume: -45% (AI handled via WhatsApp/SMS)\n🔧 Maintenance Optimization: $890 saved\n📈 Revenue Increase: +12% through better utilization\n\nTotal ROI: 340% vs traditional manual operations",
        sender: 'agent',
        timestamp: new Date(),
        confidence: 0.98,
        automated: true,
        suggestedActions: ['Detailed Report', 'Expand Automation', 'ROI Analysis'],
        channel: 'web'
      };
    }
    
    return {
      id: Date.now().toString(),
      content: isAdmin
        ? "I'm analyzing your request with our fleet management AI. For complex queries, I can connect you with our specialist team or handle this automatically if you provide more details."
        : "I understand you need help with that. Let me connect you with our specialist team, or I can try to assist automatically if you provide more specific details about your needs.",
      sender: 'agent',
      timestamp: new Date(),
      confidence: 0.65,
      suggestedActions: ['Speak to Specialist', 'Try AI Auto-Resolution', 'Call Support'],
      channel: 'web'
    };
  };

  const handleSuggestedAction = (action: string) => {
    setInput(action);
  };

  const getChannelIcon = (channel?: string) => {
    switch (channel) {
      case 'whatsapp':
        return <MessageSquare className="w-3 h-3 text-green-500" />;
      case 'sms':
        return <Smartphone className="w-3 h-3 text-blue-500" />;
      case 'phone':
        return <Phone className="w-3 h-3 text-orange-500" />;
      default:
        return <MessageCircle className="w-3 h-3 text-primary" />;
    }
  };

  if (minimized) {
    return (
      <div className={`fixed bottom-4 right-4 z-50 ${className}`}>
        <Button
          onClick={onToggleMinimize}
          className="h-14 w-14 rounded-full shadow-lg"
          size="lg"
        >
          <Bot className="w-6 h-6" />
        </Button>
        {messages.length > 1 && (
          <Badge className="absolute -top-2 -left-2 bg-destructive text-destructive-foreground">
            {messages.length - 1}
          </Badge>
        )}
        {isAdmin && (
          <div className="absolute -top-10 right-0 bg-accent text-accent-foreground px-2 py-1 rounded text-xs">
            AI Active: 87%
          </div>
        )}
      </div>
    );
  }

  return (
    <Card className={`w-full max-w-md mx-auto h-96 flex flex-col ${className}`}>
      <CardHeader className="flex-shrink-0 pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Avatar className="h-8 w-8">
              <AvatarFallback className="bg-primary text-primary-foreground">
                <Bot className="w-4 h-4" />
              </AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-base">
                {isAdmin ? 'Fleet AI Console' : 'Valt Fleet AI Assistant'}
              </CardTitle>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span>Active across all channels</span>
                </div>
              </div>
            </div>
          </div>
          <div className="flex gap-1">
            <Button variant="ghost" size="sm" onClick={onEscalate}>
              <Phone className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={onToggleMinimize}>
              <Minimize2 className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Multi-channel indicators */}
        <div className="flex gap-2 mt-2">
          <Badge variant="secondary" className="text-xs">
            <MessageSquare className="w-3 h-3 mr-1" />
            WhatsApp
          </Badge>
          <Badge variant="secondary" className="text-xs">
            <Smartphone className="w-3 h-3 mr-1" />
            SMS
          </Badge>
          <Badge variant="secondary" className="text-xs">
            <Phone className="w-3 h-3 mr-1" />
            Voice
          </Badge>
          <Badge variant="secondary" className="text-xs">
            <MessageCircle className="w-3 h-3 mr-1" />
            Web
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col p-0">
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <div key={message.id} className="space-y-2">
              <div className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`max-w-[85%] p-3 rounded-lg ${
                    message.sender === 'user'
                      ? 'bg-primary text-primary-foreground'
                      : message.sender === 'agent'
                      ? 'bg-muted'
                      : 'bg-accent/10 text-accent-foreground border border-accent/20'
                  }`}
                >
                  <div className="flex items-start gap-2 mb-1">
                    {message.channel && getChannelIcon(message.channel)}
                    {message.automated && (
                      <Bot className="w-3 h-3 text-accent" />
                    )}
                    <span className="text-xs text-muted-foreground">
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                  {message.confidence && message.confidence < 0.7 && (
                    <div className="flex items-center gap-1 mt-2 text-xs text-orange-600">
                      <AlertTriangle className="w-3 h-3" />
                      {message.confidence < 0.55 ? 'Escalating to human agent' : 'Moderate confidence - verification recommended'}
                    </div>
                  )}
                  {message.automated && (
                    <div className="flex items-center gap-1 mt-2 text-xs text-accent">
                      <CheckCircle className="w-3 h-3" />
                      Auto-processed
                    </div>
                  )}
                </div>
              </div>
              
              {message.suggestedActions && (
                <div className="flex flex-wrap gap-1 justify-start pl-4">
                  {message.suggestedActions.map((action, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      className="text-xs h-6"
                      onClick={() => handleSuggestedAction(action)}
                    >
                      {action}
                    </Button>
                  ))}
                </div>
              )}
            </div>
          ))}
          
          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-muted p-3 rounded-lg">
                <div className="flex gap-1 items-center">
                  <Bot className="w-4 h-4 text-primary" />
                  <div className="flex gap-1 ml-2">
                    <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="border-t p-4">
          <div className="flex gap-2">
            <Input
              placeholder={isAdmin ? "Fleet management command..." : "Ask me anything..."}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              className="flex-1"
            />
            <Button onClick={handleSend} size="sm">
              <Send className="w-4 h-4" />
            </Button>
          </div>
          <p className="text-xs text-muted-foreground mt-2 text-center">
            AI-Powered • Multi-Channel • 87% Automation Rate • 24/7 Available
          </p>
        </div>
      </CardContent>
    </Card>
  );
}