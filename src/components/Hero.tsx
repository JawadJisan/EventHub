import { Link } from "react-router-dom";
import { Calendar, Users, MapPin, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Hero = () => {
  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-700">
      {/* Decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-white/5 rounded-full blur-3xl"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32">
        <div className="text-center">
          {/* <div className="flex justify-center mb-8">
            <div className="bg-white/20 backdrop-blur-sm rounded-full p-4 ring-1 ring-white/30 shadow-2xl">
              <Sparkles className="h-12 w-12 text-yellow-300" />
            </div>
          </div> */}

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6">
            Discover Amazing
            <span className="block bg-gradient-to-r from-yellow-300 via-pink-300 to-purple-300 bg-clip-text text-transparent">
              Events Near You
            </span>
          </h1>

          <p className="text-xl text-purple-100 mb-8 max-w-3xl mx-auto leading-relaxed">
            Join thousands of event enthusiasts. Create, discover, and attend
            incredible events that bring communities together. Your next
            unforgettable experience is just a click away.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
            <Link to="/events">
              <Button
                size="lg"
                variant="outline"
                className="border-2  hover:bg-white hover:text-purple-600 px-8 py-4 text-lg font-semibold"
              >
                Explore Events
              </Button>
            </Link>
            <Link to="/add-event">
              <Button
                size="lg"
                className="bg-white text-purple-600 hover:bg-gray-100 px-8 py-4 text-lg font-semibold shadow-lg"
              >
                Create Event
              </Button>
            </Link>
          </div>

          {/* Feature Icons */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 ring-1 ring-white/20 hover:bg-white/20 transition-all duration-300 shadow-lg">
                <Calendar className="h-8 w-8 text-purple-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-white mb-2">
                  Easy Event Creation
                </h3>
                <p className="text-purple-100 text-sm">
                  Create and manage events with our intuitive interface
                </p>
              </div>
            </div>
            <div className="text-center">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 ring-1 ring-white/20 hover:bg-white/20 transition-all duration-300 shadow-lg">
                <Users className="h-8 w-8 text-blue-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-white mb-2">
                  Connect with People
                </h3>
                <p className="text-purple-100 text-sm">
                  Meet like-minded individuals at amazing events
                </p>
              </div>
            </div>
            <div className="text-center">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 ring-1 ring-white/20 hover:bg-white/20 transition-all duration-300 shadow-lg">
                <MapPin className="h-8 w-8 text-pink-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-white mb-2">
                  Discover Local Events
                </h3>
                <p className="text-purple-100 text-sm">
                  Find exciting events happening in your area
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
