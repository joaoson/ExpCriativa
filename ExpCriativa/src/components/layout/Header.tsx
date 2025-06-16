
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Bell, 
  Search, 
  LayoutDashboard, 
  ChartBarBig, 
  Settings, 
  Users, 
  BadgeDollarSign, 
  FileText,
  HandHeart, 
  MenuIcon,
  X,
  ChevronDown,
  User,
  LogOut,
  Moon,
  Sun,
  HelpCircle,
  MessageSquare
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

// Simulated auth context - replace with your actual implementation
const useAuth = () => ({
  logout: () => console.log('Logging out...'),
  user: { name: 'Charity Organization', role: 'Admin', avatar: 'CO' }
});

// Enhanced Header Component
const Header = () => {
  const [searchValue, setSearchValue] = useState('');
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const { logout, user } = useAuth();

  const handleSearch = (e) => {
    e.preventDefault();
    console.log('Searching for:', searchValue);
  };

  return (
    <header className="bg-white/95 backdrop-blur-sm h-16 border-b border-gray-200/50 flex items-center justify-between px-6 sticky top-0 z-50 shadow-sm">
      <div className="flex items-center gap-4 w-full">
        {/* Logo/Title */}
        <div className="flex items-center gap-3">
 
          <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent hidden sm:block">
            Organization Administration Page
          </h1>
        </div>
        
        {/* Search and Actions */}
        <div className="flex-1 flex justify-end items-center gap-3">
          {/* Search Bar */}
          
          
          {/* Quick Actions */}
          <div className="flex items-center gap-2">
            {/* Dark Mode Toggle */}
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setDarkMode(!darkMode)}
              className="relative hover:bg-gray-100 transition-colors"
            >
              {darkMode ? <Sun size={18} /> : <Moon size={18} />}
            </Button>

           

        
            {/* Notifications */}
            <Button variant="ghost" size="icon" className="relative hover:bg-gray-100 transition-colors">
              <Bell size={18} />
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white animate-pulse"></span>
            </Button>

            {/* Profile Dropdown */}
            <div className="relative">
              <Button 
                variant="ghost" 
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="flex items-center gap-2 px-3 hover:bg-gray-100 transition-colors"
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-sm font-semibold">
                  {user.avatar}
                </div>
                <ChevronDown size={16} className={`transition-transform ${showProfileMenu ? 'rotate-180' : ''}`} />
              </Button>

              {showProfileMenu && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-50">
                  <div className="px-4 py-3 border-b border-gray-100">
                    <p className="font-semibold text-gray-800">{user.name}</p>
                    <p className="text-sm text-gray-600">{user.role}</p>
                  </div>
                  <a
  href={`/organization/${localStorage.getItem("userId")}`}
>
                  <button className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                    <User size={16} />
                    Visit Organization Page
                  </button>
                  </a>
                  <button 
                    onClick={logout}
                    className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <LogOut size={16} />
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};


export default Header;
