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

    const fetchUserData = async () => {
      try {
        const response = await axios.get('/api/method/frappe.auth.get_logged_user');
        const loggedInUser = response.data.message; // Get logged-in user name
        // console.log("Logged in user:", loggedInUser);
  
        if (loggedInUser) {
          await fetchProductData(loggedInUser); // Pass the user to the carpenter data API
        }
      } catch (error) {
        console.error("Error fetching logged user data:", error);
      }
    };

    const fetchProductData = async (loggedInUser: any) => {
      try {
        const response = await axios.get('/api/method/reward_management.api.carpenter_master.get_carpainter_data', {
          params: { user: loggedInUser },
        });

        // console.log("Product data:", response.data);
        const carpainterData = response.data.message.carpainter_data;
        
        if (Array.isArray(carpainterData) && carpainterData.length > 0) {
          const pointHistory = carpainterData[0]?.point_history || [];
          
          // Filter and map only items with valid product details
          const validProducts = pointHistory.filter((item: any) => item.product_name && item.product_image);
          setProducts(validProducts);
        } else {
          setProducts([]);
        }
      } catch (error) {
        console.error("Error fetching product data:", error);
        setProducts([]);
      }
    };

    fetchUserData();
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
                  {/* Product Image */}
                  <img
                    src={product.product_image}
                    alt={product.product_name}
                    className="w-full h-40 rounded-[10px]"
                  />
                  
                  {/* Product Name and Points */}
                  <div className="mt-3 text-start">
                    <h3 className="text-lg font-semibold text-black">{product.product_name}</h3>
                    <div className="flex">
                      <p className="text-sm text-[#464646] pr-1">Points</p>
                      <img src={PointImage} className="pr-1 w-5 h-5" alt="Points Icon" />
                      <p className="text-sm text-black">{product.earned_points}</p>
                    </div>
                  </div>
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
