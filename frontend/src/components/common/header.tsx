import { Fragment, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import '../../assets/css/header.css';
import '../../assets/css/style.css';

import ProfilePic from '/src/assets/images/reward_management/9.jpg';
import { IconAlignLeft } from '@tabler/icons-react';
import { IconX } from '@tabler/icons-react';
import '@fortawesome/fontawesome-free/css/all.min.css';
import 'boxicons/css/boxicons.min.css';
import NotificationDropdown from '../ui/notification';
import Modalsearch from "./modalsearch/modalsearch";
import { useFrappeAuth } from "frappe-react-sdk";
import axios from 'axios';



const Header = ({ toggleSidebar, isSidebarActive }: any) => {

    const { logout } = useFrappeAuth();
    const carpenterrole = localStorage.getItem('carpenterrole');
    console.log(carpenterrole);

    const roles = JSON.parse(localStorage.getItem('user_roles')) || [];
    console.log("admin role-----", roles);

    // Check if the user has Admin or Administrator roles
    const isAdmin = roles.includes("Admin");
    const isAdministrator = roles.includes("Administrator");

    // Debug logs to check if the conditions are correct
    console.log("isAdmin:", isAdmin);
    console.log("isAdministrator:", isAdministrator);
    const [fullScreen, setFullScreen] = useState(false);
    const [theme, setTheme] = useState({
        dataNavLayout: 'vertical',
        dataVerticalStyle: 'closed',
        dataNavStyle: 'menu-click',
        toggled: '',
        class: 'light',
    });

    // const [value, setValue] = useState(localStorage.getItem("username"));
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [notificationCount, setNotificationCount] = useState(0);
    const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
    const [isDropdownVisible, setDropdownVisible] = useState(false);
    const [UserImage, setUserImage] = useState(ProfilePic);
    const [username, setUsername] = useState('');
    const toggleDropdown = () => {
        setDropdownOpen(!dropdownOpen);
    };

    useEffect(() => {
        const fetchUserEmailAndInitScanner = async () => {
            try {
                const userResponse = await axios.get(`/api/method/frappe.auth.get_logged_user`, {
                   
                });
    
                const userdata = await axios.get(`/api/resource/User/${userResponse.data.message}`, {
                   
                });
    
                setUsername(userdata.data.data.username || "");
                setUserImage(userdata.data.data.user_image || ProfilePic);
    
            } catch (error) {
                console.error("Error fetching data:", error);
                // You might want to set an error state or show a notification here.
            }
        };
    
        fetchUserEmailAndInitScanner();
    }, []);

    const toggleFullScreen = () => {
        const elem = document.documentElement;
        if (!document.fullscreenElement) {
            elem.requestFullscreen().then(() => setFullScreen(true));
        } else {
            document.exitFullscreen().then(() => setFullScreen(false));
        }
    };

    const handleFullscreenChange = () => {
        setFullScreen(!!document.fullscreenElement);
    };

    useEffect(() => {
        document.addEventListener('fullscreenchange', handleFullscreenChange);
        return () => {
            document.removeEventListener('fullscreenchange', handleFullscreenChange);
        };
    }, []);

    const ToggleDark = () => {
        const newClass = theme.class === 'dark' ? 'light' : 'dark';
        const newTheme = {
            ...theme,
            "class": newClass,
            "dataHeaderStyles": newClass,
            "dataMenuStyles": theme.dataNavLayout === 'horizontal' ? newClass : "dark"
        };

        setTheme(newTheme);
        applyTheme(newTheme);

        if (newClass === 'dark') {
            localStorage.setItem("ynexdarktheme", "dark");
            localStorage.removeItem("ynexlighttheme");
        } else {
            localStorage.setItem("ynexlighttheme", "light");
            localStorage.removeItem("ynexdarktheme");
        }
        localStorage.removeItem("ynexMenu");
        localStorage.removeItem("ynexHeader");
    };

    const applyTheme = (theme: any) => {
        const root = document.documentElement;
        root.style.setProperty('--data-nav-layout', theme.dataNavLayout);
        root.style.setProperty('--data-vertical-style', theme.dataVerticalStyle);
        root.style.setProperty('--data-nav-style', theme.dataNavStyle);
        root.style.setProperty('--data-toggled', theme.toggled);
        root.style.setProperty('--data-class', theme.class);

        const sidemenu: any = document.querySelector(".side-menu");
        // console.log("sidemenu------",sidemenu);
        const appHeader: any = document.querySelector(".app-header");
        if (sidemenu) {
            const sidebarWidth = isSidebarActive ? '5rem' : '15rem'; // Width changes based on icon
            sidemenu.style.width = sidebarWidth;
            if (appHeader) {
                appHeader.style.paddingLeft = sidebarWidth; // Adjust header padding to match sidebar width
            }
        }
    };

    useEffect(() => {
        applyTheme(theme);
    }, [theme, isSidebarActive]);



    const handleOpenSearchModal = () => {
        setIsSearchModalOpen(true);
    };

    const handleCloseSearchModal = () => {
        setIsSearchModalOpen(false);
    };
    const handleDropdownToggle = () => {
        setDropdownVisible(prevState => !prevState);
    };



    return (
        <Fragment>
            <header className="app-header">
                <nav className="main-header h-[3.75rem]">
                    <div className="main-header-container ps-[0.725rem] pe-[1rem]">
                        <div className="header-content-left">
                            <div className="header-element md:px-[0.325rem] !items-center">
                                <Link
                                    aria-label="Toggle Sidebar"
                                    className="sidemenu-toggle animated-arrow hor-toggle horizontal-navtoggle inline-flex items-center"
                                    to="#"
                                    onClick={toggleSidebar}
                                >
                                    {isSidebarActive ? (
                                        // <IconX className="text-[rgb(var(--header-prime-color))]" />
                                        <IconX className="text-black" />
                                    ) : (
                                        // <IconAlignLeft className="text-[rgb(var(--header-prime-color))]" />
                                        <IconAlignLeft className="text-black" />
                                    )}
                                </Link>
                            </div>
                        </div>


                        <div className="header-content-right flex items-center ">

                            {/* search btn logic start------- */}
                            <div className="header-element py-[1rem] md:px-[0.65rem] px-2 header-search">
                                <button
                                    aria-label="button"
                                    type="button"
                                    onClick={handleOpenSearchModal}
                                    className="inline-flex flex-shrink-0 justify-center items-center gap-2 rounded-full font-medium focus:ring-offset-0 focus:ring-offset-white transition-all text-xs dark:bg-bgdark dark:hover:bg-black/20 dark:text-[#8c9097] dark:text-white/50 dark:hover:text-white dark:focus:ring-white/10 dark:focus:ring-offset-white/10"
                                >
                                    <i className="bx bx-search-alt-2 header-link-icon"></i>
                                </button>
                            </div>
                            {/* end search btn */}

                            {/* notification logic start------- */}
                            <div>
                                <div className="header-element py-[1rem] md:px-[0.65rem] px-2">
                                    <button className="header-btn header-btn-search" onClick={toggleDropdown}>
                                        <div className="notification-icon-container relative">
                                            <i className="bx bx-bell header-link-icon" style={{ color: 'black' }}></i>
                                            {notificationCount > 0 && (
                                                <span className="flex absolute h-5 w-5 -top-[0.25rem] end-0 -me-[0.6rem]">
                                                    <span className="animate-slow-ping absolute inline-flex -top-[2.5px] -start-[2.5px] h-full w-full rounded-full bg-[var(--bg-secondary)] opacity-75"></span>
                                                    <span
                                                        className="relative inline-flex justify-center items-center rounded-full h-[14.7px] w-[14px]  bg-[var(--secondaries)]  text-[0.625rem] text-white"
                                                        id="notification-icon-badge"
                                                    >
                                                        {notificationCount}
                                                    </span>
                                                </span>
                                            )}
                                        </div>
                                    </button>
                                </div>

                                <NotificationDropdown
                                    isOpen={dropdownOpen}
                                    toggleDropdown={toggleDropdown}
                                    onNotificationCountChange={setNotificationCount}
                                />
                            </div>
                            {/* end notification */}


                            {/* start full screen */}
                            <div className="header-element py-[1rem] md:px-[0.65rem] px-2">
                                <button className="header-btn" onClick={toggleFullScreen}>
                                    <i className={`header-link-icon bx ${fullScreen ? 'bx-exit-fullscreen' : 'bx-fullscreen'}`}></i>
                                </button>
                            </div>
                            {/* end of fullscreen */}

                            {/* start of user profile */}
                            <div className="header-element py-[1rem] md:px-[0.65rem] px-2">

                                <button id="dropdown-profile" type="button"
                                    className="hs-dropdown-toggle ti-dropdown-toggle !gap-2 !p-0 flex-shrink-0 sm:me-2 me-0 !rounded-full !shadow-none text-xs align-middle !border-0 !shadow-transparent "
                                    onClick={handleDropdownToggle}>
                                    <img className="inline-block rounded-full w-[30px] h-[30px]" src={UserImage} width="32" height="32" alt="Image Description" />
                                </button>
                                <div className="md:block hidden dropdown-profile cursor-pointer" onClick={handleDropdownToggle}>
                                    <p className="font-semibold mb-0 pt-3 leading-none text-black text-[0.813rem] ">{username}</p>
                                </div>
                                <div
                                    className={`hs-dropdown-menu main-header-dropdown ti-dropdown-menu bg-white mt-3 fixed top-12 right-4 border-0 w-[10rem] p-0 border-defaultborder ${isDropdownVisible ? '' : 'hidden'}  pt-0 overflow-hidden header-profile-dropdown dropdown-menu-end`}
                                    aria-labelledby="dropdown-profile"
                                >
                                    <ul className="text-defaulttextcolor font-medium dark:text-[#8c9097] dark:text-white/50">

                                        <li className="user-profile-list hover:bg-[var(--bg-primary)] hover:text-[var(--primaries)]">
                                            {(isAdmin || isAdministrator) && (
                                                <a className="w-full ti-dropdown-item !text-[0.8125rem] !gap-x-0 !p-[0.65rem] !inline-flex" href={`/admin-profile`}>
                                                    <i className="ti ti-user-circle text-[1.125rem] me-2 opacity-[0.7]"></i>Profile
                                                </a>
                                            )}

                                            {(carpenterrole === "Customer") && (

                                                <a className="w-full ti-dropdown-item !text-[0.8125rem] !gap-x-0 !p-[0.65rem] !inline-flex" href={`/profile-setting`}>
                                                    <i className="ti ti-user-circle text-[1.125rem] me-2 opacity-[0.7]"></i>Profile
                                                </a>

                                            )}
                                        </li>


                                        <li className="user-profile-list hover:bg-[var(--bg-primary)] hover:text-[var(--primaries)]">
                                            <a
                                                className="w-full ti-dropdown-item !text-[0.8125rem] !p-[0.65rem] !gap-x-0 !inline-flex"
                                                href="/"
                                                onClick={() => {
                                                    localStorage.removeItem('user_roles');
                                                    localStorage.removeItem('carpenterrole');
                                                    localStorage.removeItem("username");
                                                    logout;
                                                }}
                                            >
                                                <i className="ti ti-logout text-[1.125rem] me-2 opacity-[0.7]"></i>Log Out
                                            </a>
                                        </li>
                                    </ul>
                                </div>

                            </div>
                        </div>

                    </div>
                </nav>
            </header>
            <Modalsearch isOpen={isSearchModalOpen} onClose={handleCloseSearchModal} />
        </Fragment>
    );
};

export default Header;
