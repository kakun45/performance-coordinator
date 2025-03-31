
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDistanceToNow, parseISO } from 'date-fns';
import { Announcement } from '@/contexts/EventContext';
import { Badge } from "@/components/ui/badge";
import { Bell } from 'lucide-react';

interface AnnouncementCardProps {
  announcement: Announcement;
}

const AnnouncementCard: React.FC<AnnouncementCardProps> = ({ announcement }) => {
  const audienceBadgeColor = () => {
    switch (announcement.audience) {
      case 'performers':
        return 'bg-indigo-100 text-indigo-800 border-indigo-200';
      case 'spectators':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'organizers':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-blue-100 text-blue-800 border-blue-200';
    }
  };

  return (
    <Card className="w-full border card-hover mb-4 animate-slide-in">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-2">
            <div className="bg-primary/10 p-2 rounded-full">
              <Bell className="h-4 w-4 text-primary" />
            </div>
            <CardTitle className="text-lg">{announcement.title}</CardTitle>
          </div>
          <Badge variant="outline" className={audienceBadgeColor()}>
            {announcement.audience === 'all' ? 'Everyone' : announcement.audience}
          </Badge>
        </div>
        <CardDescription className="text-xs mt-1">
          {formatDistanceToNow(parseISO(announcement.timestamp), { addSuffix: true })}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm">{announcement.message}</p>
      </CardContent>
    </Card>
  );
};

export default AnnouncementCard;
