import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Meeting } from "@/types/meeting";
import { Calendar, MapPin, Users } from "lucide-react";
import meetingPlaceholder from "@/assets/meeting-placeholder.jpg";

interface MeetingCardProps {
  meeting: Meeting;
  onView: (meetingId: string) => void;
}

export function MeetingCard({ meeting, onView }: MeetingCardProps) {
  const thumbnailPhoto = meeting.photos.find(p => p.isThumbnail) || meeting.photos[0];
  
  const totalFees = meeting.participants.reduce((sum, p) => sum + p.fee, 0);
  const totalExpenses = meeting.expenses.reduce((sum, e) => sum + e.amount, 0);
  const balance = totalFees - totalExpenses;

  return (
    <Card className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow cursor-pointer">
      <div className="aspect-video relative bg-muted">
        {thumbnailPhoto ? (
          <img 
            src={thumbnailPhoto.url} 
            alt={meeting.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <img 
            src={meetingPlaceholder} 
            alt={`${meeting.title} 모임 사진`}
            className="w-full h-full object-cover"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        <div className="absolute bottom-4 left-4 text-white">
          <h3 className="text-xl font-semibold mb-1">{meeting.title}</h3>
          <div className="flex items-center gap-2 text-sm opacity-90">
            <Calendar className="w-4 h-4" />
            {meeting.date}
          </div>
        </div>
      </div>
      
      <CardContent className="p-6">
        <div className="flex items-center gap-2 text-muted-foreground mb-4">
          <MapPin className="w-4 h-4" />
          <span className="text-base">{meeting.location}</span>
        </div>
        
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="text-center p-3 bg-income-light rounded-lg">
            <div className="text-sm text-muted-foreground">회비</div>
            <div className="text-lg font-semibold text-income">
              {totalFees.toLocaleString()}원
            </div>
          </div>
          <div className="text-center p-3 bg-expense-light rounded-lg">
            <div className="text-sm text-muted-foreground">지출</div>
            <div className="text-lg font-semibold text-expense">
              {totalExpenses.toLocaleString()}원
            </div>
          </div>
          <div className="text-center p-3 bg-balance-light rounded-lg">
            <div className="text-sm text-muted-foreground">잔액</div>
            <div className="text-lg font-semibold text-balance">
              {balance.toLocaleString()}원
            </div>
          </div>
        </div>
        
        <Button 
          onClick={() => onView(meeting.id)}
          variant="large" 
          size="xl" 
          className="w-full"
        >
          모임 상세보기
        </Button>
      </CardContent>
    </Card>
  );
}