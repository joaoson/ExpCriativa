import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  ChartBarBig,
  Settings,
  Users,
  BadgeDollarSign,
  HandHeart,
  MenuIcon,
  X,
} from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useAuth } from '../auth-context';

/* ------------------------------------------------------------------ */
/* Navigation items                                                    */
/* ------------------------------------------------------------------ */
type NavItem = { name: string; href: string; icon: React.ElementType };

const navItems: NavItem[] = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Analytics', href: '/analytics', icon: ChartBarBig },
  { name: 'Donors', href: '/donors', icon: Users },
  { name: 'Donations', href: '/donationsDash', icon: BadgeDollarSign },
  { name: 'Settings', href: '/settings', icon: Settings },
];

/* ------------------------------------------------------------------ */
/* Props                                                               */
/* ------------------------------------------------------------------ */
interface SidebarProps {
  organizationName?: string;
}

/* ------------------------------------------------------------------ */
/* Component                                                           */
/* ------------------------------------------------------------------ */
const Sidebar: React.FC<SidebarProps> = ({
  organizationName = 'Charity Organization',
}) => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const { logout } = useAuth();

  return (
    <div
      className={cn(
        'sticky top-0 left-0 flex h-screen flex-col border-r border-gray-200 bg-sidebar transition-all duration-300 dark:border-gray-700 dark:bg-gray-900',
        collapsed ? 'w-20' : 'w-64',
      )}
    >
      {/* ---------------------------------------------------------------- */}
      {/* Brand / collapse toggle                                          */}
      {/* ---------------------------------------------------------------- */}
      <div className="flex h-16 items-center justify-between border-b border-gray-200 p-4 dark:border-gray-700">
        <div
          className={cn(
            'flex items-center',
            collapsed ? 'w-full justify-center' : '',
          )}
        >
          {collapsed ? (
            <HandHeart className="text-lumen-700 dark:text-purple-400" size={28} />
          ) : (
            <span className="text-xl font-bold tracking-tight text-lumen-700 dark:text-purple-400">
              Navigation
            </span>
          )}
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setCollapsed((v) => !v)}
          className={cn(
            'hover:bg-lumen-100 hover:text-lumen-700 dark:hover:bg-gray-800',
            collapsed && 'mx-auto',
          )}
        >
          {collapsed ? <MenuIcon size={20} /> : <X size={20} />}
        </Button>
      </div>

      {/* ---------------------------------------------------------------- */}
      {/* Navigation links                                                 */}
      {/* ---------------------------------------------------------------- */}
      <nav className="flex-1 space-y-1.5 p-4">
        {navItems.map((item) => {
          const isActive = location.pathname === item.href;
          return (
            <Link
              key={item.name}
              to={item.href}
              className={cn(
                'flex items-center rounded-md py-2.5 px-3 transition-colors',
                isActive
                  ? 'bg-lumen-100 text-lumen-700 font-medium dark:bg-gray-800 dark:text-white'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-lumen-700 dark:text-gray-300 dark:hover:bg-gray-800/60 dark:hover:text-white',
              )}
            >
              <item.icon size={20} className="flex-shrink-0" />
              {!collapsed && <span className="ml-3">{item.name}</span>}
            </Link>
          );
        })}
      </nav>

      {/* ---------------------------------------------------------------- */}
      {/* Footer with user / logout                                        */}
      {/* ---------------------------------------------------------------- */}
      <div className="border-t border-gray-200 p-4 dark:border-gray-700">
        <div className="flex items-center">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-lumen-100 text-sm font-medium text-lumen-700 dark:bg-gray-700 dark:text-gray-100">
            CO
          </div>
          {!collapsed && (
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-700 dark:text-gray-100">
                {organizationName}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Admin</p>
              <p
                onClick={logout}
                className="cursor-pointer text-xs text-red-600 hover:text-red-700 dark:hover:text-red-500"
              >
                Logout
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
