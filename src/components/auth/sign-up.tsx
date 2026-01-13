import valtLogo from '@/assets/valtlogo.png';
import {
    ArrowLeft,
    Bot,
    Building,
    CheckCircle,
    Clock,
    DollarSign,
    Eye,
    EyeOff,
    Lock,
    Mail,
    Phone,
    Shield,
    Sparkles,
    Star,
    User,
    Zap
} from 'lucide-react';
import React from 'react';
import { ThemeToggle } from '../theme-toggle';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Checkbox } from '../ui/checkbox';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Progress } from '../ui/progress';

interface SignUpProps {
  onBack: () => void;
  onSignIn: () => void;
  onSignUp: (userData: SignUpData) => void;
}

interface SignUpData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  company: string;
  phone: string;
  agreeToTerms: boolean;
  subscribeNewsletter: boolean;
}

export function SignUp({ onBack, onSignIn, onSignUp }: SignUpProps) {
  const [step, setStep] = React.useState(1);
  const [formData, setFormData] = React.useState<SignUpData>({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    company: '',
    phone: '',
    agreeToTerms: false,
    subscribeNewsletter: true
  });
  const [showPassword, setShowPassword] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [focusedField, setFocusedField] = React.useState<string | null>(null);
  const [passwordStrength, setPasswordStrength] = React.useState(0);

  const updateField = (field: keyof SignUpData, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    if (field === 'password' && typeof value === 'string') {
      calculatePasswordStrength(value);
    }
  };

  const calculatePasswordStrength = (password: string) => {
    let strength = 0;
    if (password.length >= 8) strength += 25;
    if (/[A-Z]/.test(password)) strength += 25;
    if (/[0-9]/.test(password)) strength += 25;
    if (/[^A-Za-z0-9]/.test(password)) strength += 25;
    setPasswordStrength(strength);
  };

  const getPasswordStrengthColor = () => {
    if (passwordStrength < 50) return 'bg-destructive';
    if (passwordStrength < 75) return 'bg-accent';
    return 'bg-accent';
  };

  const getPasswordStrengthText = () => {
    if (passwordStrength < 25) return 'Very Weak';
    if (passwordStrength < 50) return 'Weak';
    if (passwordStrength < 75) return 'Good';
    return 'Strong';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (step === 1) {
      setStep(2);
      return;
    }

    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    onSignUp(formData);
    setIsLoading(false);
  };

  const isStep1Valid = () => {
    return formData.firstName && formData.lastName && formData.email && formData.company;
  };

  const isStep2Valid = () => {
    return formData.password && formData.phone && formData.agreeToTerms && passwordStrength >= 50;
  };

  const benefits = [
    {
      icon: <Bot className="w-6 h-6 text-primary" />,
      title: "87% Automation",
      description: "AI handles bookings across all channels"
    },
    {
      icon: <DollarSign className="w-6 h-6 text-accent" />,
      title: "$2,340 Weekly Savings",
      description: "340% ROI through smart automation"
    },
    {
      icon: <Zap className="w-6 h-6 text-secondary" />,
      title: "24/7 AI Support",
      description: "Never miss a booking opportunity"
    },
    {
      icon: <Shield className="w-6 h-6 text-primary" />,
      title: "Predictive Analytics",
      description: "Maintenance & demand forecasting"
    }
  ];

  const testimonial = {
    text: "Valt Fleet Suite transformed our fleet operations. 87% automation saved us 15 hours weekly!",
    author: "Sarah Chen",
    role: "Fleet Manager, Urban Mobility",
    avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b890?w=100&h=100&fit=crop&crop=face"
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Left Side - Dark Theme Branding & Benefits */}
      <div className="hidden lg:flex lg:w-2/5 bg-gradient-to-br from-primary/10 via-card to-secondary/10 p-8 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-30 dark:opacity-20">
          <div className="absolute top-1/3 left-1/3 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/3 right-1/3 w-64 h-64 bg-accent/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
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
                    <p className="text-muted-foreground">AI Fleet Management</p>
                  </div>
                </div>

                <h2 className="text-4xl font-bold leading-tight text-foreground">
                  Join the
                  <br />
                  <span className="text-accent">AI Fleet Revolution</span>
                </h2>

                <p className="text-lg text-muted-foreground">
                  Start your free 30-day trial and experience the future of fleet management. 
                  No setup fees, no commitments.
                </p>
              </div>
            </div>

            {/* Benefits Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {benefits.map((benefit, index) => (
                <Card 
                  key={index} 
                  className="border border-border hover:border-primary/30 transition-all duration-300 hover:shadow-lg group bg-card/50"
                >
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 p-2 rounded-lg bg-background border border-border group-hover:scale-110 transition-transform">
                        {benefit.icon}
                      </div>
                      <div>
                        <h4 className="font-semibold text-sm mb-1 text-foreground">{benefit.title}</h4>
                        <p className="text-xs text-muted-foreground">{benefit.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Testimonial */}
            <Card className="bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/20">
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-3">
                  {[1,2,3,4,5].map((star) => (
                    <Star key={star} className="w-4 h-4 text-accent fill-accent" />
                  ))}
                </div>
                <p className="italic text-sm mb-4 text-foreground">"{testimonial.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                    <User className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-sm text-foreground">{testimonial.author}</p>
                    <p className="text-xs text-muted-foreground">{testimonial.role}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">500+</div>
                <div className="text-xs text-muted-foreground">Active Fleets</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-accent">99.9%</div>
                <div className="text-xs text-muted-foreground">Uptime</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-secondary">24/7</div>
                <div className="text-xs text-muted-foreground">AI Support</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Sign Up Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-background">
        <div className="w-full max-w-2xl">
          {/* Theme Toggle */}
          <div className="flex justify-end mb-8">
            <ThemeToggle />
          </div>

          <Card className="shadow-xl border border-border bg-card">
            <CardHeader className="text-center pb-4">
              <div className="flex justify-center mb-4 lg:hidden">
                <div className="flex items-center gap-2">
                  <img src={(valtLogo as any).src ?? (valtLogo as unknown as string)} alt="Valt Fleet Suite" className="w-8 h-8" />
                  <span className="text-xl font-bold text-foreground">Valt Fleet Suite</span>
                </div>
              </div>
              <CardTitle className="text-2xl text-foreground">Create your account</CardTitle>
              <p className="text-muted-foreground">
                Start your free 30-day trial • No credit card required
              </p>
              
              {/* Progress Bar */}
              <div className="mt-6">
                <div className="flex items-center justify-between text-sm text-muted-foreground mb-2">
                  <span>Step {step} of 2</span>
                  <span>{step === 1 ? 'Company Info' : 'Account Setup'}</span>
                </div>
                <Progress value={step * 50} className="h-2" />
              </div>
            </CardHeader>
            
            <CardContent className="space-y-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                {step === 1 ? (
                  <>
                    {/* Step 1: Company Information */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="firstName" className="text-foreground">First Name</Label>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                          <Input
                            id="firstName"
                            value={formData.firstName}
                            onChange={(e) => updateField('firstName', e.target.value)}
                            onFocus={() => setFocusedField('firstName')}
                            onBlur={() => setFocusedField(null)}
                            placeholder="John"
                            className={`pl-10 bg-input-background border-border text-foreground placeholder:text-muted-foreground transition-all duration-300 ${
                              focusedField === 'firstName' ? 'border-primary shadow-lg shadow-primary/20' : ''
                            }`}
                            required
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="lastName" className="text-foreground">Last Name</Label>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                          <Input
                            id="lastName"
                            value={formData.lastName}
                            onChange={(e) => updateField('lastName', e.target.value)}
                            onFocus={() => setFocusedField('lastName')}
                            onBlur={() => setFocusedField(null)}
                            placeholder="Doe"
                            className={`pl-10 bg-input-background border-border text-foreground placeholder:text-muted-foreground transition-all duration-300 ${
                              focusedField === 'lastName' ? 'border-primary shadow-lg shadow-primary/20' : ''
                            }`}
                            required
                          />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-foreground">Work Email</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                          id="email"
                          type="email"
                          value={formData.email}
                          onChange={(e) => updateField('email', e.target.value)}
                          onFocus={() => setFocusedField('email')}
                          onBlur={() => setFocusedField(null)}
                          placeholder="john@company.com"
                          className={`pl-10 bg-input-background border-border text-foreground placeholder:text-muted-foreground transition-all duration-300 ${
                            focusedField === 'email' ? 'border-primary shadow-lg shadow-primary/20' : ''
                          }`}
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="company" className="text-foreground">Company Name</Label>
                      <div className="relative">
                        <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                          id="company"
                          value={formData.company}
                          onChange={(e) => updateField('company', e.target.value)}
                          onFocus={() => setFocusedField('company')}
                          onBlur={() => setFocusedField(null)}
                          placeholder="Your Company Inc."
                          className={`pl-10 bg-input-background border-border text-foreground placeholder:text-muted-foreground transition-all duration-300 ${
                            focusedField === 'company' ? 'border-primary shadow-lg shadow-primary/20' : ''
                          }`}
                          required
                        />
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    {/* Step 2: Account Setup */}
                    <div className="space-y-2">
                      <Label htmlFor="phone" className="text-foreground">Phone Number</Label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                          id="phone"
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => updateField('phone', e.target.value)}
                          onFocus={() => setFocusedField('phone')}
                          onBlur={() => setFocusedField(null)}
                          placeholder="(639) 123-4567"
                          className={`pl-10 bg-input-background border-border text-foreground placeholder:text-muted-foreground transition-all duration-300 ${
                            focusedField === 'phone' ? 'border-primary shadow-lg shadow-primary/20' : ''
                          }`}
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="password" className="text-foreground">Create Password</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                          id="password"
                          type={showPassword ? 'text' : 'password'}
                          value={formData.password}
                          onChange={(e) => updateField('password', e.target.value)}
                          onFocus={() => setFocusedField('password')}
                          onBlur={() => setFocusedField(null)}
                          placeholder="Create a strong password"
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
                      
                      {formData.password && (
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">Password strength</span>
                            <span className={`font-medium ${passwordStrength >= 75 ? 'text-accent' : passwordStrength >= 50 ? 'text-accent' : 'text-destructive'}`}>
                              {getPasswordStrengthText()}
                            </span>
                          </div>
                          <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                            {/* Approximate width without inline styles using width utility classes */}
                            <div
                              className={`h-2 rounded-full transition-[width] duration-300 ${getPasswordStrengthColor()} ${
                                passwordStrength >= 100 ? 'w-full' :
                                passwordStrength >= 75 ? 'w-3/4' :
                                passwordStrength >= 50 ? 'w-1/2' :
                                passwordStrength >= 25 ? 'w-1/4' : 'w-[10%]'
                              }`}
                            />
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-start space-x-2">
                        <Checkbox
                          id="terms"
                          checked={formData.agreeToTerms}
                          onCheckedChange={(checked: boolean | 'indeterminate') => updateField('agreeToTerms', Boolean(checked))}
                          required
                        />
                        <Label htmlFor="terms" className="text-sm leading-relaxed text-foreground">
                          I agree to the{' '}
                          <Button variant="link" className="p-0 h-auto text-primary">
                            Terms of Service
                          </Button>{' '}
                          and{' '}
                          <Button variant="link" className="p-0 h-auto text-primary">
                            Privacy Policy
                          </Button>
                        </Label>
                      </div>

                      <div className="flex items-start space-x-2">
                        <Checkbox
                          id="newsletter"
                          checked={formData.subscribeNewsletter}
                          onCheckedChange={(checked: boolean | 'indeterminate') => updateField('subscribeNewsletter', Boolean(checked))}
                        />
                        <Label htmlFor="newsletter" className="text-sm text-foreground">
                          Send me product updates and AI fleet management insights
                        </Label>
                      </div>
                    </div>
                  </>
                )}

                <div className="flex gap-3">
                  {step === 2 && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setStep(1)}
                      className="flex-1 border-border text-foreground"
                    >
                      Back
                    </Button>
                  )}
                  
                  <Button
                    type="submit"
                    disabled={(step === 1 && !isStep1Valid()) || (step === 2 && (!isStep2Valid() || isLoading))}
                    className="flex-1 bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 shadow-lg transform hover:scale-[1.02] transition-all duration-300"
                    size="lg"
                  >
                    {isLoading ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        Creating Account...
                      </div>
                    ) : step === 1 ? (
                      'Continue'
                    ) : (
                      'Start Free Trial'
                    )}
                  </Button>
                </div>
              </form>

              {step === 1 && (
                <>
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <span className="w-full border-t border-border"></span>
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-card px-2 text-muted-foreground">What you get</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-accent" />
                      <span className="text-foreground">30-day free trial</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-accent" />
                      <span className="text-foreground">AI automation setup</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-accent" />
                      <span className="text-foreground">Multi-channel support</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-accent" />
                      <span className="text-foreground">24/7 AI assistance</span>
                    </div>
                  </div>
                </>
              )}

              <div className="text-center space-y-3">
                <p className="text-sm text-muted-foreground">
                  Already have an account?{' '}
                  <Button
                    variant="link"
                    onClick={onSignIn}
                    className="p-0 h-auto font-medium text-primary hover:text-primary/80"
                  >
                    Sign in here
                  </Button>
                </p>
                
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
                  onClick={() => onSignUp({
                    firstName: 'Fleet',
                    lastName: 'Manager',
                    email: 'admin@easyrenta.ca',
                    password: 'admin123',
                    company: 'Easy Rent Auto',
                    phone: '(639) 471-4669',
                    agreeToTerms: true,
                    subscribeNewsletter: false
                  })}
                >
                  <Shield className="w-4 h-4 mr-2" />
                  Fleet Manager Dashboard
                </Button>
              </div>

              {/* Security & Trust */}
              <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground border-t border-border pt-4">
                <div className="flex items-center gap-1">
                  <Shield className="w-3 h-3" />
                  <span>Enterprise Security</span>
                </div>
                <div className="flex items-center gap-1">
                  <CheckCircle className="w-3 h-3" />
                  <span>SOC 2 Compliant</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  <span>99.9% Uptime</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}