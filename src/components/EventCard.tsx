
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDistanceToNow, format, parseISO } from 'date-fns';
import { CalendarIcon, MapPinIcon } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Event } from '@/contexts/EventContext';

interface EventCardProps {
  event: Event;
  onClick?: () => void;
  compact?: boolean;
}

const EventCard: React.FC<EventCardProps> = ({ event, onClick, compact = false }) => {
  const startTime = parseISO(event.startTime);
  const endTime = parseISO(event.endTime);
  const isUpcoming = startTime > new Date();
  const isOngoing = startTime <= new Date() && endTime >= new Date();
  
  return (
    <Card className={`w-full card-hover overflow-hidden ${compact ? 'bg-muted/50' : ''}`}>
      <CardHeader className={`p-4 pb-2 ${compact ? 'p-3' : ''}`}>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className={compact ? "text-base" : "text-lg"}>{event.name}</CardTitle>
            <CardDescription className="mt-0.5 text-sm text-muted-foreground">
              {!compact && event.description}
            </CardDescription>
          </div>
          {isUpcoming && (
            <Badge variant="outline" className="bg-secondary/10 text-secondary-foreground">
              {formatDistanceToNow(startTime, { addSuffix: true })}
            </Badge>
          )}
          {isOngoing && (
            <Badge className="bg-primary text-primary-foreground">
              Now
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className={compact ? 'p-3 pt-0' : 'px-4 pb-3'}>
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center text-muted-foreground">
            <CalendarIcon className="mr-2 h-4 w-4" />
            <span className="text-sm">
              {format(parseISO(event.startTime), "MMM d, h:mm a")} - {format(parseISO(event.endTime), "h:mm a")}
            </span>
          </div>
          <div className="flex items-center text-muted-foreground">
            <MapPinIcon className="mr-2 h-4 w-4" />
            <span className="text-sm">{event.location}</span>
          </div>
        </div>
      </CardContent>
      {!compact && (
        <CardFooter className="px-4 pt-1 pb-4">
          <Button variant="outline" onClick={onClick} className="w-full">View Details</Button>
        </CardFooter>
      )}
    </Card>
  );
};

export default EventCard;
