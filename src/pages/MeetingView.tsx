import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Meeting, MeetingComment } from "@/types/meeting";
import { ArrowLeft, Calendar, MapPin, Share2, Edit, MessageCircle, Plus, Camera } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// 임시 데이터
const mockMeeting: Meeting = {
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
};

export default function MeetingView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [meeting] = useState<Meeting>(mockMeeting);
  const [newComment, setNewComment] = useState("");
  const [commentAuthor, setCommentAuthor] = useState(() => 
    localStorage.getItem("commentAuthor") || ""
  );

  const totalFees = meeting.participants.reduce((sum, p) => sum + p.fee, 0);
  const totalExpenses = meeting.expenses.reduce((sum, e) => sum + e.amount, 0);
  const totalDonations = meeting.donations.reduce((sum, d) => sum + d.amount, 0);
  const balance = totalFees + totalDonations - totalExpenses;

  const handleShare = async () => {
    try {
      await navigator.share({
        title: meeting.title,
        text: `${meeting.title} - ${meeting.date}`,
        url: window.location.href,
      });
    } catch (err) {
      // 공유 API를 지원하지 않는 경우 URL을 클립보드에 복사
      navigator.clipboard.writeText(window.location.href);
      toast({
        title: "링크가 복사되었습니다",
        description: "클립보드에 페이지 링크가 복사되었습니다.",
      });
    }
  };

  const handleAddComment = () => {
    if (!commentAuthor.trim() || !newComment.trim()) {
      toast({
        title: "입력 필요",
        description: "이름과 댓글을 모두 입력해주세요.",
        variant: "destructive",
      });
      return;
    }

    // 로컬 스토리지에 이름 저장
    localStorage.setItem("commentAuthor", commentAuthor);
    
    // 실제로는 서버에 저장
    toast({
      title: "댓글이 작성되었습니다",
      description: "소중한 의견 감사합니다!",
    });
    
    setNewComment("");
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    // 실제로는 서버에 업로드하고 photos 배열에 추가
    toast({
      title: "이미지가 추가되었습니다",
      description: "사진이 갤러리에 추가되었습니다.",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-md mx-auto space-y-4 p-4">
        {/* 헤더 */}
        <div className="flex items-center justify-between sticky top-0 bg-background z-10 py-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/")}
            className="gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={handleShare}>
              <Share2 className="w-4 h-4" />
            </Button>
            <Button variant="default" size="sm" onClick={() => navigate(`/edit/${meeting.id}`)}>
              <Edit className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* 모임 정보 */}
        <Card>
          <CardContent className="p-6">
            <h1 className="text-xl font-bold mb-4">{meeting.title}</h1>
            <div className="space-y-2 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                {meeting.date}
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                {meeting.location}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 회계 명세서 */}
        <Card>
          <CardHeader>
            <CardTitle>회계 명세서</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* 참석자 및 회비 */}
            <div>
              <h3 className="text-lg font-semibold mb-3 text-income">참석자 및 회비</h3>
              <div className="space-y-2">
                {meeting.participants.map((participant) => (
                  <div key={participant.id} className="flex justify-between items-center p-3 bg-income-light rounded-lg">
                    <span className="font-medium">{participant.name}</span>
                    <span className="font-semibold text-income">
                      {participant.fee.toLocaleString()}원
                    </span>
                  </div>
                ))}
                <div className="flex justify-between items-center p-3 bg-income rounded-lg text-white font-bold">
                  <span>회비 총액</span>
                  <span>{totalFees.toLocaleString()}원</span>
                </div>
              </div>
            </div>

            {/* 지출 내역 */}
            <div>
              <h3 className="text-lg font-semibold mb-3 text-expense">지출 내역</h3>
              <div className="space-y-2">
                {meeting.expenses.map((expense) => (
                  <div key={expense.id} className="flex justify-between items-center p-3 bg-expense-light rounded-lg">
                    <span className="font-medium">{expense.description}</span>
                    <span className="font-semibold text-expense">
                      {expense.amount.toLocaleString()}원
                    </span>
                  </div>
                ))}
                <div className="flex justify-between items-center p-3 bg-expense rounded-lg text-white font-bold">
                  <span>지출 총액</span>
                  <span>{totalExpenses.toLocaleString()}원</span>
                </div>
              </div>
            </div>

            {/* 찬조 */}
            {meeting.donations.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold mb-3 text-balance">찬조</h3>
                <div className="space-y-2">
                  {meeting.donations.map((donation) => (
                    <div key={donation.id} className="p-3 bg-balance-light rounded-lg">
                      <div className="flex justify-between items-center">
                        <span className="font-medium">{donation.donorName}</span>
                        <span className="font-semibold text-balance">
                          {donation.amount.toLocaleString()}원
                        </span>
                      </div>
                      {donation.note && (
                        <p className="text-sm text-muted-foreground mt-1">{donation.note}</p>
                      )}
                    </div>
                  ))}
                  <div className="flex justify-between items-center p-3 bg-balance rounded-lg text-white font-bold">
                    <span>찬조 총액</span>
                    <span>{totalDonations.toLocaleString()}원</span>
                  </div>
                </div>
              </div>
            )}

            {/* 최종 잔액 */}
            <div className="border-t pt-4">
              <div className="flex justify-between items-center p-4 bg-balance rounded-lg text-white">
                <span className="text-xl font-bold">최종 잔액</span>
                <span className="text-2xl font-bold">{balance.toLocaleString()}원</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 사진 갤러리 */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>사진 갤러리</CardTitle>
              <Button variant="outline" size="sm" asChild className="cursor-pointer">
                <label htmlFor="photoUpload">
                  <Plus className="w-4 h-4 mr-1" />
                  추가
                </label>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <input
              id="photoUpload"
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageUpload}
              className="hidden"
            />
            {meeting.photos.length > 0 ? (
              <div className="grid grid-cols-2 gap-3">
                {meeting.photos.map((photo) => (
                  <div key={photo.id} className="space-y-2">
                    <img
                      src={photo.url}
                      alt={photo.caption}
                      className="w-full aspect-square object-cover rounded-lg"
                    />
                    {photo.caption && (
                      <p className="text-xs text-center text-gray-600">
                        {photo.caption}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Camera className="w-8 h-8 mx-auto mb-2" />
                <p className="text-sm">아직 사진이 없습니다</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* 댓글 섹션 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageCircle className="w-5 h-5" />
              댓글 ({meeting.comments.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* 기존 댓글 */}
            {meeting.comments.map((comment) => (
              <div key={comment.id} className="p-4 bg-muted rounded-lg">
                <div className="flex justify-between items-start mb-2">
                  <span className="font-semibold">{comment.authorName}</span>
                  <span className="text-sm text-muted-foreground">
                    {comment.createdAt.toLocaleDateString()}
                  </span>
                </div>
                <p>{comment.content}</p>
              </div>
            ))}

            {/* 새 댓글 작성 */}
            <div className="space-y-3 pt-4 border-t">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <Input
                  placeholder="이름을 입력하세요"
                  value={commentAuthor}
                  onChange={(e) => setCommentAuthor(e.target.value)}
                  className="text-base"
                />
                <div className="md:col-span-2">
                  <Textarea
                    placeholder="댓글을 작성해주세요..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    className="text-base min-h-[60px]"
                  />
                </div>
              </div>
              <Button 
                onClick={handleAddComment}
                variant="default" 
                size="lg"
                className="w-full md:w-auto"
              >
                댓글 작성
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}