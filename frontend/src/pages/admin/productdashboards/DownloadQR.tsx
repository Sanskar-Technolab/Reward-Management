import React, { Fragment, useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Pageheader from '../../../components/common/pageheader/pageheader';
import TableComponent from '../../../components/ui/tables/tablecompnent';
import TableBoxComponent from '../../../components/ui/tables/tableboxheader';
import '../../../assets/css/style.css';
import '../../../assets/css/pages/admindashboard.css';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { jsPDF } from 'jspdf';
import SelectQRSize from '../../../components/ui/models/SelectQRCodeSideModel';

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
}

const DownloadQRCode: React.FC = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const [data, setData] = useState<DownloadProductQRCode[]>([]);
    const [filteredData, setFilteredData] = useState<DownloadProductQRCode[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [fromDate, setFromDate] = useState<Date | null>(null);
    const [toDate, setToDate] = useState<Date | null>(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<DownloadProductQRCode | null>(null);
    // const [qrSize, setQRSize] = useState<number>(50); 
    const itemsPerPage = 5;
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


// table filter logic-------------
    useEffect(() => {
    
        const filtered = data
          ?.map((item) => ({
            ...item,
            generated_date: item.generated_date ? item.generated_date: "",
          }))
          .filter((item) => {
            const query = searchQuery.toLowerCase();
            const matchesSearchQuery =
              (item.product_name && item.product_name.toLowerCase().includes(query)) ||
              (item.points && item.points.toString().includes(query)) ||
              (item.generated_time && item.generated_time.toString().includes(query))||
              (item.total_product && item.total_product.toString().includes(query));
    
            const fromDateMatch = fromDate
              ? new Date(item.generated_date || "") >= new Date(fromDate)
              : true;
            const toDateMatch = toDate
              ? new Date(item.generated_date || "") <= new Date(toDate)
              : true;
    
            return matchesSearchQuery && fromDateMatch && toDateMatch;
          });
    
        setFilteredData(filtered);
      }, [data, searchQuery, fromDate, toDate]);
    

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
        setSearchQuery(value);
        setCurrentPage(1);
      };

    const handleAddProductClick = () => {
        console.log("Back button clicked");
        navigate('/product-master');
    };

    const handleDateFilter = (from: Date | null, to: Date | null) => {
        setFromDate(from);
        setToDate(to);
        setCurrentPage(1);
      };
    

    const handleDownloadQR = (row: DownloadProductQRCode) => {
        setSelectedProduct(row);
        setModalOpen(true);
    };

    const closeModal = () => {
        setModalOpen(false);
        setSelectedProduct(null);
    };


    const handleConfirmDownload = async (selectedSize: any) => {
    if (!selectedProduct) {
        console.error("No product selected.");
        return;
    }
    console.log("Selected Product:", selectedProduct.product_name);

    if (!selectedProduct.qr_code_images || selectedProduct.qr_code_images.length === 0) {
        console.error("No QR images found.");
        return;
    }

    const zip = new JSZip();
    let pdf;

    
    // 30X30 with page break----------------------

    if (selectedSize == "30") {
        // console.log("Generating QR Code PDF for sticker roll");
    
        pdf = new jsPDF({
            orientation: 'landscape',
            unit: 'mm',
            format: [90, 31] // Updated width: 93mm, height: 30mm
        });
    
        const stickerSize = 28;  // Each sticker is 30x30mm
        const imagesPerRow = 3;  // 3 stickers per row
        const gapX = 2;          // Space between stickers in a row
        const gapY = 3;          // Row space increased to 3mm
    
        const marginLeft = 0.5;    // No extra padding
        const marginTop = 0.5;     // No extra padding
    
        let currentImageIndex = 0;
        let currentY = marginTop;
    
        while (currentImageIndex < selectedProduct.qr_code_images.length) {
            // Add new page after each row of 3 stickers
            if (currentImageIndex > 0 && currentImageIndex % imagesPerRow === 0) {
                pdf.addPage();
                currentY = marginTop; // Reset Y position for new page
            }
    
            // Calculate X position for stickers in a row
            const imageX = marginLeft + (currentImageIndex % imagesPerRow) * (stickerSize + gapX);
    
            // Add QR Code Image
            pdf.addImage(
                selectedProduct.qr_code_images[currentImageIndex].qr_code_image,
                'PNG',
                imageX,
                currentY,
                stickerSize,
                stickerSize
            );
    
            currentImageIndex++;
    
            // Move Y position for next row after every 3 stickers
            if (currentImageIndex % imagesPerRow === 0) {
                currentY += stickerSize + gapY; // Add row space (3mm)
            }
        }
    
        // pdf.save("qr_codes.pdf");
    }
    // 100X75 with page break----------------
    
    else if (selectedSize == "100") {
        // ==== QR CODE SIZE: 100x75 (1 QR Code Per Page) ====
        // console.log("Generating 100x75 QR Code PDF");

        // // pdf = new jsPDF();
        // pdf = new jsPDF({
        //     orientation: 'landscape',
        //     unit: 'mm',
        //     format: [100, 75] 
        // });

        // const imageWidth = 100;
        // const imageHeight = 75;
        // const rowSpacing = 5;
        // const paddingY = 1;

        // selectedProduct.qr_code_images.forEach((image: any, index: number) => {
        //     const qrCodeID = image.qr_code_image.split('/').pop()?.replace('.png', '') || 'Unknown QR Code ID';
        //     const pageWidth = imageWidth + 20;
        //     const pageHeight = imageHeight + rowSpacing + 15;

        //     if (index > 0) {
        //         pdf.addPage([pageWidth, pageHeight]);
        //     } else {
        //         pdf.internal.pageSize.width = pageWidth;
        //         pdf.internal.pageSize.height = pageHeight;
        //     }

        //     const imageX = (pageWidth - imageWidth) / 2;
        //     const imageY = 10;

        //     pdf.addImage(image.qr_code_image, 'PNG', imageX, imageY, imageWidth, imageHeight);

        //     // Add text below the QR code
        //     const qrCodeIdX = (pageWidth - pdf.getStringUnitWidth(qrCodeID) * pdf.internal.scaleFactor) / 2;
        //     const qrCodeIdY = imageY + imageHeight + rowSpacing;
        //     const productNameX = 8;
        //     const productNameY = imageY + imageHeight + paddingY;

        //     pdf.setFontSize(14);
        //     pdf.setFont('helvetica', 'bold');
        //     pdf.text(selectedProduct.product_name, productNameX, productNameY, { angle: 90 });

        //     pdf.setFontSize(14);
        //     pdf.setFont('helvetica', 'bold');
        //     pdf.text(qrCodeID, qrCodeIdX, qrCodeIdY);
        // });
       
        pdf = new jsPDF({
                orientation: 'landscape',
                unit: 'mm',
                format: [100, 75] 
            });
        
        const imageWidth = 100;
        const imageHeight = 75;
        const rowSpacing = 2;
        const paddingY = 1;
        
        selectedProduct.qr_code_images.forEach((image: any, index: number) => {
            const qrCodeID = image.qr_code_image.split('/').pop()?.replace('.png', '') || 'Unknown QR Code ID';
            const pageWidth = imageWidth + 40;
            let pageHeight = imageHeight + rowSpacing + 20; // Initial height
        
            if (index > 0) {
                pdf.addPage([pageWidth, pageHeight]);
            } else {
                pdf.internal.pageSize.width = pageWidth;
                pdf.internal.pageSize.height = pageHeight;
            }
        
            const imageX = (pageWidth - imageWidth) / 2;
            const imageY = 10;
            pdf.addImage(image.qr_code_image, 'PNG', imageX, imageY, imageWidth, imageHeight);
        
            //  Determine Font Size Based on Character Length
            let fontSize = selectedProduct.product_name.length > 10 ? 20 : 35;
            pdf.setFontSize(fontSize);
            pdf.setFont('helvetica', 'bold');
        
            const textX = 8; // Adjust horizontal position
            const textY = pageHeight - 12; // Adjust vertical position
        
            if (selectedProduct.product_name.length > 10) {
                //  Wrap Product Name if Length > 10
                const wrappedText = pdf.splitTextToSize(selectedProduct.product_name, pageHeight - 20);
                pdf.text(wrappedText, textX, textY, { angle: 90 });
            } else {
                //  Print Product Name Directly if Length ≤ 10
                pdf.text(selectedProduct.product_name, textX+8, textY-10, { angle: 90 });
            }
        
            //  QR Code ID (Centered)
            const qrCodeIdY = imageY + imageHeight + paddingY+8 + rowSpacing;
            pdf.text(qrCodeID, (pageWidth - pdf.getStringUnitWidth(qrCodeID) * pdf.internal.scaleFactor) / 2, qrCodeIdY, { align: 'center' });
        });
        

        // pdf = new jsPDF({
        //         orientation: 'landscape',
        //         unit: 'mm',
        //         format: [100, 75] 
        //     });
        
        // const imageWidth = 100;
        // const imageHeight = 75;
        // const rowSpacing = 2;
        // const paddingY = 1;
        
        // selectedProduct.qr_code_images.forEach((image: any, index: number) => {
        //     const qrCodeID = image.qr_code_image.split('/').pop()?.replace('.png', '') || 'Unknown QR Code ID';
        //     const pageWidth = imageWidth + 30;
        //     let pageHeight = imageHeight + rowSpacing + 20; // Initial height
        
        //     if (index > 0) {
        //         pdf.addPage([pageWidth, pageHeight]);
        //     } else {
        //         pdf.internal.pageSize.width = pageWidth;
        //         pdf.internal.pageSize.height = pageHeight;
        //     }
        
        //     const imageX = (pageWidth - imageWidth) / 2;
        //     const imageY = 10;
        //     pdf.addImage(image.qr_code_image, 'PNG', imageX, imageY, imageWidth, imageHeight);
        
        //     //  Wrap Product Name
        //     const wrappedText = pdf.splitTextToSize(selectedProduct.product_name, pageHeight - 10);
        //     const textX = 8; // Adjust horizontal position
        //     const textY = pageHeight; // Adjust vertical position
        
        //     //  Rotate and Print Product Name (90 Degrees)
        //     pdf.setFontSize(14);
        //     pdf.setFont('helvetica', 'bold');
        //     pdf.text(wrappedText, textX, textY-12, { angle: 90 });
        
        //     //  QR Code ID (Centered)
        //     const qrCodeIdY = imageY + imageHeight + paddingY + wrappedText.length * 2 + rowSpacing;
        //     pdf.text(qrCodeID, (pageWidth - pdf.getStringUnitWidth(qrCodeID) * pdf.internal.scaleFactor) / 2, qrCodeIdY);
        // });
        
        
    } else {
        console.error("Invalid size selected.");
        return;
    }

    // Convert PDF to blob and add to ZIP
    const pdfBlob = pdf.output("blob");
    zip.file(`${selectedProduct.product_name}_QR_Codes.pdf`, pdfBlob);

    // Generate ZIP and trigger download
    zip.generateAsync({ type: "blob" }).then((content) => {
        saveAs(content, `${selectedProduct.product_name}_QR_Codes.zip`);
    });
};


    

    return (
        <Fragment>
            <Pageheader 
                currentpage="Download QR" 
                activepage="/product-master" 
                mainpage="/download-qr-code" 
                activepagename="Product Master" 
                mainpagename="Download QR" 
            />
            <div className="grid grid-cols-12 gap-x-6 bg-white mt-5 rounded-lg shadow-lg">
                <div className="xl:col-span-12 col-span-12">
                    <TableBoxComponent
                        title="Download Product QR"
                        onSearch={handleSearch}
                        onAddButtonClick={handleAddProductClick}
                        buttonText="Back"
                        showButton
                        showFromDate
                        showToDate
                        onDateFilter={handleDateFilter}
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
                                // data={data}
                                data={filteredData.slice(
                                    (currentPage - 1) * itemsPerPage,
                                    currentPage * itemsPerPage
                                  )}
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

            {modalOpen && selectedProduct && (
                <SelectQRSize isOpen={modalOpen} onClose={closeModal} onCancel={closeModal} onConfirm={handleConfirmDownload} />
            )}
        </Fragment>
    );
};

export default DownloadQRCode;
