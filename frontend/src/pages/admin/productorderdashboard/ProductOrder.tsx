import '../../../assets/css/style.css';
import '../../../assets/css/pages/admindashboard.css';
import Pageheader from '../../../components/common/pageheader/pageheader';
import TableComponent from '../../../components/ui/tables/tablecompnent';
import TableBoxComponent from '../../../components/ui/tables/tableboxheader';
import React, { Fragment, useState, useEffect } from "react";
import { useFrappeGetDocList } from 'frappe-react-sdk';
import SuccessAlert from '../../../components/ui/alerts/SuccessAlert';
import EditModalComponent from '../../../components/ui/models/ProductOrderRequestEdit';
import axios from 'axios';
import { Notyf } from 'notyf';
import "notyf/notyf.min.css";

interface ProductOrder {
    name: string;
    product_id?: string;
    product_image: string;
    full_name?: string;
    mobile_number?: string;
    pincode?: string;
    product_name?: string;
    customer_id?: string;
    customer_email?: string;
    address?: string;
    city?: string;
    order_date?: string;
    gift_points?:number;
    order_status?:string;
    order_time?:string;
    approved_date?:string;
    approved_time?:string;
    notes?: string;
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

const ProductOrder: React.FC = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);
    const [searchQuery, setSearchQuery] = useState('');
    const [fromDate, setFromDate] = useState<Date | null>(null);
    const [toDate, setToDate] = useState<Date | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [showSuccessAlert, setShowSuccessAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState("");
    const [selectedOrderRequest, setSelectedOrderRequest] = useState<ProductOrder | null>(null); 


    useEffect(() => {
        document.title = 'Product Order';
        if (showSuccessAlert) {
            const timer = setTimeout(() => {
                setShowSuccessAlert(false);
                window.location.reload(); 
            }, 3000); 
            return () => clearTimeout(timer);
        }
    }, [showSuccessAlert]);



    const { data: orderData, error } = useFrappeGetDocList<ProductOrder>('Product Order', {
        fields: ['name', 'product_id', 'product_image', 'mobile_number', 'full_name', 'pincode', 'product_name', 'customer_id', 'customer_email', 'address', 'city', 'order_date','gift_points','order_status','notes'],
        orderBy: {
            field: 'creation',
            order: 'desc',
        }
    });

    if (error) {
        console.error("Error fetching transaction data:", error);
    }

    const totalPages = Math.ceil((orderData?.length || 0) / itemsPerPage);

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

    const handleDateFilter = (from: Date | null, to: Date | null) => {
        setFromDate(from);
        setToDate(to);
        setCurrentPage(1);
    };

    const handleAddProductClick = () => {
        // console.log("Add Product button clicked");
    };

    // const formatDate = (dateString: string) => {
    //     const date = new Date(dateString);
    //     const day = String(date.getDate()).padStart(2, '0');
    //     const month = String(date.getMonth() + 1).padStart(2, '0');
    //     const year = date.getFullYear();
    //     return `${day}-${month}-${year}`;
    // };

    // const formattedProductOrderData = orderData?.map(order => ({
    //     ...order,
    //     transfer_date: order.order_date ? formatDate(order.order_date) : '',
    //     // product_image_display: order.product_image ? (
    //     //     <img src={order.product_image} alt="Product" style={{ width: '100px', height: 'auto' }} />
    //     // ) : (
    //     //     'No Image' 
    //     // ),
    // })) || [];

    const formatDateToMySQL = (dateString: string) => {
        const [year, month, day] = dateString.split('-').map(Number);
        return `${day.toString().padStart(2, '0')}-${month.toString().padStart(2, '0')}-${year}`;
    };

    

    const parseDateString = (dateString: string): Date | null => {
        if (typeof dateString !== 'string') {
            // console.error("Expected a string, but received:", dateString);
            return null;
        }
        const parts = dateString.split('-');
        if (parts.length !== 3) {
            // console.error("Invalid date format:", dateString);
            return null;
        }
        const day = parseInt(parts[0], 10);
        const month = parseInt(parts[1], 10) - 1;
        const year = parseInt(parts[2], 10);
        return new Date(year, month, day);
    };

    // const formatDateToISO = (dateString: string) => {
    //     const date = new Date(dateString);
    //     const year = date.getFullYear();
    //     const month = (`0${date.getMonth() + 1}`).slice(-2);
    //     const day = (`0${date.getDate()}`).slice(-2);
    //     return `${year}-${month}-${day}`;
    // };
    


    const formattedProductOrderData = orderData?.map(order => ({
        ...order,
        order_date: order.order_date ? formatDateToMySQL(order.order_date) : '',
        approved_date: order.approved_date ? formatDateToMySQL(order.approved_date) : '',
    })) || [];


    const filteredData = formattedProductOrderData.filter(order => {
        const query = searchQuery.toLowerCase();

        const orderDateString = order.order_date;
        const isDateValid = typeof orderDateString === 'string' && orderDateString.trim() !== '';
        const orderDate = isDateValid ? parseDateString(orderDateString) : null;

        const isWithinDateRange = (!fromDate || (orderDate && orderDate >= fromDate)) &&
            (!toDate || (orderDate && orderDate <= toDate));

        const matchesSearchQuery =
            (order.name && order.name.toLowerCase().includes(query)) ||
            (order.product_id && order.product_id.toLowerCase().includes(query)) ||
            (order.full_name && order.full_name.toLowerCase().includes(query)) ||
            (order.mobile_number && order.mobile_number.toLowerCase().includes(query)) ||
            (order.product_name && order.product_name.toLowerCase().includes(query)) ||
            (order.customer_id && order.customer_id.toLowerCase().includes(query)) ||
            (order.order_date && order.order_date.toLowerCase().includes(query))||
            (order.order_status && order.order_status.toLowerCase().includes(query))||
            (order.gift_points && order.gift_points.toString().includes(query))||
            (order.address && order.address.toLowerCase().includes(query))||
            (order.city && order.city.toLowerCase().includes(query))||
            (order.customer_email && order.customer_email.toLowerCase().includes(query));

        return isWithinDateRange && matchesSearchQuery;
    });


   
    // handle edit modal----
    const handleEdit = (orderRequest: ProductOrder) => {
        setSelectedOrderRequest(orderRequest);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    }
    
    const handleSubmit = async () => {
        // console.log('Submit clicked');
        if (!selectedOrderRequest) return;
    
        // Get current date and time
        const now = new Date();
        const currentDate = now.toISOString().split('T')[0]; // Format: YYYY-MM-DD
        const currentTime = now.toISOString().split('T')[1].split('.')[0]; // Format: HH:MM:SS
    
        // Prepare the data for the API request
        const data = {
            name: selectedOrderRequest.name,
            approved_on: currentDate,
            approve_time: currentTime,
            order_id: selectedOrderRequest.name,
            product_name: selectedOrderRequest.product_name,
            order_status: selectedOrderRequest.order_status,
            gift_points: selectedOrderRequest.gift_points,
            notes : selectedOrderRequest.notes, 
        };
    
        try {
            // Make the PUT request to update the Product Order
            const response = await axios.put(`/api/method/reward_management.api.product_order.update_product_order`, data);
    
            if (response.status === 200) {
                console.log("Product Order updated successfully");
    
                // Show success alert and close modal
                setShowSuccessAlert(true);
                setAlertMessage(`${response.data.message.message}`);
                handleCloseModal();
            } else {
                console.error("Failed to update Product Order Request:", response.data);
                notyf.error(`Failed to update Product Order Request: ${response.data.message}`);
            }
        } catch (error) {
            console.error("Error:", error.message || error);
            notyf.error(`Failed to update Product Order Request: ${error}`);
        }
    };
    

    const handleCancel = () => {
        // console.log('Cancel clicked');
        setIsModalOpen(false); 
    }


    return (
        <Fragment>
            <Pageheader
                currentpage={"Product Order"}
                // activepage={"/product-order"}
                // activepagename="Product Order"
            />

            <div className="grid grid-cols-12 gap-x-6 bg-white mt-5 rounded-lg shadow-lg">
                <div className="xl:col-span-12 col-span-12">
                    <div className="">
                        <TableBoxComponent
                            title="Customer Product Order"
                            onSearch={handleSearch}
                            onAddButtonClick={handleAddProductClick}
                            buttonText="Add Announcement"
                            showButton={false}
                            showFromDate={true}
                            showToDate={true}
                            onDateFilter={handleDateFilter}
                        />

                        <div className="box-body m-5">
                            <TableComponent<ProductOrder>
                                columns={[
                                    { header: 'Order ID', accessor: 'name' },
                                    { header: 'Product Id', accessor: 'product_id' },
                                    { header: 'Product Name', accessor: 'product_name' },
                                    { header: 'Product Points', accessor: 'gift_points' },
                                    { header: 'Customer ID', accessor: 'customer_id' },
                                    { header: 'Customer Name', accessor: 'full_name' },
                                    { header: 'Mobile Number', accessor: 'mobile_number' },
                                    
                                    { header: 'Email', accessor: 'customer_email' },
                                    { header: 'Address', accessor: 'address' },
                                    { header: 'City', accessor: 'city' },
                                   
                                   
                                    // { header: 'Product Image', accessor: 'product_image_display' },

                                    { header: 'Order Date', accessor: 'order_date' },
                                    { header: 'Product Status', accessor: 'order_status' },
                                    { header: 'Notes', accessor: 'notes' }
                                  
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
                                showDelete={false}
                                columnStyles={{
                                    'Transaction ID': 'text-[var(--primaries)] font-semibold',
                                }}
                            />


                        </div>
                    </div>
                </div>
            </div>
            {isModalOpen && selectedOrderRequest && (
                <EditModalComponent
                    title="Edit Product Order"
                    orderLevel="Order ID"
                    productnameLevel="Product Name"
                    giftpointLevel="Points"
                    statusLabel="Order Status"
                    notesLabel="Notes"
                    orderId={selectedOrderRequest.name}
                    productName={selectedOrderRequest.product_name || ''}
                    giftPoint={selectedOrderRequest.gift_points || 0}
                    status={selectedOrderRequest.order_status || ''}
                    notes={selectedOrderRequest.notes || ''} 
                    setOrderId={(value) => setSelectedOrderRequest(prev => ({ ...prev, name: value }))}
                    setProductName={(value) => setSelectedOrderRequest(prev => ({ ...prev, product_name: value }))}
                    setGiftPoint={(value) => setSelectedOrderRequest(prev => ({ ...prev, gift_points: value }))}
                    setStatus={(value) => setSelectedOrderRequest(prev => ({ ...prev, order_status: value }))}
                    setNotes={(value) => setSelectedOrderRequest(prev => ({ ...prev, notes: value }))} // Add setNotes handler
                    onClose={handleCloseModal}
                    onSubmit={handleSubmit}
                    onCancel={handleCancel}               
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
                    } } 
                    onCancel={function (): void {
                        throw new Error('Function not implemented.');
                    } }                
                    />
            )}
        </Fragment>
    );
};

export default ProductOrder;
