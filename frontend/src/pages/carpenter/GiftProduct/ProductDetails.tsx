import "../../../assets/css/header.css";
import "../../../assets/css/style.css";
import Pageheader from "../../../components/common/pageheader/pageheader";
import ProjectSlider from "../../../components/ui/slider/productdetailslider";
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
import { useFrappeGetCall } from "frappe-react-sdk";

const ProductDetails = () => {
  const { productId } = useParams<{ productId: string }>(); // Extract the productId from the URL
  const navigate = useNavigate();

  const [products, setProducts] = useState<any[]>([]); // State for products
  const [productImages, setProductImages] = useState<string[]>([]); // State for product images
  const [currentProduct, setCurrentProduct] = useState<any>(null); // State for the current product
  const [loading, setLoading] = useState<boolean>(true); // Loading state
  const [error, setError] = useState<string>(""); // Error state
  const [currentPoints, setCurrentPoints] = useState<number>(0); // State for current points of the carpenter

  const notyf = new Notyf({
    duration: 3000,
    position: { x: "center", y: "top" },
  });

  // Fetch carpenter data
  const { data, isLoading, error: apiError } = useFrappeGetCall(
    "reward_management.api.carpenter_master.get_carpainter_data"
  );

  useEffect(() => {
    // Fetch customer points from the API response
    if (!isLoading && !apiError && data) {
      const responseData = data.message.data;
      console.log("Fetched Carpenter Data:", responseData);

      if (Array.isArray(responseData) && responseData.length > 0) {
        const firstItem = responseData[0];
        setCurrentPoints(firstItem.current_points || 0); // Now this will set the current points correctly
      } else {
        setError("No customer data available.");
      }
    }
  }, [data, isLoading, apiError]);

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

            // Extract images for the slider
            const images = productData.map((product) => product.gift_product_images);
            console.log("images", images);
            setProductImages(images);

            // Find the product that matches the productId from the URL
            const matchedProduct = productData.find(
              (product) =>
                product.gift_product_name.replace(/\s+/g, "-").toLowerCase() ===
                productId?.toLowerCase() // Match gift_product_name with productId
            );

            if (matchedProduct) {
              setCurrentProduct(matchedProduct);
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
  }, [productId]); // Re-run when the productId changes

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

  const handleRedeemClick = (productName: string) => {
    const formattedProductName = productName.replace(/\s+/g, "-");
    navigate(`/product-details/${formattedProductName}`);
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
          {/* Pass images for the slider */}
          <ProjectSlider images={productImages} />
          <div className="md:mt-5 mt-10">
            <div>
              <p className="font-semibold text-[1.125rem] text-black dark:text-defaulttextcolor/70">
                {currentProduct.gift_product_name}
              </p>
              <p className="text-defaultsize text-defaulttextcolor">
                {currentProduct.description}
              </p>
            </div>
            <div className="mt-5">
              <p className="font-semibold text-[16px] text-black dark:text-defaulttextcolor/70">
                Specification
              </p>
              <ul className="text-defaultsize text-defaulttextcolor list-disc pl-5">
                <li>Lorem ipsum dolor sit amet consectetur.</li>
                <li>Lorem ipsum dolor sit amet consectetur.</li>
                <li>Lorem ipsum dolor sit amet consectetur.</li>
              </ul>
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
                  {currentProduct.rewardPoints}
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
                      product={product}
                      points={product.rewardPoints}
                      onClick={() => handleRedeemClick(product.gift_product_name)}
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
