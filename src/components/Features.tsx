
import { Calendar, Users, MapPin, Search, Shield, Zap } from 'lucide-react';

export const Features = () => {
  const features = [
    {
      icon: Calendar,
      title: 'Easy Event Creation',
      description: 'Create and manage events with our intuitive interface. Set dates, locations, and details effortlessly.',
      color: 'text-purple-600'
    },
    {
      icon: Users,
      title: 'Community Building',
      description: 'Connect with like-minded individuals and build lasting relationships through shared experiences.',
      color: 'text-blue-600'
    },
    {
      icon: Search,
      title: 'Smart Discovery',
      description: 'Find events that match your interests with our advanced search and filtering capabilities.',
      color: 'text-pink-600'
    },
    {
      icon: MapPin,
      title: 'Location-Based',
      description: 'Discover exciting events happening in your area or explore opportunities in new locations.',
      color: 'text-indigo-600'
    },
    {
      icon: Shield,
      title: 'Secure Platform',
      description: 'Your data is protected with enterprise-grade security and privacy measures.',
      color: 'text-green-600'
    },
    {
      icon: Zap,
      title: 'Real-time Updates',
      description: 'Get instant notifications about event changes, new attendees, and important announcements.',
      color: 'text-yellow-600'
    }
  ];

  return (
    <div className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Everything You Need to Manage Events
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Our comprehensive platform provides all the tools you need to create, discover, and manage amazing events.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="group">
              <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-8 hover:shadow-xl transition-all duration-300 group-hover:scale-105 border border-gray-200">
                <div className={`inline-flex items-center justify-center w-14 h-14 rounded-xl bg-gradient-to-br from-white to-gray-50 mb-6 shadow-lg ${feature.color}`}>
                  <feature.icon className="h-7 w-7" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
