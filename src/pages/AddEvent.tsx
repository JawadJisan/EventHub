
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Navbar } from '@/components/Navbar';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { CalendarDays, MapPin, Users, Plus } from 'lucide-react';

const AddEvent = () => {
  const [formData, setFormData] = useState({
    title: '',
    organizer: '',
    date: '',
    time: '',
    location: '',
    description: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Validate form
      if (!formData.title || !formData.organizer || !formData.date || !formData.time || !formData.location || !formData.description) {
        toast.error('Please fill in all fields');
        return;
      }

      // Create new event object
      const newEvent = {
        id: Date.now().toString(),
        ...formData,
        attendeeCount: 0,
        joinedUsers: [],
        createdBy: user?.id || '',
        createdAt: new Date().toISOString()
      };

      // Get existing events from localStorage
      const existingEvents = JSON.parse(localStorage.getItem('events') || '[]');
      
      // Add new event
      const updatedEvents = [...existingEvents, newEvent];
      
      // Save to localStorage
      localStorage.setItem('events', JSON.stringify(updatedEvents));

      toast.success('Event created successfully!');
      
      // Reset form
      setFormData({
        title: '',
        organizer: '',
        date: '',
        time: '',
        location: '',
        description: '',
      });

      // Navigate to events page
      navigate('/events');
    } catch (error) {
      toast.error('Failed to create event. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100">
      <Navbar />
      
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Create New Event</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Share your amazing event with the community. Fill in the details below to get started.
          </p>
        </div>

        <Card className="shadow-xl bg-white border-0">
          <CardHeader className="text-center pb-6">
            <CardTitle className="text-2xl font-bold text-gray-900 flex items-center justify-center gap-2">
              <Plus className="h-6 w-6 text-purple-600" />
              Event Details
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="title" className="text-sm font-medium text-gray-700">
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
                  <Label htmlFor="organizer" className="text-sm font-medium text-gray-700">
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
                  <Label htmlFor="date" className="text-sm font-medium text-gray-700 flex items-center gap-2">
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
                  <Label htmlFor="time" className="text-sm font-medium text-gray-700">
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
                <Label htmlFor="location" className="text-sm font-medium text-gray-700 flex items-center gap-2">
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
                <Label htmlFor="description" className="text-sm font-medium text-gray-700">
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

              <div className="pt-6">
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-12 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold text-lg"
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Creating Event...
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Plus className="h-5 w-5" />
                      Create Event
                    </div>
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

export default AddEvent;
