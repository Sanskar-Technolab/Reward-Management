import { Fragment, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Pageheader from '../../components/common/pageheader/pageheader';
import { TfiAnnouncement } from "react-icons/tfi";
import { useFrappeGetDocList } from 'frappe-react-sdk';
import '../../assets/css/header.css';
import '../../assets/css/style.css';

const Announcements = () => {
    // Fetch Announcements from the doctype
    const { data, error, isLoading } = useFrappeGetDocList<Announcement>('Announcements', {
        fields: ['name', 'title', 'subject', 'published_on', 'end_date'],
        limit: 10, // Limit to 10 for testing
    });

    const [notifications, setNotifications] = useState<Announcement[]>([]);

    // Fetch and process data
    useEffect(() => {
        document.title='Announcements';
        if (data) {
            console.log("Fetched announcement data:", data);

            const announcementData: Announcement[] = data.map((notif: Announcement) => {
                const publishedDate = new Date(notif.published_on).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit'
                });

                const endDate = notif.end_date ? new Date(notif.end_date).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit'
                }) : 'N/A';

                return {
                    ...notif,
                    publishedDate,
                    endDate
                };
            });

            setNotifications(announcementData); // Store the announcements in state
        }
    }, [data]);

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error loading announcements</div>;

    return (
        <Fragment>
              <Pageheader 
                currentpage={"Announcement"} 
                activepage={"/customer-announcement"} 
                // mainpage={"/customer-announcement"} 
                activepagename='Announcement' 
                // mainpagename='Announcement' 
            />
            {/* <Pageheader currentpage="Announcements" activepage="Pages" mainpage="Announcements" /> */}
            <div className="container">
                <div className="grid grid-cols-12 !mx-auto">
                    <div className="xxl:col-span-2 col-span-12"></div>
                    <div className="xxl:col-span-8 xl:col-span-12 lg:col-span-12 md:col-span-12 sm:col-span-12 col-span-12">
                        <div className="notification-list">
                            {notifications.length > 0 ? (
                                notifications.map((notification) => (
                                    <div key={notification.name} className="box un-read">
                                        <div className="box-body !p-4">
                                            <Link to="#">
                                                <div className="flex items-start mt-0 flex-wrap">
                                                    <div className="inline-flex justify-center items-center w-[2.5rem] h-[2.5rem] leading-[2.5rem] text-[0.8rem] rounded-full">
                                                        <span className="avatar avatar-md online me-4 avatar-rounded rounded-full bg-primary/10 p-2">
                                                            <TfiAnnouncement className="text-md " />
                                                        </span>
                                                    </div>
                                                    <div className="flex-grow">
                                                        <div className="sm:flex items-center">
                                                            <div className="sm:mt-0">
                                                                <p className="mb-0 text-[1.3rem] text-primary font-semibold">
                                                                    {notification.title}
                                                                </p>
                                                                <p className="mb-0 text-defaulttextcolor text-sm dark:text-white/50">
                                                                    {notification.subject}
                                                                </p>
                                                                <span className="mb-0 block text-[#8c9097] dark:text-white/50 text-[0.75rem]">
                                                                    Published on: {notification.publishedDate}
                                                                </span>
                                                                <span className="mb-0 block text-primary dark:text-white/50 text-[0.75rem]">
                                                                    End date: {notification.endDate}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </Link>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div>No announcements available</div>
                            )}
                        </div>
                    </div>
                    <div className="xxl:col-span-2 col-span-12"></div>
                </div>
            </div>
        </Fragment>
    );
};

export default Announcements;
