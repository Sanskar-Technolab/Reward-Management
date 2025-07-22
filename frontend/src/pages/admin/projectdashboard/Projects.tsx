import '../../../assets/css/style.css';
import '../../../assets/css/pages/admindashboard.css';
import Pageheader from '../../../components/common/pageheader/pageheader';
import React, { useState, useEffect } from "react";
import SuccessAlert from '../../../components/ui/alerts/SuccessAlert';
import axios from 'axios';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import DangerAlert from '../../../components/ui/alerts/DangerAlert';
import { Notyf } from 'notyf';
import 'notyf/notyf.min.css';

const Project: React.FC = () => {
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [projectImages, setProjectImages] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [showAddCatalogueForm, setShowAddCatalogueForm] = useState(false);
  const [fileDetails, setFileDetails] = useState<{ url: string, name: string }[]>([]);
  // const [projectToEdit, setProjectToEdit] = useState<any>(null);
  const [error, setError] = useState<string>('');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isConfirmDeleteModalOpen, setIsConfirmDeleteModalOpen] = useState(false);
  const [deleteMessage, setDeleteMessage] = useState('');
  const [imageToDelete, setImageToDelete] = useState<string | null>(null);
  const [selectedImageName, setSelectedImageName] = useState<string | null>(null);
  const [newImageUrl, setNewImageUrl] = useState<string>('');

  const [deleteType, setDeleteType] = useState<'image' | 'project' | null>(null);
  const [showAddNewSliderModal, setShowAddNewSliderModal] = useState(false);


  const notyf = new Notyf({
    position: {
      x: 'right',
      y: 'top',
    },
    duration: 3000,
  });



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
    // setProjectToEdit(null);
    setShowAddCatalogueForm(true);
  };

  useEffect(() => {
    const fetchInstructions = async () => {
      try {
        const response = await axios.get("/api/method/reward_management.api.project.get_project");
        if (response && response.data?.message?.images) {
          setProjectImages(response.data.message.images);
        }
      } catch (error) {
        console.error("Error fetching project images:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchInstructions();
  }, []);

  // handle close modal

  const handleCloseModal = () => {
    setShowAddCatalogueForm(false);
    setIsEditModalOpen(false);
    // setProjectToEdit(null);
    setFileDetails([]);
    setNewImageUrl('');
    setSelectedImageName(null);
    setShowAddNewSliderModal(false);

  };

  // handle file change
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const fileArray = Array.from(files);
      if (fileArray.length + fileDetails.length > 10) {
        setError('You can only select up to 10 images!');
        return;
      } else {
        setError('');
      }

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

  const handleRemoveImage = (indexToRemove: number) => {
    setFileDetails((prevFiles) => prevFiles.filter((_, index) => index !== indexToRemove));
  };

  // for uploading file
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
      if (response.data.message?.file_url) {
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
  //  add new project slider-------
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (fileDetails.length < 2) {
      notyf.error("Please upload at least 2 project images.");
      return;
    }
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

      const response = await axios.post('/api/method/reward_management.api.project.add_project', {
        new_image_url: uploadedFileURLs,
      });

      const result = response.data;
      if (result.message?.status === 'success') {
        setShowSuccessAlert(true);
        setAlertMessage('Project added successfully!');

        setFileDetails([]);
        setShowAddCatalogueForm(false);
      } else {
        alert("Error updating project images: " + (result.message.message || "Unknown error."));
      }
    } catch (error) {
      console.error("Error during file upload or API call:", error);
      alert("An error occurred. Please try again.");
    }
  };


  // edit selected slider image-------
  const handleEditImage = (index: number) => {
    setSelectedImageName(projectImages[index]);
    setIsEditModalOpen(true);
  };


  const handleSelectedSlider = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // if (!selectedImageName || !newImageUrl) {
      //   notyf.error("Please select an image to upload.");
      //   return;
      // }


      const file = fileDetails[0];
      const fileUrl = await uploadFile(new File([await fetch(file.url).then(res => res.blob())], file.name, { type: "image/*" }));

      // Now call your API with file URL
      const updateRes = await axios.post('/api/method/reward_management.api.project.update_selected_project_image', {
        image_name: selectedImageName,
        new_image_url: fileUrl,
      });
      if (updateRes) {
        console.log("Response:", updateRes.data);
      }

      if (updateRes.data.message.status === 'success') {
        // notyf.success("Image updated successfully!");
        setShowSuccessAlert(true);
        setAlertMessage('Image update successfully!');
        setIsEditModalOpen(false);
        setFileDetails([]);
        setNewImageUrl('');
      } else {
        notyf.error(updateRes.data.message || "Error updating image.");
      }
    } catch (error) {
      console.error("Error:", error);
      notyf.error("An error occurred during image update.");
    }
  };




  // delete selected slider image-----
  const handleDeleteImage = (index: number) => {
    const selectedImage = projectImages[index];
    setImageToDelete(selectedImage);
    setDeleteType('image');  // Set the delete type to 'image'
    setDeleteMessage('Are you sure you want to delete this project image?');
    setSelectedImageName(selectedImage);
    setIsConfirmDeleteModalOpen(true);
  };


  // delete project
  // handle project delete ---------
  const handleprojectdelete = () => {
    setDeleteType('project');  // Set the delete type to 'project'
    setDeleteMessage('Are you sure you want to delete this project?');
    setIsConfirmDeleteModalOpen(true);
  };

  // confirm delete
  const confirmDelete = async () => {
    if (deleteType === 'image' && imageToDelete) {
      try {
        const response = await axios.post('/api/method/reward_management.api.project.delete_project_image', {
          image_name: imageToDelete
        });

        if (response.data.message?.status === 'success') {
          setProjectImages(prev => prev.filter(img => img !== imageToDelete));
          setImageToDelete(null);
          setIsConfirmDeleteModalOpen(false);
          setShowSuccessAlert(true);
          setAlertMessage('Selected image deleted successfully!');
        } else {
          alert("Failed to delete image: " + response.data.message.message);
        }
      } catch (error) {
        console.error("Error deleting image:", error);
        alert("An error occurred while deleting the image.");
      }
    } else if (deleteType === 'project') {
      try {
        const response = await axios.post('/api/method/reward_management.api.project.delete_all_project', {
        });

        if (response.data.message?.status === 'success') {
          setIsConfirmDeleteModalOpen(false);
          setShowSuccessAlert(true);
          setAlertMessage('Project deleted successfully!');
        } else {
          alert("Failed to delete project: " + response.data.message.message);
        }
      } catch (error) {
        console.error("Error deleting project:", error);
        alert("An error occurred while deleting the project.");
      }
    }
  };



  const cancelDelete = () => {
    setImageToDelete(null);
    setIsConfirmDeleteModalOpen(false);
  };



  // handle add new slider---------------------------
  const handleAddNewSlider = () => {
    // console.log("first")
    setShowAddNewSliderModal(true);
  }

  const handleNewProjectSlider = async (event: React.FormEvent) => {
    event.preventDefault();
    // if (fileDetails.length < 1) {
    //   notyf.error("Please upload at least 1 project image.");
    //   return;
    // }
    // const uploadedFileURLs: string[] = [];
    const file = fileDetails[0];
    const fileUrl = await uploadFile(new File([await fetch(file.url).then(res => res.blob())], file.name, { type: "image/*" }));




    const response = await axios.post('/api/method/reward_management.api.project.add_new_slider', {
      image_url: fileUrl,
    });

    const result = response.data;
    if (result.message?.status === 'success') {
      setShowSuccessAlert(true);
      setAlertMessage('New image added successfully!');

      setFileDetails([]);
      setShowAddCatalogueForm(false);
    } else {
      alert("Error updating project images: " + (result.message.message || "Unknown error."));
    }

  };




  if (loading) {
    return <div className="text-center">Loading...</div>;
  }

  return (
    <>
      <Pageheader currentpage={"Projects"} activepage={"/project"} activepagename="" />
      <div className="grid grid-cols-12 gap-x-6 p-6">
        <div className="col-span-12 flex justify-end items-center">
          {/* <h2 className="text-[var(--primaries)] text-xl font-semibold">Projects</h2> */}
          <button
            onClick={handleAddNewProject}
            className="ti-btn !py-1 !px-2 text-xs !text-white !font-medium bg-[var(--primaries)]"
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
              projectImages.length > 1 ? (
                <Slider
                  dots={true}
                  infinite={true}
                  speed={500}
                  slidesToShow={1}
                  slidesToScroll={1}
                  autoplay={true}
                  autoplaySpeed={3000}
                  pauseOnHover={true}
                  arrows={false}
                >
                  {projectImages.map((image, index) => (
                    <div key={index} className="relative">
                      <img
                        src={image}
                        alt={`Project ${index + 1}`}
                        className="w-full h-[500px] rounded-md object-contain"
                      />
                      <div className="absolute top-2 right-2 flex gap-2">
                        <button
                          onClick={() => handleEditImage(index)}
                          className=" text-white  hover:text-black"
                        >
                          <i className="ri-edit-line text-md w-8 h-8 p-2 bg-primary rounded-full hover:bg-primary/20 "></i>
                        </button>
                        <button
                          onClick={() => handleDeleteImage(index)}
                          className="text-white  hover:text-black "
                        >
                          <i className="ri-delete-bin-line text-md w-8 h-8 p-2 bg-primary rounded-full hover:bg-primary/20"></i>
                        </button>
                      </div>
                    </div>
                  ))}
                </Slider>
              ) : (
                <div className="relative">
                  <img
                    src={projectImages[0]}
                    alt="Project"
                    className="w-full h-[500px] rounded-md object-contain"
                  />
                  <div className="absolute top-2 right-2 flex gap-2">
                    <button
                      onClick={() => handleEditImage(0)}
                      className=" text-white  hover:text-black"
                    >
                      <i className="ri-edit-line text-md w-8 h-8 p-2 bg-primary rounded-full hover:bg-primary/20 "></i>
                    </button>
                    <button
                      onClick={() => handleDeleteImage(0)}
                      className="text-white  hover:text-black "
                    >
                      <i className="ri-delete-bin-line text-md w-8 h-8 p-2 bg-primary rounded-full hover:bg-primary/20"></i>
                    </button>
                  </div>
                </div>
              )
            ) : (
              <p className="text-center text-defaulttextcolor text-sm">No projects to display.</p>
            )}


            {/* delete slider or add new slider */}
            <div className="flex justify-end mt-4 gap-2">
              <button
                onClick={handleAddNewSlider}
                className="ti-btn !py-1 !px-2 text-xs text-white !font-medium bg-[var(--primaries)]"
              >  <i className="ri-add-fill  font-bold "></i>
                Add New Slider
              </button>
              <button
                onClick={() => handleprojectdelete()}
                className="ti-btn !py-1 !px-2 text-xs text-white !font-medium bg-[var(--primaries)]"
              >
                <i className="ri-delete-bin-line font-bold"></i>
                Delete Project
              </button>

            </div>
          </div>

        </div>
      </div>
      {/*add new peoject-----  */}
      {showAddCatalogueForm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-lg">
            <div className="ti-modal-content flex flex-col h-full max-h-[80vh]">
              <div className="ti-modal-header flex justify-between border-b p-4">
                <h6 className="modal-title text-1rem font-semibold text-primary">
                  Add New Project
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
                      accept="image/*"
                      multiple
                      id="file-upload"
                      className="outline-none focus:outline-none focus:ring-0 no-outline focus:border-[#dadada] mt-1 block w-full p-2 border border-defaultborder rounded-md"
                      onChange={handleFileChange}
                      required
                      onInvalid={(e) => (e.target as HTMLInputElement).setCustomValidity("Please upload at least 2 images.")}
                      onInput={(e) => (e.target as HTMLInputElement).setCustomValidity("")}
                      disabled={fileDetails.length >= 10}
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

      {/* edit selected slider */}
      {isEditModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-lg">
            <div className="ti-modal-content flex flex-col h-full max-h-[80vh]">
              <div className="ti-modal-header flex justify-between border-b p-4">
                <h6 className="modal-title text-1rem font-semibold text-primary">
                  Edit Project Image
                </h6>
                <button onClick={handleCloseModal} className="text-lg font-semibold text-defaulttextcolor">
                  <span className="sr-only">Close</span>
                  <i className="ri-close-line "></i>
                </button>
              </div>

              <form onSubmit={handleSelectedSlider} className="">
                <div className="p-4 overflow-auto flex-1">
                  <label
                    htmlFor="file-upload"
                    className="block text-sm text-defaulttextcolor font-semibold"
                  >
                    Project Image
                  </label>
                  <input
                    type="file"
                    id="file-upload"
                    className="outline-none focus:outline-none focus:ring-0 mt-1 block w-full p-2 border border-defaultborder rounded-md"
                    accept="image/*"
                    required
                    onInvalid={(e) => (e.target as HTMLInputElement).setCustomValidity("Please upload an image.")}
                    onInput={(e) => (e.target as HTMLInputElement).setCustomValidity("")}
                    onChange={(e) => {
                      const file = e.target.files?.[0];


                      if (file) {

                        // Validate MIME type to check if it's an image
                        if (!file.type.startsWith('image/')) {
                          notyf.error("Only image files are allowed.");
                          e.target.value = '';
                          return;
                        }
                        const reader = new FileReader();
                        reader.onload = (event) => {
                          const url = event.target?.result as string;
                          setFileDetails([{ url, name: file.name }]);
                          setNewImageUrl(url);
                        };
                        reader.readAsDataURL(file);
                        setError('');
                      } else {
                        setFileDetails([]);
                      }
                    }}
                  />
                  {error && <p className="text-red-500 text-sm mt-1">{error}</p>}

                  {/* Image Preview */}
                  {fileDetails.length > 0 && (
                    <div className="grid grid-cols-1 gap-5 mt-4">
                      <div className="relative group">
                        <img
                          src={fileDetails[0].url}
                          alt={fileDetails[0].name}
                          className="w-full h-32 object-contain rounded-md"
                        />
                        <button
                          type="button"
                          onClick={() => setFileDetails([])}
                          className="absolute top-[-10px] right-[-10px] bg-red-600 text-primary p-1 rounded-full opacity-100 transition"
                        >
                          <i className="ri-close-line text-primary text-lg font-bold "></i>
                        </button>
                      </div>
                    </div>
                  )}
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

      {/* handle add new slider---- */}
      {showAddNewSliderModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-lg">
            <div className="ti-modal-content flex flex-col h-full max-h-[80vh]">
              <div className="ti-modal-header flex justify-between border-b p-4">
                <h6 className="modal-title text-1rem font-semibold text-primary">
                  Add New Project Image
                </h6>
                <button onClick={handleCloseModal} className="text-lg font-semibold text-defaulttextcolor">
                  <span className="sr-only">Close</span>
                  <i className="ri-close-line "></i>
                </button>
              </div>

              <form onSubmit={handleNewProjectSlider} className="">
                <div className="p-4 overflow-auto flex-1">
                  <label
                    htmlFor="file-upload"
                    className="block text-sm text-defaulttextcolor font-semibold"
                  >
                    Project Image
                  </label>
                  <input
                    type="file"
                    id="file-upload"
                    className="outline-none focus:outline-none focus:ring-0 mt-1 block w-full p-2 border border-defaultborder rounded-md"
                    accept="image/*"
                    required
                    onInvalid={(e) => (e.target as HTMLInputElement).setCustomValidity("Please upload an image.")}
                    onInput={(e) => (e.target as HTMLInputElement).setCustomValidity("")}
                    onChange={(e) => {
                      const file = e.target.files?.[0];


                      if (file) {

                        // Validate MIME type to check if it's an image
                        if (!file.type.startsWith('image/')) {
                          notyf.error("Only image files are allowed.");
                          e.target.value = '';
                          return;
                        }
                        const reader = new FileReader();
                        reader.onload = (event) => {
                          const url = event.target?.result as string;
                          setFileDetails([{ url, name: file.name }]);
                          setNewImageUrl(url);
                        };
                        reader.readAsDataURL(file);
                        setError('');
                      } else {
                        setFileDetails([]);
                      }
                    }}
                  />
                  {error && <p className="text-red-500 text-sm mt-1">{error}</p>}

                  {/* Image Preview */}
                  {fileDetails.length > 0 && (
                    <div className="grid grid-cols-1 gap-5 mt-4">
                      <div className="relative group">
                        <img
                          src={fileDetails[0].url}
                          alt={fileDetails[0].name}
                          className="w-full h-32 object-contain rounded-md"
                        />
                        <button
                          type="button"
                          onClick={() => setFileDetails([])}
                          className="absolute top-[-10px] right-[-10px] bg-red-600 text-primary p-1 rounded-full opacity-100 transition"
                        >
                          <i className="ri-close-line text-primary text-lg font-bold "></i>
                        </button>
                      </div>
                    </div>
                  )}
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
          message={alertMessage}
          showButton={false}
        />
      )}

      {isConfirmDeleteModalOpen && (
        <DangerAlert
          type="danger"
          message={deleteMessage}
          onDismiss={cancelDelete}
          onConfirm={confirmDelete}
          cancelText="Cancel"
          confirmText="Continue"
        />
      )}
    </>
  );
};

export default Project;
