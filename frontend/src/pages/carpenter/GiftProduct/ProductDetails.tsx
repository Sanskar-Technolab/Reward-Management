import "../../../assets/css/header.css";
import "../../../assets/css/style.css";
import Pageheader from "../../../components/common/pageheader/pageheader";
import ProjectSlider from "../../../components/ui/slider/productdetailslider";
import RewardImage from "../../../assets/images/reward_management/Frame.png";
import { Link } from "react-router-dom";
import Arrow from "../../../assets/images/reward_management/arrow.png";
import ProductCard from "../../../components/ui/productcard/card";
import ProductImage from "../../../assets/images/reward_management/Group 20.png";
import { useNavigate } from "react-router-dom";
import { Button } from "@material-tailwind/react";

const ProductDetails = () => {
  const currentProduct = {
    productName: "iPhone 16 (128GB)",
    rewardPoints: 5500,
    description:
      "Lorem ipsum dolor sit amet consectetur. Sit sed auctor libero morbi. Consectetur proin metus est ut auctor fermentum.",
  };
  const navigate = useNavigate();
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
  ];
  // // Function to handle the button click (for example, logging the product name)
  const handleRedeemNowClick = (productName: any) => {
    if (typeof productName !== 'string') {
        console.error('Invalid productName:', productName);
        return; // Exit if the productName is not valid
    }
    const formattedProductName = productName.replace(/\s+/g, '-');
    navigate(`/product-order/${formattedProductName}`);
};
  return (
    <>
      <Pageheader
        currentpage={"Product Details"}
        activepage={"/products-details"}
        mainpage={"/gift-products"}
        activepagename="Products"
        mainpagename="Product Details"
      />
      <div className="grid grid-cols-12 gap-x-6 pb-10">
        <div className="xxl:col-span-12 xl:col-span-12 lg:col-span-12 col-span-12">
          <ProjectSlider />
          <div className="md:mt-5 mt-10">
            <div>
              <p className="font-semibold text-[1.125rem] text-black dark:text-defaulttextcolor/70 ">
                {currentProduct.productName}
              </p>
              <p className="text-defaultsize text-defaulttextcolor">
                {currentProduct.description}
              </p>
            </div>
            <div className="mt-5">
              <p className="font-semibold text-[16px] text-black dark:text-defaulttextcolor/70 ">
                Specification
              </p>
              <ul className="text-defaultsize text-defaulttextcolor list-disc pl-5 ">
                <li>Lorem ipsum dolor sit amet consectetur.</li>
                <li>Lorem ipsum dolor sit amet consectetur.</li>
                <li>Lorem ipsum dolor sit amet consectetur.</li>
                <li>Lorem ipsum dolor sit amet consectetur.</li>
                <li>Lorem ipsum dolor sit amet consectetur.</li>
                <li>Lorem ipsum dolor sit amet consectetur.</li>
              </ul>
            </div>
            <div>
              <p className="font-semibold text-[16px] text-black dark:text-defaulttextcolor/70 mt-5 ">
                Details
              </p>
              <p className="text-defaultsize text-defaulttextcolor">
                Lorem ipsum dolor sit amet consectetur. Sit sed auctor libero
                morbi. Consectetur proin metus est ut auctor fermentum.
              </p>
            </div>

            <div className="flex mt-5 justify-between ">
              <div className="flex justify-items-center items-center">
                <img
                  src={RewardImage}
                  className="mr-2 h-5 w-5"
                  alt="reward-icon"
                />
                <p className="text-[25.9px] text-black">
                  {" "}
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
              <div className="flex justify-between">
                <div>
                  <p className="font-semibold text-[1.125rem] text-black dark:text-defaulttextcolor/70 mt-5">
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
                    className="xxl:col-span-3 xl:col-span-4 lg:col-span-6 md:col-span-6 sm:col-span-12 col-span-12"
                  >
                    <ProductCard
                      productImage={product.productImage}
                      productName={product.productName}
                      rewardPoints={product.rewardPoints}
                      rewardImage={product.rewardImage}
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
