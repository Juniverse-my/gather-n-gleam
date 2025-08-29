import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Meeting, MeetingParticipant, MeetingExpense, MeetingDonation } from "@/types/meeting";
import { ArrowLeft, Plus, Trash2, Save } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function MeetingEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const isNew = !id || id === "new";

  const [meeting, setMeeting] = useState<Partial<Meeting>>({
    title: "",
    date: new Date().toISOString().split("T")[0],
    location: "",
    participants: [{ id: "1", name: "", fee: 0 }],
    expenses: [{ id: "1", description: "", amount: 0 }],
    donations: [],
  });

  const updateMeeting = (field: keyof Meeting, value: any) => {
    setMeeting(prev => ({ ...prev, [field]: value }));
  };

  const addParticipant = () => {
    const newParticipant: MeetingParticipant = {
      id: Date.now().toString(),
      name: "",
      fee: 0,
    };
    updateMeeting("participants", [...(meeting.participants || []), newParticipant]);
  };

  const updateParticipant = (id: string, field: keyof MeetingParticipant, value: any) => {
    const updated = meeting.participants?.map(p =>
      p.id === id ? { ...p, [field]: value } : p
    ) || [];
    updateMeeting("participants", updated);
  };

  const removeParticipant = (id: string) => {
    const updated = meeting.participants?.filter(p => p.id !== id) || [];
    updateMeeting("participants", updated);
  };

  const addExpense = () => {
    const newExpense: MeetingExpense = {
      id: Date.now().toString(),
      description: "",
      amount: 0,
    };
    updateMeeting("expenses", [...(meeting.expenses || []), newExpense]);
  };

  const updateExpense = (id: string, field: keyof MeetingExpense, value: any) => {
    const updated = meeting.expenses?.map(e =>
      e.id === id ? { ...e, [field]: value } : e
    ) || [];
    updateMeeting("expenses", updated);
  };

  const removeExpense = (id: string) => {
    const updated = meeting.expenses?.filter(e => e.id !== id) || [];
    updateMeeting("expenses", updated);
  };

  const addDonation = () => {
    const newDonation: MeetingDonation = {
      id: Date.now().toString(),
      donorName: "",
      amount: 0,
      note: "",
    };
    updateMeeting("donations", [...(meeting.donations || []), newDonation]);
  };

  const updateDonation = (id: string, field: keyof MeetingDonation, value: any) => {
    const updated = meeting.donations?.map(d =>
      d.id === id ? { ...d, [field]: value } : d
    ) || [];
    updateMeeting("donations", updated);
  };

  const removeDonation = (id: string) => {
    const updated = meeting.donations?.filter(d => d.id !== id) || [];
    updateMeeting("donations", updated);
  };

  const calculateTotals = () => {
    const totalFees = meeting.participants?.reduce((sum, p) => sum + (p.fee || 0), 0) || 0;
    const totalExpenses = meeting.expenses?.reduce((sum, e) => sum + (e.amount || 0), 0) || 0;
    const totalDonations = meeting.donations?.reduce((sum, d) => sum + (d.amount || 0), 0) || 0;
    const balance = totalFees + totalDonations - totalExpenses;

    return { totalFees, totalExpenses, totalDonations, balance };
  };

  const handleSave = () => {
    if (!meeting.title || !meeting.date || !meeting.location) {
      toast({
        title: "입력 필요",
        description: "모임명, 날짜, 장소를 모두 입력해주세요.",
        variant: "destructive",
      });
      return;
    }

    // 실제로는 서버에 저장
    toast({
      title: isNew ? "모임이 생성되었습니다" : "모임이 수정되었습니다",
      description: "변경사항이 성공적으로 저장되었습니다.",
    });

    navigate("/");
  };

  const totals = calculateTotals();

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
          
          <Button variant="default" size="sm" onClick={handleSave} className="gap-2">
            <Save className="w-4 h-4" />
            저장
          </Button>
        </div>

        {/* 기본 정보 */}
        <Card>
          <CardHeader>
            <CardTitle>{isNew ? "새 모임 생성" : "모임 수정"}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title" className="text-base font-semibold">모임명</Label>
              <Input
                id="title"
                value={meeting.title || ""}
                onChange={(e) => updateMeeting("title", e.target.value)}
                placeholder="예: 3월 정기모임"
                className="text-base"
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="date" className="text-base font-semibold">날짜</Label>
                <Input
                  id="date"
                  type="date"
                  value={meeting.date || ""}
                  onChange={(e) => updateMeeting("date", e.target.value)}
                  className="text-base"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="location" className="text-base font-semibold">장소</Label>
                <Input
                  id="location"
                  value={meeting.location || ""}
                  onChange={(e) => updateMeeting("location", e.target.value)}
                  placeholder="예: 서초구 반포동 맛집"
                  className="text-base"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 참석자 및 회비 */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-income">참석자 및 회비</CardTitle>
              <Button variant="income" size="lg" onClick={addParticipant} className="gap-2">
                <Plus className="w-4 h-4" />
                참석자 추가
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {meeting.participants?.map((participant, index) => (
              <div key={participant.id} className="flex gap-3 items-center p-3 bg-income-light rounded-lg">
                <div className="flex-1">
                  <Input
                    placeholder={`참석자 ${index + 1} 이름`}
                    value={participant.name}
                    onChange={(e) => updateParticipant(participant.id, "name", e.target.value)}
                    className="text-base"
                  />
                </div>
                <div className="w-32">
                  <Input
                    type="number"
                    placeholder="회비"
                    value={participant.fee || ""}
                    onChange={(e) => updateParticipant(participant.id, "fee", parseInt(e.target.value) || 0)}
                    className="text-base"
                  />
                </div>
                {meeting.participants!.length > 1 && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeParticipant(participant.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                )}
              </div>
            ))}
            <div className="flex justify-between items-center p-3 bg-income rounded-lg text-white font-bold">
              <span>회비 총액</span>
              <span>{totals.totalFees.toLocaleString()}원</span>
            </div>
          </CardContent>
        </Card>

        {/* 지출 내역 */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-expense">지출 내역</CardTitle>
              <Button variant="expense" size="lg" onClick={addExpense} className="gap-2">
                <Plus className="w-4 h-4" />
                지출 추가
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {meeting.expenses?.map((expense, index) => (
              <div key={expense.id} className="flex gap-3 items-center p-3 bg-expense-light rounded-lg">
                <div className="flex-1">
                  <Input
                    placeholder={`지출 ${index + 1} 내용`}
                    value={expense.description}
                    onChange={(e) => updateExpense(expense.id, "description", e.target.value)}
                    className="text-base"
                  />
                </div>
                <div className="w-32">
                  <Input
                    type="number"
                    placeholder="금액"
                    value={expense.amount || ""}
                    onChange={(e) => updateExpense(expense.id, "amount", parseInt(e.target.value) || 0)}
                    className="text-base"
                  />
                </div>
                {meeting.expenses!.length > 1 && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeExpense(expense.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                )}
              </div>
            ))}
            <div className="flex justify-between items-center p-3 bg-expense rounded-lg text-white font-bold">
              <span>지출 총액</span>
              <span>{totals.totalExpenses.toLocaleString()}원</span>
            </div>
          </CardContent>
        </Card>

        {/* 찬조 */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-balance">찬조 (선택사항)</CardTitle>
              <Button variant="balance" size="lg" onClick={addDonation} className="gap-2">
                <Plus className="w-4 h-4" />
                찬조 추가
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {meeting.donations?.map((donation, index) => (
              <div key={donation.id} className="space-y-2 p-3 bg-balance-light rounded-lg">
                <div className="flex gap-3 items-center">
                  <div className="flex-1">
                    <Input
                      placeholder={`찬조자 ${index + 1} 이름`}
                      value={donation.donorName}
                      onChange={(e) => updateDonation(donation.id, "donorName", e.target.value)}
                      className="text-base"
                    />
                  </div>
                  <div className="w-32">
                    <Input
                      type="number"
                      placeholder="금액"
                      value={donation.amount || ""}
                      onChange={(e) => updateDonation(donation.id, "amount", parseInt(e.target.value) || 0)}
                      className="text-base"
                    />
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeDonation(donation.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
                <Input
                  placeholder="메모 (선택사항)"
                  value={donation.note || ""}
                  onChange={(e) => updateDonation(donation.id, "note", e.target.value)}
                  className="text-base"
                />
              </div>
            ))}
            {(meeting.donations?.length || 0) > 0 && (
              <div className="flex justify-between items-center p-3 bg-balance rounded-lg text-white font-bold">
                <span>찬조 총액</span>
                <span>{totals.totalDonations.toLocaleString()}원</span>
              </div>
            )}
          </CardContent>
        </Card>

        {/* 최종 계산 */}
        <Card>
          <CardHeader>
            <CardTitle>최종 계산</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 bg-income-light rounded-lg">
                <span className="font-semibold">회비 총액</span>
                <span className="font-bold text-income">{totals.totalFees.toLocaleString()}원</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-expense-light rounded-lg">
                <span className="font-semibold">지출 총액</span>
                <span className="font-bold text-expense">-{totals.totalExpenses.toLocaleString()}원</span>
              </div>
              {totals.totalDonations > 0 && (
                <div className="flex justify-between items-center p-3 bg-balance-light rounded-lg">
                  <span className="font-semibold">찬조 총액</span>
                  <span className="font-bold text-balance">+{totals.totalDonations.toLocaleString()}원</span>
                </div>
              )}
              <div className="flex justify-between items-center p-4 bg-balance rounded-lg text-white">
                <span className="text-xl font-bold">최종 잔액</span>
                <span className="text-2xl font-bold">{totals.balance.toLocaleString()}원</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}