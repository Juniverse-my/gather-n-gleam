export interface MeetingParticipant {
  id: string;
  name: string;
  fee: number;
}

export interface MeetingExpense {
  id: string;
  description: string;
  amount: number;
  category?: string;
}

export interface MeetingDonation {
  id: string;
  donorName: string;
  amount: number;
  note?: string;
}

export interface MeetingPhoto {
  id: string;
  url: string;
  caption?: string;
  isThumbnail?: boolean;
}

export interface MeetingComment {
  id: string;
  authorName: string;
  content: string;
  createdAt: Date;
}

export interface Meeting {
  id: string;
  title: string;
  date: string;
  location: string;
  participants: MeetingParticipant[];
  expenses: MeetingExpense[];
  donations: MeetingDonation[];
  photos: MeetingPhoto[];
  comments: MeetingComment[];
  createdAt: Date;
  updatedAt: Date;
}

export interface MeetingSummary {
  totalFees: number;
  totalExpenses: number;
  totalDonations: number;
  balance: number;
}