import {
  AlertTriangle,
  Bell,
  Car,
  Database,
  DollarSign,
  Edit,
  Eye,
  EyeOff,
  Globe,
  Mail,
  MapPin,
  Palette,
  Phone,
  Plus,
  Save,
  Settings,
  Smartphone,
  Trash2,
  User,
  Users,
  Volume2,
  X,
  Zap
} from 'lucide-react';
import React from 'react';
import { ThemeToggle } from './theme-toggle';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Separator } from './ui/separator';
import { Switch } from './ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';

interface AdminSettingsProps {
  onClose: () => void;
  user: any;
}

export function AdminSettings({ onClose, user }: AdminSettingsProps) {
  const [activeTab, setActiveTab] = React.useState('profile');
  const [showApiKeys, setShowApiKeys] = React.useState(false);
  const [unsavedChanges, setUnsavedChanges] = React.useState(false);

  // Profile settings state
  const [profileData, setProfileData] = React.useState({
    firstName: 'Fleet',
    lastName: 'Manager',
    email: user?.email || 'admin@easyrenta.ca',
    phone: '(639) 471-4669',
    position: 'Fleet Operations Manager',
    department: 'Operations',
    avatar: '',
    timezone: 'America/Saskatoon',
    language: 'English'
  });

  // System configuration state
  const [systemConfig, setSystemConfig] = React.useState({
    companyName: 'Easy Rent Auto',
    businessHours: {
      start: '06:00',
      end: '22:00',
      timezone: 'America/Saskatoon'
    },
    locations: [
      { id: '1', name: 'Downtown Saskatoon', address: '123 Main St, Saskatoon, SK', active: true },
      { id: '2', name: 'YXE Airport', address: 'Saskatoon Airport, SK', active: true },
      { id: '3', name: 'University Area', address: '456 University Dr, Saskatoon, SK', active: true }
    ],
    pricing: {
      dynamicPricing: true,
      surgeMultiplier: 1.5,
      discountThreshold: 7,
      currency: 'CAD'
    }
  });

  // Notification settings state
  const [notificationSettings, setNotificationSettings] = React.useState({
    email: {
      bookingAlerts: true,
      maintenanceAlerts: true,
      revenueReports: true,
      systemUpdates: true,
      conflictAlerts: true
    },
    sms: {
      urgentAlerts: true,
      bookingConfirmations: false,
      maintenanceReminders: true
    },
    push: {
      realTimeUpdates: true,
      aiEscalations: true,
      systemDowntime: true
    },
    frequency: {
      dailyReports: true,
      weeklyReports: true,
      monthlyReports: true
    }
  });

  // Fleet preferences state
  const [fleetPreferences, setFleetPreferences] = React.useState({
    autoScheduleMaintenance: true,
    predictiveMaintenanceThreshold: 85,
    conflictResolutionMode: 'auto',
    utilizationTarget: 75,
    maintenanceWindow: 'overnight',
    fuelThreshold: 25,
    mileageThreshold: 5000
  });

  // User management state
  const [users, setUsers] = React.useState([
    {
      id: '1',
      name: 'Fleet Manager',
      email: 'admin@easyrenta.ca',
      role: 'Administrator',
      status: 'Active',
      lastLogin: '2024-09-23',
      permissions: ['all']
    },
    {
      id: '2',
      name: 'Service Tech',
      email: 'tech@easyrenta.ca',
      role: 'Technician',
      status: 'Active',
      lastLogin: '2024-09-22',
      permissions: ['maintenance', 'vehicles']
    },
    {
      id: '3',
      name: 'Customer Service',
      email: 'cs@easyrenta.ca',
      role: 'Support',
      status: 'Active',
      lastLogin: '2024-09-23',
      permissions: ['bookings', 'customers']
    }
  ]);

  // API configuration state
  const [apiConfig, setApiConfig] = React.useState({
    openai: {
      apiKey: 'sk-proj-****',
      model: 'gpt-4',
      enabled: true
    },
    twilio: {
      accountSid: 'AC****',
      authToken: '****',
      phoneNumber: '+16394714669',
      enabled: true
    },
    stripe: {
      publishableKey: 'pk_test_****',
      secretKey: 'sk_test_****',
      enabled: true
    },
    googleMaps: {
      apiKey: 'AIza****',
      enabled: true
    },
    webhooks: {
      bookingUrl: 'https://webhook.easyrenta.ca/bookings',
      maintenanceUrl: 'https://webhook.easyrenta.ca/maintenance',
      enabled: true
    }
  });

  const handleSaveSettings = () => {
    // In real app, would save to backend
    console.log('Saving settings...');
    setUnsavedChanges(false);
    // Show success message
  };

  const handleResetSettings = () => {
    // Reset to defaults
    setUnsavedChanges(false);
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'Administrator': return 'bg-destructive text-destructive-foreground';
      case 'Technician': return 'bg-accent text-accent-foreground';
      case 'Support': return 'bg-secondary text-secondary-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <div className="fixed inset-0 bg-background z-50 overflow-auto">
      {/* Settings Header */}
      <header className="sticky top-0 z-10 border-b bg-card">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Settings className="w-6 h-6 text-primary" />
              <div>
                <h1 className="text-xl font-bold">Admin Settings</h1>
                <p className="text-sm text-muted-foreground">Configure system, users, and preferences</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {unsavedChanges && (
                <Badge variant="destructive" className="animate-pulse">
                  <AlertTriangle className="w-3 h-3 mr-1" />
                  Unsaved Changes
                </Badge>
              )}
              <Button onClick={handleSaveSettings} disabled={!unsavedChanges}>
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </Button>
              <Button variant="outline" onClick={onClose}>
                <X className="w-4 h-4 mr-2" />
                Close
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Settings Content */}
      <div className="container mx-auto px-6 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="profile" className="flex items-center gap-2">
              <User className="w-4 h-4" />
              Profile
            </TabsTrigger>
            <TabsTrigger value="system" className="flex items-center gap-2">
              <Settings className="w-4 h-4" />
              System
            </TabsTrigger>
            <TabsTrigger value="notifications" className="flex items-center gap-2">
              <Bell className="w-4 h-4" />
              Notifications
            </TabsTrigger>
            <TabsTrigger value="fleet" className="flex items-center gap-2">
              <Car className="w-4 h-4" />
              Fleet
            </TabsTrigger>
            <TabsTrigger value="users" className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              Users
            </TabsTrigger>
            <TabsTrigger value="api" className="flex items-center gap-2">
              <Database className="w-4 h-4" />
              API Config
            </TabsTrigger>
          </TabsList>

          {/* Profile Management */}
          <TabsContent value="profile" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Admin Profile Management
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center gap-6">
                  <Avatar className="w-20 h-20">
                    <AvatarImage src={profileData.avatar} />
                    <AvatarFallback className="text-lg">
                      {profileData.firstName[0]}{profileData.lastName[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <Button variant="outline" className="mr-2">
                      <Edit className="w-4 h-4 mr-2" />
                      Change Photo
                    </Button>
                    <Button variant="ghost">
                      <Trash2 className="w-4 h-4 mr-2" />
                      Remove
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      value={profileData.firstName}
                      onChange={(e) => {
                        setProfileData(prev => ({ ...prev, firstName: e.target.value }));
                        setUnsavedChanges(true);
                      }}
                    />
                  </div>
                  <div>
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      value={profileData.lastName}
                      onChange={(e) => {
                        setProfileData(prev => ({ ...prev, lastName: e.target.value }));
                        setUnsavedChanges(true);
                      }}
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      value={profileData.email}
                      onChange={(e) => {
                        setProfileData(prev => ({ ...prev, email: e.target.value }));
                        setUnsavedChanges(true);
                      }}
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      value={profileData.phone}
                      onChange={(e) => {
                        setProfileData(prev => ({ ...prev, phone: e.target.value }));
                        setUnsavedChanges(true);
                      }}
                    />
                  </div>
                  <div>
                    <Label htmlFor="position">Position</Label>
                    <Input
                      id="position"
                      value={profileData.position}
                      onChange={(e) => {
                        setProfileData(prev => ({ ...prev, position: e.target.value }));
                        setUnsavedChanges(true);
                      }}
                    />
                  </div>
                  <div>
                    <Label htmlFor="department">Department</Label>
                    <Input
                      id="department"
                      value={profileData.department}
                      onChange={(e) => {
                        setProfileData(prev => ({ ...prev, department: e.target.value }));
                        setUnsavedChanges(true);
                      }}
                    />
                  </div>
                  <div>
                    <Label htmlFor="timezone">Timezone</Label>
                    <Select value={profileData.timezone} onValueChange={(value: string) => {
                      setProfileData(prev => ({ ...prev, timezone: value }));
                      setUnsavedChanges(true);
                    }}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="America/Saskatoon">America/Saskatoon</SelectItem>
                        <SelectItem value="America/Toronto">America/Toronto</SelectItem>
                        <SelectItem value="America/Vancouver">America/Vancouver</SelectItem>
                        <SelectItem value="America/New_York">America/New_York</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="language">Language</Label>
                    <Select value={profileData.language} onValueChange={(value: string) => {
                      setProfileData(prev => ({ ...prev, language: value }));
                      setUnsavedChanges(true);
                    }}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="English">English</SelectItem>
                        <SelectItem value="French">French</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Palette className="w-5 h-5" />
                  Theme Preferences
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base">Theme Mode</Label>
                    <p className="text-sm text-muted-foreground">Choose your preferred theme</p>
                  </div>
                  <ThemeToggle />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* System Configuration */}
          <TabsContent value="system" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="w-5 h-5" />
                  General System Configuration
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label htmlFor="companyName">Company Name</Label>
                  <Input
                    id="companyName"
                    value={systemConfig.companyName}
                    onChange={(e) => {
                      setSystemConfig(prev => ({ ...prev, companyName: e.target.value }));
                      setUnsavedChanges(true);
                    }}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="startTime">Business Hours Start</Label>
                    <Input
                      id="startTime"
                      type="time"
                      value={systemConfig.businessHours.start}
                      onChange={(e) => {
                        setSystemConfig(prev => ({
                          ...prev,
                          businessHours: { ...prev.businessHours, start: e.target.value }
                        }));
                        setUnsavedChanges(true);
                      }}
                    />
                  </div>
                  <div>
                    <Label htmlFor="endTime">Business Hours End</Label>
                    <Input
                      id="endTime"
                      type="time"
                      value={systemConfig.businessHours.end}
                      onChange={(e) => {
                        setSystemConfig(prev => ({
                          ...prev,
                          businessHours: { ...prev.businessHours, end: e.target.value }
                        }));
                        setUnsavedChanges(true);
                      }}
                    />
                  </div>
                  <div>
                    <Label htmlFor="currency">Currency</Label>
                    <Select value={systemConfig.pricing.currency}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="CAD">CAD - Canadian Dollar</SelectItem>
                        <SelectItem value="USD">USD - US Dollar</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Separator />

                <div>
                  <h4 className="font-medium mb-4">Dynamic Pricing Configuration</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Enable Dynamic Pricing</Label>
                        <p className="text-sm text-muted-foreground">AI-powered price optimization</p>
                      </div>
                      <Switch
                        checked={systemConfig.pricing.dynamicPricing}
                        onCheckedChange={(checked: boolean) => {
                          setSystemConfig(prev => ({
                            ...prev,
                            pricing: { ...prev.pricing, dynamicPricing: checked }
                          }));
                          setUnsavedChanges(true);
                        }}
                      />
                    </div>
                    <div>
                      <Label htmlFor="surgeMultiplier">Surge Multiplier</Label>
                      <Input
                        id="surgeMultiplier"
                        type="number"
                        step="0.1"
                        value={systemConfig.pricing.surgeMultiplier}
                        onChange={(e) => {
                          setSystemConfig(prev => ({
                            ...prev,
                            pricing: { ...prev.pricing, surgeMultiplier: parseFloat(e.target.value) }
                          }));
                          setUnsavedChanges(true);
                        }}
                      />
                    </div>
                    <div>
                      <Label htmlFor="discountThreshold">Discount Threshold (days)</Label>
                      <Input
                        id="discountThreshold"
                        type="number"
                        value={systemConfig.pricing.discountThreshold}
                        onChange={(e) => {
                          setSystemConfig(prev => ({
                            ...prev,
                            pricing: { ...prev.pricing, discountThreshold: parseInt(e.target.value) }
                          }));
                          setUnsavedChanges(true);
                        }}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="w-5 h-5" />
                  Service Locations
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {systemConfig.locations.map((location, index) => (
                    <div key={location.id} className="flex items-center justify-between p-4 border border-border rounded-lg">
                      <div>
                        <h4 className="font-medium">{location.name}</h4>
                        <p className="text-sm text-muted-foreground">{location.address}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <Switch checked={location.active} />
                        <Button variant="outline" size="sm">
                          <Edit className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                  <Button variant="outline" className="w-full">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Location
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Notification Settings */}
          <TabsContent value="notifications" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="w-5 h-5" />
                  Notification Preferences
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h4 className="font-medium mb-4 flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    Email Notifications
                  </h4>
                  <div className="space-y-3">
                    {Object.entries(notificationSettings.email).map(([key, value]) => (
                      <div key={key} className="flex items-center justify-between">
                        <Label className="capitalize">{key.replace(/([A-Z])/g, ' $1').toLowerCase()}</Label>
                        <Switch
                          checked={value}
                          onCheckedChange={(checked: boolean) => {
                            setNotificationSettings(prev => ({
                              ...prev,
                              email: { ...prev.email, [key]: checked }
                            }));
                            setUnsavedChanges(true);
                          }}
                        />
                      </div>
                    ))}
                  </div>
                </div>

                <Separator />

                <div>
                  <h4 className="font-medium mb-4 flex items-center gap-2">
                    <Smartphone className="w-4 h-4" />
                    SMS Notifications
                  </h4>
                  <div className="space-y-3">
                    {Object.entries(notificationSettings.sms).map(([key, value]) => (
                      <div key={key} className="flex items-center justify-between">
                        <Label className="capitalize">{key.replace(/([A-Z])/g, ' $1').toLowerCase()}</Label>
                        <Switch
                          checked={value}
                          onCheckedChange={(checked: boolean) => {
                            setNotificationSettings(prev => ({
                              ...prev,
                              sms: { ...prev.sms, [key]: checked }
                            }));
                            setUnsavedChanges(true);
                          }}
                        />
                      </div>
                    ))}
                  </div>
                </div>

                <Separator />

                <div>
                  <h4 className="font-medium mb-4 flex items-center gap-2">
                    <Volume2 className="w-4 h-4" />
                    Push Notifications
                  </h4>
                  <div className="space-y-3">
                    {Object.entries(notificationSettings.push).map(([key, value]) => (
                      <div key={key} className="flex items-center justify-between">
                        <Label className="capitalize">{key.replace(/([A-Z])/g, ' $1').toLowerCase()}</Label>
                        <Switch
                          checked={value}
                          onCheckedChange={(checked: boolean) => {
                            setNotificationSettings(prev => ({
                              ...prev,
                              push: { ...prev.push, [key]: checked }
                            }));
                            setUnsavedChanges(true);
                          }}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Fleet Management Preferences */}
          <TabsContent value="fleet" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Car className="w-5 h-5" />
                  Fleet Management Preferences
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Auto-Schedule Maintenance</Label>
                      <p className="text-sm text-muted-foreground">AI automatically schedules maintenance</p>
                    </div>
                    <Switch
                      checked={fleetPreferences.autoScheduleMaintenance}
                      onCheckedChange={(checked: boolean) => {
                        setFleetPreferences(prev => ({ ...prev, autoScheduleMaintenance: checked }));
                        setUnsavedChanges(true);
                      }}
                    />
                  </div>

                  <div>
                    <Label htmlFor="predictiveThreshold">Predictive Maintenance Threshold (%)</Label>
                    <Input
                      id="predictiveThreshold"
                      type="number"
                      min="50"
                      max="100"
                      value={fleetPreferences.predictiveMaintenanceThreshold}
                      onChange={(e) => {
                        setFleetPreferences(prev => ({ ...prev, predictiveMaintenanceThreshold: parseInt(e.target.value) }));
                        setUnsavedChanges(true);
                      }}
                    />
                  </div>

                  <div>
                    <Label htmlFor="conflictMode">Conflict Resolution Mode</Label>
                    <Select
                      value={fleetPreferences.conflictResolutionMode}
                      onValueChange={(value: string) => {
                        setFleetPreferences(prev => ({ ...prev, conflictResolutionMode: value }));
                        setUnsavedChanges(true);
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="auto">Automatic Resolution</SelectItem>
                        <SelectItem value="manual">Manual Review Required</SelectItem>
                        <SelectItem value="hybrid">Hybrid (Auto + Manual)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="utilizationTarget">Target Utilization (%)</Label>
                    <Input
                      id="utilizationTarget"
                      type="number"
                      min="50"
                      max="100"
                      value={fleetPreferences.utilizationTarget}
                      onChange={(e) => {
                        setFleetPreferences(prev => ({ ...prev, utilizationTarget: parseInt(e.target.value) }));
                        setUnsavedChanges(true);
                      }}
                    />
                  </div>

                  <div>
                    <Label htmlFor="maintenanceWindow">Preferred Maintenance Window</Label>
                    <Select
                      value={fleetPreferences.maintenanceWindow}
                      onValueChange={(value: string) => {
                        setFleetPreferences(prev => ({ ...prev, maintenanceWindow: value }));
                        setUnsavedChanges(true);
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="overnight">Overnight (10 PM - 6 AM)</SelectItem>
                        <SelectItem value="morning">Morning (6 AM - 10 AM)</SelectItem>
                        <SelectItem value="afternoon">Afternoon (2 PM - 6 PM)</SelectItem>
                        <SelectItem value="flexible">Flexible</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="fuelThreshold">Low Fuel Alert Threshold (%)</Label>
                    <Input
                      id="fuelThreshold"
                      type="number"
                      min="10"
                      max="50"
                      value={fleetPreferences.fuelThreshold}
                      onChange={(e) => {
                        setFleetPreferences(prev => ({ ...prev, fuelThreshold: parseInt(e.target.value) }));
                        setUnsavedChanges(true);
                      }}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* User Management */}
          <TabsContent value="users" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Users className="w-5 h-5" />
                    User Management
                  </CardTitle>
                  <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    Add User
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {users.map((user) => (
                    <div key={user.id} className="flex items-center justify-between p-4 border border-border rounded-lg">
                      <div className="flex items-center gap-4">
                        <Avatar>
                          <AvatarFallback>{user.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                        </Avatar>
                        <div>
                          <h4 className="font-medium">{user.name}</h4>
                          <p className="text-sm text-muted-foreground">{user.email}</p>
                          <p className="text-xs text-muted-foreground">Last login: {user.lastLogin}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge className={getRoleColor(user.role)}>
                          {user.role}
                        </Badge>
                        <Badge variant={user.status === 'Active' ? 'secondary' : 'destructive'}>
                          {user.status}
                        </Badge>
                        <Button variant="outline" size="sm">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* API Configuration */}
          <TabsContent value="api" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Database className="w-5 h-5" />
                    API Configuration
                  </CardTitle>
                  <Button
                    variant="outline"
                    onClick={() => setShowApiKeys(!showApiKeys)}
                  >
                    {showApiKeys ? <EyeOff className="w-4 h-4 mr-2" /> : <Eye className="w-4 h-4 mr-2" />}
                    {showApiKeys ? 'Hide' : 'Show'} Keys
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {(Object.entries(apiConfig) as [string, any][]).map(([service, config]) => (
                  <div key={service} className="border border-border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-medium capitalize flex items-center gap-2">
                        {service === 'openai' && <Zap className="w-4 h-4" />}
                        {service === 'twilio' && <Phone className="w-4 h-4" />}
                        {service === 'stripe' && <DollarSign className="w-4 h-4" />}
                        {service === 'googleMaps' && <MapPin className="w-4 h-4" />}
                        {service === 'webhooks' && <Globe className="w-4 h-4" />}
                        {service === 'openai' ? 'OpenAI' : service.charAt(0).toUpperCase() + service.slice(1)}
                      </h4>
                      <Switch
                        checked={config.enabled}
                        onCheckedChange={(checked: boolean) => {
                          setApiConfig(prev => ({
                            ...prev,
                            [service]: { ...(prev as any)[service], enabled: checked }
                          }) as any);
                          setUnsavedChanges(true);
                        }}
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {(Object.entries(config) as [string, any][]).map(([key, value]) => {
                        if (key === 'enabled') return null;
                        return (
                          <div key={key}>
                            <Label htmlFor={`${service}-${key}`} className="capitalize">
                              {key.replace(/([A-Z])/g, ' $1').toLowerCase()}
                            </Label>
                            <Input
                              id={`${service}-${key}`}
                              type={showApiKeys ? 'text' : 'password'}
                              value={showApiKeys ? String(value) : '••••••••'}
                              onChange={(e) => {
                                const newVal = e.target.value;
                                setApiConfig(prev => ({
                                  ...prev,
                                  [service]: { ...(prev as any)[service], [key]: newVal }
                                }) as any);
                                setUnsavedChanges(true);
                              }}
                            />
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}