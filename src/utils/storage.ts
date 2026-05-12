const STORAGE_KEY = 'ride-espanja-progress';

export interface StoredProgress {
  completedExams: number;
  passedExams: number;
  totalCorrect: number;
  totalAnswered: number;
  wrongQuestions: number[];
  lastExamDate: string | null;
}

export function loadProgress(): StoredProgress {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return {
    completedExams: 0,
    passedExams: 0,
    totalCorrect: 0,
    totalAnswered: 0,
    wrongQuestions: [],
    lastExamDate: null,
  };
}

export function saveProgress(progress: StoredProgress): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
}

export function updateProgressAfterExam(
  correct: number,
  total: number,
  passed: boolean,
  wrongIds: number[]
): StoredProgress {
  const prev = loadProgress();
  const updated: StoredProgress = {
    completedExams: prev.completedExams + 1,
    passedExams: prev.passedExams + (passed ? 1 : 0),
    totalCorrect: prev.totalCorrect + correct,
    totalAnswered: prev.totalAnswered + total,
    wrongQuestions: [...new Set([...prev.wrongQuestions, ...wrongIds])],
    lastExamDate: new Date().toISOString(),
  };
  saveProgress(updated);
  return updated;
}
