import valtLogo from '@/assets/valtlogo.png';
import {
    ArrowLeft,
    Bot,
    Eye,
    EyeOff,
    Globe,
    Lock,
    Mail,
    MessageSquare,
    Shield,
    Smartphone,
    Sparkles,
    Zap
} from 'lucide-react';
import React from 'react';
import { ThemeToggle } from '../theme-toggle';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Checkbox } from '../ui/checkbox';
import { Input } from '../ui/input';
import { Label } from '../ui/label';

interface SignInProps {
  onBack: () => void;
  onSignUp: () => void;
  onSignIn: (email: string, password: string, rememberMe: boolean) => void;
}

export function SignIn({ onBack, onSignUp, onSignIn }: SignInProps) {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [rememberMe, setRememberMe] = React.useState(false);
  const [showPassword, setShowPassword] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [focusedField, setFocusedField] = React.useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    onSignIn(email, password, rememberMe);
    setIsLoading(false);
  };

  const aiFeatures = [
    {
      icon: <Bot className="w-5 h-5 text-primary" />,
      title: "AI Fleet Management",
      description: "87% automation across all channels"
    },
    {
      icon: <Zap className="w-5 h-5 text-accent" />,
      title: "Instant Booking",
      description: "Real-time conflict resolution"
    },
    {
      icon: <Shield className="w-5 h-5 text-secondary" />,
      title: "Predictive Analytics",
      description: "Maintenance & demand forecasting"
    }
  ];

  return (
    <div className="min-h-screen bg-background flex">
      {/* Left Side - Dark Theme Branding & Features */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary/10 via-card to-secondary/10 p-8 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-30 dark:opacity-20">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-accent/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-secondary/20 rounded-full blur-2xl animate-bounce"></div>
        </div>

        <div className="relative z-10 flex flex-col justify-between w-full">
          <div className="space-y-8">
            <div className="space-y-6">
              <Button 
                variant="ghost" 
                onClick={onBack}
                className="hover:bg-primary/10 group text-foreground"
              >
                <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                Back to Home
              </Button>

              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <img src={(valtLogo as any).src ?? (valtLogo as unknown as string)} alt="Valt Fleet Suite" className="w-12 h-12" />
                    <div className="absolute -top-1 -right-1 w-5 h-5 bg-accent rounded-full flex items-center justify-center">
                      <Sparkles className="w-3 h-3 text-accent-foreground" />
                    </div>
                  </div>
                  <div>
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                      Valt Fleet Suite
                    </h1>
                    <p className="text-muted-foreground">AI Fleet Management Portal</p>
                  </div>
                </div>

                <h2 className="text-4xl font-bold leading-tight text-foreground">
                  Welcome back to the
                  <br />
                  <span className="text-accent">future of fleet management</span>
                </h2>

                <p className="text-lg text-muted-foreground">
                  Access your AI-powered dashboard to monitor fleet performance, 
                  review automation metrics, and manage multi-channel operations.
                </p>
              </div>
            </div>

            {/* Features List */}
            <div className="space-y-4">
              {aiFeatures.map((feature, index) => (
                <div 
                  key={index} 
                  className="flex items-start gap-4 p-4 rounded-xl bg-card/50 border border-border hover:shadow-md transition-all duration-300"
                >
                  <div className="flex-shrink-0 p-2 rounded-lg bg-background border border-border">
                    {feature.icon}
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm mb-1 text-foreground">{feature.title}</h4>
                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Live Stats */}
          <Card className="bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/20">
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-2 h-2 bg-accent rounded-full animate-pulse"></div>
                <span className="text-sm font-medium text-foreground">Live AI Metrics</span>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">87%</div>
                  <div className="text-xs text-muted-foreground">Automation</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-accent">$2.3K</div>
                  <div className="text-xs text-muted-foreground">Weekly Savings</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-secondary">24/7</div>
                  <div className="text-xs text-muted-foreground">AI Support</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Right Side - Sign In Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-background">
        <div className="w-full max-w-md">
          {/* Theme Toggle */}
          <div className="flex justify-end mb-8">
            <ThemeToggle />
          </div>

          <Card className="shadow-xl border border-border bg-card">
            <CardHeader className="text-center pb-6">
              <div className="flex justify-center mb-4 lg:hidden">
                <div className="flex items-center gap-2">
                  <img src={(valtLogo as any).src ?? (valtLogo as unknown as string)} alt="Valt Fleet Suite" className="w-8 h-8" />
                  <span className="text-xl font-bold text-foreground">Valt Fleet Suite</span>
                </div>
              </div>
              <CardTitle className="text-2xl text-foreground">Sign in to your account</CardTitle>
              <p className="text-muted-foreground">
                Access your AI-powered fleet management dashboard
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-foreground">Email address</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      onFocus={() => setFocusedField('email')}
                      onBlur={() => setFocusedField(null)}
                      placeholder="Enter your email"
                      className={`pl-10 bg-input-background border-border text-foreground placeholder:text-muted-foreground transition-all duration-300 ${
                        focusedField === 'email' ? 'border-primary shadow-lg shadow-primary/20' : ''
                      }`}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-foreground">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      onFocus={() => setFocusedField('password')}
                      onBlur={() => setFocusedField(null)}
                      placeholder="Enter your password"
                      className={`pl-10 pr-10 bg-input-background border-border text-foreground placeholder:text-muted-foreground transition-all duration-300 ${
                        focusedField === 'password' ? 'border-primary shadow-lg shadow-primary/20' : ''
                      }`}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-primary transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="remember"
                      checked={rememberMe}
                      onCheckedChange={(checked: boolean | 'indeterminate') => setRememberMe(Boolean(checked))}
                    />
                    <Label htmlFor="remember" className="text-sm text-foreground">
                      Remember me
                    </Label>
                  </div>
                  <Button variant="link" className="px-0 text-primary hover:text-primary/80">
                    Forgot password?
                  </Button>
                </div>

                <Button
                  type="submit"
                  disabled={isLoading || !email || !password}
                  className="w-full bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 shadow-lg transform hover:scale-[1.02] transition-all duration-300"
                  size="lg"
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      Signing in...
                    </div>
                  ) : (
                    'Sign In'
                  )}
                </Button>
              </form>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-border"></span>
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-card px-2 text-muted-foreground">Or continue with</span>
                </div>
              </div>

              {/* Alternative Sign In Methods */}
              <div className="grid grid-cols-3 gap-3">
                <Button variant="outline" className="hover:bg-accent/10 hover:border-accent/30 group border-border">
                  <MessageSquare className="w-4 h-4 text-accent group-hover:scale-110 transition-transform" />
                </Button>
                <Button variant="outline" className="hover:bg-primary/10 hover:border-primary/30 group border-border">
                  <Smartphone className="w-4 h-4 text-primary group-hover:scale-110 transition-transform" />
                </Button>
                <Button variant="outline" className="hover:bg-secondary/10 hover:border-secondary/30 group border-border">
                  <Globe className="w-4 h-4 text-secondary group-hover:scale-110 transition-transform" />
                </Button>
              </div>

              {/* Admin Login */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-border"></span>
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-card px-2 text-muted-foreground">Admin Access</span>
                </div>
              </div>

              <Button
                type="button"
                variant="outline"
                className="w-full border-secondary text-secondary hover:bg-secondary/10 hover:border-secondary/50"
                onClick={() => onSignIn('admin@easyrenta.ca', 'admin123', false)}
              >
                <Shield className="w-4 h-4 mr-2" />
                Fleet Manager Login
              </Button>

              <div className="text-center">
                <p className="text-sm text-muted-foreground">
                  Don't have an account?{' '}
                  <Button
                    variant="link"
                    onClick={onSignUp}
                    className="p-0 h-auto font-medium text-primary hover:text-primary/80"
                  >
                    Sign up for free
                  </Button>
                </p>
              </div>

              {/* Security Badge */}
              <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
                <Shield className="w-3 h-3" />
                <span>Protected by enterprise-grade security</span>
              </div>
            </CardContent>
          </Card>

          {/* Mobile Features (visible on mobile only) */}
          <div className="lg:hidden mt-8 space-y-4">
            {aiFeatures.map((feature, index) => (
              <div 
                key={index} 
                className="flex items-center gap-3 p-3 rounded-lg bg-card border border-border"
              >
                {feature.icon}
                <div>
                  <h4 className="font-medium text-sm text-foreground">{feature.title}</h4>
                  <p className="text-xs text-muted-foreground">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}