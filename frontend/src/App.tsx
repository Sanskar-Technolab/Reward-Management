
import { useState,useEffect  } from 'react';
// import favicon from '../../assets/images/reward_management/frappe-framework-logo.svg';
import { Outlet, Route, RouterProvider, createBrowserRouter, createRoutesFromElements, Navigate } from 'react-router-dom'
import { FrappeProvider } from 'frappe-react-sdk';
import '@radix-ui/themes/styles.css';
import { Theme } from '@radix-ui/themes';
import Header from './components/common/header';
import Sidebar from './components/common/sidebar';
import Login from './pages/auth/Login';
import CusromerProducts from './pages/customer/CustomerProduct.tsx'
import CustomerProductDetails from './pages/customer/ViewProduct.tsx'
import PrivateRoutes from './routes/private-routes';
import AdminProfile from './pages/admin/admindashboards/AdminProfile';
import AdminDashboard from './pages/admin/admindashboards/AdminDashboard.tsx';
import ProductMaster from './pages/admin/productdashboards/ProductMaster.tsx';
import AddProduct from './pages/admin/productdashboards/Addproduct.tsx';
import EditProduct from './pages/admin/productdashboards/EditProduct.tsx';
import ProductQRHistory from './pages/admin/productdashboards/ProductQRHistory.tsx';
import DownloadQRCode from './pages/admin/productdashboards/DownloadQR.tsx';
import CarpenterRegistration from './pages/admin/carpenterdashboard/CarpenterRegistration.tsx';
import CarpenterDetails from './pages/admin/carpenterdashboard/CarpenterDetails.tsx';
import CarpenterRewardRequest from './pages/admin/rewardrequest/RewardRequest.tsx';
import RedeemptionHistory from './pages/admin/rewardrequest/RedeemptionHistory.tsx';
import AdminAnnouncement from './pages/admin/announcement/AnnouncementDashboard.tsx';
import TransactionHistory from './pages/admin/transactions/TransactionHistroy.tsx';
import FAQDashboard from './pages/admin/faq/FAQDashboard.tsx';
import AddUserDashboard from './pages/admin/admindashboards/AddUser.tsx';
import SetRewardPoint from './pages/admin/setrewardpoint/SetRewardPoint.tsx';
import AdminNotifications from './pages/admin/notificationdashboard/adminnotifications.tsx'
import CarpenterDashboard from './pages/carpenter/CarpenterDashboard.tsx';
import CarpenterBankingHistory from './pages/carpenter/BankingHistory.tsx'
import PointHistory from './pages/carpenter/PointHistory.tsx';
import QRCodeScanner from './pages/carpenter/QRScanner.tsx'
import RedeemRequest from './pages/carpenter/RewardRequest.tsx';
import HelpAndSupport from './pages/carpenter/HelpAndSupport.tsx';
import Announcement from './pages/carpenter/Announcements.tsx';
import CustomerProfile from './pages/carpenter/CustomerProfile.tsx';
import PointConversion from './pages/admin/transactions/PointsConversion.tsx';




