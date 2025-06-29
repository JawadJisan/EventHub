
import { Users, Calendar, MapPin, Star } from 'lucide-react';

export const Stats = () => {
  const stats = [
    { icon: Users, label: 'Active Users', value: '10,000+', color: 'text-purple-600' },
    { icon: Calendar, label: 'Events Created', value: '2,500+', color: 'text-blue-600' },
    { icon: MapPin, label: 'Cities Covered', value: '150+', color: 'text-pink-600' },
    { icon: Star, label: 'User Rating', value: '4.9/5', color: 'text-yellow-600' },
  ];

  return (
    <div className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Trusted by Event Enthusiasts Worldwide
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Join our growing community of event creators and attendees who are making memorable experiences happen every day.
          </p>
        </div>
        
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="text-center group">
              <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-8 hover:shadow-lg transition-all duration-300 group-hover:scale-105">
                <div className={`inline-flex items-center justify-center w-12 h-12 rounded-lg bg-gradient-to-br from-gray-100 to-gray-200 mb-4 ${stat.color}`}>
                  <stat.icon className="h-6 w-6" />
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</div>
                <div className="text-gray-600 font-medium">{stat.label}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
