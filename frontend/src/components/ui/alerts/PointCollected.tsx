import React from 'react';

interface PointCollectedAlertProps {
    pointmessage: string;
    onPointClose: () => void;
    onPointCollect?: () => void; // Callback function for "Collect" button
    pointtitle?: string;
    collectButtonLabel?: string; // Label for the "Collect" button
    showPointButton?: boolean;
    showPointCollectButton?: boolean; // New prop to control the visibility of the "Collect" button
    showMessage?: boolean;
}

const PointCollectedAlert: React.FC<PointCollectedAlertProps> = ({
    pointmessage,
    onPointClose,
    onPointCollect,
    pointtitle = "Success!",
    collectButtonLabel = "Collect", // Default label for the "Collect" button
    showPointButton = true,
    showPointCollectButton = false, // Default to false, so "Collect" button is hidden
    showMessage = true,
}) => {
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-600 bg-opacity-50 z-50">
            <div className="relative bg-white rounded-[1.5rem] border border-t-8 border-t-primary shadow-lg p-6 max-w-sm w-full mx-auto transform transition-all duration-300">
                {showPointButton && (
                    <button
                        type="button"
                        className="absolute top-2 right-2 bi bi-x font-bold text-[1.5rem] text-primary"
                        aria-label="Close"
                        onClick={onPointClose}
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
                    <h5 className="text-xl font-semibold mb-2 text-defaulttextcolor">{pointtitle}</h5>
                    {showMessage && (
                        <p className="text-defaulttextcolor mb-4">{pointmessage}</p>
                    )}
                    <div className="flex justify-center gap-2 mt-4">
                        {showPointCollectButton && onPointCollect && (
                            <button
                                type="button"
                                className="ti-btn ti-btn-primary bg-primary text-white font-medium py-2 px-4 rounded transition-all duration-300"
                                onClick={onPointCollect}
                            >
                                {collectButtonLabel} {/* Use collectButtonLabel here */}
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PointCollectedAlert;
