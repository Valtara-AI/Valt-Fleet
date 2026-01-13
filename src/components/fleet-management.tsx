import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { 
  Car,
  Plus,
  Search,
  Filter,
  Edit,
  Trash2,
  MapPin,
  Calendar,
  DollarSign,
  Users,
  Fuel,
  Settings,
  AlertTriangle,
  CheckCircle,
  Clock,
  Activity,
  BarChart3
} from 'lucide-react';

interface Vehicle {
  id: string;
  name: string;
  make: string;
  model: string;
  year: number;
  license: string;
  vin: string;
  status: 'available' | 'booked' | 'maintenance' | 'out-of-service';
  location: string;
  mileage: number;
  fuelLevel: number;
  lastService: string;
  nextService: string;
  dailyRate: number;
  utilization: number;
  totalRevenue: number;
  features: string[];
  images: string[];
}

interface Booking {
  id: string;
  vehicleId: string;
  vehicleName: string;
  customerName: string;
  customerEmail: string;
  startDate: string;
  endDate: string;
  status: 'confirmed' | 'in-progress' | 'completed' | 'cancelled';
  totalAmount: number;
  pickupLocation: string;
  dropoffLocation: string;
  channel: 'web' | 'phone' | 'whatsapp' | 'sms';
}

export function FleetManagement() {
  const [activeTab, setActiveTab] = React.useState('vehicles');
  const [searchTerm, setSearchTerm] = React.useState('');
  const [statusFilter, setStatusFilter] = React.useState('all');
  const [selectedVehicle, setSelectedVehicle] = React.useState<Vehicle | null>(null);

  // Mock data - in real app would come from API
  const vehicles: Vehicle[] = [
    {
      id: '1',
      name: 'Honda Civic 2023',
      make: 'Honda',
      model: 'Civic',
      year: 2023,
      license: 'ABC-123',
      vin: '1HGBH41JXMN109186',
      status: 'booked',
      location: 'Downtown Saskatoon',
      mileage: 15420,
      fuelLevel: 85,
      lastService: '2024-08-15',
      nextService: '2024-11-15',
      dailyRate: 45,
      utilization: 78,
      totalRevenue: 3240,
      features: ['Automatic', 'A/C', 'Bluetooth', 'Backup Camera'],
      images: ['https://images.unsplash.com/photo-1619767886558-efdc259cde1a?w=400&h=300&fit=crop']
    },
    {
      id: '2',
      name: 'Toyota RAV4 2022',
      make: 'Toyota',
      model: 'RAV4',
      year: 2022,
      license: 'DEF-456',
      vin: '2T3BFREV5DW123456',
      status: 'maintenance',
      location: 'Service Center',
      mileage: 28750,
      fuelLevel: 40,
      lastService: '2024-09-20',
      nextService: '2024-12-20',
      dailyRate: 65,
      utilization: 0,
      totalRevenue: 5180,
      features: ['AWD', 'Automatic', 'A/C', 'Heated Seats', 'Navigation'],
      images: ['https://images.unsplash.com/photo-1621007947382-bb3c3994e9b1?w=400&h=300&fit=crop']
    },
    {
      id: '3',
      name: 'Ford Transit 2023',
      make: 'Ford',
      model: 'Transit',
      year: 2023,
      license: 'GHI-789',
      vin: '1FTBW2CM5HKB12345',
      status: 'available',
      location: 'YXE Airport',
      mileage: 8930,
      fuelLevel: 95,
      lastService: '2024-07-10',
      nextService: '2024-10-10',
      dailyRate: 85,
      utilization: 92,
      totalRevenue: 7650,
      features: ['12 Passenger', 'Automatic', 'A/C', 'Power Windows'],
      images: ['https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=400&h=300&fit=crop']
    }
  ];

  const bookings: Booking[] = [
    {
      id: 'BK-2024-001',
      vehicleId: '1',
      vehicleName: 'Honda Civic 2023',
      customerName: 'Sarah Johnson',
      customerEmail: 'sarah@email.com',
      startDate: '2024-09-23',
      endDate: '2024-09-26',
      status: 'in-progress',
      totalAmount: 135,
      pickupLocation: 'Downtown Saskatoon',
      dropoffLocation: 'Downtown Saskatoon',
      channel: 'web'
    },
    {
      id: 'BK-2024-002',
      vehicleId: '3',
      vehicleName: 'Ford Transit 2023',
      customerName: 'Mike Wilson',
      customerEmail: 'mike@email.com',
      startDate: '2024-09-24',
      endDate: '2024-09-25',
      status: 'confirmed',
      totalAmount: 85,
      pickupLocation: 'YXE Airport',
      dropoffLocation: 'YXE Airport',
      channel: 'phone'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available': return 'bg-secondary text-secondary-foreground';
      case 'booked': return 'bg-primary text-primary-foreground';
      case 'maintenance': return 'bg-destructive text-destructive-foreground';
      case 'out-of-service': return 'bg-muted text-muted-foreground';
      case 'confirmed': return 'bg-accent text-accent-foreground';
      case 'in-progress': return 'bg-primary text-primary-foreground';
      case 'completed': return 'bg-secondary text-secondary-foreground';
      case 'cancelled': return 'bg-muted text-muted-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getChannelIcon = (channel: string) => {
    switch (channel) {
      case 'web': return '🌐';
      case 'phone': return '📞';
      case 'whatsapp': return '💬';
      case 'sms': return '📱';
      default: return '❓';
    }
  };

  const filteredVehicles = vehicles.filter(vehicle => {
    const matchesSearch = vehicle.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         vehicle.license.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || vehicle.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Fleet Management</h2>
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Add Vehicle
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Vehicle</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="make">Make</Label>
                  <Input id="make" placeholder="Honda" />
                </div>
                <div>
                  <Label htmlFor="model">Model</Label>
                  <Input id="model" placeholder="Civic" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="year">Year</Label>
                  <Input id="year" type="number" placeholder="2023" />
                </div>
                <div>
                  <Label htmlFor="license">License Plate</Label>
                  <Input id="license" placeholder="ABC-123" />
                </div>
              </div>
              <div>
                <Label htmlFor="vin">VIN</Label>
                <Input id="vin" placeholder="1HGBH41JXMN109186" />
              </div>
              <div>
                <Label htmlFor="dailyRate">Daily Rate ($)</Label>
                <Input id="dailyRate" type="number" placeholder="45" />
              </div>
              <Button className="w-full">Add Vehicle</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="vehicles">Vehicles</TabsTrigger>
          <TabsTrigger value="bookings">Bookings</TabsTrigger>
          <TabsTrigger value="conflicts">Conflicts</TabsTrigger>
        </TabsList>

        <TabsContent value="vehicles" className="space-y-4">
          {/* Filters */}
          <div className="flex items-center gap-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search vehicles..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-48">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="available">Available</SelectItem>
                <SelectItem value="booked">Booked</SelectItem>
                <SelectItem value="maintenance">Maintenance</SelectItem>
                <SelectItem value="out-of-service">Out of Service</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Vehicle Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredVehicles.map((vehicle) => (
              <Card key={vehicle.id} className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">{vehicle.name}</CardTitle>
                      <p className="text-sm text-muted-foreground">{vehicle.license}</p>
                    </div>
                    <Badge className={getStatusColor(vehicle.status)}>
                      {vehicle.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="aspect-video bg-muted rounded-lg overflow-hidden">
                    <img 
                      src={vehicle.images[0]} 
                      alt={vehicle.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-muted-foreground" />
                      <span className="truncate">{vehicle.location}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <DollarSign className="w-4 h-4 text-muted-foreground" />
                      <span>${vehicle.dailyRate}/day</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Activity className="w-4 h-4 text-muted-foreground" />
                      <span>{vehicle.mileage.toLocaleString()} km</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Fuel className="w-4 h-4 text-muted-foreground" />
                      <span>{vehicle.fuelLevel}%</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Utilization</span>
                      <span>{vehicle.utilization}%</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div 
                        className="bg-primary h-2 rounded-full transition-all"
                        style={{ width: `${vehicle.utilization}%` }}
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <div className="text-sm">
                      <p className="font-medium">Revenue: ${vehicle.totalRevenue.toLocaleString()}</p>
                      <p className="text-muted-foreground">This month</p>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="outline">
                        <Settings className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="bookings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Bookings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {bookings.map((booking) => (
                  <div key={booking.id} className="flex items-center justify-between p-4 border border-border rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <Car className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">{booking.vehicleName}</p>
                        <p className="text-sm text-muted-foreground">{booking.customerName} • {booking.customerEmail}</p>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground mt-1">
                          <span>{booking.startDate} - {booking.endDate}</span>
                          <span>{getChannelIcon(booking.channel)} {booking.channel}</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge className={getStatusColor(booking.status)}>
                        {booking.status}
                      </Badge>
                      <p className="text-sm font-medium mt-1">${booking.totalAmount}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="conflicts" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-destructive" />
                Booking Conflicts
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border border-destructive/20 rounded-lg bg-destructive/5">
                  <div className="flex items-center gap-4">
                    <AlertTriangle className="w-5 h-5 text-destructive" />
                    <div>
                      <p className="font-medium">Double Booking Detected</p>
                      <p className="text-sm text-muted-foreground">Honda Civic (ABC-123) - Sept 25, 2024</p>
                      <p className="text-xs text-muted-foreground">Conflicting bookings: BK-2024-003, BK-2024-004</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">
                      Auto-Resolve
                    </Button>
                    <Button size="sm">
                      Manual Review
                    </Button>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 border border-accent/20 rounded-lg bg-accent/5">
                  <div className="flex items-center gap-4">
                    <Clock className="w-5 h-5 text-accent" />
                    <div>
                      <p className="font-medium">Maintenance Conflict</p>
                      <p className="text-sm text-muted-foreground">Toyota RAV4 (DEF-456) - Sept 28, 2024</p>
                      <p className="text-xs text-muted-foreground">Scheduled maintenance overlaps with booking BK-2024-005</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">
                      Reschedule
                    </Button>
                    <Button size="sm">
                      Contact Customer
                    </Button>
                  </div>
                </div>

                <div className="text-center py-8 text-muted-foreground">
                  <CheckCircle className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p>No additional conflicts detected</p>
                  <p className="text-sm">AI conflict resolution is working efficiently</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}