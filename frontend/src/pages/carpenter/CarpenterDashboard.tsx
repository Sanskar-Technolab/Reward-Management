import "../../assets/css/style.css";
import React, { Fragment, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Arrow from "../../assets/images/reward_management/arrow.png";
import ProductCard from "../../components/ui/productcard/card";
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; 
import { Notyf } from 'notyf';
import 'notyf/notyf.min.css'; 
import Slider from "react-slick";
import "../../assets/css/pages/projectslider.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const CarpenterDashboard: React.FC = () => {
  const [redeemPoints, setRedeemPoints] = useState<number>(0);
  const [totalPoints, setTotalPoints] = useState<number>(0);
  const [currentPoints, setCurrentPoints] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [isError, setError] = useState<string | null>(null);
  const [products, setProducts] = useState([]);
  const [currentSlideIndex, setCurrentSlideIndex] = useState<number>(0);
  const [instructions, setInstructions] = useState<any[]>([]); 
  const navigate = useNavigate(); 

    // Initialize Notyf for notifications
    const notyf = new Notyf({
      duration: 3000,  
      // Positioning the notification at the top center
      position: { x: 'right', y: 'top' }, 
    });

    
useEffect(() => {
  const fetchInstructions = async () => {
    try {
      const response = await axios.get(
        "/api/method/reward_management.api.project.get_project"
      );

      if (response && response.data && response.data.message?.images) {
        const images = response.data.message.images;

        // Transform images into the required format
        const formattedInstructions = images.map((image: string, index: number) => ({
          instruction_name: `Instruction ${index + 1}`,
          image,
        }));

        setInstructions(formattedInstructions);
      } else {
        console.error("Failed to fetch project or no images available.");
      }
    } catch (error) {
      console.error("Error fetching project:", error);
    } finally {
      setLoading(false);
    }
  };

  fetchInstructions();
}, []);


useEffect(() => {
  document.title = "Customer Dashboard";



  const fetchCarpenterData = async (loggedInUser:any) => {
    try {
      const response = await axios.get('/api/method/reward_management.api.carpenter_master.get_carpainter_data', {
        params: { user: loggedInUser },
      });
  
      if (response) {
        // console.log("Customer response", response);
      }

      const carpainterData = response.data.message.carpainter_data;
  
      // console.log("Fetched Carpenter Data:", carpainterData);
  
      if (Array.isArray(carpainterData) && carpainterData.length > 0) {
        const firstCarpenter = carpainterData[0];
        // console.log("First Carpenter:", firstCarpenter);
  
      //  set get data-----
        setRedeemPoints(firstCarpenter.redeem_points || 0);
        setTotalPoints(firstCarpenter.total_points || 0);
        setCurrentPoints(firstCarpenter.current_points || 0);
      } else {
        console.log("No carpenter data found.");
      }
    } catch (error) {
      console.error("Error fetching carpenter data:", error);
      setError("Failed to fetch carpenter data.");
    }
  };
  const fetchProducts = async (loggedInUser:any) => {
    try {
      const response = await axios.get('/api/method/reward_management.api.gift_product.get_filtered_gift_products',
        { params: { user: loggedInUser } }
      );
      // console.log("Full Response:", response); 
      const productData = response.data.message.filtered_gift_products;
      // console.log("Gift data", productData);

      if (response.data.message.status === 'success') {
        if (Array.isArray(productData) && productData.length > 0) {
          setProducts(productData);
        } else {
          console.log('No products available.');
        }
      } else {
        console.log('API returned an error status.');
      }
    } catch (err) {
      console.log(err.message || 'Failed to fetch products.');
    } finally {
      setLoading(false);
    }
  };
  
  const fetchUserData = async () => {
    try {
      const response = await axios.get('/api/method/frappe.auth.get_logged_user');
      const loggedInUser = response.data.message;
      // console.log("Logged in user:", loggedInUser);

      if (loggedInUser) {
        await fetchCarpenterData(loggedInUser);
        await fetchProducts(loggedInUser);
      }
    } catch (error) {
      console.error("Error fetching logged user data:", error);
      setError("Failed to fetch user data.");
    }
  };


  // fetchProducts();
  fetchUserData();
}, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>{isError}</div>;
  }

   // handle the redeem button click
   const handleRedeemClick = (productName: any, pointsRequired: number) => {
    if (currentPoints >= pointsRequired) {
      const formattedProductName = productName.replace(/\s+/g, '-');
      navigate(`/product-details/${formattedProductName}`);
    } else {
      notyf.error('You do not have sufficient points to redeem this product.'); 
    }
  };


  const sliderSettings = {
    dots: true,
    infinite: true,
    // autoplay:true,
    autoplaySpeed:2000,                            
    pauseOnHover:true, 
    arrows:false,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    afterChange: (current: number) => setCurrentSlideIndex(current),
  };



  return (
    <Fragment>
      <div className="md:flex block items-center justify-between my-[1.5rem] page-header-breadcrumb">
        <div>
          <p className="font-semibold text-[1.125rem] text-defaulttextcolor dark:text-defaulttextcolor/70 !mb-0">
            Customer Dashboard
          </p>
        </div>
      </div>
     
      <div className="relative  mx-auto pb-4 mb-4">
    {/* Show loading spinner */}
    {loading && <div>Loading...</div>}

    {/* Slider Section */}
    {!loading && instructions.length > 1 && (
      <Slider {...sliderSettings}>
        {instructions.map((instruction, index) => (
          <div key={index} className="px-2">
            <img
              src={`${window.origin}${instruction.image}`}
              alt={instruction.instruction_name}
              className="w-full lg:h-[450px] md:h[300px] sm:h-[200px] object-fill"
            />
          </div>
        ))}
      </Slider>
    )}

    {/* Single Image if only one instruction */}
    {!loading && instructions.length === 1 && (
      <div className="px-2">
        <img
          src={`${window.origin}${instructions[0].image}`}
          alt={instructions[0].instruction_name}
          className="w-full lg:h-[450px] md:h-[300px] sm:h-[200px] object-contain"
        />
      </div>
    )}

    {/* Show error message if no projects */}
    {/* {!loading && instructions.length === 0 && (
      <div>No projects available.</div>
    )} */}
  </div>
      <div className="grid grid-cols-12 gap-x-6 pb-10 md:mt-0 sm:mt-5 ">
        <div className="xxl:col-span-12 xl:col-span-12 lg:col-span-12 col-span-12">
          <div className="grid grid-cols-12 gap-x-6">
            <div className="xl:col-span-12 col-span-12">
              <div className="">
                <div className="">
                  <div>
                    <p className="font-semibold text-[1.125rem] text-defaulttextcolor dark:text-defaulttextcolor/70 mb-5    ">
                      Points
                    </p>
                  </div>
                  <div className="grid grid-cols-12 xl:gap-y-0 gap-4">
                    <div className="category-link xxl:col-span-4 xl:col-span-4 lg:col-span-6 md:col-span-6 sm:col-span-12 col-span-12 p-4 bg-white shadow-lg rounded-lg transition-colors duration-300 hover:bg-purple-50 dark:bg-gray-800 dark:hover:bg-purple-900">
                      <div className="flex flex-row items-start mb-4 ">
                        <span className="avatar avatar-lg bg-black rounded-[5px] text-white inline-flex items-center justify-center w-12 h-12 mb-2 mr-3">
                          <i className="ti ti-wallet text-[1.25rem]"></i>
                        </span>
                        <div className="flex flex-col items-start">
                          <h5 className="text-[1.125rem] font-semibold mb-2">
                            {totalPoints}
                          </h5>
                          <div className="flex flex-row text-[1rem] text-[#8c9097] dark:text-white/50">
                            <div>Total Points</div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="category-link xxl:col-span-4 xl:col-span-4 lg:col-span-6 md:col-span-6 sm:col-span-12 col-span-12 p-4 bg-white shadow-lg rounded-lg transition-colors duration-300 hover:bg-purple-50 dark:bg-gray-800 dark:hover:bg-purple-900">
                      <div className="flex flex-row items-start mb-4 ">
                        <span className="avatar avatar-lg bg-black rounded-[5px] text-white inline-flex items-center justify-center w-12 h-12  mb-2 mr-3">
                          <i className="ti ti-wallet text-[1.25rem]"></i>
                        </span>
                        <div className="flex flex-col items-start">
                          <h5 className="text-[1.125rem] font-semibold mb-2">
                            {currentPoints}
                          </h5>
                          <div className="flex flex-row text-[1rem] text-[#8c9097] dark:text-white/50">
                            <div>Available Points</div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="category-link xxl:col-span-4 xl:col-span-4 lg:col-span-6 md:col-span-6 sm:col-span-12 col-span-12 p-4 bg-white shadow-lg rounded-lg transition-colors duration-300 hover:bg-purple-50 dark:bg-gray-800 dark:hover:bg-purple-900">
                      <div className="flex flex-row items-start mb-4 ">
                        <span className="avatar avatar-lg bg-black rounded-[5px] text-white inline-flex items-center justify-center w-12 h-12 mb-2 mr-3">
                          <i className="ti ti-wallet text-[1.25rem]"></i>
                        </span>
                        <div className="flex flex-col items-start">
                          <h5 className="text-[1.125rem] font-semibold mb-2">
                            {redeemPoints}
                          </h5>
                          <div className="flex flex-row text-[1rem] text-[#8c9097] dark:text-white/50">
                            <div>Points Redeemed</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
{/* Featured section------- */}
                  <div>
                    <p className="font-semibold text-[1.125rem] text-defaulttextcolor dark:text-defaulttextcolor/70 my-5  ">
                      Featured
                    </p>
                  </div>
                  <div className="grid grid-cols-12 xl:gap-y-0 gap-4">
                    <Link
                      to="/product-catalogue"
                      className="category-link xxl:col-span-4 xl:col-span-4 lg:col-span-6 md:col-span-6 sm:col-span-12 col-span-12 p-4 bg-white shadow-lg rounded-lg transition-colors duration-300 hover:bg-purple-50 dark:bg-gray-800 dark:hover:bg-purple-900 "
                    >
                      <div className="flex flex-row items-start mb-4 ">
                        <div className="bg-black/20 rounded-[10px] w-12 h-12 flex items-center justify-center">
                          <span className="avatar avatar-lg bg-black text-white inline-flex items-center justify-center  w-7 h-7 rounded-[8px] ">
                            <i className="ri-bank-line text-[1rem]"></i>
                          </span>
                        </div>
                        <div className="flex flex-col items-start">
                          <div className="flex flex-row text-[1rem] text-[#8c9097] dark:text-white/50">
                            <div className="pl-3">Product Catalogue</div>
                          </div>
                        </div>
                      </div>
                    </Link>

                   
                    <Link
                      to="/point-details"
                      className="category-link xxl:col-span-4 xl:col-span-4 lg:col-span-6 md:col-span-6 sm:col-span-12 col-span-12 p-4 bg-white shadow-lg rounded-lg transition-colors duration-300 hover:bg-purple-50 dark:bg-gray-800 dark:hover:bg-purple-900 "
                    >
                      <div className="flex flex-row items-start mb-4">
                        <div className="bg-black/20 rounded-[10px] w-12 h-12 flex items-center justify-center">
                          <span className="avatar avatar-lg bg-black text-white inline-flex items-center justify-center w-7 h-7 rounded-[8px]  ">
                            <i className="bi bi-coin text-[1rem]"></i>
                          </span>
                        </div>
                        <div className="flex flex-col items-start">
                          <div className="flex flex-row text-[1rem] text-[#8c9097] dark:text-white/50">
                            <div className="pl-3">Point Details</div>
                          </div>
                        </div>
                      </div>
                    </Link>
                    
                  
                    <Link
                      to="/help-and-support"
                      className="category-link xxl:col-span-4 xl:col-span-4 lg:col-span-6 md:col-span-6 sm:col-span-12 col-span-12 p-4 bg-white shadow-lg rounded-lg transition-colors duration-300 hover:bg-purple-50 dark:bg-gray-800 dark:hover:bg-purple-900"
                    >
                      <div className="flex flex-row items-start mb-4 ">
                        <div className="bg-black/20 rounded-[10px] w-12 h-12 flex items-center justify-center">
                          <span className="avatar avatar-lg bg-black text-white inline-flex items-center justify-center  w-7 h-7 rounded-[8px] ">
                            <i className="ri-questionnaire-line text-[1rem]"></i>
                          </span>
                        </div>
                        <div className="flex flex-col items-start">
                          <div className="flex flex-row text-[1rem] text-[#8c9097] dark:text-white/50">
                            <div className="pl-3">Help</div>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </div>

                  <div className="flex justify-between">
                    <div>
                      <p className="font-semibold text-[1.125rem] text-defaulttextcolor dark:text-defaulttextcolor/70 mt-5">
                        Products
                      </p>
                    </div>
                    <div className="text-defaultsize underline text-defaulttextcolor dark:text-defaulttextcolor/70 mt-5 flex  items-start">
                      <Link to="/gift-products" className="w-18 ">
                     
                        View more
                      </Link>
                      <img
                        src={Arrow}
                        className="w-5 h-5 items-center"
                        alt="Arrow"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-12 xl:gap-y-0 gap-4">
                    {/* Dynamically render ProductCard components */}
                    {products.length > 0 ? (
                      products.map((product, index) => (
                        <div
                          key={index}
                          className="xxl:col-span-3 xl:col-span-3 lg:col-span-6 md:col-span-6 sm:col-span-12 col-span-12"
                        >
                          <ProductCard
                            productImage={
                              product.gift_product_images?.[0]?.gift_product_image || '/placeholder-image.png'
                            }
                            productName={product.gift_product_name}
                            rewardPoints={product.points}
                            onClick={() => handleRedeemClick(product.gift_product_name, product.points)}
                          />
                        </div>
                      ))
                    ) : (
                      <div className="col-span-12">
                        <p className="text-center text-gray-500 mt-4">
                          No products available.
                        </p>
                      </div>
                    )}
                  </div>

                  
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default CarpenterDashboard;
