
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { toast } from "sonner";

// Event types
export interface Event {
  id: string;
  name: string;
  startTime: string;
  endTime: string;
  location: string;
  description: string;
  bandId: string;
}

// Announcement types
export interface Announcement {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  audience: 'all' | 'performers' | 'spectators' | 'organizers';
}

// Location types
export interface PerformerLocation {
  performerId: string;
  name: string;
  latitude: number;
  longitude: number;
  section: string;
  instrument: string;
  lastUpdated: string;
}

export interface Venue {
  id: string;
  name: string;
  mapImageUrl: string;
  points: VenuePoint[];
}

export interface VenuePoint {
  id: string;
  name: string;
  type: 'entrance' | 'exit' | 'restroom' | 'food' | 'seating' | 'stage' | 'parking' | 'info';
  latitude: number;
  longitude: number;
  description?: string;
}

// Context type
interface EventContextType {
  events: Event[];
  announcements: Announcement[];
  performerLocations: PerformerLocation[];
  venues: Venue[];
  currentVenue: Venue | null;
  addEvent: (event: Omit<Event, 'id'>) => void;
  updateEvent: (event: Event) => void;
  deleteEvent: (eventId: string) => void;
  addAnnouncement: (announcement: Omit<Announcement, 'id' | 'timestamp'>) => void;
  updatePerformerLocation: (location: Omit<PerformerLocation, 'lastUpdated'>) => void;
  setCurrentVenue: (venueId: string) => void;
}

// Create context
const EventContext = createContext<EventContextType | undefined>(undefined);

// Mock data
const mockEvents: Event[] = [
  {
    id: '1',
    name: 'Opening Ceremony',
    startTime: '2023-10-01T09:00:00',
    endTime: '2023-10-01T10:00:00',
    location: 'Main Stage',
    description: 'Welcome to the annual marching band competition!',
    bandId: 'all'
  },
  {
    id: '2',
    name: 'Northside High School Performance',
    startTime: '2023-10-01T10:30:00',
    endTime: '2023-10-01T11:00:00',
    location: 'Field A',
    description: 'Northside High School Marching Band performs their new routine "Celestial Journey"',
    bandId: 'band1'
  },
  {
    id: '3',
    name: 'Westlake Academy Performance',
    startTime: '2023-10-01T11:30:00',
    endTime: '2023-10-01T12:00:00',
    location: 'Field A',
    description: 'Westlake Academy Marching Band performs "Echoes of History"',
    bandId: 'band2'
  },
  {
    id: '4',
    name: 'Lunch Break',
    startTime: '2023-10-01T12:00:00',
    endTime: '2023-10-01T13:00:00',
    location: 'Food Court',
    description: 'Break for lunch. Food available at the food court.',
    bandId: 'all'
  },
  {
    id: '5',
    name: 'Eastridge High School Performance',
    startTime: '2023-10-01T13:30:00',
    endTime: '2023-10-01T14:00:00',
    location: 'Field A',
    description: 'Eastridge High School Marching Band performs "Rhythms of the World"',
    bandId: 'band3'
  },
  {
    id: '6',
    name: 'Awards Ceremony',
    startTime: '2023-10-01T16:00:00',
    endTime: '2023-10-01T17:00:00',
    location: 'Main Stage',
    description: 'Presentation of awards to the best performing bands.',
    bandId: 'all'
  }
];

const mockAnnouncements: Announcement[] = [
  {
    id: '1',
    title: 'Welcome!',
    message: 'Welcome to the annual marching band competition! We\'re excited to have you here.',
    timestamp: new Date().toISOString(),
    audience: 'all'
  },
  {
    id: '2',
    title: 'Schedule Update',
    message: 'Due to light rain, performances will start 15 minutes later than scheduled.',
    timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    audience: 'all'
  },
  {
    id: '3',
    title: 'Performers Preparation',
    message: 'All performers from Northside High School, please gather at the warm-up area in 10 minutes.',
    timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
    audience: 'performers'
  }
];

