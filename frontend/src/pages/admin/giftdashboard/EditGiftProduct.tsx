import React, { useState, useEffect } from 'react';
import Pageheader from '../../../components/common/pageheader/pageheader';
import SunEditor from 'suneditor-react';
import { useParams, useNavigate, useLocation } from "react-router-dom";
import 'suneditor/dist/css/suneditor.min.css';

import SuccessAlert from '../../../components/ui/alerts/SuccessAlert';
import '../../../assets/css/style.css';
import '../../../assets/css/pages/admindashboard.css';
import axios from 'axios';

const EditGiftProduct: React.FC = () => {
    const [files, setFiles] = useState<File[]>([]);
    const [fileDetails, setFileDetails] = useState<{ url: string, name: string }[]>([]);
    const [giftproductName, setGiftProductName] = useState('');
    const [points, setPoints] = useState('');
    const [giftproductDetails, setGiftProductDetails] = useState('');
    const [giftproductDescription, setGiftProductDescription] = useState('');
    const [giftproductSpecificaton, setGiftProductSpecificaton] = useState('');
    const [existingImages, setExistingImages] = useState<string[]>([]);

    const [showSuccessAlert, setShowSuccessAlert] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { giftproductId } = useParams<{ giftproductId: string }>();

    const resetForm = () => {
        setFiles([]);
        setFileDetails([]);
        setGiftProductName('');
        setPoints('');
        setGiftProductDetails('');
        setGiftProductDescription('');
        setGiftProductSpecificaton('');
    };

    const location = useLocation();

    useEffect(() => {
        document.title = 'Edit Gift Product';

        // console.log("Current location: ", location);

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
                        console.log("matched gift", matchedProduct)
                        // Set state with the matched product data
                        setGiftProductName(matchedProduct.gift_product_name);
                        setPoints(matchedProduct.points);
                        setGiftProductDetails(matchedProduct.gift_detail);
                        setGiftProductDescription(matchedProduct.description);
                        setGiftProductSpecificaton(matchedProduct.gift_specification);

                        // Set file URLs if available
                        if (matchedProduct.gift_product_image && matchedProduct.gift_product_image.length > 0) {
                            const imageDetails = matchedProduct.gift_product_image.map((url: string) => ({
                                url: url,
                                name: url.split('/').pop() || ''
                            }));
                            setExistingImages(imageDetails);
                        }
                    } else {
                        console.error("No matching product found.");
                    }
                } else {
                    console.error("Failed to fetch product data.");
                }
            } catch (err) {
                console.error("Error fetching gift products:", err);
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
        }
    };

    const handleRemoveImage = (indexToRemove: number) => {
        setFileDetails((prevFiles) =>
            prevFiles.filter((_, index) => index !== indexToRemove)
        );
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
            if (response) {
                console.log("image upload response", response)
            }
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

        try {
            // Upload each file and collect the URLs
            for (const fileDetail of fileDetails) {
                const fileBlob = await fetch(fileDetail.url).then(res => res.blob());
                const file = new File([fileBlob], fileDetail.name, { type: fileBlob.type });

                // Assuming `uploadFile` is a function that returns the URL after uploading the file
                const fileURL = await uploadFile(file);
                if (fileURL) {
                    uploadedFileURLs.push(fileURL);
                }
            }

            console.log("Uploaded File URLs:", uploadedFileURLs);

            // Prepare data for the API call
            // const giftProductData = {
            //     new_image_url: uploadedFileURLs,
            //     giftproductName: giftproductName,  
            //     giftproductDetails: giftproductDetails,  
            //     giftproductDescription: giftproductDescription,  
            //     points: points, 
            //     giftproductSpecificaton: giftproductSpecificaton 
            // };


        } catch (err) {
            setError('Something went wrong. Please try again later.');
            console.error('Error:', err);
        }
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
                                                    className="form-control w-full border border-defaultborder text-defaultsize text-defaulttextcolor rounded-[0.5rem] mt-2"
                                                    id="gift-product-name-add"
                                                    placeholder="Name"
                                                    value={giftproductName}
                                                    onChange={(e) => setGiftProductName(e.target.value)}
                                                    readOnly
                                                />
                                            </div>
                                            <div className="xl:col-span-12 col-span-12">
                                                <label htmlFor="gift-product-details" className="form-label text-sm font-semibold text-defaulttextcolor">Gift Details</label>
                                                <textarea
                                                    type="text"
                                                    className="form-control w-full text-defaultsize text-defaulttextcolor border border-defaultborder rounded-[0.5rem] mt-2"
                                                    id="gift-product-details"
                                                    placeholder="Details"
                                                    value={giftproductDetails}
                                                    onChange={(e) => setGiftProductDetails(e.target.value)}
                                                    required
                                                />
                                            </div>
                                            <div className="xl:col-span-12 col-span-12">
                                                <label htmlFor="gift-product-description" className="form-label text-sm font-semibold text-defaulttextcolor">Gift Product Description</label>
                                                <textarea
                                                    id="gift-product-description"
                                                    className="form-control w-full text-defaultsize text-defaulttextcolor border border-defaultborder rounded-[0.5rem] mt-2"
                                                    placeholder="Description"
                                                    value={giftproductDescription}
                                                    onChange={(e) => setGiftProductDescription(e.target.value)}
                                                    required
                                                />
                                            </div>
                                            <div className="xl:col-span-12 col-span-12">
                                                <label htmlFor="product-cost-add" className="form-label text-sm font-semibold text-defaulttextcolor">Points</label>
                                                <input
                                                    type="text"
                                                    className="form-control w-full text-defaultsize text-defaulttextcolor border border-defaultborder rounded-[0.5rem] mt-2"
                                                    id="product-cost-add"
                                                    placeholder="Reward points"
                                                    value={points}
                                                    onChange={(e) => setPoints(e.target.value)}
                                                />
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
                                                    id="file-upload"
                                                    className="mt-1 block w-full p-2 border rounded-md"
                                                    onChange={handleFileChange}
                                                />
                                                {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
                                            </div>

                                            {/* Image Previews */}
                                            <div className="grid grid-cols-3 gap-5 my-4">
                                                {fileDetails.length > 0 ? (
                                                    fileDetails.map((file, index) => (
                                                        <div key={index} className="image-preview">
                                                            <img
                                                                src={file.url}
                                                                alt={`Gift Product Image ${index + 1}`}
                                                                className="w-full h-auto rounded-lg"
                                                            />
                                                            <button
                                                                type="button"
                                                                className="remove-image-btn"
                                                                onClick={() => handleRemoveImage(index)}
                                                            >
                                                                Remove
                                                            </button>
                                                        </div>
                                                    ))
                                                ) : (
                                                    <p className='text-defaultsize text-defaulttextcolor'>No images uploaded yet.</p>
                                                )}
                                            </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="form-group text-center">
                                    <button
                                        type="submit"
                                        className="btn btn-primary text-white w-full py-2"
                                    >
                                        Save
                                    </button>
                                </div>
                        </form>
                    </div>
                </div>
            </div>

            {showSuccessAlert && <SuccessAlert message="Gift Product updated successfully!" />}
        </>
    );
};

export default EditGiftProduct;
