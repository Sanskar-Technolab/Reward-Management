import React, { useState } from 'react';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: () => void;
    onCancel: () => void;
    onConfirm: (quantity: number) => void;
    title?: string; // Optional title prop
}

const CreateQRCodeModal: React.FC<ModalProps> = ({
    isOpen,
    onClose,
    onCancel,
    onConfirm,
    title = "Create QR Code"
}) => {
    const [quantity, setQuantity] = useState<number>(0);

    const handleConfirm = () => {
        onConfirm(quantity);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-600 bg-opacity-50">
            <div className="bg-white rounded-lg shadow-lg w-full max-w-lg">
                <div className="flex flex-col h-full max-h-[80vh]">
                    <div className="flex justify-between border-b p-4">
                        <h6 className="modal-title text-1rem font-semibold text-primary">{title}</h6>
                        <button onClick={onClose} type="button" className="text-lg font-semibold text-defaulttextcolor">
                            <span className="sr-only">Close</span>
                            <i className="ri-close-line"></i>
                        </button>
                    </div>
                    <div className="p-4 overflow-auto flex-1">
                        <div className="xl:col-span-12 col-span-12 mb-4">
                            <label htmlFor="quantity" className="form-label text-sm text-defaulttextcolor font-semibold">Quantity</label>
                            <input
                                type="number"
                                min="1"
                                value={quantity}
                                onChange={(e) => setQuantity(Number(e.target.value))}
                                className="w-full p-2 border border-gray-300 rounded mb-4"
                                placeholder="Enter quantity"
                                id="quantity"
                            />
                        </div>
                    </div>
                    <div className="border-t border-defaultborder p-4 flex justify-end">
                        <button onClick={handleConfirm} className="ti-btn ti-btn-primary bg-primary me-3">Submit</button>
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

export default CreateQRCodeModal;
