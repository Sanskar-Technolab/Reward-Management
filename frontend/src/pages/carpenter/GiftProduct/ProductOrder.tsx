import axios from 'axios';
import { useEffect, useState } from 'react';
import { Notyf } from 'notyf';
import 'notyf/notyf.min.css';
// import { useFrappeGetCall } from "frappe-react-sdk";
import "../../../assets/css/header.css";
import "../../../assets/css/style.css";
import Pageheader from "../../../components/common/pageheader/pageheader";
import ProductImage from "../../../assets/images/reward_management/Group 20.png";
import { CardContent } from "@mui/joy";
import { useParams } from "react-router-dom";
import RewardImage from "../../../assets/images/reward_management/Frame.png";
import { Box, Text, Button } from "@radix-ui/themes";
import MobileVerify from '../../../components/ui/models/VerifyMobile';
import ProductOrderConfirm from '../../../components/ui/alerts/ProductOrderConfirm';
import validator from 'validator';


const ProductOrder = () => {
    const [fullname, setFullname] = useState<string>("");
    const [fullnameError, setFullnameError] = useState<string>('');
    const [email, setEmail] = useState<string>("");
    const [emailError, setEmailError] = useState<string>('');
    const [city, setCity] = useState<string>("");
    const [cityError, setCityError] = useState<string>('');
    const [address, setAddress] = useState<string>("");
    const [addressError, setAddressError] = useState<string>('');
    const [mobile, setMobile] = useState<string>("");
    const [pincode, setPincode] = useState<string>("");
    const [pincodeError, setPincodeError] = useState<string>('');
    const [isMobileVerifyOpen, setIsMobileVerifyOpen] = useState<boolean>(false);
    const [currentProduct, setCurrentProduct] = useState<any>(null);
    const [generatedOtp, setGeneratedOtp] = useState(null);
    const [otp, setOtp] = useState("");
    const [showConfirmOrder, setShowConfirmOrder] = useState<boolean>(false);
    const [error, setError] = useState<string>("");

    const { productId } = useParams<{ productId: string }>();

    const notyf = new Notyf({
        duration: 6000,
        position: { x: "center", y: "top" },
    });


    const handleFullnameChnage = (e: React.ChangeEvent<HTMLInputElement>) => {
       const value = e.target.value;
       setFullname(value);
       setFullnameError('');
       
       
    //    if (value && !validator.isAlpha(value)) {
    //         setFullnameError('Please enter a valid name');
    //     }
    // };

        if (value && !/^[A-Za-z\s]+$/.test(value)) {
        setFullnameError('Please enter a valid name');
    }
  };


    const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setEmail(value);
        
        if (value && !validator.isEmail(value)) {
            setEmailError('Please enter a valid email address');
        } else {
            setEmailError('');
        }
    };
    const handleAddressChnage = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value; 
        setAddress(value);
        setAddressError('');
        if (value && !validator.isAlphanumeric(value)) {
            setAddressError('Please enter a valid address');
        }
    };

    const handleCityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setCity(value);
        setCityError('');
        
        if (value && !validator.isAlpha(value)) {
            setCityError('Please enter a valid city name');
        }
    };

    const handlePincodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setPincode(value);
        if (value && !/^\d{6}$/.test(value)) {
            setPincodeError('Please enter a valid 6-digit pincode');
        } else {
            setPincodeError('');
        }
    };

    const handleOrder = async () => {
        if (!fullname || !mobile || !address || !pincode || !city) {
            notyf.error("All fields are required!");
            return;
        }
        
        try {
            const response = await axios.post(
                "/api/method/reward_management.api.product_order.create_new_product_order",
                {
                    product_name: currentProduct?.gift_product_name,
                    fullname,
                    city,
                    mobile,
                    pincode,
                    address,
                    email,
                }
            );

            if (response.data.message.status === "success") {
                notyf.success(response.data.message);

                handleCancel();
                setShowConfirmOrder(false);

            } else {
                notyf.error(response.data.message);
            }
        } catch (error) {
            console.error("Error placing order:", error);
            notyf.error("Failed to place order. Please try again.");
        }
    };

    const handleCancel = () => {
        setFullname("");
        setEmail("");
        setCity("");
        setAddress("");
        setMobile("");
        setPincode("");
        setOtp("");

    };

    const closeMobileVerify = () => {
        setIsMobileVerifyOpen(false);
    };

    const openMobileVerify = async () => {
      // console.log("Generated OTP:", generatedOtp);
      // console.log("User-entered OTP:", otp);
  
      // Ensure both values are strings for comparison
      if (generatedOtp?.toString() !== otp?.toString()) {
          notyf.error("Entered OTP does not match the generated OTP.");
          // console.log("OTP mismatch");
          return;
      }
  
      try {
          const response = await axios.get(
              `/api/method/reward_management.api.mobile_number.verify_otp_product_order`,
              { params: { mobile_number: mobile, otp: otp } }
          );
          // console.log("OTP Verification Response:", response);
  
          if (response.data.message.status === "success") {
              notyf.success("OTP verified successfully.");
              setShowConfirmOrder(true);
              setIsMobileVerifyOpen(false);
              // handleOrder();
          } else {
              notyf.error(response.data.message);
          }
      } catch (error) {
          console.error("Error verifying OTP:", error);
          notyf.error("Failed to verify OTP. Please try again.");
      }
  };
  

    const openMobile = async () => {
        if (fullnameError) {
          notyf.error("Name cannot be alphanumeric");
          return;
      }
        if (emailError) {
            notyf.error("Please enter a valid email address");
            return;
        }

        if (addressError) {
          notyf.error("Address cnnot be sepecial character");
          return;
      }
        if (pincodeError) {
            notyf.error("Please enter a valid 6-digit pincode");
            return;
        }
        if (mobile.length !== 10) {
            notyf.error("Please enter a valid 10-digit mobile number");
            return;
        }
      

        if (cityError) {
            notyf.error("City cannot be alphanumeric");
            return;
        }
      


        try {
            const otpResponse = await axios.post(
                `/api/method/reward_management.api.mobile_number.generate_or_update_otp`,
                { mobile_number: mobile,
                  template_name:"place_order"


                 },
                { headers: { "Content-Type": "application/json" } }
            );

            if (otpResponse.data.message.status === "success") {
                const otp = otpResponse.data.message.otp;
                // console.log("otp",otp);
                notyf.success("OTP sent successfully.");
                setGeneratedOtp(otp);
                setIsMobileVerifyOpen(true);
            } else {
                notyf.error(otpResponse.data.message);
            }
        } catch (error) {
            console.error("Error generating OTP:", error);
            notyf.error("Failed to generate OTP. Please try again.");
        }
    };

    useEffect(() => {

      const fetchCarpenterData = async (loggedInUser:any) => {
        try {
          const response = await axios.get(
            '/api/method/reward_management.api.carpenter_master.get_carpainter_data',
            { params: { user: loggedInUser } }
          );
  
          if (response && response.data.message.carpainter_data) {
            const carpainterData = response.data.message.carpainter_data;
            console.log('Fetched Carpenter Data:', carpainterData);
            setMobile(carpainterData[0].mobile_number || '');
  
            if (Array.isArray(carpainterData) && carpainterData.length > 0) {
              // setCurrentPoints(carpainterData[0].current_points || 0);
            } else {
              setError('No carpenter data available.');
            }
          } else {
            setError('Invalid response from carpenter data API.');
          }
        } catch (error) {
          console.error('Error fetching carpenter data:', error);
          setError('Failed to fetch carpenter data.');
        }
      };
  
      const fetchUserData = async () => {
        try {
          const response = await axios.get('/api/method/frappe.auth.get_logged_user');
          const loggedInUser = response.data.message;
          console.log('Logged in user:', loggedInUser);
  
          if (loggedInUser) {
            await fetchCarpenterData(loggedInUser);
          } else {
            setError('No logged-in user found.');
          }
        } catch (error) {
          console.error('Error fetching logged user data:', error);
          setError('Failed to fetch user data.');
        }
      };
  
     
  
        const fetchProducts = async () => {
            try {
                const response = await axios.get(
                    "/api/method/reward_management.api.gift_product.get_gift_products"
                );
                const productData = response.data.message.data;

                if (response.data.message.status === "success") {
                    const matchedProduct = productData.find(
                        (product:any) =>
                            product.gift_product_name
                                .replace(/\s+/g, "-")
                                .toLowerCase() === productId?.toLowerCase()
                    );

                    setCurrentProduct(matchedProduct || null);
                } else {
                    setCurrentProduct(null);
                }
            } catch (err) {
                setCurrentProduct(null);
            }
        };
        fetchUserData();

        fetchProducts();
    }, [productId]);


    const handlecancel =() => {
      console.log(" cancle");
    };

    if (error) {
      return (
        <div className="text-center py-10">
          <p className="text-xl font-semibold text-red-500">{error}</p>
          {/* <Link to="/gift-products" className="text-blue-500 underline">
            Back to Products
          </Link> */}
        </div>
      );
    }
  
    return (
      <>
        <Pageheader
          currentpage="Product Order"
          activepage={`/product-details/${productId}`} 
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
        <div className="flex justify-center mt-5 pb-5">
          <div className="px-10 py-5 bg-white border border-defaultborder rounded-[10px] overflow-y-scroll">
            <form onSubmit={(e) => {
              e.preventDefault();
              openMobile();
            }} className="max-w-[480px] w-[480px]">
              <Box className="mb-4">
                <Text
                  as="label"
                  htmlFor="fullname"
                  className="text-defaultsize  "
                >
                  Enter Full Name <span className='text-red'>*</span>
                </Text>
                <input
                  required
                  id="fullname"
                  type="text"
                  placeholder="Enter your Full Name"
                  // onChange={(e) => setFullname(e.target.value)}
                  onChange={handleFullnameChnage}
                  value={fullname}
                  // className="border rounded-[5px] p-2 mt-2 text-xs w-full outline-none focus:outline-none focus:ring-0 no-outline focus:border-[#dadada] "
                  className={`border rounded-[5px] p-2 mt-2 text-xs w-full outline-none focus:outline-none focus:ring-0 no-outline focus:border-[#dadada]  ${emailError ? 'border-red-500' : ''}`}
                   
                />
                {fullnameError && (<p className="text-red text-xs mt-1">{fullnameError}</p>)}
              </Box>
              <Box className="mb-4">
                <Text
                  as="label"
                  htmlFor="email"
                  className="text-defaultsize  "
                >
                  Enter Email id
                </Text>
                <input
                  id="email"
                  type="text"
                  placeholder="Enter Email id"
                  // onChange={(e) => setEmail(e.target.value)}
                  onChange={handleEmailChange}

                  value={email}
                  // className="border rounded-[5px] p-2 mt-2 text-xs w-full outline-none focus:outline-none focus:ring-0 no-outline focus:border-[#dadada] "
                  className={`border rounded-[5px] p-2 mt-2 text-xs w-full outline-none focus:outline-none focus:ring-0 no-outline focus:border-[#dadada]  ${emailError ? 'border-red-500' : ''}`}
                />
                 {emailError && (<p className="text-red text-xs mt-1">{emailError}</p>)}
              </Box>
              <Box className="mb-4">
                <Text
                  as="label"
                  htmlFor="mobile"
                  className="text-defaultsize  "
                >
                  Enter mobile number <span className='text-red'>*</span>
                </Text>
                <input
                  id="mobile"
                  type="text"
                  readOnly
                  placeholder="Enter mobile number"
                  onChange={(e) => setMobile(e.target.value)}
                  value={mobile}
                  className="border rounded-[5px] p-2 mt-2 text-xs w-full outline-none focus:outline-none focus:ring-0 no-outline focus:border-[#dadada] "
                />
              </Box>
              <Box className="mb-4">
                <Text
                  as="label"
                  htmlFor="address"
                  className="text-defaultsize  "
                >
                  Address  <span className='text-red'>*</span>
                </Text>
                <input
                  id="address"
                  type="text"
                  placeholder="Enter your Address"
                  required
                  // onChange={(e) => setAddress(e.target.value)}
                  onChange={handleAddressChnage}
                  value={address}
                  // className="border rounded-[5px] p-2 mt-2 text-xs w-full outline-none focus:outline-none focus:ring-0 no-outline focus:border-[#dadada] "
                  className={`border rounded-[5px] p-2 mt-2 text-xs w-full outline-none focus:outline-none focus:ring-0 no-outline focus:border-[#dadada]  ${addressError ? 'border-red-500' : ''}`}

                />
                {addressError && (<p className="text-red text-xs mt-1">{addressError}</p>)}
              </Box>
              <Box className="mb-4">
                <Text
                  as="label"
                  htmlFor="pincode"
                  className="text-defaultsize  "
                >
                  Pincode <span className='text-red'>*</span>
                </Text>
                <input
                  id="pincode"
                  type="text"
                  placeholder="365601"
                  required
                  // onChange={(e) => setPincode(e.target.value)}
                  onChange={handlePincodeChange}
                  value={pincode}
                  // className="border rounded-[5px] p-2 mt-2 text-xs w-full outline-none focus:outline-none focus:ring-0 no-outline focus:border-[#dadada] "
                  className={`border rounded-[5px] p-2 mt-2 text-xs w-full outline-none focus:outline-none focus:ring-0 no-outline focus:border-[#dadada]  ${pincodeError ? 'border-red-500' : ''}`}
                />
                {pincodeError && (<p className="text-red text-xs mt-1">{pincodeError}</p>)}
              </Box>
              <Box className="mb-4">
                <Text
                  as="label"
                  htmlFor="city"
                  className="text-defaultsize  "
                >
                  City  <span className='text-red'>*</span>
                </Text>
                <input
                  id="city"
                  type="text"
                  placeholder="Amreli"
                  required
                  // onChange={(e) => setCity(e.target.value)}
                  onChange={handleCityChange}

                  value={city}
                  // className="border rounded-[5px] p-2 mt-2 text-xs w-full outline-none focus:outline-none focus:ring-0 no-outline focus:border-[#dadada] "
                  className={`border rounded-[5px] p-2 mt-2 text-xs w-full outline-none focus:outline-none focus:ring-0 no-outline focus:border-[#dadada]  ${cityError ? 'border-red-500' : ''}`}

                />
                {cityError && (<p className="text-red text-xs mt-1">{cityError}</p>)}
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
                // onClick={handleOrder}
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
        {isMobileVerifyOpen && <MobileVerify onClose={closeMobileVerify} isOpen={false} mobileNumber={mobile} onVerify={openMobileVerify}
        otp={otp} // Pass OTP as prop
        setOtp={setOtp} reSendOtp={openMobile}/>} 

{showConfirmOrder && currentProduct && (
                <ProductOrderConfirm
                    onClose={() => setShowConfirmOrder(false)}
                    productImage={currentProduct.gift_product_images?.[0]?.gift_product_image || ProductImage}
                    productName={currentProduct.gift_product_name}
                    points={currentProduct.points}
                    rewardIcon={RewardImage}
                    successMessage={`Congratulate! You have successfully Redeemed ${currentProduct.points} points. Your product will be dispatched in the next 7 days.`}
                    onContinue={handleOrder}
                />
            )}
      </>
    );
  };

  export default ProductOrder;
