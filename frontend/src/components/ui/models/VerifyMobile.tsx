import React, { useState, useEffect } from "react";

import { Box, Text } from "@radix-ui/themes";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  mobileNumber: string;
  onVerify: (otp: string) => void;
}

const CreateVerifyMobile: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  mobileNumber,
  onVerify,
}) => {
  const [otp, setOtp] = useState("");
  const [timer, setTimer] = useState(120); 
  const [fullname, setFullname] = useState<string>("");


  // Start countdown timer when modal is open
  useEffect(() => {
    if (isOpen && timer > 0) {
      const interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);

      return () => clearInterval(interval); // Cleanup timer
    }
  }, [isOpen, timer]);

  const handleResend = () => {
    // Logic to resend OTP
    setTimer(120); // Reset timer to 2 minutes
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes}:${seconds < 10 ? `0${seconds}` : seconds}`;
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
              <Text
                as="label"
                htmlFor="username"
                className="text-defaultsize  "
              >
                Enter OTP
              </Text>
              <input
                id="username"
                type="text"
                placeholder="Enter your OTP"
                onChange={(e) => setFullname(e.target.value)}
                value={fullname}
                className="border rounded-[5px] p-2 mt-2 text-xs w-full"
              />
            </Box>
        <div className="flex justify-between items-center mb-4">
          <span
            className="text-blue-600 cursor-pointer text-defaultsize underline"
            onClick={handleResend}
          >
            Resend?
          </span>
          <span className="text-defaultsize">{formatTime(timer)}</span>
        </div>
        <div className="flex justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 w-[47%] bg-gray-200 text-defaultsize text-black rounded-[10px]"
          >
            Cancel
          </button>
          <button
            onClick={() => onVerify(otp)}
            className="px-4 py-2 w-[47%] bg-black text-defaultsize text-white rounded-[10px]"
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
