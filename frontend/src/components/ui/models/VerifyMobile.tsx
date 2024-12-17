import React, { useEffect, useState } from "react";
import { Box, Text } from "@radix-ui/themes";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  reSendOtp : ()=> void;
  mobileNumber: string;
  onVerify: (otp: string) => void; // onVerify expects OTP string as a parameter
  otp: string; // OTP value from parent
  setOtp: React.Dispatch<React.SetStateAction<string>>; // Function to set OTP in parent state
}

const CreateVerifyMobile: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  reSendOtp,
  mobileNumber,
  onVerify,
  otp,
  setOtp,
}) => {
  const [timer, setTimer] = useState(120); // Countdown timer state

  // Start countdown timer when modal is open
  useEffect(() => {
    if (isOpen && timer > 0) {
      const interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);

      return () => clearInterval(interval); // Cleanup timer
    }
  }, [isOpen, timer]);

  

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes}:${seconds < 10 ? `0${seconds}` : seconds}`;
  };

  const handleOtpChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setOtp(e.target.value); // Update OTP state in parent component
  };

  return (
    <div className="absolute top-[40%] right-[20%]">
      <div className="bg-white rounded-[10px] shadow-lg w-full max-w-lg">
        <div className="ti-modal-content flex flex-col h-full max-h-[80vh]"></div>
        <div className="p-5 ">
          <h2 className="text-lg text-black mb-2">Verify Number</h2>
          <p className="text-sm text-gray-black mb-4">
            We sent a verification code to your Registered Number:{" "}
            <span className="font-medium text-black">{mobileNumber}</span>{" "}
            <span
              className="text-blue-600 cursor-pointer"
              onClick={onClose} // Replace with edit functionality if needed
            >
              Edit
            </span>
          </p>
          <Box className="mb-4">
            <Text as="label" htmlFor="otp" className="text-defaultsize">
              Enter OTP
            </Text>
            <input
              id="otp"
              type="text"
              placeholder="Enter your OTP"
              onChange={handleOtpChange} // Update OTP state on input change
              value={otp} // Bind OTP state to input value
              className="border rounded-[5px] p-2 mt-2 text-xs w-full"
            />
          </Box>
          <div className="flex justify-between items-center mb-4">
            <span
              className="text-blue-600 cursor-pointer text-defaultsize underline"
              onClick={reSendOtp}
            >
              Resend?
            </span>
            <span className="text-defaultsize">{formatTime(timer)}</span>
          </div>
          <div className="flex justify-between">
            <button
              onClick={onClose}
              className="px-4 py-2 w-[47%] bg-primary/20 text-defaultsize text-black rounded-[10px]"
            >
              Cancel
            </button>
            <button
              onClick={() => onVerify(otp)} // Pass OTP value when Verify button is clicked
              className="px-4 py-2 w-[47%] bg-primary text-defaultsize text-white rounded-[10px]"
            >
              Verify
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateVerifyMobile;
