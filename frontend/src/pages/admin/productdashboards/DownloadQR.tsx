import React, { Fragment, useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Pageheader from '../../../components/common/pageheader/pageheader';
import TableComponent from '../../../components/ui/tables/tablecompnent'; // Ensure correct path
import TableBoxComponent from '../../../components/ui/tables/tableboxheader';
import '../../../assets/css/style.css';
import '../../../assets/css/pages/admindashboard.css';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';

interface QRCodeImage {
    qr_code_image: string;
    points: number;
}

interface DownloadProductQRCode {
    product_name?: string;
    generated_date?: string;
    total_product?: number;
    points?: number;
    qr_code_images?: QRCodeImage[];
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

    // Function to handle QR code image download
    // const handleDownloadQR = (row: DownloadProductQRCode) => {
    //     if (row.qr_code_images) {
    //         row.qr_code_images.forEach((image) => {
    //             const link = document.createElement('a');
    //             link.href = image.qr_code_image;
    //             link.download = image.qr_code_image.split('/').pop() || 'qr_code.png';
    //             link.click();
    //         });
    //     }
    // };

//   // Function to handle QR code image download as a zip file
const handleDownloadQR = async (row: DownloadProductQRCode) => {
    if (row.qr_code_images) {
        const zip = new JSZip();
        const imgFolder = zip.folder("qr_code_images");

        const imageFetchPromises = row.qr_code_images.map(async (image) => {
            const response = await fetch(image.qr_code_image);
            const blob = await response.blob();
            const imageBitmap = await createImageBitmap(blob); 

            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');

            if (ctx) {
                const padding = 20; 
                // const productQrNamePaddingLeft = 30;

                const productName = row.product_name || 'Unknown Product';
                const productQrId = image.qr_code_image.split('/').pop()?.replace('.png', '') || 'Unknown QR Code ID';

                // Set font for product_name and measure its height
                ctx.font = '20px Arial'; 
                const productNameHeight = 20; 
                const productNameWidth = ctx.measureText(productName).width; 

                // Set font for product_qr_id and measure its width
                ctx.font = '20px Arial'; 
                const productQrIdHeight = 20; 
                const productQrIdWidth = ctx.measureText(productQrId).width; 

                // Calculate canvas dimensions
                const canvasWidth = Math.max(imageBitmap.width, productNameWidth, productQrIdWidth) + 3 * padding;
                const canvasHeight = imageBitmap.height + productNameHeight + productQrIdHeight + 60; 

                // Set canvas dimensions
                canvas.width = canvasWidth; 
                canvas.height = canvasHeight;

                ctx.fillStyle = '#FFFFFF';
                ctx.fillRect(0, 0, canvas.width, canvas.height);

                const imageX = (canvasWidth - imageBitmap.width) / 2; 
                const imageY = padding + 10; 
                ctx.drawImage(imageBitmap, imageX, imageY);

                // Draw product_name vertically on the left side of the QR code
                ctx.save();
                ctx.textAlign = 'center';
                ctx.translate(padding - 10, (canvasHeight/2)); 
                // Rotate 90 degrees counterclockwise
                ctx.rotate(-Math.PI / 2); 
                ctx.fillStyle = '#000000'; 

               // Draw the product name vertically
                ctx.fillText(productName, 0, 10);
                ctx.restore();

                // Draw product_qr_id centered horizontally below the QR code
                ctx.fillStyle = '#000000'; 
                ctx.font = '12px Arial'; 
                // 5 pixels below the QR code image
                const productQrIdY = imageY + imageBitmap.height + 5 + productQrIdHeight; 
                ctx.fillText(productQrId, (canvasWidth - productQrIdWidth) / 2, productQrIdY); 

                const finalImageBlob = await new Promise<Blob>((resolve) => canvas.toBlob(resolve));
                const imageName = image.qr_code_image.split('/').pop() || 'qr_code.png';
                imgFolder?.file(imageName, finalImageBlob!); 
            }
        });

        await Promise.all(imageFetchPromises);

        zip.generateAsync({ type: 'blob' }).then((blob) => {
            saveAs(blob, `${row.product_name || 'qr_codes'}.zip`);
        });
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
            {/* <Pageheader currentpage="Download QR" activepage="Product Master" mainpage="Download QR" /> */}
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
                                showEdit={true} // Adjust based on your needs
                                iconsConfig={{
                                    editIcon: "bi bi-download",
                                }}
                                onEdit={handleDownloadQR} // Pass the entire row to handleDownloadQR
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
