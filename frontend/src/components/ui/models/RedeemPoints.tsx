import React, { useState } from 'react';

interface PointCollectedAlertProps {
    onPointClose: () => void;
    onPointCollect?: () => void;
    pointtitle?: string;
    collectButtonLabel?: string;
    showPointButton?: boolean;
    showPointCollectButton?: boolean;
    availablepoints?: string;
    minpoints?: string;
    maxpoints?: string;
    showAvailablepoints?: boolean;
    showMinpoints?: boolean;
    pointValue?: string; // New prop for initial point value
    onPointValueChange?: (e: React.ChangeEvent<HTMLInputElement>) => void; // New prop for handling input changes
}

const RedeemPointAlert: React.FC<PointCollectedAlertProps> = ({
    onPointClose,
    onPointCollect,
    pointtitle = "Success!",
    collectButtonLabel = "Collect",
    showPointButton = true,
    showPointCollectButton = false,
    availablepoints,
    minpoints,
    maxpoints,
    showAvailablepoints = true,
    showMinpoints = false,
    pointValue = "", // Default to an empty string
    onPointValueChange,
}) => {
    const [pointredeem, setPointRedeem] = useState<string>(pointValue);

    const handlePointCollect = async () => {
        const redeemedPoints = parseInt(pointredeem, 10);

        if (isNaN(redeemedPoints)) {
            console.error("Invalid points value:", pointredeem);
            return;
        }

        // Call the parent component's onPointCollect function
        if (onPointCollect) {
            onPointCollect();
        }
    };

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
                        {/* Close button icon */}
                    </button>
                )}
                <div className="text-center">
                    <h5 className="text-xl font-semibold mb-2 text-defaulttextcolor">{pointtitle}</h5>
                    {showAvailablepoints && availablepoints && (
                        <p className="text-defaulttextcolor text-sm mb-4">{availablepoints}</p>
                    )}
                    {showMinpoints && minpoints && maxpoints && (
                        <p className="text-defaulttextcolor text-sm mb-4">
                            Minimum Points: {minpoints} <br />
                            Maximum Points: {maxpoints}
                        </p>
                    )}
                </div>
                <div className="mb-4">
                    <input
                        type="number" // Numeric input
                        className="form-control w-full rounded-5px border border-[#dadada] form-control-light mt-2 text-sm"
                        placeholder="Enter points to redeem"
                        id="pointredeem"
                        value={pointredeem}
                        onChange={(e) => {
                            setPointRedeem(e.target.value);
                            if (onPointValueChange) {
                                onPointValueChange(e); // Call parent function if provided
                            }
                        }}
                        size={10} // Set the size of the input to 10 columns
                    />
                </div>
                {showPointCollectButton && onPointCollect && (
                    <div className="flex justify-center gap-2 mt-4">
                        <button
                            type="button"
                            className="ti-btn ti-btn-primary bg-primary text-white font-medium py-2 px-4 rounded transition-all duration-300"
                            onClick={handlePointCollect} // Call the updated function
                        >
                            {collectButtonLabel}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default RedeemPointAlert;
