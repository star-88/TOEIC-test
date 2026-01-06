import { AppState, Word, GrammarNote } from '../types.ts';

const STORAGE_KEY = 'toeic-master-data-v1';

const DEFAULT_STATE: AppState = {
  words: [
    {
      id: '1',
      term: 'Acquisition',
      meaning: '收購；獲得',
      example: 'The company announced the acquisition of a rival firm.',
      group: 'Business',
      createdAt: Date.now()
    },
    {
      id: '2',
      term: 'Agenda',
      meaning: '議程',
      example: 'The next item on the agenda is the budget review.',
      group: 'Meeting',
      createdAt: Date.now()
    },
    {
      id: '3',
      term: 'Resume',
      meaning: '履歷表',
      example: 'Please submit your resume to the HR department.',
      group: 'HR',
      createdAt: Date.now()
    },
    {
      id: '4',
      term: 'Banquet',
      meaning: '宴會',
      example: 'We held a banquet to celebrate the success.',
      group: 'Social',
      createdAt: Date.now()
    }
  ],
  notes: [
    {
      id: '1',
      content: 'Past Perfect Tense:\nUsed to describe an action that finished before another action in the past.\n\nStructure: had + V3\nExample: She had left when I arrived.',
      updatedAt: Date.now()
    }
  ]
};

export const loadState = (): AppState => {
  try {
    const serialized = localStorage.getItem(STORAGE_KEY);
    if (!serialized) return DEFAULT_STATE;
    return JSON.parse(serialized);
  } catch (e) {
    console.error("Failed to load state", e);
    return DEFAULT_STATE;
  }
};

export const saveState = (state: AppState): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (e) {
    console.error("Failed to save state", e);
  }
};