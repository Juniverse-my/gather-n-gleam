import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Edit3, Upload } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface HomeBannerProps {
  groupName?: string;
  backgroundImage?: string;
  onUpdate: (data: { groupName?: string; backgroundImage?: string }) => void;
}

export const HomeBanner = ({ groupName = "우리 모임", backgroundImage, onUpdate }: HomeBannerProps) => {
  const [editGroupName, setEditGroupName] = useState(groupName);
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();

  const handleSave = () => {
    onUpdate({ groupName: editGroupName, backgroundImage });
    setIsOpen(false);
    toast({
      title: "홈 화면이 업데이트되었습니다",
      description: "변경사항이 저장되었습니다.",
    });
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        onUpdate({ groupName: editGroupName, backgroundImage: e.target?.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <Card className="relative overflow-hidden">
      {backgroundImage && (
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-20"
          style={{ backgroundImage: `url(${backgroundImage})` }}
        />
      )}
      <CardContent className="relative p-8 text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <h1 className="text-3xl font-bold text-foreground">{groupName}</h1>
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button variant="ghost" size="sm" className="opacity-60 hover:opacity-100">
                <Edit3 className="w-4 h-4" />
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>홈 화면 편집</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="groupName">모임명</Label>
                  <Input
                    id="groupName"
                    value={editGroupName}
                    onChange={(e) => setEditGroupName(e.target.value)}
                    placeholder="모임명을 입력하세요"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="backgroundImage">배경 이미지</Label>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" asChild className="cursor-pointer">
                      <label htmlFor="backgroundUpload">
                        <Upload className="w-4 h-4 mr-2" />
                        이미지 선택
                      </label>
                    </Button>
                    <input
                      id="backgroundUpload"
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setIsOpen(false)}>
                    취소
                  </Button>
                  <Button onClick={handleSave}>
                    저장
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
        <p className="text-lg text-muted-foreground">
          소중한 추억과 함께하는 친목 모임 기록
        </p>
      </CardContent>
    </Card>
  );
};