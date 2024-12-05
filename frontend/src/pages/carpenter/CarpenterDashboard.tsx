import "../../assets/css/style.css";
import React, { Fragment, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useFrappeGetCall } from "frappe-react-sdk";
import ProjectSlider from "../../components/ui/slider/projectslider";
import Arrow from "../../assets/images/reward_management/arrow.png";
import ProductCard from "../../components/ui/productcard/card";
import ProductImage from "../../assets/images/reward_management/Group 20.png";
import { useNavigate } from 'react-router-dom'; 

const CarpenterDashboard: React.FC = () => {
  const [redeemPoints, setRedeemPoints] = useState<number>(0);
  const [totalPoints, setTotalPoints] = useState<number>(0);
  const [currentPoints, setCurrentPoints] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [isError, setError] = useState<string | null>(null);
  const navigate = useNavigate(); 
  const { data, isLoading, error } = useFrappeGetCall(
    "reward_management.api.carpenter_master.get_carpainter_data"
  );

  useEffect(() => {
    document.title = "Customer Dashboard";
    if (!isLoading && !error && data) {
      const responseData = data.message.data;
      console.log("Table Data:", responseData);

      if (Array.isArray(responseData) && responseData.length > 0) {
        const firstItem = responseData[0];
        setRedeemPoints(firstItem.redeem_points || 0);
        setTotalPoints(firstItem.total_points || 0);
        setCurrentPoints(firstItem.current_points || 0);
      } else {
        console.log("No data available");
      }

      setLoading(false);
    }

    if (error) {
      console.error("Error fetching data:", error);
      setError("Error fetching data");
      setLoading(false);
    }
  }, [data, isLoading, error]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>{isError}</div>;
  }

  // productcard calling--------
  const products = [
    {
      productName: "Snapdeal Gift Card",
      productImage: ProductImage,
      rewardPoints: "500",
     
    },
    {
      productName: "Amazon Gift Card",
      productImage: ProductImage,
      rewardPoints: "700",
     
    },
    {
      productName: "Flipkart Gift Card",
      productImage: ProductImage,
      rewardPoints: "1000",
  
    },
    {
        productName: "Flipkart Gift Card",
        productImage: ProductImage,
        rewardPoints: "1000",
    
      },
      {
        productName: "Flipkart Gift Card",
        productImage: ProductImage,
        rewardPoints: "1000",
    
      },
      {
        productName: "Flipkart Gift Card",
        productImage: ProductImage,
        rewardPoints: "1000",
    
      },
  ];
   // Function to handle the button click (for example, logging the product name)
   const handleRedeemClick = (productName:any) => {
    const formattedProductName = productName.replace(/\s+/g, '-'); 
    navigate(`/product-details/${formattedProductName}`); 
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
      <ProjectSlider /> 
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
                    <div className="category-link xxl:col-span-4 xl:col-span-3 lg:col-span-6 md:col-span-6 sm:col-span-12 col-span-12 p-4 bg-white shadow-lg rounded-lg transition-colors duration-300 hover:bg-purple-50 dark:bg-gray-800 dark:hover:bg-purple-900">
                      <div className="flex flex-row items-start mb-4 ">
                        <span className="avatar avatar-lg bg-[var(--primaries)] text-white inline-flex items-center justify-center w-12 h-12 rounded-sm mb-2 mr-3">
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
                    <div className="category-link xxl:col-span-4 xl:col-span-3 lg:col-span-6 md:col-span-6 sm:col-span-12 col-span-12 p-4 bg-white shadow-lg rounded-lg transition-colors duration-300 hover:bg-purple-50 dark:bg-gray-800 dark:hover:bg-purple-900">
                      <div className="flex flex-row items-start mb-4 ">
                        <span className="avatar avatar-lg bg-[var(--primaries)] text-white inline-flex items-center justify-center w-12 h-12 rounded-sm mb-2 mr-3">
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
                    <div className="category-link xxl:col-span-4 xl:col-span-3 lg:col-span-6 md:col-span-6 sm:col-span-12 col-span-12 p-4 bg-white shadow-lg rounded-lg transition-colors duration-300 hover:bg-purple-50 dark:bg-gray-800 dark:hover:bg-purple-900">
                      <div className="flex flex-row items-start mb-4 ">
                        <span className="avatar avatar-lg bg-[var(--primaries)] text-white inline-flex items-center justify-center w-12 h-12 rounded-sm mb-2 mr-3">
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
                      className="category-link xxl:col-span-4 xl:col-span-3 lg:col-span-6 md:col-span-6 sm:col-span-12 col-span-12 p-4 bg-white shadow-lg rounded-lg transition-colors duration-300 hover:bg-purple-50 dark:bg-gray-800 dark:hover:bg-purple-900 "
                    >
                      <div className="flex flex-row items-start mb-4 ">
                        <div className="bg-primary/20 rounded-[10px] w-12 h-12 flex items-center justify-center">
                          <span className="avatar avatar-lg bg-[var(--primaries)] text-white inline-flex items-center justify-center  w-7 h-7 rounded-[8px] ">
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
                      to="/qr-scanner"
                      className="category-link xxl:col-span-4 xl:col-span-3 lg:col-span-6 md:col-span-6 sm:col-span-12 col-span-12 p-4 bg-white shadow-lg rounded-lg transition-colors duration-300 hover:bg-purple-50 dark:bg-gray-800 dark:hover:bg-purple-900 "
                    >
                      <div className="flex flex-row items-start mb-4">
                        <div className="bg-primary/20 rounded-[10px] w-12 h-12 flex items-center justify-center">
                          <span className="avatar avatar-lg bg-primary text-white inline-flex items-center justify-center w-7 h-7 rounded-[8px]">
                            <i className="bi bi-qr-code-scan text-[1rem]"></i>
                          </span>
                        </div>
                        <div className="flex flex-col items-start">
                          <div className="flex flex-row text-[1rem] text-[#8c9097] dark:text-white/50">
                            <div className="pl-3">QR Scanner</div>
                          </div>
                        </div>
                      </div>
                    </Link>

                    <Link
                      to="/point-history"
                      className="category-link xxl:col-span-4 xl:col-span-3 lg:col-span-6 md:col-span-6 sm:col-span-12 col-span-12 p-4 bg-white shadow-lg rounded-lg transition-colors duration-300 hover:bg-purple-50 dark:bg-gray-800 dark:hover:bg-purple-900 "
                    >
                      <div className="flex flex-row items-start mb-4">
                        <div className="bg-primary/20 rounded-[10px] w-12 h-12 flex items-center justify-center">
                          <span className="avatar avatar-lg bg-[var(--primaries)] text-white inline-flex items-center justify-center w-7 h-7 rounded-[8px]  ">
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
                      to="/redeem-request"
                      className="category-link xxl:col-span-4 xl:col-span-3 lg:col-span-6 md:col-span-6 sm:col-span-12 col-span-12 p-4 bg-white shadow-lg rounded-lg transition-colors duration-300 hover:bg-purple-50 dark:bg-gray-800 dark:hover:bg-purple-900 xxl:mt-5 xl:mt-0 lg:mt-0 "
                    >
                      <div className="flex flex-row items-start mb-4 ">
                        <div className="bg-primary/20 rounded-[10px] w-12 h-12 flex items-center justify-center">
                          <span className="avatar avatar-lg bg-[var(--primaries)] text-white inline-flex items-center justify-center  w-7 h-7 rounded-[8px] ">
                            <i className="ri-gift-line text-[1rem]"></i>
                          </span>
                        </div>
                        <div className="flex flex-col items-start">
                          <div className="flex flex-row text-[1rem] text-[#8c9097] dark:text-white/50">
                            <div className="pl-3">Redeem Request</div>
                          </div>
                        </div>
                      </div>
                    </Link>
                    <Link
                      to="/banking-history"
                      className="category-link xxl:col-span-4 xl:col-span-3 lg:col-span-6 md:col-span-6 sm:col-span-12 col-span-12 p-4 bg-white shadow-lg rounded-lg transition-colors duration-300 hover:bg-purple-50 dark:bg-gray-800 dark:hover:bg-purple-900 mt-5"
                    >
                      <div className="flex flex-row items-start mb-4 ">
                        <div className="bg-primary/20 rounded-[10px] w-12 h-12 flex items-center justify-center">
                          <span className="avatar avatar-lg bg-[var(--primaries)] text-white inline-flex items-center justify-center  w-7 h-7 rounded-[8px] ">
                            <i className="ri-bank-line text-[1rem]"></i>
                          </span>
                        </div>
                        <div className="flex flex-col items-start">
                          <div className="flex flex-row text-[1rem] text-[#8c9097] dark:text-white/50">
                            <div className="pl-3">Bank History</div>
                          </div>
                        </div>
                      </div>
                    </Link>
                    <Link
                      to="/help-and-support"
                      className="category-link xxl:col-span-4 xl:col-span-3 lg:col-span-6 md:col-span-6 sm:col-span-12 col-span-12 p-4 bg-white shadow-lg rounded-lg transition-colors duration-300 hover:bg-purple-50 dark:bg-gray-800 dark:hover:bg-purple-900 mt-5"
                    >
                      <div className="flex flex-row items-start mb-4 ">
                        <div className="bg-primary/20 rounded-[10px] w-12 h-12 flex items-center justify-center">
                          <span className="avatar avatar-lg bg-[var(--primaries)] text-white inline-flex items-center justify-center  w-7 h-7 rounded-[8px] ">
                            <i className="ri-questionnaire-line text-[1rem]"></i>
                          </span>
                        </div>
                        <div className="flex flex-col items-start">
                          <div className="flex flex-row text-[1rem] text-[#8c9097] dark:text-white/50">
                            <div className="pl-3">Help & Support</div>
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
                    {products.map((product, index) => (
                      <div
                        key={index}
                        className="xxl:col-span-3 xl:col-span-3 lg:col-span-6 md:col-span-6 sm:col-span-12 col-span-12"
                      >
                        <ProductCard
                          productImage={product.productImage}
                          productName={product.productName}
                          rewardPoints={product.rewardPoints}
                          // rewardImage={product.rewardImage}
                          onClick={() => handleRedeemClick(product.productName)} 
                        />
                      </div>
                    ))}
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
