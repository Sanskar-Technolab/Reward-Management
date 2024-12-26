import "../../../assets/css/header.css";
import "../../../assets/css/style.css";
import Pageheader from "../../../components/common/pageheader/pageheader";
// import ProjectSlider from "../../../components/ui/slider/productdetailslider";
import RewardImage from "../../../assets/images/reward_management/Frame.png";
import { Link, useParams } from "react-router-dom";
import Arrow from "../../../assets/images/reward_management/arrow.png";
import ProductCard from "../../../components/ui/productcard/card";
import { useNavigate } from "react-router-dom";
import { Button } from "@material-tailwind/react";
import axios from "axios";
import { useEffect, useState } from "react";
import { Notyf } from "notyf";
import "notyf/notyf.min.css";
import Slider from "react-slick";

import "../../../assets/css/pages/projectslider.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const ProductDetails = () => {
  // Extract the productId from the URL
  const { productId } = useParams<{ productId: string }>();
  const navigate = useNavigate();
  // State for products
  const [products, setProducts] = useState<any[]>([]);
  // State for product images
  const [productImages, setProductImages] = useState<string[]>([]);
  // State for the current product
  const [currentProduct, setCurrentProduct] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  // State for current points of the carpenter
  const [currentPoints, setCurrentPoints] = useState<number>(0);

  const notyf = new Notyf({
    duration: 3000,
    position: { x: "center", y: "top" },
  });

  // // Fetch carpenter data
  // const { data, isLoading, error: apiError } = useFrappeGetCall(
  //   "reward_management.api.carpenter_master.get_carpainter_data"
  // );

  useEffect(() => {
    // Fetch customer points from the API response
    // if (!isLoading && !apiError && data) {
    //   const responseData = data.message.data;
    //   console.log("Fetched Carpenter Data:", responseData);

    //   if (Array.isArray(responseData) && responseData.length > 0) {
    //     const firstItem = responseData[0];
    //     // Now this will set the current points correctly
    //     setCurrentPoints(firstItem.current_points || 0);
    //   } else {
    //     setError("No customer data available.");
    //   }
    // }


    const fetchCarpenterData = async (loggedInUser:any) => {
      try {
        const response = await axios.get(
          '/api/method/reward_management.api.carpenter_master.get_carpainter_data',
          { params: { user: loggedInUser } }
        );

        if (response && response.data.message.carpainter_data) {
          const carpainterData = response.data.message.carpainter_data;
          console.log('Fetched Carpenter Data:', carpainterData);

          if (Array.isArray(carpainterData) && carpainterData.length > 0) {
            setCurrentPoints(carpainterData[0].current_points || 0);
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

    fetchUserData();

  }, []);


  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(
          "/api/method/reward_management.api.gift_product.get_gift_products"
        );
        const productData = response.data.message.data;
        console.log("Fetched Products:", productData);

        if (response.data.message.status === "success") {
          if (Array.isArray(productData) && productData.length > 0) {
            setProducts(productData);

            // Extract images for the slider (flatten if necessary)
            const images = productData.flatMap((product) =>
              product.gift_product_images?.map((img: any) => img.gift_product_image) || []
            );
            console.log("Extracted Images:", images);
            setProductImages(images);

            // Find the product that matches the productId from the URL
            const matchedProduct = productData.find(
              (product) =>
                product.gift_product_name.replace(/\s+/g, "-").toLowerCase() ===
                productId?.toLowerCase()
            );

            if (matchedProduct) {
              console.log("match product", matchedProduct);

              setCurrentProduct(matchedProduct);
              console.log("match product image", matchedProduct.gift_product_images)
              const matchedProductImages = matchedProduct.gift_product_images.map(
                (img: any) => img.gift_product_image
              );
              // Pass images to the ProjectSlider component
              setProductImages(matchedProductImages);
            } else {
              setError("Product not found.");
            }
          } else {
            setError("No products available.");
          }
        } else {
          setError("API returned an error status.");
        }
      } catch (err) {
        setError(err.message || "Failed to fetch products.");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [productId]);

  if (loading) {
    return (
      <div className="text-center py-10">
        <p className="text-xl font-semibold">Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-10">
        <p className="text-xl font-semibold text-red-500">{error}</p>
        <Link to="/gift-products" className="text-blue-500 underline">
          Back to Products
        </Link>
      </div>
    );
  }

  if (!currentProduct) {
    return (
      <div className="text-center py-10">
        <p className="text-xl font-semibold">Product not found!</p>
        <Link to="/gift-products" className="text-blue-500 underline">
          Back to Products
        </Link>
      </div>
    );
  }


  const handleRedeemNowClick = (productName: string) => {
    const formattedProductName = productName.replace(/\s+/g, "-");
    navigate(`/product-order/${formattedProductName}`);
  };

  // Function to handle the redeem button click
  const handleRedeemClick = (productName: any, pointsRequired: number) => {
    if (currentPoints >= pointsRequired) {
      const formattedProductName = productName.replace(/\s+/g, '-');
      navigate(`/product-details/${formattedProductName}`);
    } else {
      notyf.error('You do not have sufficient points to redeem this product.');  // Show error notification
    }
  };
  const sliderSettings = {
    dots: true,
    infinite: false,
    autoplay:true,
    autoplaySpeed : 2000,
    pushOnHover : true,
    arrows:false,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  };
  return (
    <>
      <Pageheader
        currentpage="Product Details"
        activepage="/gift-products"
        mainpage="/gift-products"
        activepagename="Products"
        mainpagename="Product Details"
      />
 

      <div className="grid grid-cols-12 gap-x-6 pb-10">
        <div className="xxl:col-span-12 xl:col-span-12 lg:col-span-12 col-span-12">
          {/* <div> <ProjectSlider images={productImages} />  </div>
          Pass images for the slider */}
          {/* Slider Section */}
          <div className="relative mx-auto pb-4 mb-4">
          {productImages.length > 0 ? (
              <Slider {...sliderSettings}>
                {productImages.map((image, index) => (
                  <div key={index} className="px-2">
                    <img
                      src={image}
                      alt={`Product Image ${index + 1}`}
                      className="w-full  lg:h-[450px] md:h-[300px] sm:h-[200px] object-fill"
                    />
                  </div>
                ))}
              </Slider>
            ) : (
              <div>No images available for this product.</div>
            )}
          </div>
        
          <div className="md:mt-10 mt-10">
            <div>
              <span className="font-semibold text-[1.125rem] text-black dark:text-defaulttextcolor/70">
                {currentProduct.gift_product_name}
              </span>
              <p className="text-defaultsize text-defaulttextcolor">
                {currentProduct.description}
              </p>
            </div>
            <div className="mt-5">
              <p className="font-semibold text-[16px] text-black dark:text-defaulttextcolor/70">
                Specification
              </p>
              <div
                className="text-defaultsize text-defaulttextcolor"
                dangerouslySetInnerHTML={{
                  __html: currentProduct.gift_specification,
                }}
              />
            </div>

            <div>
              <p className="font-semibold text-[16px] text-black dark:text-defaulttextcolor/70 mt-5">
                Details
              </p>
              <p className="text-defaultsize text-defaulttextcolor">
                {currentProduct.description}
              </p>
            </div>
            <div className="flex mt-5 justify-between">
              <div className="flex items-center">
                <img
                  src={RewardImage}
                  className="mr-2 h-5 w-5"
                  alt="reward-icon"
                />
                <p className="text-[25.9px] text-black">
                  {currentProduct.points}
                </p>
              </div>
              <Button
                className="border border-gray-500 rounded-[5px] text-white bg-black py-1 px-16 text-[14px] font-normal normal-case"
                onClick={() => handleRedeemNowClick(currentProduct.gift_product_name)}
              >
                Redeem Now
              </Button>
            </div>
            <div>
              <div className="flex justify-between mt-5">
                <p className="font-semibold text-[1.125rem] text-black dark:text-defaulttextcolor/70">
                  Related Products
                </p>
                <Link
                  to="/gift-products"
                  className="text-defaultsize underline text-defaulttextcolor dark:text-defaulttextcolor/70 flex items-center"
                >
                  View more
                  <img
                    src={Arrow}
                    className="ml-2 w-5 h-5"
                    alt="Arrow icon"
                  />
                </Link>
              </div>
              <div className="grid grid-cols-12 xl:gap-y-0 gap-4">
                {products.map((product, index) => (
                  <div
                    key={index}
                    className="xxl:col-span-3 xl:col-span-4 lg:col-span-6 md:col-span-6 sm:col-span-12 col-span-12"
                  >
                    <ProductCard
                      productImage={product.gift_product_images?.[0]?.gift_product_image || '/placeholder-image.png'}
                      productName={product.gift_product_name}
                      rewardPoints={product.points}
                      onClick={() => handleRedeemClick(product.gift_product_name, product.points)} // Pass pointsRequired as second argument
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductDetails;
