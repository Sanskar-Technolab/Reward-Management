import { Fragment, useRef, useState, useEffect } from 'react';
import axios from 'axios';
import Pageheader from '../../components/common/pageheader/pageheader';
// import {, API_KEY, API_SECRET } from "../../../utils/constants";
import face9 from '../../assets/images/reward_management/9.jpg';
import SuccessAlert from '../../components/ui/alerts/SuccessAlert';





const AdminProfile = () => {

 

    const [showSuccessAlert, setShowSuccessAlert] = useState(false);
    const [selectedImage, setSelectedImage] = useState(face9); // Set the default image URL here
    const fileInputRef = useRef(null);
    const [UserImage, setUserImage] = useState('')
    const [changeImage, setchangeImage] = useState('');
    const [firstName, setFirstName] = useState(''); // State to store first name
    const [lastName, setLastName] = useState(''); // State to store first name
    const [fullname, setFullname] = useState(''); // State to store first name
    const [email, setEmail] = useState(''); // State to store first name
    const [oldEmail, setOldEmail] = useState(''); // State to store old email
    const [mobileno, setMobileno] = useState(''); // State to store first name
    const [gender, setGender] = useState(''); // State to store first name
    const [genders, setGenders] = useState([]);
    const [birthdate, setBirthdate] = useState(''); // State to store first name
    const [location, setLocation] = useState(''); // State to store first name



    // Reset form fields to their initial values
    const resetForm = () => {
        window.location.reload();
    };




    useEffect(() => {
        document.title='User Profile Settings';



        if (showSuccessAlert) {
            const timer = setTimeout(() => setShowSuccessAlert(false), 3000);
            return () => clearTimeout(timer);
        }
        console.log("birthdate--", birthdate);
        const fetchUserEmailAndInitScanner = async () => {
            try {
                // Fetch logged-in user
                const userResponse = await axios.get(`/api/method/frappe.auth.get_logged_user`, {
                    headers: {
                        'Cache-Control': 'no-cache, no-store, must-revalidate',
                        'Pragma': 'no-cache',
                        'Expires': '0',
                    },
                });
                console.log("userData----->", userResponse.data.message);
                //   const userData = userResponse.data;

                const userdata = await axios.get(`/api/resource/User/${userResponse.data.message}`,
                    {
                        method: "GET",

                    }
                );
                console.log("userData----->", userdata.data.data);
                //   document.getElementById('first-name').innerText = userdata.data.data.first_name || "";
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



        // Fetch total pending redemptions count
        const fetchallgenders = async () => {
            try {
                const response = await axios.get(`/api/method/reward_management.api.customer_profile.get_all_gender`,
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

    const handleImageChange = (e: any) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedImage(URL.createObjectURL(file));
            setchangeImage(file);  // Store the actual file object here
        }
    };

    const update_user_details = async () => {
        try {
            const response = await axios.post(`/api/method/reward_management.api.customer_profile.update_user_details`, {
                name: email,  // New email
                old_email: oldEmail,  // Old email
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
                console.log("User details updated successfully.");
            } 
            else if (response.data.message.status === 'error') {
                console.log("Update user response:", response);
                setShowSuccessAlert(true);
                // setShowSuccessAlert(true); // This should likely be set to false in case of error
            } 
            else {
                console.error("Unexpected response status:", response.data.message.status);
            }
        } catch (error) {
            console.error("Error updating user details:", error);
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
                const response = await axios.post(`/api/method/reward_management.api.customer_profile.update_user_image`, {
                    new_image_url: uploadedFileUrl,
                    name: email,
                }, {

                });

                if (response.data.message.status === "success") {
                    // setShowSuccessAlert(true);
                    console.log("uploadedFileUrl", uploadedFileUrl);
                    localStorage.setItem('uploadedFileUrl', uploadedFileUrl);

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
            await axios.post(`/api/method/reward_management.api.customer_profile.remove_user_image`, {
                name: email,
            });

            // Remove the image from localStorage
            localStorage.removeItem('uploadedFileUrl');
            setUserImage(face9);

            setTimeout(() => {
                setUserImage(face9); // Assuming setProfilePic is a state setter for the profile image
            }, 2000); // 2000 milliseconds = 2 seconds

        } catch (error) {
            console.error('Error removing user image:', error);
        }
    };



    return (
        <Fragment>
               <Pageheader 
                currentpage={"Profile Setting"} 
                activepage={"/profile-setting"} 
                // mainpage={"/profile-setting"} 
                activepagename="Profile Setting"
                // mainpagename="Profile Setting"
            />
            {/* <Pageheader currentpage="Profile Setting" activepage="Profile Setting" mainpage="Profile Setting" /> */}
            <div className='container sm:p-3 !p-0 mt-4'>
                <div className="grid grid-cols-12 gap-6 mb-[3rem]">
                    <div className="xl:col-span-12 col-span-12">
                        <div className="box ">
                            <div className="box-header sm:flex block !justify-start m-4 text-[0.75rem] font-medium  text-primary">
                                Personal Details
                            </div>
                            <div className="box-body border">
                                <div className="tab-content">
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

                                        </div>
                                        <h6 className="font-semibold mb-4 text-[1rem]">Personal information :</h6>
                                        <div className="sm:grid grid-cols-12 gap-6 mb-6">
                                            <div className="xl:col-span-6 col-span-12">
                                                <label htmlFor="email-address" className="form-label text-sm text-defaulttextcolor font-semibold">Email Address</label>

                                                <input type="text" className="form-control w-full rounded-[5px] border border-[#dadada] form-control-light mt-2 text-sm" id="email-address" placeholder="xyz@gmail.com"
                                                    value={email} // Set the value from the state
                                                    onChange={(e) => setEmail(e.target.value)}

                                                />
                                            </div>

                                            <div className="xl:col-span-6 col-span-12">
                                                <label htmlFor="mobile-number" className="form-label text-sm text-defaulttextcolor font-semibold">Mobile Number</label>
                                                <input
                                                    type="text"
                                                    className={`form-control w-full rounded-[5px] border border-[#dadada] form-control-light mt-2 text-sm`}
                                                    id="mobile-number"
                                                    placeholder="contact details"
                                                    value={mobileno} // Set the value from the state

                                                />

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
