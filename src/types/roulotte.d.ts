export interface Question {
  id: number;
  category: string;
  theme: string;
  question: string;
  answer: string;
}

export interface Game {
  status?: 'stopped' | 'started' | 'paused';
  questions?: Question[];
  pos?: number;
  categories?: string[];
  questionsAsked?: number;
}
