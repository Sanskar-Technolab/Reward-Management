import "../../../assets/css/header.css";
import "../../../assets/css/style.css";
import Pageheader from "../../../components/common/pageheader/pageheader";
import ProjectSlider from "../../../components/ui/slider/productdetailslider";
import RewardImage from "../../../assets/images/reward_management/Frame.png";
import { Link, useParams } from "react-router-dom";
import Arrow from "../../../assets/images/reward_management/arrow.png";
import ProductCard from "../../../components/ui/productcard/card";
import ProductImage from "../../../assets/images/reward_management/Group 20.png";
import { useNavigate } from "react-router-dom";
import { Button } from "@material-tailwind/react";

const ProductDetails = () => {
  const { productId } = useParams<{ productId: string }>();
  const navigate = useNavigate();

  // Product data
  const products = [
    {
      productName: "Snapdeal Gift Card",
      productImage: ProductImage,
      rewardPoints: 500,
      description: "A convenient way to shop on Snapdeal.",
    },
    {
      productName: "Amazon Gift Card",
      productImage: ProductImage,
      rewardPoints: 700,
      description: "Shop your favorite products on Amazon.",
    },
    {
      productName: "Flipkart Gift Card",
      productImage: ProductImage,
      rewardPoints: 1000,
      description: "Explore endless shopping options on Flipkart.",
    },
    {
      productName: "Flipkart Gift Card",
      productImage: ProductImage,
      rewardPoints: 2000,
      description: "Explore endless shopping options on Flipkart.",
    },
  ];

  // Find the current product by URL parameter
  const currentProduct = products.find(
    (product) =>
      product.productName.replace(/\s+/g, "-").toLowerCase() ===
      productId?.toLowerCase()
  );

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

  // Click handler for navigation
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
          <ProjectSlider />
          <div className="md:mt-5 mt-10">
            <div>
              <p className="font-semibold text-[1.125rem] text-black dark:text-defaulttextcolor/70">
                {currentProduct.productName}
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
                onClick={() => handleRedeemNowClick(currentProduct.productName)}
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
                      productImage={product.productImage}
                      productName={product.productName}
                      rewardPoints={product.rewardPoints}
                      onClick={() => handleRedeemClick(product.productName)}
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
