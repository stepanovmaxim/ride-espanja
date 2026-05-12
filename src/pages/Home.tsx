import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loadProgress, type StoredProgress } from '../utils/storage';

export default function Home() {
  const navigate = useNavigate();
  const [progress, setProgress] = useState<StoredProgress | null>(null);
  const [questionCount, setQuestionCount] = useState(0);

  useEffect(() => {
    setProgress(loadProgress());
    fetch(`${import.meta.env.BASE_URL}data/questions_ru.json`)
      .then((r) => r.json())
      .then((d) => setQuestionCount(d.length))
      .catch(() => setQuestionCount(0));
  }, []);

  return (
    <div className="home-page">
      <header className="hero">
        <h1 className="app-title">Ride Espanja</h1>
        <p className="app-subtitle">
          Тренировка теоретического экзамена ПДД Испании (Permiso B)
        </p>
        <p className="app-description">
          Актуальные вопросы DGT на русском языке. {questionCount} вопросов для подготовки.
        </p>
      </header>

      <div className="mode-cards">
        <div className="mode-card exam-card" onClick={() => navigate('/exam')}>
          <div className="mode-icon">&#9998;</div>
          <h2>Пробный экзамен</h2>
          <p>
            30 случайных вопросов. Максимум 3 ошибки. Таймер 30 минут. Полная
            симуляция реального экзамена DGT.
          </p>
          <span className="mode-badge">Режим экзамена</span>
        </div>

        <div className="mode-card practice-card" onClick={() => navigate('/practice')}>
          <div className="mode-icon">&#9997;</div>
          <h2>Тренировка</h2>
          <p>
            Отвечайте на вопросы в свободном режиме. Смотрите пояснения сразу
            после ответа. Изучайте ПДД в удобном темпе.
          </p>
          <span className="mode-badge">Режим обучения</span>
        </div>
      </div>

      {progress && progress.completedExams > 0 && (
        <div className="progress-section">
          <h2>Ваш прогресс</h2>
          <div className="progress-stats">
            <div className="progress-item">
              <span className="progress-value">{progress.completedExams}</span>
              <span className="progress-label">Экзаменов</span>
            </div>
            <div className="progress-item">
              <span className="progress-value">{progress.passedExams}</span>
              <span className="progress-label">Сдано</span>
            </div>
            <div className="progress-item">
              <span className="progress-value">
                {progress.totalAnswered > 0
                  ? Math.round((progress.totalCorrect / progress.totalAnswered) * 100)
                  : 0}
                %
              </span>
              <span className="progress-label">Правильно</span>
            </div>
          </div>
        </div>
      )}

      <footer className="app-footer">
        <p>
          Вопросы основаны на официальных тестах DGT (Direccion General de Trafico).
          Сайт создан для образовательных целей.
        </p>
      </footer>
    </div>
  );
}
