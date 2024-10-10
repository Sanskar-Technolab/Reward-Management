import '../../assets/css/style.css';
import '../../assets/css/pages/admindashboard.css';
import Pageheader from '../../components/common/pageheader/pageheader';
import TableComponent from '../../components/ui/tables/tablecompnent';
import TableBoxComponent from '../../components/ui/tables/tableboxheader';
import React, { Fragment, useState, useEffect } from "react";

import axios from 'axios';
// import { API_KEY, API_SECRET, BASE_URL } from "../../utils/constants";

interface Transaction {
    name: string,
    redeem_request_id?: string,
    carpainter_id: string,
    carpainter_name?: string,
    mobile_number?: string,
    transaction_id?: string,
    transfer_date?: string,
    amount?: number,
    transfer_time?: string
}

const BankingHistory: React.FC = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(5); // Number of items per page
    const [transactionData, setTransactionData] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [userData, setUserData] = useState<any>(null);
    const [searchQuery , setSearchQuery] = useState('');
    const [fromDate, setFromDate] = useState<Date | null>(null);
    const [toDate, setToDate] = useState<Date | null>(null);

    useEffect(() => {
        document.title='Banking History';
        const fetchUserData = async () => {
            try {
                const response = await axios.get(`/api/method/frappe.auth.get_logged_user`,{
                    
                });
                console.log("Logged user data:", response);
                setUserData(response.data.message);
            } catch (error) {
                console.error("Error fetching user data:", error);
            }
        };

        const fetchTransactionData = async () => {
            try {
                const response = await axios.get(`/api/method/reward_management.api.bank_history.get_bank_history_details`,{
                   
                });
                console.log("Bank table data:", response);

                // Access the nested array within the response
                const bankData = response.data.message.data;

                // Ensure response is in the expected format
                if (Array.isArray(bankData)) {
                    setTransactionData(bankData);
                } else {
                    setError("Unexpected response format");
                }

                setLoading(false);
            } catch (error) {
                setError("Error fetching data");
                setLoading(false);
            }
        };

        fetchUserData();
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
        setSearchQuery(value); // Update search query
        setCurrentPage(1);
        console.log("Search value:", value);
    };

    const handleDateFilter = (from: Date | null, to: Date | null) => {
        setFromDate(from);
        setToDate(to);
        setCurrentPage(1);
    };

    const handleAddProductClick = () => {
        console.log("Add Product button clicked");
        // Implement add product logic here
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


    // Ensure transactionData is an array before calling map
    const formattedTransactionData = Array.isArray(transactionData) ? transactionData.map(transaction => ({
        ...transaction,
        transfer_date: transaction.transfer_date ? formatDate(transaction.transfer_date) : '',
    })) : [];

    const filteredData = formattedTransactionData.filter(transactionData => {
        const query = searchQuery.toLowerCase();
    
        // Parse transfer_date for filtering
        const transferDateString = transactionData.transfer_date;
        const transferDate = parseDateString(transferDateString); // Ensure this function parses the date string
    
        // Check if the transfer_date is within the selected date range
        const isTransferDateInRange =
            (!fromDate || (transferDate && transferDate >= fromDate)) &&
            (!toDate || (transferDate && transferDate <= toDate));
    
        // Check if any of the fields match the search query
        const matchesQuery =
            (transactionData.name && transactionData.name.toLowerCase().includes(query)) ||
            (transactionData.redeem_request_id && transactionData.redeem_request_id.toLowerCase().includes(query)) ||
            (transactionData.mobile_number && transactionData.mobile_number.toString().toLowerCase().includes(query)) ||
            (transactionData.amount !== undefined && transactionData.amount.toString().toLowerCase().includes(query)) ||
            (transferDateString && transferDateString.toLowerCase().includes(query)) || // Note: We're using transfer_date directly here
            (transactionData.transfer_time && transactionData.transfer_time.toLowerCase().includes(query)) ||
            (transactionData.transaction_id && transactionData.transaction_id.toLowerCase().includes(query));
    
        // Return true if the transaction matches the date range and the query
        return isTransferDateInRange && matchesQuery;
    });
    

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <Fragment>
              <Pageheader 
                currentpage={"Banking History"} 
                activepage={"/banking-history"} 
                activepagename="Banking History"
              
            />
           

            <div className="grid grid-cols-12 gap-x-6 bg-white mt-5 rounded-lg shadow-lg">
                <div className="xl:col-span-12 col-span-12">
                    <div className="box">
                        <TableBoxComponent 
                            title="Bank History" 
                            onSearch={handleSearch} 
                            onAddButtonClick={handleAddProductClick} 
                            buttonText="Add Announcement"
                            showButton={false}
                            showFromDate={true}
                            showToDate={true}
                            onDateFilter={handleDateFilter}
                        />

                        <div className="box-body m-5">
                          

                            <TableComponent<Transaction>
                                columns={[
                                    { header: 'Bank History ID', accessor: 'name' },
                                    { header: 'Redeem Request ID', accessor: 'redeem_request_id' },
                                    { header: 'Mobile Number', accessor: 'mobile_number' },
                                    { header: 'Amount', accessor: 'amount' },
                                    { header: 'Transaction Account', accessor: 'transaction_id' },
                                    { header: 'Transaction Date', accessor: 'transfer_date' },
                                    { header: 'Transaction Time', accessor: 'transfer_time' },
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
                                    'Bank History ID': 'text-[var(--primaries)] font-semibold', // Example style for QR ID column
                                }}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </Fragment>
    );
};

export default BankingHistory;
