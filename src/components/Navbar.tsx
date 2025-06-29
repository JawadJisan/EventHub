
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Calendar, User, LogOut, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAuth } from '@/contexts/AuthContext';

export const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navItems = [
    { name: 'Home', path: '/' },
    { name: 'Events', path: '/events' },
    { name: 'Add Event', path: '/add-event' },
    { name: 'My Events', path: '/my-events' },
  ];

  return (
    <nav className="bg-white/95 backdrop-blur-sm shadow-lg sticky top-0 z-50 border-b border-purple-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 group">
            <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-2 rounded-lg group-hover:scale-110 transition-transform">
              <Calendar className="h-6 w-6 text-white" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              EventHub
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className="text-gray-700 hover:text-purple-600 px-3 py-2 text-sm font-medium transition-colors duration-200 hover:bg-purple-50 rounded-lg"
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* User Profile or Sign In */}
          <div className="hidden md:flex items-center">
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8 ring-2 ring-purple-200 hover:ring-purple-400 transition-all">
                      <AvatarImage src={user.photoURL || ''} alt={user.name} />
                      <AvatarFallback className="bg-gradient-to-r from-purple-500 to-blue-500 text-white">
                        {user.name.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <div className="flex flex-col space-y-1 p-2">
                    <p className="text-sm font-medium leading-none">{user.name}</p>
                    <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                  </div>
                  <DropdownMenuItem onClick={handleLogout} className="text-red-600 hover:text-red-700">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link to="/login">
                <Button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white">
                  Sign In
                </Button>
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 border-t border-gray-200">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-purple-600 hover:bg-purple-50 rounded-lg"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              {user ? (
                <Button 
                  onClick={handleLogout} 
                  variant="ghost" 
                  className="w-full justify-start text-red-600 hover:text-red-700"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Log out
                </Button>
              ) : (
                <Link to="/login" onClick={() => setIsMenuOpen(false)}>
                  <Button className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white">
                    Sign In
                  </Button>
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};
