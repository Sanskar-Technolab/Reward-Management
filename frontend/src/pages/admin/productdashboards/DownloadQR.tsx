import React, { Fragment, useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Pageheader from '../../../components/common/pageheader/pageheader';
import TableComponent from '../../../components/ui/tables/tablecompnent'; // Ensure correct path
import TableBoxComponent from '../../../components/ui/tables/tableboxheader';
import '../../../assets/css/style.css';
import '../../../assets/css/pages/admindashboard.css';
import html2canvas from 'html2canvas';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';


interface QRCodeImage {
    qr_code_image: string;
    points: number;
    product_qr_id: string;
}

interface DownloadProductQRCode {
    product_name?: string;
    generated_date?: string;
    generated_time?: string;
    total_product?: number;
    points?: number;
    qr_code_images?: QRCodeImage[];
    product_qr_id?:string;
}

const DownloadQRCode: React.FC = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const [data, setData] = useState<DownloadProductQRCode[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [itemsPerPage] = useState(5);
    const navigate = useNavigate();
    const urlParams = new URLSearchParams(window.location.search);
    const productName = urlParams.get('product');

    useEffect(() => {
        document.title = 'Download QR';
        const fetchData = async () => {
            if (!productName) {
                setError('Product name is missing in the URL');
                return;
            }

            try {
                const response = await axios.get(`/api/method/reward_management.api.print_qr_code.get_product_by_name`, {
                    params: { productName },
                });

                if (response.data.message && Array.isArray(response.data.message.message)) {
                    console.log("data-------", response);
                    // Aggregate data by generated_date and product_name
                    const aggregatedData = response.data.message.message.map((item: any) => ({
                        product_name: item.qr_code_images[0]?.product_name || 'Unknown Product Name',
                        generated_date: item.generated_date,
                        generated_time: item.generated_time,
                        total_product: item.total_product,
                        points: item.qr_code_images.reduce((acc: number, img: any) => acc + img.points, 0),
                        qr_code_images: item.qr_code_images, // Include qr_code_images here
                    }));

                    setData(aggregatedData);
                } else {
                    setData([]);
                }
            } catch (error) {
                setError(error instanceof Error ? error.message : 'Failed to fetch data');
            }
        };

        fetchData();
    }, [productName]);

    const totalPages = Math.ceil(data.length / itemsPerPage);

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

    const handleSearch = (value: string) => {
        console.log("Search value:", value);
        // Implement search logic here
    };

    const handleAddProductClick = () => {
        console.log("Back button clicked");
        navigate('/product-master');
    };

    const handleDownloadQR = async () => {
        // Create a container div for all QR codes
        const qrContainerDiv = document.createElement('div');
        qrContainerDiv.style.display = 'flex';
        qrContainerDiv.style.flexWrap = 'wrap';
        qrContainerDiv.style.padding = '15px';
        qrContainerDiv.style.gap = '20px';
        qrContainerDiv.style.justifySelf = 'center';
        // qrContainerDiv.style.alignItems='center';
    
        data.forEach((row) => {
            row.qr_code_images?.forEach((image) => {
                const qrWrapperDiv = document.createElement('div');
                qrWrapperDiv.style.display = 'flex';
                qrWrapperDiv.style.flexDirection = 'row'; 
                qrWrapperDiv.style.alignItems = 'center';
                // qrWrapperDiv.style.justifyItems = 'center'; 
    
                const productNameDiv = document.createElement('div');
                productNameDiv.style.display= 'flex';
                productNameDiv.style.alignItems='center';
                productNameDiv.style.fontSize = "20px";
                productNameDiv.style.fontWeight = "bold";
                // Rotate the product name
                productNameDiv.style.transform = 'rotate(-90deg)'; 
                // Prevent wrapping
                productNameDiv.style.whiteSpace = 'nowrap'; 
    
                productNameDiv.innerText = row.product_name || 'Unknown Product Name';
    
                const qrImageWrapper = document.createElement('div');
                qrImageWrapper.style.display = 'flex';
                 // Stack image and QR ID vertically
                qrImageWrapper.style.flexDirection = 'column';
                 // Center content horizontally
                qrImageWrapper.style.alignItems = 'center';
    
                const img = document.createElement('img');
                img.src = image.qr_code_image;
                // Set a max width for the image to prevent overflow
                // img.style.maxWidth = '100px'; 
    
                const qrIdDiv = document.createElement('div');
                qrIdDiv.style.textAlign = 'center';
                qrIdDiv.style.fontSize = "20px";
                qrIdDiv.style.fontWeight = "bold";
                qrIdDiv.innerText = image.qr_code_image.split('/').pop()?.replace('.png', '') || 'Unknown QR Code ID';
                // Append image to the wrapper
                qrImageWrapper.appendChild(img);
                 // Append QR ID below the image
                qrImageWrapper.appendChild(qrIdDiv);
                 // Append product name first
                qrWrapperDiv.appendChild(productNameDiv);
                 // Append the image wrapper to the container
                qrWrapperDiv.appendChild(qrImageWrapper);
                // Append wrapper to the container
                qrContainerDiv.appendChild(qrWrapperDiv); 
            });
        });
    
        // Append the container to the body for capturing
        document.body.appendChild(qrContainerDiv);
    
        // Capture the div using html2canvas
        try {
            const canvas = await html2canvas(qrContainerDiv, { useCORS: true });
            const zip = new JSZip();
            // Convert canvas to base64
            const imgData = canvas.toDataURL('image/png').split(',')[1]; 
            // Add the captured image to the ZIP file
            zip.file('qr_codes.png', imgData, { base64: true }); 
    
            const content = await zip.generateAsync({ type: 'blob' });
            // Download the ZIP file
            saveAs(content, 'qr_codes.zip'); 
    
        } catch (error) {
            console.error('Error capturing images:', error);
        } finally {
            // Clean up the DOM
            document.body.removeChild(qrContainerDiv); 
        }
    };
    
    return (
        <Fragment>
            <Pageheader 
                currentpage={"Download QR"} 
                activepage={"/product-master"} 
                mainpage={"/download-qr-code"} 
                activepagename='Product Master' 
                mainpagename='Download QR' 
            />
            <div className="grid grid-cols-12 gap-x-6 bg-white mt-5 rounded-lg shadow-lg">
                <div className="xl:col-span-12 col-span-12">
                    <div className="box">
                        <TableBoxComponent
                            title="Download Product QR"
                            onSearch={handleSearch}
                            onAddButtonClick={handleAddProductClick}
                            buttonText="Back"
                            showButton={true}
                            icon="ri-arrow-left-line"
                        />

                        <div className="box-body m-5">
                            <TableComponent<DownloadProductQRCode>
                                columns={[
                                    { header: 'Product Name', accessor: 'product_name' },
                                    { header: 'Reward Points', accessor: 'points' },
                                    { header: 'Generated Date', accessor: 'generated_date' },
                                    { header: 'Generated Time', accessor: 'generated_time' },
                                    { header: 'Total QR', accessor: 'total_product' },
                                ]}
                                data={data}
                                currentPage={currentPage}
                                itemsPerPage={itemsPerPage}
                                handlePrevPage={handlePrevPage}
                                handleNextPage={handleNextPage}
                                handlePageChange={handlePageChange}
                                showProductQR={false}
                                editHeader='Download QR'
                                showEdit={true} 
                                iconsConfig={{
                                    editIcon: "bi bi-download",
                                }}
                                 // Pass the entire row to handleDownloadQR
                                onEdit={handleDownloadQR}
                                columnStyles={{
                                    'Product Name': 'text-[var(--primaries)] font-semibold',
                                }}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </Fragment>
    );
};

export default DownloadQRCode;
