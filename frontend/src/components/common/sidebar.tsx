import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import '../../assets/css/style.css';
import '../../assets/css/sidebar.css';

import { SidebarData } from './sidebar/sidebardata';
import SubMenu from './sidebar/submenu';
import axios from 'axios';

const Sidebar = ({ isSidebarActive }: any) => {
    const [isHover, setIsHover] = useState(false);
    const [logo, setLogo] = useState(null);
    const [loading, setLoading] = useState(true);
    const location = useLocation();
    const currentPath = location.pathname;

    const storedRoles = localStorage.getItem('user_roles');
    // const carpenterrole = localStorage.getItem('carpenterrole');
    const roles = storedRoles ? JSON.parse(storedRoles) : [];

    const getItemIndex = (title: any) => SidebarData.findIndex(item => item.title === title);

    const determineItemsToRender = () => {
        if (roles.includes("Administrator")) {
            const addUserIndex = getItemIndex('Add User');
            return addUserIndex !== -1 ? SidebarData.slice(0, addUserIndex + 1) : SidebarData;
        } else if (roles.includes("Admin")) {
            const faqIndex = getItemIndex("FAQ's");
            return faqIndex !== -1 ? SidebarData.slice(0, faqIndex + 1) : SidebarData;
        } else if (roles.includes("Customer")) {
            const startIndex = getItemIndex('Dashboard');
            const endIndex = getItemIndex('Contact');
            return startIndex !== -1 && endIndex !== -1 ? SidebarData.slice(startIndex, endIndex + 1) : [];
        } else {
            return SidebarData;
        }
    };

    const itemsToRender = determineItemsToRender();

    const isItemActive = (itemPath: string) => itemPath === currentPath;

    useEffect(() => {
        const fetchWebsiteSettings = async () => {
            try {
                const response = await axios.get('/api/method/reward_management.api.website_settings.get_website_settings');

                if (response && response.data && response.data.message && response.data.message.status === 'success') {
                    const { banner_image } = response.data.message.data;
                    if (banner_image) {
                        const fullBannerImageURL = `${window.origin}${banner_image}`;
                        setLogo(fullBannerImageURL);
                    } else {
                        setLogo("/assets/frappe/images/frappe-framework-logo.svg");
                    }
                } else {
                    console.error('API response was not successful:', response.data.message);
                    setLogo("/assets/frappe/images/frappe-framework-logo.svg");
                }
            } catch (error) {
                console.error('Error fetching website settings:', error);
                setLogo("/assets/frappe/images/frappe-framework-logo.svg");
            } finally {
                setLoading(false);
            }
        };

        fetchWebsiteSettings();

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
        const loadingClass = `${isSidebarActive ? (isHover ? 'wide' : 'narrow') : 'wide'} text-white`;
        const loadingWidthClass = `${isSidebarActive ? (isHover ? 'w-32' : 'w-16') : 'w-32'}`;
        return <div className={`side-menu ${loadingClass} ${loadingWidthClass}`}></div>;
    }

    return (
        <div className={`side-menu ${isSidebarActive ? (isHover ? 'wide' : 'narrow') : 'wide'} text-white`}>
            <div className="main-sidebar-header">
                <img
                    src={logo}
                    alt="logo"
                    className={`transition-all duration-300 max-h-[45px] ${isSidebarActive ? (isHover ? 'w-32' : 'w-16') : 'w-32'}`}
                />
            </div>
            <div className='main-sidebar'>
                <ul className='overflow-y-scroll'>
                    {itemsToRender.map((item, index) => (
                        item.subNav ? (
                            <SubMenu
                                item={item}
                                key={index}
                                isSidebarActive={isSidebarActive}
                                isHover={isHover}
                            />
                        ) : (
                            <li className={`sidebar-menu-item ${item.path && isItemActive(item.path) ? 'active-menu' : ''}`} key={index}>
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