const mockPerformerLocations: PerformerLocation[] = [
  {
    performerId: 'p1',
    name: 'Jane Smith',
    latitude: 37.7858,
    longitude: -122.4064,
    section: 'Brass',
    instrument: 'Trumpet',
    lastUpdated: new Date().toISOString()
  },
  {
    performerId: 'p2',
    name: 'John Doe',
    latitude: 37.7868,
    longitude: -122.4074,
    section: 'Percussion',
    instrument: 'Snare Drum',
    lastUpdated: new Date().toISOString()
  }
];

const mockVenues: Venue[] = [
  {
    id: 'v1',
    name: 'Memorial Stadium',
    mapImageUrl: '/stadium-map.png',
    points: [
      {
        id: 'p1',
        name: 'Main Entrance',
        type: 'entrance',
        latitude: 37.7848,
        longitude: -122.4054,
        description: 'Main entrance to the stadium'
      },
      {
        id: 'p2',
        name: 'Restrooms',
        type: 'restroom',
        latitude: 37.7858,
        longitude: -122.4064,
        description: 'Public restrooms'
      },
      {
        id: 'p3',
        name: 'Food Court',
        type: 'food',
        latitude: 37.7868,
        longitude: -122.4074,
        description: 'Various food vendors'
      },
      {
        id: 'p4',
        name: 'Main Stage',
        type: 'stage',
        latitude: 37.7878,
        longitude: -122.4084,
        description: 'Main performance area'
      },
      {
        id: 'p5',
        name: 'Parking Lot A',
        type: 'parking',
        latitude: 37.7838,
        longitude: -122.4044,
        description: 'Main parking area'
      }
    ]
  }
];

// Provider component
export const EventProvider = ({ children }: { children: ReactNode }) => {
  const [events, setEvents] = useState<Event[]>(mockEvents);
  const [announcements, setAnnouncements] = useState<Announcement[]>(mockAnnouncements);
  const [performerLocations, setPerformerLocations] = useState<PerformerLocation[]>(mockPerformerLocations);
  const [venues, setVenues] = useState<Venue[]>(mockVenues);
  const [currentVenue, setCurrentVenue] = useState<Venue | null>(mockVenues[0]);

  const addEvent = (eventData: Omit<Event, 'id'>) => {
    const newEvent = {
      ...eventData,
      id: Date.now().toString(),
    };
    setEvents([...events, newEvent]);
    toast.success("Event added successfully!");
  };

  const updateEvent = (updatedEvent: Event) => {
    setEvents(events.map(event => 
      event.id === updatedEvent.id ? updatedEvent : event
    ));
    toast.success("Event updated successfully!");
  };

  const deleteEvent = (eventId: string) => {
    setEvents(events.filter(event => event.id !== eventId));
    toast.success("Event deleted successfully!");
  };

  const addAnnouncement = (announcementData: Omit<Announcement, 'id' | 'timestamp'>) => {
    const newAnnouncement = {
      ...announcementData,
      id: Date.now().toString(),
      timestamp: new Date().toISOString()
    };
    setAnnouncements([newAnnouncement, ...announcements]);
    toast.success("Announcement broadcast successfully!");
  };

  const updatePerformerLocation = (locationData: Omit<PerformerLocation, 'lastUpdated'>) => {
    const updatedLocation = {
      ...locationData,
      lastUpdated: new Date().toISOString()
    };
    
    setPerformerLocations(prevLocations => {
      const existingIndex = prevLocations.findIndex(
        loc => loc.performerId === locationData.performerId
      );
      
      if (existingIndex !== -1) {
        const updatedLocations = [...prevLocations];
        updatedLocations[existingIndex] = updatedLocation;
        return updatedLocations;
      } else {
        return [...prevLocations, updatedLocation];
      }
    });
  };

  const setVenueById = (venueId: string) => {
    const venue = venues.find(v => v.id === venueId) || null;
    setCurrentVenue(venue);
  };

  return (
    <EventContext.Provider
      value={{
        events,
        announcements,
        performerLocations,
        venues,
        currentVenue,
        addEvent,
        updateEvent,
        deleteEvent,
        addAnnouncement,
        updatePerformerLocation,
        setCurrentVenue: setVenueById
      }}
    >
      {children}
    </EventContext.Provider>
  );
};

// Hook for using the context
export const useEvent = () => {
  const context = useContext(EventContext);
  if (context === undefined) {
    throw new Error('useEvent must be used within an EventProvider');
  }
  return context;
};
