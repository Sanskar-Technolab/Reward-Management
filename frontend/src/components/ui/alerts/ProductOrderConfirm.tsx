import React from 'react';

interface ProductOrderConfirmProps {
  onClose: () => void;
  title?: string;
  productImage: string;
  productName: string;
  points: number;
  rewardIcon: string;
  successMessage: string;
  onContinue: () => void;
}

const ProductOrderConfirm: React.FC<ProductOrderConfirmProps> = ({
  onClose,
  title = "Congratulations!",
  productImage,
  productName,
  points,
  rewardIcon,
  successMessage,
  onContinue,
}) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-600 bg-opacity-50 z-50">
      <div className="relative bg-white rounded-[1.5rem] border border-t-8 border-t-primary shadow-lg p-6 max-w-sm w-full mx-auto transform transition-all duration-300">
        <button
          type="button"
          className="absolute top-2 right-2 bi bi-x font-bold text-[1.5rem] text-primary"
          aria-label="Close"
          onClick={onClose}
        />
        <div className="text-center">
          <h5 className="text-xl font-semibold mb-2 text-defaulttextcolor">{title}</h5>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="w-full h-full">
            <img
              src={productImage}
              alt={productName}
              className="object-center rounded-[10px] w-full h-[200px]"
            />
          </div>
          <div className="flex flex-col justify-between p-4">
            <div>
              <div className="text-black text-lg pt-3">{productName}</div>
              <div className="text-defaulttextcolor text-md pt-5">Points</div>
              <div className="flex items-center">
                <img
                  src={rewardIcon}
                  className="mr-2 h-5 w-5"
                  alt="reward-icon"
                />
                <p className="text-xl text-black">{points}</p>
              </div>
             
            </div>
          </div>
        </div>
        <div className='pt-3 text-center'>
        <p className="text-black text-defaultsize pt-4">{successMessage}</p>
        </div>
        <div className="mt-6 text-center">
          <button
            type="button"
            className="bg-primary text-white font-semibold py-2 px-4 rounded-lg hover:bg-primary-dark transition"
            onClick={onContinue}
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductOrderConfirm;
