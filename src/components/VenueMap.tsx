
import React, { useState } from 'react';
import { Venue, VenuePoint, PerformerLocation } from '@/contexts/EventContext';
import { MapPinIcon, User, Coffee, Users, Utensils, DoorOpen, PackageOpen, Info, Car } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

interface VenueMapProps {
  venue: Venue;
  performers?: PerformerLocation[];
  showPerformers?: boolean;
}

const VenueMap: React.FC<VenueMapProps> = ({ venue, performers = [], showPerformers = false }) => {
  const [selectedPoint, setSelectedPoint] = useState<VenuePoint | null>(null);
  const [selectedPerformer, setSelectedPerformer] = useState<PerformerLocation | null>(null);

  const getIconForPointType = (type: VenuePoint['type']) => {
    switch (type) {
      case 'entrance':
        return <DoorOpen className="h-5 w-5 text-green-500" />;
      case 'exit':
        return <PackageOpen className="h-5 w-5 text-red-500" />;
      case 'restroom':
        return <Users className="h-5 w-5 text-blue-500" />;
      case 'food':
        return <Utensils className="h-5 w-5 text-yellow-500" />;
      case 'seating':
        return <Users className="h-5 w-5 text-purple-500" />;
      case 'stage':
        return <Users className="h-5 w-5 text-indigo-500" />;
      case 'parking':
        return <Car className="h-5 w-5 text-slate-500" />;
      case 'info':
        return <Info className="h-5 w-5 text-teal-500" />;
      default:
        return <MapPinIcon className="h-5 w-5 text-gray-500" />;
    }
  };

  // For demo purposes, simulate a map with points at different positions
  // In a real app, this would be replaced with a proper mapping solution
  return (
    <div className="w-full">
      <div className="relative bg-blue-50 rounded-lg border border-blue-100 overflow-hidden" style={{ height: '360px' }}>
        {/* Simulated map */}
        <div className="absolute inset-0 p-4">
          <div className="bg-blue-200/30 w-full h-full rounded-lg flex items-center justify-center">
            <div className="text-center text-blue-500 font-semibold">
              Interactive Venue Map
            </div>
          </div>

          {/* Venue Points */}
          {venue.points.map((point) => (
            <div
              key={point.id}
              className="absolute p-1.5 rounded-full bg-white shadow-md cursor-pointer transform hover:scale-110 transition-all z-10"
              style={{
                left: `${(point.longitude + 122.41) * 1000 % 80}%`,
                top: `${(point.latitude - 37.78) * 1000 % 80}%`
              }}
              onClick={() => {
                setSelectedPoint(point);
                setSelectedPerformer(null);
              }}
            >
              {getIconForPointType(point.type)}
            </div>
          ))}

          {/* Performer Locations */}
          {showPerformers && performers.map((performer) => (
            <div
              key={performer.performerId}
              className="absolute p-1 rounded-full bg-primary shadow-md cursor-pointer transform hover:scale-110 transition-all z-20"
              style={{
                left: `${(performer.longitude + 122.41) * 1000 % 80}%`,
                top: `${(performer.latitude - 37.78) * 1000 % 80}%`
              }}
              onClick={() => {
                setSelectedPerformer(performer);
                setSelectedPoint(null);
              }}
            >
              <User className="h-4 w-4 text-white" />
            </div>
          ))}
        </div>

        {/* Info Panel */}
        {(selectedPoint || selectedPerformer) && (
          <div className="absolute right-4 bottom-4 w-56 bg-white rounded-lg shadow-lg p-3 animate-slide-in">
            {selectedPoint && (
              <>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center">
                    {getIconForPointType(selectedPoint.type)}
                    <h3 className="font-semibold ml-2">{selectedPoint.name}</h3>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {selectedPoint.type}
                  </Badge>
                </div>
                <p className="text-sm text-gray-600 mb-1">{selectedPoint.description}</p>
              </>
            )}

            {selectedPerformer && (
              <>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center">
                    <User className="h-4 w-4 text-primary" />
                    <h3 className="font-semibold ml-2">{selectedPerformer.name}</h3>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {selectedPerformer.section}
                  </Badge>
                </div>
                <p className="text-sm text-gray-600 mb-1">{selectedPerformer.instrument}</p>
                <p className="text-xs text-gray-400">
                  Last updated: {new Date(selectedPerformer.lastUpdated).toLocaleTimeString()}
                </p>
              </>
            )}
          </div>
        )}
      </div>

      {/* List of Map Points */}
      <div className="mt-4 border rounded-lg p-3 bg-white">
        <h3 className="font-semibold mb-2">Venue Facilities</h3>
        <ScrollArea className="h-32">
          <div className="space-y-1">
            {venue.points.map((point) => (
              <div 
                key={point.id}
                className="flex items-center p-2 hover:bg-muted rounded-md cursor-pointer"
                onClick={() => {
                  setSelectedPoint(point);
                  setSelectedPerformer(null);
                }}
              >
                {getIconForPointType(point.type)}
                <span className="ml-2 text-sm">{point.name}</span>
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
};

export default VenueMap;
