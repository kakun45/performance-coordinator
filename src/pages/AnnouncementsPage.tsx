
import React, { useState } from 'react';
import Layout from '@/components/Layout';
import { useEvent } from '@/contexts/EventContext';
import { useAuth } from '@/contexts/AuthContext';
import AnnouncementCard from '@/components/AnnouncementCard';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";

const AnnouncementsPage = () => {
  const { announcements, addAnnouncement } = useEvent();
  const { user } = useAuth();
  
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [audience, setAudience] = useState<'all' | 'performers' | 'spectators' | 'organizers'>('all');
  const [open, setOpen] = useState(false);
  
  const isOrganizer = user?.role === 'organizer';
  
  // Filter announcements based on user role
  const filteredAnnouncements = announcements.filter(announcement => {
    if (announcement.audience === 'all') return true;
    if (!user) return false;
    
    switch (user.role) {
      case 'performer':
        return announcement.audience === 'performers';
      case 'spectator':
        return announcement.audience === 'spectators';
      case 'organizer':
        return true; // Organizers can see all announcements
      default:
        return false;
    }
  });
  
  const handleSubmit = () => {
    if (!title || !message) return;
    
    addAnnouncement({
      title,
      message,
      audience
    });
    
    // Reset form
    setTitle('');
    setMessage('');
    setAudience('all');
    setOpen(false);
  };

  return (
    <Layout title="Announcements">
      <div className="py-6 space-y-6">
        {/* Announcements Header */}
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-semibold">Latest Updates</h2>
          
          {isOrganizer && (
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button>New Announcement</Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Create Announcement</DialogTitle>
                  <DialogDescription>
                    Send an announcement to participants. This will be displayed in their updates feed.
                  </DialogDescription>
                </DialogHeader>
                
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <label htmlFor="title" className="text-sm font-medium">Title</label>
                    <Input
                      id="title"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="e.g., Schedule Update"
                    />
                  </div>
                  
                  <div className="grid gap-2">
                    <label htmlFor="message" className="text-sm font-medium">Message</label>
                    <Textarea
                      id="message"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Enter your announcement message"
                      rows={4}
                    />
                  </div>
                  
                  <div className="grid gap-2">
                    <label htmlFor="audience" className="text-sm font-medium">Audience</label>
                    <Select value={audience} onValueChange={(value: any) => setAudience(value)}>
                      <SelectTrigger id="audience">
                        <SelectValue placeholder="Select audience" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Everyone</SelectItem>
                        <SelectItem value="performers">Performers Only</SelectItem>
                        <SelectItem value="spectators">Spectators Only</SelectItem>
                        <SelectItem value="organizers">Organizers Only</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <DialogFooter>
                  <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
                  <Button onClick={handleSubmit}>Send Announcement</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )}
        </div>
        
        {/* Announcements List */}
        {filteredAnnouncements.length > 0 ? (
          <ScrollArea className="h-[calc(100vh-200px)]">
            <div className="pr-4 space-y-4">
              {filteredAnnouncements.map((announcement) => (
                <AnnouncementCard key={announcement.id} announcement={announcement} />
              ))}
            </div>
          </ScrollArea>
        ) : (
          <Card className="border-dashed">
            <CardContent className="flex flex-col items-center justify-center py-10">
              <p className="text-muted-foreground text-center">
                No announcements yet. Check back later for updates.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </Layout>
  );
};

export default AnnouncementsPage;
