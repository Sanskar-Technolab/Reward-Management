import '../../../assets/css/style.css';
import '../../../assets/css/pages/admindashboard.css';
import Pageheader from '../../../components/common/pageheader/pageheader';
import TableComponent from '../../../components/ui/tables/tablecompnent';
import TableBoxComponent from '../../../components/ui/tables/tableboxheader';
import React, { Fragment, useState, useEffect } from "react";
import { useFrappeGetDocList } from 'frappe-react-sdk';
import SuccessAlert from '../../../components/ui/alerts/SuccessAlert';


interface Carpenter {
    name: string,
    full_name?: string,
    city: string,
    mobile_number?: string,
    total_points: number,
    current_points: number,
    redeem_points: number,
    enabled: boolean,

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
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedCarpenter, setSelectedCarpenter] = useState<Carpenter | null>(null);
    const [updatedStatus, setUpdatedStatus] = useState<string>('Active');
    const [showSuccessAlert, setShowSuccessAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const [alertTitle, setAlertTitle] = useState('');
    
    const { data: userData } = useFrappeGetDocList<User>('User', {
        fields: ['mobile_no']
    });
    
    const { data: carpenterData } = useFrappeGetDocList<Carpenter>('Customer', {
        fields: ['name', 'full_name', 'city', 'mobile_number', 'total_points', 'current_points', 'redeem_points','enabled'],
         // limit_start: pageIndex * 10,
         limit: 0,
         orderBy: {
             field: 'creation',
             order: 'desc',
         }
    });

    useEffect(() => {
        document.title='Customer Details';
        // Extract and set valid mobile numbers whenever userData changes
        const extractedMobileNumbers = userData?.map(user => user.mobile_no) || [];
        setValidMobileNumbers(extractedMobileNumbers);
    }, [userData]);

    // Filter Carpenters Data
    // const filteredCarpenters = carpenterData?.filter(carpenter => validMobileNumbers.includes(carpenter.mobile_number)) || [];
    const filteredCarpenters = carpenterData?.filter(carpenter =>
        validMobileNumbers.includes(carpenter.mobile_number)
    ).map(carpenter => ({
        ...carpenter, // Spread the original carpenter data
        enabled: carpenter.enabled === 1 ? 'Active' : 'Deactive'
    })) || [];

    // Function to filter data based on search query
    const filteredData = filteredCarpenters.filter(carpenter => {
        const query = searchQuery.toLowerCase();
        const isEnabledMatch = (status: string | number) => {
            if (typeof status === 'string') {
                // Match 'active' or 'deactive' keywords with 'Active' or 'Deactive'
                if (query === 'active') {
                    return status.toLowerCase() === 'active';  // Matches 'Active'
                } else if (query === 'deactive') {
                    return status.toLowerCase() === 'deactive';  // Matches 'Deactive'
                }
            } else if (typeof status === 'number') {
                // Match numeric values: 1 for 'Active', 0 for 'Deactive'
                if (query === 'active') {
                    return status === 1;  // Matches 1
                } else if (query === 'deactive') {
                    return status === 0;  // Matches 0
                }
            }
            return false;
        };
        return (
            (carpenter.name && carpenter.name.toLowerCase().includes(query)) ||
            (carpenter.full_name && carpenter.full_name.toLowerCase().includes(query)) ||
            (carpenter.city && carpenter.city.toLowerCase().includes(query)) ||
            (carpenter.mobile_number && carpenter.mobile_number.toLowerCase().includes(query)) ||
            (carpenter.total_points && carpenter.total_points.toString().includes(query)) ||
            (carpenter.current_points && carpenter.current_points.toString().includes(query)) ||
            (carpenter.redeem_points && carpenter.redeem_points.toString().includes(query))||
            (carpenter.enabled && isEnabledMatch(carpenter.enabled))

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

    const handleEdit = (carpenter: Carpenter) => {
        setSelectedCarpenter(carpenter);
        setUpdatedStatus(carpenter.enabled); 
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setUpdatedStatus(e.target.value);
    };


    const handleSaveStatus = async () => {
        if (selectedCarpenter) {
            const enabledValue = updatedStatus === 'Active' ? 1 : 0; // Use 1 for Active and 0 for Deactive
            try {
                const response = await fetch(`/api/resource/Customer/${selectedCarpenter.name}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        enabled: enabledValue
                    })
                });
    
                if (!response.ok) {
                    const responseData = await response.json();
                    throw new Error(`Error: ${responseData.message || response.statusText}`);
                }
    
                // After updating, update the local data to reflect the change
                setAlertTitle('Status Updated');
                setAlertMessage(`Carpenter ${selectedCarpenter.full_name} status updated successfully!`);
                setShowSuccessAlert(true);
    
                // Update carpenter data locally
                setSelectedCarpenter(prevState => prevState ? { ...prevState, enabled: updatedStatus } : null);
            } catch (error) {
                console.error('Error updating carpenter status:', error);
                alert('Failed to update carpenter status.');
            }
            handleCloseModal(); 
        }
    };

    useEffect(() => {
        document.title = "Carpenter Details";
        if (showSuccessAlert) {
            const timer = setTimeout(() => {
                setShowSuccessAlert(false);
                window.location.reload();
            }, 3000);
            return () => clearTimeout(timer); 
        }
    }, [showSuccessAlert]);


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
                    <div className="">
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
                                    {
                                        header: 'Active/Deactive',
                                        accessor: 'enabled',

                                    },
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
                                    'Customer ID': 'text-[var(--primaries)] font-semibold',

                                }}
                                getColumnColorClass={(value, accessor) => {
                                    // console.log(`Value: ${value}, Accessor: ${accessor}`); 
                                    if (accessor === 'enabled') {
                                       
                                        if (value === 'Active') {
                                            return 'text-green';  
                                        }
                                        if (value && value.trim().toLowerCase() === 'deactive') {
                                            return 'text-red';  
                                        }
                                    }
                                    return '';  
                                }}
                            />
                        </div>
                    </div>
                </div>
            </div>

                {isModalOpen && selectedCarpenter && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white rounded-lg shadow-lg w-full max-w-lg">
                        <div className="ti-modal-content">
                            <div className="ti-modal-header flex justify-between border-b p-4">
                                <h6 className="modal-title text-1rem font-semibold text-primary">Update Customer Status</h6>
                                <button onClick={handleCloseModal} type="button" className="text-1rem font-semibold text-defaulttextcolor">
                                    <span className="sr-only">Close</span>
                                    <i className="ri-close-line"></i>
                                </button>
                            </div>
                            <div className='p-4'>
                                <div className="xl:col-span-12 col-span-12 mb-4">
                                    <label className="form-label text-sm text-defaulttextcolor font-semibold">Customer Status</label>
                                    <select
                                        className="form-control w-full rounded-5px border border-[#dadada] form-control-light mt-2 text-sm"
                                        value={updatedStatus}
                                        onChange={handleStatusChange}
                                    >
                                        <option value="Active">Active</option>
                                        <option value="Deactive">Deactive</option>
                                    </select>
                                </div>

                                <div className="flex justify-end">
                                        <button
                                            type="button"
                                            className="ti-btn text-white bg-primary me-2"
                                            onClick={handleSaveStatus}
                                        >
                                            Save
                                        </button>
                                        <button
                                            type="button"
                                            className="bg-primary/20 ti-btn text-defaulttextcolor"
                                            onClick={handleCloseModal}
                                        >
                                            Cancel
                                        </button>
                                    </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {showSuccessAlert && (
                <SuccessAlert title={alertTitle} message={alertMessage} 
                onClose={() => setShowSuccessAlert(false)} 
                onCancel={function (): void {
                    throw new Error('Function not implemented.');
                } } />
            )}
        </Fragment>
    );
};

export default CarpenterDetails;
