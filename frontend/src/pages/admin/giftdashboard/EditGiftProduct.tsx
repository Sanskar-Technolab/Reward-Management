import React, { useState, useEffect, useRef } from 'react';
import Pageheader from '../../../components/common/pageheader/pageheader';
import SunEditor from 'suneditor-react';
import { useNavigate, useLocation } from "react-router-dom";
import 'suneditor/dist/css/suneditor.min.css';
import SuccessAlert from '../../../components/ui/alerts/SuccessAlert';
import '../../../assets/css/style.css';
import '../../../assets/css/pages/admindashboard.css';
import axios from 'axios';

import { Notyf } from 'notyf';
import 'notyf/notyf.min.css';


const notyf = new Notyf({
    position: {
        x: 'right',
        y: 'top',
    },
    duration: 3000,
});

const EditGiftProduct: React.FC = () => {
    // const [files, setFiles] = useState<File[]>([]);
    const [fileDetails, setFileDetails] = useState<{ url: string, name: string }[]>([]);
    const [giftproductName, setGiftProductName] = useState('');
    const [points, setPoints] = useState('');
    const [giftproductDetails, setGiftProductDetails] = useState('');
    const [giftproductDescription, setGiftProductDescription] = useState('');
    const [giftproductSpecificaton, setGiftProductSpecificaton] = useState('');
    const [status, setStatus] = useState('');
    const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState(false);
    const statusDropdownRef = useRef<HTMLDivElement>(null);
    const [existingImages, setExistingImages] = useState<string[]>([]);
    const [imagesToRemove, setImagesToRemove] = useState<string[]>([]);

    const [showExistingImages, setShowExistingImages] = useState(true);
    const [showSuccessAlert, setShowSuccessAlert] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        document.title = 'Edit Gift Product';




        // Extract gift product ID from pathname
        const pathSegments = location.pathname.split('/');
        const giftProductId = pathSegments[pathSegments.length - 1];

        // console.log("Extracted Gift Product ID:", giftProductId);
        const fetchGiftProducts = async () => {
            try {
                const response = await axios.get(
                    `/api/method/reward_management.api.gift_product.get_url_gift_products?url_name=${giftProductId}`
                );
                const productData = response.data.message?.data;

                if (response.data.message?.status === "success" && productData) {
                    const matchedProduct = productData.find(
                        (product: { name: string }) =>
                            product.name
                                .replace(/\s+/g, "%20")
                                .toLowerCase() === giftProductId?.toLowerCase()
                    );

                    if (matchedProduct) {
                        // console.log("matched gift", matchedProduct)
                        // Set state with the matched product data
                        setGiftProductName(matchedProduct.gift_product_name);
                        setPoints(matchedProduct.points);
                        setGiftProductDetails(matchedProduct.gift_detail);
                        setGiftProductDescription(matchedProduct.description);
                        setGiftProductSpecificaton(matchedProduct.gift_specification);// Convert enabled value to status string
                        const statusValue = matchedProduct.enabled === 1 ? 'Active' : 'Inactive';
                        setStatus(statusValue)

                        // Set file URLs if available
                        if (matchedProduct.gift_product_images && matchedProduct.gift_product_images.length > 0) {
                            const imageDetails = matchedProduct.gift_product_images.map((image: { gift_product_image: string }) => ({
                                url: image.gift_product_image,
                                name: image.gift_product_image.split('/').pop() || ''
                            }));
                            setExistingImages(imageDetails);
                        }
                    } else {
                        console.log("No matching product found.");
                    }
                } else {
                    console.log("Failed to fetch product data.");
                }
            } catch (err) {
                console.log("Error fetching gift products:", err);
            }
        };

        if (giftProductId) {
            fetchGiftProducts();
        } else {
            console.error("Gift Product ID is missing.");
        }


        if (showSuccessAlert) {
            const timer = setTimeout(() => {
                setShowSuccessAlert(false);
                navigate('/gift-master');
            }, 3000);
            return () => clearTimeout(timer);
        }


    }, [showSuccessAlert, navigate, location]);


    // Add click outside handler for status dropdown
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (statusDropdownRef.current && !statusDropdownRef.current.contains(event.target as Node)) {
                setIsStatusDropdownOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleStatusChange = (newStatus: string) => {
        setStatus(newStatus);
        setIsStatusDropdownOpen(false);
    };

    const toggleStatusDropdown = () => {
        setIsStatusDropdownOpen(!isStatusDropdownOpen);
    };


    // const isValidNumber = (title: string) => {
    //         // Regex to allow only numbers
    //         const regex = /^[0-9]+$/;
    //         return regex.test(title);
    //     };

    const isValidNumber = (title: string) => {
        // Regex to allow integers and floats like 123, 0.001, .5, 123.
        const regex = /^(\d+(\.\d*)?|\.\d+)$/;
        return regex.test(title);
    };


    // Handle file removal
    const handleRemoveImage = (indexToRemove: number) => {
        setFileDetails((prevFiles) =>
            prevFiles.filter((_, index) => index !== indexToRemove)
        );
    };

    const handleRemoveExistingImage = (indexToRemove: number) => {
        const imageToRemove = existingImages[indexToRemove];
        setImagesToRemove(prev => [...prev, imageToRemove.url]);
        setExistingImages(prev => prev.filter((_, index) => index !== indexToRemove));
    };



    // Handle file selection
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {

        const files = e.target.files;

        if (files) {
            const fileArray = Array.from(files);

            if (fileArray.length + fileDetails.length > 10) {
                setError('You can only select up to 10 images!');
                return;
            } else {
                setError('');
            }

            const newFileDetails = fileArray.map((file) => {
                const reader = new FileReader();
                return new Promise<{ url: string, name: string }>((resolve) => {
                    reader.onload = (event) => {
                        resolve({
                            url: event.target?.result as string,
                            name: file.name,
                        });
                    };
                    reader.readAsDataURL(file);
                });
            });

            Promise.all(newFileDetails).then((newDetails) => {
                setFileDetails((prevFiles) => [...prevFiles, ...newDetails]);
            });

            setShowExistingImages(false);

        }
    };

    // Upload file function
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
            // if (response) {
            //     console.log("image upload response", response)
            // }
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

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        const uploadedFileURLs: string[] = [];
        if (!isValidNumber(points)) {
            notyf.error('Gift points must be a number.');
            return false;
        }

        try {
            // Upload each file and collect the URLs
            // for (const fileDetail of fileDetails) {
            //     const fileBlob = await fetch(fileDetail.url).then(res => res.blob());
            //     const file = new File([fileBlob], fileDetail.name, { type: fileBlob.type });

            //     // Assuming `uploadFile` is a function that returns the URL after uploading the file
            //     const fileURL = await uploadFile(file);
            //     if (fileURL) {
            //         uploadedFileURLs.push(fileURL);
            //     }
            // }

              // Upload new files
            for (const fileDetail of fileDetails) {
                const fileBlob = await fetch(fileDetail.url).then(res => res.blob());
                const file = new File([fileBlob], fileDetail.name, { type: fileBlob.type });
                const fileURL = await uploadFile(file);
                if (fileURL) uploadedFileURLs.push(fileURL);
            }

            // Combine existing (non-removed) and new images
            const finalImageUrls = [
                ...existingImages.map(img => img.url).filter(url => !imagesToRemove.includes(url)),
                ...uploadedFileURLs
            ];


            // console.log("Uploaded File URLs:", uploadedFileURLs);

            const giftStatus = status === 'Active' ? 1 : 0;

            // Prepare data for the API call
            const giftProductData = {
                new_image_url: finalImageUrls,

                // new_image_url: uploadedFileURLs,
                giftproductName: giftproductName,
                giftproductDetails: giftproductDetails,
                giftproductDescription: giftproductDescription,
                points: points,
                giftproductSpecificaton: giftproductSpecificaton,
                status: giftStatus,
            };


            // Make the API call to add a new gift product
            const response = await axios.put('/api/method/reward_management.api.gift_product.update_gift_product', giftProductData);
            // if(response){
            //     console.log("gift post response",response)
            // }

            // Check if the response was successful
            if (response.status === 200) {
                setShowSuccessAlert(true);

                // resetForm();  // Reset the form after successful submission
            }
        } catch (err) {
            setError('Something went wrong. Please try again later.');
            console.error('Error:', err);
        }
    };

    // const resetForm = () => {
    //     window.location.reload();
    // };
    const handleCancel = () => {
        navigate('/gift-master');
    };


    return (
        <>
            <Pageheader
                currentpage={"Edit Gift Product"}
                activepage={"/gift-master"}
                mainpage={"/edit-gift-product"}
                activepagename="Gift Master"
                mainpagename="Edit Gift Product"
            />
            <div className="grid grid-cols-12 gap-6 bg-white mt-5 rounded-lg shadow-lg">
                <div className="xl:col-span-12 col-span-12">
                    <div className="box-body add-products !p-0">
                        <form onSubmit={handleSubmit}>
                            <div className="p-6">
                                <div className="grid grid-cols-12 md:gap-x-[3rem] gap-0">
                                    <div className="xxl:col-span-6 xl:col-span-12 lg:col-span-12 md:col-span-6 col-span-12">
                                        <div className="grid grid-cols-12 gap-4">
                                            <div className="xl:col-span-12 col-span-12">
                                                <label htmlFor="gift-product-name-add" className="form-label text-sm font-semibold text-defaulttextcolor">Gift Product Name</label>
                                                <input
                                                    type="text"
                                                    className="outline-none focus:outline-none focus:ring-0 no-outline focus:border-[#dadada] form-control w-full border border-defaultborder text-defaultsize text-defaulttextcolor rounded-[0.5rem] mt-2"
                                                    id="gift-product-name-add"
                                                    placeholder="Name"
                                                    value={giftproductName}
                                                    onChange={(e) => setGiftProductName(e.target.value)}
                                                    readOnly
                                                />
                                            </div>
                                            <div className="xl:col-span-12 col-span-12">
                                                <label htmlFor="gift-product-details" className="form-label text-sm font-semibold text-defaulttextcolor">Gift Details<span style={{ color: 'red' }}>*</span></label>
                                                <textarea
                                                    type="text"
                                                    className="outline-none focus:outline-none focus:ring-0 no-outline focus:border-[#dadada] form-control w-full text-defaultsize text-defaulttextcolor border border-defaultborder rounded-[0.5rem] mt-2"
                                                    id="gift-product-details"
                                                    placeholder="Details"
                                                    value={giftproductDetails}
                                                    onChange={(e) => setGiftProductDetails(e.target.value)}
                                                    required
                                                    onInvalid={(e) => (e.target as HTMLInputElement).setCustomValidity("Please enter gift product details.")}
                                                    onInput={(e) => (e.target as HTMLInputElement).setCustomValidity("")}
                                                />
                                            </div>
                                            <div className="xl:col-span-12 col-span-12">
                                                <label htmlFor="gift-product-description" className="form-label text-sm font-semibold text-defaulttextcolor">Gift Product Description<span style={{ color: 'red' }}>*</span>   </label>
                                                <textarea
                                                    id="gift-product-description"
                                                    className="outline-none focus:outline-none focus:ring-0 no-outline focus:border-[#dadada] form-control w-full text-defaultsize text-defaulttextcolor border border-defaultborder rounded-[0.5rem] mt-2"
                                                    placeholder="Description"
                                                    value={giftproductDescription}
                                                    onChange={(e) => setGiftProductDescription(e.target.value)}
                                                    required
                                                    onInvalid={(e) => (e.target as HTMLInputElement).setCustomValidity("Please enter gift product description.")}
                                                    onInput={(e) => (e.target as HTMLInputElement).setCustomValidity("")}
                                                />
                                            </div>
                                            <div className="xl:col-span-12 col-span-12">
                                                <label htmlFor="product-cost-add" className="form-label text-sm font-semibold text-defaulttextcolor">Points<span style={{ color: 'red' }}>*</span></label>
                                                <input
                                                    type="text"
                                                    className="outline-none focus:outline-none focus:ring-0 no-outline focus:border-[#dadada] form-control w-full text-defaultsize text-defaulttextcolor border border-defaultborder rounded-[0.5rem] mt-2"
                                                    id="product-cost-add"
                                                    placeholder="Reward points"
                                                    value={points}
                                                    onChange={(e) => setPoints(e.target.value)}
                                                    required
                                                    onInvalid={(e) => (e.target as HTMLInputElement).setCustomValidity("Please enter valid reward points .")}
                                                    onInput={(e) => (e.target as HTMLInputElement).setCustomValidity("")}
                                                />
                                            </div>

                                            {/* add status */}

                                            <div className="xl:col-span-12 col-span-12" ref={statusDropdownRef}>
                                                <label htmlFor="product-status" className="form-label text-sm font-semibold text-defaulttextcolor">Status</label>
                                                <div className="relative mb-4">
                                                    <div
                                                        className="flex items-center justify-between p-1 border border-defaultborder rounded-[0.5rem] mt-2 cursor-pointer"
                                                        onClick={toggleStatusDropdown}
                                                    >
                                                        <span className={`px-2 py-1 rounded text-sm ${status === 'Active'
                                                                ? 'text-primary'
                                                                : 'text-primary'
                                                            }`}>
                                                            {status}
                                                        </span>
                                                        <i className={`fe fe-chevron-${isStatusDropdownOpen ? 'up' : 'down'} text-defaultsize`}></i>
                                                    </div>

                                                    {isStatusDropdownOpen && (
                                                        <div className="absolute p-2 z-10 w-full  bg-white border border-defaultborder rounded-[0.5rem] shadow-lg text-primary">
                                                            <div
                                                                className={` hover:bg-primary/10 cursor-pointer mb-1 ${status === 'Active' ? 'bg-primary/20' : ''
                                                                    }`}
                                                                onClick={() => handleStatusChange('Active')}
                                                            >
                                                                <span className="px-2 py-1 rounded text-sm">
                                                                    Active
                                                                </span>
                                                            </div>
                                                            <div
                                                                className={`hover:bg-primary/10 cursor-pointer ${status === 'Inactive' ? 'bg-primary/20' : ''
                                                                    }`}
                                                                onClick={() => handleStatusChange('Inactive')}
                                                            >
                                                                <span className="bg-red-100 text-red-800 px-2 py-1 rounded text-sm">
                                                                    Inactive
                                                                </span>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>

                                            </div>
                                        </div>
                                    </div>
                                    <div className="xxl:col-span-6 xl:col-span-12 lg:col-span-12 md:col-span-6 col-span-12 gap-4">
                                        <div className="grid grid-cols-12 gap-4">
                                            <div className="xl:col-span-12 col-span-12 mb-4">
                                                <label className="form-label text-sm font-semibold text-defaulttextcolor">Gift Product Specification</label>
                                                <div id="product-features" className="mt-2">
                                                    <SunEditor
                                                        setContents={giftproductSpecificaton}
                                                        onChange={setGiftProductSpecificaton}
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
                                        <div>
                                            <div className="xl:col-span-12 col-span-12">
                                                <label
                                                    htmlFor="file-upload"
                                                    className="block text-sm font-semibold text-defaulttextcolor"
                                                >
                                                    Gift Images
                                                </label>
                                                <input
                                                    type="file"
                                                    multiple
                                                    accept="image/*"
                                                    id="file-upload"
                                                    className="outline-none focus:outline-none focus:ring-0 no-outline focus:border-[#dadada] mt-1 block w-full p-2 border rounded-md"
                                                    onChange={handleFileChange}
                                                />
                                                {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
                                            </div>

                                            {/* Image Upload Section */}

                                         
                           

                            {/* Existing Images Preview with Remove Option */}
                            {existingImages.length > 0 && (
                                <div className="grid grid-cols-3 gap-5 my-4">
                                    {existingImages.map((image, index) => (
                                        <div key={index} className="relative group">
                                            <img
                                                src={image.url}
                                                alt={image.name}
                                                className="w-full h-32 object-contain rounded-md"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => handleRemoveExistingImage(index)}
                                                className="absolute top-[-10px] right-[-10px] text-defaulttextcolor p-1 group-hover:opacity-100 transition"
                                            >
                                                <i className="ri-close-line text-lg font-bold"></i>
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* New Images Preview with Remove Option */}
                            {fileDetails.length > 0 && (
                                <div className="grid grid-cols-3 gap-5 my-4">
                                    {fileDetails.map((file, index) => (
                                        <div key={index} className="relative group">
                                            <img
                                                src={file.url}
                                                alt={file.name}
                                                className="w-full h-32 object-contain rounded-md"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => handleRemoveImage(index)}
                                                className="absolute top-[-10px] right-[-10px] text-defaulttextcolor p-1  group-hover:opacity-100 transition"
                                            >
                                                <i className="ri-close-line text-lg font-bold"></i>
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}

                                            {/* {showExistingImages && existingImages.length > 0 && (
                                                <div className="grid grid-cols-3 gap-5 my-4">
                                                    {existingImages.map((image, index) => (
                                                        <div key={index} className="image-preview relative group">
                                                            <img
                                                                src={image.url}
                                                                alt={image.name}
                                                                className="w-full h-32 object-contain rounded-md"
                                                            />
                                                        </div>
                                                    ))}
                                                </div>
                                            )} */}

                                            {/* New file selection preview */}
                                            {/* {fileDetails.length > 0 && (
                                                <div className="grid grid-cols-3 gap-5 my-4">
                                                    {fileDetails.map((file, index) => (
                                                        <div key={index} className="relative group">
                                                            <img
                                                                src={file.url}
                                                                alt={file.name}
                                                                className="w-full h-32 object-contain rounded-md"
                                                            />
                                                            <button
                                                                type="button"
                                                                onClick={() => handleRemoveImage(index)}
                                                                className="absolute top-[-10px] right-[-10px] bg-red-600 text-primary p-1 rounded-full opacity-0 group-hover:opacity-100 transition"
                                                            >
                                                                <i className="ri-close-line text-primary text-lg font-bold "></i>
                                                            </button>
                                                        </div>
                                                    ))}
                                                </div>
                                            )} */}
                                        </div>


                                    </div>
                                </div>
                            </div>
                            <div className="px-6 py-4 border-t dark:border-defaultborder sm:flex justify-end">
                                <button type="submit" className="ti-btn bg-primary text-white !font-medium m-1">
                                    Edit Gift <i className="bi bi-plus-lg ms-2"></i>
                                </button>
                                <button
                                    type="button"
                                    className="ti-btn ti-btn-success bg-primary/20 ti-btn text-defaulttextcolor !font-medium m-1"
                                    // onClick={resetForm}
                                    onClick={handleCancel}
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div >
            </div >

            {showSuccessAlert && <SuccessAlert message="Gift Product updated successfully!" />}
        </>
    );
};

export default EditGiftProduct;
