import '../../../assets/css/style.css';
import '../../../assets/css/pages/admindashboard.css';
import Pageheader from '../../../components/common/pageheader/pageheader';
import TableComponent from '../../../components/ui/tables/tablecompnent';
import TableBoxComponent from '../../../components/ui/tables/tableboxheader';
import React, { Fragment, useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

interface ProductQRHistory {
    name: string,
    product_qr_name?: string,
    product_table_name: string,
    redeem_date: string,
    carpenter_id: string,
    scanned: string,
    generated_date: string,
    qr_code_image: string,
    points?: number
}

const ProductQRHistory: React.FC = () => {
    const [data, setData] = useState<ProductQRHistory[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [itemsPerPage] = useState<number>(10);
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [fromDate, setFromDate] = useState<Date | null>(null);
    const [toDate, setToDate] = useState<Date | null>(null);

    useEffect(() => {
        document.title = 'Product QR History';
        const fetchData = async () => {
            try {
                const response = await axios.get('/api/method/reward_management.api.print_qr_code.print_qr_code');
                const fetchedData = response.data?.message ?? [];
                
                const flattenedData = fetchedData.flatMap((item: any) =>
                    item.qr_table_data?.map((qrItem: any) => ({
                        ...qrItem,
                        scanned: qrItem.scanned === '1' ? 'Scanned' : 'Not Scanned',
                    })) ?? []
                );
                
                setData(flattenedData);
            } catch (error) {
                setError(error instanceof Error ? error.message : 'Failed to fetch data');
            } finally {
                setLoading(false);
            }
        };
    
        fetchData();
    }, []);

    const parseDateString = (dateString: string): Date | null => {
        console.log("Input dateString:", dateString); // Log the value
        if (typeof dateString !== 'string') {
            console.error("Expected a string, but received:", dateString);
            return null; // or some default value
        }
        const parts = dateString.split('-'); // Assuming you're splitting by '-'
        if (parts.length !== 3) {
            console.error("Invalid date format:", dateString);
            return null; // or some default value
        }
        const day = parseInt(parts[0], 10);
        const month = parseInt(parts[1], 10) - 1; // Months are 0-based in JavaScript
        const year = parseInt(parts[2], 10);
        return new Date(year, month, day);
    };
    const filteredData = data.filter(item => {
        const query = searchQuery.toLowerCase();
        const generatedDateString = item.generated_date;
        const isDateValid = typeof generatedDateString === 'string' && generatedDateString.trim() !== '';
        const generatedDate = isDateValid ? parseDateString(generatedDateString) : null;
    
        // Check if generatedDate is valid
        const isWithinDateRange = (!fromDate || (generatedDate && generatedDate >= fromDate)) &&
                                  (!toDate || (generatedDate && generatedDate <= toDate));
        
        return (
            isWithinDateRange &&
            (
                item.product_qr_name?.toLowerCase().includes(query) ||
                item.product_table_name?.toLowerCase().includes(query) ||
                item.carpenter_id?.toLowerCase().includes(query) ||
                item.points?.toString().toLowerCase().includes(query) ||
                item.scanned?.toLowerCase().includes(query) ||
                (isDateValid && generatedDateString.toLowerCase().includes(query))
            )
        );
    });
    const totalPages = Math.ceil(filteredData.length / itemsPerPage);

    const handlePrevPage = () => {
        if (currentPage > 1) setCurrentPage(currentPage - 1);
    };

    const handleNextPage = () => {
        if (currentPage < totalPages) setCurrentPage(currentPage + 1);
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
        setCurrentPage(1); // Reset to the first page
    };

    const handleAddProductClick = () => {
        console.log("Add Product button clicked");
        navigate('/redeemption-history');
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    return (
        <Fragment>
            <Pageheader 
                currentpage={"Product QR History"} 
                activepage={"/product-qr-history"} 
                activepagename='Product QR History' 
            />
            <div className="grid grid-cols-12 gap-x-6 bg-white mt-5 rounded-lg shadow-lg">
                <div className="xl:col-span-12 col-span-12">
                    <div className="box">
                        <TableBoxComponent
                            title="Product QR History"
                            onSearch={handleSearch}
                            onAddButtonClick={handleAddProductClick}
                            buttonText="Add New Product"
                            showButton={false}
                            showFromDate={true}
                            showToDate={true}
                            onDateFilter={handleDateFilter}
                        />

                        <div className="box-body m-5">
                            <TableComponent<ProductQRHistory>
                                columns={[
                                    { header: 'QR ID', accessor: 'product_qr_name' },
                                    { header: 'Product Name', accessor: 'product_table_name' },
                                    { header: 'Reward Points', accessor: 'points' },
                                    { header: 'Generated Date', accessor: 'generated_date' },
                                    {
                                        header: 'Status',
                                        accessor: 'scanned',
                                    },
                                    { header: 'Customer ID', accessor: 'carpenter_id' },
                                    { header: 'Scanned Date', accessor: 'redeem_date' },
                                    {
                                        header: 'QR Image',
                                        accessor: 'qr_code_image',
                                        render: (imageUrl) => {
                                            const imageSrc = imageUrl || 'placeholder.png'; 
                                            return (
                                                <img
                                                    src={imageSrc}
                                                    alt="QR Code"
                                                    style={{ width: '20px', height: '20px' }}
                                                    onError={(e) => {
                                                        (e.target as HTMLImageElement).src = 'placeholder.png'; 
                                                    }}
                                                />
                                            );
                                        }
                                    },
                                ]}
                                data={filteredData}
                                currentPage={currentPage}
                                itemsPerPage={itemsPerPage}
                                handlePrevPage={handlePrevPage}
                                handleNextPage={handleNextPage}
                                handlePageChange={handlePageChange}
                                showProductQR={false}
                                showEdit={false}
                                columnStyles={{
                                    'QR ID': 'text-[var(--primaries)] font-semibold',
                                }}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </Fragment>
    );
};

export default ProductQRHistory;
