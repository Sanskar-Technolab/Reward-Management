import React, { useState, useEffect } from 'react';
import Pageheader from '../../../components/common/pageheader/pageheader';
import SunEditor from 'suneditor-react';
import { useNavigate } from 'react-router-dom';
import 'suneditor/dist/css/suneditor.min.css'; // Import SunEditor styles
import SuccessAlert from '../../../components/ui/alerts/SuccessAlert';
import '../../../assets/css/style.css';
import '../../../assets/css/pages/admindashboard.css';
import { useFrappeGetDocList, useFrappePostCall } from 'frappe-react-sdk';
import { Notyf } from 'notyf';
import 'notyf/notyf.min.css';


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
    // const [productCategory, setProductCategory] = useState('');
    const [productCategory, setProductCategory] = useState<{ category_name: string; id: number }[]>([]);

    const [newCategory, setNewCategory] = useState('');
    const [pointReward, setPointReward] = useState('');
    const [rewardAmount, setRewardAmount] = useState('');
    const [showSuccessAlert, setShowSuccessAlert] = useState(false);
    const navigate = useNavigate();
    const [showAddCategoryModal, setShowAddCategoryModal] = useState(false);
    const [showRewardPercent, setShowRewardPercent] = useState(false);
    // const [currentPage, setCurrentPage] = useState<number>(1);
    // const [itemsPerPage] = useState<number>(10);
    // const [pointConversionData, setPointConversionData] = useState<PointConversion[]>([]);



    const notyf = new Notyf({
        position: {
            x: 'right',
            y: 'top',
        },
        duration: 3000,
    });



    const { call: createCategory } = useFrappePostCall('reward_management.api.product_master.add_category');


    const handleAddCategory = async (event: any) => {
        event.preventDefault();
        // console.log("first");

        try {
            const response = await createCategory({ productCategory: newCategory });

            if (response) {
                // console.log("product category name:", response);

                // Correctly update state with the new category
                setProductCategory(prevCategories => [
                    ...prevCategories,
                    { category_name: response.category_name, id: response.category_id }
                ]);

                setNewCategory('');

                setShowAddCategoryModal(false);
            }
        } catch (error) {
            console.log("Error adding category:", error);
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
                console.log("File URL not found in response:", response.data);
                return null;
            }
        } catch (error) {
            console.log("Error uploading file:", error.response ? error.response.data : error.message);
            return null;
        }
    };

    // const isValidNumber = (title: string) => {
    //     // Regex to allow only numbers
    //     const regex = /^[0-9]+$/;
    //     return regex.test(title);
    // };
    const isValidNumber = (title: string) => {
        // Regex to allow integers and floats like 123, 0.001, .5, 123.
        const regex = /^(\d+(\.\d*)?|\.\d+)$/;
        return regex.test(title);
    };
    

    const addProduct = async (fileUrls: string[]) => {
        const missingFields: string[] = [];

        if (!productName) missingFields.push("Product Name");
        if (!rewardPoints) missingFields.push("Reward Points");
        if (!pointReward) missingFields.push("Point Reward");
        if (!rewardAmount) missingFields.push("Reward Amount");
        if (!productPrice) missingFields.push("Product Price");
        if (!productCategory) missingFields.push("Product Category");

        if (missingFields.length > 0) {
            const errorMessage = `Please fill the following field${missingFields.length > 1 ? 's' : ''}: ${missingFields.join(', ')}`;
            // console.log(errorMessage);
            notyf.error(errorMessage);
            return;
        }
           // Validate the inputs

        if (!isValidNumber(productPrice)) {
            notyf.error('Product Price must be a number.');
            return false;
        }   

        if (!isValidNumber(rewardPoints)) {
            notyf.error('Reward Points must be a number.');
            return false;
        }

        if(rewardPercent){
            if(!isValidNumber(rewardPercent)){
                        notyf.error('Reward Percent must be a number.');
                        return false
                    }
        }
        
         if (!isValidNumber(pointReward)) {
            notyf.error('Point must be a number.');
            return false;
        }
        if (!isValidNumber(rewardAmount)) {
            notyf.error('Amount must be a number.');
            return false;
        }

        const data = {
            productName: productName,
            rewardPoints: rewardPoints,
            pointReward: pointReward,
            rewardAmount: rewardAmount,
            productPrice: productPrice,
            discription: productDescription,
            productCategory,
            productImage: fileUrls.length > 0 ? fileUrls[0] : null
        };

        try {
            await axios.post(`/api/method/reward_management.api.product_master.add_product`, data);

            // const response = await axios.post(`/api/method/reward_management.api.product_master.add_product`, data);
            // console.log("Product added successfully:", response.data);
            setShowSuccessAlert(true);
            // Navigate after showing the success alert
            setTimeout(() => {
                navigate('/product-master');
            }, 3000);
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
        setRewardAmount('');
        setPointReward('');
        setProductPrice('');
        setRewardPercent('');
        setProductDescription('');
        setProductCategory('');
    };

    const handlecancel = () => {
        navigate("/product-master");
    }



    // Fetch the product categories
    const { data: productcategoryData, error } = useFrappeGetDocList<ProductCategory>('Product Category', {
        fields: ['name', 'category_name']
    });

    // Calculate reward points whenever product price or reward percent changes
    useEffect(() => {


        document.title = 'Add Product';
        if (productPrice && rewardPercent) {
            const calculatedPoints = (parseFloat(productPrice) * parseFloat(rewardPercent)) / 100;
            setRewardPoints(calculatedPoints.toFixed(2));
        } else {
            setRewardPoints('');
        }

        if (showSuccessAlert) {
            const timer = setTimeout(() => {
                setShowSuccessAlert(false);
                navigate('/product-master');
            }, 3000);
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
                    <div className="">
                        <div className="box-body add-products !p-0">

                            <form onSubmit={handleSubmit}>
                                <div className="p-6">
                                    <div className="grid grid-cols-12 md:gap-x-[3rem] gap-0">
                                        <div className="xxl:col-span-6 xl:col-span-12 lg:col-span-12 md:col-span-6 col-span-12">
                                            <div className="grid grid-cols-12 gap-4">
                                                <div className="xl:col-span-12 col-span-12">
                                                    <label htmlFor="product-name-add" className="form-label text-sm font-semibold text-defaulttextcolor">Product Name<span style={{ color: 'red' }}>*</span></label>
                                                    <input
                                                        type="text"
                                                        className="outline-none focus:outline-none focus:ring-0 no-outline focus:border-[#dadada] form-control w-full border border-defaultborder text-defaultsize text-defaulttextcolor rounded-[0.5rem] mt-2"
                                                        id="product-name-add"
                                                        placeholder="Name"
                                                        value={productName}
                                                        onChange={(e) => setProductName(e.target.value)}
                                                        required
                                                        onInvalid={(e) => (e.target as HTMLInputElement).setCustomValidity("Product Name is required.")}
                                                        onInput={(e) => (e.target as HTMLInputElement).setCustomValidity("")}
                                                    />
                                                </div>
                                                <div className="xl:col-span-12 col-span-12">
                                                    <label htmlFor="product-price-add" className="form-label text-sm font-semibold text-defaulttextcolor">Product Price<span style={{ color: 'red' }}>*</span></label>
                                                    <input
                                                        type="text"
                                                        className="outline-none focus:outline-none focus:ring-0 no-outline focus:border-[#dadada] form-control w-full text-defaultsize text-defaulttextcolor border border-defaultborder rounded-[0.5rem] mt-2"
                                                        id="product-price-add"
                                                        placeholder="Price"
                                                        value={productPrice}
                                                        onChange={(e) => setProductPrice(e.target.value)}
                                                        required
                                                        onInvalid={(e) => (e.target as HTMLInputElement).setCustomValidity("Please enter a valid price.")}
                                                        onInput={(e) => (e.target as HTMLInputElement).setCustomValidity("")}
                                                    />
                                                </div>



                                                <div className="xl:col-span-12 col-span-12">
                                                    <label htmlFor="product-cost-add" className="form-label text-sm font-semibold text-defaulttextcolor">Reward Points<span style={{ color: 'red' }}>*</span></label>
                                                    <input
                                                        type="text"
                                                        className="outline-none focus:outline-none focus:ring-0 no-outline focus:border-[#dadada] form-control w-full text-defaultsize text-defaulttextcolor border border-defaultborder rounded-[0.5rem] mt-2"
                                                        id="product-cost-add"
                                                        placeholder="Reward points"
                                                        value={rewardPoints}
                                                        onChange={(e) => setRewardPoints(e.target.value)}
                                                        readOnly={showRewardPercent}
                                                        required={!showRewardPercent}
                                                        onInvalid={(e) =>
                                                            (e.target as HTMLInputElement).setCustomValidity("Reward Points are required.")
                                                        }
                                                        onInput={(e) =>
                                                            (e.target as HTMLInputElement).setCustomValidity("")
                                                        }

                                                    />
                                                </div>

                                                <div className="xl:col-span-12 col-span-12 mb-4">
                                                    <label className="outline-none focus:outline-none focus:ring-0 no-outline focus:border-[#dadada] form-label text-sm font-semibold text-defaulttextcolor">Product Description</label>
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
                                                    <label htmlFor="product-category-add" className="form-label text-sm font-semibold text-defaulttextcolor">Category<span style={{ color: 'red' }}>*</span></label>
                                                    <div className="flex items-center mt-[8px]">
                                                        <select
                                                            id="product-category-add"
                                                            name="product-category-add"
                                                            className="outline-none focus:outline-none focus:ring-0 no-outline focus:border-[#dadada]  w-full border border-defaultborder text-defaultsize text-defaulttextcolor rounded-[0.5rem] mr-1" // added margin-right
                                                            value={productCategory}
                                                            onChange={(e) => setProductCategory(e.target.value)}
                                                            required
                                                            onInvalid={(e) => (e.target as HTMLInputElement).setCustomValidity("Category cannot be empty.")}
                                                            onInput={(e) => (e.target as HTMLInputElement).setCustomValidity("")}
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
                                                            className="ti-btn text-white bg-primary p-3 rounded-[0.5rem]"
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
                                                        <label htmlFor="reward-percent-add" className="form-label text-sm font-semibold text-defaulttextcolor">Set Reward Percent<span style={{ color: 'red' }}>*</span></label>
                                                        <input
                                                            type="text"
                                                            className="outline-none focus:outline-none focus:ring-0 no-outline focus:border-[#dadada] form-control w-full text-defaultsize text-defaulttextcolor border border-defaultborder rounded-[0.5rem] mt-2"
                                                            id="reward-percent-add"
                                                            placeholder="Set Reward Percent"
                                                            value={rewardPercent}
                                                            onChange={(e) => setRewardPercent(e.target.value)}
                                                            required
                                                            onInvalid={(e) => (e.target as HTMLInputElement).setCustomValidity("Please enter a valid reward percent.")}
                                                            onInput={(e) => (e.target as HTMLInputElement).setCustomValidity("")}
                                                        />
                                                    </div>
                                                )}

                                                {/* point calculation */}
                                                <div className="xl:col-span-12 col-span-12">
                                                    <label htmlFor="point-reward-add" className="form-label text-sm font-semibold text-defaulttextcolor">Point<span style={{ color: 'red' }}>*</span></label>
                                                    <input
                                                        type="text"
                                                        className="outline-none focus:outline-none focus:ring-0 no-outline focus:border-[#dadada] form-control w-full text-defaultsize text-defaulttextcolor border border-defaultborder rounded-[0.5rem] mt-2"
                                                        id="point-reward-add"
                                                        placeholder="Set Reward Points"
                                                        value={pointReward}
                                                        onChange={(e) => setPointReward(e.target.value)}
                                                        required
                                                        onInvalid={(e) => (e.target as HTMLInputElement).setCustomValidity("Please enter the point reward.")}
                                                        onInput={(e) => (e.target as HTMLInputElement).setCustomValidity("")}
                                                    />
                                                </div>
                                                {/* amount per point */}
                                                <div className="xl:col-span-12 col-span-12">
                                                    <label htmlFor="reward-amount-add" className="form-label text-sm font-semibold text-defaulttextcolor">Amount per Point<span style={{ color: 'red' }}>*</span></label>
                                                    <input
                                                        type="text"
                                                        className="outline-none focus:outline-none focus:ring-0 no-outline focus:border-[#dadada] form-control w-full text-defaultsize text-defaulttextcolor border border-defaultborder rounded-[0.5rem] mt-2"
                                                        id="reward-amount-add"
                                                        placeholder="Set Amount Per Point"
                                                        value={rewardAmount}
                                                        onChange={(e) => setRewardAmount(e.target.value)}
                                                        required
                                                        onInvalid={(e) => (e.target as HTMLInputElement).setCustomValidity("Please enter the amount per point.")}
                                                        onInput={(e) => (e.target as HTMLInputElement).setCustomValidity("")}
                                                    />
                                                </div>

                                                {/* Product image */}

                                                <div className="xl:col-span-12 col-span-12 product-documents-container ">
                                                    <p className="font-semibold mb-2 text-sm text-defaulttextcolor">Product Image</p>
                                                    <input
                                                        type="file"
                                                        accept="image/*"
                                                        multiple
                                                        onChange={handleFileChange}
                                                        className="outline-none focus:outline-none focus:ring-0 no-outline focus:border-[#dadada] form-control w-full text-defaultsize text-defaulttextcolor border border-defaultborder rounded-[0.5rem] p-2 "
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
                                    <div className="px-6  py-4 border-t  dark:border-defaultborder sm:flex justify-end">
                                        <button
                                            type="submit"
                                            className="ti-btn bg-primary text-white !font-medium m-1">
                                            Add Product<i className="bi bi-plus-lg ms-2"></i>
                                        </button>
                                        <button
                                            type="button"
                                            className="ti-btn ti-btn-success bg-primary/20 ti-btn text-defaulttextcolor !font-medium m-1"
                                            // onClick={resetForm}
                                            onClick={handlecancel}
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </div>
                            </form>
                            {/* )}

                            {activeTab === 'pointConversion' && (
                                <div className="box-body m-5">
                                    <TableComponent<PointConversion>
                                        columns={[
                                            
                                            { header: 'Product Name', accessor: 'product_name' },
                                            { header: 'Reward Point', accessor: ' reward_point' },
                                            { header: 'Payout Amount', accessor: ' payout_amount' },
                                            { header: 'From Date', accessor: 'from_date' },
                                            {
                                                header: 'Status',
                                                accessor: 'scanned',
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
                                            'Product': 'text-[var(--primaries)] font-semibold',
                                        }}
                                    />
                                </div>

                            )}  */}

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
                                        <div className=" overflow-auto flex-1">
                                            <div className='p-4 overflow-auto '>
                                                <label htmlFor="question" className="form-label text-sm text-defaulttextcolor font-semibold">Category</label>

                                                <input
                                                    type="text"
                                                    className="form-control w-full border border-defaultborder text-defaultsize text-defaulttextcolor rounded-[0.5rem] mt-2"
                                                    placeholder="Category Name"
                                                    value={newCategory}
                                                    onChange={(e) => setNewCategory(e.target.value)}
                                                />
                                            </div>

                                            <div className="border-t border-defaultborder p-4 flex justify-end ">
                                                <button
                                                    className="ti-btn text-white bg-primary me-3"
                                                    onClick={handleAddCategory}
                                                >
                                                    Save
                                                </button>
                                                <button
                                                    className="bg-primary/20 ti-btn text-defaulttextcolor"
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
                                    showMessagesecond={false} message="New Product Added successfully!" onClose={function (): void {
                                        throw new Error('Function not implemented.');
                                    }} onCancel={function (): void {
                                        throw new Error('Function not implemented.');
                                    }} />
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default AddProduct;
