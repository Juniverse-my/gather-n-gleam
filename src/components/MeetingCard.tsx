import { Card } from "@/components/ui/card";
import { Meeting } from "@/types/meeting";
import { Calendar, MapPin, Users, Camera } from "lucide-react";

interface MeetingCardProps {
  meeting: Meeting;
  onView: (meetingId: string) => void;
}

export const MeetingCard = ({ meeting, onView }: MeetingCardProps) => {
  const totalFees = meeting.participants.reduce((sum, p) => sum + p.fee, 0);
  const totalExpenses = meeting.expenses.reduce((sum, e) => sum + e.amount, 0);
  const totalDonations = meeting.donations.reduce((sum, d) => sum + d.amount, 0);
  const balance = totalFees + totalDonations - totalExpenses;

  const thumbnailPhoto = meeting.photos.find(photo => photo.isThumbnail) || meeting.photos[0];

  return (
    <Card 
      className="cursor-pointer hover:shadow-md transition-all duration-200 overflow-hidden bg-white border border-gray-200 rounded-xl"
      onClick={() => onView(meeting.id)}
    >
      <div className="flex gap-4 p-4">
        {/* 썸네일 이미지 */}
        <div className="flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden">
          {thumbnailPhoto ? (
            <img
              src={thumbnailPhoto.url}
              alt={thumbnailPhoto.caption || meeting.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
              <Camera className="w-6 h-6 text-gray-400" />
            </div>
          )}
        </div>

        {/* 콘텐츠 */}
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-900 text-lg mb-1 truncate">
            {meeting.title}
          </h3>
          
          <div className="space-y-1 mb-2">
            <div className="flex items-center gap-1 text-sm text-gray-600">
              <Calendar className="w-3 h-3" />
              <span>{meeting.date}</span>
            </div>
            <div className="flex items-center gap-1 text-sm text-gray-600">
              <MapPin className="w-3 h-3" />
              <span className="truncate">{meeting.location}</span>
            </div>
            <div className="flex items-center gap-1 text-sm text-gray-600">
              <Users className="w-3 h-3" />
              <span>{meeting.participants.length}명</span>
            </div>
          </div>

          <div className="flex justify-between items-center">
            <span className={`text-sm font-medium ${
              balance >= 0 ? 'text-green-600' : 'text-red-600'
            }`}>
              잔액 {balance.toLocaleString()}원
            </span>
            {meeting.comments.length > 0 && (
              <span className="text-xs text-gray-500">
                댓글 {meeting.comments.length}
              </span>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
};