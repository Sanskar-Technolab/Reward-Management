import "../../../assets/css/header.css";
import "../../../assets/css/style.css";
import Pageheader from "../../../components/common/pageheader/pageheader";
import ProductCatalogueImage from '../../../assets/images/reward_management/Frame 5.png';
import { Link } from "react-router-dom"; // Import Link for navigation

const ProductCatalogue = () => {
  const products = [
    { id: 1, name: "Substrate preparation", image: ProductCatalogueImage },
    { id: 2, name: "Waterproofing", image: ProductCatalogueImage },
    { id: 3, name: "Laying ceramic tiles and natural stone", image: ProductCatalogueImage },
    { id: 4, name: "Laying of hardwood floors", image: ProductCatalogueImage },
    { id: 5, name: "Substrate preparation", image: ProductCatalogueImage },
    { id: 6, name: "Waterproofing", image: ProductCatalogueImage },
    { id: 7, name: "Laying ceramic tiles and natural stone", image: ProductCatalogueImage },
    { id: 8, name: "Laying of hardwood floors", image: ProductCatalogueImage },
  ];

  return (
    <>
      <Pageheader
        currentpage={"Product Catalogue"}
        activepage={"/product-catalogue"}
        mainpage={"/product-catalogue"}
        activepagename="Product Catalogue"
        mainpagename="Product Catalogue"
      />
      <div className="grid grid-cols-12 gap-x-6 pb-5 mt-5">
        <div className="xxl:col-span-12 xl:col-span-12 lg:col-span-12 col-span-12">
          <div className="grid xxl:grid-cols-6 xl:grid-cols-5 lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 grid-cols-1 lg:gap-6 md:gap-4 sm:gap-3 gap-2">
            {products.map((product) => (
              <Link 
                key={product.id} 
                to={`/catalogue-products?catalogueId=${encodeURIComponent(product.name)}`} // Passing product name as a query parameter
                className="border border-gray-200 rounded-[10px] p-4 hover:shadow-lg transition block"
              >
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-48 object-cover rounded-[10px]"
                />
                <h3 className="mt-4 text-center text-defaultsize font-normal text-black">
                  {product.name}
                </h3>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductCatalogue;
