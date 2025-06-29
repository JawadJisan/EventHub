
import { useState, useEffect } from 'react';
import { Calendar, MapPin, Users, Clock, Search, Filter, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Navbar } from '@/components/Navbar';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { Link } from 'react-router-dom';

interface Event {
  id: string;
  title: string;
  organizer: string;
  date: string;
  time: string;
  location: string;
  description: string;
  attendeeCount: number;
  joinedUsers: string[];
  createdBy: string;
}

const Events = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilter, setDateFilter] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    loadEvents();
  }, []);

  useEffect(() => {
    filterEvents();
  }, [events, searchTerm, dateFilter]);

  const loadEvents = () => {
    setIsLoading(true);
    const storedEvents = localStorage.getItem('events');
    if (storedEvents) {
      const parsedEvents = JSON.parse(storedEvents);
      // Sort by date and time (most recent first)
      const sortedEvents = parsedEvents.sort((a: Event, b: Event) => {
        const dateA = new Date(`${a.date} ${a.time}`);
        const dateB = new Date(`${b.date} ${b.time}`);
        return dateB.getTime() - dateA.getTime();
      });
      setEvents(sortedEvents);
    }
    setIsLoading(false);
  };

  const filterEvents = () => {
    let filtered = events;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(event =>
        event.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by date
    if (dateFilter !== 'all') {
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      
      filtered = filtered.filter(event => {
        const eventDate = new Date(event.date);
        
        switch (dateFilter) {
          case 'today':
            return eventDate.toDateString() === today.toDateString();
          case 'current-week':
            const startOfWeek = new Date(today);
            startOfWeek.setDate(today.getDate() - today.getDay());
            const endOfWeek = new Date(startOfWeek);
            endOfWeek.setDate(startOfWeek.getDate() + 6);
            return eventDate >= startOfWeek && eventDate <= endOfWeek;
          case 'last-week':
            const lastWeekStart = new Date(today);
            lastWeekStart.setDate(today.getDate() - today.getDay() - 7);
            const lastWeekEnd = new Date(lastWeekStart);
            lastWeekEnd.setDate(lastWeekStart.getDate() + 6);
            return eventDate >= lastWeekStart && eventDate <= lastWeekEnd;
          case 'current-month':
            return eventDate.getMonth() === today.getMonth() && 
                   eventDate.getFullYear() === today.getFullYear();
          case 'last-month':
            const lastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);
            return eventDate.getMonth() === lastMonth.getMonth() && 
                   eventDate.getFullYear() === lastMonth.getFullYear();
          default:
            return true;
        }
      });
    }

    setFilteredEvents(filtered);
  };

  const handleJoinEvent = (eventId: string) => {
    if (!user) return;

    const updatedEvents = events.map(event => {
      if (event.id === eventId) {
        const joinedUsers = event.joinedUsers || [];
        if (!joinedUsers.includes(user.id)) {
          return {
            ...event,
            attendeeCount: event.attendeeCount + 1,
            joinedUsers: [...joinedUsers, user.id]
          };
        }
      }
      return event;
    });

    setEvents(updatedEvents);
    localStorage.setItem('events', JSON.stringify(updatedEvents));
    toast.success('Successfully joined the event!');
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatTime = (time: string) => {
    return new Date(`2000-01-01 ${time}`).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const canJoinEvent = (event: Event) => {
    if (!user) return false;
    const joinedUsers = event.joinedUsers || [];
    return !joinedUsers.includes(user.id);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100">
        <Navbar />
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Discover Events</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Find amazing events happening around you. Join the community and create unforgettable memories.
          </p>
        </div>

        {/* Search and Filter */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Search events by title..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <Select value={dateFilter} onValueChange={setDateFilter}>
                <SelectTrigger className="w-48">
                  <Filter className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="Filter by date" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Events</SelectItem>
                  <SelectItem value="today">Today</SelectItem>
                  <SelectItem value="current-week">Current Week</SelectItem>
                  <SelectItem value="last-week">Last Week</SelectItem>
                  <SelectItem value="current-month">Current Month</SelectItem>
                  <SelectItem value="last-month">Last Month</SelectItem>
                </SelectContent>
              </Select>
              <Link to="/add-event">
                <Button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Event
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Events Grid */}
        {filteredEvents.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEvents.map((event) => (
              <Card key={event.id} className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-white border-0 shadow-lg">
                <CardHeader className="pb-4">
                  <div className="flex justify-between items-start mb-2">
                    <Badge className="bg-purple-100 text-purple-800">
                      Event
                    </Badge>
                    <div className="text-right text-sm text-gray-500">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        {formatDate(event.date)}
                      </div>
                    </div>
                  </div>
                  <CardTitle className="text-xl font-bold text-gray-900 group-hover:text-purple-600 transition-colors line-clamp-2">
                    {event.title}
                  </CardTitle>
                  <p className="text-sm text-gray-600">by {event.organizer}</p>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 mb-4 line-clamp-3">{event.description}</p>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-sm text-gray-600">
                      <Clock className="h-4 w-4 mr-2 text-purple-500" />
                      {formatTime(event.time)}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <MapPin className="h-4 w-4 mr-2 text-purple-500" />
                      {event.location}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Users className="h-4 w-4 mr-2 text-purple-500" />
                      {event.attendeeCount} attendees
                    </div>
                  </div>

                  <Button
                    onClick={() => handleJoinEvent(event.id)}
                    disabled={!canJoinEvent(event)}
                    className={`w-full ${
                      canJoinEvent(event)
                        ? 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700'
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    {canJoinEvent(event) ? 'Join Event' : 'Already Joined'}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Calendar className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              {searchTerm || dateFilter !== 'all' ? 'No events found' : 'No events yet'}
            </h3>
            <p className="text-gray-500 mb-6">
              {searchTerm || dateFilter !== 'all' 
                ? 'Try adjusting your search or filter criteria'
                : 'Be the first to create an amazing event!'
              }
            </p>
            <Link to="/add-event">
              <Button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
                <Plus className="mr-2 h-4 w-4" />
                Create First Event
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Events;
