import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { MeetingCard } from "@/components/MeetingCard";
import { Meeting } from "@/types/meeting";
import { Plus, Heart } from "lucide-react";

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
  const [meetings] = useState<Meeting[]>(mockMeetings);

  const handleViewMeeting = (meetingId: string) => {
    navigate(`/meeting/${meetingId}`);
  };

  const handleCreateNew = () => {
    navigate("/edit/new");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* 헤더 */}
      <header className="bg-card shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex items-center justify-center gap-3 mb-2">
            <Heart className="w-8 h-8 text-balance" />
            <h1 className="text-3xl font-bold text-foreground">우리 모임</h1>
          </div>
          <p className="text-center text-muted-foreground text-lg">
            소중한 추억과 함께하는 친목 모임 기록
          </p>
        </div>
      </header>

      {/* 메인 컨텐츠 */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* 새 모임 생성 버튼 */}
        <div className="mb-8 text-center">
          <Button
            variant="large"
            size="xl"
            onClick={handleCreateNew}
            className="gap-3 shadow-lg"
          >
            <Plus className="w-6 h-6" />
            새 모임 기록하기
          </Button>
        </div>

        {/* 모임 목록 */}
        {meetings.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {meetings.map((meeting) => (
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
            <h2 className="text-2xl font-semibold mb-2 text-muted-foreground">
              아직 모임 기록이 없습니다
            </h2>
            <p className="text-lg text-muted-foreground mb-6">
              첫 번째 모임을 기록해보세요!
            </p>
            <Button
              variant="large"
              size="xl"
              onClick={handleCreateNew}
              className="gap-3"
            >
              <Plus className="w-6 h-6" />
              모임 기록 시작하기
            </Button>
          </div>
        )}
      </main>

      {/* 푸터 */}
      <footer className="bg-muted mt-16 py-8">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <p className="text-muted-foreground">
            모임의 소중한 순간들을 기록하고 공유해보세요 ❤️
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
