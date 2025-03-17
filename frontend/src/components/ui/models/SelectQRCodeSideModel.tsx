import React, { useState } from 'react';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    onCancel: () => void;
    onConfirm: (size: number) => void;
    title?: string;
}

const CreateQRCodeModal: React.FC<ModalProps> = ({
    isOpen,
    onClose,
    onCancel,
    onConfirm,
    title = "Select QR Code Size"
}) => {
    const [selectedSize, setSelectedSize] = useState<number>(30); // Default QR size

    const handleConfirm = () => {
        onConfirm(selectedSize);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-600 bg-opacity-50">
            <div className="bg-white rounded-lg shadow-lg w-full max-w-lg">
                <div className="flex flex-col h-full max-h-[80vh]">
                    {/* Modal Header */}
                    <div className="flex justify-between border-b p-4">
                        <h6 className="modal-title text-lg font-semibold text-primary">{title}</h6>
                        <button
                            onClick={onClose}
                            type="button"
                            className="text-lg font-semibold text-defaulttextcolor cursor-pointer"
                        >
                            <span className="sr-only">Close</span>
                            <i className="ri-close-line"></i>
                        </button>
                    </div>

                    {/* Modal Body */}
                    <div className="p-4 overflow-auto flex-1">
                        <div className="mb-4">
                            <label htmlFor="qrSize" className="form-label text-sm text-defaulttextcolor font-semibold">
                                Select QR Code Size
                            </label>
                            <select
                                id="sizeSelect"
                                value={selectedSize}
                                onChange={(e) => setSelectedSize(parseInt(e.target.value, 10))}
                                className="outline-none focus:ring-0 focus:border-[#dadada] w-full p-2 border border-gray-300 rounded mb-4 mt-3"
                            >
                                <option value="30">Size (30x30)</option>
                                <option value="100">Size (100x75)</option>
                            </select>
                        </div>
                    </div>

                    {/* Modal Footer */}
                    <div className="border-t border-defaultborder p-4 flex justify-end">
                        <button onClick={handleConfirm} className="ti-btn text-white bg-primary me-3">
                            Submit
                        </button>
                        <button
                            type="button"
                            className="bg-primary/20 ti-btn"
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

export default CreateQRCodeModal;
