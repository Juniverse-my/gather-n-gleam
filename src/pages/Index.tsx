import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { MeetingCard } from "@/components/MeetingCard";
import { Meeting } from "@/types/meeting";
import { HomeBanner } from "@/components/HomeBanner";
import { Plus, ArrowUpDown } from "lucide-react";

// 임시 데이터
const mockMeetings: Meeting[] = [
  {
    id: "1",
    title: "3월 정기모임",
    date: "2024-03-15",
    location: "서초구 반포동 맛집",
    participants: [
      { id: "1", name: "김영희", fee: 50000 },
      { id: "2", name: "박철수", fee: 50000 },
      { id: "3", name: "이수진", fee: 50000 },
      { id: "4", name: "최민호", fee: 50000 },
    ],
    expenses: [
      { id: "1", description: "점심식사", amount: 120000 },
      { id: "2", description: "커피", amount: 40000 },
      { id: "3", description: "기념품", amount: 20000 },
    ],
    donations: [
      { id: "1", donorName: "정상호", amount: 20000, note: "늦게 와서 죄송합니다" },
    ],
    photos: [
      { id: "1", url: "/api/placeholder/400/300", caption: "모임 단체사진", isThumbnail: true },
      { id: "2", url: "/api/placeholder/400/300", caption: "맛있는 음식" },
    ],
    comments: [
      { id: "1", authorName: "김영희", content: "오늘 정말 즐거웠어요!", createdAt: new Date() },
      { id: "2", authorName: "박철수", content: "다음에도 또 만나요~", createdAt: new Date() },
    ],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "2",
    title: "2월 송년모임",
    date: "2024-02-20",
    location: "강남구 맛집",
    participants: [
      { id: "1", name: "김영희", fee: 60000 },
      { id: "2", name: "박철수", fee: 60000 },
      { id: "3", name: "이수진", fee: 60000 },
    ],
    expenses: [
      { id: "1", description: "저녁식사", amount: 150000 },
      { id: "2", description: "노래방", amount: 30000 },
    ],
    donations: [],
    photos: [
      { id: "1", url: "/api/placeholder/400/300", caption: "송년회 사진", isThumbnail: true },
    ],
    comments: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

const Index = () => {
  const navigate = useNavigate();
  const [meetings, setMeetings] = useState<Meeting[]>(mockMeetings);
  const [sortOrder, setSortOrder] = useState<'latest' | 'oldest'>('latest');
  const [homeBanner, setHomeBanner] = useState({
    groupName: "우리 모임",
    backgroundImage: undefined as string | undefined,
  });

  const sortedMeetings = [...meetings].sort((a, b) => {
    const dateA = new Date(a.date).getTime();
    const dateB = new Date(b.date).getTime();
    return sortOrder === 'latest' ? dateB - dateA : dateA - dateB;
  });

  const handleViewMeeting = (meetingId: string) => {
    navigate(`/meeting/${meetingId}`);
  };

  const handleCreateNew = () => {
    navigate("/edit/new");
  };

  const toggleSortOrder = () => {
    setSortOrder(prev => prev === 'latest' ? 'oldest' : 'latest');
  };

  const handleBannerUpdate = (data: { groupName?: string; backgroundImage?: string }) => {
    setHomeBanner(prev => ({ ...prev, ...data }));
  };

  return (
    <div className="min-h-screen bg-background">
      {/* 메인 컨텐츠 */}
      <main className="max-w-md mx-auto px-4 py-6 space-y-6">
        {/* 홈 배너 */}
        <HomeBanner 
          groupName={homeBanner.groupName}
          backgroundImage={homeBanner.backgroundImage}
          onUpdate={handleBannerUpdate}
        />

        {/* 모임 추가 버튼 */}
        <Button
          onClick={handleCreateNew}
          className="w-full h-14 text-lg font-semibold"
          size="lg"
        >
          <Plus className="w-5 h-5 mr-2" />
          모임 추가
        </Button>

        {/* 정렬 버튼 */}
        {meetings.length > 0 && (
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold">모임 목록</h2>
            <Button
              variant="outline"
              size="sm"
              onClick={toggleSortOrder}
              className="gap-2"
            >
              <ArrowUpDown className="w-4 h-4" />
              {sortOrder === 'latest' ? '최신순' : '과거순'}
            </Button>
          </div>
        )}

        {/* 모임 목록 */}
        {sortedMeetings.length > 0 ? (
          <div className="space-y-4">
            {sortedMeetings.map((meeting) => (
              <MeetingCard
                key={meeting.id}
                meeting={meeting}
                onView={handleViewMeeting}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📝</div>
            <h2 className="text-xl font-semibold mb-2 text-muted-foreground">
              아직 모임 기록이 없습니다
            </h2>
            <p className="text-muted-foreground mb-6">
              첫 번째 모임을 기록해보세요!
            </p>
            <Button
              onClick={handleCreateNew}
              className="w-full h-14 text-lg font-semibold"
              size="lg"
            >
              <Plus className="w-5 h-5 mr-2" />
              모임 기록 시작하기
            </Button>
          </div>
        )}
      </main>
    </div>
  );
};

export default Index;
