import React from 'react';

interface ViewModalProps {
    title: string;
    questionLabel: string;  // Renamed from 'question' to 'questionLabel'
    answerLabel: string;    // Renamed from 'answer' to 'answerLabel'
    startDateLabel: string; // Label for Start Date
    endDateLabel: string;   // Label for End Date
    question: string;
    answer: string;
    date?: string;
    endDate?: string;       // Value for End Date
    showDate?: boolean;
    showEndDate?: boolean;  // Control visibility of End Date field
    onClose: () => void;
    onSubmit: () => void;
    onCancel: () => void;
    setQuestion: (value: string) => void;
    setAnswer: (value: string) => void;
    setDate?: (value: string) => void;   // Setter for Start Date
    setEndDate?: (value: string) => void; // Setter for End Date
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
}) => {
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
                    <div className='p-4 overflow-auto flex-1'>
                        <div className="xl:col-span-12 col-span-12 mb-4">
                            <label htmlFor="question" className="form-label text-sm text-defaulttextcolor font-semibold">{questionLabel}</label>
                            <input
                                className="form-control w-full rounded-5px border border-[#dadada] form-control-light mt-2 text-sm"
                                placeholder="Enter your question here"
                                id="question"
                                value={question}
                                onChange={(e) => setQuestion(e.target.value)}
                            />
                        </div>
                        <div className="xl:col-span-12 col-span-12 mb-4">
                            <label htmlFor="answer" className="form-label text-sm text-defaulttextcolor font-semibold">{answerLabel}</label>
                            <input
                                type="text"
                                className="form-control w-full rounded-5px border border-[#dadada] form-control-light mt-2 text-sm"
                                placeholder="Enter your answer here"
                                id="answer"
                                value={answer}
                                onChange={(e) => setAnswer(e.target.value)}
                                size={10}  // Set the size of the input to 10 columns
                            />
                        </div>
                        {showDate && (
                            <div className="xl:col-span-12 col-span-12 mb-4">
                                <label htmlFor="date" className="form-label text-sm text-defaulttextcolor font-semibold">
                                    {startDateLabel}
                                </label>
                                <input
                                    type="date"
                                    className="form-control w-full rounded-5px border border-[#dadada] form-control-light mt-2 text-sm"
                                    id="date"
                                    value={date || ''}  // Ensure default value is an empty string if date is undefined
                                    onChange={(e) => setDate && setDate(e.target.value)} // Optional setter
                                />
                            </div>
                        )}

                        {showEndDate && (
                            <div className="xl:col-span-12 col-span-12 mb-4">
                                <label htmlFor="endDate" className="form-label text-sm text-defaulttextcolor font-semibold">
                                    {endDateLabel}
                                </label>
                                <input
                                    type="date"
                                    className="form-control w-full rounded-5px border border-[#dadada] form-control-light mt-2 text-sm"
                                    id="endDate"
                                    value={endDate || ''}  // Ensure default value is an empty string if endDate is undefined
                                    onChange={(e) => setEndDate && setEndDate(e.target.value)} // Optional setter
                                />
                            </div>
                        )}
                    </div>
                    <div className='border-t border-defaultborder p-4 flex justify-end'>
                        <button onClick={onSubmit} className="ti-btn ti-btn-primary bg-primary me-3">Submit</button>
                        <button
                            type="button"
                            className="bg-defaulttextcolor ti-btn text-white"
                            onClick={onCancel}
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ViewModal;
