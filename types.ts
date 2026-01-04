
export enum Category {
  FLAG = 'FLAG',
  MASCOT = 'MASCOT',
  SPORT = 'SPORT',
  CUISINE = 'CUISINE',
  DRESS = 'DRESS',
  LANDMARK = 'LANDMARK',
  SYMBOL = 'SYMBOL',
  HISTORY = 'HISTORY'
}

export type Region = 
  | 'ASIA' 
  | 'SOUTH_ASIA'
  | 'MIDDLE_EAST' 
  | 'AFRICA' 
  | 'LATIN_AMERICA' 
  | 'CARIBBEAN' 
  | 'OCEANIA' 
  | 'EUROPE' 
  | 'CENTRAL_EUROPE' 
  | 'EASTERN_EUROPE' 
  | 'WESTERN_EUROPE'
  | 'NORTH_AMERICA';

export type DifficultyMode = 'EASY' | 'CLASSIC' | 'HARD';

export interface Country {
  id: string;
  name: string;
  flag: string;
  region: Region;
  mascot: string;
  sport: string;
  cuisine: string;
  dress: string;
  landmark: string;
  symbol: string;
  history: string;
  funFact: string;
  difficulty: 'EASY' | 'MEDIUM' | 'HARD';
}

export interface Question {
  category: Category;
  correctAnswer: Country;
  options: string[];
}

export type GameStatus = 'START' | 'MODE_SELECT' | 'PLAYING' | 'FEEDBACK' | 'FINISHED';

export interface FeedbackState {
  isCorrect: boolean;
  isSkipped?: boolean;
  correctName: string;
  funFact: string;
}
