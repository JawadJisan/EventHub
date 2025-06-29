
import { useState } from 'react';
import { Mail, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

export const Newsletter = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast.error('Please enter your email address');
      return;
    }

    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      toast.success('Thank you for subscribing to our newsletter!');
      setEmail('');
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="py-20 bg-gradient-to-r from-purple-600 to-blue-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="max-w-3xl mx-auto">
          <Mail className="h-16 w-16 text-white mx-auto mb-8 opacity-90" />
          
          <h2 className="text-4xl font-bold text-white mb-4">
            Stay Updated with EventHub
          </h2>
          
          <p className="text-xl text-purple-100 mb-8 leading-relaxed">
            Get the latest event recommendations, platform updates, and exclusive offers delivered straight to your inbox.
          </p>
          
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <Input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 bg-white/20 backdrop-blur-sm border-white/30 text-white placeholder:text-purple-200 focus:ring-2 focus:ring-white/30"
            />
            <Button
              type="submit"
              disabled={isLoading}
              className="bg-white text-purple-600 hover:bg-gray-100 font-semibold px-8"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-purple-600"></div>
                  Subscribing...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Send className="h-4 w-4" />
                  Subscribe
                </div>
              )}
            </Button>
          </form>
          
          <p className="text-purple-200 text-sm mt-4">
            No spam, unsubscribe at any time. We respect your privacy.
          </p>
        </div>
      </div>
    </div>
  );
};
