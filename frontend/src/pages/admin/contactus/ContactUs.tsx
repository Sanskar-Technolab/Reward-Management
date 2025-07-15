import '../../../assets/css/style.css';
import '../../../assets/css/pages/admindashboard.css';
import Pageheader from '../../../components/common/pageheader/pageheader';
import React, { useState, useEffect } from "react";
import SuccessAlert from '../../../components/ui/alerts/SuccessAlert';
import axios from 'axios';
import { FaTrashAlt } from 'react-icons/fa'; 
import { Notyf } from 'notyf';
import 'notyf/notyf.min.css';
import validator from 'validator';

const notyf = new Notyf({
    position: {
        x: 'right',
        y: 'top',
    },
    duration: 5000, 
});

const SetContactUs: React.FC = () => {
    const [companyAddress, setCompanyAddress] = useState<string>('');
    const [companyEmail, setCompanyEmail] = useState<string>('');
    const [emailError, setEmailError] = useState<string>('');
    const [companyWebsite, setCompanyWebsite] = useState<string>('');
    const [websiteError, setWebsiteError] = useState<string>('');
    const [companyMobile, setCompanyMobile] = useState<string[]>(['']);
    const [mobileErrors, setMobileErrors] = useState<string[]>(['']);
    const [companyAboutUs, setCompanyAboutUs] = useState<string>('');
    const [currentAddress, setCurrentAddress] = useState<string>('');
    const [currentEmail, setCurrentEmail] = useState<string>('');
    const [currentWebsite, setCurrentWebsite] = useState<string>('');
    const [currentMobile, setCurrentMobile] = useState<string[]>([]);
    const [currentAboutUs, setCurrentAboutUs] = useState<string>('');

    const [showSuccessAlert, setShowSuccessAlert] = useState(false);
    const maxAboutUsLength = 100; 

    useEffect(() => {
        document.title = 'Company Address';

        if (showSuccessAlert) {
            const timer = setTimeout(() => {
                setShowSuccessAlert(false);
            }, 3000);
            return () => clearTimeout(timer);
        }

        const fetchAPI = async () => {
            try {
                const response = await axios.get(`/api/method/reward_management.api.company_address.get_company_address`);

                if (response.data.message) {
                    const data = response.data.message;
                    // console.log("company data", data);

                    setCurrentAddress(data.address);
                    setCurrentEmail(data.email || '');
                    setCurrentWebsite(data.website || '');
                    setCurrentMobile(data.mobile_numbers || ['']);
                    setCurrentAboutUs(data.about_company || '');
                    
                    if (data.mobile_numbers && data.mobile_numbers.length > 0) {
                        setMobileErrors(new Array(data.mobile_numbers.length).fill(''));
                    }
                }
            } catch (error) {
                console.error('Error fetching company address:', error);
            }
        };

        fetchAPI();
    }, [showSuccessAlert]);

    useEffect(() => {
        if (currentAddress && currentEmail && currentWebsite && currentMobile.length && currentAboutUs) {
            setCompanyAddress(currentAddress);
            setCompanyEmail(currentEmail);
            setCompanyWebsite(currentWebsite);
            setCompanyMobile(currentMobile);
            setCompanyAboutUs(currentAboutUs);
        }
    }, [currentAddress, currentEmail, currentWebsite, currentMobile, currentAboutUs]);

    const addMobileNumber = () => {
        setCompanyMobile([...companyMobile, '']);
        setMobileErrors([...mobileErrors, '']);
    };

    const isValidAboutUs = (text: string) => {
        return validator.isAlphanumeric(text.replace(/\s/g, ''));
    };

    const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setCompanyEmail(value);
        
        if (value && !validator.isEmail(value)) {
            setEmailError('Please enter a valid email address');
        } else {
            setEmailError('');
        }
    };

    const handleWebsiteChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setCompanyWebsite(value);
        
        if (value && !validator.isURL(value, {
            require_protocol: false,
            allow_underscores: true,
            allow_trailing_dot: false,
            allow_protocol_relative_urls: false
        })) {
            setWebsiteError('Please enter a valid website URL (e.g., example.com or https://example.com)');
        } else {
            setWebsiteError('');
        }
    };

    const handleMobileChange = (index: number, value: string) => {
        // Allow only numbers and limit to 10 digits
        const numericValue = value.replace(/\D/g, '').slice(0, 10);
        
        const updatedMobileNumbers = [...companyMobile];
        updatedMobileNumbers[index] = numericValue;
        setCompanyMobile(updatedMobileNumbers);

        // Validate mobile number
        const updatedErrors = [...mobileErrors];
        if (numericValue && !validator.isMobilePhone(numericValue, 'en-IN')) {
            updatedErrors[index] = 'Please enter a valid 10-digit mobile number';
        } else {
            updatedErrors[index] = '';
        }
        setMobileErrors(updatedErrors);
    };

    const deleteMobileNumber = (index: number) => {
        const updatedMobileNumbers = companyMobile.filter((_, i) => i !== index);
        setCompanyMobile(updatedMobileNumbers);
        
        const updatedErrors = mobileErrors.filter((_, i) => i !== index);
        setMobileErrors(updatedErrors);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validate all fields before submission
        if (!companyAddress) {
            notyf.error('Company address is required!');
            return;
        }

        if (!companyEmail) {
            notyf.error('Company email is required!');
            return;
        }

        if (emailError) {
            notyf.error('Please fix email errors before submitting');
            return;
        }

        if (websiteError) {
            notyf.error('Please fix website errors before submitting');
            return;
        }

        if (companyMobile.length === 0 || companyMobile.some(m => !m)) {
            notyf.error('At least one mobile number is required!');
            return;
        }

        if (mobileErrors.some(err => err)) {
            notyf.error('Please fix mobile number errors before submitting');
            return;
        }

        if (!companyAboutUs) {
            notyf.error('About Us is required!');
            return;
        }

        if (!isValidAboutUs(companyAddress)) {
            notyf.error('Please enter a valid Company Address using only letters and numbers.');
            return;
        }

        const data = {
            address: companyAddress,
            email: companyEmail,
            website: companyWebsite,
            mobile_numbers: companyMobile.filter(m => m),
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

            setShowSuccessAlert(true);
        } catch (error) {
            console.error('Error submitting company address:', error);
            notyf.error('Failed to update company address.');
        }
    };

    return (
        <>
            <Pageheader
                currentpage={"Set Company Address"}
                // activepage={"/company-address"}
                // activepagename="Set Company Address"
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
                                                className="outline-none focus:outline-none focus:ring-0 no-outline focus:border-[#dadada] form-control w-full !rounded-md !bg-light text-defaulttextcolor text-xs font-medium "
                                                placeholder="Enter company address"
                                                value={companyAddress}
                                                onChange={(e) => setCompanyAddress(e.target.value)}
                                                required
                                                onInvalid={(e) => (e.target as HTMLInputElement).setCustomValidity("Company address is required.")}
                                                onInput={(e) => (e.target as HTMLInputElement).setCustomValidity("")}
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
                                                className={`outline-none focus:outline-none focus:ring-0 no-outline focus:border-[#dadada] form-control w-full !rounded-md !bg-light text-defaulttextcolor text-xs font-medium ${emailError ? 'border-red-500' : ''}`}
                                                placeholder="Enter company email"
                                                value={companyEmail}
                                                onChange={handleEmailChange}
                                                // required
                                                // onInvalid={(e) => (e.target as HTMLInputElement).setCustomValidity("Company email is required.")}
                                                // onInput={(e) => (e.target as HTMLInputElement).setCustomValidity("")}
                                            />
                                            {emailError && (
                                                <p className="text-red text-xs mt-1">{emailError}</p>
                                            )}
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
                                                className={`outline-none focus:outline-none focus:ring-0 no-outline focus:border-[#dadada] form-control w-full !rounded-md !bg-light text-defaulttextcolor text-xs font-medium ${websiteError ? 'border-red-500' : ''}`}
                                                placeholder="Enter company website (e.g., example.com)"
                                                value={companyWebsite}
                                                onChange={handleWebsiteChange}
                                                required
                                                onInvalid={(e) => (e.target as HTMLInputElement).setCustomValidity("Company website is required.")}
                                                // onInput={(e) => (e.target as HTMLInputElement).setCustomValidity("")}
                                            />
                                            {websiteError && (
                                                <p className="text-red text-xs mt-1">{websiteError}</p>
                                            )}
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
                                                        className={`outline-none focus:outline-none focus:ring-0 no-outline focus:border-[#dadada] form-control w-full !rounded-md !bg-light text-defaulttextcolor text-xs font-medium ${mobileErrors[index] ? 'border-red-500' : ''}`}
                                                        placeholder="Enter 10-digit mobile number"
                                                        value={mobile}
                                                        onChange={(e) => handleMobileChange(index, e.target.value)}
                                                        // required
                                                        // onInvalid={(e) => (e.target as HTMLInputElement).setCustomValidity("Company address is required.")}
                                                        // onInput={(e) => (e.target as HTMLInputElement).setCustomValidity("")}
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
                                                {mobileErrors[index] && (
                                                    <p className="text-red text-xs mt-1">{mobileErrors[index]}</p>
                                                )}
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
                                                className="outline-none focus:outline-none focus:ring-0 no-outline focus:border-[#dadada] form-control w-full !rounded-md !bg-light text-defaulttextcolor text-xs font-medium"
                                                placeholder="Enter About Us"
                                                value={companyAboutUs}
                                                onChange={(e) => setCompanyAboutUs(e.target.value)}
                                                maxLength={maxAboutUsLength}
                                            />
                                            <div className="text-right text-sm">
                                                {companyAboutUs.length}/{maxAboutUsLength} characters
                                            </div>
                                        </div>
                                        
                                        <div className='xl:col-span-12 col-span-12 text-center flex justify-between gap-5'>
                                            <button
                                                type="submit"
                                                className="ti-btn text-white w-full bg-primary"
                                                disabled={!!emailError || !!websiteError || mobileErrors.some(err => err)}
                                            >
                                                Submit
                                            </button>
                                            <button
                                                type="button"
                                                className="ti-btn text-defaulttextcolor w-full bg-primary/20"
                                                onClick={() => window.location.reload()}
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