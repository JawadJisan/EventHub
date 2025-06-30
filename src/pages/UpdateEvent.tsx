import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Navbar } from "@/components/Navbar";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { CalendarDays, MapPin } from "lucide-react";
import { getEventById, updateEvent } from "@/utils/apis";
import { format, parseISO } from "date-fns";

const UpdateEvent = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { token } = useAuth();
  const [formData, setFormData] = useState({
    title: "",
    organizer: "",
    date: "",
    time: "",
    location: "",
    description: "",
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const event = await getEventById(id!);

        // Convert UTC date to local date/time strings
        const eventDate = new Date(event.date);
        const localDate = format(eventDate, "yyyy-MM-dd");
        const localTime = format(eventDate, "HH:mm");

        setFormData({
          title: event.title,
          organizer: event.organizer,
          date: localDate,
          time: localTime,
          location: event.location,
          description: event.description,
        });
      } catch (error) {
        console.error("Error loading event:", error);
        toast.error("Failed to load event data");
        navigate("/events");
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvent();
  }, [id, navigate]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Validate form
      if (
        !formData.title ||
        !formData.organizer ||
        !formData.date ||
        !formData.time ||
        !formData.location ||
        !formData.description
      ) {
        toast.error("Please fill in all fields");
        setIsSubmitting(false);
        return;
      }

      // Update event
      await updateEvent(id!, formData);

      toast.success("Event updated successfully!");
      navigate("/my-events");
    } catch (error) {
      console.error("Event update failed:", error);
      toast.error(error.message || "Failed to update event. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100">
        <Navbar />
        <div className="flex items-center justify-center min-h-[70vh]">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100">
      <Navbar />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Update Event
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Edit your event details below
          </p>
        </div>

        <Card className="shadow-xl bg-white border-0">
          <CardHeader className="text-center pb-6">
            <CardTitle className="text-2xl font-bold text-gray-900 flex items-center justify-center gap-2">
              <CalendarDays className="h-6 w-6 text-purple-600" />
              Edit Event Details
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label
                    htmlFor="title"
                    className="text-sm font-medium text-gray-700"
                  >
                    Event Title *
                  </Label>
                  <Input
                    id="title"
                    name="title"
                    type="text"
                    placeholder="Enter event title"
                    value={formData.title}
                    onChange={handleInputChange}
                    className="h-12"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="organizer"
                    className="text-sm font-medium text-gray-700"
                  >
                    Organizer Name *
                  </Label>
                  <Input
                    id="organizer"
                    name="organizer"
                    type="text"
                    placeholder="Your name or organization"
                    value={formData.organizer}
                    onChange={handleInputChange}
                    className="h-12"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label
                    htmlFor="date"
                    className="text-sm font-medium text-gray-700 flex items-center gap-2"
                  >
                    <CalendarDays className="h-4 w-4 text-purple-600" />
                    Event Date *
                  </Label>
                  <Input
                    id="date"
                    name="date"
                    type="date"
                    value={formData.date}
                    onChange={handleInputChange}
                    className="h-12"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="time"
                    className="text-sm font-medium text-gray-700"
                  >
                    Event Time *
                  </Label>
                  <Input
                    id="time"
                    name="time"
                    type="time"
                    value={formData.time}
                    onChange={handleInputChange}
                    className="h-12"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="location"
                  className="text-sm font-medium text-gray-700 flex items-center gap-2"
                >
                  <MapPin className="h-4 w-4 text-purple-600" />
                  Location *
                </Label>
                <Input
                  id="location"
                  name="location"
                  type="text"
                  placeholder="Event venue or address"
                  value={formData.location}
                  onChange={handleInputChange}
                  className="h-12"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="description"
                  className="text-sm font-medium text-gray-700"
                >
                  Event Description *
                </Label>
                <Textarea
                  id="description"
                  name="description"
                  placeholder="Describe your event in detail..."
                  value={formData.description}
                  onChange={handleInputChange}
                  className="min-h-[120px] resize-none"
                  required
                />
              </div>

              <div className="pt-6 flex gap-4">
                <Button
                  type="button"
                  variant="outline"
                  className="w-full h-12 text-gray-700 font-semibold text-lg border-gray-300 hover:bg-gray-100"
                  onClick={() => navigate(-1)}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full h-12 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold text-lg"
                >
                  {isSubmitting ? (
                    <div className="flex items-center gap-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Updating Event...
                    </div>
                  ) : (
                    "Update Event"
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default UpdateEvent;
