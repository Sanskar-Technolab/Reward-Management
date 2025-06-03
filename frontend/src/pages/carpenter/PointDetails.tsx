import "../../assets/css/header.css";
import "../../assets/css/style.css";
import Pageheader from "../../components/common/pageheader/pageheader";
import { useState, useEffect } from "react";
import axios from 'axios';
import PointImage from "../../assets/images/reward_management/Frame.png";

const CatalogueProducts = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true); // <-- Loading state

  useEffect(() => {
    document.title = 'Points Details';

    const fetchUserData = async () => {
      try {
        const response = await axios.get('/api/method/frappe.auth.get_logged_user');
        const loggedInUser = response.data.message;

        if (loggedInUser) {
          await fetchProductData(loggedInUser);
        }
      } catch (error) {
        console.error("Error fetching logged user data:", error);
        setProducts([]);
      } finally {
        setLoading(false); // <-- Ensure loading stops
      }
    };

    const fetchProductData = async (loggedInUser: any) => {
      try {
        const response = await axios.get(
          '/api/method/reward_management.api.carpenter_master.get_carpainter_data',
          {
            params: { user: loggedInUser },
          }
        );

        const carpainterData = response.data.message?.carpainter_data || [];

        if (Array.isArray(carpainterData) && carpainterData.length > 0) {
          const pointDetails = carpainterData[0]?.point_details || [];

          const validProducts = pointDetails.filter(
            (item: any) => item.product_name && item.product_image
          );

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
        activepagename="Points Details"
      />
      <div className="grid grid-cols-12 gap-x-6 pb-5 mt-5">
        <div className="xxl:col-span-12 xl:col-span-12 lg:col-span-12 col-span-12">
          {loading ? (
            <div className="text-center text-gray-500 col-span-12">Loading...</div>
          ) : (
            <div className="grid xxl:grid-cols-6 xl:grid-cols-5 lg:grid-cols-4 md:grid-cols-4 sm:grid-cols-2 grid-cols-1 lg:gap-3 md:gap-3 sm:gap-3 gap-2">
              {products.length > 0 ? (
                products.map((product, index) => (
                  <div key={index} className="flex flex-col p-4">
                    <img
                      src={product.product_image}
                      alt={product.product_id}
                      className="w-full object-cover rounded-[10px] bg-[#DDDDDD]"
                    />
                    <div className="mt-3 text-start">
                      <h3 className="text-lg font-semibold text-black">{product.product_name}</h3>
                      <div className="flex items-center">
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
          )}
        </div>
      </div>
    </>
  );
};

export default CatalogueProducts;
