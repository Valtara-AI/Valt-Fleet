import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { 
  Calendar,
  ChevronLeft,
  ChevronRight,
  Car,
  Plus,
  AlertTriangle,
  Clock,
  User,
  MapPin,
  Phone
} from 'lucide-react';

interface CalendarEvent {
  id: string;
  title: string;
  vehicleId: string;
  vehicleName: string;
  customer: string;
  startDate: Date;
  endDate: Date;
  type: 'booking' | 'maintenance' | 'blocked';
  status: 'confirmed' | 'pending' | 'conflict';
  color: string;
  pickupLocation?: string;
  dropoffLocation?: string;
  contactInfo?: string;
}

export function SchedulerCalendar() {
  const [currentDate, setCurrentDate] = React.useState(new Date());
  const [viewType, setViewType] = React.useState<'week' | 'month'>('week');
  const [selectedVehicle, setSelectedVehicle] = React.useState('all');
  const [draggedEvent, setDraggedEvent] = React.useState<CalendarEvent | null>(null);

  // Mock data - in real app would come from API
  const vehicles = [
    { id: '1', name: 'Honda Civic (ABC-123)', color: '#7a6bff' },
    { id: '2', name: 'Toyota RAV4 (DEF-456)', color: '#ff5aa3' },
    { id: '3', name: 'Ford Transit (GHI-789)', color: '#50e3a4' }
  ];

  const events: CalendarEvent[] = [
    {
      id: '1',
      title: 'Sarah Johnson',
      vehicleId: '1',
      vehicleName: 'Honda Civic (ABC-123)',
      customer: 'Sarah Johnson',
      startDate: new Date(2024, 8, 23, 9, 0),
      endDate: new Date(2024, 8, 26, 17, 0),
      type: 'booking',
      status: 'confirmed',
      color: '#7a6bff',
      pickupLocation: 'Downtown Saskatoon',
      dropoffLocation: 'Downtown Saskatoon',
      contactInfo: 'sarah@email.com'
    },
    {
      id: '2',
      title: 'Scheduled Maintenance',
      vehicleId: '2',
      vehicleName: 'Toyota RAV4 (DEF-456)',
      customer: 'Service Center',
      startDate: new Date(2024, 8, 25, 8, 0),
      endDate: new Date(2024, 8, 25, 16, 0),
      type: 'maintenance',
      status: 'confirmed',
      color: '#ff5aa3'
    },
    {
      id: '3',
      title: 'Mike Wilson - CONFLICT',
      vehicleId: '1',
      vehicleName: 'Honda Civic (ABC-123)',
      customer: 'Mike Wilson',
      startDate: new Date(2024, 8, 24, 14, 0),
      endDate: new Date(2024, 8, 27, 10, 0),
      type: 'booking',
      status: 'conflict',
      color: '#E04B4B',
      pickupLocation: 'YXE Airport',
      dropoffLocation: 'YXE Airport',
      contactInfo: 'mike@email.com'
    }
  ];

  const getDaysInWeek = (date: Date) => {
    const startOfWeek = new Date(date);
    startOfWeek.setDate(date.getDate() - date.getDay());
    
    const days = [];
    for (let i = 0; i < 7; i++) {
      const day = new Date(startOfWeek);
      day.setDate(startOfWeek.getDate() + i);
      days.push(day);
    }
    return days;
  };

  const getEventsForDay = (date: Date) => {
    return events.filter(event => {
      const eventStart = new Date(event.startDate);
      const eventEnd = new Date(event.endDate);
      return date >= eventStart && date <= eventEnd;
    });
  };

  const getEventPosition = (event: CalendarEvent, date: Date) => {
    const eventStart = new Date(event.startDate);
    const eventEnd = new Date(event.endDate);
    
    const dayStart = new Date(date);
    dayStart.setHours(0, 0, 0, 0);
    const dayEnd = new Date(date);
    dayEnd.setHours(23, 59, 59, 999);
    
    const startHour = Math.max(eventStart.getHours(), 0);
    const endHour = Math.min(eventEnd.getHours() + (eventEnd.getMinutes() > 0 ? 1 : 0), 24);
    
    return {
      top: `${(startHour / 24) * 100}%`,
      height: `${((endHour - startHour) / 24) * 100}%`
    };
  };

  const navigateWeek = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() + (direction === 'next' ? 7 : -7));
    setCurrentDate(newDate);
  };

  const handleDragStart = (event: CalendarEvent) => {
    setDraggedEvent(event);
  };

  const handleDrop = (targetDate: Date, targetVehicleId: string) => {
    if (!draggedEvent) return;
    
    // In real app, would validate conflicts and update via API
    console.log('Moving event:', draggedEvent.id, 'to', targetDate, 'for vehicle', targetVehicleId);
    setDraggedEvent(null);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'conflict':
        return <AlertTriangle className="w-3 h-3" />;
      case 'pending':
        return <Clock className="w-3 h-3" />;
      default:
        return null;
    }
  };

  const filteredEvents = selectedVehicle === 'all' 
    ? events 
    : events.filter(event => event.vehicleId === selectedVehicle);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Fleet Scheduler</h2>
        <div className="flex items-center gap-4">
          <Select value={selectedVehicle} onValueChange={setSelectedVehicle}>
            <SelectTrigger className="w-48">
              <Car className="w-4 h-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Vehicles</SelectItem>
              {vehicles.map(vehicle => (
                <SelectItem key={vehicle.id} value={vehicle.id}>
                  {vehicle.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Select value={viewType} onValueChange={(value: 'week' | 'month') => setViewType(value)}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">Week View</SelectItem>
              <SelectItem value="month">Month View</SelectItem>
            </SelectContent>
          </Select>

          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                New Booking
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Booking</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="customer">Customer Name</Label>
                  <Input id="customer" placeholder="John Doe" />
                </div>
                <div>
                  <Label htmlFor="vehicle">Vehicle</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select vehicle" />
                    </SelectTrigger>
                    <SelectContent>
                      {vehicles.map(vehicle => (
                        <SelectItem key={vehicle.id} value={vehicle.id}>
                          {vehicle.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="startDate">Start Date</Label>
                    <Input id="startDate" type="datetime-local" />
                  </div>
                  <div>
                    <Label htmlFor="endDate">End Date</Label>
                    <Input id="endDate" type="datetime-local" />
                  </div>
                </div>
                <Button className="w-full">Create Booking</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              {viewType === 'week' ? 'Weekly Schedule' : 'Monthly Schedule'}
            </CardTitle>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={() => navigateWeek('prev')}>
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <span className="font-medium px-4">
                {currentDate.toLocaleDateString('en-US', { 
                  month: 'long', 
                  year: 'numeric',
                  day: viewType === 'week' ? 'numeric' : undefined
                })}
              </span>
              <Button variant="outline" size="sm" onClick={() => navigateWeek('next')}>
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {viewType === 'week' && (
            <div className="space-y-4">
              {/* Time Header */}
              <div className="grid grid-cols-8 gap-1">
                <div className="p-2 text-sm font-medium text-muted-foreground">Time</div>
                {getDaysInWeek(currentDate).map((day, index) => (
                  <div key={index} className="p-2 text-center">
                    <div className="text-sm font-medium">
                      {day.toLocaleDateString('en-US', { weekday: 'short' })}
                    </div>
                    <div className="text-lg">
                      {day.getDate()}
                    </div>
                  </div>
                ))}
              </div>

              {/* Calendar Grid */}
              <div className="relative border border-border rounded-lg overflow-hidden">
                <div className="grid grid-cols-8">
                  {/* Time Column */}
                  <div className="border-r border-border">
                    {Array.from({ length: 24 }, (_, hour) => (
                      <div key={hour} className="h-12 px-2 py-1 border-b border-border text-xs text-muted-foreground">
                        {hour === 0 ? '12 AM' : hour < 12 ? `${hour} AM` : hour === 12 ? '12 PM' : `${hour - 12} PM`}
                      </div>
                    ))}
                  </div>

                  {/* Day Columns */}
                  {getDaysInWeek(currentDate).map((day, dayIndex) => (
                    <div key={dayIndex} className="relative border-r border-border last:border-r-0">
                      {Array.from({ length: 24 }, (_, hour) => (
                        <div 
                          key={hour} 
                          className="h-12 border-b border-border hover:bg-muted/50 transition-colors"
                          onDrop={(e) => {
                            e.preventDefault();
                            const targetTime = new Date(day);
                            targetTime.setHours(hour);
                            handleDrop(targetTime, selectedVehicle);
                          }}
                          onDragOver={(e) => e.preventDefault()}
                        />
                      ))}

                      {/* Events */}
                      {getEventsForDay(day).map((event) => {
                        if (selectedVehicle !== 'all' && event.vehicleId !== selectedVehicle) return null;
                        
                        const position = getEventPosition(event, day);
                        return (
                          <div
                            key={event.id}
                            className="absolute left-1 right-1 rounded p-1 text-xs cursor-pointer z-10"
                            style={{
                              backgroundColor: event.color + '20',
                              borderLeft: `3px solid ${event.color}`,
                              top: position.top,
                              height: position.height,
                              minHeight: '24px'
                            }}
                            draggable
                            onDragStart={() => handleDragStart(event)}
                          >
                            <div className="flex items-center gap-1">
                              {getStatusIcon(event.status)}
                              <span className="font-medium truncate" style={{ color: event.color }}>
                                {event.title}
                              </span>
                            </div>
                            <div className="text-muted-foreground truncate">
                              {event.vehicleName.split(' ')[0]} {event.vehicleName.split('(')[1]?.replace(')', '')}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Conflict Resolution Panel */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-destructive" />
            Scheduling Conflicts
            <Badge variant="destructive">1 Active</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredEvents.filter(event => event.status === 'conflict').map((event) => (
              <div key={event.id} className="flex items-center justify-between p-4 border border-destructive/20 rounded-lg bg-destructive/5">
                <div className="flex items-center gap-4">
                  <AlertTriangle className="w-5 h-5 text-destructive" />
                  <div>
                    <p className="font-medium">{event.title}</p>
                    <p className="text-sm text-muted-foreground">{event.vehicleName}</p>
                    <p className="text-xs text-muted-foreground">
                      {event.startDate.toLocaleDateString()} - {event.endDate.toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline">
                    <User className="w-4 h-4 mr-2" />
                    Contact Customer
                  </Button>
                  <Button size="sm" variant="outline">
                    <Car className="w-4 h-4 mr-2" />
                    Suggest Alternative
                  </Button>
                  <Button size="sm">
                    Resolve
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}