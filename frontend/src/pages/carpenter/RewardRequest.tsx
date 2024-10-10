import '../../assets/css/style.css';
import '../../assets/css/pages/admindashboard.css';
import Pageheader from '../../components/common/pageheader/pageheader';
import TableComponent from '../../components/ui/tables/tablecompnent';
import TableBoxComponent from '../../components/ui/tables/tableboxheader';
import React, { Fragment, useState, useEffect } from "react";
import RedeemPointAlert from '../../components/ui/models/RedeemPoints';
import SuccessAlert from '../../components/ui/alerts/SuccessAlert';
import axios from 'axios';

interface Transaction {
    name: string;
    redeemed_points?: string;
    received_date?: string;
    received_time?: string;
    approved_on?: string;
    approve_time?: string;
    request_status?: string;
}

const RedeemRequest: React.FC = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(5);
    const [transactionData, setTransactionData] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [userData, setUserData] = useState<any>(null);
    const [currentPoints, setCurrentPoints] = useState<string | null>(null);
    const [minPoints, setMinPoints] = useState<number | null>(null);
    const [maxPoints, setMaxPoints] = useState<number | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [pointredeem, setPointRedeem] = useState<string>("");
    const [customerId, setCustomerId] = useState<string>('');
    const [showSuccessAlert, setShowSuccessAlert] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [fromDate, setFromDate] = useState<Date | null>(null);
    const [toDate, setToDate] = useState<Date | null>(null);

    useEffect(() => {
        if (showSuccessAlert) {
            const timer = setTimeout(() => setShowSuccessAlert(false), 3000); // Hide alert after 3 seconds
            return () => clearTimeout(timer);
        }
    }, [showSuccessAlert]);

    const fetchUserData = async () => {
        try {
            const response = await axios.get(`/api/method/frappe.auth.get_logged_user`);
            console.log("Logged user data:", response);
            setUserData(response.data.message);
        } catch (error) {
            console.error("Error fetching user data:", error);
        }
    };

    const fetchCarpenterDetails = async () => {
        try {
            const response = await axios.get(`/api/method/reward_management.api.carpenter_master.get_customer_details`, {

            });
            console.log("Carpenter details:", response);
            const points = response.data.message.current_points || '0';
            const customer_id = response.data.message.name || '';
            setCurrentPoints(points);
            setCustomerId(customer_id);
        } catch (error) {
            console.error("Error fetching carpenter details:", error);
        }
    };

    const fetchMinMaxPoints = async () => {
        try {
            const response = await axios.get(`/api/method/reward_management.api.points_setup.get_redeem_points`, {

            });
            console.log("Min and Max points:", response);
            const { minimum_points, maximum_points } = response.data.message;
            setMinPoints(minimum_points || 0);
            setMaxPoints(maximum_points || 0);
        } catch (error) {
            console.error("Error fetching min and max points:", error);
        }
    };

    const fetchTransactionData = async () => {
        try {
            const response = await axios.get(`/api/method/reward_management.api.redeem_request_data.get_redeem_request_details`, {
            });
            console.log("Redeem Request table data:", response);
            const RedeemRequestData = response.data.message.message;

            if (Array.isArray(RedeemRequestData)) {
                setTransactionData(RedeemRequestData);
            } else {
                setError("Unexpected response format");
            }

            setLoading(false);
        } catch (error) {
            setError("Error fetching data");
            setLoading(false);
        }
    };

    useEffect(() => {
        document.title='Reward Request';
        fetchUserData();
        fetchCarpenterDetails();
        fetchMinMaxPoints();
        fetchTransactionData();
    }, []);

    const totalPages = Math.ceil((transactionData.length || 0) / itemsPerPage);

    const handlePrevPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    const handleNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };

    const handlePageChange = (pageNumber: number) => {
        setCurrentPage(pageNumber);
    };

    const handleSearch = (value: string) => {
        setSearchQuery(value); 
        setCurrentPage(1);
        console.log("Search value:", value);
    };

    const handleDateFilter = (from: Date | null, to: Date | null) => {
        setFromDate(from);
        setToDate(to);
        setCurrentPage(1);
    };



    const handleAddRedeemRequestClick = () => {
        setIsModalOpen(true);
        console.log("Redeem Now button clicked");
    };

    const handleModalClose = () => {
        setIsModalOpen(false);
    };

    const handlePointCollect = async () => {
        if (!customerId || !pointredeem) {
            console.error("Customer ID or redeem points are not available.");
            return;
        }

        const redeemedPoints = parseInt(pointredeem, 10);

        if (isNaN(redeemedPoints)) {
            console.error("Invalid points value:", pointredeem);
            return;
        }

        // Check if redeemedPoints is within the minPoints and maxPoints range
        if (minPoints !== null && maxPoints !== null) {
            if (redeemedPoints < minPoints) {
                alert(`The redeemed points cannot be less than the minimum required points: ${minPoints}`);
                setPointRedeem(''); // Clear the input field
                return;
            }
            if (redeemedPoints > maxPoints) {
                alert(`The redeemed points cannot be more than the maximum allowed points: ${maxPoints}`);
                setPointRedeem(''); // Clear the input field
                return;
            }
        }

        console.log("Data being sent:", {
            customer_id: customerId,
            redeemed_points: redeemedPoints,
        });

        try {
            const response = await axios.post(`/api/method/reward_management.api.redeem_request.create_redeem_request`, {
                customer_id: customerId,
                redeemed_points: redeemedPoints,
            });
            console.log("Redeem request successful:", response.data);
            setIsModalOpen(false);
            setShowSuccessAlert(true);  // Show success alert
            setPointRedeem(''); // Clear the input field after a successful request
        } catch (error) {
            console.error("Error creating redeem request:", error);
        }
    };

    const formatDate = (dateString: string) => {
        const [day, month, year] = dateString.split('-');
        return `${day}-${month}-${year}`;
    };

    const parseDateString = (dateString: string): Date | null => {
        if (typeof dateString !== 'string') {
            console.error("Expected a string, but received:", dateString);
            return null;
        }
        const parts = dateString.split('-');
        if (parts.length !== 3) {
            console.error("Invalid date format:", dateString);
            return null;
        }
        const day = parseInt(parts[0], 10);
        const month = parseInt(parts[1], 10) - 1; 
        const year = parseInt(parts[2], 10);
        return new Date(year, month, day);
    };


    const formattedRedeemRequestData = Array.isArray(transactionData) ? transactionData.map(transaction => ({
        ...transaction,
        received_date: transaction.received_date ? formatDate(transaction.received_date) : '',
    })) : [];

    const filteredData = formattedRedeemRequestData.filter(transactionData => {
        const query = searchQuery.toLowerCase();
        
        // Parse received_date and approved_on for filtering
        const receivedDateString = transactionData.received_date;
        const isReceivedDateValid = typeof receivedDateString === 'string' && receivedDateString.trim() !== '';
        const receivedDate = isReceivedDateValid ? parseDateString(receivedDateString) : null;
    
        const approvedDateString = transactionData.approved_on;
        const isApprovedDateValid = typeof approvedDateString === 'string' && approvedDateString.trim() !== '';
        const approvedDate = isApprovedDateValid ? parseDateString(approvedDateString) : null;
    
        // Check if receivedDate falls within the specified date range
        // Check if the announcement date is within the selected date range
        const isWithinDateRange = ((!fromDate || (receivedDate && receivedDate >= fromDate)) &&
                                  (!toDate || (receivedDate && receivedDate <= toDate)) || (!fromDate || (approvedDate && approvedDate >= fromDate)) &&
                                  (!toDate || (approvedDate && approvedDate <= toDate)));
    
        // Add date filtering conditions to the return statement
        return (
            isWithinDateRange &&
            (
                (transactionData.name && transactionData.name.toLowerCase().includes(query)) ||
                (transactionData.received_time && transactionData.received_time.toString().toLowerCase().includes(query)) ||
                (transactionData.redeemed_points !== undefined && transactionData.redeemed_points.toString().toLowerCase().includes(query)) ||
                (transactionData.request_status !== undefined && transactionData.request_status.toString().toLowerCase().includes(query)) ||
                (transactionData.approve_time && transactionData.approve_time.toLowerCase().includes(query))
            )
        );
    });
    


    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <Fragment>
              <Pageheader 
                currentpage={"Redeem Request"} 
                activepage={"/redeem-request"} 
                // mainpage={"/redeem-request"} 
                activepagename="Redeem Request"
                // mainpagename="Redeem Request"
            />
            {/* <Pageheader currentpage="Redeem Request" activepage="Redeem Request" mainpage="Redeem Request" /> */}

            <div className="grid grid-cols-12 gap-x-6 bg-white mt-5 rounded-lg shadow-lg">
                <div className="xl:col-span-12 col-span-12">
                    <div className="box">
                        <TableBoxComponent
                            title="Redeem Requests"
                            onSearch={handleSearch}
                            onAddButtonClick={handleAddRedeemRequestClick}
                            buttonText="Redeem Now"
                            showButton={true}
                            showFromDate={true}
                            showToDate={true}
                            onDateFilter={handleDateFilter}
                        />

                        <div className="box-body m-5">
                            <TableComponent<Transaction>
                                columns={[
                                    { header: 'Request ID', accessor: 'name' },
                                    { header: 'Redeem Point Request', accessor: 'redeemed_points' },
                                    {
                                        header: 'Redeem Request Date',
                                        accessor: 'received_date',
                                    },
                                    {
                                        header: 'Redeem Request Time',
                                        accessor: 'received_time',
                                    },
                                    {
                                        header: 'Action',
                                        accessor: 'request_status',
                                    },
                                    { header: 'Approve Date', accessor: 'approved_on' },
                                    { header: 'Approve Time', accessor: 'approve_time' },
                                ]}
                                data={filteredData || []}
                                currentPage={currentPage}
                                itemsPerPage={itemsPerPage}
                                handlePrevPage={handlePrevPage}
                                handleNextPage={handleNextPage}
                                handlePageChange={handlePageChange}
                                showProductQR={false}
                                showEdit={false}
                                showDelete={false}
                                editHeader='Action'
                                columnStyles={{
                                    'Request ID': 'text-[var(--primaries)] font-semibold',
                                }}
                            />
                        </div>
                    </div>
                </div>
            </div>

            {isModalOpen && (
                <RedeemPointAlert
                    pointtitle="Redeem Points"
                    availablepoints={`Available Points: ${currentPoints}`}
                    minpoints={`${minPoints}`}
                    maxpoints={`${maxPoints}`}
                    showMinpoints={true}
                    onPointClose={handleModalClose}
                    onPointCollect={handlePointCollect}
                    showPointCollectButton={true}
                    collectButtonLabel="Submit"
                    pointValue={pointredeem}
                    onPointValueChange={(e) => setPointRedeem(e.target.value)}
                />
            )}
            {showSuccessAlert && <SuccessAlert
                showButton={false}
                message="Redeem Request has been sent to the admin successfully!" onClose={function (): void {
                    throw new Error('Function not implemented.');
                }} onCancel={function (): void {
                    throw new Error('Function not implemented.');
                }} />}

        </Fragment>
    );
}

export default RedeemRequest;
