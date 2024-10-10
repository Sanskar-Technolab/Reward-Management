import '../../../assets/css/style.css';
import '../../../assets/css/pages/admindashboard.css';
import Pageheader from '../../../components/common/pageheader/pageheader';
import TableComponent from '../../../components/ui/tables/tablecompnent';
import TableBoxComponent from '../../../components/ui/tables/tableboxheader';
import React, { Fragment, useState, useEffect } from "react";
import { useFrappeGetDocList } from 'frappe-react-sdk';

interface Carpenter {
    name: string,
    full_name?: string,
    city: string,
    mobile_number?: string,
    total_points: number,
    current_points: number,
    redeem_points: number,
}

interface User {
    name: string;
    mobile_no: string;
}

const CarpenterDetails: React.FC = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(5);
    const [searchQuery, setSearchQuery] = useState('');
    const [validMobileNumbers, setValidMobileNumbers] = useState<string[]>([]);
    
    const { data: userData } = useFrappeGetDocList<User>('User', {
        fields: ['mobile_no']
    });
    
    const { data: carpenterData } = useFrappeGetDocList<Carpenter>('Customer', {
        fields: ['name', 'full_name', 'city', 'mobile_number', 'total_points', 'current_points', 'redeem_points']
    });

    useEffect(() => {
        document.title='Customer Details';
        // Extract and set valid mobile numbers whenever userData changes
        const extractedMobileNumbers = userData?.map(user => user.mobile_no) || [];
        setValidMobileNumbers(extractedMobileNumbers);
    }, [userData]);

    // Filter Carpenters Data
    const filteredCarpenters = carpenterData?.filter(carpenter => validMobileNumbers.includes(carpenter.mobile_number)) || [];

    // Function to filter data based on search query
    const filteredData = filteredCarpenters.filter(carpenter => {
        const query = searchQuery.toLowerCase();
        return (
            (carpenter.name && carpenter.name.toLowerCase().includes(query)) ||
            (carpenter.full_name && carpenter.full_name.toLowerCase().includes(query)) ||
            (carpenter.city && carpenter.city.toLowerCase().includes(query)) ||
            (carpenter.mobile_number && carpenter.mobile_number.toLowerCase().includes(query)) ||
            (carpenter.total_points && carpenter.total_points.toString().includes(query)) ||
            (carpenter.current_points && carpenter.current_points.toString().includes(query)) ||
            (carpenter.redeem_points && carpenter.redeem_points.toString().includes(query))
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
        setSearchQuery(value);
        setCurrentPage(1);
    };

    const handleAddProductClick = () => {
        console.log("Add Product button clicked");
        // Implement add product logic here
    };

    return (
        <Fragment>
             <Pageheader 
                currentpage={"Customer Details"} 
                activepage={"/carpenter-details"} 
                // mainpage={"/carpenter-details"} 
                activepagename='Customer Dashboard' 
                // mainpagename='Customer Details' 
            />
            {/* <Pageheader currentpage="Customer Details" activepage="Customer Dashboard" mainpage="Customer Details" /> */}

            <div className="grid grid-cols-12 gap-x-6 bg-white mt-5 rounded-lg shadow-lg">
                <div className="xl:col-span-12 col-span-12">
                    <div className="box">
                        <TableBoxComponent 
                            title="Customer Detail" 
                            onSearch={handleSearch} 
                            onAddButtonClick={handleAddProductClick} 
                            buttonText="Add New Product" // Custom button text
                            showButton={false} // Show the button
                        />

                        <div className="box-body m-5">
                            <TableComponent<Carpenter>
                                columns={[
                                    { header: 'Customer ID', accessor: 'name' },
                                    { header: 'Customer Name', accessor: 'full_name' },  
                                    { header: 'Mobile Number', accessor: 'mobile_number' },
                                    { header: 'City', accessor: 'city' },
                                    { header: 'Total Points', accessor: 'total_points' },
                                    { header: 'Available Points', accessor: 'current_points' },
                                    { header: 'Redeemed Points ', accessor: 'redeem_points' },
                                ]}
                                data={filteredData || []}
                                currentPage={currentPage}
                                itemsPerPage={itemsPerPage}
                                handlePrevPage={handlePrevPage}
                                handleNextPage={handleNextPage}
                                handlePageChange={handlePageChange}
                                showProductQR={false} 
                                showEdit={false} 
                                columnStyles={{
                                    'Customer ID': 'text-[var(--primaries)] font-semibold',
                                }}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </Fragment>
    );
};

export default CarpenterDetails;
