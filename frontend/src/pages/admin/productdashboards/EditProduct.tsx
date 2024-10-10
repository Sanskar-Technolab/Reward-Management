import React, { Fragment, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Pageheader from '../../../components/common/pageheader/pageheader';
import SunEditor from 'suneditor-react';
import 'suneditor/dist/css/suneditor.min.css';
import '../../../assets/css/style.css';
import '../../../assets/css/pages/admindashboard.css';
import axios from 'axios';
import SuccessAlert from '../../../components/ui/alerts/SuccessAlert';
import { useFrappeGetDocList, useFrappePostCall } from 'frappe-react-sdk';

interface EditProduct {
    product_name?: string;
    productId?: string;
    points?: number;
    product_image?: string;
}
interface ProductCategory {
    name: string,
    category_name: string
}

const EditProduct: React.FC = () => {
    const [files, setFiles] = useState<File[]>([]);
    const [previews, setPreviews] = useState<string[]>([]);
    const [existingImages, setExistingImages] = useState<string[]>([]);
    const [productName, setProductName] = useState('');
    const [rewardPoints, setRewardPoints] = useState('');
    const [productPrice, setproductPrice] = useState('');
    const [rewardPercent, setRewardPercent] = useState('');
    const [productDescription, setProductDescription] = useState('');
    const [productCategory, setProductCategory] = useState('');
    const navigate = useNavigate();
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('product');
    const [showSuccessAlert, setShowSuccessAlert] = useState(false);
    const [newCategory, setNewCategory] = useState('');
    const [showAddCategoryModal, setShowAddCategoryModal] = useState(false);



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


      // Fetch the product categories
      const { data: productcategoryData, error } = useFrappeGetDocList<ProductCategory>('Product Category', {
        fields: ['name', 'category_name']
    });


    useEffect(() => {
        if (productPrice && rewardPercent) {
            const calculatedPoints = (parseFloat(productPrice) * parseFloat(rewardPercent)) / 100;
            setRewardPoints(calculatedPoints.toFixed(2)); 
        } else {
            setRewardPoints(rewardPoints);
        }

        if (showSuccessAlert) {
            const timer = setTimeout(() => {
                setShowSuccessAlert(false);
                navigate('/product-master'); 
            }, 3000); 
            return () => clearTimeout(timer);
        }
    }, [showSuccessAlert, navigate, productPrice, rewardPercent]);

    useEffect(() => {
        document.title='Edit Product';
        const fetchProductData = async () => {
            if (!productId) return;

            try {
                const response = await axios.get(`/api/method/reward_management.api.product_master.get_tableproduct_detail`, {
                    params: { product_id: productId },
                    headers: {

                        'Content-Type': 'application/json',
                    }
                });

                if (response.data && response.data.message.message) {
                    console.log("Edit Product Data",response);
                    const product = response.data.message.message;

                    setProductName(product.product_name || '');
                    setRewardPoints(product.reward_points || '');
                    setproductPrice(product.product_price || '');
                    setProductDescription(product.discription || '');
                    setProductCategory(product.category || '');

                    const images = Array.isArray(product.product_image) ? product.product_image : [product.product_image].filter(Boolean);
                    setExistingImages(images);
                } else {
                    console.warn("Product details not found in response.");
                }
            } catch (error) {
                console.error('Error fetching product data:', error);
                const errorMessage = error.response?.data?.message || error.message;
                alert(`Error fetching product data: ${errorMessage}`);
            }
        };

        fetchProductData();
    }, [productId]);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFiles = event.target.files;
        if (selectedFiles) {
            const fileArray = Array.from(selectedFiles);
            setFiles(fileArray);

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
            console.error("Error uploading file:", error);
            return null;
        }
    };

    const resetForm = () => {
        window.location.reload();
    };

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        const fileUrls = [];

        for (const file of files) {
            const fileUrl = await uploadFile(file);
            if (fileUrl) {
                fileUrls.push(fileUrl);
            }
        }

        const updatedProductImage = fileUrls.length > 0 ? fileUrls[0] : existingImages[0];

        const data = {
            product_name: productName,
            category: productCategory,
            reward_points: rewardPoints,
            product_price: productPrice,
            discription: productDescription,
            product_image: updatedProductImage
        };

        try {
            await axios.put(`/api/resource/Product/${productId}`, data, {
                headers: {

                    'Content-Type': 'application/json',
                }
            });
            setShowSuccessAlert(true);
        } catch (error) {
            console.error('Error updating product:', error);
            alert('An error occurred while updating the product. Please try again.');
        }
    };


    const handleCloseModal = () => {
        setShowAddCategoryModal(false);

    };


    return (
        <Fragment>

            <Pageheader 
                currentpage={"Edit Product"} 
                activepage={"/product-master"} 
                mainpage={"/product-master"} 
                activepagename='Product Master' 
                mainpagename='Edit Product' 
            />
            {/* <Pageheader currentpage="Edit Product" activepage="Product Master" mainpage="Edit Product" /> */}
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
                                                        placeholder="Product Price"
                                                        value={productPrice}
                                                        onChange={(e) => setproductPrice(e.target.value)}
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
                                                        
                                                        readOnly
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
                                            <div className="grid grid-cols-12 gap-4">
                                                {/* Product Category Dropdown */}
                                                <div className="xl:col-span-12 col-span-12">
                                                    <label htmlFor="product-category-add" className="form-label text-sm font-semibold text-defaulttextcolor">Category</label>
                                                    <div className="flex items-center mt-[8px]">
                                                        <select
                                                            id="product-category-add"
                                                            name="product-category-add"
                                                            className="w-full border border-defaultborder text-defaultsize text-defaulttextcolor rounded-[0.5rem] mr-1" 
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
                                                <div className="xl:col-span-12 col-span-12 ">
                                                    <label htmlFor="product-images-add" className="form-label text-sm font-semibold text-defaulttextcolor">Product Image</label>
                                                    <input
                                                        type="file"
                                                        multiple
                                                        className="form-control w-full border border-defaultborder rounded-[0.5rem] mt-2 p-2"
                                                        id="product-images-add"
                                                        onChange={handleFileChange}
                                                    />
                                                    <div className="flex gap-4 mt-2">
                                                        {previews.map((preview, index) => (
                                                            <img key={index} src={preview} alt={`preview-${index}`} className="w-32 h-32 object-cover" />
                                                        ))}
                                                    </div>
                                                    {existingImages.length > 0 && (
                                                        <div className="flex gap-4 mt-2">
                                                            {existingImages.map((image, index) => (
                                                                <img key={index} src={image} alt={`existing-${index}`} className="w-32 h-32 object-cover" />
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex justify-end gap-3 mt-6">
                                        <button
                                            type="button"
                                            className="ti-btn ti-btn-success bg-defaulttextcolor ti-btn text-white !font-medium m-1"
                                            onClick={resetForm} 
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            className="ti-btn ti-btn-primary !font-medium m-1"
                                        >
                                            Edit Product
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
                                <SuccessAlert
                                    showButton={false}
                                    showCancleButton={false}
                                    showCollectButton={false}
                                    showAnotherButton={false}
                                    showMessagesecond = {false}
                                    message="Product updated successfully!" />
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </Fragment>
    );
};

export default EditProduct;
