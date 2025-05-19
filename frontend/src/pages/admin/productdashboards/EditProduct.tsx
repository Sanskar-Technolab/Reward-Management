import React, { Fragment, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Pageheader from "../../../components/common/pageheader/pageheader";
import SunEditor from "suneditor-react";
import "suneditor/dist/css/suneditor.min.css";
import "../../../assets/css/style.css";
import "../../../assets/css/pages/admindashboard.css";
import axios from "axios";
import SuccessAlert from "../../../components/ui/alerts/SuccessAlert";
import { useFrappeGetDocList, useFrappePostCall } from "frappe-react-sdk";
import TableComponent from "../../../components/ui/tables/tablecompnent";
import TableBoxComponent from "../../../components/ui/tables/tableboxheader";
import DangerAlert from '../../../components/ui/alerts/DangerAlert';
import ViewModalComponent from '../../../components/ui/models/ViewModel';

import { Notyf } from 'notyf';
import 'notyf/notyf.min.css';
interface EditProduct {
    product_name?: string;
    productId?: string;
    points?: number;
    product_image?: string;
}
interface ProductCategory {
    name: string;
    category_name: string;
}

interface PointConversion {
    product_name: string;
    reward_point: number;
    payout_amount: number;
    from_date: Date;
}

const notyf = new Notyf({
    position: {
        x: 'right',
        y: 'top',
    },
    duration: 5000, 
});


const EditProduct: React.FC = () => {
    const [files, setFiles] = useState<File[]>([]);
    const [previews, setPreviews] = useState<string[]>([]);
    const [existingImages, setExistingImages] = useState<string[]>([]);
    const [productName, setProductName] = useState("");
    const [rewardPoints, setRewardPoints] = useState("");
    const [productPrice, setproductPrice] = useState("");
    const [pointReward, setPointReward] = useState("");
    const [rewardAmount, setRewardAmount] = useState("");
    const [rewardPercent, setRewardPercent] = useState("");
    const [productDescription, setProductDescription] = useState("");
    const [productCategory, setProductCategory] = useState("");
    const navigate = useNavigate();
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get("product");
    const [showSuccessAlert, setShowSuccessAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');

    const [newCategory, setNewCategory] = useState("");
    const [showAddCategoryModal, setShowAddCategoryModal] = useState(false);
    const [showRewardPercent, setShowRewardPercent] = useState(false);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [itemsPerPage] = useState<number>(10);
    const [childTableData, setChildTableData] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [fromDate, setFromDate] = useState<Date | null>(null);
    const [toDate, setToDate] = useState<Date | null>(null);
    const [isConfirmDeleteModalOpen, setIsConfirmDeleteModalOpen] = useState(false);
    const [pointConversionToDelete, setPointConversionToDelete] = useState<PointConversion | null>(null);
    const [showAddRowModal, setShowAddRowModal] = useState(false);
    const [rewardPoint, setRewardPoint] = useState("");
    const [payoutAmount, setPayoutAmount] = useState("");
    const [activeTab, setActiveTab] = useState("addProduct");

    const { call: createCategory } = useFrappePostCall(
        "reward_management.api.product_master.add_category"
    );

    const handleAddCategory = async (event: any) => {
        event.preventDefault();
        try {
            const response = await createCategory({ productCategory: newCategory });
            if (response) {
                // console.log("product category name:", response);
                setProductCategory(response.category_name);
                setNewCategory("");
                window.location.reload();
                setShowAddCategoryModal(false);
            }
        } catch (error) {
            console.log("Error adding category:", error);
        }
    };

    // Fetch the product categories
    const { data: productcategoryData, error } =
        useFrappeGetDocList<ProductCategory>("Product Category", {
            fields: ["name", "category_name"],
        });



    const fetchRewardPointConversionData = async (productId: any) => {
        try {
            const response = await axios.get(`/api/resource/Product/${productId}`);
            const productData = response.data.data;
            const rewardPointConversionRateData =
                productData.reward_point_conversion_rate || [];
            return rewardPointConversionRateData;
        } catch (error) {
            console.log("Error fetching product data:", error);
            return [];
        }
    };

    useEffect(() => {
        document.title = "Edit Product";
        const getData = async () => {
            const data = await fetchRewardPointConversionData(productId);
            setChildTableData(data);
        };

        getData();
        if (productPrice && rewardPercent) {
            const calculatedPoints =
                (parseFloat(productPrice) * parseFloat(rewardPercent)) / 100;
            setRewardPoints(calculatedPoints.toFixed(2));
        } else {
            setRewardPoints(rewardPoints);
        }

        if (showSuccessAlert) {
            const timer = setTimeout(() => {
                setShowSuccessAlert(false);
                navigate("/product-master");
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [showSuccessAlert, navigate, productPrice, rewardPercent, productId]);

    useEffect(() => {

        const fetchProductData = async () => {
            if (!productId) return;

            try {
                const response = await axios.get(
                    `/api/method/reward_management.api.product_master.get_tableproduct_detail`,
                    {
                        params: { product_id: productId },
                        headers: {
                            "Content-Type": "application/json",
                        },
                    }
                );

                if (response.data && response.data.message.message) {
                    // console.log("Edit Product Data", response);
                    const product = response.data.message.message;

                    setProductName(product.product_name || "");
                    setRewardPoints(product.reward_points || "");
                    setproductPrice(product.product_price || "");
                    setProductDescription(product.discription || "");
                    setProductCategory(product.category || "");
                    setRewardAmount(product.payout_amount || "");
                    setPointReward(product.reward_point || "");

                    const images = Array.isArray(product.product_image)
                        ? product.product_image
                        : [product.product_image].filter(Boolean);
                    setExistingImages(images);

                    // Set child table data
                    setChildTableData(product.reward_point_conversion_rate || []);
                } else {
                    console.log("Product details not found in response.",response);
                }
            } catch (error) {
                console.log("Error fetching product data:", error);
                const errorMessage = error.response?.data?.message || error.message;
                notyf.error(`Error fetching product data: ${errorMessage}`);
            }
        };

        fetchProductData();
    }, [productId]);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFiles = event.target.files;
        if (selectedFiles) {
            const fileArray = Array.from(selectedFiles);
            setFiles(fileArray);

            const previewArray = fileArray.map((file) => URL.createObjectURL(file));
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
                    Accept: "application/json",

                    "Content-Type": "multipart/form-data",
                },
            });
            if (response.data.message && response.data.message.file_url) {
                return response.data.message.file_url;
            } else {
                console.log("File URL not found in response:", response.data);
                return null;
            }
        } catch (error) {
            console.log("Error uploading file:", error);
            return null;
        }
    };

    // const resetForm = () => {
    //     window.location.reload();
    // };

    const handlecancel = () => {
        navigate("/product-master");
    }

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        const fileUrls = [];


        // Validate the inputs

        if (!isValidNumber(productPrice)) {
            notyf.error('Product Price must be a number.');
            return false;
        }   


        if (!isValidNumber(rewardPoints)) {
            notyf.error('Reward Point must be a number.');
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
        
        

        // Upload files and collect URLs
        for (const file of files) {
            const fileUrl = await uploadFile(file);
            if (fileUrl) {
                fileUrls.push(fileUrl);
            }
        }

        const updatedProductImage =
            fileUrls.length > 0 ? fileUrls[0] : existingImages[0];

        // Prepare the new child table row
        const newChildRow = {
            product_name: productName,
            product_id: productId,
            reward_point: pointReward,
            payout_amount: rewardAmount,
            from_date: new Date().toISOString().split("T")[0],
        };

        try {
            // Fetch the existing product data first
            const response = await axios.get(`/api/resource/Product/${productId}`);
            const productData = response.data.data;

            // Create a new child table array by spreading existing rows and adding the new row
            const updatedChildTable =
                productData.reward_point_conversion_rate.concat(newChildRow);

            // Prepare data for the product update
            const data = {
                product_name: productName,
                category: productCategory,
                reward_points: rewardPoints,
                product_price: productPrice,
                discription: productDescription,
                product_image: updatedProductImage,
                reward_point_conversion_rate: updatedChildTable,
            };

            // Use PUT to update the product and include the new child row
            await axios.put(`/api/resource/Product/${productId}`, data, {
                headers: {
                    "Content-Type": "application/json",
                },
            });

            setShowSuccessAlert(true);
            setAlertMessage('Product updated successfully!');
            if (showSuccessAlert) {
                const timer = setTimeout(() => {
                    setShowSuccessAlert(false);


                    navigate("/product-master");
                }, 3000);
                return () => clearTimeout(timer);
            }
        } catch (error) {
            console.log("Error adding new row to child table:", error);
            notyf.error("An error occurred while adding the new row. Please try again.");
        }
    };

    const handleCloseModal = () => {
        setShowAddCategoryModal(false);
        setShowAddRowModal(false);
    };


    // Other states: productName, productPrice, etc.

    const handleTabChange = (tab: any) => {
        setActiveTab(tab); // Change active tab
    };

    const formatDate = (date: Date) => {
        const d = new Date(date);
        const day = String(d.getDate()).padStart(2, '0');
        const month = String(d.getMonth() + 1).padStart(2, '0'); // Months are zero-based
        const year = d.getFullYear();
        return `${day}-${month}-${year}`;
    };

    // Filter data based on search query and date range
    const filteredData = childTableData
        .filter((item: any) => {
            const matchesSearch = item.product_name
                .toLowerCase()
                .includes(searchQuery.toLowerCase());

            const matchesDate =
                (!fromDate || new Date(item.from_date) >= fromDate) &&
                (!toDate || new Date(item.from_date) <= toDate);

            return matchesSearch && matchesDate;
        })
        .map((item: any) => ({
            ...item,
            from_date: formatDate(item.from_date) // Format the date here
        }));

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



    const deleteMatchedRow = async (itemToDelete: any) => {
        const { product_name, reward_point, payout_amount, from_date } = itemToDelete;


        try {
            // Convert from_date from 'dd-mm-yyyy' to 'yyyy-mm-dd' for the comparison
            const dateParts = from_date.split('-');
            if (dateParts.length !== 3) {
                throw new Error("Invalid date format. Expected dd-mm-yyyy: " + from_date);
            }
            const fromDate = `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`; // Convert to 'yyyy-mm-dd'

            // Fetch the existing product data first
            const response = await axios.get(`/api/resource/Product/${productId}`);
            const productData = response.data.data;

            // Filter out the row that matches the criteria
            const updatedChildTable = productData.reward_point_conversion_rate.filter(
                (childItem: any) => {
                    // Convert child's from_date from 'yyyy-mm-dd' to a comparable format
                    const childDateParts = childItem.from_date.split('-');
                    if (childDateParts.length !== 3) {
                        throw new Error("Invalid childItem.from_date: " + childItem.from_date);
                    }
                    const childDate = `${childDateParts[0]}-${childDateParts[1]}-${childDateParts[2]}`; // Ensure it's 'yyyy-mm-dd' for comparison

                    return !(
                        childItem.product_name === product_name &&
                        childItem.reward_point === reward_point &&
                        childItem.payout_amount === payout_amount &&
                        childDate === fromDate // Compare dates as 'yyyy-mm-dd'
                    );
                }
            );

            // Prepare data for the product update
            const data = {
                product_name: productData.product_name,
                category: productData.category,
                reward_points: productData.reward_points,
                product_price: productData.product_price,
                discription: productData.discription,
                product_image: productData.product_image,
                reward_point_conversion_rate: updatedChildTable,
            };

            // Use PUT to update the product and remove the matched row
            await axios.put(`/api/resource/Product/${productId}`, data, {
                headers: {
                    "Content-Type": "application/json",
                },
            });

            setShowSuccessAlert(true);
            setAlertMessage('Point Conversion deleted successfully!');

        } catch (error) {
            console.log("Error deleting matched row:", error);
        }
    };


    const handleDeleteAmount = (item: PointConversion) => {
        // Save the item to be deleted
        setPointConversionToDelete(item);
        // Open the confirmation modal
        setIsConfirmDeleteModalOpen(true);
    };

    // Confirmation function
    const confirmDelete = () => {
        if (pointConversionToDelete) {
            // Call delete function
            deleteMatchedRow(pointConversionToDelete);
        }
        // Close the confirmation modal
        setIsConfirmDeleteModalOpen(false);
    };


    const cancelDelete = () => {
        setIsConfirmDeleteModalOpen(false);
        setPointConversionToDelete(null);
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

    const isValidNumber = (title: string) => {
        // Regex to allow only numbers
        const regex = /^[0-9]+$/;
        return regex.test(title);
    };


    const handleAddRowSubmit = async (event: React.FormEvent) => {
        if (event && event.preventDefault) {
            event.preventDefault();
        }

        // Validate the inputs
        if (!isValidNumber(rewardPoint)) {
            notyf.error('Reward Point must be a number.');
            return false;
        }
        if (!isValidNumber(payoutAmount)) {
            notyf.error('Payout Amount must be a number.');
            return false;
        }
        
        // Prepare the new child table row
        const newChildRow = {
            product_name: productName,
            product_id: productId,
            reward_point: parseFloat(rewardPoint),
            payout_amount: parseFloat(payoutAmount),
            from_date: new Date().toISOString().split("T")[0],
        };

        try {
            // Fetch the existing product data first
            const response = await axios.get(`/api/resource/Product/${productId}`);
            const productData = response.data.data;

            // Create a new child table array by spreading existing rows and adding the new row
            const updatedChildTable = [
                ...productData.reward_point_conversion_rate,
                newChildRow,
            ];

            // Prepare data for the product update
            const data = {
                product_name: productData.product_name,
                category: productData.category,
                reward_points: productData.reward_points,
                product_price: productData.product_price,
                discription: productData.discription,
                product_image: productData.product_image,
                reward_point_conversion_rate: updatedChildTable,
            };

            // Use PUT to update the product and include the new child row
            await axios.put(`/api/resource/Product/${productId}`, data, {
                headers: {
                    "Content-Type": "application/json",
                },
            });

            // Show success alert

            setShowSuccessAlert(true);
            setAlertMessage('New Point Conversion Added successfully!');

            // Close the modal
            setShowAddRowModal(false);
            // Clear the input fields
            setRewardPoint("");
            setPayoutAmount("");
        } catch (error) {
            console.error("Error adding new row:", error);
        }
    };


    const handleAddRow = () => {
        setShowAddRowModal(true);
        // console.log("Adding new row");

    };

    return (
        <Fragment>
            <Pageheader
                currentpage={"Edit Product"}
                activepage={"/product-master"}
                mainpage={"/product-master"}
                activepagename="Product Master"
                mainpagename="Edit Product"
            />
            {/* <Pageheader currentpage="Edit Product" activepage="Product Master" mainpage="Edit Product" /> */}
            <div className="grid grid-cols-12 gap-6 bg-white mt-5 rounded-lg shadow-lg">
                <div className="xl:col-span-12 col-span-12">
                    <div className="">
                        <div className="box-body add-products !p-0" >
                            {/* Tab Buttons */}
                            <div className="flex border-b font-semibold text-sm p-5 ">
                                <button
                                    className={`text-defaulttextcolor dark:text-defaulttextcolor/70 py-2 px-3 text-[0.75rem] font-medium rounded-[5px] hover:text-primary ${activeTab === "addProduct"
                                        ? "bg-primary/10 text-primary"
                                        : ""
                                        }`}
                                    onClick={() => handleTabChange("addProduct")}
                                >
                                    Edit Product
                                </button>
                                <button
                                    className={`text-defaulttextcolor dark:text-defaulttextcolor/70 py-2 px-3 text-[0.75rem] font-medium rounded-[5px] hover:text-primary ${activeTab === "pointConversion"
                                        ? "bg-primary/10 text-primary"
                                        : ""
                                        }`}
                                    onClick={() => handleTabChange("pointConversion")}
                                >
                                    Point Conversion
                                </button>
                            </div>
                            {activeTab === "addProduct" && (
                                <form onSubmit={handleSubmit}>
                                    <div className="p-6 ">
                                        <div className="grid grid-cols-12 md:gap-x-[3rem] gap-0">
                                            <div className="xxl:col-span-6 xl:col-span-12 lg:col-span-12 md:col-span-6 col-span-12">
                                                <div className="grid grid-cols-12 gap-4">
                                                    <div className="xl:col-span-12 col-span-12">
                                                        <label
                                                            htmlFor="product-name-add"
                                                            className="form-label text-sm font-semibold text-defaulttextcolor"
                                                        >
                                                            Product Name
                                                        </label>
                                                        <input
                                                            type="text"
                                                            className="outline-none focus:outline-none focus:ring-0 no-outline focus:border-[#dadada] form-control w-full border border-defaultborder text-defaultsize text-defaulttextcolor rounded-[0.5rem] mt-2"
                                                            id="product-name-add"
                                                            placeholder="Name"
                                                            value={productName}
                                                            onChange={(e) => setProductName(e.target.value)}
                                                            readOnly
                                                            required
                                                        />
                                                    </div>
                                                    <div className="xl:col-span-12 col-span-12">
                                                        <label
                                                            htmlFor="product-price-add"
                                                            className="form-label text-sm font-semibold text-defaulttextcolor"
                                                        >
                                                            Product Price<span style={{ color: 'red' }}>*</span>
                                                        </label>
                                                        <input
                                                            type="text"
                                                            className="outline-none focus:outline-none focus:ring-0 no-outline focus:border-[#dadada] form-control w-full text-defaultsize text-defaulttextcolor border border-defaultborder rounded-[0.5rem] mt-2"
                                                            id="product-price-add"
                                                            placeholder="Product Price"
                                                            value={productPrice}
                                                            onChange={(e) => setproductPrice(e.target.value)}
                                                            required
                                                            onInvalid={(e) => (e.target as HTMLInputElement).setCustomValidity("Product Price is required.")}
                                                            onInput={(e) => (e.target as HTMLInputElement).setCustomValidity("")}
                                                        />
                                                    </div>

                                                    <div className="xl:col-span-12 col-span-12">
                                                        <label
                                                            htmlFor="product-cost-add"
                                                            className="form-label text-sm font-semibold text-defaulttextcolor"
                                                        >
                                                            Reward Points<span style={{ color: 'red' }}>*</span>
                                                        </label>
                                                        <input
                                                            type="text"
                                                            className="outline-none focus:outline-none focus:ring-0 no-outline focus:border-[#dadada] form-control w-full text-defaultsize text-defaulttextcolor border border-defaultborder rounded-[0.5rem] mt-2"
                                                            id="product-cost-add"
                                                            placeholder="Reward points"
                                                            value={rewardPoints}
                                                            onChange={(e) => setRewardPoints(e.target.value)}
                                                            readOnly={showRewardPercent}
                                                            required
                                                            onInvalid={(e) => (e.target as HTMLInputElement).setCustomValidity("Reward Points are required.")}
                                                            onInput={(e) => (e.target as HTMLInputElement).setCustomValidity("")}

                                                        />
                                                    </div>
                                                    <div className="xl:col-span-12 col-span-12 mb-4">
                                                        <label className="form-label text-sm font-semibold text-defaulttextcolor">
                                                            Product Description
                                                        </label>
                                                        <div id="product-features" className="mt-2">
                                                            <SunEditor
                                                                setContents={productDescription}
                                                                onChange={setProductDescription}
                                                                setOptions={{
                                                                    buttonList: [
                                                                        ["undo", "redo"],
                                                                        ["formatBlock", "font", "fontSize"],
                                                                        ["bold", "underline", "italic"],
                                                                        ["fontColor", "hiliteColor"],
                                                                        ["align", "list", "lineHeight"],
                                                                        ["table", "link"],
                                                                        ["fullScreen", "showBlocks", "codeView"],
                                                                    ],
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
                                                        <label
                                                            htmlFor="product-category-add"
                                                            className="form-label text-sm font-semibold text-defaulttextcolor"
                                                        >
                                                            Category<span style={{ color: 'red' }}>*</span>
                                                        </label>
                                                        <div className="flex items-center mt-[8px]">
                                                            <select
                                                                id="product-category-add"
                                                                name="product-category-add"
                                                                className="outline-none focus:outline-none focus:ring-0 no-outline focus:border-[#dadada] w-full border border-defaultborder text-defaultsize text-defaulttextcolor rounded-[0.5rem] mr-1"
                                                                value={productCategory}
                                                                onChange={(e) =>
                                                                    setProductCategory(e.target.value)
                                                                }
                                                                required
                                                                onInvalid={(e) => (e.target as HTMLInputElement).setCustomValidity("Category Cannot be empty.")}
                                                                onInput={(e) => (e.target as HTMLInputElement).setCustomValidity("")}
                                                            >
                                                                <option value="">Select a category</option>
                                                                {productcategoryData &&
                                                                    productcategoryData.map((category) => (
                                                                        <option
                                                                            key={category.name}
                                                                            value={category.category_name}
                                                                        >
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
                                                                onChange={() =>
                                                                    setShowRewardPercent(!showRewardPercent)
                                                                }
                                                            />
                                                            Add Reward Percent
                                                        </label>
                                                    </div>
                                                    {/* Conditionally render Reward Percent input */}
                                                    {showRewardPercent && (
                                                        <div className="xl:col-span-12 col-span-12">
                                                            <label
                                                                htmlFor="reward-percent-add"
                                                                className="form-label text-sm font-semibold text-defaulttextcolor"
                                                            >
                                                                Set Reward Percent<span style={{ color: 'red' }}>*</span>
                                                            </label>
                                                            <input
                                                                type="text"
                                                                className="outline-none focus:outline-none focus:ring-0 no-outline focus:border-[#dadada] form-control w-full text-defaultsize text-defaulttextcolor border border-defaultborder rounded-[0.5rem] mt-2"
                                                                id="reward-percent-add"
                                                                placeholder="Set Reward Percent"
                                                                value={rewardPercent}
                                                                onChange={(e) =>
                                                                    setRewardPercent(e.target.value)
                                                                }
                                                                required
                                                                onInvalid={(e) => (e.target as HTMLInputElement).setCustomValidity("Reward Percent is required.")}
                                                                onInput={(e) => (e.target as HTMLInputElement).setCustomValidity("")}
                                                            />
                                                        </div>
                                                    )}
                                                    {/* point calculation */}
                                                    <div className="xl:col-span-12 col-span-12">
                                                        <label
                                                            htmlFor="point-reward-add"
                                                            className="form-label text-sm font-semibold text-defaulttextcolor"
                                                        >
                                                            Point<span style={{ color: 'red' }}>*</span>
                                                        </label>
                                                        <input
                                                            type="text"
                                                            className="outline-none focus:outline-none focus:ring-0 no-outline focus:border-[#dadada] form-control w-full text-defaultsize text-defaulttextcolor border border-defaultborder rounded-[0.5rem] mt-2"
                                                            id="point-reward-add"
                                                            placeholder="Set Reward Point"
                                                            value={pointReward}
                                                            onChange={(e) => setPointReward(e.target.value)}
                                                            required
                                                            onInvalid={(e) => (e.target as HTMLInputElement).setCustomValidity("Reward Points are required.")}
                                                            onInput={(e) => (e.target as HTMLInputElement).setCustomValidity("")}
                                                        />
                                                    </div>
                                                    {/* amount per point */}
                                                    <div className="xl:col-span-12 col-span-12">
                                                        <label
                                                            htmlFor="payout-amount-add"
                                                            className="form-label text-sm font-semibold text-defaulttextcolor"
                                                        >
                                                            Amount per Point<span style={{ color: 'red' }}>*</span>
                                                        </label>
                                                        <input
                                                            type="text"
                                                            className="outline-none focus:outline-none focus:ring-0 no-outline focus:border-[#dadada] form-control w-full text-defaultsize text-defaulttextcolor border border-defaultborder rounded-[0.5rem] mt-2"
                                                            id="payout-amount-add"
                                                            placeholder="Set Amount Per Point"
                                                            value={rewardAmount}
                                                            onChange={(e) => setRewardAmount(e.target.value)}
                                                            required
                                                            onInvalid={(e) => (e.target as HTMLInputElement).setCustomValidity("Amount Per Point is required.")}
                                                            onInput={(e) => (e.target as HTMLInputElement).setCustomValidity("")}
                                                        />
                                                    </div>

                                                    {/* product image */}
                                                    <div className="xl:col-span-12 col-span-12 ">
                                                        <label
                                                            htmlFor="product-images-add"
                                                            className="form-label text-sm font-semibold text-defaulttextcolor"
                                                        >
                                                            Product Image
                                                        </label>
                                                        <input
                                                            type="file"
                                                            multiple
                                                            className="outline-none focus:outline-none focus:ring-0 no-outline focus:border-[#dadada] form-control w-full border border-defaultborder rounded-[0.5rem] mt-2 p-2"
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
                                                        {existingImages.length > 0 && (
                                                            <div className="flex gap-4 mt-2">
                                                                {existingImages.map((image, index) => (
                                                                    <img
                                                                        key={index}
                                                                        src={image}
                                                                        alt={`existing-${index}`}
                                                                        className="w-32 h-32 object-cover"
                                                                    />
                                                                ))}
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex justify-end gap-2 mt-6">
                                            <button
                                                type="button"
                                                className="ti-btn ti-btn-success bg-primary/20 ti-btn text-defaulttextcolor !font-medium m-1"
                                                // onClick={resetForm}
                                                onClick={handlecancel}
                                            >
                                                Cancel
                                            </button>
                                            <button
                                                type="submit"
                                                className="ti-btn bg-primary text-white !font-medium m-1"
                                            >
                                                Edit Product
                                            </button>
                                        </div>
                                    </div>
                                </form>
                            )}

                            {activeTab === "pointConversion" && (
                                <div className="box-body rounded-none">
                                    <TableBoxComponent
                                        title="Point Conversion"
                                        onSearch={handleSearch}
                                        buttonText="Back"
                                        showFromDate={true}
                                        showToDate={true}
                                        onDateFilter={handleDateFilter}
                                        showButton={false}
                                        icon="ri-arrow-left-line"
                                        // Add row button
                                        onAddButtonClick={handleAddRow}
                                    />
                                    <TableComponent<PointConversion>
                                        columns={[
                                            { header: "Product Name", accessor: "product_name" },
                                            { header: "Reward Point", accessor: "reward_point" },
                                            { header: "Payout Amount", accessor: "payout_amount" },
                                            { header: "Date", accessor: "from_date" },
                                        ]}
                                        // Use filtered and paginated data
                                        data={filteredData}
                                        currentPage={currentPage}
                                        itemsPerPage={itemsPerPage}
                                        handlePrevPage={handlePrevPage}
                                        handleNextPage={handleNextPage}
                                        handlePageChange={handlePageChange}
                                        showProductQR={false}
                                        showEdit={false}
                                        editHeader="Delete"
                                        showDelete={true}
                                        onDelete={(item) => handleDeleteAmount(item)}
                                        columnStyles={{
                                            'Product Name': "text-[var(--primaries)] font-semibold",

                                        }}
                                    />
                                    <button
                                        onClick={handleAddRow}
                                        className="ti-btn bg-primary/20 mt-3"
                                    >
                                        Add Row
                                    </button>
                                </div>
                            )}
                            {showAddCategoryModal && (
                                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                                    <div className="modal-overlay" onClick={handleCloseModal} />
                                    <div className="modal-container bg-white rounded-lg shadow-lg w-full max-w-lg">
                                        <div className="flex justify-between border-b p-4 ">
                                            <h6 className="text-sm text-center text-defaulttextcolor font-semibold ">
                                                Add New Category
                                            </h6>
                                            <button
                                                onClick={handleCloseModal}
                                                type="button"
                                                className="text-1rem font-semibold text-defaulttextcolor"
                                            >
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
                                                    className="ti-btn bg-primary text-white me-3"
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
                            {showAddRowModal && (
                                <ViewModalComponent
                                    title={"Add New Row"}
                                    questionLabel={"Reward Point"}
                                    answerLabel={"Payout Amount"}
                                    questionPlaceholder="Enter Reward Point"
                                    answerPlaceholder="Enter Payout Amount"
                                    showDate={false}
                                    showEndDate={false}
                                    question={rewardPoint}
                                    answer={payoutAmount}
                                    setQuestion={setRewardPoint}
                                    setAnswer={setPayoutAmount}
                                    requiredQuestion
                                    requiredAnswer
                                    questionErrorMessage="Reward point cannot be empty."
                                    answerErrorMessage="Payout amount cannot be empty."
                                    onClose={handleCloseModal}
                                    onSubmit={handleAddRowSubmit}
                                    onCancel={handleCloseModal}
                                />
                            )}

                            {isConfirmDeleteModalOpen && (
                                <DangerAlert
                                    type="danger"
                                    message={`Are you sure you want to delete this point detail?`}
                                    onDismiss={cancelDelete}
                                    onConfirm={confirmDelete}
                                    cancelText="Cancel"
                                    confirmText="Continue"
                                />
                            )}
                            {showSuccessAlert && (
                                <SuccessAlert
                                    showButton={false}
                                    showCancleButton={false}
                                    showCollectButton={false}
                                    showAnotherButton={false}
                                    showMessagesecond={false}
                                    // message="Product updated successfully!"
                                    message={alertMessage}
                                />
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </Fragment>
    );
};

export default EditProduct;