function App() {
  const [isSidebarActive, setIsSidebarActive] = useState(false);
  const [faviconUrl, setFaviconUrl] = useState<string | null>(null); 

  const toggleSidebar = () => {
    setIsSidebarActive(!isSidebarActive);
    
  };

  const getSiteName = () => {

    // @ts-ignore
    if (window.frappe?.boot?.versions?.frappe && (window.frappe.boot.versions.frappe.startsWith('15') || window.frappe.boot.versions.frappe.startsWith('16'))) {
      // @ts-ignore
      return window.frappe?.boot?.sitename ?? import.meta.env.VITE_SITE_NAME
    }
    return import.meta.env.VITE_SITE_NAME

  }

  const AppLayout = () => (
    <>
      <div className={`page layout ${isSidebarActive ? 'sidebar-narrow' : 'sidebar-wide'}`}>
              <Header toggleSidebar={toggleSidebar} isSidebarActive={isSidebarActive} />
              <Sidebar isSidebarActive={isSidebarActive} />
              <div className='content main-index' style={{ marginInlineStart: isSidebarActive ? '5rem' : '15rem' }}>
                <div className='main-content bg-body-bg'>
                  <Outlet />
                </div>
              </div>
            </div>
    </>
  );


// Function to set the favicon
const setFavicon = (url: string) => {
  let headTitle: HTMLHeadElement | null = document.head; // Assign document.head to headTitle

  if (headTitle) { // Check if headTitle is not null
      const existingFavicon = headTitle.querySelector('link[rel="shortcut icon"]');
      if (existingFavicon) {
          headTitle.removeChild(existingFavicon);
      }

      let setFaviconLink = document.createElement('link');
      setFaviconLink.setAttribute('rel', 'shortcut icon');
      setFaviconLink.setAttribute('type', 'image/svg+xml'); // Adjust type if needed
      setFaviconLink.setAttribute('href', url);
      headTitle.appendChild(setFaviconLink);
  } else {
      console.error('Head element not found'); // Optional: Handle the case where headTitle is null
  }
};

useEffect(() => {
  const fetchWebsiteSettings = async () => {
    try {
        const response = await fetch('/api/method/reward_management.api.website_settings.get_website_settings');

        // Check if the response is OK and parse the JSON
        if (response.ok) {
            const data = await response.json();

            // Check if the response indicates success
            if (data && data.message && data.message.status === 'success') {
                const { favicon } = data.message.data || {};

                if (favicon) {
                    // Prepend window.origin to the favicon path
                    const absoluteFaviconUrl = `${window.origin}${favicon}`;
                    setFaviconUrl(absoluteFaviconUrl); 
                    setFavicon(absoluteFaviconUrl); // Call setFavicon with the absolute URL
                } else {
                    const defaultFaviconUrl = "/assets/frappe/images/frappe-framework-logo.svg";
                    setFaviconUrl(defaultFaviconUrl);
                    setFavicon(defaultFaviconUrl); // Call setFavicon with the default URL
                }
            } else {
                console.error("Error fetching website settings:", data?.message || 'No message available');
            }
        } else {
            console.error("Network response was not ok:", response.statusText);
        }
    } catch (error) {
        console.error("Error fetching website settings:", error.message || error);
    }
};

fetchWebsiteSettings();
}, []);



  const router = createBrowserRouter(
    createRoutesFromElements(
      <>
        <Route path='/' element={<Login />} />
        <Route path='/customer-product' element={<CusromerProducts />} />
        <Route path='/view-product-details/:product_id' element={<CustomerProductDetails/>} />
        <Route element={<AppLayout/>}>
        <Route path='/' element={<PrivateRoutes/>}>
          <Route path='/admin-profile' element={<AdminProfile />} />
          <Route path='/point-conversion' element= {<PointConversion/>} />
          <Route path='/admin-dashboard' element={<AdminDashboard />} />
          <Route path='/product-master' element={<ProductMaster />} />
          <Route path='/add-product' element={<AddProduct />}/>
          <Route path='/edit-product' element={<EditProduct />}/>
          <Route path='/product-qr-history' element={<ProductQRHistory />} />
          <Route path='/download-qr-code' element={<DownloadQRCode />} />
          <Route path='/carpenter-registration' element={<CarpenterRegistration />} />
          <Route path='/carpenter-details' element={<CarpenterDetails/>} />
          <Route path='/redeemption-request' element={<CarpenterRewardRequest />} />
          <Route path='/redeem-history' element={<RedeemptionHistory />} />
          <Route path='/announcement' element={<AdminAnnouncement />} />
          <Route path='/transaction-history' element={<TransactionHistory />} />
          <Route path='/frequently-asked-question' element={<FAQDashboard />} />
          <Route path='/add-user' element={<AddUserDashboard />} />
          <Route path='/set-reward-points' element={<SetRewardPoint/>} />
          <Route path='/notifications' element={<AdminNotifications/>}/>
          <Route path='/carpenter-dashboard' element={<CarpenterDashboard/>} />
          <Route path='/banking-history' element={<CarpenterBankingHistory/>} />
          <Route path='/point-history' element={<PointHistory/>} />
          <Route path='/qr-scanner' element={<QRCodeScanner/>} />
          <Route path='/redeem-request' element={<RedeemRequest/>} />
          <Route path='/help-and-support' element={<HelpAndSupport/>} />
          <Route path='/customer-announcement' element={<Announcement/>} />
          <Route path='/profile-setting' element={<CustomerProfile/>}/>
          <Route path='*' element={<Navigate to="/" replace />} />
          
        </Route>
        </Route>
        
      </>
    ), {
    // basename: `/${import.meta.env.VITE_BASE_NAME}` ?? '',
    basename: '/rewards',
  }
  )
  


  return (
    <div className="App">
      <Theme appearance="light" accentColor="iris" panelBackground="translucent">
        <FrappeProvider
        enableSocket={false}
          socketPort={import.meta.env.VITE_SOCKET_PORT}
          siteName={getSiteName()}
        >
          <RouterProvider router={router} />
        </FrappeProvider>
      </Theme>
    </div>
  );
}

export default App;
