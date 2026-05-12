import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Question } from '../types';
import type { ExamResult } from '../types';
import { pickRandom } from '../utils/shuffle';
import { calculateResults } from '../utils/scoring';
import { updateProgressAfterExam } from '../utils/storage';
import QuestionCard from '../components/QuestionCard';
import ExamResults from '../components/ExamResults';

const EXAM_SIZE = 30;
const EXAM_TIME = 30 * 60;
const MAX_ERRORS = 3;

type Phase = 'loading' | 'exam' | 'results' | 'review';

export default function Exam() {
  const navigate = useNavigate();
  const [phase, setPhase] = useState<Phase>('loading');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<(number | null)[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(EXAM_TIME);
  const [result, setResult] = useState<ExamResult | null>(null);
  const [reviewIndex, setReviewIndex] = useState(0);

  useEffect(() => {
    fetch(`${import.meta.env.BASE_URL}data/questions_ru.json`)
      .then((r) => r.json())
      .then((data: Question[]) => {
        const selected = pickRandom(data, EXAM_SIZE);
        setQuestions(selected);
        setAnswers(new Array(EXAM_SIZE).fill(null));
        setPhase('exam');
      })
      .catch(() => navigate('/'));
  }, [navigate]);

  useEffect(() => {
    if (phase !== 'exam') return;
    if (timeLeft <= 0) {
      finishExam();
      return;
    }
    const timer = setInterval(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearInterval(timer);
  }, [phase, timeLeft]);

  const finishExam = useCallback(() => {
    const r = calculateResults(questions, answers);
    const wrongIds = r.answers
      .filter((a) => !a.isCorrect)
      .map((a) => a.question.id);
    updateProgressAfterExam(r.correct, r.total, r.passed, wrongIds);
    setResult(r);
    setPhase('results');
  }, [questions, answers]);

  const handleSelect = (answerIndex: number) => {
    const newAnswers = [...answers];
    newAnswers[currentIndex] = answerIndex;
    setAnswers(newAnswers);
  };

  const errors = answers.filter(
    (a, i) => a !== null && questions[i]?.correct[a] === 0
  ).length;
  const answered = answers.filter((a) => a !== null).length;

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${sec.toString().padStart(2, '0')}`;
  };

  if (phase === 'loading') {
    return (
      <div className="loading-screen">
        <div className="spinner" />
        <p>Загрузка вопросов...</p>
      </div>
    );
  }

  if (phase === 'results' && result) {
    return (
      <ExamResults
        result={result}
        onReview={() => {
          setReviewIndex(0);
          setPhase('review');
        }}
        onRetry={() => {
          setAnswers(new Array(EXAM_SIZE).fill(null));
          setCurrentIndex(0);
          setTimeLeft(EXAM_TIME);
          setPhase('exam');
        }}
        onHome={() => navigate('/')}
      />
    );
  }

  if (phase === 'review' && result) {
    const q = questions[reviewIndex];
    return (
      <div className="review-page">
        <div className="review-nav">
          <button
            className="btn btn-outline"
            onClick={() => setPhase('results')}
          >
            Назад к результатам
          </button>
          <span className="review-counter">
            {reviewIndex + 1} / {questions.length}
          </span>
        </div>
        <QuestionCard
          question={q}
          selected={answers[reviewIndex]}
          onSelect={() => {}}
          showResult
          questionNumber={reviewIndex + 1}
          totalQuestions={questions.length}
        />
        <div className="review-pagination">
          <button
            className="btn btn-secondary"
            disabled={reviewIndex === 0}
            onClick={() => setReviewIndex((i) => i - 1)}
          >
            Предыдущий
          </button>
          <button
            className="btn btn-secondary"
            disabled={reviewIndex === questions.length - 1}
            onClick={() => setReviewIndex((i) => i + 1)}
          >
            Следующий
          </button>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentIndex];

  return (
    <div className="exam-page">
      <div className="exam-header">
        <div className="exam-info">
          <span className={`error-counter ${errors > 0 ? 'has-errors' : ''}`}>
            Ошибок: {errors} / {MAX_ERRORS}
          </span>
          <span className={`timer ${timeLeft < 60 ? 'timer-warning' : ''}`}>
            {formatTime(timeLeft)}
          </span>
        </div>
        <div className="progress-bar">
          <div
            className="progress-fill"
            style={{ width: `${(answered / EXAM_SIZE) * 100}%` }}
          />
        </div>
        <div className="question-nav-bar">
          {questions.map((_q, i) => (
            <button
              key={i}
              className={`q-nav-btn ${answers[i] !== null ? 'answered' : ''} ${
                i === currentIndex ? 'active' : ''
              }`}
              onClick={() => setCurrentIndex(i)}
            >
              {i + 1}
            </button>
          ))}
        </div>
      </div>

      {currentQuestion && (
        <QuestionCard
          question={currentQuestion}
          selected={answers[currentIndex]}
          onSelect={handleSelect}
          questionNumber={currentIndex + 1}
          totalQuestions={EXAM_SIZE}
        />
      )}

      <div className="exam-footer">
        <button
          className="btn btn-secondary"
          disabled={currentIndex === 0}
          onClick={() => setCurrentIndex((i) => i - 1)}
        >
          Назад
        </button>
        <span className="answered-count">
          {answered} из {EXAM_SIZE}
        </span>
        {currentIndex < EXAM_SIZE - 1 ? (
          <button
            className="btn btn-primary"
            onClick={() => setCurrentIndex((i) => i + 1)}
          >
            Далее
          </button>
        ) : (
          <button
            className="btn btn-success"
            onClick={finishExam}
            disabled={answered < EXAM_SIZE}
          >
            {answered < EXAM_SIZE
              ? `Ответьте на все вопросы (${answered}/${EXAM_SIZE})`
              : 'Завершить экзамен'}
          </button>
        )}
      </div>
    </div>
  );
}
