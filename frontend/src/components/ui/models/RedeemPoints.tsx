import { Notyf } from 'notyf';
import React, { useState } from 'react';
import 'notyf/notyf.min.css';

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
    pointValue?: string; 
    onPointValueChange?: (e: React.ChangeEvent<HTMLInputElement>) => void; 
}
const notyf = new Notyf({ 
    position: { x: 'right', y: 'top' },
    duration: 3000,
    dismissible: true,
    types: [
        {
            type: 'success',
            background: '#4caf50',
            icon: {
                className: 'bi bi-check-circle-fill',
                tagName: 'i',
                color: '#fff',
            },
        },
        {
            type: 'error',
            background: '#f44336',
            icon: {
                className: 'bi bi-x-circle-fill',
                tagName: 'i',
                color: '#fff',
            },
        },
    ],
});

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
    pointValue = "", 
    onPointValueChange,
}) => {
    const [pointredeem, setPointRedeem] = useState<string>(pointValue);

    const handlePointCollect = async () => {
        const redeemedPoints = parseInt(pointredeem, 10);

        if (isNaN(redeemedPoints)) {
            console.log("Invalid points value:", pointredeem);
            notyf.error("Please enter a valid number of points.");
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
                        type="number" 
                        className="outline-none focus:outline-none focus:ring-0 no-outline focus:border-[#dadada] form-control w-full rounded-5px border border-[#dadada] form-control-light mt-2 text-sm"
                        placeholder="Enter points to redeem"
                        id="pointredeem"
                        required
                        value={pointredeem}
                        onChange={(e) => {
                            setPointRedeem(e.target.value);
                            if (onPointValueChange) {
                                onPointValueChange(e); 
                            }
                        }}
                        size={10}
                    />
                </div>
                {showPointCollectButton && onPointCollect && (
                    <div className="flex justify-center gap-2 mt-4">
                        <button
                            type="button"
                            className="ti-btn  bg-primary text-white font-medium py-2 px-4 rounded transition-all duration-300"
                            onClick={handlePointCollect} 
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
