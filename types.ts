export interface Word {
  id: string;
  term: string;
  meaning: string;
  example: string;
  group: string;
  createdAt: number;
}

export interface GrammarNote {
  id: string;
  content: string;
  updatedAt: number;
}

export type ViewState = 'HOME' | 'GROUP_DETAIL' | 'ADD_WORD' | 'GRAMMAR';

export interface AppState {
  words: Word[];
  notes: GrammarNote[];
}