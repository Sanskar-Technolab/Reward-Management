import { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { Html5QrcodeScanner } from 'html5-qrcode';
import '../../assets/css/pages/qrscanner.css';
import SuccessAlert from '../../components/ui/alerts/SuccessAlert';
import PointCollectAlert from '../../components/ui/alerts/PointCollected';
import { Box, Button, Text } from '@radix-ui/themes';

const QRScanner = () => {
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [carpenterData, setCarpenterData] = useState<any | null>(null);
  const [showAlert, setShowAlert] = useState<boolean>(false);
  const [showPointCollectAlert, setShowPointCollectAlert] = useState<boolean>(false);
  const [alertMessage, setAlertMessage] = useState<string>('');
  const [alertTitle, setAlertTitle] = useState<string>('');
  const [isError, setIsError] = useState<boolean>(false);
  const [isCollectingPoints, setIsCollectingPoints] = useState<boolean>(false);
  const qrScannerRef = useRef<HTMLDivElement | null>(null);
  const [customerId, setCustomerId] = useState<string>('');
  const [productTableName, setProductTableName] = useState<string>('');
  const [productQrId, setProductQrId] = useState<string>('');

  const [qrnumber, setQrNumber] = useState<string>('');

  const [productQrPoints, setProductQrPoints] = useState<string>('');
  const [productEanredAmount, setProductEarnedAmount] = useState<string>('');
  useEffect(() => {

    document.title = 'QR Scanner';

    const fetchUserEmailAndInitScanner = async () => {
      try {
        const userResponse = await axios.get(`/api/method/frappe.auth.get_logged_user`, {
        });
        const userData = userResponse.data;

        if (userData.message) {
          console.log("Logged user data:", userData);
          setUserEmail(userData.message);
          await fetchAndLogCarpenterData();
          initQRScanner();
        } else {
          console.error("No email found in response.");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    const fetchAndLogCarpenterData = async () => {
      try {
        const carpenterResponse: any = await axios.get(`/api/method/reward_management.api.carpenter_master.get_customer_details`, {

        });
        console.log("Carpenter data:", carpenterResponse.data);
        const customer_id = carpenterResponse.data.message.name || '';
        setCustomerId(customer_id);
        if (carpenterResponse.data && !carpenterResponse.error) {
          const customer = carpenterResponse.data.message;
          console.log("Customer Name:", customer.name);
          console.log("Total Points:", customer.total_points);
          setCarpenterData(customer); 
        } else {
          console.error("Error fetching carpenter data:", carpenterResponse.error);
        }
      } catch (error) {
        console.error("Error fetching carpenter data:", error);
      }
    };

    const initQRScanner = () => {
      const onScanSuccess = async (decodedText: string) => {
        console.log("Decoded QR Code:", decodedText);
        try {
          const productResponse = await axios.get(`/api/method/reward_management.api.qr_code_product_detail.get_product_details_from_qr`, {
            params: { decode_text: decodedText },
          });
        // console.log("data",productResponse)


          if (productResponse.data.message?.error) {
            const errorMessage = productResponse.data.message.error;
            setAlertTitle("Error");
            setAlertMessage(errorMessage);
            setIsError(true);
            setShowAlert(true);
          } else {
            const productData = productResponse.data;
            console.log("Scanned QR data", productData);
            setProductTableName(productData.message.product_table_name);
            setProductQrId(productData.message.product_qr_id);
            setProductQrPoints(productData.message.points);
            setProductEarnedAmount(productData.message.earned_amount);
            setAlertMessage(
              `Product Name: ${productData.message.product_name} Points: ${productData.message.points} Earned Amount: ${productData.message.earned_amount}`
            );
            setIsError(false);
            setCarpenterData(productData);
            setShowAlert(true);
          }
        } catch (error) {
          console.error("Error fetching product details:", error);
          setAlertTitle("Error"); 
          setAlertMessage("Error fetching product details. Please try again.");
          setIsError(true);
          setShowAlert(true); 
        }
      };


      const html5QrCodeScanner: any = new Html5QrcodeScanner("my-qr-reader", { fps: 10, qrbox: 250 }, true);
      html5QrCodeScanner.render(onScanSuccess);

      const reader = qrScannerRef.current;
      if (reader) {
        const scannerWidth = reader.clientWidth;
        if (scannerWidth < 250) {
          html5QrCodeScanner.setWidth(scannerWidth);
        }
      }
    };

    fetchUserEmailAndInitScanner();
  }, []);

  // handle collect points
  const handleCollectPoints = async () => {
    setIsCollectingPoints(true);
    try {

      if (!customerId || !productTableName || !productQrId || !productQrPoints) {
        throw new Error("Customer ID is missing");
      }

      // First API call to collect points
      const response = await axios.post(`/api/method/reward_management.api.carpenter_master.update_customer_points`, {
        points: productQrPoints,
        carpenter_id: customerId
      });

      if (response.data.message?.success === true) {
        console.log("Points collected successfully:", response);

        // Second API call to update scanned status
        const updateResponse = await axios.post(`/api/method/reward_management.api.qr_code_product_detail.update_scanned_status`, {
          product_table_name: productTableName,
          product_qr_id: productQrId,
          carpenter_id: customerId
        });

        console.log("Product QR table data:", updateResponse);

        if (updateResponse.data.message?.success === true) {
          console.log("Scanned status updated successfully:", updateResponse);
          setShowAlert(false);
          setAlertMessage("Points collected and status updated successfully!");
          setIsError(false);
          setShowPointCollectAlert(true);
        } else {
          setAlertMessage("Failed to update scanned status. Please try again.");
          setIsError(true);
        }
      } else {
        setAlertMessage("Failed to collect points. Please try again.");
        setIsError(true);
      }
    } catch (error) {
      console.error("Error collecting points or updating status:", error);
      setAlertMessage("Error collecting points or updating status. Please try again.");
      setIsError(true);
    }
    setIsCollectingPoints(false);
  };


  const onPointCollect = async () => {
    try {
      // Call the API to update carpenter points
      const response = await axios.post(`/api/method/reward_management.api.carpenter_master.update_carpainter_points`, {
        product_name: productTableName,
        points: productQrPoints,
        earned_amount: productEanredAmount
      });

      if (response.data.message?.success === true) {
        console.log("Carpenter points updated successfully:", response);
        // Close the alert or perform other actions if needed
        setShowPointCollectAlert(false);
      } else {
        console.error("Failed to update carpenter points. Please try again.");
      }
    } catch (error) {
      console.error("Error updating carpenter points:", error);
    }
  };
  const VerifyQRCode = async () => {
    console.log("Button clicked");
  
    if (!qrnumber) {
      alert("Please enter a QR number");
      return;
    }
  
    try {
      // Call the API
      const response = await fetch(`/api/method/reward_management.api.qr_code_product_detail.get_product_details_from_qr_id?product_qr_id=${encodeURIComponent(qrnumber)}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }
  
      const data = await response.json();
  
      // Check if it's a scanned message
      if (data.message && typeof data.message === "object" && data.message.message === "This Product QR has already been scanned.") {
        console.log("API Response:", data.message.message);
        setAlertMessage(data.message.message); // Set the "already scanned" message
        setIsError(true);
        setShowAlert(true);
        return; // Exit early since it's already scanned
      }
  
      if (data.message) {
        console.log("API QR Response:", data);
        const productData = data.message;
  
        // Set product details
        setProductTableName(productData.product_table_name);
        setProductQrId(productData.product_qr_id);
        setProductQrPoints(productData.points);
        setProductEarnedAmount(productData.earned_amount);
  
        // Display product details in the alert
        setAlertMessage(
          `Product Name: ${productData.product_name}\nPoints: ${productData.points}\nEarned Amount: ${productData.earned_amount}`
        );
        setIsError(false);
        setCarpenterData(productData);
        setShowAlert(true);
      } else {
        // Handle error from API
        const errorMessage = data.error || "Unknown error occurred";
        alert(`Error: ${errorMessage}`);
        setAlertTitle("Error");
        setAlertMessage(errorMessage);
        setIsError(true);
        setShowAlert(true);
      }
    } catch (error) {
      console.error("Error fetching QR Code details:", error);
      alert("Failed to verify QR Code. Please try again.");
    }
  };
  
  // const VerifyQRCode = async () => {
  //   console.log("Button clicked");
  
  //   if (!qrnumber) {
  //     alert("Please enter a QR number");
  //     return;
  //   }
  
  //   try {
  //     // Call the API
  //     const response = await fetch(`/api/method/reward_management.api.qr_code_product_detail.get_product_details_from_qr_id?product_qr_id=${encodeURIComponent(qrnumber)}`, {
  //       method: 'GET',
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //     });
  
  //     if (!response.ok) {
  //       throw new Error(`Error: ${response.statusText}`);
  //     }
  
  //     const data = await response.json();
  
  //     if (data.message) {
  //       console.log("API Response:", data);
  //       const productData = data.message;
  
  //       setProductTableName(productData.product_table_name);
  //       setProductQrId(productData.product_qr_id);
  //       setProductQrPoints(productData.points);
  //       setProductEarnedAmount(productData.earned_amount);
  //       setAlertMessage(
  //         `Product Name: ${productData.product_name}\nPoints: ${productData.points}\nEarned Amount: ${productData.earned_amount}`
  //       );
  //       setIsError(false);
  //       setCarpenterData(productData);
  //       setShowAlert(true);
  //     } else {
  //       const errorMessage = data.error || "Unknown error occurred";
  //       alert(`Error: ${errorMessage}`);
  //       setAlertTitle("Error");
  //       setAlertMessage(errorMessage);
  //       setIsError(true);
  //       setShowAlert(true);
  //     }
  //   } catch (error) {
  //     console.error("Error fetching QR Code details:", error);
  //     alert("Failed to verify QR Code. Please try again.");
  //   }
  // };
  return (
    <main className="flex items-center justify-center h-screen">
      <div className="border border-defaultborder p-6 bg-white shadow-lg rounded-[5px]">
        <h1 className="text-base text-primary font-semibold mb-3 text-center">Scan QR Codes</h1>
        <div className="flex justify-center items-center w-[400px] border rounded-[5px]">
          <div id="my-qr-reader" className='w-[400px]' ref={qrScannerRef}></div>
        </div>
        <div className="flex items-center text-primary text-md text-center pt-3 font-semibold">
          <hr className="flex-grow border-[#D9D9D9]" />
          <span className="px-3">OR</span>
          <hr className="flex-grow border-[#D9D9D9]" />
        </div>
        <div className='pt-3'>
          <div className='text-primary text-base '>QR Number</div>
          <div className=''>
            <Box className="xl:col-span-12 col-span-12 mb-3">
              <input
                id='qrnumber'
                type='text'
                placeholder='ABCX1324'
                onChange={(e) => setQrNumber(e.target.value)}
                value={qrnumber}
                className="border rounded-[5px] p-2 mt-2 text-xs w-full"
              />
            </Box>
            <Button
              type="submit"
              onClick={VerifyQRCode}
              id="sunmit"
              className="w-full mb-2 ti-btn ti-btn-primary !bg-primary !text-white !font-medium"
            > Verify</Button>
          </div>

        </div>
      </div>


      {showAlert && (
        isError ? (
          <SuccessAlert
            message={alertMessage}
            title={alertTitle}
            buttonLabel="Close"
            onClose={() => setShowAlert(false)}
            showButton={true} onCancel={function (): void {
              throw new Error('Function not implemented.');
            }} />
        ) : (
          <SuccessAlert
            message={alertMessage}
            title="QR Code Successfully Scanned"
            collectButtonLabel="Collect"
            showMessage={true}
            onClose={() => setShowAlert(false)}
            showCollectButton={true}
            onCollect={handleCollectPoints}
            showButton={true} onCancel={function (): void {
              throw new Error('Function not implemented.');
            }} />
        )
      )}

      {showPointCollectAlert && (
        <PointCollectAlert
          pointmessage="Congratulations! Your points have been collected."
          onPointClose={() => setShowPointCollectAlert(false)}
          showPointCollectButton={true}
          collectButtonLabel="Ok"
          onPointCollect={onPointCollect}
        />
      )}
    </main>
  );
};

export default QRScanner;
