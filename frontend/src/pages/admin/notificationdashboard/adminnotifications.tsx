import { Fragment, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Pageheader from '../../../components/common/pageheader/pageheader';
import { TiUser } from 'react-icons/ti';
import { useFrappeGetCall } from 'frappe-react-sdk';
import axios from 'axios';
import '../../../assets/css/header.css';
import '../../../assets/css/style.css';
import { Notyf } from "notyf";
import "notyf/notyf.min.css";
const iconMap = {
    'ti-user': TiUser,
};

interface NotificationData {
    name: string;
    subject: string;
    email_content: string;
    document_type: string;
    for_user: string;
    creation: string;
}

interface Notification {
    id: string;
    color: string;
    avatarColor: string;
    icon: keyof typeof iconMap; 
    subjectHTML: string;
    email_contentHTML: string;
    timestamp: string; 
    date: string;   
}

const NotificationsDashboard = () => {
    const { data, error, isLoading } = useFrappeGetCall('reward_management.api.admin_notifications.get_notifications_log');
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [notificationCount, setNotificationCount] = useState<number>(0);
    const notyf = new Notyf({
        position: {
            x: "right",
            y: "top",
        },
        duration: 5000,
    });

    useEffect(() => {
        const fetchUserEmailAndInitScanner = async () => {
            try {
                await axios.get('/api/method/frappe.auth.get_logged_user');
                // const userResponse = await axios.get('/api/method/frappe.auth.get_logged_user');
                // console.log("userData:", userResponse.data.message);
            } catch (err) {
                console.error("Error fetching user data:", err);
            }
        };

        fetchUserEmailAndInitScanner();
    }, []);

    useEffect(() => {
        document.title='Notifications';
        if (data && Array.isArray(data.message)) {
            // console.log("Fetched notifications data:", data.message);

            const notificationsData: Notification[] = data.message.map((notif: NotificationData) => {
                const creationDate = new Date(notif.creation);

                const day = String(creationDate.getDate()).padStart(2, '0');
                const month = String(creationDate.getMonth() + 1).padStart(2, '0'); 
                const year = creationDate.getFullYear();
    
                const date = `${day}/${month}/${year}`;  
                const time = creationDate.toLocaleTimeString('en-US', {
                    hour: '2-digit',
                    minute: '2-digit'
                });

                return {
                    id: notif.name,
                    color: 'primary',
                    avatarColor: 'bg-primary',
                    icon: 'ti-user',
                    subjectHTML: notif.subject,
                    email_contentHTML: notif.email_content,
                    timestamp: time, 
                    date: date,     
                };
            });
            
            setNotifications(notificationsData);
            setNotificationCount(notificationsData.length);
        }
    }, [data]);


    const markAsRead = async (notificationId:any) => {
        try {
            const response = await axios.put('/api/method/reward_management.api.admin_notifications.mark_notification_as_read', {
                name: notificationId,
                read: 1,
            });
            if (response.data.message.success === true) {

                notyf.success("Successfully marked as read.");

                setTimeout(() => {
                    window.location.reload();
                }, 2000); 
            } else {
                notyf.error(response.data.message.message);
            }

            
        } catch (err) {
            if (err.response && err.response.status === 403) {
                window.location.href = '/';
            } else {
                console.error("Error fetching user data:", err);
            }

            console.error('Error marking notification as read:', err);
        }
    };

    // const handleLinkClick = (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    //     const href = event.currentTarget.getAttribute('href');
    //     if (href) {
    //         event.preventDefault();
    //         window.location.href = href;
    //     }
    // };

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error loading notifications</div>;

    return (
        <Fragment>
              <Pageheader 
                currentpage={"Notifications"} 
                activepage={"/notifications"} 
                // mainpage={"/notifications"} 
                activepagename="Notifications"
                // mainpagename="Notifications "
            />
            {/* <Pageheader currentpage="Notifications" activepage="Pages" mainpage="Notifications" /> */}
            <div className="container">
                <div className="grid grid-cols-12 !mx-auto">
                    <div className="xxl:col-span-2 col-span-12"></div>
                    <div className="xxl:col-span-8 xl:col-span-12 lg:col-span-12 md:col-span-12 sm:col-span-12 col-span-12">
                        <div className="notification-list">
                            {notifications.length > 0 ? (
                                notifications.map((notification) => {
                                    const IconComponent = iconMap[notification.icon] || TiUser;
                                    return (
                                        <div key={notification.id} className="box un-read">
                                            <div className="box-body !p-4">
                                                <Link to="#">
                                                    <div className="flex items-start mt-0 flex-wrap">
                                                        <div className="inline-flex justify-center items-center w-[2.5rem] h-[2.5rem] leading-[2.5rem] text-[0.8rem] rounded-full">
                                                            <span className={`avatar avatar-md online me-4 avatar-rounded rounded-full`} style={{ backgroundColor: `var(--${notification.avatarColor})` }}>
                                                                <IconComponent className="text-2xl" />
                                                            </span>
                                                        </div>
                                                        {/* <div className="flex-grow">
                                                            <div className="sm:flex items-center">
                                                                <div className="sm:mt-0">
                                                                    <p className="mb-0 text-[.875rem] font-semibold">{notification.subjectHTML}</p>
                                                                    <p
                                                                        className="mb-0 text-[#8c9097] dark:text-white/50"
                                                                        dangerouslySetInnerHTML={{ __html: notification.email_contentHTML }}
                                                                    />
                                                                    <span className="mb-0 block text-[#8c9097] dark:text-white/50 text-[0.75rem]">{notification.timestamp}</span>
                                                                </div>
                                                                <div className="ms-auto">
                                                                    <span className="ltr:float-right rtl:float-left badge bg-light text-[#8c9097] dark:text-white/50 whitespace-nowrap">
                                                                        {notification.date}
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        </div> */}
                                                         <div className="flex-grow">
                                                        <div className="sm:flex items-center">
                                                            <div className="sm:mt-0">
                                                                <p className="mb-0 text-[.875rem] font-semibold text-primary">
                                                                    {notification.subjectHTML}
                                                                </p>
                                                                <p
                                                                    className="mb-0 text-[#8c9097] dark:text-white/50"
                                                                    dangerouslySetInnerHTML={{
                                                                        __html: notification.email_contentHTML,
                                                                    }}
                                                                />
                                                                <span className="mb-0 block text-primary dark:text-white/50 text-[0.75rem]">
                                                                    {notification.timestamp}
                                                                    <span className="px-2 ml-[2px] rounded-[4px] text-primary dark:text-white/50 whitespace-nowrap">
                                                                        {notification.date}
                                                                    </span>
                                                                </span>
                                                            </div>
                                                            <div className="ms-auto ">
                                                                {!notification.read && (
                                                                    <button
                                                                        className="ltr:float-right rtl:float-left badge px-2 py-1 rounded-[4px] bg-[#dedede] text-primary dark:text-white/50 whitespace-nowrap"
                                                                        onClick={() => markAsRead(notification.id)}
                                                                    >
                                                                        Mark as Read
                                                                    </button>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                    </div>
                                                </Link>
                                            </div>
                                        </div>
                                    );
                                })
                            ) : (
                                <div>No notifications available</div>
                            )}
                        </div>
                    </div>
                    <div className="xxl:col-span-2 col-span-12"></div>
                </div>
            </div>
        </Fragment>
    );
};

export default NotificationsDashboard;
