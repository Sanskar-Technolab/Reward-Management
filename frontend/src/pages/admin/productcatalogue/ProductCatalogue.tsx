import '../../../assets/css/style.css';
import '../../../assets/css/pages/admindashboard.css';
import Pageheader from '../../../components/common/pageheader/pageheader';
import TableComponent from '../../../components/ui/tables/tablecompnent';
import TableBoxComponent from '../../../components/ui/tables/tableboxheader';
import React, { useState } from "react";
import SuccessAlert from '../../../components/ui/alerts/SuccessAlert';
import DangerAlert from '../../../components/ui/alerts/DangerAlert';
import axios from 'axios';
import { useFrappeGetDocList } from "frappe-react-sdk";

interface ProductCategory {
    name: string;
    category_name: string;
    catalogue_image: string;
}

const ProductCatalogue: React.FC = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(5);
    const [productCatalogue, setProductCatalogue] = useState('');
    const [previews, setPreviews] = useState<string[]>([]);
    const [existingImages, setExistingImages] = useState<string[]>([]);
    const [showSuccessAlert, setShowSuccessAlert] = useState(false);
    const [files, setFiles] = useState<FileList | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [isConfirmDeleteModalOpen, setIsConfirmDeleteModalOpen] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const [showAddCatalogueForm, setShowAddCatalogueForm] = useState(false);
    const [productCategoryToDelete, setProductCategoryToDelete] = useState<ProductCategory | null>(null);
    const [alertTitle, setAlertTitle] = useState('');


    // Fetch the product categories
    const { data: productcategoryData, mutate: mutateProductCategory, error } =
        useFrappeGetDocList<ProductCategory>("Product Category", {
            fields: ["name", "category_name", "catalogue_image"],
        });

    // Filter data based on search query
    const filteredData = productcategoryData?.filter((item) =>
        item.category_name.toLowerCase().includes(searchQuery.toLowerCase())
    );



    React.useEffect(() => {
        document.title='Product Catagory'
        if (showSuccessAlert) {
            const timer = setTimeout(() => {
                setShowSuccessAlert(false);
                // window.location.reload();
            }, 3000); 
            return () => clearTimeout(timer); // Cleanup timeout on component unmount
        }
    }, [showSuccessAlert]);

    const uploadFile = async (file: File) => {
        const formData = new FormData();
        formData.append("file", file, file.name);
        formData.append("is_private", "0");
        formData.append("folder", "");
        formData.append("file_name", file.name);

        try {
            const response = await axios.post(`/api/method/upload_file`, formData, {
                headers: {
                    Accept: "application/json",
                    "Content-Type": "multipart/form-data",
                },
            });
            if (response.data.message?.file_url) {
                return response.data.message.file_url;
            } else {
                console.error("File URL not found in response:", response.data);
                return null;
            }
        } catch (error) {
            console.error("Error uploading file:", error);
            return null;
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const fileUrls: string[] = [];

        if (files) {
            for (const file of Array.from(files)) {
                const fileUrl = await uploadFile(file);
                if (fileUrl) {
                    fileUrls.push(fileUrl);
                }
            }
        }

        const updatedProductImage = fileUrls.length > 0 ? fileUrls[0] : existingImages[0];

        const data = {
            category_name: productCatalogue,
            catalogue_image: updatedProductImage,
        };

        try {
            await axios.post(`/api/resource/Product Category`, data, {
                headers: {
                    "Content-Type": "application/json",
                },
            });

            // setShowSuccessAlert(true);
            // setTimeout(() => setShowSuccessAlert(false), 3000);
            setAlertTitle('Success');
            setAlertMessage('Announcement added successfully!');
            setShowSuccessAlert(true);
            handleCloseModal();
            mutateProductCategory(); // Refresh the product category list
        } catch (error) {
            console.error("Error submitting the form:", error);
            alert("An error occurred while submitting the form. Please try again.");
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFiles = e.target.files;
        if (selectedFiles) {
            setFiles(selectedFiles);
            const filePreviews = Array.from(selectedFiles).map((file) =>
                URL.createObjectURL(file)
            );
            setPreviews(filePreviews);
        }
    };

    const handleCloseModal = () => {
        setShowAddCatalogueForm(false);
    };

    const handleDeleteProductCategory = (item: ProductCategory) => {
        setProductCategoryToDelete(item);
        setIsConfirmDeleteModalOpen(true);
    };

    // const confirmDelete = async () => {
    //     if (!productCategoryToDelete) return;

    //     try {
    //         const response = await axios.delete(`/api/resource/Product Category/${productCategoryToDelete.name}`, {
    //             headers: {
    //                 'Content-Type': 'application/json',
    //             }
    //         });
    //         console.log("delete response",response);

    //         if (response.data.data === 'ok') {
    //             setAlertMessage('Product Category deleted successfully!');
    //             setShowSuccessAlert(true);
    //             setTimeout(() => setShowSuccessAlert(false), 3000);
    //             setIsConfirmDeleteModalOpen(false);
    //             mutateProductCategory(); // Refresh the product category list
    //         }
    //     } catch (error) {
    //         console.error('Error deleting Product Category:', error);
    //         alert('Failed to delete Product Category.');
    //     }
    // };

    const confirmDelete = async () => {
        if (!productCategoryToDelete) return;
    
        try {
            const response = await axios.delete(`/api/resource/Product Category/${productCategoryToDelete.name}`, {
                headers: {
                    'Content-Type': 'application/json',
                }
            });
    
            console.log("delete response", response);
    
            if (response.status === 202 && response.data === 'ok') {
                setAlertMessage('Product Category deleted successfully!');
                setShowSuccessAlert(true);
                setTimeout(() => setShowSuccessAlert(false), 3000);
                setIsConfirmDeleteModalOpen(false);
                mutateProductCategory(); // Refresh the product category list
            } else {
                console.warn('Unexpected response:', response);
                alert('Failed to delete Product Category. Please try again.');
            }
        } catch (error) {
            if (error.response) {
                // Check if the error is a LinkExistsError and extract the message
                if (error.response.data && error.response.data.exception) {
                    const exceptionMessage = error.response.data.exception;
                    
                    // Check if the message contains 'LinkExistsError' and display the custom message
                    if (exceptionMessage.includes('LinkExistsError')) {
                        const linkedMessage = "This Product Category is linked with a Product. Please unlink it before deletion.";
                        alert(linkedMessage);
                    } else {
                        alert(exceptionMessage);  // Show the full exception message if it's not a link error
                    }
                } else {
                    alert('Failed to delete Product Category. Please try again.');
                }
            } else {
                console.error('Error deleting Product Category:', error);
                alert('Failed to delete Product Category. Please try again.');
            }
        }
    };
    

    const cancelDelete = () => {
        setIsConfirmDeleteModalOpen(false);
        setProductCategoryToDelete(null);
    };

    return (
        <>
            <Pageheader
                currentpage={"Product Catalogue"}
                activepage={"/product-catalogue"}
                activepagename="Product Catalogue"
            />

            <div className="grid grid-cols-12 gap-x-6 bg-white mt-5 rounded-lg shadow-lg">
                <div className="xl:col-span-12 col-span-12">
                    <TableBoxComponent
                        title="Product Catalogue"
                        onSearch={(e) => setSearchQuery(e.target.value)}
                        onAddButtonClick={() => setShowAddCatalogueForm(true)}
                        buttonText="Add Product Catalogue"
                        showButton={true}
                        showFromDate={false}
                        showToDate={false}
                        onDateFilter={(from, to) => console.log(from, to)}
                    />

                    <div className="box-body m-5">
                        <TableComponent<ProductCategory>
                            columns={[
                                { header: 'Category Name', accessor: 'category_name' },
                                {
                                    header: 'Image',
                                    accessor: 'catalogue_image',
                                    render: (row) => (
                                        <img
                                            src={row.catalogue_image}
                                            alt={row.category_name}
                                            className="w-16 h-16 object-cover rounded"
                                        />
                                    ),
                                },
                            ]}
                            data={filteredData || []}
                            currentPage={currentPage}
                            itemsPerPage={itemsPerPage}
                            handlePrevPage={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                            handleNextPage={() => setCurrentPage((prev) => prev + 1)}
                            handlePageChange={(page) => setCurrentPage(page)}
                            showProductQR={false}
                            showEdit={true}
                            onEdit={(id) => console.log(`Edit ${id}`)}
                            showDelete={true}
                            onDelete={handleDeleteProductCategory}
                            showView={false}
                        />
                    </div>
                </div>
            </div>


                {showAddCatalogueForm && (
                    <div className="grid grid-cols-12 gap-x-6 p-6 fixed inset-0 z-50 items-center justify-center bg-black bg-opacity-50">
                        <div className="col-span-12 flex justify-center items-center">
                            <div className="xl:col-span-3 col-span-12 bg-white mt-5 rounded-lg shadow-lg p-6">
                                <div className="box-header">
                                <div className="ti-modal-header flex justify-between border-b p-4">
                            <h6 className="modal-title text-1rem font-semibold text-primary">Add Product Catalogue</h6>
                            <button onClick={handleCloseModal} type="button" className="text-1rem font-semibold text-defaulttextcolor">
                                <span className="sr-only">Close</span>
                                <i className="ri-close-line"></i>
                            </button>
                        </div>
                                </div>
                                <div className="box-body w-[400px] max-w-[400px]">
                                    <form onSubmit={handleSubmit}>
                                        <div className="grid grid-cols-12 gap-4">
                                            <div className="xl:col-span-12 col-span-12">
                                                <label
                                                    htmlFor="categoryName"
                                                    className="block text-defaulttextcolor text-xs font-medium mb-1"
                                                >
                                                    Product Category
                                                </label>
                                                <input
                                                    type="text"
                                                    id="categoryName"
                                                    className="form-control w-full !rounded-md !bg-light text-defaulttextcolor text-xs font-medium"
                                                    placeholder="Enter Product Category"
                                                    value={productCatalogue}
                                                    onChange={(e) => setProductCatalogue(e.target.value)}
                                                />
                                            </div>
                                            <div className="xl:col-span-12 col-span-12">
                                                <label
                                                    htmlFor="product-images-add"
                                                    className="block text-defaulttextcolor text-xs font-medium mb-1"
                                                >
                                                    Category Image
                                                </label>
                                                <input
                                                    type="file"
                                                    multiple
                                                    className="form-control w-full !rounded-md !bg-light text-defaulttextcolor text-xs font-medium p-2 border border-[#949eb7]"
                                                    id="product-images-add"
                                                    onChange={handleFileChange}
                                                />
                                                <div className="flex gap-4 mt-2">
                                                    {previews.map((preview, index) => (
                                                        <img
                                                            key={index}
                                                            src={preview}
                                                            alt={`preview-${index}`}
                                                            className="w-32 h-32 object-cover"
                                                        />
                                                    ))}
                                                </div>
                                            </div>
                                            <div className="xl:col-span-12 col-span-12 text-center">
                                                <button
                                                    type="submit"
                                                    className="ti-btn ti-btn-primary-full w-full bg-primary"
                                                >
                                                    Submit
                                                </button>
                                            </div>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                )}


    {isConfirmDeleteModalOpen && (
                    <DangerAlert
                        type="danger"
                        message={`Are you sure you want to delete this catagory?`}
                        onDismiss={cancelDelete}
                        onConfirm={confirmDelete}
                        cancelText="Cancel"
                        confirmText="Continue"
                    />
                )}

{showSuccessAlert && (
                <SuccessAlert
                    title={alertTitle}
                    showButton={false}
                    showCancleButton={false}
                    showCollectButton={false}
                    showAnotherButton={false}
                    showMessagesecond={false}
                    message={alertMessage}
                />
            )}
            </>
        );
    };

    export default ProductCatalogue;
