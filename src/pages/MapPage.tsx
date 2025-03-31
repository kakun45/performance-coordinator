
import React, { useState } from 'react';
import Layout from '@/components/Layout';
import VenueMap from '@/components/VenueMap';
import { useEvent } from '@/contexts/EventContext';
import { useAuth } from '@/contexts/AuthContext';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

const MapPage = () => {
  const { currentVenue, venues, performerLocations, updatePerformerLocation } = useEvent();
  const { user } = useAuth();
  const [showPerformers, setShowPerformers] = useState(false);
  const [isTracking, setIsTracking] = useState(false);
  
  const isPerformer = user?.role === 'performer';
  const isOrganizer = user?.role === 'organizer';

  // Mock function to simulate location updates for performers
  const toggleLocationTracking = () => {
    setIsTracking(!isTracking);
    
    if (!isTracking && isPerformer && user) {
      // Simulate location tracking by updating location every few seconds
      // In a real app, this would use the device's geolocation API
      const intervalId = setInterval(() => {
        const randomLat = 37.785 + (Math.random() - 0.5) * 0.005;
        const randomLng = -122.406 + (Math.random() - 0.5) * 0.005;
        
        updatePerformerLocation({
          performerId: user.id,
          name: user.name,
          latitude: randomLat,
          longitude: randomLng,
          section: user.section || 'Unknown',
          instrument: user.instrument || 'Unknown',
        });
      }, 5000);
      
      // For demo only - cleanup would happen in useEffect
      setTimeout(() => clearInterval(intervalId), 60000);
    }
  };

  if (!currentVenue) {
    return <div>Loading venue information...</div>;
  }

  return (
    <Layout title="Venue Map">
      <div className="py-6 space-y-6">
        <Tabs defaultValue="map" className="w-full">
          <TabsList className="w-full mb-4">
            <TabsTrigger value="map" className="flex-1">Map</TabsTrigger>
            <TabsTrigger value="info" className="flex-1">Venue Info</TabsTrigger>
          </TabsList>
          
          <TabsContent value="map" className="mt-0">
            <div className="space-y-4">
              {(isOrganizer || isPerformer) && (
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg">Performer Tracking</CardTitle>
                  </CardHeader>
                  <CardContent className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        {isPerformer ? (
                          <Label htmlFor="tracking">Share my location</Label>
                        ) : (
                          <Label htmlFor="tracking">Show performer locations</Label>
                        )}
                        <p className="text-sm text-muted-foreground">
                          {isPerformer 
                            ? "Let organizers see your position during the event" 
                            : "View where performers are currently located"
                          }
                        </p>
                      </div>
                      <Switch 
                        id="tracking" 
                        checked={isPerformer ? isTracking : showPerformers}
                        onCheckedChange={isPerformer ? toggleLocationTracking : setShowPerformers}
                      />
                    </div>
                  </CardContent>
                </Card>
              )}
              
              <VenueMap 
                venue={currentVenue} 
                performers={performerLocations}
                showPerformers={isOrganizer || showPerformers}
              />
            </div>
          </TabsContent>
          
          <TabsContent value="info" className="mt-0">
            <Card>
              <CardHeader>
                <CardTitle>{currentVenue.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-medium mb-2">Venue Information</h3>
                    <p className="text-sm text-muted-foreground">
                      Located in the heart of the city, {currentVenue.name} is a premier venue for performances and events.
                      Please refer to the map for detailed information about facilities.
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="font-medium mb-2">Parking Information</h3>
                    <p className="text-sm text-muted-foreground">
                      Parking is available in Lot A and Lot B. Handicap parking spaces are available 
                      near the main entrance. Additional street parking may be found nearby.
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="font-medium mb-2">Accessibility</h3>
                    <p className="text-sm text-muted-foreground">
                      The venue is fully accessible with ramps and elevators. 
                      Accessible seating areas are marked on the venue map.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default MapPage;
