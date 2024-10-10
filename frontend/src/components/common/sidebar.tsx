import { useState, useEffect } from 'react';
import '../../assets/css/style.css';
import '../../assets/css/sidebar.css';

// import sidebarLogo from '../../assets/images/Sanskar_Technolab_Logo-light.png';
import { SidebarData } from './sidebar/sidebardata';
import SubMenu from './sidebar/submenu';
import { Link } from 'react-router-dom';
import axios from 'axios';

console.log(SidebarData);

const Sidebar = ({ isSidebarActive }: any) => {
    // State to manage hover state
    const [isHover, setIsHover] = useState(false);
    const [logo, setLogo] = useState(null);
    const [loading, setLoading] = useState(true); // Loading state

    // Retrieve roles from localStorage
    const storedRoles = localStorage.getItem('user_roles');
    const carpenterrole = localStorage.getItem('carpenterrole');
    console.log(carpenterrole);
    const roles = storedRoles ? JSON.parse(storedRoles) : [];
    // console.log("Roles from localStorage:", roles);

    // Function to get the index of a specific item by title
    const getItemIndex = (title: any) => SidebarData.findIndex(item => item.title === title);

    // Determine which items to render based on roles
    const determineItemsToRender = () => {
        if (roles.includes("Administrator")) {
            const addUserIndex = getItemIndex('Add User');
            return addUserIndex !== -1 ? SidebarData.slice(0, addUserIndex + 1) : SidebarData;
        } else if (roles.includes("Admin")) {
            const faqIndex = getItemIndex("FAQ's");
            return faqIndex !== -1 ? SidebarData.slice(0, faqIndex + 1) : SidebarData;
        } else if (carpenterrole === "Customer") {
            const startIndex = getItemIndex('Dashboard');
            const endIndex = getItemIndex('Announcements');
            return startIndex !== -1 && endIndex !== -1 ? SidebarData.slice(startIndex, endIndex + 1) : [];
        } else {
            return SidebarData;
        }
    };

    const itemsToRender = determineItemsToRender();
    // console.log("itemsToRender---------------------------------->",itemsToRender);

    useEffect(() => {
        const fetchWebsiteSettings = async () => {
            try {
                const response = await axios.get('/api/method/reward_management.api.website_settings.get_website_settings');
                console.log('API Image Response:', response.data);

                // Check if the response is successful and contains the expected structure
                if (response && response.data && response.data.message && response.data.message.status === 'success') {
                    const { banner_image } = response.data.message.data;

                    // If banner_image exists, set it as the logo
                    if (banner_image) {
                        const fullBannerImageURL = `${window.origin}${banner_image}`;
                        setLogo(fullBannerImageURL); // Set the banner image as the logo
                        console.log('Banner Image Set:', fullBannerImageURL);
                    } else {
                        console.log('No banner_image found, using default logo.');
                        setLogo("/assets/frappe/images/frappe-framework-logo.svg"); // Set to default logo if no banner_image found
                    }
                } else {
                    console.error('API response was not successful:', response.data.message);
                    setLogo("/assets/frappe/images/frappe-framework-logo.svg"); // Set to default logo on failure
                }
            } catch (error) {
                console.error('Error fetching website settings:', error);
                setLogo("/assets/frappe/images/frappe-framework-logo.svg");// Set to default logo on error
            } finally {
                setLoading(false); // End loading state
            }
        };

        fetchWebsiteSettings();
        // Effect to handle cleanup of event listeners
        const sidebar = document.querySelector('.side-menu');

        const handleMouseOver = () => setIsHover(true);
        const handleMouseOut = () => setIsHover(false);

        if (sidebar) {
            sidebar.addEventListener('mouseover', handleMouseOver);
            sidebar.addEventListener('mouseout', handleMouseOut);
        }

        return () => {
            if (sidebar) {
                sidebar.removeEventListener('mouseover', handleMouseOver);
                sidebar.removeEventListener('mouseout', handleMouseOut);
            }
        };
    }, []);

    if (loading) {
        // Use the same conditional properties as the main sidebar
        const loadingClass = `${isSidebarActive ? (isHover ? 'wide' : 'narrow') : 'wide'} text-white`;
        const loadingWidthClass = `${isSidebarActive ? (isHover ? 'w-32' : 'w-16') : 'w-32'}`;
        
        return <div className={`side-menu ${loadingClass} ${loadingWidthClass}`} ></div>; // Maintain sidebar properties
    }

    return (
        <div className={`side-menu ${isSidebarActive ? (isHover ? 'wide' : 'narrow') : 'wide'} text-white`}>
            <div className="main-sidebar-header">
                <img 
                    src={logo} 
                    alt="logo" 
                    className={`transition-all duration-300 max-h-[45px] ${isSidebarActive ?  (isHover ? 'w-32' : 'w-16') : 'w-32'}`} 
                />
            </div>
            <div className='main-sidebar'>
    <ul>
        {itemsToRender.map((item, index) => (
            item.subNav ? (
                <SubMenu 
                    item={item} 
                    key={index} 
                    isSidebarActive={isSidebarActive} 
                    isHover={isHover} 
                />
            ) : (
                <li className='sidebar-menu-item' key={index}>
                    {item.path ? (
                        <Link to={item.path} className="flex items-center">
                            {item.icon}
                            <span className="menu-text">{item.title}</span>
                        </Link>
                    ) : (
                        <div className="flex items-center cursor-default">
                            {item.icon}
                            <span className="menu-text">{item.title}</span>
                        </div>
                    )}
                </li>
            )
        ))}
    </ul>
</div>

        </div>
    );
};

export default Sidebar;
