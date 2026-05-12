import type { ExamResult } from '../types';

interface Props {
  result: ExamResult;
  onReview: () => void;
  onRetry: () => void;
  onHome: () => void;
}

export default function ExamResults({ result, onReview, onRetry, onHome }: Props) {
  const percentage = Math.round((result.correct / result.total) * 100);

  return (
    <div className="results-container">
      <div className={`result-banner ${result.passed ? 'passed' : 'failed'}`}>
        <h1>{result.passed ? 'ЭКЗАМЕН СДАН!' : 'ЭКЗАМЕН НЕ СДАН'}</h1>
        <p className="result-subtitle">
          {result.passed
            ? 'Поздравляем! Вы успешно сдали теоретический экзамен.'
            : 'К сожалению, вы допустили более 3 ошибок. Попробуйте ещё раз.'}
        </p>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <span className="stat-value">{result.total}</span>
          <span className="stat-label">Всего вопросов</span>
        </div>
        <div className="stat-card correct-stat">
          <span className="stat-value">{result.correct}</span>
          <span className="stat-label">Правильно</span>
        </div>
        <div className="stat-card incorrect-stat">
          <span className="stat-value">{result.incorrect}</span>
          <span className="stat-label">Ошибок</span>
        </div>
        <div className="stat-card">
          <span className="stat-value">{percentage}%</span>
          <span className="stat-label">Результат</span>
        </div>
      </div>

      <div className="results-actions">
        <button className="btn btn-primary" onClick={onReview}>
          Посмотреть ответы
        </button>
        <button className="btn btn-secondary" onClick={onRetry}>
          Попробовать снова
        </button>
        <button className="btn btn-outline" onClick={onHome}>
          На главную
        </button>
      </div>
    </div>
  );
}
