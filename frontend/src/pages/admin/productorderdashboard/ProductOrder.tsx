import '../../../assets/css/style.css';
import '../../../assets/css/pages/admindashboard.css';
import Pageheader from '../../../components/common/pageheader/pageheader';
import TableComponent from '../../../components/ui/tables/tablecompnent';
import TableBoxComponent from '../../../components/ui/tables/tableboxheader';
import React, { Fragment, useState, useEffect } from "react";
import { useFrappeGetDocList } from 'frappe-react-sdk';

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
}

const ProductOrder: React.FC = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(5);
    const [searchQuery, setSearchQuery] = useState('');
    const [fromDate, setFromDate] = useState<Date | null>(null);
    const [toDate, setToDate] = useState<Date | null>(null);

    useEffect(() => {
        document.title = 'Product Order';
    }, []);

    const { data: orderData, error } = useFrappeGetDocList<ProductOrder>('Product Order', {
        fields: ['name', 'product_id', 'product_image', 'mobile_number', 'full_name', 'pincode', 'product_name', 'customer_id', 'customer_email', 'address', 'city', 'order_date'],
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
        console.log("Add Product button clicked");
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}-${month}-${year}`;
    };

    const formattedProductOrderData = orderData?.map(order => ({
        ...order,
        transfer_date: order.order_date ? formatDate(order.order_date) : '',
        // product_image_display: order.product_image ? (
        //     <img src={order.product_image} alt="Product" style={{ width: '100px', height: 'auto' }} />
        // ) : (
        //     'No Image' 
        // ),
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

    const filteredData = formattedProductOrderData.filter(order => {
        const query = searchQuery.toLowerCase();

        const orderDateString = order.transfer_date;
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
            (order.customer_email && order.customer_email.toLowerCase().includes(query));

        return isWithinDateRange && matchesSearchQuery;
    });

    return (
        <Fragment>
            <Pageheader
                currentpage={"Product Order"}
                activepage={"/product-order"}
                activepagename="Product Order"
            />

            <div className="grid grid-cols-12 gap-x-6 bg-white mt-5 rounded-lg shadow-lg">
                <div className="xl:col-span-12 col-span-12">
                    <div className="">
                        <TableBoxComponent
                            title="Customer Order History"
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
                                    { header: 'Customer ID', accessor: 'customer_id' },
                                    { header: 'Mobile Number', accessor: 'mobile_number' },
                                    { header: 'City', accessor: 'city' },
                                    { header: 'Email', accessor: 'customer_email' },
                                    { header: 'Address', accessor: 'address' },
                                    { header: 'Product Name', accessor: 'product_name' },
                                    { header: 'Customer Name', accessor: 'full_name' },
                                    // { header: 'Product Image', accessor: 'product_image_display' },

                                    { header: 'Order Date', accessor: 'order_date' },
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

export default ProductOrder;
