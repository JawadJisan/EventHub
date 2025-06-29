
import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Calendar, MapPin, Users, Clock, ArrowLeft, UserPlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Navbar } from '@/components/Navbar';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

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
  createdAt: string;
}

const EventDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [event, setEvent] = useState<Event | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isJoining, setIsJoining] = useState(false);

  useEffect(() => {
    const loadEvent = () => {
      try {
        const events = JSON.parse(localStorage.getItem('events') || '[]');
        const foundEvent = events.find((e: Event) => e.id === id);
        
        if (foundEvent) {
          setEvent(foundEvent);
        } else {
          toast.error('Event not found');
          navigate('/events');
        }
      } catch (error) {
        console.error('Error loading event:', error);
        toast.error('Error loading event details');
      } finally {
        setIsLoading(false);
      }
    };

    loadEvent();
  }, [id, navigate]);

  const handleJoinEvent = async () => {
    if (!user || !event) return;

    if (event.joinedUsers.includes(user.id)) {
      toast.info('You have already joined this event');
      return;
    }

    setIsJoining(true);

    try {
      const events = JSON.parse(localStorage.getItem('events') || '[]');
      const updatedEvents = events.map((e: Event) => {
        if (e.id === event.id) {
          return {
            ...e,
            attendeeCount: e.attendeeCount + 1,
            joinedUsers: [...e.joinedUsers, user.id]
          };
        }
        return e;
      });

      localStorage.setItem('events', JSON.stringify(updatedEvents));
      
      setEvent(prev => prev ? {
        ...prev,
        attendeeCount: prev.attendeeCount + 1,
        joinedUsers: [...prev.joinedUsers, user.id]
      } : null);

      toast.success('Successfully joined the event!');
    } catch (error) {
      console.error('Error joining event:', error);
      toast.error('Failed to join event. Please try again.');
    } finally {
      setIsJoining(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-300 rounded w-1/4 mb-8"></div>
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <div className="h-8 bg-gray-300 rounded w-3/4 mb-4"></div>
              <div className="h-4 bg-gray-300 rounded w-1/2 mb-8"></div>
              <div className="space-y-4">
                <div className="h-4 bg-gray-300 rounded w-full"></div>
                <div className="h-4 bg-gray-300 rounded w-full"></div>
                <div className="h-4 bg-gray-300 rounded w-3/4"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Event Not Found</h1>
          <Link to="/events">
            <Button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
              Back to Events
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const eventDate = new Date(`${event.date}T${event.time}`);
  const isUserJoined = user && event.joinedUsers.includes(user.id);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100">
      <Navbar />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <Link 
            to="/events" 
            className="inline-flex items-center text-purple-600 hover:text-purple-700 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Events
          </Link>
        </div>

        <Card className="shadow-2xl bg-white border-0 overflow-hidden">
          <div className="bg-gradient-to-r from-purple-600 to-blue-600 h-32"></div>
          
          <CardHeader className="relative -mt-16 pb-6">
            <div className="bg-white rounded-2xl p-6 shadow-lg mx-6">
              <CardTitle className="text-3xl font-bold text-gray-900 mb-2">
                {event.title}
              </CardTitle>
              <p className="text-lg text-gray-600">
                Organized by <span className="font-semibold text-purple-600">{event.organizer}</span>
              </p>
            </div>
          </CardHeader>

          <CardContent className="px-8 pb-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-6">
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">Event Description</h3>
                  <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                    {event.description}
                  </p>
                </div>
              </div>

              <div className="space-y-6">
                <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Event Details</h3>
                  
                  <div className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <Calendar className="h-5 w-5 text-purple-600 mt-0.5" />
                      <div>
                        <p className="font-semibold text-gray-900">Date</p>
                        <p className="text-gray-600">{eventDate.toLocaleDateString('en-US', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}</p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-3">
                      <Clock className="h-5 w-5 text-blue-600 mt-0.5" />
                      <div>
                        <p className="font-semibold text-gray-900">Time</p>
                        <p className="text-gray-600">{eventDate.toLocaleTimeString('en-US', {
                          hour: 'numeric',
                          minute: '2-digit',
                          hour12: true
                        })}</p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-3">
                      <MapPin className="h-5 w-5 text-pink-600 mt-0.5" />
                      <div>
                        <p className="font-semibold text-gray-900">Location</p>
                        <p className="text-gray-600">{event.location}</p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-3">
                      <Users className="h-5 w-5 text-green-600 mt-0.5" />
                      <div>
                        <p className="font-semibold text-gray-900">Attendees</p>
                        <p className="text-gray-600">{event.attendeeCount} people going</p>
                      </div>
                    </div>
                  </div>
                </div>

                {user && (
                  <Button 
                    onClick={handleJoinEvent}
                    disabled={isJoining || isUserJoined}
                    className={`w-full h-12 font-semibold text-lg ${
                      isUserJoined 
                        ? 'bg-green-600 hover:bg-green-700' 
                        : 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700'
                    }`}
                  >
                    {isJoining ? (
                      <div className="flex items-center gap-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        Joining...
                      </div>
                    ) : isUserJoined ? (
                      <div className="flex items-center gap-2">
                        <Users className="h-5 w-5" />
                        Already Joined
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <UserPlus className="h-5 w-5" />
                        Join Event
                      </div>
                    )}
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EventDetails;
