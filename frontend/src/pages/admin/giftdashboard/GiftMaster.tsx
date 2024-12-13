import React, { Fragment, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Pageheader from "../../../components/common/pageheader/pageheader";
import TableBoxComponent from "../../../components/ui/tables/tableboxheader";
import CreateQRCode from "../../../components/ui/models/CreateQRModel.tsx";
import SuccessAlert from "../../../components/ui/alerts/SuccessAlert";
import DangerAlert from "../../../components/ui/alerts/DangerAlert";
import { PulseLoader } from "react-spinners";

const ProductMaster: React.FC = () => {
    const [giftData, setGiftData] = useState<Gift[]>([]);
    const [filteredData, setFilteredData] = useState<Gift[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(5);
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<Gift | null>(null);
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
    }, []);

    // Handle search filtering
    useEffect(() => {
        const filtered = giftData.filter((gift) =>
            gift.gift_product_name.toLowerCase().includes(searchQuery.toLowerCase())
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

    const openModal = (product: Gift) => {
        setSelectedProduct(product);
        setModalOpen(true);
    };

    const closeModal = () => {
        setModalOpen(false);
        setSelectedProduct(null);
    };

    const handleDeleteProduct = (item: Gift) => {
        setProductToDelete(item);
        setIsConfirmDeleteModalOpen(true);
    };

    const confirmDelete = async () => {
        if (productToDelete) {
            try {
                await axios.delete(`/api/method/reward_management.api.gift_product.delete_product`, {
                    data: { gift_id: productToDelete.name },
                });
                setAlertTitle("Success");
                setAlertMessage("Product deleted successfully!");
                setShowSuccessAlert(true);
                setGiftData(giftData.filter((gift) => gift.name !== productToDelete.name));
                setIsConfirmDeleteModalOpen(false);
            } catch (error) {
                console.error("Error deleting product:", error);
            }
        }
    };

    const cancelDelete = () => {
        setIsConfirmDeleteModalOpen(false);
        setProductToDelete(null);
    };

    return (
        <Fragment>
            <Pageheader currentpage="Product Master" activepage="/product-master" activepagename="Product Master" />
            <div className="grid grid-cols-12 gap-x-6 bg-white mt-5 rounded-lg shadow-lg">
                <div className="xl:col-span-12 col-span-12">
                    <TableBoxComponent
                        title="Gifts"
                        onSearch={handleSearch}
                        buttonText="Add Gift"
                        showButton={true}
                        onAddButtonClick={() => navigate("/add-gift")}
                    />
                    <div className="box-body m-5">
                        {loading ? (
                            <PulseLoader />
                        ) : error ? (
                            <p className="text-red-500">{error}</p>
                        ) : (
                            <div className="table-responsive pt-2">
                                <table className="table whitespace-nowrap min-w-full">
                                    <thead>
                                        <tr>
                                            <th scope="col" className="text-start p-3 text-sm text-defaulttextcolor font-semibold border border-gray-300">S.No</th>
                                            <th className="text-start p-3 text-sm text-defaulttextcolor font-semibold border border-gray-300">Gift ID</th>
                                            <th className="text-start p-3 text-sm text-defaulttextcolor font-semibold border border-gray-300">Gift Name</th>
                                            <th className="text-start p-3 text-sm text-defaulttextcolor font-semibold border border-gray-300">Points</th>
                                            <th className="text-start p-3 text-sm text-defaulttextcolor font-semibold border border-gray-300">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {currentItems.map((gift, index) => (
                                            <tr key={gift.name}>
                                                <td className="p-3 text-defaultsize font-medium text-defaulttextcolor whitespace-nowrap border border-gray-300">{indexOfFirstItem + index + 1}</td>
                                                <td className="p-3 text-defaultsize font-semibold text-[var(--primaries)] whitespace-nowrap border border-gray-300">{gift.name}</td>
                                                <td className="p-3 text-defaultsize font-semibold text-[var(--primaries)] whitespace-nowrap border border-gray-300">{gift.gift_product_name}</td>
                                                <td className="p-3 text-defaultsize font-semibold text-[var(--primaries)] whitespace-nowrap border border-gray-300"> {gift.points}</td>
                                                <td className="p-3 text-defaultsize font-semibold text-[var(--primaries)] whitespace-nowrap border border-gray-300">
                                                    <Link
                                                        aria-label="Edit"
                                                        to={`/edit-gift?gift=${encodeURIComponent(gift.name)}`}
                                                        className="link-icon bg-[var(--bg-primary)] hover:bg-[var(--primaries)] py-2 px-[10px] rounded-full mr-2"
                                                    >
                                                        <i className="ri-edit-2-fill"></i>
                                                    </Link>
                                                    <Link
                                                        aria-label="Delete"
                                                        to="#"
                                                        className={`link-icon bg-[var(--bg-primary)] hover:bg-[var(--primaries)] py-2 px-[10px] rounded-full mr-2 `}
                                                        onClick={(e) => {
                                                            handleDeleteProduct(gift); 
                                                            
                                                            
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
                        )}
                        {/* Pagination */}
                        <div>
                            <button onClick={handlePrevPage} disabled={currentPage === 1}>
                                Prev
                            </button>
                            <button onClick={handleNextPage} disabled={currentPage === totalPages}>
                                Next
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            {/* Modals and Alerts */}
            {modalOpen && selectedProduct && <CreateQRCode isOpen={modalOpen} onClose={closeModal} />}
            {showSuccessAlert && <SuccessAlert title={alertTitle} message={alertMessage} />}
            {isConfirmDeleteModalOpen && (
                <DangerAlert
                    type="danger"
                    message="Are you sure you want to delete this product?"
                    onConfirm={confirmDelete}
                    onDismiss={cancelDelete}
                />
            )}
        </Fragment>
    );
};

export default ProductMaster;
