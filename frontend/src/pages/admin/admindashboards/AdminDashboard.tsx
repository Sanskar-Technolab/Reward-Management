import '../../../assets/css/style.css';
import '../../../assets/css/pages/admindashboard.css';
import React, { Fragment, useState, useEffect } from "react";
import { useFrappeGetCall } from 'frappe-react-sdk';

interface Carpenter {
    name: string;
    full_name: string;
    mobile_number: string;
    city: string;
    total_points: number;
}

const AdminDashboard: React.FC = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(5);

    const { data: productsRes } = useFrappeGetCall('reward_management.api.admin_dashboards_cards.total_product');
    const { data: redemptionsRes } = useFrappeGetCall('reward_management.api.admin_dashboards_cards.count_redemptions');
    const { data: pendingRes } = useFrappeGetCall('reward_management.api.admin_dashboards_cards.count_redeem_request');
    const { data: qrPointsRes } = useFrappeGetCall('reward_management.api.admin_dashboards_cards.total_points_of_qr_code');
    const { data: pointsRes } = useFrappeGetCall('reward_management.api.admin_dashboards_cards.get_total_points_data');
    const { data: carpentersRes } = useFrappeGetCall('reward_management.api.admin_dashboards_cards.count_total_customers');
    const { data: top10CustomersRes } = useFrappeGetCall('reward_management.api.admin_dashboards_cards.top_ten_customers');

    const [productCount, setProductCount] = useState<number>(0);
    const [redemptionsCount, setRedemptionsCount] = useState<number>(0);
    const [pendingRedeemptionCount, setPendingRedeemptionCount] = useState<number>(0);
    const [totalGeneratedQrPoint, setTotalGeneratedQrPoint] = useState<number>(0);
    const [countTotalScannedPoint, setCountTotalScannedPoint] = useState<number>(0);
    const [countTotalRedeemedpoints, setCountTotalRedeemedpoints] = useState<number>(0);
    const [countTotalAvailablePoints, setCountTotalAvailablePoints] = useState<number>(0);
    const [countTotalRegisteredCarpenter, setCountTotalRegisteredCarpenter] = useState<number>(0);
    const [top10Customers, setTop10Customers] = useState<Carpenter[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        document.title = 'Admin Dashboard';
        
        // Set all the dashboard card values
        if (productsRes) setProductCount(productsRes.message || 0);
        if (redemptionsRes) setRedemptionsCount(redemptionsRes.message || 0);
        if (pendingRes) setPendingRedeemptionCount(pendingRes.message || 0);
        if (qrPointsRes) setTotalGeneratedQrPoint(qrPointsRes.message?.total_points || 0);
        if (pointsRes) {
            const pointsData = pointsRes.message || {};
            setCountTotalScannedPoint(pointsData.total_points || 0);
            setCountTotalRedeemedpoints(pointsData.total_redeem_points || 0);
            setCountTotalAvailablePoints(pointsData.total_available_points || 0);
        }
        if (carpentersRes) setCountTotalRegisteredCarpenter(carpentersRes.message || 0);

        // Handle top 10 customers data
        if (top10CustomersRes) {
            try {
                const response = top10CustomersRes.message;
                if (response && response.success && response.data) {
                    const customers = response.data.map((customer: any) => ({
                        name: customer.name || '',
                        full_name: customer.full_name || '',
                        mobile_number: customer.mobile_number || '',
                        city: customer.city || '',
                        total_points: customer.total_points || 0
                    }));
                    setTop10Customers(customers);
                } else {
                    setTop10Customers([]);
                }
            } catch (error) {
                console.log("Error processing top customers data:", error);
                setTop10Customers([]);
            } finally {
                setLoading(false);
            }
        }
    }, [productsRes, redemptionsRes, pendingRes, qrPointsRes, pointsRes, carpentersRes, top10CustomersRes]);

    // Pagination Logic
    const totalItems = top10Customers.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const currentItems = top10Customers.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    const handlePrevPage = () => currentPage > 1 && setCurrentPage(currentPage - 1);
    const handleNextPage = () => currentPage < totalPages && setCurrentPage(currentPage + 1);
    const handlePageChange = (pageNumber: number) => {
        if (pageNumber >= 1 && pageNumber <= totalPages) {
            setCurrentPage(pageNumber);
        }
    };

    return (
        <Fragment>
            {/* Heading Section */}
            <div className="md:flex block items-center justify-between mt-[1.5rem] page-header-breadcrumb">
                <div>
                    <p className="font-semibold text-[1.125rem] text-defaulttextcolor dark:text-defaulttextcolor/70 !mb-0">
                        Admin Dashboard
                    </p>
                </div>
            </div>

            {/* Number Card Section */}
            <div className="grid grid-cols-12 gap-x-6 mb-4">
                <div className="xxl:col-span-12 xl:col-span-12 lg:col-span-12 col-span-12">
                    <div className="grid grid-cols-12 gap-x-6">
                        <div className="xl:col-span-12 col-span-12">
                            <div className="">
                                <div className="grid grid-cols-12 xl:gap-y-0 gap-4">
                                    {/* Dashboard Cards */}
                                    {[{
                                        id: 'totalgeneratedPoint',
                                        value: totalGeneratedQrPoint,
                                        label: 'Total Generated Points'
                                    }, {
                                        id: 'totalscannedPoints',
                                        value: countTotalScannedPoint,
                                        label: 'Total Points Scanned'
                                    }, {
                                        id: 'totalredeemedPoint',
                                        value: countTotalRedeemedpoints,
                                        label: 'Total Points Redeemed'
                                    }, {
                                        id: 'totalrequestPending',
                                        value: pendingRedeemptionCount,
                                        label: 'Total Redemption Request Pending'
                                    }, {
                                        id: 'totalavailablePoints',
                                        value: countTotalAvailablePoints,
                                        label: 'Total Available Points'
                                    }, {
                                        id: 'registeredCarpenter',
                                        value: countTotalRegisteredCarpenter,
                                        label: 'Registered Customer'
                                    }, {
                                        id: 'totalRedeemptions',
                                        value: redemptionsCount,
                                        label: 'Total Redeemptions'
                                    }, {
                                        id: 'toatlProducts',
                                        value: productCount,
                                        label: 'Total Product'
                                    }].map((card, index) => (
                                        <div key={index} className="category-link xxl:col-span-3 xl:col-span-3 lg:col-span-6 md:col-span-6 sm:col-span-6 col-span-12 p-4 bg-white shadow-lg rounded-lg transition-colors duration-300 hover:bg-purple-50 dark:bg-gray-800 dark:hover:bg-purple-900 mt-5">
                                            <div className="flex flex-row items-start mb-4">
                                                <span className="avatar avatar-lg bg-[var(--primaries)] text-white inline-flex items-center justify-center w-12 h-12 rounded-sm mb-2 mr-3">
                                                    <i className="ti ti-wallet text-[1.25rem]"></i>
                                                </span>
                                                <div className="flex flex-col items-start">
                                                    <h5 className="text-[1.125rem] font-semibold mb-2" id={card.id}>{card.value}</h5>
                                                    <div className="flex flex-row text-[1rem] text-[#8c9097] dark:text-white/50">
                                                        <div>{card.label}</div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        
            {/* Top 10 Customers Table */}
            <div className="grid grid-cols-12 gap-x-6 bg-white mt-5 rounded-lg shadow-lg">
                <div className="xl:col-span-12 col-span-12">
                    <div className="">
                        <div className="box-header flex justify-between items-center p-4 border-b">
                            <div className="box-title text-[.9375rem] font-bold text-defaulttextcolor">
                                Top 10 Customer
                            </div>
                        </div>
                        <div className="box-body m-5">
                            <div className="table-responsive pt-2">
                                <table className="table whitespace-nowrap min-w-full">
                                    <thead>
                                        <tr>
                                            <th scope="col" className="text-start p-3 text-[.9375rem] text-defaulttextcolor font-semibold border border-gray-300">S.No</th>
                                            <th scope="col" className="text-start p-3 text-[.9375rem] text-defaulttextcolor font-semibold border border-gray-300">Customer ID</th>
                                            <th scope="col" className="text-start p-3 text-[.9375rem] text-defaulttextcolor font-semibold border border-gray-300">Customer Name</th>
                                            <th scope="col" className="text-start p-3 text-[.9375rem] text-defaulttextcolor font-semibold border border-gray-300">Mobile Number</th>
                                            <th scope="col" className="text-start p-3 text-[.9375rem] text-defaulttextcolor font-semibold border border-gray-300">City</th>
                                            <th scope="col" className="text-start p-3 text-[.9375rem] text-defaulttextcolor font-semibold border border-gray-300">Total Points</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {loading ? (
                                            <tr>
                                                <td colSpan={6} className="text-center p-3 border border-gray-300">Loading...</td>
                                            </tr>
                                        ) : currentItems.length > 0 ? (
                                            currentItems.map((customer, index) => (
                                                <tr key={index}>
                                                    <td className="text-start p-3 border border-gray-300 text-defaultsize font-medium text-defaulttextcolor">
                                                        {(currentPage - 1) * itemsPerPage + index + 1}
                                                    </td>
                                                    <td className="text-start p-3 border border-gray-300 text-primary text-defaultsize font-semibold">
                                                        {customer.name}
                                                    </td>
                                                    <td className="text-start p-3 border border-gray-300 text-defaultsize font-medium text-defaulttextcolor">
                                                        {customer.full_name}
                                                    </td>
                                                    <td className="text-start p-3 border border-gray-300 text-defaultsize font-medium text-defaulttextcolor">
                                                        {customer.mobile_number}
                                                    </td>
                                                    <td className="text-start p-3 border border-gray-300 text-defaultsize font-medium text-defaulttextcolor">
                                                        {customer.city}
                                                    </td>
                                                    <td className="text-start p-3 border border-gray-300 text-defaultsize font-medium text-defaulttextcolor">
                                                        {customer.total_points}
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan={6} className="text-center p-3 border border-gray-300">
                                                    No customers found
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                                {!loading && totalPages > 1 && (
                                    <div className="box-footer p-4 border-t">
                                        <div className="sm:flex items-center">
                                            <div className="text-defaulttextcolor dark:text-defaulttextcolor/70 font-normal text-defaultsize">
                                                Showing {currentItems.length} of {top10Customers.length} Entries <i className="bi bi-arrow-right ms-2 font-semibold"></i>
                                            </div>
                                            <div className="ms-auto">
                                                <nav aria-label="Page navigation" className="pagination-style-4">
                                                    <ul className="ti-pagination flex items-center px-3 mb-0">
                                                        <li className="page-item px-2">
                                                            <button
                                                                className="page-link"
                                                                onClick={handlePrevPage}
                                                                disabled={currentPage === 1}
                                                            >
                                                                Prev
                                                            </button>
                                                        </li>
                                                        {Array.from({ length: totalPages }, (_, index) => (
                                                            <li className="page-item px-2" key={index + 1}>
                                                                <button
                                                                    className={`page-link px-2 rounded-md ${currentPage === index + 1 ? 'text-white bg-primary' : 'bg-gray-200'}`}
                                                                    onClick={() => handlePageChange(index + 1)}
                                                                >
                                                                    {index + 1}
                                                                </button>
                                                            </li>
                                                        ))}
                                                        <li className="page-item px-2">
                                                            <button
                                                                className="page-link"
                                                                onClick={handleNextPage}
                                                                disabled={currentPage === totalPages}
                                                            >
                                                                Next
                                                            </button>
                                                        </li>
                                                    </ul>
                                                </nav>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>  
        </Fragment>
    );
};

export default AdminDashboard;