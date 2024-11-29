import React, { Fragment, useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Pageheader from '../../../components/common/pageheader/pageheader';
import TableComponent from '../../../components/ui/tables/tablecompnent'; // Ensure correct path
import TableBoxComponent from '../../../components/ui/tables/tableboxheader';
import '../../../assets/css/style.css';
import '../../../assets/css/pages/admindashboard.css';
// import html2canvas from 'html2canvas';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { jsPDF } from 'jspdf';



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
    };

    const handleAddProductClick = () => {
        console.log("Back button clicked");
        navigate('/product-master');
    };

    // download and create pdf for qr images---------
    
    const handleDownloadQR = async (row: DownloadProductQRCode) => {
        const zip = new JSZip();
        const pdf = new jsPDF();
         // Set image width to 100
        const imageWidth = 100; 
        // Set image height to 75
        const imageHeight = 75;  
        const rowSpacing = 15;
        const maxImagesPerPage = 3;
    
        row.qr_code_images.forEach((image, index) => {
            const totalImages = row.qr_code_images.length;
    
            // Extract QR Code ID from the image path
            const qrCodeID = image.qr_code_image.split('/').pop()?.replace('.png', '') || 'Unknown QR Code ID';
    
            // Calculate the width of the QR Code ID text
            const qrCodeIdWidth = pdf.getStringUnitWidth(qrCodeID) * pdf.internal.scaleFactor;
            
            // Set the page width to be the max of the image width and the QR Code ID text width
             // Add some padding
            const pageWidth = Math.max(imageWidth, qrCodeIdWidth) + 20; 
    
            // Adjust X position to center the image and text on the page
            const x = (pageWidth - imageWidth) / 2;
    
            // Calculate Y position for the QR code image
            const y = (index % maxImagesPerPage) * (imageHeight + rowSpacing) +20; 
    
            // Add QR code image to the PDF at the specified x, y position with the new size
            pdf.addImage(image.qr_code_image, 'PNG', x+2, y, imageWidth, imageHeight);
    
            // Add rotated product name on the left side of the QR code (rotated -90 degrees)
            pdf.saveGraphicsState();
            pdf.setFontSize(16);
            pdf.setFont('helvetica', 'bold');
            pdf.text(row.product_name, x-2, y + imageHeight / 2, { angle: 90 });
            pdf.restoreGraphicsState();
    
            // Add QR Code ID below the QR code
            // Some space below the image
            const qrCodeIdY = y + imageHeight + 5+2; 
            // Center horizontally
            const qrCodeIdX = (pageWidth - qrCodeIdWidth) / 2;  
    
            pdf.setFont('helvetica', 'bold');
            pdf.setFontSize(16); 
            pdf.text(qrCodeID, qrCodeIdX, qrCodeIdY);
    
            // Add a page break after every 3 images (3 images per page)
            if ((index + 1) % maxImagesPerPage === 0 && index !== totalImages -  1) {
                pdf.addPage();
            }
    
            // Set the page width dynamically for each page
            pdf.internal.pageSize.width = pageWidth;
        });
    
        // Save the PDF as a blob and add it to the ZIP file
        const pdfBlob = pdf.output('blob');
        zip.file(`${row.product_name || 'QR_Codes'}.pdf`, pdfBlob);
    
        // Generate the ZIP and download it
        const zipBlob = await zip.generateAsync({ type: 'blob' });
        saveAs(zipBlob, 'qr_codes.zip');
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
                    <div className="">
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