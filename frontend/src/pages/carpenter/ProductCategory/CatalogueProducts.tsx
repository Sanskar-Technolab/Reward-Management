import "../../../assets/css/header.css";
import "../../../assets/css/style.css";
import Pageheader from "../../../components/common/pageheader/pageheader";
import ProductCatalogueImage from '../../../assets/images/reward_management/Frame 5.png';
import { useLocation } from "react-router-dom"; // To access query parameters

const CatalogueProducts = () => {
const location = useLocation();
  const queryParams = new URLSearchParams(location.search); // Parse query parameters
  const catalogueId = queryParams.get("catalogueId");
    const products = [
        { id: 1, name: "Aquastop Nanoflex", image: ProductCatalogueImage },
        { id: 2, name: "Aquastop Fix", image: ProductCatalogueImage },
        { id: 3, name: "Aquastop Nanosil", image: ProductCatalogueImage },
        { id: 4, name: "Aquastop Green", image: ProductCatalogueImage },
        { id: 1, name: "Aquastop Flex", image: ProductCatalogueImage },
        { id: 2, name: "Nanodefense Eco", image: ProductCatalogueImage },
        { id: 3, name: "Aquastop Traffic", image: ProductCatalogueImage },
        { id: 4, name: "Aquastop NanoGum", image: ProductCatalogueImage },
      ];
    return(
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
          <div className="grid xxl:grid-cols-6 xl:grid-cols-5 lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 grid-cols-1 lg:gap-6 md:gap-4 sm:gap-3 gap-2" >
            {products.map((product) => (
              <div
                key={product.id}
                className="border border-gray-200 rounded-[10px] p-4 hover:shadow-lg transition"
              >
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-48 object-cover rounded-[10px]"
                />
                <h3 className="mt-4 text-center text-defaultsize font-normal text-black">
                  {product.name}
                </h3>
              </div>
            ))}
          </div>
        </div>
      </div>
          </>
        )
    }
export default CatalogueProducts;