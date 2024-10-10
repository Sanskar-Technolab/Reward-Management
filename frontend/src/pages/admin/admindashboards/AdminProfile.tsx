import { Fragment, useRef, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Pageheader from '../../../components/common/pageheader/pageheader';
// import {, API_KEY, API_SECRET } from "../../../utils/constants";
import face9 from '../../../assets/images/reward_management/9.jpg';
import SuccessAlert from '../../../components/ui/alerts/SuccessAlert';

const AdminProfile = () => {
    const [showSuccessAlert, setShowSuccessAlert] = useState(false);
    const [selectedImage, setSelectedImage] = useState(face9); // Set the default image URL here
    const [activeTab, setActiveTab] = useState('personal-info'); // State to manage active tab
    const fileInputRef = useRef(null);
    const [UserImage ,setUserImage] = useState('')
    const [changeImage, setchangeImage] = useState('');
    const [firstName, setFirstName] = useState(''); // State to store first name
    const [lastName, setLastName] = useState(''); // State to store first name
    const [username, setUsername] = useState(''); // State to store first name
    const [fullname, setFullname] = useState(''); // State to store first name
    const [email, setEmail] = useState(''); // State to store first name
    const [phone, setPhone] = useState(''); // State to store first name
    const [mobileno, setMobileno] = useState(''); // State to store first name
    const [gender, setGender] = useState(''); // State to store first name
    const [genders, setGenders] = useState([]);
    const [birthdate, setBirthdate] = useState(''); // State to store first name
    const [location, setLocation] = useState(''); // State to store first name

    const [isValid, setIsValid] = useState(true); // State to track validity
    const [showNewPassword, setShowNewPassword] = useState(false);  // State to track show and hide newpassword
    const [showConfirmPassword, setShowConfirmPassword] = useState(false); // State to track show and hide confirm password
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [passwordsMatch, setPasswordsMatch] = useState(true); 


    // Reset form fields to their initial values
    const resetForm = () => {
        window.location.reload();
    };



    
    const numberRegex = /^\d{10}$/;

    const handleMobileNumberChange = (e:any) => {
        const value = e.target.value;

        // Validate the input value against the regex
        const isValidNumber = numberRegex.test(value);
        setIsValid(isValidNumber);

        // Update the state with the input value
        setMobileno(value);

        // Log the input value for debugging
        console.log("Mobile Number:", value);
    };
    
   
    localStorage.setItem('username', username)

    useEffect(() => {
        document.title='Profile Setting';
        if (showSuccessAlert) {
            const timer = setTimeout(() => setShowSuccessAlert(false), 3000);
            return () => clearTimeout(timer);
        }
        console.log("birthdate--", birthdate);
        const fetchUserEmailAndInitScanner = async () => {
            try {
                const userResponse = await axios.get(`/api/method/frappe.auth.get_logged_user`,
                    {
                        method: "GET",
                       
                    } 
                );
                // console.log("userData----->", userResponse.data.message);
                //   const userData = userResponse.data;

                const userdata = await axios.get(`/api/resource/User/${userResponse.data.message}`,
                    {
                        method: "GET",
                     
                    }
                );
                // console.log("userData----->", userdata.data.data);
                //   document.getElementById('first-name').innerText = userdata.data.data.first_name || "";
                setFirstName(userdata.data.data.first_name || "");
                setLastName(userdata.data.data.last_name || "");
                setUsername(userdata.data.data.username || "");
                setFullname(userdata.data.data.full_name || "");

              
                setEmail(userdata.data.data.email || "");
                setPhone(userdata.data.data.phone || "");
                setMobileno(userdata.data.data.mobile_no || "");
                setGender(userdata.data.data.gender || "");
                setBirthdate(userdata.data.data.birth_date || "");
                setLocation(userdata.data.data.location || "");
                setUserImage(userdata.data.data.user_image || face9);




            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };



        // Fetch total pending redemptions count
        const fetchallgenders = async () => {
            try {
                const response = await axios.get(`/api/method/reward_management.api.admin_profile.get_all_gender`,
                    {
                        method: "GET",
                      
                    }
                );
                setGenders(response.data.message); // 

            } catch (error) {
                console.error("Error fetching redemptions count:", error);
            }
        };



        fetchUserEmailAndInitScanner();
        fetchallgenders();

    }, [showSuccessAlert]);

    const handleImageChange = (e:any) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedImage(URL.createObjectURL(file));
            setchangeImage(file);  // Store the actual file object here
        }
    };
        const update_user_details = async () => {
            try {
                const response = await axios.post(`/api/method/reward_management.api.admin_profile.update_user_details`,
                    {
                        name: email,
                        first_name: firstName,
                        last_name: lastName,
                        full_name: fullname,
                        username,
                        phone,
                        mobile_no: mobileno,
                        gender,
                        birth_date: birthdate,
                        location,
                    },
                    {
                        
                    }
                );

                if (response.data.message.status === "success") {
                    setShowSuccessAlert(true);
                    // localStorage.getItem('username')
                    setTimeout(() => {
                        window.location.reload(); // Reload the page after 3 seconds
                    }, 3000);
                    console.log("User details updated successfully.");
                    // Optionally, you can add more logic here, such as redirecting the user or showing a success message
                } else {
                    console.error("Error updating user details:", response.data.message);
                }
            } catch (error) {
                console.error("Error updating user details:", error);
            }
        };

    const openFileInput = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };



    const handleTabClick = (tabId) => {
        setActiveTab(tabId); // Set the active tab when clicked
    };




    const uploadFile = async (file) => {
        const formData = new FormData();
        formData.append("file", file, file.name);  // Ensure the correct File object is appended
        formData.append("is_private", "0");
        formData.append("folder", "");
        formData.append("file_name", file.name);

        try {
            const response = await axios.post(`/api/method/upload_file`, formData, {
                headers: {
                    'Accept': 'application/json',
                    
                    'Content-Type': 'multipart/form-data'
                }
            });
            if (response.data.message && response.data.message.file_url) {
                return response.data.message.file_url;
            } else {
                console.error("File URL not found in response:", response.data);
                return null;
            }
        } catch (error) {
            console.error("Error uploading file:", error);
            return null;
        }
    };


    // Handle User Image Chnage----
    const changeUserImage = async () => {
        if (!changeImage) {
            alert("Please select an image first.");
            return;
        }

        const uploadedFileUrl = await uploadFile(changeImage);

        if (uploadedFileUrl) {
            try {
                const response = await axios.post(`/api/method/reward_management.api.admin_profile.update_user_image`, {
                    new_image_url: uploadedFileUrl,
                    name: email,
                }, {
                    
                });

                if (response.data.message.status === "success") {
                    // setShowSuccessAlert(true);
                    console.log("uploadedFileUrl",uploadedFileUrl);
                    localStorage.setItem('uploadedFileUrl',uploadedFileUrl);
                    
                    setUserImage(uploadedFileUrl);  // Update the user's profile image with the new image URL
                } else {
                    console.error("Failed to update user image:", response.data);
                }
            } catch (error) {
                console.error("Error updating user image:", error);
            }
        }
    };

    const removeUserImage = async () => {
        try {
            // Set the default image
            setSelectedImage(face9); // Assuming face9 is the default image you want to set
    
            // Call the API to remove the user image
            await axios.post(`/api/method/reward_management.api.admin_profile.remove_user_image`, {
                name: email,
            });
    
            // Remove the image from localStorage
            localStorage.removeItem('uploadedFileUrl');
            setUserImage(face9); 
            // Show success alert
            // alert("User image removed successfully");
    
            // Delay the update of the profile picture to reflect the changes
            setTimeout(() => {
                setProfilePic(face9); // Assuming setProfilePic is a state setter for the profile image
            }, 2000); // 2000 milliseconds = 2 seconds
    
        } catch (error) {
            console.error('Error removing user image:', error);
        }
    };
    
    const toggleNewPasswordVisibility = () => {
        setShowNewPassword(!showNewPassword);
    };

    const toggleConfirmPasswordVisibility = () => {
        setShowConfirmPassword(!showConfirmPassword);
    };

    const handlePasswordChange = (e:any) => {
        const { id, value } = e.target;
        if (id === 'new-password') {
            setNewPassword(value);
        } else if (id === 'confirm-password') {
            setConfirmPassword(value);
        }
        // Check if passwords match
        setPasswordsMatch(newPassword === confirmPassword);
    };

    const savePassword = async () => {
        try {
            const response = await axios.post(`/api/method/reward_management.api.admin_profile.update_password_without_current`, 
                {
                    email : email,
                    new_password: newPassword
                  
                },
                {
                    // headers: {
                    //     Authorization: `token ${API_KEY}:${API_SECRET}`,
                    // },
                }
            );

            if (response.data.message.status === "success") {
                setShowSuccessAlert(true);
                console.log("User Password updated successfully.");
            } else {
                console.error("Error updating user details:", response.data.message);
            }
        } catch (error) {
            console.error("Error updating user details:", error);
        }
    }

    return (
        <Fragment>
                <Pageheader 
                currentpage={"Admin Profile"} 
                activepage={"/admin-profile"} 
                // mainpage={"/admin-profile"} 
                activepagename="Admin Profile"
                // mainpagename="Admin Profile"
            />
            {/* <Pageheader currentpage="Admin Profile" activepage="Admin Profile" mainpage="Admin Profile" /> */}
            <div className='container sm:p-3 !p-0 mt-4'>
                <div className="grid grid-cols-12 gap-6 mb-[3rem]">
                    <div className="xl:col-span-12 col-span-12">
                        <div className="box ">
                            <div className="box-header sm:flex block !justify-start m-4">
                                <nav aria-label="Tabs" className="md:flex block !justify-start whitespace-nowrap">
                                    <Link to="#" className={`m-1 block w-full cursor-pointer text-defaulttextcolor dark:text-defaulttextcolor/70 py-2 px-3 flex-grow text-[0.75rem] font-medium rounded-[5px] hover:text-primary ${activeTab === 'personal-info' ? 'bg-primary/10 text-primary' : ''}`} id="Personal-item" onClick={() => handleTabClick('personal-info')}>
                                        Personal Information
                                    </Link>
                                    <Link to="#" className={`m-1 block w-full cursor-pointer text-defaulttextcolor dark:text-defaulttextcolor/70 py-2 px-3 text-[0.75rem] flex-grow font-medium rounded-[5px] hover:text-primary ${activeTab === 'security' ? 'bg-primary/10 text-primary' : ''}`} id="security-item" onClick={() => handleTabClick('security')}>
                                        Password
                                    </Link>
                                </nav>
                            </div>
                            <div className="box-body border">
                                <div className="tab-content">
                                    <div className={`tab-pane ${activeTab === 'personal-info' ? 'show active' : 'hidden'}`} id="personal-info" aria-labelledby="Personal-item">
                                        {/* Personal Information Content */}
                                        <div className="sm:p-4 p-0">
                                            <h6 className="font-semibold mb-4 text-[1rem]">Photo :</h6>
                                            <div className="mb-6 sm:flex items-center">
                                                <div className="mb-0 me-[3rem] relative">
                                                    <span className="avatar avatar-xxl avatar-rounded relative inline-block">
                                                        <img src={UserImage || selectedImage} alt="" id="profile-img" className='rounded-full w-[130px] h-[130px] object-cover' />
                                                        <span aria-label="anchor" className="badge rounded-full bg-primary avatar-badge absolute top-[65%]  right-[2px] cursor-pointer py-[2px] px-[6px]" onClick={openFileInput}>
                                                            <input type="file" name="photo" ref={fileInputRef} onChange={handleImageChange} style={{ display: 'none' }} className="absolute w-full h-full opacity-0" id="profile-image" />
                                                            <i className="fe fe-camera !text-[0.65rem] text-white"></i>
                                                        </span>
                                                    </span>
                                                </div>

                                                <div className="inline-flex">
                                                    <button type="button" className="ti-btn ti-btn-primary bg-primary me-1" onClick={changeUserImage}>Change</button>
                                                    <button type="button" className="bg-light ti-btn text-defaulttextcolor" onClick={removeUserImage}>Remove</button>
                                                </div>
                                            </div>
                                            <h6 className="font-semibold mb-4 text-[1rem]">Profile :</h6>
                                            <div className="sm:grid grid-cols-12 gap-6 mb-6">
                                                <div className="xl:col-span-6 col-span-12">
                                                    <label htmlFor="first-name" className="form-label text-sm text-defaulttextcolor font-semibold">First Name</label>
                                                    <input
                                                        type="text"
                                                        className="form-control w-full rounded-[5px] border border-[#dadada] form-control-light mt-2 text-sm"
                                                        id="first-name"
                                                        placeholder="First Name"
                                                        value={firstName} // Set the value from the state
                                                        onChange={(e) => setFirstName(e.target.value)} // Allow user to change the value
                                                    />
                                                </div>
                                                <div className="xl:col-span-6 col-span-12">
                                                    <label htmlFor="last-name" className="form-label text-sm text-defaulttextcolor font-semibold">Last Name</label>
                                                    <input type="text" className="form-control w-full rounded-[5px] border border-[#dadada] form-control-light mt-2 text-sm" id="last-name" placeholder="Last Name"
                                                        value={lastName} // Set the value from the state
                                                        onChange={(e) => setLastName(e.target.value)} />
                                                </div>
                                                <div className="xl:col-span-6 col-span-12">
                                                    <label htmlFor="full-name" className="form-label text-sm text-defaulttextcolor font-semibold">Full Name</label>
                                                    <input type="text" className="form-control w-full rounded-[5px] border border-[#dadada] form-control-light mt-2 text-sm" id="full-name" placeholder="Full Name"
                                                        value={fullname} // Set the value from the state
                                                        onChange={(e) => 
                                                        

                                                            setFullname(e.target.value)

                                                        
                                                    }
                                                    />
                                                </div>
                                                <div className="xl:col-span-6 col-span-12">
                                                    <label className="form-label text-sm text-defaulttextcolor font-semibold">User Name</label>
                                                    <div className="input-group mb-3">
                                                        <input
                                                            value={username} // Set the value from the state
                                                            onChange={(e) => setUsername(e.target.value)}
                                                            type="text" className="form-control w-full rounded-[5px] border border-[#dadada] form-control-light mt-2 text-sm" id="basic-url" aria-describedby="basic-addon3" placeholder='username' />
                                                    </div>
                                                </div>
                                            </div>
                                            <h6 className="font-semibold mb-4 text-[1rem]">Personal information :</h6>
                                            <div className="sm:grid grid-cols-12 gap-6 mb-6">
                                                <div className="xl:col-span-6 col-span-12">
                                                    <label htmlFor="email-address" className="form-label text-sm text-defaulttextcolor font-semibold">Email Address</label>
                                                    <input type="text" className="form-control w-full rounded-[5px] border border-[#dadada] form-control-light mt-2 text-sm" id="email-address" placeholder="xyz@gmail.com"
                                                        value={email} // Set the value from the state
                                                        onChange={(e) => setEmail(e.target.value)}
                                                        readOnly
                                                    />
                                                </div>
                                                <div className="xl:col-span-6 col-span-12">
                                                    <label htmlFor="phone" className="form-label text-sm text-defaulttextcolor font-semibold">Phone</label>
                                                    <input type="text" className="form-control w-full rounded-[5px] border border-[#dadada] form-control-light mt-2 text-sm" id="phone" placeholder="contact details"
                                                        value={phone} // Set the value from the state
                                                        onChange={(e) => setPhone(e.target.value)}
                                                    />
                                                </div>
                                                <div className="xl:col-span-6 col-span-12">
                                                    <label htmlFor="mobile-number" className="form-label text-sm text-defaulttextcolor font-semibold">Mobile Number</label>
                                                    <input
                                                        type="text"
                                                        className={`form-control w-full rounded-[5px] border border-[#dadada] form-control-light mt-2 text-sm ${isValid ? '' : 'border-red-500'}`}
                                                        id="mobile-number"
                                                        placeholder="contact details"
                                                        value={mobileno} // Set the value from the state
                                                        onChange={handleMobileNumberChange} // Handle validation on change
                                                    />
                                                    {!isValid && <p className="text-[#FF0000] text-sm mt-1">Please enter a valid 10-digit mobile number.</p>}
                                                </div>
                                                <div className="xl:col-span-6 col-span-12">
                                                    <label htmlFor="dob" className="form-label text-sm text-defaulttextcolor font-semibold">Date of Birth</label>
                                                    <input type="date" className="form-control w-full rounded-[5px] border border-[#dadada] form-control-light mt-2 text-sm" id="dob" placeholder="contact details"
                                                        value={birthdate} // Set the value from the state
                                                        onChange={(e) => {
                                                            const selectedDate = e.target.value;
                                                            setBirthdate(selectedDate); // Update the state with the selected date
                                                            console.log("Selected Date:", selectedDate); // Log the selected date to the console
                                                        }}
                                                    />
                                                </div>
                                                <div className="xl:col-span-6 col-span-12">
                                                    <label htmlFor="gender" className="form-label text-sm text-defaulttextcolor font-semibold">Gender</label>
                                                    <select
                                                        className="form-control w-full rounded-[5px] border border-[#dadada] form-control-light mt-2 text-sm"
                                                        id="gender"
                                                        value={gender} // Bind the selected value to the state
                                                        onChange={(e) => {
                                                            const selectedGender = e.target.value;
                                                            setGender(selectedGender); // Update the state with the selected gender
                                                            console.log("Selected Gender:", selectedGender); // Log the selected gender to the console
                                                        }}
                                                    >
                                                        <option value="">Select Gender</option> {/* Default option */}
                                                        {genders.map((g, index) => (
                                                            <option key={index} value={g.name}>{g.name}</option>
                                                        ))}
                                                    </select>

                                                </div>
                                                <div className="xl:col-span-6 col-span-12">
                                                    <label htmlFor="location" className="form-label text-sm text-defaulttextcolor font-semibold">Location</label>
                                                    <input type="text" className="form-control w-full rounded-[5px] border border-[#dadada] form-control-light mt-2 text-sm" id="location" placeholder="Location"
                                                        value={location} // Set the value from the state
                                                        onChange={(e) => setLocation(e.target.value)}
                                                    />
                                                </div>
                                            </div>
                                            <div className='border-t border-defaultborder p-4 flex justify-end'>
                                                <button
                                                    className="ti-btn ti-btn-primary bg-primary me-3"
                                                    onClick={update_user_details} // Call the update_user_details function on button click
                                                >
                                                    Update profile
                                                </button>
                                                <button
                                                    type="button"
                                                    className="bg-light ti-btn text-defaulttextcolor"
                                                    onClick={resetForm}
                                                >
                                                    Cancel
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                    <div className={`tab-pane ${activeTab === 'security' ? 'show active' : 'hidden'}`} id="security" aria-labelledby="security-item">
                {/* Security (Password) Content */}
                <div className="sm:p-4 p-0">
                    <h6 className="font-semibold mb-6 text-[1rem]">Update Password :</h6>
                    <div className="sm:grid grid-cols-12 gap-6 mb-6">
                        <div className="xl:col-span-6 col-span-12 relative">
                            <label htmlFor="new-password" className="form-label text-sm text-defaulttextcolor font-semibold">New Password</label>
                            <input
                                type={showNewPassword ? 'text' : 'password'}
                                className="form-control w-full rounded-[5px] border border-[#dadada] form-control-light mt-2 text-sm"
                                id="new-password"
                                value={newPassword}
                                onChange={handlePasswordChange} // Attach onChange handler here
                                placeholder="Enter new password"
                            />
                            <button
                                type="button"
                                onClick={toggleNewPasswordVisibility}
                                className="absolute inset-y-[50px] right-0 pr-3 flex items-center text-xs text-gray-500"
                            >
                                {showNewPassword ? 'Hide' : 'Show'}
                            </button>
                        </div>

                        <div className="xl:col-span-6 col-span-12 relative">
                            <label htmlFor="confirm-password" className="form-label text-sm text-defaulttextcolor font-semibold">Confirm Password</label>
                            <input 
                                type={showConfirmPassword ? 'text' : 'password'} 
                                className="form-control w-full rounded-[5px] border border-[#dadada] form-control-light mt-2 text-sm"
                                id="confirm-password"
                                value={confirmPassword}
                                onChange={handlePasswordChange} // Attach onChange handler here
                                placeholder="Confirm password" 
                            />
                            <button
                                type="button"
                                onClick={toggleConfirmPasswordVisibility}
                                className="absolute inset-y-1 pt-8 right-0 pr-3 flex items-center text-xs text-gray-500"
                            >
                                {showConfirmPassword ? 'Hide' : 'Show'}
                            </button>
                        </div>
                    </div>
                    <div className='border-t border-defaultborder p-4 flex justify-end'>
                        <button className={`ti-btn ti-btn-primary bg-primary me-3 ${passwordsMatch ? 'opacity-50 cursor-not-allowed' : ''}`} 
                            onClick={savePassword}
                            // disabled={!passwordsMatch}
                        >
                            Save Password
                        </button>
                        <button
                            type="button"
                            className="bg-light ti-btn text-defaulttextcolor"
                            onClick={resetForm}
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* Success Alert */}
            {showSuccessAlert && <SuccessAlert message="Profile Update successfully!" />}
        </Fragment>
    );
};

export default AdminProfile;
