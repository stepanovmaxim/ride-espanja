import type { Question, ExamResult } from '../types';

export function checkAnswer(question: Question, selectedIndex: number): boolean {
  return question.correct[selectedIndex] === 1;
}

export function calculateResults(
  questions: Question[],
  answers: (number | null)[]
): ExamResult {
  const results = questions.map((q, i) => {
    const selected = answers[i];
    const isCorrect = selected !== null && checkAnswer(q, selected);
    return { question: q, selected, isCorrect };
  });

  const correct = results.filter((r) => r.isCorrect).length;
  const incorrect = results.filter((r) => r.selected !== null && !r.isCorrect).length;
  const passed = incorrect <= 3;

  return {
    total: questions.length,
    correct,
    incorrect,
    passed,
    answers: results,
  };
}
