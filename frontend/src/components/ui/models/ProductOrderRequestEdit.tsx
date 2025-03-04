import React from 'react';

interface ViewModalProps {
    title: string;
    orderLevel: string;
    productnameLevel: string;
    giftpointLevel : string;
    statusLabel: string;
    orderId: string;
    productName: string;
    giftPoint : number;
    status: string;
    onClose: () => void;
    onSubmit: () => void;
    onCancel: () => void;
    setOrderId: (value: string) => void;
    setProductName: (value: string) => void;
    setGiftPoint:(value: number)=> void;
    setStatus: (value: string) => void;
   
}

const ProductOrderRequestEdit: React.FC<ViewModalProps> = ({
    title,
    orderLevel,
    productnameLevel,
    giftpointLevel,
    statusLabel,
    giftPoint,
    orderId,
    productName,
    status,
    onClose,
    onSubmit,
    onCancel,
    setOrderId,
    setProductName,
    setGiftPoint,
    setStatus,
  
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
                            <label htmlFor="orderid" className="form-label text-sm text-defaulttextcolor font-semibold">{orderLevel}</label>
                            <input
                                className="outline-none focus:outline-none focus:ring-0 no-outline focus:border-[#dadada] form-control w-full rounded-5px border border-[#dadada] form-control-light mt-2 text-sm"
                                placeholder="Enter your question here"
                                id="orderid"
                                value={orderId}
                                onChange={(e) => setOrderId(e.target.value)}
                                readOnly
                            />
                        </div>
                        <div className="xl:col-span-12 col-span-12 mb-4">
                            <label htmlFor="productname" className="form-label text-sm text-defaulttextcolor font-semibold">{productnameLevel}</label>
                            <input
                                type="text"
                                className="outline-none focus:outline-none focus:ring-0 no-outline focus:border-[#dadada] form-control w-full rounded-5px border border-[#dadada] form-control-light mt-2 text-sm"
                                placeholder="Enter your answer here"
                                id="productname"
                                value={productName}
                                onChange={(e) => setProductName(e.target.value)}
                                readOnly
                            />
                        </div>
                        <div className="xl:col-span-12 col-span-12 mb-4">
                            <label htmlFor="giftpoint" className="form-label text-sm text-defaulttextcolor font-semibold">{giftpointLevel}</label>
                            <input
                                type="text"
                                className="outline-none focus:outline-none focus:ring-0 no-outline focus:border-[#dadada] form-control w-full rounded-5px border border-[#dadada] form-control-light mt-2 text-sm"
                                placeholder="Enter your answer here"
                                id="giftpoint"
                                value={giftPoint}
                                onChange={(e) => setGiftPoint(e.target.value)}
                                readOnly
                            />
                        </div>
                        <div className="xl:col-span-12 col-span-12 mb-4">
                            <label htmlFor="status" className="form-label text-sm text-defaulttextcolor font-semibold">{statusLabel}</label>
                            <select
                                id="status"
                                className="outline-none focus:outline-none focus:ring-0 no-outline focus:border-[#dadada] form-control w-full rounded-5px border border-[#dadada] form-control-light mt-2 text-sm"
                                value={status}
                                onChange={(e) => setStatus(e.target.value)}
                            >
                                <option value="Pending">Pending</option>
                                <option value="Approved">Approved</option>
                                <option value="Cancel">Cancel</option>
                            </select>
                        </div>
                        
                    </div>
                    <div className='border-t border-defaultborder p-4 flex justify-end'>
                        <button onClick={onSubmit} className="ti-btn text-white bg-primary me-3">Submit</button>
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

export default ProductOrderRequestEdit;
