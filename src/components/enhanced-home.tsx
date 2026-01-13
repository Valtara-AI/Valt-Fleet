import valtLogo from '@/assets/valtlogo.png';
import {
    ArrowRight,
    Bot,
    Calendar,
    Car,
    CheckCircle,
    Clock,
    DollarSign,
    Globe,
    HeadphonesIcon,
    MapPin,
    MessageSquare,
    Phone,
    Play,
    Shield,
    Smartphone,
    Sparkles,
    Star,
    Target,
    TrendingUp,
    Zap
} from 'lucide-react';
import React from 'react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { ThemeToggle } from './theme-toggle';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';

interface EnhancedHomeProps {
  onGetStarted: () => void;
  onSignIn: () => void;
  onShowGallery?: () => void;
}

export function EnhancedHome({ onGetStarted, onSignIn, onShowGallery }: EnhancedHomeProps) {
  const [currentTestimonial, setCurrentTestimonial] = React.useState(0);
  const [aiDemoActive, setAiDemoActive] = React.useState(false);

  const testimonials = [
    {
      name: "Sarah Chen",
      role: "Local Business Owner",
      content: "The AI booking system saved us 15 hours per week. Customers love the instant WhatsApp responses!",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b890?w=100&h=100&fit=crop&crop=face",
      rating: 5
    },
    {
      name: "Mike Rodriguez",
      role: "Fleet Manager",
      content: "87% automation rate exceeded our expectations. ROI was achieved within 2 months.",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face", 
      rating: 5
    },
    {
      name: "Emma Thompson",
      role: "Operations Director",
      content: "Predictive maintenance alerts prevented 3 breakdowns last month. Game-changing technology!",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face",
      rating: 5
    }
  ];

  const features = [
    {
      icon: <Bot className="w-8 h-8 text-primary" />,
      title: "AI OmniAgent",
      description: "87% automation across WhatsApp, SMS, phone & web",
      metric: "87% Automated",
      color: "bg-primary/10 border-primary/20"
    },
    {
      icon: <DollarSign className="w-8 h-8 text-accent" />,
      title: "Cost Savings",
      description: "$2,340 weekly savings through intelligent automation",
      metric: "340% ROI",
      color: "bg-accent/10 border-accent/20"
    },
    {
      icon: <Shield className="w-8 h-8 text-secondary" />,
      title: "Predictive Analytics",
      description: "AI-powered maintenance and demand forecasting",
      metric: "94% Accuracy",
      color: "bg-secondary/10 border-secondary/20"
    },
    {
      icon: <Zap className="w-8 h-8 text-accent" />,
      title: "Real-time Sync",
      description: "Instant conflict resolution across all channels",
      metric: "24/7 Active",
      color: "bg-accent/10 border-accent/20"
    }
  ];

  React.useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [testimonials.length]);

  const startAiDemo = () => {
    setAiDemoActive(true);
    setTimeout(() => setAiDemoActive(false), 3000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5">
      {/* Animated Header */}
      <header className="relative overflow-hidden border-b bg-card/80 backdrop-blur-md sticky top-0 z-50">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-transparent to-accent/10 animate-pulse opacity-30"></div>
        <div className="container mx-auto px-4 py-4 relative">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="relative">
                <img src={(valtLogo as any).src ?? (valtLogo as unknown as string)} alt="Valt Fleet Suite" className="w-10 h-10 animate-pulse" />
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-accent rounded-full animate-bounce"></div>
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  Valt Fleet Suite
                </h1>
                <p className="text-sm text-muted-foreground">AI Fleet Management • Saskatoon</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <ThemeToggle />
              {onShowGallery && (
                <Button variant="ghost" onClick={onShowGallery} className="hidden md:flex items-center gap-2">
                  <Car className="w-4 h-4" />
                  Gallery
                </Button>
              )}
              <div className="hidden md:flex items-center gap-2 text-sm">
                <Phone className="w-4 h-4 text-accent" />
                <span>(639) 471-4669</span>
              </div>
              <Button variant="outline" onClick={onSignIn} className="hover:bg-primary/10">
                Sign In
              </Button>
              <Button 
                onClick={onGetStarted} 
                className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 shadow-lg"
              >
                Get Started
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-transparent to-accent/20 animate-pulse opacity-20"></div>
        <div className="container mx-auto px-4 relative">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-8">
                <div className="space-y-4">
                  <Badge className="bg-primary/10 text-primary border-primary/20 animate-pulse">
                    <Sparkles className="w-3 h-3 mr-1" />
                    AI-Powered Innovation
                  </Badge>
                  <h2 className="text-5xl font-bold leading-tight">
                    <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent animate-gradient">
                      Revolutionize
                    </span>
                    <br />
                    Fleet Management
                  </h2>
                  <p className="text-xl text-muted-foreground leading-relaxed">
                    Experience the future with our AI OmniAgent that automates 87% of operations across 
                    WhatsApp, SMS, phone, and web channels. Save $2,340 weekly while delivering 
                    exceptional customer experiences.
                  </p>
                </div>

                <div className="flex flex-wrap gap-4">
                  <Button 
                    size="lg" 
                    onClick={onGetStarted}
                    className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 shadow-xl transform hover:scale-105 transition-all duration-300"
                  >
                    Start Free Trial
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                  <Button 
                    size="lg" 
                    variant="outline" 
                    onClick={startAiDemo}
                    className="border-2 hover:bg-primary/5 group"
                  >
                    <Play className="w-4 h-4 mr-2 group-hover:animate-pulse" />
                    Watch AI Demo
                  </Button>
                </div>

                <div className="flex items-center gap-8 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-accent rounded-full animate-pulse"></div>
                    <span>No setup fees</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-accent rounded-full animate-pulse"></div>
                    <span>Cancel anytime</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-accent rounded-full animate-pulse"></div>
                    <span>24/7 AI support</span>
                  </div>
                </div>
              </div>

              <div className="relative">
                <div className="relative bg-gradient-to-br from-primary/10 to-accent/10 p-8 rounded-3xl border border-primary/20 backdrop-blur-sm">
                  {/* AI Demo Interface */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Badge className="bg-accent text-accent-foreground">
                        <Bot className="w-3 h-3 mr-1" />
                        AI OmniAgent Live
                      </Badge>
                      <div className="flex gap-2">
                        <div className="w-3 h-3 bg-accent rounded-full animate-pulse"></div>
                        <div className="w-3 h-3 bg-yellow-500 rounded-full animate-pulse delay-150"></div>
                        <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse delay-300"></div>
                      </div>
                    </div>

                    <Card className={`transition-all duration-500 ${aiDemoActive ? 'shadow-xl border-accent' : ''}`}>
                      <CardContent className="p-4 space-y-3">
                        <div className="flex items-start gap-3">
                          <MessageSquare className="w-5 h-5 text-green-600 mt-1" />
                          <div className="flex-1">
                            <p className="text-sm font-medium">WhatsApp Customer</p>
                            <p className="text-sm text-muted-foreground">"Need a car for tomorrow 9am"</p>
                          </div>
                          <span className="text-xs text-muted-foreground">Now</span>
                        </div>
                        
                        <div className={`flex items-start gap-3 transition-all duration-300 ${aiDemoActive ? 'bg-primary/5 -mx-2 px-2 py-2 rounded-lg' : ''}`}>
                          <Bot className="w-5 h-5 text-primary mt-1" />
                          <div className="flex-1">
                            <p className="text-sm font-medium">AI Agent</p>
                            <p className="text-sm text-muted-foreground">
                              "Perfect! I found 3 available vehicles. Honda Civic $18/day, Toyota RAV4 $28/day..."
                            </p>
                          </div>
                          <CheckCircle className="w-4 h-4 text-accent" />
                        </div>

                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Clock className="w-3 h-3" />
                          <span>Auto-resolved in 0.8s</span>
                          <Badge variant="secondary" className="bg-accent/10 text-accent">
                            +$54 revenue
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>

                    <div className="grid grid-cols-3 gap-3">
                      {[
                        { icon: <Smartphone className="w-4 h-4" />, label: "SMS", count: "23", color: "text-blue-600" },
                        { icon: <Phone className="w-4 h-4" />, label: "Calls", count: "12", color: "text-orange-600" },
                        { icon: <Globe className="w-4 h-4" />, label: "Web", count: "45", color: "text-primary" }
                      ].map((channel, index) => (
                        <div key={index} className="text-center p-3 rounded-lg border border-muted">
                          <div className={`${channel.color} mb-1`}>{channel.icon}</div>
                          <div className="text-sm font-medium">{channel.count}</div>
                          <div className="text-xs text-muted-foreground">{channel.label}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Floating elements */}
                <div className="absolute -top-4 -right-4 w-20 h-20 bg-accent/20 rounded-full animate-pulse"></div>
                <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-primary/20 rounded-full animate-bounce"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 bg-card/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge className="bg-primary/10 text-primary border-primary/20 mb-4">
              <Target className="w-3 h-3 mr-1" />
              Core Features
            </Badge>
            <h3 className="text-4xl font-bold mb-4">
              AI-Powered Fleet <span className="text-accent">Excellence</span>
            </h3>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Advanced automation and intelligence working 24/7 to optimize your fleet operations
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card 
                key={index} 
                className={`${feature.color} hover:shadow-xl transition-all duration-300 transform hover:scale-105 border-2`}
              >
                <CardContent className="p-6 text-center space-y-4">
                  <div className="flex justify-center">{feature.icon}</div>
                  <div>
                    <h4 className="font-bold text-lg mb-2">{feature.title}</h4>
                    <p className="text-sm text-muted-foreground mb-3">{feature.description}</p>
                    <Badge className="bg-background/80 text-primary border border-primary/20">
                      {feature.metric}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-gradient-to-r from-primary to-accent text-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            {[
              { value: "87%", label: "Automation Rate", icon: <Bot className="w-6 h-6" /> },
              { value: "$2,340", label: "Weekly Savings", icon: <DollarSign className="w-6 h-6" /> },
              { value: "340%", label: "ROI Achieved", icon: <TrendingUp className="w-6 h-6" /> },
              { value: "24/7", label: "AI Support", icon: <HeadphonesIcon className="w-6 h-6" /> }
            ].map((stat, index) => (
              <div key={index} className="space-y-3">
                <div className="flex justify-center text-white/80">{stat.icon}</div>
                <div className="text-4xl font-bold">{stat.value}</div>
                <div className="text-white/80">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-card/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge className="bg-accent/10 text-accent border-accent/20 mb-4">
              <Star className="w-3 h-3 mr-1" />
              Customer Success
            </Badge>
            <h3 className="text-4xl font-bold mb-4">Trusted by Fleet Managers</h3>
            <p className="text-xl text-muted-foreground">See how AI automation transformed their operations</p>
          </div>

          <div className="max-w-4xl mx-auto">
            <Card className="border-2 border-accent/20 shadow-xl">
              <CardContent className="p-8">
                <div className="flex items-start gap-6">
                  <div className="w-16 h-16 rounded-full overflow-hidden border-4 border-accent/20">
                    <ImageWithFallback
                      src={testimonials[currentTestimonial].avatar}
                      alt={testimonials[currentTestimonial].name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-3">
                      {[...Array(testimonials[currentTestimonial].rating)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 text-yellow-500 fill-current" />
                      ))}
                    </div>
                    <p className="text-lg mb-4 italic">"{testimonials[currentTestimonial].content}"</p>
                    <div>
                      <p className="font-medium">{testimonials[currentTestimonial].name}</p>
                      <p className="text-sm text-muted-foreground">{testimonials[currentTestimonial].role}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-center gap-2 mt-6">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentTestimonial(index)}
                  aria-label={`Go to testimonial ${index + 1}`}
                  title={`Go to testimonial ${index + 1}`}
                  className={`w-3 h-3 rounded-full transition-colors ${
                    index === currentTestimonial ? 'bg-accent' : 'bg-muted'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-primary/10 to-accent/10">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-4xl mx-auto space-y-8">
            <Badge className="bg-primary/10 text-primary border-primary/20">
              <Zap className="w-3 h-3 mr-1" />
              Ready to Transform?
            </Badge>
            <h3 className="text-5xl font-bold">
              Start Your AI Fleet Revolution
            </h3>
            <p className="text-xl text-muted-foreground">
              Join forward-thinking fleet managers who've reduced costs by 340% while improving customer satisfaction
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                onClick={onGetStarted}
                className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 shadow-xl transform hover:scale-105 transition-all duration-300"
              >
                Start Free 30-Day Trial
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              <Button size="lg" variant="outline" className="border-2 hover:bg-primary/5">
                Schedule Demo
                <Calendar className="w-5 h-5 ml-2" />
              </Button>
            </div>

            <div className="flex flex-wrap justify-center gap-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-accent" />
                <span>No credit card required</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-accent" />
                <span>Setup in 24 hours</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-accent" />
                <span>Cancel anytime</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-background border-t py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <img src={(valtLogo as any).src ?? (valtLogo as unknown as string)} alt="Valt Fleet Suite" className="w-8 h-8" />
                <span className="text-xl font-bold">Valt Fleet Suite</span>
              </div>
              <p className="text-muted-foreground">
                AI-powered fleet management solution revolutionizing the car rental industry in Saskatoon.
              </p>
              <div className="flex items-center gap-2 text-sm">
                <MapPin className="w-4 h-4 text-accent" />
                <span>Saskatoon, Saskatchewan</span>
              </div>
            </div>

            <div>
              <h5 className="font-semibold mb-4">AI Features</h5>
              <div className="space-y-2 text-sm text-muted-foreground">
                <p>Multi-channel automation</p>
                <p>Predictive maintenance</p>
                <p>Dynamic pricing</p>
                <p>Conflict resolution</p>
              </div>
            </div>

            <div>
              <h5 className="font-semibold mb-4">Contact</h5>
              <div className="space-y-2 text-sm text-muted-foreground">
                <p>Phone: (639) 471-4669</p>
                <p>WhatsApp: AI Available</p>
                <p>SMS: Text for booking</p>
                <p>Email: AI responses</p>
              </div>
            </div>

            <div>
              <h5 className="font-semibold mb-4">Company</h5>
              <div className="space-y-2 text-sm text-muted-foreground">
                <p>About Us</p>
                <p>AI Technology</p>
                <p>Fleet Solutions</p>
                <p>Support Center</p>
              </div>
            </div>
          </div>

          <div className="border-t mt-12 pt-8 text-center text-sm text-muted-foreground">
            <p>&copy; 2024 Valt Fleet Suite. All rights reserved. Powered by AI.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}