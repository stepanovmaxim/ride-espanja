import { useState } from 'react';
import type { Question } from '../types';

interface Props {
  question: Question;
  selected: number | null;
  onSelect: (index: number) => void;
  showResult?: boolean;
  questionNumber: number;
  totalQuestions: number;
}

export default function QuestionCard({
  question,
  selected,
  onSelect,
  showResult = false,
  questionNumber,
  totalQuestions,
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

  return (
    <div className="question-card">
      <div className="question-header">
        <span className="question-number">
          Вопрос {questionNumber} из {totalQuestions}
        </span>
      </div>

      {question.img && !imgError && (
        <div className="question-image">
          <img
            src={`/images/${question.img}`}
            alt="Иллюстрация к вопросу"
            onError={() => setImgError(true)}
          />
          <span className="image-label">Изображение {questionNumber}</span>
        </div>
      )}

      <h3 className="question-text">{question.question}</h3>

      <div className="answers-list">
        {question.answers.map((answer, index) => (
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

      {showResult && question.explanation && (
        <div className="explanation">
          <strong>Пояснение:</strong> {question.explanation}
        </div>
      )}
    </div>
  );
}
