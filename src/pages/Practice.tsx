import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Question } from '../types';
import { pickRandom } from '../utils/shuffle';
import QuestionCard from '../components/QuestionCard';

export default function Practice() {
  const navigate = useNavigate();
  const [allQuestions, setAllQuestions] = useState<Question[]>([]);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState({ correct: 0, total: 0 });
  const [count, setCount] = useState(10);
  const [lang, setLang] = useState<'ru' | 'es'>('ru');

  useEffect(() => {
    fetch(`${import.meta.env.BASE_URL}data/questions_ru.json`)
      .then((r) => r.json())
      .then((data: Question[]) => {
        setAllQuestions(data);
        setQuestions(pickRandom(data, count));
      })
      .catch(() => navigate('/'));
  }, [navigate, count]);

  const handleSelect = (index: number) => {
    if (showResult) return;
    setSelected(index);
    setShowResult(true);
    const isCorrect = questions[currentIndex].correct[index] === 1;
    setScore((s) => ({
      correct: s.correct + (isCorrect ? 1 : 0),
      total: s.total + 1,
    }));
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((i) => i + 1);
      setSelected(null);
      setShowResult(false);
    }
  };

  const handleNewSet = () => {
    setQuestions(pickRandom(allQuestions, count));
    setCurrentIndex(0);
    setSelected(null);
    setShowResult(false);
    setScore({ correct: 0, total: 0 });
  };

  if (questions.length === 0) {
    return (
      <div className="loading-screen">
        <div className="spinner" />
        <p>Загрузка вопросов...</p>
      </div>
    );
  }

  const isLast = currentIndex === questions.length - 1 && showResult;

  return (
    <div className="practice-page">
      <div className="practice-header">
        <button className="btn btn-outline" onClick={() => navigate('/')}>
          На главную
        </button>
        <div className="practice-controls">
          <label>
            Вопросов:{' '}
            <select
              value={count}
              onChange={(e) => setCount(Number(e.target.value))}
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={30}>30</option>
            </select>
          </label>
          <button className="btn btn-secondary" onClick={handleNewSet}>
            Новый набор
          </button>
        </div>
        <div className="practice-score">
          Правильно: {score.correct} / {score.total}
        </div>
      </div>

      <QuestionCard
        question={questions[currentIndex]}
        selected={selected}
        onSelect={handleSelect}
        showResult={showResult}
        questionNumber={currentIndex + 1}
        totalQuestions={questions.length}
        lang={lang}
        onToggleLang={() => setLang(l => l === 'ru' ? 'es' : 'ru')}
      />

      <div className="practice-footer">
        {showResult && !isLast && (
          <button className="btn btn-primary" onClick={handleNext}>
            Следующий вопрос
          </button>
        )}
        {isLast && (
          <div className="practice-complete">
            <p>
              Готово! Правильных ответов: {score.correct} из {score.total}
            </p>
            <button className="btn btn-primary" onClick={handleNewSet}>
              Новый набор вопросов
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
