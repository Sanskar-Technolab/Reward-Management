import axios from 'axios';
import { useEffect, useState } from 'react';
import { Notyf } from 'notyf';
import 'notyf/notyf.min.css'; 
import { useFrappeGetCall } from "frappe-react-sdk";
import "../../../assets/css/header.css";
import "../../../assets/css/style.css";
import Pageheader from "../../../components/common/pageheader/pageheader";
import ProductImage from "../../../assets/images/reward_management/Group 20.png";
import { CardContent } from "@mui/joy";
import { useParams } from "react-router-dom";
import RewardImage from "../../../assets/images/reward_management/Frame.png";
import { Box, Text, Button } from "@radix-ui/themes";
import MobileVerify from '../../../components/ui/models/VerifyMobile';


const ProductOrder = () => {

  const [fullname, setFullname] = useState<string>("");
  const [isMobileVerifyOpen, setIsMobileVerifyOpen] = useState<boolean>(false);
  const [currentProduct, setCurrentProduct] = useState<any>(null);
  const { productId } = useParams<{ productId: string }>();
  console.log("product order",productId)
 
  const { data, isLoading, error } = useFrappeGetCall(
    "reward_management.api.carpenter_master.get_carpainter_data"
  );
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


    // Initialize Notyf for notifications
    const notyf = new Notyf({
      duration: 3000,  
      position: { x: 'center', y: 'top' }, // Position notification at the top center
    });
  
    useEffect(() => {
      const fetchProducts = async () => {
        try {
          const response = await axios.get(
            "/api/method/reward_management.api.gift_product.get_gift_products"
          );
          const productData = response.data.message.data;
  
          if (response.data.message.status === "success") {
            if (Array.isArray(productData) && productData.length > 0) {
              // Find the product that matches the productId from the URL
              const matchedProduct = productData.find(
                (product) =>
                  product.gift_product_name.replace(/\s+/g, "-").toLowerCase() ===
                  productId?.toLowerCase()
              );
  
              if (matchedProduct) {
                setCurrentProduct(matchedProduct);
              } else {
                setCurrentProduct(null); // No matching product found
              }
            } else {
              setCurrentProduct(null); // No products available
            }
          } else {
            setCurrentProduct(null); // API error status
          }
        } catch (err) {
          setCurrentProduct(null); // Error fetching products
        }
      };
  
      fetchProducts();
    }, [productId]);

  return (
    <>
      <Pageheader
        currentpage="Product Order"
        activepage={`/product-details/${productId}`} // Correctly format the dynamic URL
        mainpage="/product-order"
        activepagename="Product Details"
        mainpagename="Product Order"
      />

      <div className="flex justify-center mt-10 ">
        <div className="border border-defaultborder shadow-lg rounded-[10px] p-5 bg-[#F5F4F4] w-[565px] h-[250px]">
        {currentProduct ? (
          <div className="grid grid-cols-2 gap-4">
            <div className="w-full h-full">
              <img
                src={currentProduct.gift_product_images?.[0]?.gift_product_image || ProductImage}
                alt={currentProduct.gift_product_name}
                className="object-center rounded-[10px] w-full h-[200px]"
              />
            </div>

            <div className="flex flex-col justify-between p-4 ">
              <CardContent >
                {/* <div className="text-black text-lg pt-3">{productId}</div> */}
                <div className="text-black text-lg pt-3">{currentProduct.gift_product_name}</div>

                <div className="text-defaulttextcolor text-md pt-5">Points</div>

                <div className="flex items-center">
                  <img
                    src={RewardImage}
                    className="mr-2 h-5 w-5"
                    alt="reward-icon"
                  />
                  <p className="text-xl text-black">{currentProduct.points}</p>
                </div>
              </CardContent>
            </div>
          </div>
           ) : (
            <div className="text-center text-red-500">Product not found</div>
          )}
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
