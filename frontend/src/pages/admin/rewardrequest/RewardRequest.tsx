import '../../../assets/css/style.css';
import '../../../assets/css/pages/admindashboard.css';
import Pageheader from '../../../components/common/pageheader/pageheader';
import TableComponent from '../../../components/ui/tables/tablecompnent';
import TableBoxComponent from '../../../components/ui/tables/tableboxheader';
import React, { Fragment, useState, useEffect } from "react";
import { useFrappeGetDocList } from 'frappe-react-sdk';
import { useNavigate } from 'react-router-dom';
import EditModalComponent from '../../../components/ui/models/RewardRequestEdit';
import axios from 'axios';
import SuccessAlert from '../../../components/ui/alerts/SuccessAlert';
import { Notyf } from 'notyf';
import "notyf/notyf.min.css";

interface RewardRequest {
    name: string;
    customer_id?: string;
    redeemed_points: string;
    current_point_status?: number;
    total_points?: string;
    transection_id?: string;
    request_status?: string;
    mobile_number?: string;
    received_date?: string;
    received_time?: string;
    amount?: number;
    approved_on?: string;
    approve_time?: string;
}

const notyf = new Notyf({
    duration: 3000,
    position: {
        x: 'right',
        y: 'top',
    },
    types: [
        {
            type: 'success',
            background: '#4caf50',
            icon: false,
        },
        {
            type: 'error',
            background: '#f44336',
            icon: false,
        },
    ],
});

// Utility function to format dates
const formatDate = (dateStr: string | undefined): string => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    const day = ('0' + date.getDate()).slice(-2);
    const month = ('0' + (date.getMonth() + 1)).slice(-2); 
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
};

