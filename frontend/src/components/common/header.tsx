import { Fragment, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import '../../assets/css/header.css';
import '../../assets/css/style.css';

import ProfilePic from '/src/assets/images/reward_management/9.jpg';
import { IconAlignLeft, IconX } from '@tabler/icons-react';
import '@fortawesome/fontawesome-free/css/all.min.css';
import 'boxicons/css/boxicons.min.css';
import NotificationDropdown from '../ui/notification';
import Modalsearch from "./modalsearch/modalsearch";
import { useFrappeAuth } from "frappe-react-sdk";
import axios from 'axios';

const Header = ({ toggleSidebar, isSidebarActive }: any) => {
    const { logout } = useFrappeAuth();
    const [sessionId, setSessionId] = useState(localStorage.getItem('session_id'));
    const [fullScreen, setFullScreen] = useState(false);
    const [theme, setTheme] = useState({
        dataNavLayout: 'vertical',
        dataVerticalStyle: 'closed',
        dataNavStyle: 'menu-click',
        toggled: '',
        class: 'light',
    });

    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [notificationCount, setNotificationCount] = useState(0);
    const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
    const [isDropdownVisible, setDropdownVisible] = useState(false);
    const [UserImage, setUserImage] = useState(ProfilePic);
    const [username, setUsername] = useState('');

    const carpenterrole = localStorage.getItem('carpenterrole');
    const roles = JSON.parse(localStorage.getItem('user_roles') || '[]');
    const isAdmin = carpenterrole === "Admin" || roles.includes("Admin") || roles.includes("Administrator");
    const isCustomer = carpenterrole === "Customer";

    // Determine profile URL based on role
    const profileUrl = isCustomer ? '/profile-setting' : 
                     (isAdmin || roles.includes("Administrator")) ? '/admin-profile' : null;

    const toggleDropdown = () => setDropdownOpen(!dropdownOpen);
    const handleDropdownToggle = () => setDropdownVisible(prev => !prev);
    const handleOpenSearchModal = () => setIsSearchModalOpen(true);
    const handleCloseSearchModal = () => setIsSearchModalOpen(false);

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

    // Handle logout when new session is detected
    const handleLogout = () => {
        localStorage.clear();
        logout();
        window.location.href = '/'; // Redirect to login page
    };

    // Refresh user data
    const refreshUserData = async () => {
        try {
            const userResponse = await axios.get(`/api/method/frappe.auth.get_logged_user`);
            const userdata = await axios.get(`/api/resource/User/${userResponse.data.message}`);
            setUsername(userdata.data.data.full_name || "");
            setUserImage(userdata.data.data.user_image || ProfilePic);
            
            // Update session ID if it's a new login
            const currentSessionId = localStorage.getItem('session_id');
            if (!currentSessionId) {
                const newSessionId = Math.random().toString(36).substring(2, 15);
                localStorage.setItem('session_id', newSessionId);
                setSessionId(newSessionId);
            }
        } catch (error) {
            console.error("Error fetching user data:", error);
            handleLogout();
        }
    };

    useEffect(() => {
        document.addEventListener('fullscreenchange', handleFullscreenChange);
        return () => {
            document.removeEventListener('fullscreenchange', handleFullscreenChange);
        };
    }, []);

    useEffect(() => {
        // Set up session management
        const currentSessionId = localStorage.getItem('session_id');
        if (!currentSessionId) {
            const newSessionId = Math.random().toString(36).substring(2, 15);
            localStorage.setItem('session_id', newSessionId);
            setSessionId(newSessionId);
        }

        // Listen for storage changes (other tabs)
        const handleStorageChange = (event: StorageEvent) => {
            if (event.key === 'session_id' && event.newValue !== sessionId) {
                // Only handle if the change came from localStorage (same browser)
                if (event.storageArea === localStorage) {
                    alert("Your session has ended because a new login was detected in another tab.");
                    handleLogout();
                }
            }
            
            // Refresh user data when user-related storage changes
            if (event.key === 'user_id' || event.key === 'user_roles' || event.key === 'carpenterrole') {
                refreshUserData();
            }
        };

        window.addEventListener('storage', handleStorageChange);
        
        // Also listen for changes in the current tab
        const intervalId = setInterval(() => {
            const currentSessionId = localStorage.getItem('session_id');
            if (currentSessionId !== sessionId) {
                alert("Your session has ended because a new login was detected.");
                handleLogout();
            }
        }, 1000); // Check every second

        return () => {
            window.removeEventListener('storage', handleStorageChange);
            clearInterval(intervalId);
        };
    }, [sessionId]);

    useEffect(() => {
        refreshUserData();
    }, []);

    useEffect(() => {
        const root = document.documentElement;
        root.style.setProperty('--data-nav-layout', theme.dataNavLayout);
        root.style.setProperty('--data-vertical-style', theme.dataVerticalStyle);
        root.style.setProperty('--data-nav-style', theme.dataNavStyle);
        root.style.setProperty('--data-toggled', theme.toggled);
        root.style.setProperty('--data-class', theme.class);

        const sidemenu: any = document.querySelector(".side-menu");
        const appHeader: any = document.querySelector(".app-header");
        if (sidemenu) {
            const sidebarWidth = isSidebarActive ? '5rem' : '15rem';
            sidemenu.style.width = sidebarWidth;
            if (appHeader) {
                appHeader.style.paddingLeft = sidebarWidth;
            }
        }
    }, [theme, isSidebarActive]);

    const ToggleDark = () => {
        const newClass = theme.class === 'dark' ? 'light' : 'dark';
        const newTheme = {
            ...theme,
            class: newClass,
            dataHeaderStyles: newClass,
            dataMenuStyles: theme.dataNavLayout === 'horizontal' ? newClass : "dark"
        };

        setTheme(newTheme);

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
                                        <IconX className="text-black" />
                                    ) : (
                                        <IconAlignLeft className="text-black" />
                                    )}
                                </Link>
                            </div>
                        </div>

                        <div className="header-content-right flex items-center ">
                            <div className="header-element py-[1rem] md:px-[0.65rem] px-2 header-search">
                                <button type="button" onClick={handleOpenSearchModal} className="inline-flex items-center rounded-full">
                                    <i className="bx bx-search-alt-2 header-link-icon"></i>
                                </button>
                            </div>

                            <div className="header-element py-[1rem] md:px-[0.65rem] px-2">
                                <button className="header-btn header-btn-search" onClick={toggleDropdown}>
                                    <div className="notification-icon-container relative">
                                        <i className="bx bx-bell header-link-icon" style={{ color: 'black' }}></i>
                                        {notificationCount > 0 && (
                                            <span className="flex absolute h-5 w-5 -top-[0.25rem] end-0 -me-[0.6rem]">
                                                <span className="animate-slow-ping absolute inline-flex h-full w-full rounded-full bg-[var(--bg-secondary)] opacity-75"></span>
                                                <span className="relative inline-flex justify-center items-center rounded-full h-[14.7px] w-[14px] bg-[var(--secondaries)] text-[0.625rem] text-white">
                                                    {notificationCount}
                                                </span>
                                            </span>
                                        )}
                                    </div>
                                </button>
                                <NotificationDropdown
                                    isOpen={dropdownOpen}
                                    toggleDropdown={toggleDropdown}
                                    onNotificationCountChange={setNotificationCount}
                                />
                            </div>

                            <div className="header-element py-[1rem] md:px-[0.65rem] px-2">
                                <button className="header-btn" onClick={toggleFullScreen}>
                                    <i className={`header-link-icon bx ${fullScreen ? 'bx-exit-fullscreen' : 'bx-fullscreen'}`}></i>
                                </button>
                            </div>

                            <div className="header-element py-[1rem] md:px-[0.65rem] px-2">
                                <button
                                    id="dropdown-profile"
                                    type="button"
                                    className="hs-dropdown-toggle ti-dropdown-toggle flex-shrink-0 !gap-2 !p-0 sm:me-2 !rounded-full !shadow-none text-xs !border-0"
                                    onClick={handleDropdownToggle}
                                >
                                    <img className="inline-block rounded-full w-[30px] h-[30px]" src={UserImage} width="32" height="32" alt="User" />
                                </button>
                                <div className="md:block hidden dropdown-profile cursor-pointer" onClick={handleDropdownToggle}>
                                    <p className="font-semibold mb-0 pt-3 leading-none text-black text-[0.813rem]">{username}</p>
                                </div>
                                <div
                                    className={`hs-dropdown-menu main-header-dropdown ti-dropdown-menu bg-white mt-3 fixed top-12 right-4 border-0 w-[10rem] p-0 pt-0 overflow-hidden header-profile-dropdown dropdown-menu-end ${isDropdownVisible ? '' : 'hidden'}`}
                                    aria-labelledby="dropdown-profile"
                                >
                                    <ul className="text-defaulttextcolor font-medium">
                                        {profileUrl && (
                                            <li className="user-profile-list hover:bg-[var(--bg-primary)] hover:text-[var(--primaries)]">
                                                <a className="w-full ti-dropdown-item !text-[0.8125rem] !p-[0.65rem]" href={profileUrl}>
                                                    <i className="ti ti-user-circle text-[1.125rem] me-2 opacity-[0.7]"></i>Profile
                                                </a>
                                            </li>
                                        )}
                                        <li className="user-profile-list hover:bg-[var(--bg-primary)] hover:text-[var(--primaries)]">
                                            <a
                                                className="w-full ti-dropdown-item !text-[0.8125rem] !p-[0.65rem]"
                                                href="/"
                                                onClick={handleLogout}
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
            {isSearchModalOpen && (
                <>
                    <div className="fixed inset-0 bg-black bg-opacity-40 z-[9998]"></div>
                    <div className="fixed inset-0 z-[9999] flex justify-center items-start pt-24">
                        <Modalsearch isOpen={true} onClose={handleCloseSearchModal} />
                    </div>
                </>
            )}
        </Fragment>
    );
};

export default Header;