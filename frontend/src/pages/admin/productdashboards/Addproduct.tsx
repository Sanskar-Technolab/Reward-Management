import React, { Fragment, useState, useEffect } from 'react';
import Pageheader from '../../../components/common/pageheader/pageheader';
import SunEditor from 'suneditor-react';
import { useNavigate } from 'react-router-dom';
import 'suneditor/dist/css/suneditor.min.css'; // Import SunEditor styles
import SuccessAlert from '../../../components/ui/alerts/SuccessAlert';
import '../../../assets/css/style.css';
import '../../../assets/css/pages/admindashboard.css';
import { useFrappeGetDocList, useFrappePostCall } from 'frappe-react-sdk';

import axios from 'axios';


interface ProductCategory {
    name: string,
    category_name: string
}

const AddProduct: React.FC = () => {
 
    const [files, setFiles] = useState<File[]>([]);
    const [previews, setPreviews] = useState<string[]>([]);
    const [productName, setProductName] = useState('');
    const [rewardPoints, setRewardPoints] = useState('');
    const [productPrice, setProductPrice] = useState('');
    const [rewardPercent, setRewardPercent] = useState('');
    const [productDescription, setProductDescription] = useState('');
    const [productCategory, setProductCategory] = useState('');
    const [newCategory, setNewCategory] = useState('');
    const [showSuccessAlert, setShowSuccessAlert] = useState(false);
    const navigate = useNavigate(); // Initialize navigate
    const [showAddCategoryModal, setShowAddCategoryModal] = useState(false);
    const [showRewardPercent, setShowRewardPercent] = useState(false); 



    const { call: createCategory } = useFrappePostCall('reward_management.api.product_master.add_category');


    const handleAddCategory = async (event: any) => {
        event.preventDefault();
        console.log("first")
        try {
            const response = await createCategory({ productCategory: newCategory });
            if (response) {
                console.log("product category name:", response);
                setProductCategory(response.category_name);
                setNewCategory('');
                window.location.reload();
                setShowAddCategoryModal(false);
            }
        } catch (error) {
            console.error("Error adding category:", error);
        }
    };




    // Handle file input change
    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFiles = event.target.files;
        if (selectedFiles) {
            const fileArray = Array.from(selectedFiles);
            setFiles(fileArray);

            // Create image previews
            const previewArray = fileArray.map(file => URL.createObjectURL(file));
            setPreviews(previewArray);
        }
    };

    const uploadFile = async (file: File) => {
        const formData = new FormData();
        formData.append("file", file, file.name);
        formData.append("is_private", "0");
        formData.append("folder", "");
        formData.append("file_name", file.name);

        try {
            const response = await axios.post(`/api/method/upload_file`, formData, {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'multipart/form-data'
                }
            });

            if (response.data.message && response.data.message.file_url) {
                return response.data.message.file_url;
            } else {
                console.error("File URL not found in response:", response.data);
                return null;
            }
        } catch (error) {
            console.error("Error uploading file:", error.response ? error.response.data : error.message);
            return null;
        }
    };

    const addProduct = async (fileUrls: string[]) => {
        const data = {
            productName: productName,
            rewardPoints: rewardPoints,
            productPrice: productPrice,
            discription: productDescription,
            productCategory,
            productImage: fileUrls.length > 0 ? fileUrls[0] : null // Assuming you use the first image if available
        };

        try {
            const response = await axios.post(`/api/method/reward_management.api.product_master.add_product`, data);
            console.log("Product added successfully:", response.data);
            setShowSuccessAlert(true);
            // Navigate after showing the success alert
            setTimeout(() => {
                navigate('/product-master');
            }, 3000); // Delay for 3 seconds
        } catch (error) {
            console.error("Error submitting form", error);
        }
    };

    // Reset all form fields
    const resetForm = () => {
        setFiles([]);
        setPreviews([]);
        setProductName('');
        setRewardPoints('');
        setProductPrice('');
        setRewardPercent('');
        setProductDescription('');
        setProductCategory('');
    };


    // Fetch the product categories
    const { data: productcategoryData, error } = useFrappeGetDocList<ProductCategory>('Product Category', {
        fields: ['name', 'category_name']
    });

    // Calculate reward points whenever product price or reward percent changes
    useEffect(() => {


        document.title = 'Add Product';
        if (productPrice && rewardPercent) {
            const calculatedPoints = (parseFloat(productPrice) * parseFloat(rewardPercent)) / 100;
            setRewardPoints(calculatedPoints.toFixed(2)); // Round to 2 decimal places
        } else {
            setRewardPoints('');
        }

        if (showSuccessAlert) {
            const timer = setTimeout(() => {
                setShowSuccessAlert(false);
                navigate('/product-master'); // Navigate after success alert is hidden
            }, 3000); // Hide alert after 3 seconds
            return () => clearTimeout(timer);
        }
    }, [productPrice, rewardPercent, showSuccessAlert, productcategoryData]);

    // Basic form submission handler
    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        const fileUrls = [];

        for (const file of files) {
            const fileUrl = await uploadFile(file);
            if (fileUrl) {
                fileUrls.push(fileUrl);
            }
        }

        if (fileUrls.length === files.length) {
            await addProduct(fileUrls);
        }
    };

    const handleCloseModal = () => {
        setShowAddCategoryModal(false);

    };

    return (
        <>
         <Pageheader 
                currentpage={"Add Product"} 
                activepage={"/product-master"} 
                mainpage={"/add-product"} 
                activepagename='Product Master' 
                mainpagename='Add Product' 
            />
            {/* <Pageheader currentpage="Add Product" activepage="Product Master" mainpage="Add Product" /> */}
            <div className="grid grid-cols-12 gap-6 bg-white mt-5 rounded-lg shadow-lg">
                <div className="xl:col-span-12 col-span-12">
                    <div className="box">
                        <div className="box-body add-products !p-0">
                            <form onSubmit={handleSubmit}>
                                <div className="p-6">
                                    <div className="grid grid-cols-12 md:gap-x-[3rem] gap-0">
                                        <div className="xxl:col-span-6 xl:col-span-12 lg:col-span-12 md:col-span-6 col-span-12">
                                            <div className="grid grid-cols-12 gap-4">
                                                <div className="xl:col-span-12 col-span-12">
                                                    <label htmlFor="product-name-add" className="form-label text-sm font-semibold text-defaulttextcolor">Product Name</label>
                                                    <input
                                                        type="text"
                                                        className="form-control w-full border border-defaultborder text-defaultsize text-defaulttextcolor rounded-[0.5rem] mt-2"
                                                        id="product-name-add"
                                                        placeholder="Name"
                                                        value={productName}
                                                        onChange={(e) => setProductName(e.target.value)}
                                                        required
                                                    />
                                                </div>
                                                <div className="xl:col-span-12 col-span-12">
                                                    <label htmlFor="product-price-add" className="form-label text-sm font-semibold text-defaulttextcolor">Product Price</label>
                                                    <input
                                                        type="text"
                                                        className="form-control w-full text-defaultsize text-defaulttextcolor border border-defaultborder rounded-[0.5rem] mt-2"
                                                        id="product-price-add"
                                                        placeholder="Price"
                                                        value={productPrice}
                                                        onChange={(e) => setProductPrice(e.target.value)}
                                                        required
                                                    />
                                                </div>



                                                <div className="xl:col-span-12 col-span-12">
                                                    <label htmlFor="product-cost-add" className="form-label text-sm font-semibold text-defaulttextcolor">Reward Points</label>
                                                    <input
                                                        type="text"
                                                        className="form-control w-full text-defaultsize text-defaulttextcolor border border-defaultborder rounded-[0.5rem] mt-2"
                                                        id="product-cost-add"
                                                        placeholder="Reward points"
                                                        value={rewardPoints}
                                                        onChange={(e) => setRewardPoints(e.target.value)}
                                                        readOnly={showRewardPercent} // Make read-only if the checkbox is checked
                                                    />
                                                </div>

                                                <div className="xl:col-span-12 col-span-12 mb-4">
                                                    <label className="form-label text-sm font-semibold text-defaulttextcolor">Product Description</label>
                                                    <div id="product-features" className="mt-2">
                                                        <SunEditor
                                                            setContents={productDescription}
                                                            onChange={setProductDescription}
                                                            setOptions={{
                                                                buttonList: [
                                                                    ['undo', 'redo'],
                                                                    ['formatBlock', 'font', 'fontSize'],
                                                                    ['bold', 'underline', 'italic'],
                                                                    ['fontColor', 'hiliteColor'],
                                                                    ['align', 'list', 'lineHeight'],
                                                                    ['table', 'link'],
                                                                    ['fullScreen', 'showBlocks', 'codeView']
                                                                ]
                                                            }}
                                                            height="200px"
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="xxl:col-span-6 xl:col-span-12 lg:col-span-12 md:col-span-6 col-span-12 gap-4">
                                            <div className='grid grid-cols-12 gap-4'>
                                                {/* Product Category Dropdown */}
                                                <div className="xl:col-span-12 col-span-12">
                                                    <label htmlFor="product-category-add" className="form-label text-sm font-semibold text-defaulttextcolor">Category</label>
                                                    <div className="flex items-center mt-[8px]">
                                                        <select
                                                            id="product-category-add"
                                                            name="product-category-add"
                                                            className="w-full border border-defaultborder text-defaultsize text-defaulttextcolor rounded-[0.5rem] mr-1" // added margin-right
                                                            value={productCategory}
                                                            onChange={(e) => setProductCategory(e.target.value)}
                                                            required
                                                        >
                                                            <option value="">Select a category</option>
                                                            {productcategoryData && productcategoryData.map((category) => (
                                                                <option key={category.name} value={category.category_name}>
                                                                    {category.category_name}
                                                                </option>
                                                            ))}
                                                        </select>
                                                        <button
                                                            type="button"
                                                            className="ti-btn ti-btn-primary bg-primary p-3 rounded-[0.5rem]" 
                                                            onClick={() => setShowAddCategoryModal(true)}
                                                        >
                                                            <i className="fas fa-plus" /> 
                                                        </button>
                                                    </div>
                                                </div>


                                                    {/* Toggle Checkbox for Reward Percent */}
                                                    <div className="xl:col-span-12 col-span-12 rounded-full">
                                                    <label className="form-label text-sm font-semibold text-defaulttextcolor ">
                                                        <input
                                                            type="checkbox"
                                                            className="mr-2"
                                                            checked={showRewardPercent}
                                                            onChange={() => setShowRewardPercent(!showRewardPercent)}
                                                        />
                                                        Add Reward Percent
                                                    </label>
                                                </div>
                                                {/* Conditionally render Reward Percent input */}
                                                {showRewardPercent && (
                                                    <div className="xl:col-span-12 col-span-12">
                                                        <label htmlFor="reward-percent-add" className="form-label text-sm font-semibold text-defaulttextcolor">Set Reward Percent</label>
                                                        <input
                                                            type="text"
                                                            className="form-control w-full text-defaultsize text-defaulttextcolor border border-defaultborder rounded-[0.5rem] mt-2"
                                                            id="reward-percent-add"
                                                            placeholder="Set Reward Percent"
                                                            value={rewardPercent}
                                                            onChange={(e) => setRewardPercent(e.target.value)}
                                                            required
                                                        /> 
                                                    </div>
                                                )}

                                            
                                                <div className="xl:col-span-12 col-span-12 product-documents-container ">
                                                    <p className="font-semibold mb-2 text-sm text-defaulttextcolor">Product Image</p>
                                                    <input
                                                        type="file"
                                                        accept="image/*"
                                                        multiple
                                                        onChange={handleFileChange}
                                                        className="form-control w-full text-defaultsize text-defaulttextcolor border border-defaultborder rounded-[0.5rem] p-2 "
                                                    />
                                                    <div className="image-preview-grid mt-4">
                                                        {previews.map((src, index) => (
                                                            <img key={index} src={src} alt={`Preview ${index}`} className="preview-image" />
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="px-6 py-4 border-t border-dashed dark:border-defaultborder/10 sm:flex justify-end">
                                        <button
                                            type="submit"
                                            className="ti-btn ti-btn-primary !font-medium m-1">
                                            Add Product<i className="bi bi-plus-lg ms-2"></i>
                                        </button>
                                        <button
                                            type="button"
                                            className="ti-btn ti-btn-success bg-defaulttextcolor ti-btn text-white !font-medium m-1"
                                            onClick={resetForm} 
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </div>
                            </form>
                          
                            {showAddCategoryModal && (
                                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                                    <div className="modal-overlay" onClick={handleCloseModal} />
                                    <div className="modal-container bg-white rounded-lg shadow-lg w-full max-w-lg">
                                        <div className="flex justify-between border-b p-4 ">
                                            <h6 className="text-sm text-center text-defaulttextcolor font-semibold ">Add New Category</h6>
                                            <button onClick={handleCloseModal} type="button" className="text-1rem font-semibold text-defaulttextcolor">
                                                <span className="sr-only">Close</span>
                                                <i className="ri-close-line"></i>
                                            </button>
                                        </div>
                                        <div className="p-4 overflow-auto flex-1">
                                            <input
                                                type="text"
                                                className="form-control w-full border border-defaultborder text-defaultsize text-defaulttextcolor rounded-[0.5rem] mt-2"
                                                placeholder="Category Name"
                                                value={newCategory}
                                                onChange={(e) => setNewCategory(e.target.value)}
                                            />
                                            <div className="border-t border-defaultborder p-4 flex justify-end ">
                                                <button
                                                    className="ti-btn ti-btn-primary bg-primary me-3"
                                                    onClick={handleAddCategory}
                                                >
                                                    Save
                                                </button>
                                                <button
                                                    className="bg-defaulttextcolor ti-btn text-white"
                                                    onClick={handleCloseModal}
                                                >
                                                    Cancel
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                            {showSuccessAlert && (
                                <SuccessAlert showButton={false}
                                    showCancleButton={false}
                                    showCollectButton={false}
                                    showAnotherButton={false}
                                    showMessagesecond={false} message="New Product Added successfully!" />
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default AddProduct;
