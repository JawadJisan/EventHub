
import { Navbar } from '@/components/Navbar';
import { Hero } from '@/components/Hero';
import { FeaturedEvents } from '@/components/FeaturedEvents';
import { Stats } from '@/components/Stats';
import { Features } from '@/components/Features';
import { Testimonials } from '@/components/Testimonials';
import { Newsletter } from '@/components/Newsletter';
import { Footer } from '@/components/Footer';

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100">
      <Navbar />
      <Hero />
      <Stats />
      <FeaturedEvents />
      <Features />
      <Testimonials />
      <Newsletter />
      <Footer />
    </div>
  );
};

export default Index;
