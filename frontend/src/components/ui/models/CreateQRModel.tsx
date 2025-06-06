import React, { useState, useRef } from 'react';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: () => void;
    onCancel: () => void;
    onConfirm: (quantity: number) => void;
    title?: string;
    requiredQuantity?: boolean;
    quantityErrorMessage?: string;
}

const CreateQRCodeModal: React.FC<ModalProps> = ({
    isOpen,
    onClose,
    onCancel,
    onConfirm,
    title = "Create QR Code",
    quantityErrorMessage = "Please enter a valid quantity",
    requiredQuantity = false,
}) => {
    const [quantity, setQuantity] = useState<string>("");
    const inputRef = useRef<HTMLInputElement>(null);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // HTML5 validation will handle the rest, but just in case:
        if (!quantity || Number(quantity) < 1) {
            inputRef.current?.setCustomValidity(quantityErrorMessage);
            inputRef.current?.reportValidity();
            return;
        }

        onConfirm(Number(quantity));
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-600 bg-opacity-50">
            <div className="bg-white rounded-lg shadow-lg w-full max-w-lg">
                <form onSubmit={handleSubmit} className="flex flex-col h-full max-h-[80vh]">
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
                                ref={inputRef}
                                type="number"
                                min="1"
                                step="1"
                                value={quantity}
                                onChange={(e) => {
                                    setQuantity(e.target.value);
                                    if (inputRef.current) {
                                        inputRef.current.setCustomValidity('');
                                    }
                                }}
                                className="outline-none focus:outline-none focus:ring-0 no-outline focus:border-[#dadada] w-full p-2 border border-gray-300 rounded mb-4"
                                placeholder="Enter quantity"
                                id="quantity"
                                required={requiredQuantity}
                                onInvalid={(e) => (e.target as HTMLInputElement).setCustomValidity(quantityErrorMessage)}
                                onInput={(e) => (e.target as HTMLInputElement).setCustomValidity("")}
                            />
                        </div>
                    </div>

                    <div className="border-t border-defaultborder p-4 flex justify-end">
                        <button type="submit" className="ti-btn text-white bg-primary me-3">Submit</button>
                        <button type="button" className="bg-primary/20 ti-btn" onClick={onCancel}>Cancel</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateQRCodeModal;
