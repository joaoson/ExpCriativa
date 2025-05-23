import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  ChartBarBig, 
  Settings, 
  Users, 
  BadgeDollarSign, 
  ChartLine,
  HandHeart, 
  MenuIcon,
  X,
  FileText
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useAuth } from '../auth-context'; 

type NavItem = {
  name: string;
  href: string;
  icon: React.ElementType;
};

const navItems: NavItem[] = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Analytics', href: '/analytics', icon: ChartBarBig },
  { name: 'Donors', href: '/donors', icon: Users },
  { name: 'Donations', href: '/donations', icon: BadgeDollarSign },
  { name: 'Reports', href: '/reports', icon: FileText },
  { name: 'Settings', href: '/settings', icon: Settings },
];

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const { logout } = useAuth();

  return (
    <div 
      className={cn(
        "bg-sidebar transition-all duration-300 flex flex-col h-screen border-r border-gray-200 sticky top-0 left-0",
        collapsed ? "w-20" : "w-64"
      )}
    >
      <div className="flex items-center justify-between p-4 h-16 border-b border-gray-200">
        <div className={cn("flex items-center", collapsed ? "justify-center w-full" : "")}>
          {!collapsed && (
            <span className="font-bold text-xl tracking-tight text-lumen-700">Charity</span>
          )}
          {collapsed && (
            <HandHeart className="text-lumen-700" size={28} />
          )}
        </div>
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => setCollapsed(!collapsed)}
          className={cn("hover:bg-lumen-100 hover:text-lumen-700", collapsed ? "mx-auto" : "")}
        >
          {collapsed ? <MenuIcon size={20} /> : <X size={20} />}
        </Button>
      </div>

      <nav className="flex-1 p-4 space-y-1.5">
        {navItems.map((item) => {
          const isActive = location.pathname === item.href;
          return (
            <Link
              key={item.name}
              to={item.href}
              className={cn(
                "flex items-center py-2.5 px-3 rounded-md transition-colors",
                isActive 
                  ? "bg-lumen-100 text-lumen-700 font-medium" 
                  : "text-gray-600 hover:bg-gray-100 hover:text-lumen-700"
              )}
            >
              <item.icon size={20} className="flex-shrink-0" />
              {!collapsed && <span className="ml-3">{item.name}</span>}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center">
          <div className="w-8 h-8 rounded-full bg-lumen-100 flex items-center justify-center">
            <span className="font-medium text-sm text-lumen-700">CO</span>
          </div>
          {!collapsed && (
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-700">Charity Organization</p>
              <p className="text-xs text-gray-500">Admin</p>
              <p onClick={logout} className="text-xs text-red-500">Logout</p>
            </div>
            
          )}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;