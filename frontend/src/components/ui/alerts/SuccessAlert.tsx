import React from 'react';

interface SuccessAlertProps {
    message: string;
    messagesecond?: string;
    onClose: () => void;
    onCancel: () => void;
    onCollect?: () => void;
    onAnotherAction?: () => void; // Another action callback
    title?: string;
    buttonLabel?: string;
    collectButtonLabel?: string;
    anotherActionLabel?: string; // Label for another button
    showButton?: boolean;
    showCancleButton?:boolean;
    showCollectButton?: boolean;
    showAnotherButton?: boolean; // Control visibility of the additional button
    showMessage?: boolean;
    showMessagesecond?: boolean;
}

const SuccessAlert: React.FC<SuccessAlertProps> = ({
    message,
    messagesecond,
    onClose,
    onCancel,
    onCollect,
    onAnotherAction,
    title = "Success!",
    buttonLabel = "Close",
    collectButtonLabel = "Collect",
    anotherActionLabel = "Another Action", 
    showButton = true,
    showCancleButton=false,
    showCollectButton = false,
    showAnotherButton = false, // Default to false
    showMessage = true,
    showMessagesecond = false,
}) => {
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-600 bg-opacity-50 z-50">
            <div className="relative bg-white rounded-[1.5rem] border border-t-8 border-t-primary shadow-lg p-6 max-w-sm w-full mx-auto transform transition-all duration-300">
                {showButton && (
                    <button
                        type="button"
                        className="absolute top-2 right-2 bi bi-x font-bold text-[1.5rem] text-primary"
                        aria-label="Close"
                        onClick={onClose}
                    >
                    </button>
                )}
                <div className="flex items-center justify-center mb-4">
                    <svg
                        className="w-12 h-12 text-primary"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                    >
                        <path d="M0 0h24v24H0z" fill="none" />
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                    </svg>
                </div>
                <div className="text-center">
                    <h5 className="text-xl font-semibold mb-2 text-defaulttextcolor">{title}</h5>
                    {showMessage && (
                        <p className="text-defaulttextcolor mb-4">{message}</p>
                    )}
                    {showMessagesecond && (
                        <p className="text-defaulttextcolor mb-4">{messagesecond}</p>
                    )}
                    <div className="flex justify-center gap-2 mt-4">
                        {showCollectButton && onCollect && (
                            <button
                                type="button"
                                className="ti-btn ti-btn-primary bg-primary text-white font-medium py-2 px-4 rounded transition-all duration-300"
                                onClick={onCollect}
                            >
                                {collectButtonLabel}
                            </button>
                        )}
                        {showAnotherButton && onAnotherAction && (
                            <button
                                type="button"
                                className="ti-btn ti-btn-primary bg-primary text-white font-medium py-2 px-4 rounded transition-all duration-300"
                                onClick={onAnotherAction}
                            >
                                {anotherActionLabel}
                            </button>
                        )}
                        {showCancleButton && (
                            <button
                                type="button"
                                className="ti-btn ti-btn-primary bg-primary text-white font-medium py-2 px-4 rounded transition-all duration-300"
                                onClick={onCancel}
                            >
                                {buttonLabel}
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SuccessAlert;
