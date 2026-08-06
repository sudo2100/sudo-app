export interface ChatMessage {
  id: string;
  role: "user" | "model";
  content: string;
  timestamp: Date;
}

export interface ContactData {
  name: string;
  email: string;
  phone: string;
  course: string;
  message: string;
}

export interface SavedContact extends ContactData {
  id: string;
  createdAt: string;
}

export interface ScheduleItem {
  id: string;
  dateLabel: string;
  description: string;
}

export interface ProjectItem {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  imageUrl: string;
  role: string;
  techStack: string[];
  features: string[];
}
