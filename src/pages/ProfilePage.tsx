
import React from 'react';
import Layout from '@/components/Layout';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { CalendarIcon, MapPinIcon, BellIcon, LogOutIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

const ProfilePage = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  
  if (!user) {
    navigate('/login');
    return null;
  }
  
  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/login');
  };
  
  // Get initials for avatar
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase();
  };
  
  return (
    <Layout title="My Profile">
      <div className="py-6 space-y-6">
        <Card className="border-0 bg-gradient-to-br from-navy-800 to-navy-900 text-white overflow-hidden">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <Avatar className="h-16 w-16 border-2 border-white">
                <AvatarFallback className="bg-primary text-primary-foreground">
                  {getInitials(user.name)}
                </AvatarFallback>
              </Avatar>
              <div>
                <h2 className="text-2xl font-semibold">{user.name}</h2>
                <Badge className="mt-1 bg-gold-500 text-navy-900">
                  {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {(user.role === 'performer' || user.role === 'organizer') && (
          <Card>
            <CardHeader>
              <CardTitle>Organization Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {user.bandId && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Band/Organization</p>
                  <p>{user.bandId}</p>
                </div>
              )}
              
              {user.role === 'performer' && (
                <>
                  {user.section && (
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Section</p>
                      <p>{user.section}</p>
                    </div>
                  )}
                  
                  {user.instrument && (
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Instrument</p>
                      <p>{user.instrument}</p>
                    </div>
                  )}
                </>
              )}
            </CardContent>
          </Card>
        )}
        
        <Card>
          <CardHeader>
            <CardTitle>App Sections</CardTitle>
            <CardDescription>Quick navigation to main features</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <Button variant="outline" className="justify-start" onClick={() => navigate('/schedule')}>
              <CalendarIcon className="mr-2 h-4 w-4" />
              Event Schedule
            </Button>
            
            <Button variant="outline" className="justify-start" onClick={() => navigate('/map')}>
              <MapPinIcon className="mr-2 h-4 w-4" />
              Venue Map
            </Button>
            
            <Button variant="outline" className="justify-start" onClick={() => navigate('/announcements')}>
              <BellIcon className="mr-2 h-4 w-4" />
              Announcements & Updates
            </Button>
          </CardContent>
          <CardFooter className="border-t pt-6">
            <Button variant="outline" className="w-full text-destructive hover:text-destructive" onClick={handleLogout}>
              <LogOutIcon className="mr-2 h-4 w-4" />
              Log Out
            </Button>
          </CardFooter>
        </Card>
      </div>
    </Layout>
  );
};

export default ProfilePage;
