import { Fragment, useRef, useState, useEffect } from 'react';
import axios from 'axios';
import Pageheader from '../../components/common/pageheader/pageheader';
import face9 from '../../assets/images/reward_management/9.jpg';
import SuccessAlert from '../../components/ui/alerts/SuccessAlert';

import { csrf_token } from 'frappejs';
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
    const [selectedImage, setSelectedImage] = useState(face9);
    const fileInputRef = useRef(null);
    const [UserImage, setUserImage] = useState('')
    const [changeImage, setchangeImage] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [fullname, setFullname] = useState('');
    const [email, setEmail] = useState('');
    const [oldEmail, setOldEmail] = useState('');
    const [mobileno, setMobileno] = useState('');
    const [gender, setGender] = useState('');
    const [genders, setGenders] = useState([]);
    const [birthdate, setBirthdate] = useState('');
    const [location, setLocation] = useState('');
    const [isGenderDropdownOpen, setIsGenderDropdownOpen] = useState(false);

    const resetForm = () => {
        window.location.reload();
    };

    useEffect(() => {
        document.title='User Profile Settings';

        if (showSuccessAlert) {
            const timer = setTimeout(() => setShowSuccessAlert(false), 3000);
            return () => clearTimeout(timer);
        }

        const fetchUserEmailAndInitScanner = async () => {
            try {
                const userResponse = await axios.get(`/api/method/frappe.auth.get_logged_user`, {
                    headers: {
                        'Cache-Control': 'no-cache, no-store, must-revalidate',
                        'Pragma': 'no-cache',
                        'Expires': '0',
                    },
                });

                const userdata = await axios.get(`/api/resource/User/${userResponse.data.message}`,
                    {
                        method: "GET",
                    }
                );
                
                setFirstName(userdata.data.data.first_name || "");
                setLastName(userdata.data.data.last_name || "");
                setFullname(userdata.data.data.full_name || "");
                setEmail(userdata.data.data.email || "");
                setOldEmail(userdata.data.data.email || "");
                setMobileno(userdata.data.data.mobile_no || "");
                setGender(userdata.data.data.gender || "");
                setBirthdate(userdata.data.data.birth_date || "");
                setLocation(userdata.data.data.location || "");
                setUserImage(userdata.data.data.user_image || face9);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        const fetchallgenders = async () => {
            try {
                const response = await axios.get(`/api/method/reward_management.api.customer_profile.get_all_gender`,
                    {
                        method: "GET",
                    }
                );
                setGenders(response.data.message); 
            } catch (error) {
                console.error("Error fetching redemptions count:", error);
            }
        };

        fetchUserEmailAndInitScanner();
        fetchallgenders();
    }, [showSuccessAlert]);

    const handleImageChange = (e: any) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedImage(URL.createObjectURL(file));
            setchangeImage(file);
        }
    };

    const update_user_details = async (e:any) => {
        e.preventDefault();
        // if (!firstName || !lastName || !email) {
        //     notyf.error("Please fill in all required fields");
        //     return;
        // }
    
        try {
    
                const response = await axios.post(`/api/method/reward_management.api.customer_profile.update_user_details`, {
                            name: email,
                            old_email: oldEmail,
                            first_name: firstName,
                            last_name: lastName,
                            full_name: fullname,
                            mobile_no: mobileno,
                            gender,
                            birth_date: birthdate,
                            location,
                        });
                
                        if (response.data.message.status === "success") {
                            setShowSuccessAlert(true);
                        } 
                        else if (response.data.message.status === 'error') {
                            setShowSuccessAlert(true);
                        } 
                        else {
                            console.error("Unexpected response status:", response.data.message.status);
                        }
        } catch (error) {
            console.log("Error updating user details:", error);
            setShowSuccessAlert(false);
        }
    };
    
    const openFileInput = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    const uploadFile = async (file) => {
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
            if (response.data.message && response.data.message.file_url) {
                return response.data.message.file_url;
            } else {
                console.log("File URL not found in response:", response.data);
                return null;
            }
        } catch (error) {
            console.log("Error uploading file:", error);
            return null;
        }
    };

    const changeUserImage = async () => {
        if (!changeImage) {
            notyf.error("Please select new image");
            return;
        }

        const uploadedFileUrl = await uploadFile(changeImage);

        if (uploadedFileUrl) {
            try {
                const response = await axios.post(`/api/method/reward_management.api.customer_profile.update_user_image`, {
                    new_image_url: uploadedFileUrl,
                    name: email,
                });

                if (response.data.message.status === "success") {
                    localStorage.setItem('uploadedFileUrl', uploadedFileUrl);
                    setUserImage(uploadedFileUrl);
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
            setSelectedImage(face9);
            await axios.post(`/api/method/reward_management.api.customer_profile.remove_user_image`, {
                name: email,
            });
            localStorage.removeItem('uploadedFileUrl');
            setUserImage(face9);
            setTimeout(() => {
                setUserImage(face9);
            }, 2000);
        } catch (error) {
            console.error('Error removing user image:', error);
        }
    };

    return (
        <Fragment>
            <Pageheader 
                currentpage={"Profile Setting"} 
                activepage={"/profile-setting"} 
                activepagename="Profile Setting"
            />
            <div className='container sm:p-3 !p-0 mt-4'>
                <div className="grid grid-cols-12 gap-6 mb-[3rem]">
                    <div className="xl:col-span-12 col-span-12">
                        <div className=" box">
                            <div className="box-header sm:flex block !justify-start m-4 text-[0.75rem] font-medium  text-primary">
                                Personal Details
                            </div>
                            <form id="profile-data" className='overflow-hidden' onSubmit={update_user_details}>

                            <div className="box-body border">
                                <div className="tab-content">
                                    <div className="sm:p-4 p-0">
                                        <h6 className="font-semibold mb-4 text-[1rem]">Photo :</h6>
                                        <div className="mb-6 sm:flex items-center">
                                            <div className="mb-0 me-[3rem] relative">
                                                <span className="avatar avatar-xxl avatar-rounded relative inline-block">
                                                    <img src={UserImage || selectedImage} alt="" id="profile-img" className='rounded-full w-[130px] h-[130px] object-cover' />
                                                    <span aria-label="anchor" className="badge rounded-full bg-primary avatar-badge absolute top-[65%]  right-[2px] cursor-pointer py-[2px] px-[6px]" onClick={openFileInput}>
                                                        <input type="file" name="photo" ref={fileInputRef} onChange={handleImageChange} style={{ display: 'none' }} className="absolute w-full h-full opacity-0 text-center" id="profile-image" />
                                                        <i className="fe fe-camera !text-[0.65rem] text-white"></i>
                                                    </span>
                                                </span>
                                            </div>
                                            <div className="inline-flex">
                                                <button type="button" className="ti-btn bg-primary text-white me-1" onClick={changeUserImage}>Change</button>
                                                <button type="button" className="ti-btn bg-primary/20 text-defaulttextcolor" onClick={removeUserImage}>Remove</button>
                                            </div>
                                        </div>
                                        <h6 className="font-semibold mb-4 text-[1rem]">Profile :</h6>
                                        <div className="sm:grid grid-cols-12 gap-6 mb-6">
                                            <div className="xl:col-span-6 col-span-12">
                                                <label htmlFor="first-name" className="form-label text-sm text-defaulttextcolor font-semibold">First Name <span className="text-red">*</span></label>
                                                <input
                                                    type="text"
                                                    className="outline-none focus:outline-none focus:ring-0 no-outline focus:border-[#dadada] form-control w-full rounded-[5px] border border-[#dadada] form-control-light mt-2 text-sm"
                                                    id="first-name"
                                                    placeholder="First Name"
                                                    value={firstName}
                                                    onChange={(e) => setFirstName(e.target.value)}
                                                    required
                                                     onInvalid={(e) => {
                                                        (e.target as HTMLInputElement).setCustomValidity("first name is required");
                                                    }}
                                                    onInput={(e) => {
                                                        (e.target as HTMLInputElement).setCustomValidity("");
                                                    }}
                                                />
                                            </div>
                                            <div className="xl:col-span-6 col-span-12">
                                                <label htmlFor="last-name" className="form-label text-sm text-defaulttextcolor font-semibold">Last Name <span className="text-red">*</span></label>
                                                <input 
                                                    type="text" 
                                                    className="outline-none focus:outline-none focus:ring-0 no-outline focus:border-[#dadada] form-control w-full rounded-[5px] border border-[#dadada] form-control-light mt-2 text-sm" 
                                                    id="last-name" 
                                                    placeholder="Last Name"
                                                    value={lastName}
                                                    onChange={(e) => setLastName(e.target.value)}
                                                    required
                                                    onInvalid={(e) => {
                                                        (e.target as HTMLInputElement).setCustomValidity("last name is required");
                                                    }}
                                                    onInput={(e) => {
                                                        (e.target as HTMLInputElement).setCustomValidity("");
                                                    }}
                                                />
                                            </div>
                                            <div className="xl:col-span-6 col-span-12">
                                                <label htmlFor="full-name" className="form-label text-sm text-defaulttextcolor font-semibold">Full Name</label>
                                                <input 
                                                    type="text" 
                                                    className="outline-none focus:outline-none focus:ring-0 no-outline focus:border-[#dadada] form-control w-full rounded-[5px] border border-[#dadada] form-control-light mt-2 text-sm" 
                                                    id="full-name" 
                                                    placeholder="Full Name"
                                                    value={fullname}
                                                    onChange={(e) => setFullname(e.target.value)}
                                                />
                                            </div>
                                        </div>
                                        <h6 className="font-semibold mb-4 text-[1rem]">Personal information :</h6>
                                        <div className="sm:grid grid-cols-12 gap-6 mb-6">
                                            <div className="xl:col-span-6 col-span-12">
                                                <label htmlFor="email-address" className="form-label text-sm text-defaulttextcolor font-semibold">Email Address <span className="text-red">*</span></label>
                                                <input 
                                                    type="email" 
                                                    className="outline-none focus:outline-none focus:ring-0 no-outline focus:border-[#dadada] form-control w-full rounded-[5px] border border-[#dadada] form-control-light mt-2 text-sm" 
                                                    id="email-address" 
                                                    placeholder="xyz@gmail.com"
                                                    value={email}
                                                    onChange={(e) => setEmail(e.target.value)}
                                                    required
                                                     onInvalid={(e) => {
                                                        (e.target as HTMLInputElement).setCustomValidity("email is required");
                                                    }}
                                                    onInput={(e) => {
                                                        (e.target as HTMLInputElement).setCustomValidity("");
                                                    }}
                                                />
                                            </div>
                                            <div className="xl:col-span-6 col-span-12">
                                                <label htmlFor="mobile-number" className="form-label text-sm text-defaulttextcolor font-semibold">Mobile Number</label>
                                                <input
                                                    type="text"
                                                    className={`outline-none focus:outline-none focus:ring-0 no-outline focus:border-[#dadada] form-control w-full rounded-[5px] border border-[#dadada] form-control-light mt-2 text-sm`}
                                                    id="mobile-number"
                                                    placeholder="contact details"
                                                    value={mobileno}
                                                />
                                            </div>
                                            <div className="xl:col-span-6 col-span-12">
                                                <label htmlFor="dob" className="form-label text-sm text-defaulttextcolor font-semibold">Date of Birth</label>
                                                <input 
                                                    type="date" 
                                                    className="outline-none focus:outline-none focus:ring-0 no-outline focus:border-[#dadada] form-control w-full rounded-[5px] border border-[#dadada] form-control-light mt-2 text-sm" 
                                                    id="dob" 
                                                    placeholder="contact details"
                                                    value={birthdate}
                                                    onChange={(e) => setBirthdate(e.target.value)}
                                                />
                                            </div>
                                    
                                            <div className="xl:col-span-6 col-span-12 gender-dropdown-container relative ">
                                                        <label htmlFor="gender" className="form-label text-sm text-defaulttextcolor font-semibold">Gender</label>
                                                        <div 
                                                            className="absolute z-[40%] outline-none focus:outline-none focus:ring-0 no-outline focus:border-[#dadada] form-control w-full rounded-[5px] border border-[#dadada] form-control-light mt-2 text-sm cursor-pointer"
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
                                                            <div className="flex justify-between items-center p-2">
                                                                <span>{gender || "Select Gender"}</span>
                                                                <i className={`fe fe-chevron-${isGenderDropdownOpen ? 'up' : 'down'} text-[0.8rem]`}></i>
                                                            </div>
                                                            {isGenderDropdownOpen && (
                                                                <div className="mt-1 w-full bg-white shadow-lg rounded-[5px] border border-[#dadada] max-h-60 overflow-auto">
                                                                    {genders.map((g, index) => (
                                                                        <div 
                                                                            key={index} 
                                                                            className={`p-2 hover:bg-gray-100 cursor-pointer ${gender === g.name ? 'bg-primary/10 text-primary' : ''}`}
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
                                        <div className='border-t border-defaultborder p-4 flex justify-end'>
                                            <button
                                                className="ti-btn text-white bg-primary me-3"
                                                // onClick={update_user_details}
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
                                    </div>
                                </div>
                            </div>

                            </form>
                        </div>
                    </div>
                </div>
            </div>
            {showSuccessAlert && <SuccessAlert message="Profile Update successfully!" />}
        </Fragment>
    );
};

export default AdminProfile;