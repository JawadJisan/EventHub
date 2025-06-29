
import { useState, useEffect } from 'react';
import { Calendar, MapPin, Users, Clock, Edit, Trash2, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Navbar } from '@/components/Navbar';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { Link } from 'react-router-dom';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

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

const MyEvents = () => {
  const [myEvents, setMyEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    loadMyEvents();
  }, [user]);

  const loadMyEvents = () => {
    setIsLoading(true);
    const storedEvents = localStorage.getItem('events');
    if (storedEvents && user) {
      const allEvents = JSON.parse(storedEvents);
      const userEvents = allEvents.filter((event: Event) => event.createdBy === user.id);
      // Sort by date and time (most recent first)
      const sortedEvents = userEvents.sort((a: Event, b: Event) => {
        const dateA = new Date(`${a.date} ${a.time}`);
        const dateB = new Date(`${b.date} ${b.time}`);
        return dateB.getTime() - dateA.getTime();
      });
      setMyEvents(sortedEvents);
    }
    setIsLoading(false);
  };

  const handleDeleteEvent = (eventId: string) => {
    const storedEvents = localStorage.getItem('events');
    if (storedEvents) {
      const allEvents = JSON.parse(storedEvents);
      const updatedEvents = allEvents.filter((event: Event) => event.id !== eventId);
      localStorage.setItem('events', JSON.stringify(updatedEvents));
      setMyEvents(prev => prev.filter(event => event.id !== eventId));
      toast.success('Event deleted successfully!');
    }
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
          <h1 className="text-4xl font-bold text-gray-900 mb-4">My Events</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Manage all the events you've created. Update details, track attendees, or remove events as needed.
          </p>
        </div>

        {/* Events Grid */}
        {myEvents.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {myEvents.map((event) => (
              <Card key={event.id} className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-white border-0 shadow-lg">
                <CardHeader className="pb-4">
                  <div className="flex justify-between items-start mb-2">
                    <Badge className="bg-green-100 text-green-800">
                      My Event
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

                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 border-blue-200 text-blue-600 hover:bg-blue-50"
                    >
                      <Edit className="h-4 w-4 mr-1" />
                      Update
                    </Button>
                    
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1 border-red-200 text-red-600 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4 mr-1" />
                          Delete
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Event</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete "{event.title}"? This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDeleteEvent(event.id)}
                            className="bg-red-600 hover:bg-red-700"
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Calendar className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No events created yet</h3>
            <p className="text-gray-500 mb-6">
              Start by creating your first amazing event!
            </p>
            <Link to="/add-event">
              <Button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
                <Plus className="mr-2 h-4 w-4" />
                Create Your First Event
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyEvents;
