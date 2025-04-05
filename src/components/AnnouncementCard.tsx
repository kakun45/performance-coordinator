
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDistanceToNow, parseISO } from 'date-fns';
import { Announcement } from '@/contexts/EventContext';
import { Badge } from "@/components/ui/badge";
import { Bell, Edit, Trash2, X, Check } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useAuth } from '@/contexts/AuthContext';
import { useEvent } from '@/contexts/EventContext';
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface AnnouncementCardProps {
  announcement: Announcement;
}

const AnnouncementCard: React.FC<AnnouncementCardProps> = ({ announcement }) => {
  const { user } = useAuth();
  const { updateAnnouncement, deleteAnnouncement } = useEvent();
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [editedTitle, setEditedTitle] = useState(announcement.title);
  const [editedMessage, setEditedMessage] = useState(announcement.message);
  const [editedAudience, setEditedAudience] = useState<'all' | 'performers' | 'spectators' | 'organizers'>(announcement.audience);
  
  const isOrganizer = user?.role === 'organizer';
  
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
  
  const handleSave = () => {
    updateAnnouncement({
      ...announcement,
      title: editedTitle,
      message: editedMessage,
      audience: editedAudience
    });
    setIsEditing(false);
  };
  
  const handleDelete = () => {
    deleteAnnouncement(announcement.id);
    setShowDeleteConfirm(false);
  };
  
  if (isEditing) {
    return (
      <Card className="w-full border mb-4">
        <CardHeader className="pb-2">
          <div className="space-y-2">
            <Input 
              value={editedTitle} 
              onChange={(e) => setEditedTitle(e.target.value)} 
              className="font-semibold"
              placeholder="Announcement title"
            />
            <Select 
              value={editedAudience} 
              onValueChange={(value: any) => setEditedAudience(value)}
            >
              <SelectTrigger className="w-full">
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
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea 
            value={editedMessage} 
            onChange={(e) => setEditedMessage(e.target.value)}
            rows={3}
            placeholder="Announcement message"
          />
          <div className="flex justify-end space-x-2">
            <Button variant="outline" size="sm" onClick={() => setIsEditing(false)}>
              <X className="mr-1" size={16} />
              Cancel
            </Button>
            <Button size="sm" onClick={handleSave}>
              <Check className="mr-1" size={16} />
              Save
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card className="w-full border card-hover mb-4 animate-slide-in">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-2">
              <div className="bg-primary/10 p-2 rounded-full">
                <Bell className="h-4 w-4 text-primary" />
              </div>
              <CardTitle className="text-lg">{announcement.title}</CardTitle>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className={audienceBadgeColor()}>
                {announcement.audience === 'all' ? 'Everyone' : announcement.audience}
              </Badge>
              
              {isOrganizer && (
                <>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => setIsEditing(true)}
                    className="h-8 w-8"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => setShowDeleteConfirm(true)}
                    className="h-8 w-8 text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </>
              )}
            </div>
          </div>
          <CardDescription className="text-xs mt-1">
            {formatDistanceToNow(parseISO(announcement.timestamp), { addSuffix: true })}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm">{announcement.message}</p>
        </CardContent>
      </Card>
      
      <AlertDialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Announcement</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this announcement? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default AnnouncementCard;
