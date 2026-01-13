import valtLogo from '@/assets/valtlogo.png';
import { BarChart3, Bot, Calendar, Car, Clock, MessageCircle, Phone, Settings, Shield, Users, Zap } from 'lucide-react';
import React from 'react';
import { AdminDashboard as AdminOverview } from './components/admin-dashboard';
import { AdminSettings } from './components/admin-settings';
import { SignIn } from './components/auth/sign-in';
import { SignUp } from './components/auth/sign-up';
import { BookingFlow } from './components/booking-flow';
import { BookingWidget } from './components/booking-widget';
import { ConflictResolution } from './components/conflict-resolution';
import { EnhancedHome } from './components/enhanced-home';
import { FleetAnalytics } from './components/fleet-analytics';
import { FleetManagement } from './components/fleet-management';
import { Gallery } from './components/gallery';
import { MaintenanceTracking } from './components/maintenance-tracking';
import { OmniAgentChat } from './components/omni-agent-chat';
import { OmniAgentConsole } from './components/omniagent-console';
import { SchedulerCalendar } from './components/scheduler-calendar';
import { ThemeProvider } from './components/theme-provider';
import { ThemeToggle } from './components/theme-toggle';
import { Badge } from './components/ui/badge';
import { Button } from './components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './components/ui/tabs';
import { Vehicle, VehicleCard } from './components/vehicle-card';
import { VehicleDetails } from './components/vehicle-details';

// Mock data
const sampleVehicles: Vehicle[] = [
  {
    id: '1',
    name: 'Honda Civic',
    type: 'Compact Sedan',
    images: [
      'https://images.unsplash.com/photo-1742997742821-3b9c571b6571?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb21wYWN0JTIwY2FyJTIwcmVudGFsJTIwaG9uZGElMjBjaXZpY3xlbnwxfHx8fDE3NTgzNTU1OTJ8MA&ixlib=rb-4.1.0&q=80&w=1080',
      'https://images.unsplash.com/photo-1684082018938-9c30f2a7045d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzZWRhbiUyMGNhciUyMHJlbnRhbHxlbnwxfHx8fDE3NTgyNjY0ODR8MA&ixlib=rb-4.1.0&q=80&w=1080'
    ],
    pricePerDay: 18,
    status: 'available',
    features: {
      passengers: 5,
      transmission: 'Automatic',
      fuelType: 'Gas',
      mileage: '32 MPG'
    },
    availability: 'Available for pickup today'
  },
  {
    id: '2',
    name: 'Toyota RAV4',
    type: 'Compact SUV',
    images: [
      'https://images.unsplash.com/photo-1751163917838-867d8e2a2983?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdXYlMjByZW50YWwlMjBjYXIlMjB0b3lvdGF8ZW58MXx8fHwxNzU4MzU1NTk1fDA&ixlib=rb-4.1.0&q=80&w=1080'
    ],
    pricePerDay: 28,
    status: 'available',
    features: {
      passengers: 7,
      transmission: 'Automatic',
      fuelType: 'Gas',
      mileage: '28 MPG'
    },
    availability: 'Popular choice - 3 left'
  },
  {
    id: '3',
    name: 'Ford Transit',
    type: 'Van',
    images: [
      'https://images.unsplash.com/photo-1649320101556-54e0011d3f28?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2YW4lMjByZW50YWwlMjBtaW5pdmFufGVufDF8fHx8MTc1ODM1NTU5OXww&ixlib=rb-4.1.0&q=80&w=1080'
    ],
    pricePerDay: 45,
    status: 'limited',
    features: {
      passengers: 8,
      transmission: 'Automatic',
      fuelType: 'Gas',
      mileage: '22 MPG'
    },
    availability: 'Only 1 available'
  },
  {
    id: '4',
    name: 'Nissan Sentra',
    type: 'Compact Sedan',
    images: [
      'https://images.unsplash.com/photo-1684082018938-9c30f2a7045d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzZWRhbiUyMGNhciUyMHJlbnRhbHxlbnwxfHx8fDE3NTgyNjY0ODR8MA&ixlib=rb-4.1.0&q=80&w=1080'
    ],
    pricePerDay: 16,
    status: 'maintenance',
    features: {
      passengers: 5,
      transmission: 'Manual',
      fuelType: 'Gas',
      mileage: '35 MPG'
    },
    availability: 'Back in service Sept 22'
  }
];

