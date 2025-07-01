import { useState, useEffect } from "react";
import { Calendar, MapPin, Users, Clock, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link, useNavigate } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";
import { getLatestEvents } from "@/utils/apis"; // Import API function

export const FeaturedEvents = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLatestEvents = async () => {
      try {
        setLoading(true);
        const eventsData = await getLatestEvents();
        setEvents(eventsData);
        setError(null);
      } catch (err) {
        setError("Failed to load featured events. Please try again later.");
        console.error("Featured events fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchLatestEvents();
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  if (loading) {
    return (
      <div className="py-16 bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <Skeleton className="h-10 w-1/3 mx-auto mb-6" />
            <Skeleton className="h-5 w-1/2 mx-auto" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {[1, 2, 3].map((i) => (
              <Card
                key={i}
                className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-white border-0 shadow-lg"
              >
                <CardHeader className="pb-4">
                  <div className="flex justify-between items-start mb-2">
                    <Skeleton className="h-6 w-20" />
                    <Skeleton className="h-5 w-24" />
                  </div>
                  <Skeleton className="h-7 w-4/5 mb-3" />
                  <Skeleton className="h-4 w-1/3" />
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 mb-6">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-5/6" />
                    <Skeleton className="h-4 w-4/5" />
                  </div>

                  <div className="space-y-3 mb-4">
                    <Skeleton className="h-4 w-1/2" />
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-4 w-2/5" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center">
            <Skeleton className="h-12 w-40 mx-auto" />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-16 bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Featured Events
            </h2>
          </div>

          <div className="text-center py-12 bg-white rounded-xl shadow-lg">
            <Calendar className="h-16 w-16 text-red-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              Error Loading Events
            </h3>
            <p className="text-gray-500 mb-6">{error}</p>
            <Button
              onClick={() => window.location.reload()}
              className="bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white"
            >
              Retry
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const getEventStatus = (eventDate: Date) => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const eventDay = new Date(
      eventDate.getFullYear(),
      eventDate.getMonth(),
      eventDate.getDate()
    );

    if (eventDay < today) {
      return { status: "Passed", class: "bg-gray-100 text-gray-800" };
    } else if (eventDay.getTime() === today.getTime()) {
      return { status: "Ongoing", class: "bg-blue-100 text-blue-800" };
    } else {
      return { status: "Upcoming", class: "bg-green-100 text-green-800" };
    }
  };

  return (
    <div className="py-16 bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Featured Events
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto mb-8">
            Discover the most popular and exciting events happening near you.
            Don't miss out on these amazing opportunities to connect and learn.
          </p>
        </div>

        {events.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {events.map((event) => {
              const eventDate = new Date(event.date);
              const { status, class: statusClass } = getEventStatus(eventDate);
              return (
                <Card
                  key={event._id}
                  className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-white border-0 shadow-lg"
                >
                  <CardHeader className="pb-4">
                    {/* <div className="flex justify-between items-start mb-2">
                      <Badge className="bg-blue-100 text-blue-800">Event</Badge>
                      <div className="flex items-center text-sm text-gray-500">
                        <Calendar className="h-4 w-4 mr-1" />
                        {formatDate(event.date)}
                      </div>
                    </div> */}
                    <div className="flex justify-between items-center mb-2">
                      {/* Status badge */}
                      <Badge
                        className={`${statusClass} font-medium text-sm px-3 py-1 rounded-lg`}
                      >
                        {status}
                      </Badge>

                      {/* Right section: Date + Eye icon */}
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        {/* Date */}
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-1 text-gray-400" />
                          <span>{formatDate(event.date)}</span>
                        </div>

                        {/* Eye button */}
                        <button
                          onClick={() => navigate(`/events/${event._id}`)}
                          className="text-gray-500 hover:text-purple-600 transition-colors p-1 rounded hover:bg-gray-100"
                          title="View details"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                    <CardTitle className="text-xl font-bold text-gray-900 group-hover:text-purple-600 transition-colors">
                      {event.title}
                    </CardTitle>
                    <p className="text-sm text-gray-600">
                      by {event.organizer}
                    </p>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700 mb-4 line-clamp-3">
                      {event.description}
                    </p>

                    <div className="space-y-2 mb-4">
                      <div className="flex items-center text-sm text-gray-600">
                        <Clock className="h-4 w-4 mr-2 text-purple-500" />
                        {formatTime(event.date)}
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
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-xl shadow-lg">
            <Calendar className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              No Featured Events
            </h3>
            <p className="text-gray-500 mb-6">
              Check back later for upcoming events
            </p>
          </div>
        )}

        <div className="text-center">
          <Link to="/events">
            <Button
              size="lg"
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-8 py-4"
            >
              View All Events
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};
