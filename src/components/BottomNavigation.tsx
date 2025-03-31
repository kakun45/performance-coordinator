
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { CalendarIcon, MapPinIcon, BellIcon, UserIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';

const BottomNavigation = () => {
  const location = useLocation();
  const { user } = useAuth();
  const isPerformerOrOrganizer = user && (user.role === 'performer' || user.role === 'organizer');

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 h-16 bg-white border-t flex items-center justify-around px-2 z-50">
      <Link
        to="/schedule"
        className={cn(
          "nav-item text-muted-foreground",
          isActive('/schedule') && "text-primary"
        )}
      >
        <CalendarIcon className="nav-icon" />
        <span>Schedule</span>
      </Link>
      
      <Link
        to="/map"
        className={cn(
          "nav-item text-muted-foreground",
          isActive('/map') && "text-primary"
        )}
      >
        <MapPinIcon className="nav-icon" />
        <span>Map</span>
      </Link>
      
      <Link
        to="/announcements"
        className={cn(
          "nav-item text-muted-foreground",
          isActive('/announcements') && "text-primary"
        )}
      >
        <BellIcon className="nav-icon" />
        <span>Updates</span>
      </Link>
      
      <Link
        to="/profile"
        className={cn(
          "nav-item text-muted-foreground",
          isActive('/profile') && "text-primary"
        )}
      >
        <UserIcon className="nav-icon" />
        <span>Profile</span>
      </Link>
    </div>
  );
};

export default BottomNavigation;