function ConsumerLanding({ onLogout, user }: { onLogout: () => void, user: any }) {
  const [chatMinimized, setChatMinimized] = React.useState(true);
  const [currentView, setCurrentView] = React.useState<'home' | 'booking' | 'details' | 'results' | 'gallery'>('home');
  const [selectedVehicle, setSelectedVehicle] = React.useState<Vehicle | null>(null);
  const [completedBookings, setCompletedBookings] = React.useState<any[]>([]);

  const handleSearch = (params: any) => {
    console.log('AI-powered search initiated with params:', params);
    setCurrentView('results');
    // In real app, this would trigger AI search with real-time availability,
    // dynamic pricing, conflict detection, and predictive maintenance integration
  };

  const handleVehicleBook = (vehicleId: string) => {
    const vehicle = sampleVehicles.find(v => v.id === vehicleId);
    if (vehicle) {
      setSelectedVehicle(vehicle);
      setCurrentView('booking');
    }
  };

  const handleVehicleDetails = (vehicleId: string) => {
    const vehicle = sampleVehicles.find(v => v.id === vehicleId);
    if (vehicle) {
      setSelectedVehicle(vehicle);
      setCurrentView('details');
    }
  };

  const handleBackToHome = () => {
    setCurrentView('home');
    setSelectedVehicle(null);
  };

  const handleShowGallery = () => {
    setCurrentView('gallery');
  };

  const handleBookingComplete = (bookingData: any) => {
    setCompletedBookings(prev => [...prev, bookingData]);
    // Show success and return to home after a delay
    setTimeout(() => {
      handleBackToHome();
    }, 2000);
  };

  // Render different views based on current state
  if (currentView === 'booking' && selectedVehicle) {
    return (
      <BookingFlow
        vehicle={selectedVehicle}
        onBack={handleBackToHome}
        onComplete={handleBookingComplete}
      />
    );
  }

  if (currentView === 'details' && selectedVehicle) {
    return (
      <VehicleDetails
        vehicle={selectedVehicle}
        onBack={handleBackToHome}
        onBook={handleVehicleBook}
      />
    );
  }

  if (currentView === 'gallery') {
    return (
      <Gallery
        onBack={handleBackToHome}
        user={user}
        onLogout={onLogout}
      />
    );
  }

  if (currentView === 'results') {
    return (
      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="border-b bg-card sticky top-0 z-40">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img src={(valtLogo as any).src ?? (valtLogo as unknown as string)} alt="Valt Fleet Suite" className="w-8 h-8" />
                <div>
                  <h1 className="text-xl font-bold text-primary">Valt Fleet Suite</h1>
                  <p className="text-sm text-muted-foreground">AI Search Results</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <ThemeToggle />
                <Button variant="outline" onClick={handleBackToHome}>
                  ← Back to Search
                </Button>
                {user && (
                  <div className="flex items-center gap-3">
                    <Badge variant="outline" className="border-primary/20">
                      {user.email}
                    </Badge>
                    <Button variant="outline" size="sm" onClick={onLogout}>
                      Logout
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* AI Search Results */}
        <div className="container mx-auto px-4 py-8">
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-2">
              <Bot className="w-6 h-6 text-accent animate-pulse" />
              <h2 className="text-2xl font-bold">AI-Optimized Search Results</h2>
            </div>
            <p className="text-muted-foreground">
              Found {sampleVehicles.length} vehicles with dynamic pricing, conflict resolution, and maintenance optimization
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {sampleVehicles.map((vehicle) => (
              <VehicleCard
                key={vehicle.id}
                vehicle={vehicle}
                onBook={handleVehicleBook}
                onViewDetails={handleVehicleDetails}
              />
            ))}
          </div>
        </div>

        {/* OmniAgent Chat */}
        <OmniAgentChat
          minimized={chatMinimized}
          onToggleMinimize={() => setChatMinimized(!chatMinimized)}
          onEscalate={() => window.open('tel:+16394714669')}
          className="fixed bottom-4 right-4 z-50"
          isAdmin={false}
        />
      </div>
    );
  }

  // Home view
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img src={(valtLogo as any).src ?? (valtLogo as unknown as string)} alt="Valt Fleet Suite" className="w-8 h-8" />
              <div>
                <h1 className="text-xl font-bold text-primary">Valt Fleet Suite</h1>
                <p className="text-sm text-muted-foreground">AI-Powered Fleet Management • Saskatoon</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <ThemeToggle />
              <Button variant="ghost" onClick={handleShowGallery} className="hidden md:flex items-center gap-2">
                <Car className="w-4 h-4" />
                Gallery
              </Button>
              <div className="hidden md:flex items-center gap-2 text-sm">
                <Phone className="w-4 h-4" />
                <span>(639) 471-4669</span>
              </div>
              <Badge variant="secondary" className="bg-accent text-accent-foreground">
                AI Support 24/7
              </Badge>
              {user && (
                <div className="flex items-center gap-3">
                  <Badge variant="outline" className="border-primary/20">
                    {user.email}
                  </Badge>
                  <Button variant="outline" size="sm" onClick={onLogout}>
                    Logout
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-b from-primary/5 to-background py-12">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-6 mb-8">
            <h2 className="text-4xl font-bold flex items-center gap-3">
              <Bot className="w-10 h-10 text-primary" />
              AI-Powered Fleet Management
            </h2>
            <p className="text-xl text-muted-foreground">Smart booking • Dynamic pricing • Conflict-free scheduling • 24/7 automation</p>
            <div className="flex flex-wrap justify-center gap-4 text-sm">
  <div className="flex items-center gap-2 px-3 py-2 bg-primary/10 rounded-full">
    <Bot className="w-4 h-4 text-primary" />
    <span>87% Automation Rate</span>
  </div>
  <div className="flex items-center gap-2 px-3 py-2 bg-accent/10 rounded-full">
    <Zap className="w-4 h-4 text-accent" />
    <span>Instant AI Pricing</span>
  </div>
  <div className="flex items-center gap-2 px-3 py-2 bg-green-500/20 rounded-full">
    <Shield className="w-4 h-4 text-green-500" />
    <span>Conflict-Free Booking</span>
  </div>
  <div className="flex items-center gap-2 px-3 py-2 bg-blue-500/20 rounded-full">
    <MessageCircle className="w-4 h-4 text-blue-500" />
    <span>Multi-Channel Support</span>
  </div>
</div>
          </div>
          
          <BookingWidget onSearch={handleSearch} />
        </div>
      </section>

      {/* Available Vehicles */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold mb-2">AI-Optimized Fleet</h3>
            <p className="text-muted-foreground">Automatically selected vehicles based on demand, efficiency, and cost optimization</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {sampleVehicles.map((vehicle) => (
              <VehicleCard
                key={vehicle.id}
                vehicle={vehicle}
                onBook={handleVehicleBook}
                onViewDetails={handleVehicleDetails}
              />
            ))}
          </div>
        </div>
      </section>

      {/* AI Benefits */}
      <section className="bg-muted/30 py-12">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold mb-2">Why Choose AI-Powered Fleet Management?</h3>
            <p className="text-muted-foreground">Advanced automation reduces costs and improves efficiency</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <Users className="w-12 h-12 text-primary mx-auto mb-4" />
              <h4 className="font-semibold mb-2">87% Automation Rate</h4>
              <p className="text-muted-foreground text-sm">AI handles bookings, scheduling, and conflicts across WhatsApp, SMS, phone, and web</p>
            </div>
            <div>
              <Shield className="w-12 h-12 text-accent mx-auto mb-4" />
              <h4 className="font-semibold mb-2">$2,340 Weekly Savings</h4>
              <p className="text-muted-foreground text-sm">340% ROI through intelligent automation and predictive maintenance</p>
            </div>
            <div>
              <Clock className="w-12 h-12 text-primary mx-auto mb-4" />
              <h4 className="font-semibold mb-2">Multi-Channel Integration</h4>
              <p className="text-muted-foreground text-sm">Seamless experience across all communication channels with instant AI responses</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-primary text-primary-foreground py-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h5 className="font-semibold mb-4">AI-Powered Contact</h5>
              <div className="space-y-2 text-sm">
                <p>Phone: (639) 471-4669 (AI-assisted)</p>
                <p>WhatsApp: AI chatbot available</p>
                <p>SMS: Text for instant booking</p>
                <p>Web: 24/7 AI support</p>
              </div>
            </div>
            <div>
              <h5 className="font-semibold mb-4">Smart Locations</h5>
              <div className="space-y-2 text-sm">
                <p>Downtown Saskatoon (AI-optimized)</p>
                <p>YXE Airport (Auto-scheduling)</p>
                <p>University Area (Demand-based)</p>
                <p>AI Delivery Optimization</p>
              </div>
            </div>
            <div>
              <h5 className="font-semibold mb-4">AI Advantages</h5>
              <div className="space-y-2 text-sm">
                <p>Instant conflict resolution</p>
                <p>Predictive maintenance</p>
                <p>Dynamic pricing optimization</p>
                <p>Multi-channel automation</p>
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* OmniAgent Chat */}
      <OmniAgentChat
        minimized={chatMinimized}
        onToggleMinimize={() => setChatMinimized(!chatMinimized)}
        onEscalate={() => window.open('tel:+16394714669')}
        className="fixed bottom-4 right-4 z-50"
        isAdmin={false}
      />
    </div>
  );
}

function AdminDashboard({ onLogout, user }: { onLogout: () => void, user: any }) {
  const [adminView, setAdminView] = React.useState<'dashboard' | 'booking' | 'details' | 'settings'>('dashboard');
  const [selectedVehicle, setSelectedVehicle] = React.useState<Vehicle | null>(null);

  const handleAdminVehicleBook = (vehicleId: string) => {
    const vehicle = sampleVehicles.find(v => v.id === vehicleId);
    if (vehicle) {
      setSelectedVehicle(vehicle);
      setAdminView('booking');
    }
  };

  const handleAdminVehicleDetails = (vehicleId: string) => {
    const vehicle = sampleVehicles.find(v => v.id === vehicleId);
    if (vehicle) {
      setSelectedVehicle(vehicle);
      setAdminView('details');
    }
  };

  const handleBackToDashboard = () => {
    setAdminView('dashboard');
    setSelectedVehicle(null);
  };

  const handleOpenSettings = () => {
    setAdminView('settings');
  };

  const handleCloseSettings = () => {
    setAdminView('dashboard');
  };

  const handleAdminBookingComplete = (bookingData: any) => {
    // Handle admin booking completion
    console.log('Admin booking completed:', bookingData);
    setTimeout(() => {
      handleBackToDashboard();
    }, 2000);
  };

  // Render different admin views
  if (adminView === 'settings') {
    return (
      <AdminSettings
        onClose={handleCloseSettings}
        user={user}
      />
    );
  }

  if (adminView === 'booking' && selectedVehicle) {
    return (
      <BookingFlow
        vehicle={selectedVehicle}
        onBack={handleBackToDashboard}
        onComplete={handleAdminBookingComplete}
      />
    );
  }

  if (adminView === 'details' && selectedVehicle) {
    return (
      <VehicleDetails
        vehicle={selectedVehicle}
        onBack={handleBackToDashboard}
        onBook={handleAdminVehicleBook}
      />
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Admin Header */}
      <header className="border-b bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img src={(valtLogo as any).src ?? (valtLogo as unknown as string)} alt="Valt Fleet Suite" className="w-8 h-8" />
              <div>
                <h1 className="text-xl font-bold">Valt Fleet Suite Admin</h1>
                <p className="text-sm opacity-90">AI-Powered Fleet Management Dashboard</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <ThemeToggle />
              {user && (
                <Badge variant="secondary" className="bg-white/20 text-primary-foreground">
                  {user.email}
                </Badge>
              )}
              <Badge variant="secondary" className="bg-white/20 text-primary-foreground">Fleet Manager</Badge>
              <Button variant="secondary" size="sm" onClick={handleOpenSettings}>
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </Button>
              <Button variant="secondary" size="sm" onClick={onLogout}>
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Admin Navigation */}
      <nav className="border-b bg-card">
        <div className="container mx-auto px-4">
          <Tabs defaultValue="dashboard" className="w-full">
            <TabsList className="grid w-full grid-cols-7 bg-muted">
              <TabsTrigger value="dashboard" className="flex items-center gap-2">
                <BarChart3 className="w-4 h-4" />
                Dashboard
              </TabsTrigger>
              <TabsTrigger value="fleet" className="flex items-center gap-2">
                <Car className="w-4 h-4" />
                Fleet
              </TabsTrigger>
              <TabsTrigger value="scheduler" className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Scheduler
              </TabsTrigger>
              <TabsTrigger value="maintenance" className="flex items-center gap-2">
                <Settings className="w-4 h-4" />
                Maintenance
              </TabsTrigger>
              <TabsTrigger value="omniagent" className="flex items-center gap-2">
                <MessageCircle className="w-4 h-4" />
                OmniAgent
              </TabsTrigger>
              <TabsTrigger value="analytics" className="flex items-center gap-2">
                <BarChart3 className="w-4 h-4" />
                Analytics
              </TabsTrigger>
              <TabsTrigger value="conflicts" className="flex items-center gap-2">
                <Shield className="w-4 h-4" />
                Conflicts
              </TabsTrigger>
            </TabsList>

            <div className="py-6">
              <TabsContent value="dashboard">
                <AdminOverview onLogout={onLogout} user={user} />
              </TabsContent>

              <TabsContent value="fleet">
                <FleetManagement />
              </TabsContent>

              <TabsContent value="scheduler">
                <SchedulerCalendar />
              </TabsContent>

              <TabsContent value="maintenance">
                <MaintenanceTracking />
              </TabsContent>

              <TabsContent value="omniagent">
                <OmniAgentConsole />
              </TabsContent>

              <TabsContent value="analytics">
                <FleetAnalytics />
              </TabsContent>

              <TabsContent value="conflicts">
                <ConflictResolution />
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </nav>
    </div>
  );
}

export default function App() {
  const [appView, setAppView] = React.useState<'home' | 'signin' | 'signup' | 'consumer' | 'admin' | 'gallery'>('home');
  const [user, setUser] = React.useState<{email: string, role: 'consumer' | 'admin'} | null>(null);

  const handleGetStarted = () => {
    setAppView('signup');
  };

  const handleSignIn = () => {
    setAppView('signin');
  };

  const handleShowGallery = () => {
    setAppView('gallery');
  };

  const handleSignUp = (userData: any) => {
    // Simulate user creation and login
    setUser({
      email: userData.email,
      role: 'consumer' // Default to consumer role
    });
    setAppView('consumer');
  };

  const handleSignInSuccess = (email: string, password: string, rememberMe: boolean) => {
    // Simulate login - in real app would validate credentials
    const role = email.includes('admin') || email === 'admin@easyrenta.ca' ? 'admin' : 'consumer';
    setUser({
      email,
      role
    });
    setAppView(role);
  };

  const handleBackToHome = () => {
    setAppView('home');
  };

  const handleSwitchToSignIn = () => {
    setAppView('signin');
  };

  const handleSwitchToSignUp = () => {
    setAppView('signup');
  };

  const handleLogout = () => {
    setUser(null);
    setAppView('home');
  };

  // Render different views based on current state with theme provider
  return (
    <ThemeProvider defaultTheme="light">
      {(() => {
        switch (appView) {
          case 'home':
            return <EnhancedHome onGetStarted={handleGetStarted} onSignIn={handleSignIn} onShowGallery={handleShowGallery} />;
          
          case 'signin':
            return (
              <SignIn 
                onBack={handleBackToHome} 
                onSignUp={handleSwitchToSignUp}
                onSignIn={handleSignInSuccess}
              />
            );
          
          case 'signup':
            return (
              <SignUp 
                onBack={handleBackToHome} 
                onSignIn={handleSwitchToSignIn}
                onSignUp={handleSignUp}
              />
            );
          
          case 'gallery':
            return (
              <Gallery
                onBack={handleBackToHome}
                user={user}
                onLogout={handleLogout}
              />
            );
          
          case 'consumer':
            return <ConsumerLanding onLogout={handleLogout} user={user} />;
          
          case 'admin':
            return <AdminDashboard onLogout={handleLogout} user={user} />;
          
          default:
            return <EnhancedHome onGetStarted={handleGetStarted} onSignIn={handleSignIn} onShowGallery={handleShowGallery} />;
        }
      })()}
    </ThemeProvider>
  );
}