import React, { useState } from "react";
import "../../../assets/css/header.css";
import "../../../assets/css/style.css";
import Pageheader from "../../../components/common/pageheader/pageheader";
import ProductImage from "../../../assets/images/reward_management/Group 20.png";
import { CardContent } from "@mui/joy";
import RewardImage from "../../../assets/images/reward_management/Frame.png";
import { Box, Text,Button } from "@radix-ui/themes";
import MobileVerify from '../../../components/ui/models/VerifyMobile';
const ProductOrder = () => {
  const [fullname, setFullname] = useState<string>("");
  const [isMobileVerifyOpen, setIsMobileVerifyOpen] = useState<boolean>(false);

  const product = {
    name: "iPhone 16 (128GB)",

    image: ProductImage,
  };
  const handleLogin = () => {
    console.log("clicked");
  };
  const handlecancel =() => {
    console.log(" cancle");
  };
  const handlelorder =(e: React.FormEvent) => {
    e.preventDefault();
    // console.log("Place order");
    setIsMobileVerifyOpen(true); // Open the MobileVerify modal
  };
  const closeMobileVerify = () => {
    setIsMobileVerifyOpen(false);
  };

  return (
    <>
      <Pageheader
        currentpage="Product Order"
        activepage="/products-order"
        mainpage="/product-details/:productId"
        activepagename="Product Details"
        mainpagename="Product Order"
      />

      <div className="flex justify-center mt-10 ">
        <div className="border border-defaultborder shadow-lg rounded-[10px] p-5 bg-[#F5F4F4]">
          <div className="grid grid-cols-2 gap-4">
            <div className="w-full h-full">
              <img
                src={product.image}
                alt={product.name}
                className="object-cover rounded-md w-full h-full"
              />
            </div>

            <div className="flex flex-col justify-between p-4">
              <CardContent>
                <div className="text-black text-lg pt-3">{product.name}</div>

                <div className="text-defaulttextcolor text-md pt-5">Points</div>

                <div className="flex items-center">
                  <img
                    src={RewardImage}
                    className="mr-2 h-5 w-5"
                    alt="reward-icon"
                  />
                  <p className="text-xl text-black">5,500</p>
                </div>
              </CardContent>
            </div>
          </div>
        </div>
      </div>
      <div className="flex justify-center mt-5 ">
        <div className="px-10 py-5 bg-white border border-defaultborder rounded-[10px]">
          <form onSubmit={handleLogin} className="max-w-[480px] w-[480px]">
            <Box className="mb-4">
              <Text
                as="label"
                htmlFor="username"
                className="text-defaultsize  "
              >
                Enter Full Name
              </Text>
              <input
                id="username"
                type="text"
                placeholder="Enter your Full Name"
                onChange={(e) => setFullname(e.target.value)}
                value={fullname}
                className="border rounded-[5px] p-2 mt-2 text-xs w-full"
              />
            </Box>
            <Box className="mb-4">
              <Text
                as="label"
                htmlFor="username"
                className="text-defaultsize  "
              >
                Enter Email id
              </Text>
              <input
                id="username"
                type="text"
                placeholder="Enter Email id"
                onChange={(e) => setFullname(e.target.value)}
                value={fullname}
                className="border rounded-[5px] p-2 mt-2 text-xs w-full"
              />
            </Box>
            <Box className="mb-4">
              <Text
                as="label"
                htmlFor="username"
                className="text-defaultsize  "
              >
                Enter mobile number
              </Text>
              <input
                id="username"
                type="text"
                placeholder="Enter mobile number"
                onChange={(e) => setFullname(e.target.value)}
                value={fullname}
                className="border rounded-[5px] p-2 mt-2 text-xs w-full"
              />
            </Box>
            <Box className="mb-4">
              <Text
                as="label"
                htmlFor="username"
                className="text-defaultsize  "
              >
                Address
              </Text>
              <input
                id="username"
                type="text"
                placeholder="Enter your Address"
                onChange={(e) => setFullname(e.target.value)}
                value={fullname}
                className="border rounded-[5px] p-2 mt-2 text-xs w-full"
              />
            </Box>
            <Box className="mb-4">
              <Text
                as="label"
                htmlFor="username"
                className="text-defaultsize  "
              >
                Pincode
              </Text>
              <input
                id="username"
                type="text"
                placeholder="365601"
                onChange={(e) => setFullname(e.target.value)}
                value={fullname}
                className="border rounded-[5px] p-2 mt-2 text-xs w-full"
              />
            </Box>
            <Box className="mb-4">
              <Text
                as="label"
                htmlFor="username"
                className="text-defaultsize  "
              >
                City
              </Text>
              <input
                id="username"
                type="text"
                placeholder="Amreli"
                onChange={(e) => setFullname(e.target.value)}
                value={fullname}
                className="border rounded-[5px] p-2 mt-2 text-xs w-full"
              />
            </Box>
            <div className="flex gap-6">
            <Button
              type="submit"
              onClick={handlecancel}
              id="logincarpenter"
              className="w-[47%] mb-2 bg-[#F2F2F2] text-black font-normal  "
            >
              Cancel
            </Button>
            <Button
              type="submit"
              onClick={handlelorder}
              id="logincarpenter"
              className="w-[47%] mb-2 bg-black !text-white font-normal "
            >
              Place Order
            </Button>
            </div>

            
          </form>
        </div>
      </div>
      {/* MobileVerify Modal */}
      {isMobileVerifyOpen && <MobileVerify onClose={closeMobileVerify} isOpen={false} mobileNumber={""} onVerify={function (otp: string): void {
              throw new Error("Function not implemented.");
          } } />}
    </>
  );
};

export default ProductOrder;
