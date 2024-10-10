import { Fragment, useState, useEffect } from 'react';
import axios from 'axios';
import '../../assets/css/header.css';
import '../../assets/css/style.css';
import '../../assets/css/pages/carpenterproducts.css';
import Modalsearch from "../../components/common/modalsearch/modalsearch";
import '@fortawesome/fontawesome-free/css/all.min.css';
import 'boxicons/css/boxicons.min.css';
import sidebarLogo from '../../assets/images/sanskar-logo.png';
import { Link } from 'react-router-dom';

const CustomerProducts = () => {
  const [fullScreen, setFullScreen] = useState(false);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [productsData, setProductsData] = useState([]);

  useEffect(() => {
    document.title='Products';

    const fetchData = async () => {
      try {
        const response = await axios.get(`/api/method/reward_management.api.product_master.get_all_products_data`,{
      });
        
        console.log("API Response:", response.data);
        
        // Access the message property to get the products array
        const products = response.data.message || [];
        setProductsData(products);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
  
    fetchData();
  }, []);

  const handleOpenSearchModal = () => {
    setIsSearchModalOpen(true);
  };

  const handleCloseSearchModal = () => {
    setIsSearchModalOpen(false);
  };

  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
    setFullScreen(!fullScreen);
  };

  return (
    <Fragment>
      <header className="bg-white border border-defaultborder border-b-2">
        <nav className="main-header h-[3.75rem] mx-20">
          <div className="main-header-container pe-[1rem]">
            <div className="header-content-left">
              <div className="header-element md:px-[0.325rem] flex items-center">
                <img src={sidebarLogo} alt="Sidebar Logo" className="sidebar-logo w-18 h-10" />
              </div>
            </div>
            <div className="header-content-right flex items-center">
              <div className="header-element py-[1rem] md:px-[0.65rem] px-2 header-search">
                <button
                  aria-label="Search"
                  type="button"
                  onClick={handleOpenSearchModal}
                  className="inline-flex flex-shrink-0 justify-center items-center gap-2 rounded-full font-medium focus:ring-offset-0 focus:ring-offset-white transition-all text-xs dark:bg-bgdark dark:hover:bg-black/20 dark:text-[#8c9097] dark:text-white/50 dark:hover:text-white dark:focus:ring-white/10 dark:focus:ring-offset-white/10"
                >
                  <i className="bx bx-search-alt-2 header-link-icon"></i>
                </button>
              </div>
              <div className="header-element py-[1rem] md:px-[0.65rem] px-2">
                <button className="header-btn" onClick={toggleFullScreen}>
                  <i className={`header-link-icon bx ${fullScreen ? 'bx-exit-fullscreen' : 'bx-fullscreen'}`}></i>
                </button>
              </div>
            </div>
          </div>
        </nav>
      </header>

      <div className="mt-4 mx-20">
        <div className='mb-4'>
          <h3 className='text-defaulttextcolor text-lg text-center'>Products</h3>
        </div>
        <div className="grid grid-cols-12 gap-x-6">
          <div className="xxl:col-span-12 xl:col-span-12 lg:col-span-8 md:col-span-12 col-span-12">
            <div className="grid grid-cols-12 gap-x-6">
              {productsData.map((product: any, index: any) => (
                <div
                  className="xxl:col-span-3 xl:col-span-6 lg:col-span-6 md:col-span-6 sm:col-span-12 col-span-12"
                  key={index}
                >
                  <div className="box product-card">
                    <div className="box-body">
                      <Link to="#" className="product-image">
                        <img
                          src={product.product_image}
                          className="card-img mb-3 rounded-[5px] h-[500px] object-cover"
                          alt={product.product_name}
                        />
                      </Link>
                      <div className="product-icons">
                        <Link aria-label="Add to wishlist" to="#" className="wishlist">
                          <i className="ri-heart-line bg-danger/20 p-2 text-danger rounded-[8px] "></i>
                        </Link>
                        <Link aria-label="Add to cart" to="#" className="cart">
                          <i className="ri-shopping-cart-line bg-primary/20 p-2 text-primary rounded-[8px] "></i>
                        </Link>
                        <Link aria-label="View product" to={`/view-product-details?product_id=${product.product_id}`} className="view">
                          <i className="ri-eye-line bg-success/20 text-success p-2 rounded-[8px] "></i>
                        </Link>
                      </div>
                      <p className="product-name font-semibold mb-0 flex items-center justify-between">
                        {product.product_name}
                        <span className="ltr:float-right rtl:float-left text-warning text-xs">
                          4.2<i className="ri-star-s-fill align-middle ms-1 inline-block"></i>
                        </span>
                      </p>
                      <p className="product-description text-[.6875rem] text-[#8c9097] dark:text-white/50 mb-2">
                        {product.category}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <Modalsearch isOpen={isSearchModalOpen} onClose={handleCloseSearchModal} />
    </Fragment>
  );
};

export default CustomerProducts;
