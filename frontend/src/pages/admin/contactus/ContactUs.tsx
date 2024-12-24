import '../../../assets/css/style.css';
import '../../../assets/css/pages/admindashboard.css';
import Pageheader from '../../../components/common/pageheader/pageheader';
import React, { useState, useEffect } from "react";
import SuccessAlert from '../../../components/ui/alerts/SuccessAlert';
import axios from 'axios';
import { FaTrashAlt } from 'react-icons/fa'; // Import the delete icon

const SetContactUs: React.FC = () => {
    const [companyAddress, setCompanyAddress] = useState<string>('');
    const [companyEmail, setCompanyEmail] = useState<string>('');
    const [companyWebsite, setCompanyWebsite] = useState<string>('');
    const [companyMobile, setCompanyMobile] = useState<string[]>(['']); // Array to store multiple mobile numbers
    const [companyAboutUs, setCompanyAboutUs] = useState<string>('');
    const [currentAddress, setCurrentAddress] = useState<string>('');
    const [currentEmail, setCurrentEmail] = useState<string>('');
    const [currentWebsite, setCurrentWebsite] = useState<string>('');
    const [currentMobile, setCurrentMobile] = useState<string[]>([]); // Array for current mobile numbers
    const [currentAboutUs, setCurrentAboutUs] = useState<string>('');

    const [showSuccessAlert, setShowSuccessAlert] = useState(false);

    useEffect(() => {
        document.title = 'Company Address';

        if (showSuccessAlert) {
            const timer = setTimeout(() => {
                setShowSuccessAlert(false);
                // window.location.reload(); // Reload the page after hiding the alert
            }, 3000);
            return () => clearTimeout(timer);
        }

        // Fetch API function
        const fetchAPI = async () => {
            try {
                const response = await axios.get(`/api/method/reward_management.api.company_address.get_company_address`);

                if (response.data.message) {
                    const data = response.data.message; 
                    console.log("company data", data);

                    // Set the fetched data to the state variables
                    setCurrentAddress(data.address);
                    setCurrentEmail(data.email || '');
                    setCurrentWebsite(data.website || '');
                    setCurrentMobile(data.mobile_numbers || ['']);  
                    setCurrentAboutUs(data.about_company || '');
                }
            } catch (error) {
                console.error('Error fetching company address:', error);
            }
        };

        fetchAPI();
    }, [showSuccessAlert]);

    // Set form fields to current data after fetching it
    useEffect(() => {
        if (currentAddress && currentEmail && currentWebsite && currentMobile.length && currentAboutUs) {
            setCompanyAddress(currentAddress);
            setCompanyEmail(currentEmail);
            setCompanyWebsite(currentWebsite);
            setCompanyMobile(currentMobile);
            setCompanyAboutUs(currentAboutUs);
        }
    }, [currentAddress, currentEmail, currentWebsite, currentMobile, currentAboutUs]);

    // const handleSubmit = async (e: React.FormEvent) => {
    //     e.preventDefault();

    //     if (!companyAddress || !companyEmail || !companyWebsite || !companyMobile.length || !companyAboutUs) {
    //         alert('All fields are required!');
    //         return;
    //     }

    //     // Ensure all mobile numbers are valid (10 digits)
    //     for (const mobile of companyMobile) {
    //         if (mobile.length !== 10) {
    //             alert('Please enter valid 10-digit mobile numbers!');
    //             return;
    //         }
    //     }

    //     const data = {
    //         address: companyAddress,
    //         email: companyEmail,
    //         website: companyWebsite,
    //         mobile_numbers: companyMobile,
    //         about_company: companyAboutUs
    //     };

    //     try {
    //         const response = await axios.post('/api/resource/Company Address', data, {
    //             headers: {
    //                 'Content-Type': 'application/json',
    //             },
    //         });

    //         if (response.status !== 200) {
    //             throw new Error('Failed to update company address');
    //         }

    //         console.log('Updated Company Mobile:', companyMobile);

    //         setShowSuccessAlert(true);
    //     } catch (error) {
    //         console.error('Error submitting company address:', error);
    //         alert('Failed to update company address.');
    //     }

    //     console.log({
    //         companyAddress,
    //         companyEmail,
    //         companyWebsite,
    //         companyMobile,
    //         companyAboutUs,
    //     });
    // };

    const addMobileNumber = () => {
        setCompanyMobile([...companyMobile, '']);
    };


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
    
        if (!companyAddress || !companyEmail || !companyWebsite || !companyMobile.length || !companyAboutUs) {
            alert('All fields are required!');
            return;
        }
    
        // Ensure all mobile numbers are valid (10 digits)
        for (const mobile of companyMobile) {
            if (mobile.length !== 10) {
                alert('Please enter valid 10-digit mobile numbers!');
                return;
            }
        }
    
        const data = {
            address: companyAddress,
            email: companyEmail,
            website: companyWebsite,
            mobile_numbers: companyMobile, // Mobile numbers as an array
            about_company: companyAboutUs
        };
    
        try {
            const response = await axios.post('/api/method/reward_management.api.company_address.add_or_update_company_address', data, {
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
    };
    
    

    const handleMobileChange = (index: number, value: string) => {
        const updatedMobileNumbers = [...companyMobile];
        updatedMobileNumbers[index] = value;
        setCompanyMobile(updatedMobileNumbers);
    };

    const deleteMobileNumber = (index: number) => {
        const updatedMobileNumbers = companyMobile.filter((_, i) => i !== index);
        setCompanyMobile(updatedMobileNumbers);
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
                        <div className=''>
                            <div className="box-header ">
                                <div className="box-title text-center text-1rem font-semibold text-primary">
                                    Set Company Address
                                </div>
                            </div>
                            <div className="box-body w-[400px] max-w-[400px]">
                                <form onSubmit={handleSubmit}>
                                    <div className="grid grid-cols-12 gap-4">
                                        <div className="xl:col-span-12 col-span-12">
                                            <label
                                                htmlFor="companyAddress"
                                                className="block text-sm text-defaulttextcolor font-semibold mb-1"
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
                                                className="block text-sm text-defaulttextcolor font-semibold mb-1"
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
                                                className="block text-sm text-defaulttextcolor font-semibold mb-1"
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
                                        {companyMobile.map((mobile, index) => (
                                            <div className="xl:col-span-12 col-span-12" key={index}>
                                                <label
                                                    htmlFor={`companyMobile${index}`}
                                                    className="block text-sm text-defaulttextcolor font-semibold mb-1"
                                                >
                                                    Company Mobile {index + 1}
                                                </label>
                                                <div className="flex items-center">
                                                    <input
                                                        type="tel"
                                                        id={`companyMobile${index}`}
                                                        className="form-control w-full !rounded-md !bg-light text-defaulttextcolor text-xs font-medium"
                                                        placeholder="Enter company mobile"
                                                        value={mobile}
                                                        onChange={(e) => handleMobileChange(index, e.target.value)}
                                                    />
                                                    {companyMobile.length > 1 && (
                                                        <button
                                                            type="button"
                                                            className="ml-2 text-red-500"
                                                            onClick={() => deleteMobileNumber(index)}
                                                        >
                                                            <FaTrashAlt />
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                        <div className="xl:col-span-12 col-span-12 text-center">
                                            <button
                                                type="button"
                                                className="ti-btn bg-primary/20 w-full"
                                                onClick={addMobileNumber}
                                            >
                                                Add Another Mobile Number
                                            </button>
                                         </div>

                                         <div className="xl:col-span-12 col-span-12">
                                            <label
                                                htmlFor="companyAboutUs"
                                                className="block text-sm text-defaulttextcolor font-semibold mb-1"
                                            >
                                                About Us
                                            </label>
                                            <textarea
                                                id="companyAboutUs"
                                                className="form-control w-full !rounded-md !bg-light text-defaulttextcolor text-xs font-medium"
                                                placeholder="Enter About Us"
                                                value={companyAboutUs}
                                                onChange={(e) => setCompanyAboutUs(e.target.value)}
                                            />
                                        </div>
                                         <div className='xl:col-span-12 col-span-12 text-center flex justify-between gap-5'>
                                            <button
                                                type="submit"
                                                className="ti-btn text-white w-full bg-primary"
                                            >
                                                Submit
                                            </button>
                                            <button
                                                type="submit"
                                                className="ti-btn text-defaulttextcolor w-full bg-primary/20"
                                            >
                                                Cancel
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
