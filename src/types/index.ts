export interface Question {
  id: number;
  img: string;
  question: string;
  answers: string[];
  explanation: string;
  correct: number[];
}

export type ExamMode = 'exam' | 'practice';

export interface ExamState {
  questions: Question[];
  currentIndex: number;
  answers: (number | null)[];
  mode: ExamMode;
  finished: boolean;
}

export interface ExamResult {
  total: number;
  correct: number;
  incorrect: number;
  passed: boolean;
  answers: {
    question: Question;
    selected: number | null;
    isCorrect: boolean;
  }[];
}
