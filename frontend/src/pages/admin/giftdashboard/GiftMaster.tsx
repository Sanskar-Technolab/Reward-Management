import React, { Fragment, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Pageheader from "../../../components/common/pageheader/pageheader";
import TableBoxComponent from "../../../components/ui/tables/tableboxheader";
import CreateQRCode from "../../../components/ui/models/CreateQRModel.tsx";
import SuccessAlert from "../../../components/ui/alerts/SuccessAlert";
import DangerAlert from "../../../components/ui/alerts/DangerAlert";
import TableComponent from '../../../components/ui/tables/tablecompnent';

interface Gift {
    name: string,
    gift_product_name?: string,
    points?: number
}

const ProductMaster: React.FC = () => {
    const [giftData, setGiftData] = useState<Gift[]>([]);
    const [filteredData, setFilteredData] = useState<Gift[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);
    // const [modalOpen, setModalOpen] = useState(false);
    // const [selectedProduct, setSelectedProduct] = useState<Gift | null>(null);
    const [showSuccessAlert, setShowSuccessAlert] = useState(false);
    const [loading, setLoading] = useState(false);
    const [alertMessage, setAlertMessage] = useState("");
    const [alertTitle, setAlertTitle] = useState("");
    const [searchQuery, setSearchQuery] = useState("");
    const [isConfirmDeleteModalOpen, setIsConfirmDeleteModalOpen] = useState(false);
    const [productToDelete, setProductToDelete] = useState<Gift | null>(null);
    const [error, setError] = useState(""); // Added state for error handling

    const navigate = useNavigate();

    // Fetch data from API
    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            try {
                const response = await axios.get('/api/method/reward_management.api.gift_product.get_gift_products');
                const productData = response.data.message.data;

                console.log("Fetched Products:", productData);

                if (response.data.message.status === 'success') {
                    if (Array.isArray(productData) && productData.length > 0) {
                        setGiftData(productData);
                        setFilteredData(productData);
                    } else {
                        setError('No products available.');
                    }
                } else {
                    setError('API returned an error status.');
                }
            } catch (err) {
                setError(err.message || 'Failed to fetch products.');
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
        if (showSuccessAlert) {
            const timer = setTimeout(() => {
                setShowSuccessAlert(false);
                // window.location.reload();
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [showSuccessAlert]);

    // Handle search filtering
    useEffect(() => {
        const filtered = giftData.filter((gift) =>
        {
            const query = searchQuery.toLowerCase();
            return (
                gift.gift_product_name?.toLowerCase().includes(query) ||
                gift.name?.toLowerCase().includes(query) ||
                gift.points?.toString().includes(query) // Convert points to string for comparison
            );
        }
            
        );
        setFilteredData(filtered);
    }, [searchQuery, giftData]);

    // Pagination logic
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredData.length / itemsPerPage);

    const handlePrevPage = () => currentPage > 1 && setCurrentPage(currentPage - 1);
    const handleNextPage = () => currentPage < totalPages && setCurrentPage(currentPage + 1);
    const handlePageChange = (pageNumber: number) => setCurrentPage(pageNumber);

    const handleSearch = (value: string) => setSearchQuery(value);

    // const openModal = (product: Gift) => {
    //     setSelectedProduct(product);
    //     setModalOpen(true);
    // };

    const handleEditGiftProduct = (item: Gift) => {
        navigate(`/edit-gift-product/${encodeURIComponent(item.name)}`);
    };
    
    
    // const handleEditGiftProduct = (item: Gift) => {
        
    //     const giftId = item.name.replace(/\s+/g, '_');
       
    //     navigate(`/edit-gift-product/${giftId}`);
    // };
    // const closeModal = () => {
    //     setModalOpen(false);
    //     setSelectedProduct(null);
    //     setShowSuccessAlert(false);

    // };

    const handleDeleteProduct = (item: Gift) => {
        setProductToDelete(item);
        setIsConfirmDeleteModalOpen(true);
    };



    const confirmDelete = async () => {
        if (productToDelete) {
            try {
                const response = await fetch(`/api/resource/Gift Product/${productToDelete.name}`, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                    }
                });
    
                if (!response.ok) {
                    setIsConfirmDeleteModalOpen(false);
                    // Check if the status is 417 or other errors
                    const errorData = await response.json();
                    console.error("Error Response: ", errorData);
    
                    // Show the error message from the response in the alert
                    setAlertTitle("Error");
                    setAlertMessage(errorData.exception || 'Failed to delete product');
                    setShowSuccessAlert(true);
                    return; // exit early if there was an error
                }
    
                // Handle success case
                setAlertTitle("Success");
                setAlertMessage("Product deleted successfully!");
                setShowSuccessAlert(true);
                setGiftData(giftData.filter((gift) => gift.name !== productToDelete.name));
                setIsConfirmDeleteModalOpen(false);
    
            } catch (error) {
                // Handle network or unexpected errors
                console.error("Error deleting product:", error);
                setAlertTitle("Error");
                setAlertMessage('Error deleting product: ' + error.message);
                setShowSuccessAlert(true);
            }
        }
    };
    


    const cancelDelete = () => {
        setIsConfirmDeleteModalOpen(false);
        setProductToDelete(null);
    };

    return (
        <Fragment>
            <Pageheader currentpage="Gift Master" activepage="/gift-master" activepagename="Gift Master" />
            <div className="grid grid-cols-12 gap-x-6 bg-white mt-5 rounded-lg shadow-lg">
                <div className="xl:col-span-12 col-span-12">
                    <TableBoxComponent
                        title="Gifts"
                        onSearch={handleSearch}
                        buttonText="Add Gift"
                        showButton={true}
                        onAddButtonClick={() => navigate("/add-gift-product")}
                    />

                    <div className="box-body m-5">
                        <TableComponent<Gift>
                            columns={[
                                { header: 'Gift ID', accessor: 'name' },
                                { header: 'Gift Product Name', accessor: 'gift_product_name' },
                                { header: 'Points', accessor: 'points' },
                            ]}
                            data={filteredData || []}
                            currentPage={currentPage}
                            itemsPerPage={itemsPerPage}
                            handlePrevPage={handlePrevPage}
                            handleNextPage={handleNextPage}
                            handlePageChange={handlePageChange}
                            showProductQR={false}
                            showEdit={true}
                            onEdit={handleEditGiftProduct}
                            showDelete={true}
                            onDelete={handleDeleteProduct}
                            editHeader='Action'
                            columnStyles={{
                                'Gift ID': 'text-[var(--primaries)] font-semibold',
                            }}
                        />
                    </div>
                </div>
            </div>
            {/* Modals and Alerts */}
         
            {showSuccessAlert && 
            <SuccessAlert 
                title={alertTitle}
                message={alertMessage} showButton={false}
                showCancleButton={false}
                showCollectButton={false}
                showAnotherButton={false}
                showMessagesecond={false} 
                onClose={function (): void {
                    throw new Error("Function not implemented.");
                } } 
                onCancel={function (): void {
                    throw new Error("Function not implemented.");
                } }            />
            }
            {isConfirmDeleteModalOpen && (
                <DangerAlert
                    type="danger"
                    message="Are you sure you want to delete this gift product?"
                    onConfirm={confirmDelete}
                    onDismiss={cancelDelete}
                />
            )}
        </Fragment>
    );
};

export default ProductMaster;
