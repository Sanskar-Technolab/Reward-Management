import "../../../assets/css/header.css";
import "../../../assets/css/style.css";
import Pageheader from "../../../components/common/pageheader/pageheader";
import { useLocation } from "react-router-dom";
import { useFrappeGetDocList } from "frappe-react-sdk";

const CatalogueProducts = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search); // Parse query parameters
  const catalogueId = queryParams.get("catalogueId");
    
  // Fetch Product data
  const { data: products, error, isLoading } = useFrappeGetDocList('Product', {
    fields: ['name', 'product_name', 'product_image', 'category'], // Fetch fields from the Product Category doctype
    limit: 10, // Adjust limit as needed
  });

  // Filter products based on category matching the catalogueId
  const filteredProducts = products?.filter(product => product.category === catalogueId) || [];

  return (
    <>
      <Pageheader
        currentpage={catalogueId}
        activepage={"/product-catalogue"}
        mainpage={"/catalogue-products"}
        activepagename="Product Catalogue"
        mainpagename={catalogueId}
      />
      <div className="grid grid-cols-12 gap-x-6 pb-5 mt-5">
        <div className="xxl:col-span-12 xl:col-span-12 lg:col-span-12 col-span-12">
          <div className="grid xxl:grid-cols-6 xl:grid-cols-5 lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 grid-cols-1 lg:gap-6 md:gap-4 sm:gap-3 gap-2">
            {filteredProducts.map((product) => (
              <div
                key={product.name} // Changed to use product.name as the key
                className="border border-gray-200 rounded-[10px] p-4 hover:shadow-lg transition"
              >
                <img
                  src={product.product_image} // Changed to match field name
                  alt={product.product_name} // Changed to match field name
                  className="w-full h-48 object-cover rounded-[10px]"
                />
                <h3 className="mt-4 text-center text-defaultsize font-normal text-black">
                  {product.product_name} {/* Changed to match field name */}
                </h3>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default CatalogueProducts;
