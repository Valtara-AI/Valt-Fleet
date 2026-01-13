import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { ScrollArea } from './ui/scroll-area';
import { 
  MessageCircle,
  Phone,
  MessageSquare,
  Smartphone,
  Globe,
  Bot,
  User,
  AlertTriangle,
  CheckCircle,
  Clock,
  Send,
  Eye,
  Settings,
  TrendingUp,
  Activity,
  Users,
  Zap
} from 'lucide-react';

interface Conversation {
  id: string;
  customerName: string;
  channel: 'web' | 'whatsapp' | 'sms' | 'phone';
  status: 'active' | 'resolved' | 'escalated' | 'waiting';
  priority: 'low' | 'medium' | 'high';
  startTime: Date;
  lastActivity: Date;
  messages: Message[];
  aiHandled: boolean;
  sentiment: 'positive' | 'neutral' | 'negative';
}

interface Message {
  id: string;
  sender: 'customer' | 'ai' | 'human';
  content: string;
  timestamp: Date;
  type: 'text' | 'booking' | 'payment' | 'escalation';
}

export function OmniAgentConsole() {
  const [selectedConversation, setSelectedConversation] = React.useState<string | null>(null);
  const [messageInput, setMessageInput] = React.useState('');
  const [filterChannel, setFilterChannel] = React.useState('all');
  const [filterStatus, setFilterStatus] = React.useState('all');

  // Mock data - in real app would come from API
  const conversations: Conversation[] = [
    {
      id: '1',
      customerName: 'Sarah Johnson',
      channel: 'web',
      status: 'active',
      priority: 'medium',
      startTime: new Date(Date.now() - 1000 * 60 * 15),
      lastActivity: new Date(Date.now() - 1000 * 60 * 2),
      aiHandled: true,
      sentiment: 'positive',
      messages: [
        {
          id: '1',
          sender: 'customer',
          content: 'Hi, I need to rent a car for this weekend',
          timestamp: new Date(Date.now() - 1000 * 60 * 15),
          type: 'text'
        },
        {
          id: '2',
          sender: 'ai',
          content: 'Hello Sarah! I\'d be happy to help you find the perfect car for your weekend trip. What dates do you need the vehicle?',
          timestamp: new Date(Date.now() - 1000 * 60 * 14),
          type: 'text'
        },
        {
          id: '3',
          sender: 'customer',
          content: 'Saturday to Sunday, pickup around 9 AM',
          timestamp: new Date(Date.now() - 1000 * 60 * 13),
          type: 'text'
        },
        {
          id: '4',
          sender: 'ai',
          content: 'Perfect! I found 3 available vehicles for September 23-24. Would you prefer a compact car ($45/day), SUV ($65/day), or van ($85/day)?',
          timestamp: new Date(Date.now() - 1000 * 60 * 2),
          type: 'booking'
        }
      ]
    },
    {
      id: '2',
      customerName: 'Mike Wilson',
      channel: 'whatsapp',
      status: 'escalated',
      priority: 'high',
      startTime: new Date(Date.now() - 1000 * 60 * 30),
      lastActivity: new Date(Date.now() - 1000 * 60 * 5),
      aiHandled: false,
      sentiment: 'negative',
      messages: [
        {
          id: '5',
          sender: 'customer',
          content: 'My booking was cancelled and I need a car urgently!',
          timestamp: new Date(Date.now() - 1000 * 60 * 30),
          type: 'text'
        },
        {
          id: '6',
          sender: 'ai',
          content: 'I sincerely apologize for the inconvenience. Let me check your booking details and find you an immediate replacement.',
          timestamp: new Date(Date.now() - 1000 * 60 * 29),
          type: 'text'
        },
        {
          id: '7',
          sender: 'customer',
          content: 'This is unacceptable! I have a business meeting in 2 hours!',
          timestamp: new Date(Date.now() - 1000 * 60 * 25),
          type: 'text'
        },
        {
          id: '8',
          sender: 'ai',
          content: 'I understand this is urgent. I\'m escalating you to our priority support team who will call you within 5 minutes.',
          timestamp: new Date(Date.now() - 1000 * 60 * 5),
          type: 'escalation'
        }
      ]
    },
    {
      id: '3',
      customerName: 'Emma Davis',
      channel: 'phone',
      status: 'resolved',
      priority: 'low',
      startTime: new Date(Date.now() - 1000 * 60 * 60),
      lastActivity: new Date(Date.now() - 1000 * 60 * 10),
      aiHandled: true,
      sentiment: 'positive',
      messages: [
        {
          id: '9',
          sender: 'customer',
          content: 'What are your business hours?',
          timestamp: new Date(Date.now() - 1000 * 60 * 60),
          type: 'text'
        },
        {
          id: '10',
          sender: 'ai',
          content: 'We\'re open 24/7 with AI assistance! For vehicle pickup: 6 AM - 10 PM daily. After hours pickups available by appointment.',
          timestamp: new Date(Date.now() - 1000 * 60 * 59),
          type: 'text'
        },
        {
          id: '11',
          sender: 'customer',
          content: 'Perfect, thank you!',
          timestamp: new Date(Date.now() - 1000 * 60 * 10),
          type: 'text'
        }
      ]
    }
  ];

  const metrics = {
    activeConversations: 24,
    totalToday: 156,
    aiResolutionRate: 87,
    avgResponseTime: 2.3,
    escalationRate: 8,
    customerSatisfaction: 4.6
  };

  const getChannelIcon = (channel: string) => {
    switch (channel) {
      case 'web': return <Globe className="w-4 h-4" />;
      case 'whatsapp': return <MessageSquare className="w-4 h-4 text-green-600" />;
      case 'sms': return <Smartphone className="w-4 h-4 text-blue-600" />;
      case 'phone': return <Phone className="w-4 h-4 text-purple-600" />;
      default: return <MessageCircle className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-primary text-primary-foreground';
      case 'resolved': return 'bg-secondary text-secondary-foreground';
      case 'escalated': return 'bg-destructive text-destructive-foreground';
      case 'waiting': return 'bg-accent text-accent-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-destructive';
      case 'medium': return 'text-accent';
      case 'low': return 'text-secondary';
      default: return 'text-muted-foreground';
    }
  };

  const getSentimentIcon = (sentiment: string) => {
    switch (sentiment) {
      case 'positive': return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'negative': return <AlertTriangle className="w-4 h-4 text-destructive" />;
      default: return <Activity className="w-4 h-4 text-muted-foreground" />;
    }
  };

  const filteredConversations = conversations.filter(conv => {
    const channelMatch = filterChannel === 'all' || conv.channel === filterChannel;
    const statusMatch = filterStatus === 'all' || conv.status === filterStatus;
    return channelMatch && statusMatch;
  });

  const selectedConv = conversations.find(c => c.id === selectedConversation);

  const handleSendMessage = () => {
    if (!messageInput.trim() || !selectedConversation) return;
    
    // In real app, would send message via API
    console.log('Sending message:', messageInput, 'to conversation:', selectedConversation);
    setMessageInput('');
  };

  const handleEscalate = (conversationId: string) => {
    // In real app, would escalate via API
    console.log('Escalating conversation:', conversationId);
  };

  const handleTakeOver = (conversationId: string) => {
    // In real app, would transfer from AI to human via API
    console.log('Taking over conversation:', conversationId);
  };

  return (
    <div className="space-y-6">
      {/* Metrics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Activity className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Active Chats</p>
                <p className="text-lg font-bold">{metrics.activeConversations}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-accent/10 rounded-lg">
                <MessageCircle className="w-5 h-5 text-accent" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Today</p>
                <p className="text-lg font-bold">{metrics.totalToday}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-secondary/10 rounded-lg">
                <Bot className="w-5 h-5 text-secondary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">AI Resolution</p>
                <p className="text-lg font-bold">{metrics.aiResolutionRate}%</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Zap className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Avg Response</p>
                <p className="text-lg font-bold">{metrics.avgResponseTime}s</p>
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
                <p className="text-sm text-muted-foreground">Escalation Rate</p>
                <p className="text-lg font-bold">{metrics.escalationRate}%</p>
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
                <p className="text-lg font-bold">{metrics.customerSatisfaction}/5</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Conversations List */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageCircle className="w-5 h-5" />
              Live Conversations
            </CardTitle>
            <div className="flex gap-2">
              <Select value={filterChannel} onValueChange={setFilterChannel}>
                <SelectTrigger className="w-24">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="web">Web</SelectItem>
                  <SelectItem value="whatsapp">WhatsApp</SelectItem>
                  <SelectItem value="sms">SMS</SelectItem>
                  <SelectItem value="phone">Phone</SelectItem>
                </SelectContent>
              </Select>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-28">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="escalated">Escalated</SelectItem>
                  <SelectItem value="resolved">Resolved</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[500px]">
              <div className="space-y-2">
                {filteredConversations.map((conversation) => (
                  <div
                    key={conversation.id}
                    className={`p-3 border border-border rounded-lg cursor-pointer transition-colors hover:bg-muted/50 ${
                      selectedConversation === conversation.id ? 'bg-primary/10 border-primary/20' : ''
                    }`}
                    onClick={() => setSelectedConversation(conversation.id)}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        {getChannelIcon(conversation.channel)}
                        <span className="font-medium text-sm">{conversation.customerName}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        {getSentimentIcon(conversation.sentiment)}
                        <Badge className={getStatusColor(conversation.status)} size="sm">
                          {conversation.status}
                        </Badge>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground mb-2 line-clamp-2">
                      {conversation.messages[conversation.messages.length - 1]?.content}
                    </p>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>{conversation.aiHandled ? '🤖 AI' : '👤 Human'}</span>
                      <span className={getPriorityColor(conversation.priority)}>
                        {conversation.priority} priority
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Chat Interface */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                {selectedConv ? (
                  <>
                    {getChannelIcon(selectedConv.channel)}
                    <span>{selectedConv.customerName}</span>
                    <Badge className={getStatusColor(selectedConv.status)}>
                      {selectedConv.status}
                    </Badge>
                  </>
                ) : (
                  'Select a conversation'
                )}
              </CardTitle>
              {selectedConv && (
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => handleTakeOver(selectedConv.id)}>
                    <User className="w-4 h-4 mr-2" />
                    Take Over
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => handleEscalate(selectedConv.id)}>
                    <AlertTriangle className="w-4 h-4 mr-2" />
                    Escalate
                  </Button>
                  <Button size="sm" variant="outline">
                    <Eye className="w-4 h-4 mr-2" />
                    Monitor
                  </Button>
                </div>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {selectedConv ? (
              <div className="space-y-4">
                {/* Messages */}
                <ScrollArea className="h-[400px] border border-border rounded-lg p-4">
                  <div className="space-y-4">
                    {selectedConv.messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex gap-3 ${
                          message.sender === 'customer' ? 'justify-start' : 'justify-end'
                        }`}
                      >
                        <div
                          className={`max-w-[70%] p-3 rounded-lg ${
                            message.sender === 'customer'
                              ? 'bg-muted'
                              : message.sender === 'ai'
                              ? 'bg-primary text-primary-foreground'
                              : 'bg-accent text-accent-foreground'
                          }`}
                        >
                          <div className="flex items-center gap-2 mb-1">
                            {message.sender === 'customer' ? (
                              <User className="w-3 h-3" />
                            ) : message.sender === 'ai' ? (
                              <Bot className="w-3 h-3" />
                            ) : (
                              <User className="w-3 h-3" />
                            )}
                            <span className="text-xs font-medium">
                              {message.sender === 'customer' 
                                ? selectedConv.customerName 
                                : message.sender === 'ai' 
                                ? 'AI Assistant' 
                                : 'Support Agent'}
                            </span>
                            <span className="text-xs opacity-70">
                              {message.timestamp.toLocaleTimeString()}
                            </span>
                          </div>
                          <p className="text-sm">{message.content}</p>
                          {message.type !== 'text' && (
                            <Badge size="sm" className="mt-1">
                              {message.type}
                            </Badge>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>

                {/* Message Input */}
                <div className="flex gap-2">
                  <Textarea
                    placeholder="Type your message or AI suggestion..."
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    className="flex-1"
                    rows={2}
                  />
                  <div className="flex flex-col gap-2">
                    <Button onClick={handleSendMessage} disabled={!messageInput.trim()}>
                      <Send className="w-4 h-4" />
                    </Button>
                    <Button variant="outline" size="sm">
                      <Bot className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="h-[500px] flex items-center justify-center text-muted-foreground">
                <div className="text-center">
                  <MessageCircle className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>Select a conversation to view and manage</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}