const CarpenterRewardRequest: React.FC = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10); 
    const [selectedRewardRequest, setSelectedRewardRequest] = useState<RewardRequest | null>(null); 
    const [isModalOpen, setIsModalOpen] = useState(false);
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');
    const [showSuccessAlert, setShowSuccessAlert] = useState(false);
    const [fromDate, setFromDate] = useState<Date | null>(null);
    const [toDate, setToDate] = useState<Date | null>(null);
    const [amount, setAmount] = useState<string>(''); 
    const [alertMessage, setAlertMessage] = useState('');

    const { data: rewardrequestData } = useFrappeGetDocList<RewardRequest>('Redeem Request', {
        fields: ['name', 'customer_id', 'total_points', 'current_point_status', 'redeemed_points', 'received_date', 'received_time', 'request_status', 'approved_on', 'approve_time', 'transection_id', 'amount'],
         // limit_start: pageIndex * 10,
         limit: 0,
         orderBy: {
             field: 'creation',
             order: 'desc',
         }
    });

    const isApproved = selectedRewardRequest?.request_status === 'Approved';

     // Function to calculate the amount dynamically
     const calculateAmount = async (requestId: string) => {
        try {
            const response = await axios.post(`/api/method/reward_management.api.admin_redeem_request.calculate_amount`, { request_id: requestId });
            if (response.data) {
                // console.log("amount count-----", response);
                setAmount(response.data.message.amount); 
            } else {
                setAmount('');
                notyf.error(`Failed to fetch amount for request ID: ${requestId}`);
            }
        } catch (error) {
            console.error('Error fetching amount:', error);
            notyf.error(`An error occurred while calculating the amount. Please try again later.${error}`);
        }
    };
    useEffect(() => {
        document.title='Reward Request';
        if (selectedRewardRequest) {
            // Pass the request ID to calculate amount
            calculateAmount(selectedRewardRequest.name); 
        }
        if (showSuccessAlert) {
            const timer = setTimeout(() => {
                setShowSuccessAlert(false);
                window.location.reload(); 
            }, 3000); 
            return () => clearTimeout(timer);
        }
    }, [showSuccessAlert,selectedRewardRequest]);

    const formattedData = rewardrequestData?.map(request => ({
        ...request,
        received_date: formatDate(request.received_date),
        approved_on: formatDate(request.approved_on),
        
    }));

    // console.log("formattedData------->", formattedData);

    const parseDateString = (dateString: string): Date | null => {
        // console.log("Input dateString:", dateString); 
        if (typeof dateString !== 'string') {
            console.error("Expected a string, but received:", dateString);
            return null; 
        }
        //  splitting by '-'
        const parts = dateString.split('-'); 
        if (parts.length !== 3) {
            // console.error("Invalid date format:", dateString);
            return null; 
        }
        const day = parseInt(parts[0], 10);
        // Months are 0-based 
        const month = parseInt(parts[1], 10) - 1; 
        const year = parseInt(parts[2], 10);
        return new Date(year, month, day);
    };


    // Filter data based on search query
    const filteredData = formattedData?.filter(request => {
        const recivedDateString = request.received_date;
        const isDateValid = typeof recivedDateString === 'string' && recivedDateString.trim() !== '';
        const recivedDate = isDateValid ? parseDateString(recivedDateString) : null;
    
        // Check if the received date is within the selected date range
        const isWithinDateRange = (!fromDate || (recivedDate && recivedDate >= fromDate)) &&
                                  (!toDate || (recivedDate && recivedDate <= toDate));
    
        return (
            isWithinDateRange && 
            (request.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            request.customer_id?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (request.redeemed_points !== undefined && request.redeemed_points.toString().toLowerCase().includes(searchQuery)) ||
            (request.total_points !== undefined && request.total_points.toString().toLowerCase().includes(searchQuery)) ||
            (request.received_date !== undefined && request.received_date.toString().toLowerCase().includes(searchQuery)) ||
            (request.received_time !== undefined && request.received_time.toString().toLowerCase().includes(searchQuery)) ||
            (request.current_point_status !== undefined && request.current_point_status.toString().toLowerCase().includes(searchQuery)) ||
            (request.mobile_number !== undefined && request.mobile_number.toString().toLowerCase().includes(searchQuery)) ||
            request.request_status?.toLowerCase().includes(searchQuery.toLowerCase()))
        );
    });

    const totalPages = Math.ceil((filteredData?.length || 0) / itemsPerPage);

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
         // Update search query
        setSearchQuery(value);
        setCurrentPage(1);
        // console.log("Search value:", value);
        // Implement search logic here
    };
    const handleDateFilter = (from: Date | null, to: Date | null) => {
        setFromDate(from);
        setToDate(to);
        // Reset to the first page
        setCurrentPage(1);
    };

    const handleAddProductClick = () => {
        // console.log("Add Product button clicked");
        navigate('/redeem-history');
      
    };

    // handle edit modal----
    const handleEdit = (rewardRequest: RewardRequest) => {
        setSelectedRewardRequest(rewardRequest);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    }

    const handleSubmit = async () => {
        // console.log('Submit clicked');
        if (!selectedRewardRequest) return;
        // console.log('Transaction ID:', selectedRewardRequest.transection_id);

        // Get current date and time
        const now = new Date();
         // Format: YYYY-MM-DD
        const currentDate = now.toISOString().split('T')[0];
        // Format: HH:MM:SS
        const currentTime = now.toISOString().split('T')[1].split('.')[0]; 

        const data = {
            approved_on: currentDate,
            approve_time: currentTime,
            transaction_id: selectedRewardRequest.transection_id,
            amount: amount, 
            action: selectedRewardRequest.request_status,  
            request_id: selectedRewardRequest.name,
        };

        try {
            const response = await axios.post(`/api/method/reward_management.api.admin_redeem_request.update_redeem_request_status`, data);

            if (response.status === 200) {
                // console.log("Redeem Request updated successfully",response.data.message);

             
                setShowSuccessAlert(true);
                setAlertMessage(`${response.data.message.message}`);
                handleCloseModal();
                
            } else {
                console.error("Failed to update Redeem Request:", response.data);
                notyf.error(`Failed to update Redeem Request: ${response.data.message}`);
            }
        } catch (error) {
            console.error("Error:", error.message || error);
            notyf.error(`Failed to update Redeem Request: ${error}`);
        }
    };

    const handleCancel = () => {
        // console.log('Cancel clicked');
        setIsModalOpen(false); 
    }

  

    return (
        <Fragment>
              <Pageheader 
                currentpage={"Reward Request"} 
                // activepage={"/redeemption-request"} 
              
                // activepagename="Reward Request"
               
            />
           

            <div className="grid grid-cols-12 gap-x-6 bg-white mt-5 rounded-lg shadow-lg">
                <div className="xl:col-span-12 col-span-12">
                    <div className="">
                        <TableBoxComponent
                            title="Redeemption Requests"
                            onSearch={handleSearch}
                            onAddButtonClick={handleAddProductClick}
                            buttonText="View Redeemption History"
                            showButton={true} 
                            showFromDate={true}
                            showToDate={true}
                            onDateFilter={handleDateFilter}
                            icon="" 
                            buttonOnClick={handleAddProductClick} 
                        />

                        <div className="box-body m-5">
                            <TableComponent<RewardRequest>
                                columns={[
                                    { header: 'Request ID', accessor: 'name' },
                                    { header: 'Customer ID', accessor: 'customer_id' },
                                    { header: 'Total Points', accessor: 'total_points' },
                                    { header: 'Current Points', accessor: 'current_point_status' },
                                    { header: 'Redeem Request Points', accessor: 'redeemed_points' },
                                    { header: 'Request Received Date', accessor: 'received_date' },
                                    { header: 'Request Received Time', accessor: 'received_time' },
                                    { header: 'Action', accessor: 'request_status' },
                                ]}
                                data={filteredData || []}
                                currentPage={currentPage}
                                itemsPerPage={itemsPerPage}
                                handlePrevPage={handlePrevPage}
                                handleNextPage={handleNextPage}
                                handlePageChange={handlePageChange}
                                showProductQR={false}
                                showEdit={true}
                                onEdit={handleEdit}
                                editHeader="Update"
                                columnStyles={{
                                    'Request ID': 'text-[var(--primaries)] font-semibold',
                                }}
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Render the modal */}
            {isModalOpen && selectedRewardRequest && (
                <EditModalComponent
                    title="Edit Reward Request"
                    questionLabel="Request ID"
                    answerLabel="Amount"
                    statusLabel="Action"
                    transactionIdLabel="Transaction ID"
                    amountLabel="Amount"
                    question={selectedRewardRequest.name}  
                    answer={selectedRewardRequest.redeemed_points || ''} 
                    status={selectedRewardRequest.request_status || ''} 
                    transactionId={isApproved ? selectedRewardRequest.transection_id || '' : ''} 
                    amount={isApproved ? amount : ''}  
                    onClose={handleCloseModal}
                    setAmount={setAmount} 
                    onSubmit={handleSubmit}
                    onCancel={handleCancel}
                    setQuestion={(value) => setSelectedRewardRequest(prev => ({ ...prev, name: value }))}
                    setAnswer={(value) => setSelectedRewardRequest(prev => ({ ...prev, redeemed_points: value }))}
                    setStatus={(value) => setSelectedRewardRequest(prev => ({ ...prev, request_status: value }))}
                    setTransactionId={(value) => setSelectedRewardRequest(prev => ({ ...prev, transection_id: value }))}
                    showTransactionId={isApproved} 
                    showAmount={isApproved} 
                />
            )}

            {showSuccessAlert && (
                <SuccessAlert
                    showButton={false}
                    showCancleButton={false}
                    showCollectButton={false}
                    showAnotherButton={false}
                    showMessagesecond={false}
                    message={alertMessage}
                    onClose={function (): void {
                        throw new Error('Function not implemented.');
                    } } onCancel={function (): void {
                        throw new Error('Function not implemented.');
                    } }                
                    />
            )}
        </Fragment>
    );
};

export default CarpenterRewardRequest;
