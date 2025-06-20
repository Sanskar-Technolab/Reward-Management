import React, { useState, Fragment, useEffect } from "react";
import { Box, Button, Text } from "@radix-ui/themes";
import { Link } from "react-router-dom";
import axios from "axios";
import { Notyf } from 'notyf';
import applogo from "../../assets/images/reward_management/LOGO_DEKAA_FINAL 1.png";
import 'notyf/notyf.min.css';
import SuccessAlert from "../../components/ui/alerts/SuccessAlert";
import "../../assets/css/style.css";

const Forgotpassword = () => {
    const notyf = new Notyf({
        position: { x: 'right', y: 'top' },
        duration: 3000,
    });

    const [username, setUsername] = useState('');
    const [loading, setLoading] = useState(true);
    const [logo, setLogo] = useState(applogo); // Default logo
    const [showSuccessAlert, setShowSuccessAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const [alertTitle, setAlertTitle] = useState('');
    const [buttonState, setButtonState] = useState<'idle' | 'loading' | 'success'>('idle');

    // Fetch website settings to set the logo
    useEffect(() => {
        const fetchWebsiteSettings = async () => {
            try {
                const response = await axios.get('/api/method/reward_management.api.website_settings.get_website_settings');
                if (response.data?.message?.status === "success") {
                    const { banner_image } = response.data.message.data;
                    if (banner_image) {
                        setLogo(`${window.origin}${banner_image}`);
                    }
                }
            } catch (error) {
                console.log("Error fetching website settings:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchWebsiteSettings();

        // Optional: Handle success alert display logic
        if (showSuccessAlert) {
            const timer = setTimeout(() => {
                setShowSuccessAlert(false);
            }, 3000); // Hide alert after 3 seconds
            return () => clearTimeout(timer);
        }
    }, [showSuccessAlert]);

    if (loading) {
        return <div>Loading...</div>; // Display loading state
    }

    const handlePasswordReset = async (e: any) => {
        e.preventDefault();
    
        if (!username) {
            notyf.error('Email is required.');
            return;
        }
    
        try {
            setButtonState('loading');
            const response = await axios.post(
                `/api/method/reward_management.api.reset_password.reset_user_password`,
                {
                    user: username
                }
            );
    
            if (response.data.message.success === true) {
                setButtonState('success');
                setAlertTitle('Success');
                setAlertMessage('Password reset instructions have been sent to your email');
                setShowSuccessAlert(true);
            } else {
                setButtonState('idle');
                const errorMessage = response.data.message?.message || 'Failed to reset password';
                const errorTitle = response.data.message?.title || 'Error';
                notyf.error(`${errorTitle}: ${errorMessage}`);
            }
        } catch (error) {
            setButtonState('idle');
            notyf.error('An error occurred while resetting the password.');
            console.log("Password reset error:", error);
        }
    };

    const getButtonText = () => {
        switch (buttonState) {
            case 'loading':
                return 'Verifying...';
            case 'success':
                return 'Instructions Emailed';
            default:
                return 'Submit';
        }
    };

    return (
        <Fragment>
           <div className=" h-[100vh] bg-[var(--body-bg)] flex items-center justify-center text-defaultsize text-defaulttextcolor ">
                           <div className="grid grid-cols-12 gap-4 b ">
                               <div className="xxl:col-span-4 xl:col-span-4 lg:col-span-4 md:col-span-3 sm:col-span-2"></div>
                               <div className="xxl:col-span-4 xl:col-span-4 lg:col-span-4 md:col-span-6 sm:col-span-8 col-span-12 ">
                                   <div className="p-8 box-shadow-md border border-defaultborder shadow-md rounded-[10px] bg-white ">
           
                                       <div className="flex justify-center mb-5 ">
                                           {/* <img src={desktoplogo} alt="logo" className="w-28" /> */}
                                           <img src={logo} alt="logo" className="w-20" />
                                       </div>

                                       <div className="text-center mb-5 text-primary sm:max-w-[350px] sm:w-[350px] max-w-[250px] w-[250px]">
                                            <p className="text-lg font-semibold text-defaulttextcolor">Forget Password</p>
                                            <p className="text-[#8c9097] text-center font-normal"> Enter your email address and we'll send you an email with instructions to reset your password.</p>
                                        </div>
           
                                       <div className="mt-6">
                                          
                                               <form onSubmit={handlePasswordReset} className='sm:max-w-[350px] sm:w-[350px] max-w-[250px] w-[250px]'>
                                                   <Box className="mb-4">
                                                       <Text as='label' htmlFor='username' className='text-defaultsize font-semibold '>Email</Text>
                                                       <input
                                                           id='username'
                                                           type='text'
                                                           placeholder='Username'
                                                           onChange={(e) => setUsername(e.target.value)}
                                                           value={username}
                                                           className="border rounded-[5px] p-2 mt-2 text-xs w-full outline-none focus:outline-none focus:ring-0 no-outline focus:border-[#dadada] "
                                                       />
                                                   </Box>
                                                  
                                                  <Button 
                                                        type="submit" 
                                                        className={`ti-btn new-launch !bg-primary !text-white !font-medium border-none shadow-md w-full`}
                                                        disabled={buttonState === 'loading' || buttonState === 'success'}
                                                    >
                                                        {getButtonText()}
                                                    </Button>

                                                     <Box className="mt-4 text-center font-semibold">
                                        <Text className="text-default text-primary">
                                            Back to 
                                         <Link to="/" className="text-defaulttextcolor"> Login</Link>
                                        </Text>
                                    </Box>
                                               </form>
                                    
           
                                       </div>
                                   </div>
                               </div>
                           </div>
                       </div>
            {showSuccessAlert && (
                <SuccessAlert title={alertTitle} showButton={false} message={alertMessage} />
            )}
        </Fragment>
    );
};

export default Forgotpassword;