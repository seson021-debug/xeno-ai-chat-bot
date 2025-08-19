
export enum Author {
  USER = 'user',
  BOT = 'bot',
}

export interface Message {
  id: string;
  text: string;
  author: Author;
  timestamp: string;
}

export interface ChatSession {
  id: string;
  title: string;
  messages: Message[];
  createdAt: number;
}

export interface UserProfile {
    uid: string;
    name: string;
    avatar: string;
    email?: string | null;
    phone?: string | null;
}
