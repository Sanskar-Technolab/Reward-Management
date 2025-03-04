import '../../../assets/css/style.css';
import '../../../assets/css/pages/admindashboard.css';
import Pageheader from '../../../components/common/pageheader/pageheader';
import React, { useState, useEffect } from "react";
import SuccessAlert from '../../../components/ui/alerts/SuccessAlert';
import axios from 'axios';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const Project: React.FC = () => {
    const [showSuccessAlert, setShowSuccessAlert] = useState(false);
    const [projectImages, setProjectImages] = useState<string[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [showAddCatalogueForm, setShowAddCatalogueForm] = useState(false);
    const [fileDetails, setFileDetails] = useState<{ url: string, name: string }[]>([]);
    const [projectToEdit, setProjectToEdit] = useState<any>(null);
    const [error, setError] = useState<string>('');

    useEffect(() => {
        document.title = 'Projects';

        if (showSuccessAlert) {
            const timer = setTimeout(() => {
                setShowSuccessAlert(false);
                window.location.reload();
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [showSuccessAlert]);

    const handleAddNewProject = () => {
        setProjectToEdit(null);
        setShowAddCatalogueForm(true);
    };

    useEffect(() => {
        const fetchInstructions = async () => {
            try {
                const response = await axios.get(
                    "/api/method/reward_management.api.project.get_project"
                );
                if (response && response.data?.message?.images) {
                    const images = response.data.message.images;
                    setProjectImages(images);
                }
            } catch (error) {
                console.error("Error fetching instructions:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchInstructions();
    }, []);

    const handleCloseModal = () => {
        setShowAddCatalogueForm(false);

    };

    // File input change handler
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;

        if (files) {
            const fileArray = Array.from(files);

            // Check if the number of files is more than 10
            if (fileArray.length + fileDetails.length > 10) {
                setError('You can only select up to 10 images!');
                return;
            } else {
                setError('');
            }

            // Convert files to data URLs and store them
            const newFileDetails = fileArray.map((file) => {
                const reader = new FileReader();
                return new Promise<{ url: string, name: string }>((resolve) => {
                    reader.onload = (event) => {
                        resolve({
                            url: event.target?.result as string,
                            name: file.name,
                        });
                    };
                    reader.readAsDataURL(file);
                });
            });

            Promise.all(newFileDetails).then((newDetails) => {
                setFileDetails((prevFiles) => [...prevFiles, ...newDetails]);
            });
        }
    };

    // Remove image handler
    const handleRemoveImage = (indexToRemove: number) => {
        setFileDetails((prevFiles) =>
            prevFiles.filter((_, index) => index !== indexToRemove)
        );
    };

    // Upload file function
    const uploadFile = async (file: File) => {
        const formData = new FormData();
        formData.append("file", file, file.name);
        formData.append("is_private", "0");
        formData.append("folder", "");
        formData.append("file_name", file.name);

        try {
            const response = await axios.post(`/api/method/upload_file`, formData, {
                headers: {
                    Accept: "application/json",
                    "Content-Type": "multipart/form-data",
                },
            });
            if(response){
                console.log("image upload response",response)
            }
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


    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        const uploadedFileURLs: string[] = [];
    
        try {
           
            for (const fileDetail of fileDetails) {
                const fileBlob = await fetch(fileDetail.url).then(res => res.blob());
                const file = new File([fileBlob], fileDetail.name, { type: fileBlob.type });
    
                const fileURL = await uploadFile(file); 
                if (fileURL) {
                    uploadedFileURLs.push(fileURL);
                }
            }
    
            console.log("Uploaded File URLs:", uploadedFileURLs);
    
            const response = await axios.post(
                '/api/method/reward_management.api.project.add_project',
                { new_image_url: uploadedFileURLs }, 
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                    },
                }
            );
    
         
            const result = response.data;
    
            if (result.message && result.message.status === 'success') {
                console.log("API Response:", result.message.message); 
                setShowSuccessAlert(true);
                setFileDetails([]);                  
                setShowAddCatalogueForm(false);


            } else {
                console.error("API Error:", result.message);
                alert("Error updating project images: " + (result.message.message || "Unknown error."));
            }
        } catch (error) {
            console.error("Error during file upload or API call:", error);
            alert("An error occurred. Please try again.");
        }
    };

    if (loading) {
        return <div className="text-center">Loading...</div>;
      }
    

    return (
        <>
            <Pageheader
                currentpage={"Projects"}
                activepage={"/project"}
                activepagename="Projects"
            />
            <div className="grid grid-cols-12 gap-x-6 p-6">
                <div className="col-span-12 flex justify-between items-center">
                    <h2 className="text-[var(--primaries)] text-xl font-semibold">Projects</h2>
                    <button
                        onClick={handleAddNewProject}
                        className="ti-btn bg-primary text-white px-4 py-2 rounded-md"
                    >
                        Add New Project
                    </button>
                </div>
                <div className="col-span-12 mt-6">
                    <div className="bg-white rounded-lg shadow-lg p-6">
                        <h3 className="text-center text-[var(--primaries)] text-lg font-semibold mb-4">
                            Project Gallery
                        </h3>
                        {projectImages.length > 0 ? (
                            <Slider 
                            dots={true}
                            infinite={true} 
                            speed={500} 
                            slidesToShow={1} 
                            slidesToScroll={1} 
                            autoplay={true} 
                            autoplaySpeed={2000}                             
                            pauseOnHover={true} 
                            arrows={false}>
                                {projectImages.map((image, index) => (
                                    <div key={index} className="p-2">
                                        <img
                                            src={image}
                                            alt={`Project ${index + 1}`}
                                            className="w-full h-[500px] rounded-md"
                                        />
                                    </div>
                                ))}
                            </Slider>
                        ) : (
                            <p className="text-center text-defaulttextcolor text-sm">No projects to display.</p>
                        )}
                    </div>
                </div>
            </div>

            {showAddCatalogueForm && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white rounded-lg shadow-lg w-full max-w-lg">
                    <div className="ti-modal-content flex flex-col h-full max-h-[80vh]">
                        <div className="ti-modal-header flex justify-between border-b p-4">
                            <h6 className="modal-title text-1rem font-semibold text-primary">
                                {projectToEdit ? "Edit Project" : "Add Project"}
                            </h6>
                            <button onClick={handleCloseModal} className="text-lg font-semibold text-defaulttextcolor">
                            <span className="sr-only">Close</span>
                                <i className="ri-close-line "></i>
                            </button>
                        </div>
                        
                        <form onSubmit={handleSubmit} className="">
                        <div className='p-4 overflow-auto flex-1'>
                            <div className=''>
                                <label
                                    htmlFor="file-upload"
                                    className="block text-sm text-defaulttextcolor font-semibold"
                                >
                                    Project Images
                                </label>
                                <input
                                    type="file"
                                    multiple
                                    id="file-upload"
                                    className="outline-none focus:outline-none focus:ring-0 no-outline focus:border-[#dadada] mt-1 block w-full p-2 border border-defaultborder rounded-md"
                                    onChange={handleFileChange}
                                />
                                {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
                            </div>

                            {/* Image Previews */}
                            <div className="grid grid-cols-3 gap-5 mt-4">
                                {fileDetails.map((file, index) => (
                                    <div key={index} className="relative group">
                                        <img
                                            src={file.url}
                                            alt={file.name}
                                            className="w-full h-32 object-contain rounded-md"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveImage(index)}
                                            className="absolute top-[-10px] right-[-10px] bg-red-600 text-primary p-1 rounded-full opacity-0 group-hover:opacity-100 transition"
                                        >
                                            <i className="ri-close-line text-primary text-lg font-bold "></i>
                                        </button>
                                    </div>
                                ))}
                            </div>
                            </div>

                            <div className="border-t border-defaultborder p-4 flex justify-end gap-2">
                                <button
                                    type="submit"
                                    className="bg-primary text-white px-4 py-2 rounded-md"
                                >
                                    Submit
                                </button>
                                <button
                                    type="button"
                                    onClick={handleCloseModal}
                                    className="bg-gray-300 px-4 py-2 rounded-md"
                                >
                                    Cancel
                                </button>
                            </div>

                        </form>
                        </div>
                    </div>
                </div>
            )}

            {showSuccessAlert && (
                <SuccessAlert
                    message="Project added successfully!"
                    showButton={false}
                />
            )}
        </>
    );
};

export default Project;
