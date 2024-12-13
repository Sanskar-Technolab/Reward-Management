import ProductCard from '../../../components/ui/productcard/card';
import '../../../assets/css/header.css';
import '../../../assets/css/style.css';
import Pageheader from '../../../components/common/pageheader/pageheader';
import { useNavigate } from 'react-router-dom'; 
import axios from 'axios';
import { useEffect, useState } from 'react';
import { Notyf } from 'notyf';
import 'notyf/notyf.min.css'; 
import { useFrappeGetCall } from "frappe-react-sdk";


const ViewProduct = () => {
  const navigate = useNavigate(); 
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPoints, setCurrentPoints] = useState(0);  // Store customer points

  // Initialize Notyf for notifications
  const notyf = new Notyf({
    duration: 3000,  
    position: { x: 'center', y: 'top' }, // Position notification at the top center
  });

  // Assuming useFrappeGetCall is correctly fetching data
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
        setCurrentPoints(firstItem.current_points || 0); // Set current points
      } else {
        setError("No customer data available.");
      }
    }

    // Fetch products from the API
    const fetchProducts = async () => {
      try {
        const response = await axios.get('/api/method/reward_management.api.gift_product.get_gift_products');
        const productData = response.data.message.data;
        console.log("Fetched Products:", productData);

        if (response.data.message.status === 'success') {
          if (Array.isArray(productData) && productData.length > 0) {
            setProducts(productData);
          } else {
            setError('No products available.');
          }
        } else {
          setError('API returned an error status.');
        }
      } catch (err) {
        setError(err.message || 'Failed to fetch products.');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [data, isLoading, apiError]);

  // Handle the redeem button click
  const handleRedeemClick = (productName, pointsRequired) => {
    if (currentPoints >= pointsRequired) {
      const formattedProductName = productName.replace(/\s+/g, '-');
      navigate(`/product-details/${formattedProductName}`);
    } else {
      notyf.error('You do not have sufficient points to redeem this product.');  // Show error notification
    }
  };

  if (loading) return <div>Loading products...</div>;
  if (error) return <div>Error: {error}</div>;

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
              <div className="grid grid-cols-12 xl:gap-y-0 gap-4">
                {products.map((product, index) => (
                  <div
                    key={index}
                    className="xxxl:col-span-2 xxl:col-span-3 xl:col-span-4 lg:col-span-6 md:col-span-6 sm:col-span-12 col-span-12 h-auto"
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

export default ViewProduct;
