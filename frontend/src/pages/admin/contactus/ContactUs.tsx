import '../../../assets/css/style.css';
import '../../../assets/css/pages/admindashboard.css';
import Pageheader from '../../../components/common/pageheader/pageheader';
import React, { useState, useEffect } from "react";
import SuccessAlert from '../../../components/ui/alerts/SuccessAlert';
import axios from 'axios';

const SetContactUs: React.FC = () => {
    const [companyAddress, setCompanyAddress] = useState<string>('');
    const [companyEmail, setCompanyEmail] = useState<string>('');
    const [companyWebsite, setCompanyWebsite] = useState<string>('');
    const [companyMobile, setCompanyMobile] = useState<string>('');
    const [currentAddress, setCurrentAddress] = useState<string>('');
    const [currentEmail, setCurrentEmail] = useState<string>('');
    const [currentWebsite, setCurrentWebsite] = useState<string>('');
    const [currentMobile, setCurrentMobile] = useState<string>('');
    const [showSuccessAlert, setShowSuccessAlert] = useState(false);

    useEffect(() => {
        document.title = 'Company Address';

        if (showSuccessAlert) {
            const timer = setTimeout(() => {
                setShowSuccessAlert(false);
                window.location.reload(); // Reload the page after hiding the alert
            }, 3000);
            return () => clearTimeout(timer);
        }

        // Fetch API function
        const fetchAPI = async () => {
            try {
                const response = await axios.get(`/api/method/reward_management.api.company_address.get_company_address`);

                if (response.data.message) {
                    const data = response.data.message; 
                    console.log("company data", response.data.message);

                    // Set the fetched data to the state variables
                    setCurrentAddress(data.address);
                    setCurrentEmail(data.email || '');
                    setCurrentWebsite(data.website || '');
                    // setCurrentMobile(data.mobile_numbers || []); 
                    setCurrentMobile(data.mobile_numbers[0] || '');  

                }
            } catch (error) {
                console.error('Error fetching company address:', error);
            }
        };

        fetchAPI();
    }, [showSuccessAlert]);

    // Set form fields to current data after fetching it
    useEffect(() => {
       
        if (currentAddress && currentEmail && currentWebsite && currentMobile) {
            setCompanyAddress(currentAddress);
            setCompanyEmail(currentEmail);
            setCompanyWebsite(currentWebsite);
            setCompanyMobile(currentMobile);
        }
    }, [currentAddress, currentEmail, currentWebsite, currentMobile]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!companyAddress || !companyEmail || !companyWebsite || !companyMobile) {
            alert('All fields are required!');
            return;
        }
        if (!companyMobile || companyMobile.length !== 10) {
            alert('Please enter a valid 10-digit mobile number!');
            return;
        }

        const data = {
            address: companyAddress,
            email: companyEmail,
            website: companyWebsite,
            mobile_number: companyMobile
        };

        try {
            const response = await axios.post('/api/resource/Company Address', data, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (response.status !== 200) {
                throw new Error('Failed to update company address');
            }

            console.log('Updated Company Mobile:', companyMobile);


            setShowSuccessAlert(true);
        } catch (error) {
            console.error('Error submitting company address:', error);
            alert('Failed to update company address.');
        }

        console.log({
            companyAddress,
            companyEmail,
            companyWebsite,
            companyMobile,
        });
    };

    return (
        <>
            <Pageheader
                currentpage={"Set Company Address"}
                activepage={"/company-address"}
                activepagename="Set Company Address"
            />
            <div className="grid grid-cols-12 gap-x-6 p-6">
                <div className="col-span-12 flex justify-center items-center">
                    <div className="xl:col-span-3 col-span-12 bg-white mt-5 rounded-lg shadow-lg p-6">
                        <div>
                            <div className="box-header">
                                <div className="box-title text-center text-[var(--primaries)] text-sm font-semibold">
                                    Set Company Address
                                </div>
                            </div>
                            <div className="box-body w-[400px] max-w-[400px]">
                                <form onSubmit={handleSubmit}>
                                    <div className="grid grid-cols-12 gap-4">
                                        <div className="xl:col-span-12 col-span-12">
                                            <label
                                                htmlFor="companyAddress"
                                                className="block text-defaulttextcolor text-xs font-medium mb-1"
                                            >
                                                Company Address
                                            </label>
                                            <input
                                                type="text"
                                                id="companyAddress"
                                                className="form-control w-full !rounded-md !bg-light text-defaulttextcolor text-xs font-medium"
                                                placeholder="Enter company address"
                                                value={companyAddress}
                                                onChange={(e) => setCompanyAddress(e.target.value)}
                                            />
                                        </div>
                                        <div className="xl:col-span-12 col-span-12">
                                            <label
                                                htmlFor="companyEmail"
                                                className="block text-defaulttextcolor text-xs font-medium mb-1"
                                            >
                                                Company Email
                                            </label>
                                            <input
                                                type="email"
                                                id="companyEmail"
                                                className="form-control w-full !rounded-md !bg-light text-defaulttextcolor text-xs font-medium"
                                                placeholder="Enter company email"
                                                value={companyEmail}
                                                onChange={(e) => setCompanyEmail(e.target.value)}
                                            />
                                        </div>
                                        <div className="xl:col-span-12 col-span-12">
                                            <label
                                                htmlFor="companyWebsite"
                                                className="block text-defaulttextcolor text-xs font-medium mb-1"
                                            >
                                                Company Website
                                            </label>
                                            <input
                                                type="text"
                                                id="companyWebsite"
                                                className="form-control w-full !rounded-md !bg-light text-defaulttextcolor text-xs font-medium"
                                                placeholder="Enter company website"
                                                value={companyWebsite}
                                                onChange={(e) => setCompanyWebsite(e.target.value)}
                                            />
                                        </div>
                                        <div className="xl:col-span-12 col-span-12">
                                            <label
                                                htmlFor="companyMobile"
                                                className="block text-defaulttextcolor text-xs font-medium mb-1"
                                            >
                                                Company Mobile
                                            </label>
                                            <input
                                                type="tel"
                                                id="companyMobile"
                                                className="form-control w-full !rounded-md !bg-light text-defaulttextcolor text-xs font-medium"
                                                placeholder="Enter company mobile"
                                                value={companyMobile}
                                                onChange={(e) => setCompanyMobile(e.target.value)}
                                            />
                                        </div>
                                        <div className="xl:col-span-12 col-span-12 text-center">
                                            <button
                                                type="submit"
                                                className="ti-btn ti-btn-primary-full w-full bg-primary"
                                            >
                                                Submit
                                            </button>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {showSuccessAlert && (
                <SuccessAlert
                    showButton={false}
                    showCancleButton={false}
                    showCollectButton={false}
                    showAnotherButton={false}
                    showMessagesecond={false}
                    message="Company Address Set successfully!"
                />
            )}
        </>
    );
};

export default SetContactUs;
