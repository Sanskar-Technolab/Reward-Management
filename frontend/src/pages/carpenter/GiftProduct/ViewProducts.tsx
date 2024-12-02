import ProductCard from '../../../components/ui/productcard/card';
import '../../../assets/css/header.css';
import '../../../assets/css/style.css';
import Pageheader from '../../../components/common/pageheader/pageheader';
import ProductImage from "../../../assets/images/reward_management/Group 20.png"; 
import { useNavigate } from 'react-router-dom'; // Import useNavigate


const ViewProduct = () => {
  const navigate = useNavigate(); 
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
 
  ];

  // Function to handle the button click (for example, logging the product name)
  const handleRedeemClick = (productName:any) => {
    const formattedProductName = productName.replace(/\s+/g, '-'); 
    navigate(`/product-details/${formattedProductName}`); 
  };

  return (
    <>
      <Pageheader 
        currentpage={"Products"} 
        activepage={"/gift-products"} 
        activepagename='Products' 
      />
      <div className="grid grid-cols-12 gap-x-6 pb-10">
        <div className="xxl:col-span-12 xl:col-span-12 lg:col-span-12 col-span-12">
          <div className="grid grid-cols-12 gap-x-6">
            <div className="xl:col-span-12 col-span-12">
              <div className="">
                <div className="grid grid-cols-12 xl:gap-y-0 gap-4">
                  {products.map((product, index) => (
                    <div
                      key={index}
                      className="xxl:col-span-4 xl:col-span-3 lg:col-span-6 md:col-span-6 sm:col-span-6 col-span-12"
                    >
                      <ProductCard
                        productImage={product.productImage}
                        productName={product.productName}
                        rewardPoints={product.rewardPoints}
                        onClick={() => handleRedeemClick(product.productName)} // Pass the handler to the card
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ViewProduct;
