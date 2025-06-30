import { useState, useEffect, useCallback } from "react";
import {
  Calendar,
  MapPin,
  Users,
  Clock,
  Search,
  Filter,
  Plus,
  X,
  Edit,
  Trash2,
  Eye,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Navbar } from "@/components/Navbar";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { Link, useNavigate } from "react-router-dom";
import { getMyEvents, deleteEvent } from "@/utils/apis";
import Pagination from "@/components/Pagination";
import { debounce } from "lodash";
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
  _id: string;
  title: string;
  organizer: string;
  date: string;
  location: string;
  description: string;
  attendeeCount: number;
  createdBy: string;
  time: string;
  joined: boolean;
}

const MyEvents = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [dateFilter, setDateFilter] = useState("all");
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalEvents: 0,
    hasNextPage: false,
    hasPreviousPage: false,
  });
  const { user } = useAuth();
  const navigate = useNavigate();

  // Debounced fetch function
  const fetchEvents = useCallback(
    debounce(async (search: string, filter: string, page: number) => {
      try {
        setIsLoading(true);
        setError(null);

        const params: Record<string, string | number> = {
          page,
          limit: 6, // 6 events per page
          search,
          dateFilter: filter === "all" ? undefined : filter,
        };

        const data = await getMyEvents(params);

        // Add joined status for each event
        const eventsWithStatus = data.events.map((event: Event) => ({
          ...event,
          joined: user ? event.attendees?.includes(user.id) : false,
        }));

        setEvents(eventsWithStatus);
        setPagination({
          currentPage: data.pagination.currentPage,
          totalPages: data.pagination.totalPages,
          totalEvents: data.pagination.totalEvents,
          hasNextPage: data.pagination.hasNextPage,
          hasPreviousPage: data.pagination.hasPreviousPage,
        });
      } catch (err) {
        setError("Failed to load events. Please try again later.");
        console.error("Events fetch error:", err);
      } finally {
        setIsLoading(false);
      }
    }, 1000), // 2s debounce delay
    [user]
  );

  // Fetch events when filters or page change
  useEffect(() => {
    fetchEvents(searchTerm, dateFilter, pagination.currentPage);
  }, [searchTerm, dateFilter, pagination.currentPage, fetchEvents]);

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setPagination((prev) => ({ ...prev, currentPage: 1 }));
  };

  // Handle date filter change
  const handleFilterChange = (value: string) => {
    setDateFilter(value);
    setPagination((prev) => ({ ...prev, currentPage: 1 }));
  };

  // Clear all filters
  const clearFilters = () => {
    setSearchTerm("");
    setDateFilter("all");
    setPagination((prev) => ({ ...prev, currentPage: 1 }));
  };

  // Handle page change
  const handlePageChange = (page: number) => {
    setPagination((prev) => ({ ...prev, currentPage: page }));
  };

  // Handle join event
  const handleJoinEvent = async (eventId: string) => {
    if (!user) return;

    try {
      // In a real app, you would call an API endpoint to join the event
      // For now, we'll simulate the join action
      setEvents((prevEvents) =>
        prevEvents.map((event) => {
          if (event._id === eventId && !event.joined) {
            return {
              ...event,
              attendeeCount: event.attendeeCount + 1,
              joined: true,
            };
          }
          return event;
        })
      );

      toast.success("Successfully joined the event!");
    } catch (err) {
      toast.error("Failed to join event. Please try again.");
      console.error("Join event error:", err);
    }
  };

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  // Format time
  // const formatTime = (timeString: string) => {
  //   return new Date(`2000-01-01T${timeString}:00`).toLocaleTimeString("en-US", {
  //     hour: "numeric",
  //     minute: "2-digit",
  //     hour12: true,
  //   });
  // };

  // const formatTime = (timeString: string) => {
  //   // Convert UTC time to local time
  //   const date = new Date(`2000-01-01T${timeString}:00Z`);
  //   return date.toLocaleTimeString("en-US", {
  //     hour: "numeric",
  //     minute: "2-digit",
  //     hour12: true,
  //     timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  //   });
  // };

  function to12Hour(iso: string): string {
    // grab "HH:MM"
    const timePart = iso.split("T")[1].slice(0, 5);
    let [h, m] = timePart.split(":").map(Number);

    const suffix = h < 12 ? "AM" : "PM";
    h = h % 12 || 12; // convert 0→12, 13→1, etc.

    // pad minutes if needed
    const mm = m.toString().padStart(2, "0");
    return `${h}:${mm} ${suffix}`;
  }

  // Check if any filters are active
  const areFiltersActive = searchTerm || dateFilter !== "all";

  if (isLoading && !events.length) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100">
        <Navbar />
        <div className="flex items-center justify-center min-h-[70vh]">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-600"></div>
        </div>
      </div>
    );
  }

  const handleEditEvent = (eventId) => {
    // Navigate to edit page or open modal
    navigate(`/edit-event/${eventId}`);
  };

  // Handle event deletion
  const handleDeleteEvent = async (eventId: string) => {
    try {
      await deleteEvent(eventId);
      toast.success("Event deleted successfully");

      // Refresh events list
      fetchEvents(searchTerm, dateFilter, pagination.currentPage);
    } catch (error) {
      console.error("Delete event error:", error);
      toast.error(error.message || "Failed to delete event");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Discover Events
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Find amazing events happening around you. Join the community and
            create unforgettable memories.
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
                onChange={handleSearchChange}
                className="pl-10"
              />
            </div>

            <div className="flex gap-2">
              <Select value={dateFilter} onValueChange={handleFilterChange}>
                <SelectTrigger className="min-w-[180px]">
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
                  <SelectItem value="upcoming">Upcoming Events</SelectItem>
                  <SelectItem value="past">Past Events</SelectItem>
                </SelectContent>
              </Select>

              {areFiltersActive && (
                <Button
                  variant="outline"
                  onClick={clearFilters}
                  className="border-red-300 text-red-500 hover:bg-red-50 hover:text-red-600"
                >
                  <X className="mr-2 h-4 w-4" />
                  Clear Filters
                </Button>
              )}

              <Link to="/add-event">
                <Button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Event
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Filter Status */}
        {areFiltersActive && (
          <div className="mb-6 flex items-center flex-wrap gap-2">
            <Badge variant="secondary" className="py-1 px-3">
              {pagination.totalEvents} events found
            </Badge>

            {searchTerm && (
              <Badge className="py-1 px-3 flex items-center">
                Search: "{searchTerm}"
                <button
                  onClick={() => setSearchTerm("")}
                  className="ml-2 hover:text-red-500"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            )}

            {dateFilter !== "all" && (
              <Badge className="py-1 px-3 flex items-center">
                {dateFilter === "today" && "Today"}
                {dateFilter === "current-week" && "This Week"}
                {dateFilter === "last-week" && "Last Week"}
                {dateFilter === "current-month" && "This Month"}
                {dateFilter === "last-month" && "Last Month"}
                {dateFilter === "upcoming" && "Upcoming"}
                {dateFilter === "past" && "Past"}
                <button
                  onClick={() => setDateFilter("all")}
                  className="ml-2 hover:text-red-500"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            )}
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
            <div className="flex items-center">
              <X className="h-5 w-5 mr-2" />
              {error}
            </div>
          </div>
        )}

        {/* Events Grid */}
        {events.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {events.map((event) => (
                <Card
                  key={event._id}
                  className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-white border-0 shadow-lg flex flex-col h-full"
                >
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
                    <CardDescription className="text-sm text-gray-600">
                      by {event.createdBy.name}
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="flex-grow">
                    <p className="text-gray-700 mb-4 line-clamp-3">
                      {event.description}
                    </p>

                    <div className="space-y-2 mb-4">
                      <div className="flex items-center text-sm text-gray-600">
                        <Clock className="h-4 w-4 mr-2 text-purple-500" />
                        {to12Hour(event?.date)}
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <MapPin className="h-4 w-4 mr-2 text-purple-500" />
                        <span className="line-clamp-1">{event.location}</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <Users className="h-4 w-4 mr-2 text-purple-500" />
                        {event.attendeeCount} attendees
                      </div>
                    </div>
                  </CardContent>

                  <CardFooter className="mt-auto py-4 px-6 border-t">
                    <div className="flex justify-between w-full gap-2">
                      <Link to={`/events/${event._id}`} className="flex-1">
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full flex items-center justify-center border-blue-200 text-blue-600 hover:bg-blue-50"
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          View
                        </Button>
                      </Link>

                      <Link
                        to={`/update-event/${event._id}`}
                        className="flex-1"
                      >
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full border-green-200 text-green-600 hover:bg-green-50"
                        >
                          <Edit className="h-4 w-4 mr-1" />
                          Update
                        </Button>
                      </Link>

                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            className="w-full border-red-200 text-red-600 hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4 mr-1" />
                            Delete
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Event</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete "{event.title}"?
                              This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDeleteEvent(event._id)}
                              className="bg-red-600 hover:bg-red-700"
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </CardFooter>
                </Card>
              ))}
            </div>

            {/* Pagination */}
            <Pagination
              currentPage={pagination.currentPage}
              totalPages={pagination.totalPages}
              totalItems={pagination.totalEvents}
              onPageChange={handlePageChange}
            />
          </>
        ) : (
          <div className="text-center py-12 bg-white rounded-xl shadow-lg">
            <Calendar className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              {searchTerm || dateFilter !== "all"
                ? "No events found"
                : "No events yet"}
            </h3>
            <p className="text-gray-500 mb-6">
              {searchTerm || dateFilter !== "all"
                ? "Try adjusting your search or filter criteria"
                : "Be the first to create an amazing event!"}
            </p>

            {areFiltersActive ? (
              <Button onClick={clearFilters} variant="outline" className="mr-2">
                <X className="mr-2 h-4 w-4" />
                Clear Filters
              </Button>
            ) : null}

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

export default MyEvents;
