import { Fragment, useRef, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Pageheader from '../../../components/common/pageheader/pageheader';
import face9 from '../../../assets/images/reward_management/9.jpg';
import SuccessAlert from '../../../components/ui/alerts/SuccessAlert';
import { Notyf } from 'notyf';
import 'notyf/notyf.min.css'; 

const notyf = new Notyf({
    duration: 3000,
    position: {
        x: 'right',
        y: 'top',
    },
    types: [
        {
            type: 'success',
            background: '#4caf50',
            icon: {
                className: 'notyf-icon notyf-icon--custom',
                tagName: 'i',
                text: '✓',
            },
        },
        {
            type: 'error',
            background: '#f44336',
            icon: {
                className: 'notyf-icon notyf-icon--custom',
                tagName: 'i',
                text: '✗',
            },
        },
    ],
});

const AdminProfile = () => {
    const [showSuccessAlert, setShowSuccessAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const [alertTitle, setAlertTitle] = useState('');
    const [selectedImage, setSelectedImage] = useState(face9);
    const [activeTab, setActiveTab] = useState('personal-info');
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [UserImage, setUserImage] = useState('');
    // const [changeImage, setchangeImage] = useState<File | null>(null);
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [username, setUsername] = useState('');
    const [fullname, setFullname] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [mobileno, setMobileno] = useState('');
    const [gender, setGender] = useState('');
    const [genders, setGenders] = useState<{ name: string }[]>([]);
    const [birthdate, setBirthdate] = useState('');
    const [location, setLocation] = useState('');
    const [isGenderDropdownOpen, setIsGenderDropdownOpen] = useState(false);

    const [isValid, setIsValid] = useState(true);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [passwordsMatch, setPasswordsMatch] = useState(false);

    const resetForm = () => {
        window.location.reload();
    };

    const numberRegex = /^\d{10}$/;

    const handleMobileNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        const isValidNumber = numberRegex.test(value);
        setIsValid(isValidNumber);
        setMobileno(value);
    };

    localStorage.setItem('username', username);

    useEffect(() => {
        document.title = 'Profile Setting';
        if (showSuccessAlert) {
            const timer = setTimeout(() => setShowSuccessAlert(false), 3000);
            return () => clearTimeout(timer);
        }

        const fetchUserData = async () => {
            try {
                const userResponse = await axios.get(`/api/method/frappe.auth.get_logged_user`);
                const userdata = await axios.get(`/api/resource/User/${userResponse.data.message}`);
                
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

        const fetchAllGenders = async () => {
            try {
                const response = await axios.get(`/api/method/reward_management.api.admin_profile.get_all_gender`);
                setGenders(response.data.message);
            } catch (error) {
                console.error("Error fetching genders:", error);
            }
        };

        fetchUserData();
        fetchAllGenders();
    }, [showSuccessAlert]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const target = event.target as HTMLElement;
            if (isGenderDropdownOpen && !target.closest('.gender-dropdown-container')) {
                setIsGenderDropdownOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isGenderDropdownOpen]);

    const uploadFile = async (file: File) => {
        const formData = new FormData();
        formData.append("file", file, file.name);
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
            return response.data.message?.file_url || null;
        } catch (error) {
            console.error("Error uploading file:", error);
            return null;
        }
    };

    const updateUserImage = async (file: File) => {
        const uploadedFileUrl = await uploadFile(file);
        if (!uploadedFileUrl) {
            notyf.error("Failed to upload image");
            return;
        }

        try {
            const response = await axios.post(`/api/method/reward_management.api.admin_profile.update_user_image`, {
                new_image_url: uploadedFileUrl,
                name: email,
            });

            if (response.data.message.status === "success") {
                localStorage.setItem('uploadedFileUrl', uploadedFileUrl);
                setUserImage(uploadedFileUrl);
                setAlertTitle('Success');
                setAlertMessage('Profile image updated successfully!');
                setShowSuccessAlert(true);
                 setTimeout(() => {
                               
                                window.location.reload();
                            }, 100);
                // notyf.success("Profile image updated successfully!");
            } else {
                notyf.error(`Failed to update user image: ${response.data.message}`);
            }
        } catch (error) {
            notyf.error(`Error updating user image: ${error}`);
        }
    };

    const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            // Set temporary URL for immediate preview
            setSelectedImage(URL.createObjectURL(file));
            // Upload the image immediately
            await updateUserImage(file);
        }
    };

    const removeUserImage = async () => {
        try {
            setSelectedImage(face9);
            await axios.post(`/api/method/reward_management.api.admin_profile.remove_user_image`, {
                name: email,
            });
            localStorage.removeItem('uploadedFileUrl');
            setUserImage(face9);
            setAlertTitle('Success');
            setAlertMessage('Profile image removed successfully!');
            setShowSuccessAlert(true);
            setTimeout(() => {
            // setUserImage(face9);
            window.location.reload();}, 100);
            // notyf.success("Profile image removed successfully!");
        } catch (error) {
            console.error('Error removing user image:', error);
            notyf.error('Failed to remove profile image');
        }
    };

    const update_user_details = async (e: React.FormEvent) => {
        e.preventDefault();
        
        const form = e.currentTarget as HTMLFormElement;
        if (!form.checkValidity()) {
            form.reportValidity();
            return;
        }

        let userNameOrEmail = email.toLowerCase();

        try {
            const availabilityResponse = await axios.get(
                `/api/method/reward_management.api.admin_profile.check_username_availability`, 
                { params: { username, mobileno } }
            );
            
            if (availabilityResponse.data?.message.success === false) {
                notyf.error(`${availabilityResponse.data.message.message}`);
                return;
            }

            if (availabilityResponse.data?.message.success == true) {
                const response = await axios.post('/api/method/reward_management.api.admin_profile.update_user_details', {
                    name: userNameOrEmail === "administrator" ? "Administrator" : userNameOrEmail, 
                    first_name: firstName,
                    last_name: lastName,
                    full_name: fullname,
                    username: username,
                    phone,
                    mobile_no: mobileno,
                    gender,
                    birth_date: birthdate,
                    location
                });

                if (response.data.message.status === "success") {
                setAlertTitle('Success');
                setAlertMessage('Profile updated successfully!');
                setShowSuccessAlert(true);
                 setTimeout(() => {
                                window.location.reload();
                            }, 100);
                    // notyf.success("Profile updated successfully!");
                } else {
                    console.log("Error updating user details:", response.data.message);
                    notyf.error(`Failed to update profile: ${response.data.message.message}`);
                }
            }
        } catch (error) {
            console.log("Error updating user details:", error);
            notyf.error("Failed to update profile");
        }
    };

    const openFileInput = () => {
        fileInputRef.current?.click();
    };

    const handleTabClick = (tabId: string) => {
        setActiveTab(tabId);
    };

    const toggleNewPasswordVisibility = () => {
        setShowNewPassword(!showNewPassword);
    };

    const toggleConfirmPasswordVisibility = () => {
        setShowConfirmPassword(!showConfirmPassword);
    };

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;
        if (id === 'new-password') {
            setNewPassword(value);
        } else if (id === 'confirm-password') {
            setConfirmPassword(value);
        }
        setPasswordsMatch(newPassword === value || confirmPassword === value);
    };

    const savePassword = async () => {
        try {
            const response = await axios.post(
                `/api/method/reward_management.api.admin_profile.update_password_without_current`,
                {
                    email: email,
                    new_password: newPassword
                }
            );

            if (response.data.message.status === "success") {
                // setShowSuccessAlert(true);
                setAlertTitle('Success');
                setAlertMessage('Password updated successfully!');
                setShowSuccessAlert(true);
                // notyf.success("Password updated successfully!");
            } else {
                notyf.error(`Error updating password: ${response.data.message}`);
            }
        } catch (error) {
            console.error("Error updating password:", error);
            notyf.error("Failed to update password");
        }
    };

    return (
        <Fragment>
            <Pageheader
                currentpage={"Admin Profile"}
            />
            
            <div className='container sm:p-3 !p-0 mt-4'>
                <div className="grid grid-cols-12 gap-6 mb-[3rem]">
                    <div className="xl:col-span-12 col-span-12">
                        <div className="box">
                            <div className="box-header sm:flex block !justify-start m-4">
                                <nav aria-label="Tabs" className="md:flex block !justify-start whitespace-nowrap">
                                    <Link to="#" className={`m-1 block w-full cursor-pointer text-defaulttextcolor dark:text-defaulttextcolor/70 py-2 px-3 flex-grow text-[0.75rem] font-medium rounded-[5px] hover:text-primary ${activeTab === 'personal-info' ? 'bg-primary/10 text-primary' : ''}`} 
                                        onClick={() => handleTabClick('personal-info')}>
                                        Personal Information
                                    </Link>
                                    <Link to="#" className={`m-1 block w-full cursor-pointer text-defaulttextcolor dark:text-defaulttextcolor/70 py-2 px-3 text-[0.75rem] flex-grow font-medium rounded-[5px] hover:text-primary ${activeTab === 'security' ? 'bg-primary/10 text-primary' : ''}`} 
                                        onClick={() => handleTabClick('security')}>
                                        Password
                                    </Link>
                                </nav>
                            </div>
                            <div className="box-body border">
                                <div className="tab-content">
                                    <div className={`tab-pane ${activeTab === 'personal-info' ? 'show active' : 'hidden'}`} id="personal-info">
                                        <div className="sm:p-4 p-0">
                                            <h6 className="font-semibold mb-4 text-[1rem]">Photo</h6>
                                            <div className="mb-6 sm:flex items-center">
                                                <div className="mb-0 me-[3rem] relative">
                                                    <span className="avatar avatar-xxl avatar-rounded relative inline-block">
                                                        <img src={UserImage || selectedImage} alt="" id="profile-img" className='rounded-full w-[130px] h-[130px] object-cover' />
                                                        <span aria-label="anchor" className="badge rounded-full bg-primary avatar-badge absolute top-[65%] right-[2px] cursor-pointer py-[2px] px-[6px]" onClick={openFileInput}>
                                                            <input type="file" name="photo" ref={fileInputRef} onChange={handleImageChange} style={{ display: 'none' }} className="absolute w-full h-full opacity-0" id="profile-image" accept="image/*" />
                                                            <i className="fe fe-camera !text-[0.65rem] text-white"></i>
                                                        </span>
                                                    </span>
                                                </div>
                                                <div className="inline-flex">
                                                    <button type="button" className="bg-primary/20 ti-btn text-defaulttextcolor" onClick={removeUserImage}>Remove</button>
                                                </div>
                                            </div>
                                            <form id="profile-data" className='overflow-hidden' onSubmit={update_user_details}>
                                                {/* Rest of the form remains the same */}
                                                <h6 className="font-semibold mb-4 text-[1rem]">Profile</h6>
                                                <div className="sm:grid grid-cols-12 gap-6 mb-6">
                                                    <div className="xl:col-span-6 col-span-12">
                                                        <label htmlFor="first-name" className="form-label text-sm text-defaulttextcolor font-semibold">First Name <span className='text-red'>*</span></label>
                                                        <input
                                                            type="text"
                                                            className="outline-none focus:outline-none focus:ring-0 no-outline focus:border-[#dadada] form-control w-full rounded-[5px] border border-[#dadada] form-control-light mt-2 text-sm"
                                                            id="first-name"
                                                            placeholder="First Name"
                                                            value={firstName}
                                                            onChange={(e) => setFirstName(e.target.value)}
                                                            required
                                                            onInvalid={(e) => (e.target as HTMLInputElement).setCustomValidity('first Name is required')}
                                                            onInput={(e) => (e.target as HTMLInputElement).setCustomValidity('')}
                                                        />
                                                    </div>
                                                    <div className="xl:col-span-6 col-span-12">
                                                        <label htmlFor="last-name" className="form-label text-sm text-defaulttextcolor font-semibold">Last Name <span className='text-red'>*</span></label>
                                                        <input
                                                            type="text"
                                                            className="outline-none focus:outline-none focus:ring-0 no-outline focus:border-[#dadada] form-control w-full rounded-[5px] border border-[#dadada] form-control-light mt-2 text-sm"
                                                            id="last-name"
                                                            placeholder="Last Name"
                                                            value={lastName}
                                                            onChange={(e) => setLastName(e.target.value)}
                                                            required
                                                            onInvalid={(e) => (e.target as HTMLInputElement).setCustomValidity('last Name is required')}
                                                            onInput={(e) => (e.target as HTMLInputElement).setCustomValidity('')}
                                                        />
                                                    </div>
                                                    <div className="xl:col-span-6 col-span-12">
                                                        <label htmlFor="full-name" className="form-label text-sm text-defaulttextcolor font-semibold">Full Name <span className='text-red'>*</span></label>
                                                        <input
                                                            type="text"
                                                            className="outline-none focus:outline-none focus:ring-0 no-outline focus:border-[#dadada] form-control w-full rounded-[5px] border border-[#dadada] form-control-light mt-2 text-sm"
                                                            id="full-name"
                                                            placeholder="Full Name"
                                                            value={fullname}
                                                            onChange={(e) => setFullname(e.target.value)}
                                                            required
                                                            onInvalid={(e) => (e.target as HTMLInputElement).setCustomValidity('full Name is required')}
                                                            onInput={(e) => (e.target as HTMLInputElement).setCustomValidity('')}
                                                        />
                                                    </div>
                                                    <div className="xl:col-span-6 col-span-12">
                                                        <label className="form-label text-sm text-defaulttextcolor font-semibold">User Name <span className='text-red'>*</span></label>
                                                        <div className="input-group mb-3">
                                                            <input
                                                                type="text"
                                                                className="outline-none focus:outline-none focus:ring-0 no-outline focus:border-[#dadada] form-control w-full rounded-[5px] border border-[#dadada] form-control-light mt-2 text-sm"
                                                                id="username"
                                                                value={username}
                                                                onChange={(e) => setUsername(e.target.value)}
                                                                placeholder="username"
                                                                required
                                                                onInput={(e) => (e.target as HTMLInputElement).setCustomValidity('')}
                                                                onInvalid={(e) => (e.target as HTMLInputElement).setCustomValidity('username is required')}
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                                <h6 className="font-semibold mb-4 text-[1rem]">Personal information</h6>
                                                <div className="sm:grid grid-cols-12 gap-6 mb-6">
                                                    <div className="xl:col-span-6 col-span-12">
                                                        <label htmlFor="email-address" className="form-label text-sm text-defaulttextcolor font-semibold">Email Address</label>
                                                        <input
                                                            type="text"
                                                            className="outline-none focus:outline-none focus:ring-0 no-outline focus:border-[#dadada] form-control w-full rounded-[5px] border border-[#dadada] form-control-light mt-2 text-sm"
                                                            id="email-address"
                                                            placeholder="xyz@gmail.com"
                                                            value={email}
                                                            readOnly
                                                        />
                                                    </div>
                                                    <div className="xl:col-span-6 col-span-12">
                                                        <label htmlFor="phone" className="form-label text-sm text-defaulttextcolor font-semibold">Phone</label>
                                                        <input
                                                            type="text"
                                                            className="outline-none focus:outline-none focus:ring-0 no-outline focus:border-[#dadada] form-control w-full rounded-[5px] border border-[#dadada] form-control-light mt-2 text-sm"
                                                            id="phone"
                                                            placeholder="contact details"
                                                            value={phone}
                                                            onChange={(e) => setPhone(e.target.value)}
                                                        />
                                                    </div>
                                                    <div className="xl:col-span-6 col-span-12">
                                                        <label htmlFor="mobile-number" className="form-label text-sm text-defaulttextcolor font-semibold">Mobile Number</label>
                                                        <input
                                                            type="text"
                                                            className={`outline-none focus:outline-none focus:ring-0 no-outline focus:border-[#dadada] form-control w-full rounded-[5px] border border-[#dadada] form-control-light mt-2 text-sm ${isValid ? '' : 'border-red-500'}`}
                                                            id="mobile-number"
                                                            placeholder="contact details"
                                                            value={mobileno}
                                                            onChange={handleMobileNumberChange}
                                                        />
                                                        {!isValid && <p className="text-[#FF0000] text-sm mt-1">Please enter a valid 10-digit mobile number.</p>}
                                                    </div>
                                                    <div className="xl:col-span-6 col-span-12">
                                                        <label htmlFor="dob" className="form-label text-sm text-defaulttextcolor font-semibold">Date of Birth</label>
                                                        <input
                                                            type="date"
                                                            className="outline-none focus:outline-none focus:ring-0 no-outline focus:border-[#dadada] form-control w-full rounded-[5px] border border-[#dadada] form-control-light mt-2 text-sm"
                                                            id="dob"
                                                            value={birthdate}
                                                            onChange={(e) => setBirthdate(e.target.value)}
                                                        />
                                                    </div>
                                                    <div className="xl:col-span-6 col-span-12 gender-dropdown-container ">
                                                        <label htmlFor="gender" className="form-label text-sm text-defaulttextcolor font-semibold">Gender</label>
                                                        <div
                                                            className="z-[40%]  outline-none focus:outline-none focus:ring-0 no-outline focus:border-[#dadada] form-control w-full rounded-[5px] border border-[#dadada] form-control-light mt-2 text-sm cursor-pointer"
                                                            onClick={() => setIsGenderDropdownOpen(!isGenderDropdownOpen)}
                                                            tabIndex={0}
                                                            onKeyDown={(e) => {
                                                                if (e.key === 'Enter') {
                                                                    setIsGenderDropdownOpen(!isGenderDropdownOpen);
                                                                } else if (e.key === 'Escape') {
                                                                    setIsGenderDropdownOpen(false);
                                                                }
                                                            }}
                                                        >
                                                            <div className="flex justify-between items-center p-2 ">
                                                                <span>{gender || "Select Gender"}</span>
                                                                <i className={`fe fe-chevron-${isGenderDropdownOpen ? 'up' : 'down'} text-defaultsize`}></i>
                                                            </div>
                                                            {isGenderDropdownOpen && (
                                                                <div className=" w-full bg-white shadow-lg rounded-[5px] border border-[#dadada] max-h-40 overflow-auto p-2">
                                                                    <div
                                                                        className={`px-1 my-1 hover:bg-primary/10 cursor-pointer ${!gender ? 'bg-primary/20 text-primary' : ''}`}
                                                                        onClick={(e) => {
                                                                            e.stopPropagation();
                                                                            setGender('');
                                                                            setIsGenderDropdownOpen(false);
                                                                        }}
                                                                    >
                                                                        Select Gender
                                                                    </div>
                                                                    {genders.map((g, index) => (
                                                                        <div
                                                                            key={index}
                                                                            className={`px-1 my-1 hover:bg-primary/10 cursor-pointer ${gender === g.name ? 'bg-primary/20 text-primary' : ''}`}
                                                                            onClick={(e) => {
                                                                                e.stopPropagation();
                                                                                setGender(g.name);
                                                                                setIsGenderDropdownOpen(false);
                                                                            }}
                                                                        >
                                                                            {g.name}
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                    <div className="xl:col-span-6 col-span-12">
                                                        <label htmlFor="location" className="form-label text-sm text-defaulttextcolor font-semibold">Location</label>
                                                        <input
                                                            type="text"
                                                            className="outline-none focus:outline-none focus:ring-0 no-outline focus:border-[#dadada] form-control w-full rounded-[5px] border border-[#dadada] form-control-light mt-2 text-sm"
                                                            id="location"
                                                            placeholder="Location"
                                                            value={location}
                                                            onChange={(e) => setLocation(e.target.value)}
                                                        />
                                                    </div>
                                                </div>
                                                <div className='p-4 flex justify-end'>
                                                    <button
                                                        type="submit"
                                                        className="ti-btn text-white bg-primary me-3"
                                                    >
                                                        Save
                                                    </button>
                                                    <button
                                                        type="button"
                                                        className="bg-primary/20 ti-btn text-defaulttextcolor"
                                                        onClick={resetForm}
                                                    >
                                                        Cancel
                                                    </button>
                                                </div>
                                            </form>
                                        </div>
                                    </div>
                                    <div className={`tab-pane ${activeTab === 'security' ? 'show active' : 'hidden'}`} id="security">
                                        <div className="sm:p-4 p-0">
                                            <h6 className="font-semibold mb-6 text-[1rem]">Update Password</h6>
                                            <div className="sm:grid grid-cols-12 gap-6 mb-6">
                                                <div className="xl:col-span-6 col-span-12 relative">
                                                    <label htmlFor="new-password" className="form-label text-sm text-defaulttextcolor font-semibold">New Password</label>
                                                    <input
                                                        type={showNewPassword ? 'text' : 'password'}
                                                        className="outline-none focus:outline-none focus:ring-0 no-outline focus:border-[#dadada] form-control w-full rounded-[5px] border border-[#dadada] form-control-light mt-2 text-sm"
                                                        id="new-password"
                                                        value={newPassword}
                                                        onChange={handlePasswordChange}
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
                                                        className="outline-none focus:outline-none focus:ring-0 no-outline focus:border-[#dadada] form-control w-full rounded-[5px] border border-[#dadada] form-control-light mt-2 text-sm"
                                                        id="confirm-password"
                                                        value={confirmPassword}
                                                        onChange={handlePasswordChange}
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
                                            <div className='p-4 flex justify-end'>
                                                <button
                                                    className={`ti-btn text-white bg-primary me-3 ${!passwordsMatch ? 'opacity-50 cursor-not-allowed' : ''}`}
                                                    onClick={savePassword}
                                                    disabled={!passwordsMatch}
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
            {showSuccessAlert && 
            <SuccessAlert 
                    title={alertTitle}
                    showButton={false}
                    showCancleButton={false}
                    showCollectButton={false}
                    showAnotherButton={false}
                    showMessagesecond={false}
                    message={alertMessage}            
            />}
        </Fragment>
    );
};

export default AdminProfile;