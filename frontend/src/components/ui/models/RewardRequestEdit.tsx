import React from 'react';

interface ViewModalProps {
    title: string;
    questionLabel: string;
    answerLabel: string;
    statusLabel: string;
    transactionIdLabel: string;
    amountLabel: string;
    question: string;
    answer: string;
    status: string;
    transactionId: string;
    amount: string;
    onClose: () => void;
    onSubmit: () => void;
    onCancel: () => void;
    setQuestion: (value: string) => void;
    setAnswer: (value: string) => void;
    setStatus: (value: string) => void;
    setTransactionId: (value: string) => void;
    setAmount: (value: string) => void;
    showTransactionId: boolean;
    showAmount: boolean;
}

const RewardRequestEdit: React.FC<ViewModalProps> = ({
    title,
    questionLabel,
    answerLabel,
    statusLabel,
    transactionIdLabel,
    amountLabel,
    question,
    answer,
    status,
    transactionId,
    amount,
    onClose,
    onSubmit,
    onCancel,
    setQuestion,
    setAnswer,
    setStatus,
    setTransactionId,
    setAmount,
    showTransactionId,
    showAmount
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
                                readOnly
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
                                readOnly
                            />
                        </div>
                        <div className="xl:col-span-12 col-span-12 mb-4">
                            <label htmlFor="status" className="form-label text-sm text-defaulttextcolor font-semibold">{statusLabel}</label>
                            <select
                                id="status"
                                className="form-control w-full rounded-5px border border-[#dadada] form-control-light mt-2 text-sm"
                                value={status}
                                onChange={(e) => setStatus(e.target.value)}
                            >
                                <option value="Pending">Pending</option>
                                <option value="Approved">Approved</option>
                                <option value="Cancel">Cancel</option>
                            </select>
                        </div>
                        {showTransactionId && (
                        <div className="xl:col-span-12 col-span-12 mb-4">
                            <label htmlFor="transactionid" className="form-label text-sm text-defaulttextcolor font-semibold">{transactionIdLabel}</label>
                            <input
                                type="text"
                                className="form-control w-full rounded-5px border border-[#dadada] form-control-light mt-2 text-sm"
                                placeholder="Enter Transaction ID here"
                                id="transactionid"
                                value={transactionId}
                                onChange={(e) => setTransactionId(e.target.value)}
                            />
                        </div>
                         )}
                            {showAmount && (
                        <div className="xl:col-span-12 col-span-12 mb-4">
                            <label htmlFor="amount" className="form-label text-sm text-defaulttextcolor font-semibold">{amountLabel}</label>
                            <input
                                type="text"
                                className="form-control w-full rounded-5px border border-[#dadada] form-control-light mt-2 text-sm"
                                placeholder="Enter Amount here"
                                id="amount"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
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

export default RewardRequestEdit;
