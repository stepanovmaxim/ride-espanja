import { useState } from 'react';
import type { Question } from '../types';

interface Props {
  question: Question;
  selected: number | null;
  onSelect: (index: number) => void;
  showResult?: boolean;
  questionNumber: number;
  totalQuestions: number;
  lang: 'ru' | 'es';
  onToggleLang: () => void;
}

export default function QuestionCard({
  question,
  selected,
  onSelect,
  showResult = false,
  questionNumber,
  totalQuestions,
  lang,
  onToggleLang,
}: Props) {
  const [imgError, setImgError] = useState(false);

  const getAnswerClass = (index: number): string => {
    if (!showResult) {
      return selected === index ? 'selected' : '';
    }
    if (question.correct[index] === 1) return 'correct';
    if (selected === index && question.correct[index] === 0) return 'incorrect';
    return '';
  };

  const qText = lang === 'es' && question.question_es ? question.question_es : question.question;
  const aTexts = lang === 'es' && question.answers_es ? question.answers_es : question.answers;
  const explText = lang === 'es' && question.explanation_es ? question.explanation_es : question.explanation;

  return (
    <div className="question-card">
      <div className="question-header">
        <span className="question-number">
          {lang === 'es' ? 'Pregunta' : 'Вопрос'} {questionNumber} {lang === 'es' ? 'de' : 'из'} {totalQuestions}
        </span>
        {!question.img || imgError ? (
          <button className="lang-toggle" onClick={onToggleLang} title={lang === 'ru' ? 'Ver en español' : 'Смотреть на русском'}>
            {lang === 'ru' ? 'ES' : 'RU'}
          </button>
        ) : null}
      </div>

      {question.img && !imgError && (
        <div className="question-image">
          <img
            src={`${import.meta.env.BASE_URL}images/${question.img}`}
            alt="Иллюстрация к вопросу"
            onError={() => setImgError(true)}
          />
          <div className="image-bottom">
            <span className="image-label">{lang === 'es' ? `Imagen ${questionNumber}` : `Изображение ${questionNumber}`}</span>
            <button className="lang-toggle" onClick={onToggleLang} title={lang === 'ru' ? 'Ver en español' : 'Смотреть на русском'}>
              {lang === 'ru' ? 'ES' : 'RU'}
            </button>
          </div>
        </div>
      )}

      <h3 className="question-text">{qText}</h3>

      <div className="answers-list">
        {aTexts.map((answer, index) => (
          <button
            key={index}
            className={`answer-btn ${getAnswerClass(index)}`}
            onClick={() => !showResult && onSelect(index)}
            disabled={showResult}
          >
            <span className="answer-letter">
              {String.fromCharCode(65 + index)}
            </span>
            <span className="answer-text">{answer}</span>
            {showResult && question.correct[index] === 1 && (
              <span className="answer-icon correct-icon">&#10003;</span>
            )}
            {showResult &&
              selected === index &&
              question.correct[index] === 0 && (
                <span className="answer-icon incorrect-icon">&#10007;</span>
              )}
          </button>
        ))}
      </div>

      {showResult && explText && (
        <div className="explanation">
          <strong>{lang === 'es' ? 'Explicación:' : 'Пояснение:'}</strong> {explText}
        </div>
      )}
    </div>
  );
}
