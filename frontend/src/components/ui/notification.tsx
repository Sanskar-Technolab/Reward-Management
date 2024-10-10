import { useState, useEffect } from 'react';
import { TiGift, TiStar, TiUser, TiTick, TiTime } from 'react-icons/ti';
import '../../assets/css/header.css';
import '../../assets/css/style.css';
import { Link } from 'react-router-dom';
import { useFrappeGetCall } from 'frappe-react-sdk';
import axios from 'axios';

// Define the Notification type
interface Notification {
    id: string;
    color: string;
    avatarColor: string;
    icon: keyof typeof iconMap; 
    subjectHTML: string;
    email_contentHTML: string;
}

// Define props types
interface NotificationDropdownProps {
    isOpen: boolean;
    toggleDropdown: () => void;
    onNotificationCountChange: (count: number) => void;
}

const iconMap = {
    'ti-gift': TiGift,
    'ti-star': TiStar,
    'ti-user': TiUser,
    'ti-tick': TiTick,
    'ti-time': TiTime,
};

const NotificationDropdown: React.FC<NotificationDropdownProps> = ({ isOpen, toggleDropdown, onNotificationCountChange }) => {
    const { data, error, isLoading } = useFrappeGetCall('reward_management.api.admin_notifications.get_notifications_log');
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [notificationCount, setNotificationCount] = useState<number>(0);

    useEffect(() => {
        const fetchUserEmailAndInitScanner = async () => {
            try {
                const userResponse = await axios.get('/api/method/frappe.auth.get_logged_user');
                console.log("userData:", userResponse.data.message);
            } catch (err) {
                console.error("Error fetching user data:", err);
            }
        };

        fetchUserEmailAndInitScanner();
    }, []);

    useEffect(() => {
        if (isLoading) return; // Avoid processing while loading
        if (error) {
            console.error('Error fetching notifications:', error);
            return;
        }
        if (data?.message) {
            const notificationsArray = data.message;

            if (Array.isArray(notificationsArray)) {
                const transformedNotifications = notificationsArray.map((notification: any, index: number) => ({
                    id: notification.name || `${index + 1}`,
                    color: 'primary',
                    avatarColor: 'bg-primary',
                    icon: notification.icon || 'ti-user', // Fallback icon
                    subjectHTML: notification.subject || 'No Subject',
                    email_contentHTML: notification.email_content || 'No Content',
                }));

                setNotifications(transformedNotifications);
                setNotificationCount(transformedNotifications.length); // Update notification count
                onNotificationCountChange(transformedNotifications.length); // Update parent component
            } else {
                console.error('Unexpected data format:', notificationsArray);
            }
        }
    }, [data, error, isLoading]);

    const handleNotificationClose = (e: React.MouseEvent<HTMLButtonElement>, index: number) => {
        e.stopPropagation();
        const updatedNotifications = notifications.filter((_, i) => i !== index);
        setNotifications(updatedNotifications);
        setNotificationCount(updatedNotifications.length); // Update notification count after closing
        onNotificationCountChange(updatedNotifications.length); // Update parent component
    };

    if (isLoading) return <div></div>;
    if (error) return <div>Error loading notifications</div>;

    return (
        <div>
            {isOpen && (
                <div>
                    <div onClick={toggleDropdown} className="fixed inset-0 h-full w-full z-10"></div>
                    <div
                        className="main-header-dropdown !-mt-3 !p-0 hs-dropdown-menu ti-dropdown-menu bg-white !w-[22rem] border-0 border-defaultborder !m-0 block absolute right-2 rounded-md shadow-lg overflow-hidden z-20"
                        aria-labelledby="dropdown-notification"
                        style={{
                            position: 'fixed',
                            inset: '0px 0px auto auto',
                            margin: '0px',
                            transform: 'translate3d(-125px, 70px, 0px)',
                           
                        }}
                        data-popper-placement="bottom-end"
                    >
                        <div className="ti-dropdown-header top-0 sticky !m-0 !p-4 !bg-transparent flex justify-between items-center">
                            <p className="mb-0 text-[1.0625rem] text-defaulttextcolor font-semibold dark:text-[#8c9097] dark:text-white/50">
                                Notifications
                            </p>
                            <span className="text-xs py-[0.25rem/2] px-[0.45rem] rounded-sm bg-cyan-50 text-[var(--secondaries)] bg-[var(--bg-secondary)]" id="notification-data">
                                {notificationCount} unread
                            </span>
                        </div>
                        <div className='dropdown-divider'></div>
                        <div className='overflow-y-auto max-h-[400px]'>
                        <div className="pt-2">
                            {notifications.length > 0 ? (
                                notifications.map((notification, index) => {
                                    const Icon = iconMap[notification.icon] || TiGift; // Default icon if not found
                                    return (
                                        <div key={notification.id} className="flex items-center px-4 py-3 border-b hover:bg-gray-100 -mx-2">
                                            <span
                                                className="inline-flex justify-center items-center w-[2.5rem] h-[2.5rem] leading-[2.5rem] text-[0.8rem] rounded-full" 
                                                style={{ backgroundColor: `var(--${notification.avatarColor})` }}
                                            >
                                                <Icon
                                                    style={{ color: `var(--${notification.color})` }}
                                                    className="text-[1.2rem]"
                                                />
                                            </span>
                                            <div className="flex-1 mx-2">
                                                <p className="mb-0 text-defaulttextcolor dark:text-[#8c9097] dark:text-white/50 text-[0.8125rem] font-semibold">
                                                    <Link to="#">
                                                        <span dangerouslySetInnerHTML={{ __html: notification.subjectHTML }} />
                                                    </Link>
                                                    <br />
                                                    <span className="text-[#63676e] dark:text-white/50 font-normal text-[0.75rem] header-notification-text" dangerouslySetInnerHTML={{ __html: notification.email_contentHTML }} />
                                                </p>
                                            </div>
                                            <button
                                                onClick={(e) => handleNotificationClose(e, index)}
                                                className="text-gray-400 hover:text-gray-600 text-[1.3rem] font-normal"
                                                aria-label="Close notification"
                                            >
                                                &times;
                                            </button>
                                        </div>
                                    );
                                })
                            ) : (
                                <div className="px-4 py-3 text-center text-gray-500">No notifications</div>
                            )}
                        </div>
                        <div className="p-4">
                            <div className="grid">
                                <Link to='/notifications' className="ti-btn ti-btn-primary-full !m-0 w-full p-2">View All</Link>
                            </div>
                        </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default NotificationDropdown;
