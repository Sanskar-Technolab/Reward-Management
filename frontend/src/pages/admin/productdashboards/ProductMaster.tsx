import '../../../assets/css/style.css';
import '../../../assets/css/pages/admindashboard.css';
import Pageheader from '../../../components/common/pageheader/pageheader';
import { Link, useNavigate } from 'react-router-dom';
import React, { Fragment, useState, useEffect } from "react";
import { useFrappeGetDocList } from 'frappe-react-sdk';
import CreateQRCode from '../../../components/ui/models/CreateQRModel.tsx';
import SuccessAlert from '../../../components/ui/alerts/SuccessAlert';
import TableBoxComponent from '../../../components/ui/tables/tableboxheader';
import axios from 'axios';
import { PulseLoader } from 'react-spinners';
import DangerAlert from '../../../components/ui/alerts/DangerAlert';


interface Product {
    name: string,
    product_name?: string,
    category: string,
    reward_points?: number,
    quantity?: number,
    product_price?: number
}

const ProductMaster: React.FC = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [showSuccessAlert, setShowSuccessAlert] = useState(false);
    const [loading, setLoading] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const [alertTitle, setAlertTitle] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [itemsPerPage] = useState(10);
    const [productToDelete, setProductToDelete] = useState<Product | null>(null);
    const [isConfirmDeleteModalOpen, setIsConfirmDeleteModalOpen] = useState(false);
    const [qrDataResponse, setQrDataResponse] = useState<any[]>([]);

    const { data: productsData, mutate: mutateProducts } = useFrappeGetDocList<Product>('Product', {
        fields: ['name', 'product_name', 'category', 'reward_points', 'product_price'],
         // limit_start: pageIndex * 10,
         limit: 0,
         orderBy: {
             field: 'creation',
             order: 'desc',
         }
    });
    // Fetch Product QR Data
    const { data: productQRData,mutate: mutateQR } = useFrappeGetDocList<Product>('Product QR', {
        fields: ['name', 'product_name', 'quantity']
    });
    
    // Combine Product and Product QR Data
    // const combinedData = productsData?.map(product => {
    //     const qrData = productQRData?.find(qr => qr.product_name === product.name);
    //     return {
    //         ...product,
    //         quantity: qrData?.quantity || 0
    //     };
    // });

  // Combine Product and Product QR Data with API response data
    const combinedData = productsData?.map(product => {
        // Try to find matching data from API response first
        const apiResponseItem = qrDataResponse.find(item => item.product_name === product.name);
        
        // If not found in API response, use existing QR data
        const matchingQRs = apiResponseItem 
            ? [{ quantity: apiResponseItem.quantity }] 
            : productQRData?.filter(qr => qr.product_name === product.name);
        
        const totalQuantity = matchingQRs?.reduce((sum, qr) => sum + (qr.quantity || 0), 0) || 0;
        
        return {
            ...product,
            quantity: totalQuantity
        };
    }) || [];

    const navigate = useNavigate();

    // Function to refresh all quantities
    const refreshQuantities = async () => {
        try {
            setLoading(true);
            const response = await axios.post('/api/method/reward_management.api.print_qr_code.update_all_product_qr_quantities');
            
            if (response.data && response.data.message && response.data.message.success === true) {
                // console.log("QR data response:", response.data.message);
                
                // Store the API response data
                setQrDataResponse(response.data.message.data || []);
            
                // Refresh both datasets
                await Promise.all([mutateProducts(), mutateQR()]);
            } else {
                console.log(response.data?.message?.message || 'Unknown error occurred');
            }
        } catch (error) {
            console.log('Error refreshing quantities:', error);
        } finally {
            setLoading(false);
        }
    };


    useEffect(() => {
        document.title = 'Products Dashboard';
        // Initial data load
        refreshQuantities();

        if (showSuccessAlert) {
            const timer = setTimeout(() => {
                setShowSuccessAlert(false);
                window.location.reload();
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [showSuccessAlert]);

    // console.log("data", productsData);


    // Filter the data based on search query

    const filteredData = combinedData?.filter(item => {
        const query = searchQuery.toLowerCase();
        return (
            item.name.toLowerCase().includes(query) ||
            item.product_name?.toLowerCase().includes(query) ||
            item.category.toLowerCase().includes(query) ||
            (item.reward_points?.toString().includes(query))
        );
    }) || [];


    // Pagination data

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredData?.slice(indexOfFirstItem, indexOfLastItem) || [];
    const totalPages = Math.ceil((filteredData?.length || 0) / itemsPerPage);

    // Pagination handlers
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

    const openModal = (product: Product) => {
        setSelectedProduct(product);
        setModalOpen(true);
    };

    const closeModal = () => {
        setModalOpen(false);
        setSelectedProduct(null);
    };

    const handleConfirm = async (quantity: number) => {
        if (selectedProduct) {
            setLoading(true);
            try {
                await axios.post(`/api/method/reward_management.api.print_qr_code.create_product_qr`, {
                    product_name: selectedProduct.name,
                    quantity: quantity
                });
                // const response = await axios.post(`/api/method/reward_management.api.print_qr_code.create_product_qr`, {
                //     product_name: selectedProduct.name,
                //     quantity: quantity
                // });
                setAlertTitle('Success');
                setAlertMessage('QR Codes created successfully!');
                setShowSuccessAlert(true);
                // console.log('QR Codes created successfully:', response.data);


                closeModal();
            } catch (error) {
                console.error('Error creating QR codes:', error);

            }
            finally {
                setLoading(false);
            }
        } else {
            console.error('No product selected');

        }
    };

    const handleSearch = (value: string) => {
        setSearchQuery(value);
        setCurrentPage(1);
    };


    const handleAddProductClick = () => {
        // console.log("Add Product button clicked");
        navigate('/add-product');

    };

    const handleDeleteProduct = (item: Product) => {
        setProductToDelete(item);
        setIsConfirmDeleteModalOpen(true);
    };

    const confirmDelete = async () => {
        if (!productToDelete) return;

        try {
            const response = await fetch(`/api/resource/Product/${productToDelete.name}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            if (!response.ok) {
                const responseData = await response.json();
                throw new Error(`Error: ${responseData.message || response.statusText}`);
            }

            setAlertTitle('Success');
            setAlertMessage('Product deleted successfully!');
            setShowSuccessAlert(true);
            setIsConfirmDeleteModalOpen(false);
            mutateProducts();
        } catch (error) {
            console.log(error),
                console.error('Error deleting product:', error.message || error);
            alert('Failed to delete Product.');
        }
    };

    const cancelDelete = () => {
        setIsConfirmDeleteModalOpen(false);
        setProductToDelete(null);
    };


    return (
        <Fragment>
            <Pageheader
                currentpage={"Product Master"}
                // activepage={"/product-master"}
                // mainpage={"/product-master"} 
                // activepagename='Product Master'
            />
            {/* <Pageheader currentpage={pagecurrentPage} activepage={activePage} mainpage={mainPage}  /> */}

            <div className="grid grid-cols-12 gap-x-6 bg-white mt-5 rounded-lg shadow-lg">
                <div className="xl:col-span-12 col-span-12">
                    <div className="">

                        <TableBoxComponent
                            title="Products"
                            onSearch={handleSearch}
                            onAddButtonClick={handleAddProductClick}
                            buttonText="Add Product"
                            showButton={true}
                            icon=""
                            buttonOnClick={handleAddProductClick}
                        />
                        <div className="box-body m-5">
                            <div className="table-responsive pt-2 overflow-auto">
                                <table className="table whitespace-nowrap min-w-full overflow-auto">
                                    <thead>
                                        <tr>
                                            <th scope="col" className="text-start p-3 text-sm text-defaulttextcolor font-semibold border border-gray-300">S.No</th>
                                            <th scope="col" className="text-start p-3 text-sm text-defaulttextcolor font-semibold border border-gray-300">Product ID</th>
                                            <th scope="col" className="text-start p-3 text-sm text-defaulttextcolor font-semibold border border-gray-300">Product Name</th>
                                            <th scope="col" className="text-start p-3 text-sm text-defaulttextcolor font-semibold border border-gray-300">Product Category</th>
                                            <th scope="col" className="text-start p-3 text-sm text-defaulttextcolor font-semibold border border-gray-300">Product Price</th>
                                            <th scope="col" className="text-start p-3 text-sm text-defaulttextcolor font-semibold border border-gray-300">Reward Points</th>
                                            <th scope="col" className="text-start p-3 text-sm text-defaulttextcolor font-semibold border border-gray-300">Total QR</th>
                                            <th scope="col" className="text-start p-3 text-sm text-defaulttextcolor font-semibold border border-gray-300">Product QR</th>
                                            <th scope="col" className="text-start p-3 text-sm text-defaulttextcolor font-semibold border border-gray-300">Edit</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {currentItems.map((product, index) => (
                                            <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                                                <td className="p-3 text-defaultsize font-medium text-defaulttextcolor whitespace-nowrap border border-gray-300">{(currentPage - 1) * itemsPerPage + index + 1}</td>
                                                <td className="p-3 text-defaultsize font-semibold text-[var(--primaries)] whitespace-nowrap border border-gray-300">{product.name}</td>
                                                <td className="p-3 text-defaultsize font-medium text-defaulttextcolor whitespace-nowrap border border-gray-300">{product.product_name}</td>
                                                <td className="p-3 text-defaultsize font-medium text-defaulttextcolor whitespace-nowrap border border-gray-300">{product.category}</td>
                                                <td className="p-3 text-defaultsize font-medium text-defaulttextcolor whitespace-nowrap border border-gray-300">{product.product_price}</td>
                                                <td className="p-3 text-defaultsize font-medium text-defaulttextcolor whitespace-nowrap border border-gray-300">{product.reward_points}</td>

                                                <td className="p-3 text-defaultsize font-medium text-defaulttextcolor whitespace-nowrap border border-gray-300">{product.quantity}</td>
                                                <td className="p-3 text-defaultsize font-medium text-defaulttextcolor whitespace-nowrap border border-gray-300">
                                                    <Link aria-label="anchor" to="#" onClick={() => openModal(product)} className="link-icon bg-[var(--bg-primary)] hover:bg-[var(--primaries)] py-2 px-[10px] rounded-full mr-2">
                                                        <i className="ri-qr-code-line"></i>
                                                    </Link>
                                                    <Link
                                                        aria-label="Download QR Code"
                                                        to={`/download-qr-code?product=${encodeURIComponent(product.name)}`}
                                                        className="link-icon bg-[var(--bg-primary)] hover:bg-[var(--primaries)] py-2 px-[10px] rounded-full mr-2"
                                                    >
                                                        <i className="ri-download-2-line"></i>
                                                    </Link>
                                                </td>
                                                <td className="p-3 text-defaultsize font-medium text-defaulttextcolor whitespace-nowrap border border-gray-300">
                                                    <Link aria-label="anchor" to={`/edit-product?product=${encodeURIComponent(product.name)}`} className="link-icon bg-[var(--bg-primary)] hover:bg-[var(--primaries)] py-2 px-[10px] rounded-full mr-2">
                                                        <i className="ri-edit-2-fill"></i>
                                                    </Link>
                                                    <Link
                                                        aria-label="anchor"
                                                        to="#"
                                                        className={`link-icon bg-[var(--bg-primary)] hover:bg-[var(--primaries)] py-2 px-[10px] rounded-full mr-2 ${product.quantity === 0 ? '' : 'opacity-50 cursor-not-allowed'}`}
                                                        onClick={(e) => {
                                                            if (product.quantity <= 0) {
                                                                e.preventDefault();
                                                                handleDeleteProduct(product);
                                                            }
                                                        }}
                                                    >
                                                        <i className="ri-delete-bin-line"></i>
                                                    </Link>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Pagination */}
                            <div className="box-footer p-4 border-t">
                                <div className="sm:flex items-center">
                                    <div className="text-defaulttextcolor dark:text-defaulttextcolor/70 font-normal text-defaultsize">
                                        Showing {currentItems.length} Entries <i className="bi bi-arrow-right ms-2 font-semibold"></i>
                                    </div>
                                    {/* <div className="ms-auto">
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
                                                            className={`page-link px-2 rounded-md ${currentPage === index + 1 ? 'text-white bg-blue-800' : 'bg-gray-200'}`}
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
                                    </div> */}
                                    <div className="ms-auto">
                                        <nav aria-label="Page navigation" className="pagination-style-4">
                                            <ul className="ti-pagination flex items-center px-3 mb-0">
                                                <li className="page-item px-2">
                                                    <button
                                                        className="page-link"
                                                        onClick={() => handlePageChange(1)}
                                                        disabled={currentPage === 1}
                                                    >
                                                        «
                                                    </button>
                                                </li>
                                                <li className="page-item px-2">
                                                    <button
                                                        className="page-link"
                                                        onClick={handlePrevPage}
                                                        disabled={currentPage === 1}
                                                    >
                                                        Prev
                                                    </button>
                                                </li>
                                                {Array.from({ length: Math.min(5, totalPages) }, (_, idx) => {
                                                    const startPage = Math.max(1, currentPage - 2);
                                                    const pageNumber = startPage + idx;

                                                    return (
                                                        pageNumber <= totalPages && (
                                                            <li className="page-item px-2" key={pageNumber}>
                                                                <button
                                                                    className={`page-link px-2 rounded-md ${currentPage === pageNumber ? 'text-white bg-primary' : 'bg-gray-200'}`}
                                                                    onClick={() => handlePageChange(pageNumber)}
                                                                >
                                                                    {pageNumber}
                                                                </button>
                                                            </li>
                                                        )
                                                    );
                                                })}
                                                <li className="page-item px-2">
                                                    <button
                                                        className="page-link"
                                                        onClick={handleNextPage}
                                                        disabled={currentPage === totalPages}
                                                    >
                                                        Next
                                                    </button>
                                                </li>
                                                <li className="page-item px-2">
                                                    <button
                                                        className="page-link"
                                                        onClick={() => handlePageChange(totalPages)}
                                                        disabled={currentPage === totalPages}
                                                    >
                                                        »
                                                    </button>
                                                </li>
                                            </ul>
                                        </nav>
                                    </div>

                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal */}
            {modalOpen && selectedProduct && (
                <CreateQRCode
                    isOpen={modalOpen}
                    onClose={closeModal}
                    onCancel={closeModal}
                    onConfirm={handleConfirm}
                    requiredQuestion={true}
                    questionErrorMessage="Please enter a valid quantity"
                    title={`Create QR Code for ${selectedProduct.name}`} onSubmit={function (): void {
                        throw new Error('Function not implemented.');
                    }}
                />
            )}
            {loading && (
                <div className="fixed inset-0 flex items-center justify-center bg-gray-200 bg-opacity-75 z-50">
                    <PulseLoader color="#09090C" loading={loading} size={15} />
                </div>
            )}

            {/* Success Alert */}
            {showSuccessAlert && <SuccessAlert
                title={alertTitle}
                showButton={false}
                showCancleButton={false}
                showCollectButton={false}
                showAnotherButton={false}
                showMessagesecond={false}
                message={alertMessage}
                onClose={function (): void {
                    throw new Error('Function not implemented.');
                }}
                onCancel={function (): void {
                    throw new Error('Function not implemented.');
                }}
            />}




            {isConfirmDeleteModalOpen && (
                <DangerAlert
                    type="danger"
                    message={`Are you sure you want to delete this Product?`}
                    onDismiss={cancelDelete}
                    onConfirm={confirmDelete}
                    cancelText="Cancel"
                    confirmText="Continue"
                />
            )}
        </Fragment>
    );
};

export default ProductMaster;