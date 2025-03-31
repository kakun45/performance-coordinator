
import React, { useState } from 'react';
import Layout from '@/components/Layout';
import { useEvent } from '@/contexts/EventContext';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import EventCard from '@/components/EventCard';
import { format, isSameDay, parseISO } from 'date-fns';
import { useAuth } from '@/contexts/AuthContext';

const SchedulePage = () => {
  const { events } = useEvent();
  const { user } = useAuth();
  const [selectedEvent, setSelectedEvent] = useState(events[0]);
  const [openDialog, setOpenDialog] = useState(false);
  
  const isOrganizer = user?.role === 'organizer';
  
  // Group events by date
  const eventsByDate = events.reduce((acc, event) => {
    const date = format(parseISO(event.startTime), 'yyyy-MM-dd');
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(event);
    return acc;
  }, {} as Record<string, typeof events>);
  
  // Sort dates
  const dates = Object.keys(eventsByDate).sort();
  
  // Get today's events
  const today = format(new Date(), 'yyyy-MM-dd');
  const todayEvents = eventsByDate[today] || [];
  
  // Get current and upcoming events
  const now = new Date();
  const currentEvents = todayEvents.filter(event => {
    const start = parseISO(event.startTime);
    const end = parseISO(event.endTime);
    return start <= now && end >= now;
  });
  
  const upcomingEvents = todayEvents.filter(event => {
    const start = parseISO(event.startTime);
    return start > now && isSameDay(start, now);
  });

  return (
    <Layout title="Schedule">
      <div className="py-6 space-y-6">
        {/* Now & Upcoming Section */}
        <section>
          <h2 className="text-2xl font-semibold mb-4">Today's Schedule</h2>
          
          {currentEvents.length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-medium mb-3 text-primary">Happening Now</h3>
              <div className="space-y-4">
                {currentEvents.map((event) => (
                  <EventCard 
                    key={event.id} 
                    event={event} 
                    onClick={() => {
                      setSelectedEvent(event);
                      setOpenDialog(true);
                    }}
                  />
                ))}
              </div>
            </div>
          )}
          
          {upcomingEvents.length > 0 && (
            <div>
              <h3 className="text-lg font-medium mb-3">Coming Up Next</h3>
              <div className="space-y-4">
                {upcomingEvents.slice(0, 3).map((event) => (
                  <EventCard 
                    key={event.id} 
                    event={event} 
                    onClick={() => {
                      setSelectedEvent(event);
                      setOpenDialog(true);
                    }}
                  />
                ))}
              </div>
            </div>
          )}
          
          {currentEvents.length === 0 && upcomingEvents.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No more events scheduled for today.
            </div>
          )}
        </section>
        
        {/* Full Schedule Section */}
        <section>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-semibold">Full Schedule</h2>
            {isOrganizer && (
              <Button variant="outline">
                Manage Events
              </Button>
            )}
          </div>
          
          <Tabs defaultValue={dates[0]} className="w-full">
            <TabsList className="w-full mb-4 overflow-x-auto flex-wrap">
              {dates.map((date) => (
                <TabsTrigger key={date} value={date} className="flex-1">
                  {format(parseISO(date), 'MMM d')}
                </TabsTrigger>
              ))}
            </TabsList>
            
            {dates.map((date) => (
              <TabsContent key={date} value={date} className="mt-0">
                <ScrollArea className="h-[400px] pr-4">
                  <div className="space-y-4">
                    {eventsByDate[date]
                      .sort((a, b) => parseISO(a.startTime).getTime() - parseISO(b.startTime).getTime())
                      .map((event) => (
                        <EventCard 
                          key={event.id} 
                          event={event} 
                          onClick={() => {
                            setSelectedEvent(event);
                            setOpenDialog(true);
                          }}
                        />
                      ))
                    }
                  </div>
                </ScrollArea>
              </TabsContent>
            ))}
          </Tabs>
        </section>
        
        {/* Event Detail Dialog */}
        <Dialog open={openDialog} onOpenChange={setOpenDialog}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>{selectedEvent?.name}</DialogTitle>
              <DialogDescription>
                {format(parseISO(selectedEvent?.startTime), 'EEEE, MMMM d, yyyy')}
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-1">Time</h4>
                <p>
                  {format(parseISO(selectedEvent?.startTime), 'h:mm a')} - {format(parseISO(selectedEvent?.endTime), 'h:mm a')}
                </p>
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-1">Location</h4>
                <p>{selectedEvent?.location}</p>
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-1">Description</h4>
                <p className="text-sm">{selectedEvent?.description}</p>
              </div>
              
              <div className="pt-4">
                <Button className="w-full" variant="outline" onClick={() => setOpenDialog(false)}>
                  Close
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
};

export default SchedulePage;
