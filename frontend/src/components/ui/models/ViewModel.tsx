import React from 'react';
import { Notyf } from 'notyf';
import 'notyf/notyf.min.css';


 const notyf = new Notyf({
        position: {
            x: 'right',
            y: 'top',
        },
        duration: 5000, 
    });

interface ViewModalProps {
  title: string;
  questionLabel: string;
  answerLabel: string;
  startDateLabel: string;
  endDateLabel: string;
  question: string;
  answer: string;
  date?: string;
  endDate?: string;
  showDate?: boolean;
  showEndDate?: boolean;
  onClose: () => void;
  onSubmit: () => void;
  onCancel: () => void;
  setQuestion: (value: string) => void;
  setAnswer: (value: string) => void;
  setDate?: (value: string) => void;
  setEndDate?: (value: string) => void;

  // Optional placeholders
  questionPlaceholder?: string;
  answerPlaceholder?: string;
  startDatePlaceholder?: string;
  endDatePlaceholder?: string;

  // Validation control props
  requiredQuestion?: boolean;
  requiredAnswer?: boolean;
  questionErrorMessage?: string;
  answerErrorMessage?: string;

  
}

const ViewModal: React.FC<ViewModalProps> = ({
  title,
  questionLabel,
  answerLabel,
  startDateLabel,
  endDateLabel,
  question,
  answer,
  date,
  endDate,
  showDate = false,
  showEndDate = false,
  onClose,
  onSubmit,
  onCancel,
  setQuestion,
  setAnswer,
  setDate,
  setEndDate,
  questionPlaceholder = "Enter your question here",
  answerPlaceholder = "Enter your answer here",
  startDatePlaceholder = "",
  endDatePlaceholder = "",
  requiredQuestion = false,
  requiredAnswer = false,
  questionErrorMessage = "Question is required",
  answerErrorMessage = "Answer is required",
}) => {
  const handleSubmit = () => {
    if (requiredQuestion && !question.trim()) {
      notyf.error(questionErrorMessage);
      return;
    }

    if (requiredAnswer && !answer.trim()) {
      notyf.error(answerErrorMessage);
      return;
    }

    onSubmit();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-lg">
        <div className="ti-modal-content flex flex-col h-full max-h-[80vh]">
          <div className="ti-modal-header flex justify-between border-b p-4">
            <h6 className="modal-title text-1rem font-semibold text-primary">{title}</h6>
            <button onClick={onClose} type="button" className="text-1rem font-semibold text-defaulttextcolor">
              <span className="sr-only">Close</span>
              <i className="ri-close-line"></i>
            </button>
          </div>

          <div className="p-4 overflow-auto flex-1">
            <div className="mb-4">
              <label htmlFor="question" className="form-label text-sm text-defaulttextcolor font-semibold">
                {questionLabel} <span className="text-red">*</span>
              </label>
              <input
                className="outline-none focus:outline-none focus:ring-0 form-control w-full rounded-5px border border-[#dadada] mt-2 text-sm"
                placeholder={questionPlaceholder}
                id="question"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
              />
            </div>

            <div className="mb-4">
              <label htmlFor="answer" className="form-label text-sm text-defaulttextcolor font-semibold">
                {answerLabel} <span className="text-red">*</span>
              </label>
              <input
                type="text"
                className="outline-none focus:outline-none focus:ring-0 form-control w-full rounded-5px border border-[#dadada] mt-2 text-sm"
                placeholder={answerPlaceholder}
                id="answer"
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
              />
            </div>

            {showDate && (
              <div className="mb-4">
                <label htmlFor="date" className="form-label text-sm text-defaulttextcolor font-semibold">
                  {startDateLabel}
                </label>
                <input
                  type="date"
                  className="outline-none focus:outline-none focus:ring-0 form-control w-full rounded-5px border border-[#dadada] mt-2 text-sm"
                  id="date"
                  placeholder={startDatePlaceholder}
                  value={date || ''}
                  onChange={(e) => setDate && setDate(e.target.value)}
                />
              </div>
            )}

            {showEndDate && (
              <div className="mb-4">
                <label htmlFor="endDate" className="form-label text-sm text-defaulttextcolor font-semibold">
                  {endDateLabel}
                </label>
                <input
                  type="date"
                  className="outline-none focus:outline-none focus:ring-0 form-control w-full rounded-5px border border-[#dadada] mt-2 text-sm"
                  id="endDate"
                  placeholder={endDatePlaceholder}
                  value={endDate || ''}
                  onChange={(e) => setEndDate && setEndDate(e.target.value)}
                />
              </div>
            )}
          </div>

          <div className="border-t border-defaultborder p-4 flex justify-end">
            <button onClick={handleSubmit} className="ti-btn bg-primary text-white me-3">
              Submit
            </button>
            <button type="button" className="bg-primary/20 ti-btn" onClick={onCancel}>
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewModal;
