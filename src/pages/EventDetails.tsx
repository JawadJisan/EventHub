import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  Calendar,
  MapPin,
  Users,
  Clock,
  ArrowLeft,
  UserPlus,
  User,
  Mail,
  Badge,
  Edit,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Navbar } from "@/components/Navbar";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { getEventById, joinEvent } from "@/utils/apis";
import { format } from "date-fns";

interface User {
  _id: string;
  name: string;
  email: string;
  photoURL: string;
}

interface Event {
  _id: string;
  title: string;
  organizer: string;
  date: string;
  location: string;
  description: string;
  attendeeCount: number;
  attendees: User[];
  createdBy: User;
  createdAt: string;
}

const EventDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [event, setEvent] = useState<Event | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isJoining, setIsJoining] = useState(false);
  const [activeTab, setActiveTab] = useState("details");

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const eventData = await getEventById(id!);
        setEvent(eventData);
      } catch (error) {
        console.error("Error loading event:", error);
        toast.error("Error loading event details");
        navigate("/events");
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvent();
  }, [id, navigate]);

  const handleJoinEvent = async () => {
    if (!user || !event) return;

    if (event.attendees.some((attendee) => attendee._id === user.id)) {
      toast.info("You have already joined this event");
      return;
    }

    setIsJoining(true);

    try {
      const response = await joinEvent(event._id);
      setEvent(response.event);
      toast.success("Successfully joined the event!");
    } catch (error) {
      console.error("Error joining event:", error);
      toast.error(error.message || "Failed to join event");
    } finally {
      setIsJoining(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-300 rounded w-1/4 mb-8"></div>
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <div className="h-10 bg-gray-300 rounded w-3/4 mb-4"></div>
              <div className="h-6 bg-gray-300 rounded w-1/2 mb-8"></div>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-4">
                  <div className="h-6 bg-gray-300 rounded w-1/4 mb-4"></div>
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-300 rounded w-full"></div>
                    <div className="h-4 bg-gray-300 rounded w-full"></div>
                    <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="bg-gray-100 rounded-2xl p-6">
                    <div className="h-6 bg-gray-300 rounded w-1/3 mb-4"></div>
                    <div className="space-y-3">
                      {[...Array(4)].map((_, i) => (
                        <div key={i} className="flex items-center space-x-3">
                          <div className="h-4 w-4 bg-gray-300 rounded-full"></div>
                          <div className="h-4 bg-gray-300 rounded w-1/2"></div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="h-12 bg-gray-300 rounded"></div>
                </div>
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
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Event Not Found
          </h1>
          <Link to="/events">
            <Button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
              Back to Events
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const eventDate = new Date(event.date);
  const isUserJoined =
    user && event.attendees.some((attendee) => attendee._id === user.id);
  const isUserOrganizer = user && event.createdBy._id === user.id;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100">
      <Navbar />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <Link
            to="/events"
            className="inline-flex items-center text-purple-600 hover:text-purple-700 transition-colors font-medium"
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
              <CardDescription className="text-lg text-gray-600">
                Organized by{" "}
                <span className="font-semibold text-purple-600">
                  {event.organizer}
                </span>
              </CardDescription>
            </div>
          </CardHeader>

          <CardContent className="px-8 pb-8">
            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="w-full"
            >
              <TabsList className="grid w-full grid-cols-2 max-w-sm mb-8">
                <TabsTrigger value="details">Event Details</TabsTrigger>
                <TabsTrigger value="attendees">
                  Attendees ({event.attendeeCount})
                </TabsTrigger>
              </TabsList>

              <TabsContent value="details">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  <div className="lg:col-span-2 space-y-6">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-3">
                        Event Description
                      </h3>
                      <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                        {event.description}
                      </p>
                    </div>

                    <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-6">
                      <h3 className="text-lg font-bold text-gray-900 mb-4">
                        Event Information
                      </h3>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex items-start space-x-3">
                          <Calendar className="h-5 w-5 text-purple-600 mt-0.5 flex-shrink-0" />
                          <div>
                            <p className="font-semibold text-gray-900">Date</p>
                            <p className="text-gray-600">
                              {format(eventDate, "EEEE, MMMM d, yyyy")}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-start space-x-3">
                          <Clock className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                          <div>
                            <p className="font-semibold text-gray-900">Time</p>
                            <p className="text-gray-600">
                              {format(eventDate, "h:mm a")}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-start space-x-3">
                          <MapPin className="h-5 w-5 text-pink-600 mt-0.5 flex-shrink-0" />
                          <div>
                            <p className="font-semibold text-gray-900">
                              Location
                            </p>
                            <p className="text-gray-600">{event.location}</p>
                          </div>
                        </div>

                        <div className="flex items-start space-x-3">
                          <Users className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                          <div>
                            <p className="font-semibold text-gray-900">
                              Attendees
                            </p>
                            <p className="text-gray-600">
                              {event.attendeeCount} people going
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-6">
                      <h3 className="text-lg font-bold text-gray-900 mb-4">
                        Organizer
                      </h3>

                      <div className="flex items-center space-x-4">
                        {event.createdBy.photoURL ? (
                          <img
                            src={event.createdBy.photoURL}
                            alt={event.createdBy.name}
                            className="w-16 h-16 rounded-full object-cover"
                          />
                        ) : (
                          <div className="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16 flex items-center justify-center">
                            <User className="h-8 w-8 text-gray-400" />
                          </div>
                        )}

                        <div>
                          <h4 className="font-bold text-gray-900">
                            {event.createdBy.name}
                          </h4>
                          <p className="text-gray-600 flex items-center">
                            <Mail className="h-4 w-4 mr-1" />
                            {event.createdBy.email}
                          </p>
                        </div>
                      </div>
                    </div>

                    {!isUserOrganizer && user && (
                      <Button
                        onClick={handleJoinEvent}
                        disabled={isJoining || isUserJoined}
                        className={`w-full h-14 font-semibold text-lg ${
                          isUserJoined
                            ? "bg-green-600 hover:bg-green-700"
                            : "bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                        }`}
                      >
                        {isJoining ? (
                          <div className="flex items-center gap-2">
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
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

                    {isUserOrganizer && (
                      <div className="flex gap-3">
                        <Button
                          asChild
                          className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 h-14"
                        >
                          <Link to={`/update-event/${event._id}`}>
                            <Edit className="h-5 w-5 mr-2" />
                            Edit Event
                          </Link>
                        </Button>
                        {/* <Button variant="destructive" className="flex-1 h-14">
                          <Trash2 className="h-5 w-5 mr-2" />
                          Delete
                        </Button> */}
                      </div>
                    )}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="attendees">
                <Card className="bg-white border-0 shadow-none">
                  <CardHeader>
                    <CardTitle className="text-xl font-bold">
                      {event.attendeeCount} Attendees
                    </CardTitle>
                    <CardDescription>
                      People who have joined this event
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {event.attendees.length > 0 ? (
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Attendee</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead className="text-right">Status</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {event.attendees.map((attendee) => (
                            <TableRow key={attendee._id}>
                              <TableCell className="font-medium">
                                <div className="flex items-center space-x-3">
                                  {attendee.photoURL ? (
                                    <img
                                      src={attendee.photoURL}
                                      alt={attendee.name}
                                      className="w-10 h-10 rounded-full object-cover"
                                    />
                                  ) : (
                                    <div className="bg-gray-200 border-2 border-dashed rounded-xl w-10 h-10 flex items-center justify-center">
                                      <User className="h-5 w-5 text-gray-400" />
                                    </div>
                                  )}
                                  <span>{attendee.name}</span>
                                </div>
                              </TableCell>
                              <TableCell>{attendee.email}</TableCell>
                              <TableCell className="text-right">
                                <Badge variant="success">Joined</Badge>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    ) : (
                      <div className="text-center py-12">
                        <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-gray-600 mb-2">
                          No attendees yet
                        </h3>
                        <p className="text-gray-500">
                          Be the first to join this event!
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EventDetails;
