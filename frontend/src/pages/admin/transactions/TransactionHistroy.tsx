import '../../../assets/css/style.css';
import '../../../assets/css/pages/admindashboard.css';
import Pageheader from '../../../components/common/pageheader/pageheader';
import TableComponent from '../../../components/ui/tables/tablecompnent';
import TableBoxComponent from '../../../components/ui/tables/tableboxheader';
import React, { Fragment, useState,useEffect } from "react";
import { useFrappeGetDocList } from 'frappe-react-sdk';

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

const TransactionHistory: React.FC = () => {
    const [currentPage, setCurrentPage] = useState(1);
     // Number of items per page
    const [itemsPerPage] = useState(5);
     // State for search query
    const [searchQuery, setSearchQuery] = useState('');
    const [fromDate, setFromDate] = useState<Date | null>(null);
    const [toDate, setToDate] = useState<Date | null>(null);

    useEffect(()=>{
        document.title='Transaction History';
    },[]);

    const { data: transactionData, error } = useFrappeGetDocList<Transaction>('Bank Balance', {
        fields: ['name', 'redeem_request_id', 'carpainter_id', 'mobile_number', 'transaction_id', 'transfer_date', 'amount', 'transfer_time']
    });

    if (error) {
        console.error("Error fetching transaction data:", error);
    }

    const totalPages = Math.ceil((transactionData?.length || 0) / itemsPerPage);

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
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}-${month}-${year}`;
    };

    const formattedTransactionData = transactionData?.map(transaction => ({
        ...transaction,
        transfer_date: transaction.transfer_date ? formatDate(transaction.transfer_date) : '',
    })) || [];



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


    const filteredData = formattedTransactionData.filter(transaction => {
        const query = searchQuery.toLowerCase();
        
        // Parse the transfer_date for filtering
        const transactionDateString = transaction.transfer_date;
        const isDateValid = typeof transactionDateString === 'string' && transactionDateString.trim() !== '';
        const transactionDate = isDateValid ? parseDateString(transactionDateString) : null;
    
        // Check if the transaction date is within the selected date range
        const isWithinDateRange = (!fromDate || (transactionDate && transactionDate >= fromDate)) &&
            (!toDate || (transactionDate && transactionDate <= toDate));
    
        const matchesSearchQuery = 
            (transaction.name && transaction.name.toLowerCase().includes(query)) ||
            (transaction.carpainter_id && transaction.carpainter_id.toLowerCase().includes(query)) ||
            (transaction.redeem_request_id && transaction.redeem_request_id.toString().toLowerCase().includes(query)) ||
            (transaction.carpainter_name && transaction.carpainter_name.toLowerCase().includes(query)) ||
            (transaction.transaction_id && transaction.transaction_id.toString().toLowerCase().includes(query)) ||
            (transaction.amount !== undefined && transaction.amount.toString().toLowerCase().includes(query)) ||
            (transaction.mobile_number && transaction.mobile_number.toLowerCase().includes(query)) ||
            (transaction.transfer_time && transaction.transfer_time.toLowerCase().includes(query));
    
        // Return true if it is within the date range and matches the search query
        return isWithinDateRange && matchesSearchQuery;
    });
    return (
        <Fragment>
             <Pageheader 
                currentpage={"Transaction History"} 
                activepage={"/transaction-history"} 
        
                activepagename="Transaction History"
             
            />
           

            <div className="grid grid-cols-12 gap-x-6 bg-white mt-5 rounded-lg shadow-lg">
                <div className="xl:col-span-12 col-span-12">
                    <div className="box">
                        <TableBoxComponent 
                            title="Customer Transaction History" 
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
                                    { header: 'Transaction ID', accessor: 'name' },
                                    { header: 'Redeem Request ID', accessor: 'redeem_request_id' },
                                    { header: 'Customer ID', accessor: 'carpainter_id' },
                                    { header: 'Mobile Number', accessor: 'mobile_number' },  
                                    { header: 'Transaction Account', accessor: 'transaction_id' },
                                    { header: 'Amount', accessor: 'amount' },
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
                                    'Transaction ID': 'text-[var(--primaries)] font-semibold',
                                }}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </Fragment>
    );
};

export default TransactionHistory;
