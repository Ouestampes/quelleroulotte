export interface State {
  appPath: string;
  dataPath: string;
  resourcePath: string;
  publicFullscreen: boolean;
  lastUpdate?: Date;
}

export interface Game {
  status: 'stopped' | 'started' | 'paused';
  questions: Question[];
  pos: number;
  categories: string[];
  questionsAsked: number;
}

export interface Question {
  id: number;
  category: string;
  theme: string;
  question: string;
  answer: string;
}
