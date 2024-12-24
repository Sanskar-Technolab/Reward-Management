import "../../assets/css/header.css";
import "../../assets/css/style.css";
import Pageheader from "../../components/common/pageheader/pageheader";
import { useState, useEffect } from "react";
import axios from 'axios';
import PointImage from "../../assets/images/reward_management/Frame.png";
const CatalogueProducts = () => {
  // State to hold product data
  const [products, setProducts] = useState<any[]>([]);

  // Fetch Product data
  useEffect(() => {
    document.title = 'Points Details';

    const fetchProductData = async () => {
      try {
        const response = await axios.get(`/api/method/reward_management.api.carpenter_master.get_carpainter_data`);
        console.log("Product data:", response.data);
// Access the 'data' array from the response
        const data = response.data.message.data; 
        console.log("Table data:", data);

        // Ensure data is an array before setting state
        if (Array.isArray(data)) {
          // Save product data to state
          setProducts(data); 
        } else {
          // Default to empty array if the data is not an array
          setProducts([]); 
        }
      } catch (error) {
        console.error("Error fetching product data:", error);
        // Handle error by setting an empty array
        setProducts([]); 
      }
    };

    fetchProductData();
  }, []);

  return (
    <>
      <Pageheader
        currentpage={"Points Details"} 
        activepage={"/point-details"} 
        activepagename='Points Details' 
      />
      <div className="grid grid-cols-12 gap-x-6 pb-5 mt-5">
        <div className="xxl:col-span-12 xl:col-span-12 lg:col-span-12 col-span-12">
          <div className="grid xxl:grid-cols-4 xl:grid-cols-4 lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 grid-cols-1 lg:gap-3 md:gap-3 sm:gap-3 gap-2">
            {products.length > 0 ? (
              products.map((product, index) => (
                <div key={index} className="flex flex-col p-4 ">
                  {product.point_history && product.point_history.length > 0 ? (
                    product.point_history.map((item, subIndex) => (
                      <div key={subIndex} className="">
                        {/* Product Image */}
                        <img
                          src={item.product_image}
                          alt={item.product_name}
                          className="w-full h-40 rounded-[10px]"
                        />
                        
                        {/* Product Name and Points */}
                        <div className="mt-3 text-start">
                          <h3 className="text-lg font-semibold text-black">{item.product_name}</h3>
                          <div className="flex">
                          <p className="text-sm text-[#464646] pr-1">Points</p>
                          <img src={PointImage} className="pr-1 w-5 h-5"></img>
                          <p className="text-sm text-blacpk">{item.earned_points}</p>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-center text-gray-700">No point history available.</p>
                  )}
                </div>
              ))
            ) : (
              <p className="text-center col-span-12">No products available.</p>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default CatalogueProducts;
