
import { useState, useEffect } from 'react';
import { Calendar, MapPin, Users, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';

export const FeaturedEvents = () => {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    // Get sample events from localStorage or create sample data
    const storedEvents = localStorage.getItem('events');
    if (storedEvents) {
      const allEvents = JSON.parse(storedEvents);
      // Show only the first 3 events
      setEvents(allEvents.slice(0, 3));
    } else {
      // Sample featured events
      const sampleEvents = [
        {
          id: '1',
          title: 'Tech Innovation Summit 2024',
          organizer: 'TechHub Community',
          date: '2024-02-15',
          time: '09:00',
          location: 'San Francisco, CA',
          description: 'Join industry leaders for a day of innovation, networking, and insights into the future of technology.',
          attendeeCount: 245,
          category: 'Technology'
        },
        {
          id: '2',
          title: 'Music Festival Under the Stars',
          organizer: 'Music Lovers Society',
          date: '2024-02-20',
          time: '18:00',
          location: 'Central Park, NYC',
          description: 'An enchanting evening of live music featuring local and international artists.',
          attendeeCount: 1200,
          category: 'Music'
        },
        {
          id: '3',
          title: 'Startup Pitch Competition',
          organizer: 'Entrepreneur Network',
          date: '2024-02-25',
          time: '14:00',
          location: 'Austin, TX',
          description: 'Watch emerging startups pitch their innovative ideas to top investors and mentors.',
          attendeeCount: 150,
          category: 'Business'
        }
      ];
      setEvents(sampleEvents);
    }
  }, []);

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      'Technology': 'bg-blue-100 text-blue-800',
      'Music': 'bg-purple-100 text-purple-800',
      'Business': 'bg-green-100 text-green-800',
      'default': 'bg-gray-100 text-gray-800'
    };
    return colors[category] || colors.default;
  };

  return (
    <div className="py-16 bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Featured Events
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto mb-8">
            Discover the most popular and exciting events happening near you. Don't miss out on these amazing opportunities to connect and learn.
          </p>
        </div>

        {events.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {events.map((event) => (
              <Card key={event.id} className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-white border-0 shadow-lg">
                <CardHeader className="pb-4">
                  <div className="flex justify-between items-start mb-2">
                    <Badge className={getCategoryColor(event.category)}>
                      {event.category}
                    </Badge>
                    <div className="flex items-center text-sm text-gray-500">
                      <Calendar className="h-4 w-4 mr-1" />
                      {formatDate(event.date)}
                    </div>
                  </div>
                  <CardTitle className="text-xl font-bold text-gray-900 group-hover:text-purple-600 transition-colors">
                    {event.title}
                  </CardTitle>
                  <p className="text-sm text-gray-600">by {event.organizer}</p>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 mb-4 line-clamp-3">{event.description}</p>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-sm text-gray-600">
                      <Clock className="h-4 w-4 mr-2 text-purple-500" />
                      {event.time}
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
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Calendar className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No Events Yet</h3>
            <p className="text-gray-500 mb-6">Be the first to create an amazing event!</p>
          </div>
        )}

        <div className="text-center">
          <Link to="/events">
            <Button size="lg" className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-8 py-4">
              View All Events
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};
