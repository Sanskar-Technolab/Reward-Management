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
    // const handleDownloadQR = async (row: DownloadProductQRCode) => {
    //     const zip = new JSZip();
    //     const pdf = new jsPDF();
    
    //     const imageWidth = 100; // Image width
    //     const imageHeight = 75; // Image height
    //     const rowSpacing = 15; // Spacing between text and image
    
    //     row.qr_code_images.forEach((image, index) => {
    //         const qrCodeID = image.qr_code_image.split('/').pop()?.replace('.png', '') || 'Unknown QR Code ID';
            
    //         // Calculate dimensions of the page based on content
    //         const qrCodeIdWidth = pdf.getStringUnitWidth(qrCodeID) * pdf.internal.scaleFactor;
    //         const pageWidth = Math.max(imageWidth, qrCodeIdWidth) + 30; // Adding some padding
    //         const pageHeight = imageHeight + rowSpacing + 40; // Adjust height for image and text spacing
            
    //         // Add a new page and set its dimensions
    //         if (index > 0) {
    //             pdf.addPage([pageWidth, pageHeight]);
    //         } else {
    //             pdf.internal.pageSize.width = pageWidth;
    //             pdf.internal.pageSize.height = pageHeight;
    //         }
            
    //         // Calculate positions to center the image and text
    //         const imageX = (pageWidth - imageWidth) / 2;
    //         const imageY = 10; // Some top margin
    //         const qrCodeIdX = (pageWidth - qrCodeIdWidth) / 2;
    //         const qrCodeIdY = imageY + imageHeight + rowSpacing;
    
    //         // Add the QR code image to the page
    //         pdf.addImage(image.qr_code_image, 'PNG', imageX, imageY, imageWidth, imageHeight);
    
    //         // Add the product name rotated on the left
    //         pdf.saveGraphicsState();
    //         pdf.setFontSize(16);
    //         pdf.setFont('helvetica', 'bold');
    //         pdf.text(row.product_name, imageX - 5, imageY + imageHeight / 2, { angle: 90 });
    //         pdf.restoreGraphicsState();
    
    //         // Add the QR Code ID below the image
    //         pdf.setFont('helvetica', 'bold');
    //         pdf.setFontSize(16);
    //         pdf.text(qrCodeID, qrCodeIdX, qrCodeIdY);
    //     });
    
    //     // Save the PDF as a blob and add it to the ZIP file
    //     const pdfBlob = pdf.output('blob');
    //     zip.file(`${row.product_name || 'QR_Codes'}.pdf`, pdfBlob);
    
    //     // Generate the ZIP and download it
    //     const zipBlob = await zip.generateAsync({ type: 'blob' });
    //     saveAs(zipBlob, 'qr_codes.zip');
    // };
    const handleDownloadQR = async (row: DownloadProductQRCode) => {
        const zip = new JSZip();
        const pdf = new jsPDF();
    
        const imageWidth = 100; 
        const imageHeight = 75; 
        const rowSpacing = 10; 
        const paddingY = 10; 
        const topPadding = 20;    
        row.qr_code_images.forEach((image, index) => {
            const qrCodeID = image.qr_code_image.split('/').pop()?.replace('.png', '') || 'Unknown QR Code ID';
            
            // Calculate dimensions of the page based on content
            const qrCodeIdWidth = pdf.getStringUnitWidth(qrCodeID) * pdf.internal.scaleFactor;
            const pageWidth = Math.max(imageWidth, qrCodeIdWidth) + 30; 
            const pageHeight = imageHeight + rowSpacing + 40 +topPadding; 
            
            // Add a new page and set its dimensions
            if (index > 0) {
                pdf.addPage([pageWidth, pageHeight]);
            } else {
                pdf.internal.pageSize.width = pageWidth;
                pdf.internal.pageSize.height = pageHeight;
            }
    
            // Calculate positions for centering the image and text
            const imageX = (pageWidth - imageWidth) / 2; 
            const imageY = (pageHeight - imageHeight - rowSpacing - 30) / 2; 
    
            const qrCodeIdX = (pageWidth - qrCodeIdWidth) / 2; 
            const qrCodeIdY = imageY + imageHeight + rowSpacing; 
            // Center the product name vertically inside the available space
            const productNameX = imageX - 5; 
            const productNameY = imageY + imageHeight / 2 + paddingY;
    
            // Add the QR code image to the page
            pdf.addImage(image.qr_code_image, 'PNG', imageX, imageY, imageWidth, imageHeight);
    
            // Add the product name rotated on the left (centered vertically in the available space)
            pdf.saveGraphicsState();
            pdf.setFontSize(16);
            pdf.setFont('helvetica', 'bold');
            pdf.text(row.product_name, productNameX, productNameY, { angle: 90 });
            pdf.restoreGraphicsState();
    
            // Add the QR Code ID below the image
            pdf.setFont('helvetica', 'bold');
            pdf.setFontSize(16);
            pdf.text(qrCodeID, qrCodeIdX, qrCodeIdY);
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