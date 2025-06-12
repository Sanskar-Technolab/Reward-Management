import React, { useState, Fragment, useEffect } from 'react';

import { Box, Button, Callout, Card, Text } from '@radix-ui/themes';

import { useNavigate } from 'react-router-dom';


import axios from 'axios';
import { useFrappeAuth } from "frappe-react-sdk";

import '../../assets/css/style.css';
import SuccessAlert from '../../components/ui/alerts/SuccessAlert';
import { Notyf } from 'notyf';
import 'notyf/notyf.min.css';


const Login = () => {

    const {

        login,

    } = useFrappeAuth();


    const [username, setUsername] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [loginError, setLoginError] = useState<string>('');
    const [currentForm, setCurrentForm] = useState<'login' | 'register' | 'carpenterLogin'>('login');
    const [passwordShow, setPasswordShow] = useState<boolean>(false);
    const [isOtpVisible, setIsOtpVisible] = useState(false);
    const [isloginOtpVisible, setIsloginOtpVisible] = useState(false);
    const [showSuccessAlert, setShowSuccessAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const [alertTitle, setAlertTitle] = useState('');
    const [isTimerActive, setIsTimerActive] = React.useState(false);
    const [timer, setTimer] = React.useState(60);

    const [logo, setLogo] = useState(null);
    const [loading, setLoading] = useState(true);

    const [data, setData] = useState({
        email: "",
        password: "",
        firstName: "",
        lastName: "",
        city: "",
        mobile: "",
        otp: "",
        mobilenumber: "",
        mobileotp: "",
    });

    // Initialize Notyf for notifications
    const notyf = new Notyf({
        duration: 5000,
        position: { x: 'right', y: 'top' },
    });



    let { email, password: registerPassword, firstName, lastName, city, mobile, otp, mobilenumber, mobileotp } = data;

    const navigate = useNavigate();

    const changeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
        setData({ ...data, [e.target.name]: e.target.value });

        setLoginError("");
    };


    // Check if user is already logged in
    const checkLoggedInUser = async () => {
        try {
            const response = await axios.get('/api/method/frappe.auth.get_logged_user');
            if (response.data.message && response.data.message !== 'Guest') {
                const userRoles = JSON.parse(localStorage.getItem('user_roles') || []);
                
                // Redirect based on role
                if (userRoles.includes('Admin') || userRoles.includes('Administrator')) {
                    navigate('/admin-dashboard');
                } else {
                    // Assuming carpenter role is stored or can be fetched
                    navigate('/carpenter-dashboard');
                }
            }
        } catch (error) {
            console.error('Error checking logged-in user:', error);
        }
    };

    // show logged use roles---------------------
    const fetchUserRoles = async (username: string) => {
        try {
            const response = await axios.get(`/api/method/frappe.core.doctype.user.user.get_roles`, {
                params: {
                    uid: username
                },

            });
            return response.data;
        } catch (error) {
            console.error('Error fetching roles:', error);
            throw error;
        }
    };


    // Handle Admin Login Form--------

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            // Perform login
            await axios.post(`/api/method/login`, {
                usr: username,
                pwd: password
            });
           
            // Fetch roles
            const rolesResponse = await fetchUserRoles(username);
            // console.log("rolesResponse----", rolesResponse);

            // Extract roles from the response
            const roles = rolesResponse.message || []; // Assuming `message` contains the array of roles
            localStorage.setItem('user_roles', JSON.stringify(roles));

            // Save user credentials (optional, if available)
            const credentials = {
                user_name: username,
                email: username,  // Frappe uses email as username by default
                // Add more fields if needed (e.g., full_name, first_name)
            };
            localStorage.setItem("credentials", JSON.stringify(credentials));

            // console.log('User roles:', roles);

            login({ username: username, password: password });

            // Check if roles is an array
            if (!Array.isArray(roles)) {
                throw new Error('Roles data is not in the expected format.');
            }


            // Redirect based on role
            if (roles.includes('Admin')) {
                navigate('/admin-dashboard');
            } else if (roles.includes('Administrator')) {
                navigate('/admin-dashboard');
            }



        } catch (err) {
            console.error('Login error:', err);
            notyf.error('Invalid Username or Password.');
            // setLoginError('Invalid Username or Password.');
        }
    };


    // Send Carpenter Registration Request---------------------
    const registerCarpainter = async (firstName: any, lastName: any, mobile: any, city: any) => {
        try {
            const response = await axios.post(`/api/method/reward_management.api.create_new_carpenter.create_new_carpainters`, {
                firstname: firstName,
                lastname: lastName,
                mobile: mobile,
                city: city,
            }, {
                headers: { 'Content-Type': 'application/json' }
            });

            // if(response){
            //     console.log("registration response",response)
            // }

            return response.data;
        } catch (error) {
            console.error('Error during carpainter registration:', error);
            throw new Error('Failed to register. Please try again.');
        }
    };

    //    Handle Carpenter Registration Form---------------------
    const handleRegister = async (e: any) => {
        e.preventDefault();
        if (mobile.length !== 10 || !/^\d+$/.test(mobile)) {
            setLoginError(
                "Mobile number must be exactly 10 digits and only contain digits"
            );
            return;
        }

        try {
            // Verify OTP
            const otpResponse = await axios.get(
                `/api/method/reward_management.api.mobile_number.verify_otp`,
                {
                    params: { mobile_number: mobile, otp: otp },
                }
            );

            if (otpResponse.data.message.status === "success") {
                // console.log("OTP matched:", otpResponse);
                setAlertTitle("Success");
                setAlertMessage("OTP Matched Successfully.");
                setShowSuccessAlert(true);

                // Call the function to register a new Carpainter
                const registerResponse = await registerCarpainter(
                    firstName,
                    lastName,
                    mobile,
                    city
                );

                // console.log("registerResponse", registerResponse);

                if (registerResponse.message.status === "success") {
                    // console.log("Carpainter registered successfully:", registerResponse);
                    setAlertTitle("Success");
                    setAlertMessage(
                        "Customer Registration Sent to the Admin Successfully."
                    );
                    setShowSuccessAlert(true);

                    // Clear all input fields
                    setData({
                        email: "",
                        password: "",
                        firstName: "",
                        lastName: "",
                        city: "",
                        mobile: "",
                        otp: "",
                        mobilenumber: "",
                        mobileotp: "",
                    });

                    // Optionally, reset OTP visibility state
                    setIsOtpVisible(false);
                } else {
                    setLoginError("Failed to register. Please try again.");
                }
            } else {
                alert("OTP Not Matched.");
                setLoginError("Failed to match OTP. Please try again.");
            }
        } catch (error) {
            console.error("Error during registration:", error);
            setLoginError("An error occurred during registration.");
        }
    };


    // Handle Carpernter Login Form------------
    const handleCarpenterLogin = (e: React.FormEvent) => {
        e.preventDefault();
        if (mobilenumber.length !== 10 || !/^\d+$/.test(mobilenumber)) {
            alert("Mobile number must be exactly 10 digits.");
            return;
        }
        // Handle carpenter login logic here
        // console.log("Carpenter login with:", mobilenumber, mobileotp);
    };

    // User Registration Handle or Generate Registration OTP Logic---------
    const handleGetOtp = async (e: React.FormEvent, isResendOtp = false) => {
        e.preventDefault();
        try {
            // First, check if the user is registered
            const checkResponse = await axios.get(
                `/api/method/reward_management.api.create_new_user.check_registered_user`,
                {
                    params: { mobile_number: mobile },
                }
            );

            // Log the response to inspect its structure
            // console.log("Check Response Data:", checkResponse)

            // If the mobile number is not registered, show OTP input field
            if (checkResponse.data.message.registered === false && checkResponse.data.message.approved === false && checkResponse.data.message.activate === false) {
                // Generate OTP for unregistered user
                const response = await axios.post(
                    `/api/method/reward_management.api.mobile_number.generate_or_update_otp`,
                    {
                        mobile_number: mobile,
                        template_name:"login",
                    },
                    {
                        headers: {
                            "Content-Type": "application/json",
                        },
                    }
                );

                if (response.data.message.status === "success") {
                    // console.log("OTP sent successfully:", response);
                    // const generatedregistrationOtp = response.data.message.otp;
                    // console.log("otp registration",generatedregistrationOtp);
                    // Show success alert
                    setAlertTitle("Success");
                    // setAlertMessage("OTP has been sent to your mobile number!");
                    setAlertMessage(isResendOtp ? "OTP has been resent to your mobile number!" : "OTP has been sent to your mobile number!");
                    setShowSuccessAlert(true);
                    setIsOtpVisible(true);

                    // Start the timer
                    startTimer();
                } else {
                    setLoginError("Failed to send OTP. Please try again.");
                }
            } else {
                // If user is already registered, show error message
                notyf.error(checkResponse.data.message.message);
                // setLoginError(checkResponse.data.message.message);
            }
        } catch (error) {
            console.error("Error generating OTP:", error);
            setLoginError("An error occurred while generating OTP.");
        }
    };



    // Start time for otp ------
    const startTimer = () => {
        setIsTimerActive(true);
        setTimer(60);
        const countdown = setInterval(() => {
            setTimer((prevTimer) => {
                if (prevTimer <= 1) {
                    clearInterval(countdown);
                    setIsTimerActive(false);
                    setIsloginOtpVisible(false);
                    setIsOtpVisible(false);


                    return 0;
                }
                return prevTimer - 1;
            });
        }, 1000);
    };
    // Carpenter login handling-----------
    const handleloginGetOtp = async (e: React.FormEvent, isResendOtp = false) => {
        e.preventDefault();

        if (mobilenumber.length !== 10 || !/^\d+$/.test(mobilenumber)) {
            alert("Mobile number must be exactly 10 digits.");
            return;
        }

        try {
            // Check if the user is registered
            const checkResponse = await axios.get(`/api/method/reward_management.api.create_new_user.check_user_registration`, {
                params: { mobile_number: mobilenumber },
            });
            // console.log("login response data",checkResponse)
           console.log("login response data", checkResponse);
           

            // localStorage.setItem('carpenterrole', checkResponse.data.message.role_profile_name);

            if (checkResponse.data.message && checkResponse.data.message.registered && checkResponse.data.message.approved && checkResponse.data.message.activate) {
                // Call the OTP generation API
                const otpResponse = await axios.post(`/api/method/reward_management.api.mobile_number.generate_or_update_otp`, {
                    mobile_number: mobilenumber,
                    template_name:"login",
                }, {
                    headers: { 'Content-Type': 'application/json' }
                });

                if (otpResponse.data.message.status === "success") {
                    // const generatedOtp = otpResponse.data.message.otp;
                    // console.log("login otp",generatedOtp);
                    setAlertTitle('Success');
                    setAlertMessage(isResendOtp ? "OTP has been resent to your mobile number!" : "OTP has been sent to your mobile number!");
                    setShowSuccessAlert(true);
                    setIsloginOtpVisible(true);
                    // Start the timer
                    startTimer();

                } else {
                    setLoginError('Failed to send OTP. Please try again.');
                }
            } else {
                notyf.error(checkResponse.data.message.message);
                // setLoginError(checkResponse.data.message.message);
            }
        } catch (error) {
            console.error('Error handling login OTP:', error);
            setLoginError('An error occurred while processing your request.');
        }
    };

    const handlelogincarpenter: any = async (e: React.FocusEvent) => {
        e.preventDefault();

        // Assuming you have an OTP input field in your form
        const otp = mobileotp;

        if (!otp) {
            setLoginError("Please enter the OTP.");
            return;
        }

        try {
            // Verify the OTP
            const response = await axios.get(
                `/api/method/reward_management.api.mobile_number.verify_otp`,
                {
                    params: { mobile_number: mobilenumber, otp: mobileotp },
                }
            );

            // console.log("OTP Verification Response Data:", response.data);

            // Check if the OTP verification was successful
            if (response.data.message.status === "success") {
                // Save login status in localStorage
                
                localStorage.setItem("login", "true");

                const getRolesResponse = await axios.get('/api/method/reward_management.api.get_roles.get_user_roles_for_mobile', {
                        params: {
                            mobile_number:mobilenumber
                        }
                    });
                    console.log("getRolesResponse----", getRolesResponse);

                    const roles = getRolesResponse.data.message.data || []; // Assuming 'message' contains the array of roles
                    localStorage.setItem('user_roles', JSON.stringify(roles));
                    console.log('User roles:', roles);

                

                // Save user data in localStorage
                const credentials = {
                    mobile_number: mobilenumber,
                    user_name: response.data.message.user_name,
                    email: response.data.message.email,
                    // Add more user data as needed
                };
                localStorage.setItem("credentials", JSON.stringify(credentials));
                // console.log(
                //     "testing----",
                //     localStorage.setItem("credentials", JSON.stringify(credentials))
                // );

                // console.log("Login Status:", localStorage.getItem("login"));

                navigate("/carpenter-dashboard");
            } else {
                setLoginError("Invalid OTP. Please try again.");
            }
        } catch (error) {
            console.error("Error verifying OTP:", error);
            setLoginError("An error occurred while verifying the OTP.");
        }
    };


    useEffect(() => {
           checkLoggedInUser();

        const fetchWebsiteSettings = async () => {
            try {
                const response = await axios.get('/api/method/reward_management.api.website_settings.get_website_settings');
                // console.log('API Image Response:', response.data);

                // Check if the response is successful and contains the expected structure
                if (response && response.data && response.data.message && response.data.message.status === 'success') {
                    const { banner_image } = response.data.message.data;

                    // If banner_image exists, set it as the logo
                    if (banner_image) {
                        const fullBannerImageURL = `${window.origin}${banner_image}`;
                        setLogo(fullBannerImageURL);
                        // console.log('Banner Image Set:', fullBannerImageURL);
                    } else {
                        // console.log('No banner_image found, using default logo.');
                        setLogo("/assets/frappe/images/frappe-framework-logo.svg");
                    }
                } else {
                    // console.error('API response was not successful:', response.data.message);
                    setLogo("/assets/frappe/images/frappe-framework-logo.svg");
                }
            } catch (error) {
                console.error('Error fetching website settings:', error);
                setLogo("/assets/frappe/images/frappe-framework-logo.svg");
            } finally {
                setLoading(false);
            }
        };

        fetchWebsiteSettings();

        // Optional: Handle success alert display logic
        if (showSuccessAlert) {
            const timer = setTimeout(() => {
                setShowSuccessAlert(false);
            }, 3000); 
            return () => clearTimeout(timer); 
        }
    }, [showSuccessAlert]);
    if (loading) {
        return <div></div>;
    }

    return (
        <Fragment>
            <div className=" h-[100vh] bg-[var(--body-bg)] flex items-center justify-center text-defaultsize text-defaulttextcolor ">
                <div className="grid grid-cols-12 gap-4 b ">
                    <div className="xxl:col-span-4 xl:col-span-4 lg:col-span-4 md:col-span-3 sm:col-span-2"></div>
                    <div className="xxl:col-span-4 xl:col-span-4 lg:col-span-4 md:col-span-6 sm:col-span-8 col-span-12 ">
                        <div className="p-8 box-shadow-md border border-defaultborder shadow-md rounded-[10px] bg-white ">

                            <div className="flex justify-center mb-8 ">
                                {/* <img src={desktoplogo} alt="logo" className="w-28" /> */}
                                <img src={logo} alt="logo" className="w-20" />
                            </div>

                            <div className="text-center mb-5">
                                <p className="text-lg font-semibold ">
                                    {currentForm === "login" && "Login"}
                                    {currentForm === "register" && "Registration"}
                                    {currentForm === "carpenterLogin" && "Customer Login"}
                                </p>
                                <p className='text-[#8c9097] text-center font-normal'>
                                    {currentForm === "login" && "Please Login to Your Account"}
                                    {currentForm === "register" && "Please enter details to register"}
                                    {currentForm === "carpenterLogin" && "Please login as a Customer"}
                                </p>
                            </div>

                            <div className="flex justify-evenly border-b mb-6 gap-4 font-semibold text-sm">
                                <Button onClick={() => setCurrentForm('login')} className={`flex-1 bg-white text-defaulttextcolor  ${currentForm === 'login' ? 'border-b-2 border-primary text-primary underline' : ''}`}>
                                    Admin
                                </Button>
                                <Button onClick={() => setCurrentForm('carpenterLogin')} className={`flex-1 bg-white text-defaulttextcolor ${currentForm === 'carpenterLogin' ? 'border-b-2 border-primary text-primary underline' :currentForm === 'register' ? 'border-b-2 border-primary text-primary underline': ''}`}>
                                    Customer
                                </Button>
                            </div>

                            {loginError && (
                                <Callout.Root color='red'>
                                    <Callout.Text>
                                        {loginError}
                                    </Callout.Text>
                                </Callout.Root>
                            )}

                            <div className="mt-6">
                                {currentForm === 'login' && (
                                    <form onSubmit={handleLogin} className='max-w-[350px] w-[350px]'>
                                        <Box className="mb-4">
                                            <Text as='label' htmlFor='username' className='text-defaultsize font-semibold '>Username/Email</Text>
                                            <input
                                                id='username'
                                                type='text'
                                                placeholder='Username'
                                                onChange={(e) => setUsername(e.target.value)}
                                                value={username}
                                                className="border rounded-[5px] p-2 mt-2 text-xs w-full outline-none focus:outline-none focus:ring-0 no-outline focus:border-[#dadada] "
                                            />
                                        </Box>
                                        <Box className="mb-4 ">
                                            <Text as='label' htmlFor='password' className='text-defaultsize font-semibold '>Password</Text>
                                            <div className="relative">
                                                <input
                                                    id='password'
                                                    type={passwordShow ? 'text' : 'password'}
                                                    placeholder='******'
                                                    onChange={(e) => setPassword(e.target.value)}
                                                    value={password}
                                                    className="border p-2 pt-2 mt-2 rounded-[5px] w-full outline-none focus:outline-none focus:ring-0 no-outline focus:border-[#dadada] "
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => setPasswordShow(!passwordShow)}
                                                    className="absolute inset-y-0 pt-2  right-0 pr-3 flex items-center text-xs text-gray-500 "
                                                >
                                                    {passwordShow ? 'Hide' : 'Show'}
                                                </button>
                                            </div>
                                        </Box>
                                        <Button type="submit" className="w-full mb-2 ti-btn ti-btn-primary !bg-primary !text-white !font-medium ">
                                            Login
                                        </Button>
                                    </form>
                                )}

                                {currentForm === "register" && (
                                    <form onSubmit={handleRegister}>
                                        <Box className="mb-4 max-w-[350px] w-[350px]">
                                            <Box className="xl:col-span-12 col-span-12 mb-3">
                                                <Text as='label' htmlFor="firstName" className="form-label text-defaultsize font-semibold">First Name</Text>
                                                <input
                                                    type="text"
                                                    name="firstName"
                                                    className="outline-none focus:outline-none focus:ring-0 no-outline focus:border-[#dadada] form-control form-control-lg border rounded-[5px] p-2 mt-2 text-xs w-full"
                                                    onChange={changeHandler}
                                                    value={firstName}
                                                    placeholder="First Name"
                                                    required
                                                />
                                            </Box>

                                            <Box className="xl:col-span-12 col-span-12 mb-3">
                                                <Text as='label' htmlFor="lastName" className="form-label text-defaultsize font-semibold">Last Name</Text>
                                                <input
                                                    type="text"
                                                    name="lastName"
                                                    className="outline-none focus:outline-none focus:ring-0 no-outline focus:border-[#dadada] form-control form-control-lg border rounded-[5px] p-2 mt-2 text-xs w-full"
                                                    onChange={changeHandler}
                                                    value={lastName}
                                                    placeholder="Last Name"
                                                    required
                                                />
                                            </Box>

                                            <Box className="xl:col-span-12 col-span-12 mb-3">
                                                <Text as='label' htmlFor="city" className="form-label text-defaultsize font-semibold">City</Text>
                                                <input
                                                    type="text"
                                                    name="city"
                                                    className="outline-none focus:outline-none focus:ring-0 no-outline focus:border-[#dadada] form-control form-control-lg border rounded-[5px] p-2 mt-2 text-xs w-full"
                                                    onChange={changeHandler}
                                                    value={city}
                                                    placeholder="City"
                                                    required
                                                />
                                            </Box>

                                            <Box className="xl:col-span-12 col-span-12 mb-3">
                                                <Text as='label' htmlFor="mobile" className="form-label text-defaultsize font-semibold">Mobile Number</Text>
                                                <input
                                                    type="tel"
                                                    name="mobile"
                                                    className={`outline-none focus:outline-none focus:ring-0 no-outline focus:border-[#dadada] form-control form-control-lg border rounded-[5px] p-2 mt-2 text-xs w-full ${mobile.length !== 10 || !/^\d+$/.test(mobile) ? 'border-red-500' : ''}`}
                                                    onChange={changeHandler}
                                                    value={mobile}
                                                    placeholder="Mobile Number"
                                                    required
                                                />
                                                {mobile.length !== 10 && mobile.length > 0 && (
                                                    <Text className="text-danger">Mobile number must be exactly 10 digits</Text>
                                                )}

                                            </Box>


                                            {isOtpVisible ? (
                                                <>
                                                    <Box className="xl:col-span-12 col-span-12 mb-3 ">
                                                        <Text
                                                            as="label"
                                                            htmlFor="otp"
                                                            className="form-label text-defaultsize font-semibold"
                                                        >
                                                            OTP
                                                        </Text>
                                                        <input
                                                            type="number"
                                                            name="otp"
                                                            className="outline-none focus:outline-none focus:ring-0 no-outline focus:border-[#dadada] form-control form-control-lg border rounded-[5px] p-2 mt-2 text-xs w-full"
                                                            onChange={changeHandler}
                                                            value={otp}
                                                            placeholder="OTP"
                                                            required
                                                        />
                                                    </Box>
                                                    <Box className="xl:col-span-12 col-span-12 grid mt-2">
                                                        <Button
                                                            className="ti-btn ti-btn-primary !bg-primary !text-white !font-medium"
                                                            type="submit"
                                                            id="register"
                                                            onClick={handleRegister}
                                                        >
                                                            Register
                                                        </Button>

                                                    </Box>
                                                    {isTimerActive && (
                                                        <Text className="text-center text-default">
                                                            You can resend OTP in {timer} seconds
                                                        </Text>
                                                    )}
                                                </>
                                            ) : (
                                                <Box className="xl:col-span-12 col-span-12 grid mt-2">
                                                    <Button
                                                        className="ti-btn ti-btn-primary !bg-primary !text-white !font-medium"
                                                        type="button"
                                                        onClick={handleGetOtp}
                                                        id="getotp"
                                                    >
                                                        Get OTP
                                                    </Button>
                                                </Box>
                                            )}
                                        </Box>

                                        <Box className="mt-4 text-center">
                                            <Text className="text-default">Already have an account? <a href="#" className="text-primary" onClick={() => setCurrentForm("carpenterLogin")}>Login</a></Text>
                                        </Box>

                                        <Box className="text-center my-4 authentication-barrier">
                                            <Text>OR</Text>
                                        </Box>

                                        <Box className="mt-4 text-center">
                                            <Text className="text-default">View as a <a href="/customer-product" className="text-primary">Customer?</a></Text>
                                        </Box>
                                    </form>
                                )}

                                {currentForm === 'carpenterLogin' && (
                                    <form onSubmit={handleCarpenterLogin} className='max-w-[350px] w-[350px]'>
                                        <Box className="mb-4 ">
                                            <Text as='label' htmlFor='mobilenumber' className='text-defaultsize font-semibold'>Mobile Number</Text>
                                            <input
                                                id='mobilenumber'
                                                type='text'
                                                placeholder='Mobile Number'
                                                name='mobilenumber'
                                                onChange={changeHandler}
                                                value={mobilenumber}
                                                className={`outline-none focus:outline-none focus:ring-0 no-outline focus:border-[#dadada] border rounded-[5px] p-2 mt-2 text-xs w-full  ${mobilenumber.length !== 10 || !/^\d+$/.test(mobile) ? 'border-red-500' : ''}`}
                                                required
                                            />
                                            {mobilenumber.length !== 10 && mobilenumber.length > 0 && (
                                                <Text className="text-danger">Mobile number must be exactly 10 digits</Text>
                                            )}
                                        </Box>
                                        {isloginOtpVisible ? (
                                            <>
                                                <Box className="mb-4">
                                                    <Text as="label" htmlFor="mobileotp" className="text-defaultsize font-semibold">
                                                        OTP
                                                    </Text>
                                                    <input
                                                        id="mobileotp"
                                                        type="text"
                                                        placeholder="Enter OTP"
                                                        name="mobileotp"
                                                        onChange={changeHandler}
                                                        value={mobileotp}
                                                        className="outline-none focus:outline-none focus:ring-0 no-outline focus:border-[#dadada] border rounded-[5px] p-2 mt-2 text-xs w-full"
                                                    />
                                                </Box>
                                                <Button
                                                    type="submit"
                                                    onClick={handlelogincarpenter}
                                                    id="logincarpenter"
                                                    className="w-full mb-2 ti-btn ti-btn-primary !bg-primary !text-white !font-medium"
                                                >
                                                    Login
                                                </Button>
                                                {isTimerActive && (
                                                    <Text className="text-center text-default">
                                                        You can resend OTP in {timer} seconds
                                                    </Text>
                                                )}
                                            </>
                                        ) : (
                                            <Button type="button" onClick={handleloginGetOtp} id='getloginotp' className="w-full mb-2 ti-btn ti-btn-primary !bg-primary !text-white !font-medium ">
                                                Get OTP
                                            </Button>
                                        )}
                                        <Box className="mt-4 text-center">
                                            <Text className="text-default">Don't have an account? <a href="#" className="text-primary" onClick={() => setCurrentForm("register")}>Register</a></Text>
                                        </Box>
                                        <Box className="text-center my-4 authentication-barrier">
                                            <Text>OR</Text>
                                        </Box>
                                        <Box className="mt-4 text-center">
                                            <Text className="text-default">View as a <a href="/customer-product" className="text-primary" onClick={() => setCurrentForm("carpenterLogin")}>Customer?</a></Text>
                                        </Box>
                                    </form>
                                )}

                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {showSuccessAlert && (
                <SuccessAlert
                    title={alertTitle}
                    showButton={false}

                    message={alertMessage}
                />
            )}
        </Fragment>
    );
};

export default Login;