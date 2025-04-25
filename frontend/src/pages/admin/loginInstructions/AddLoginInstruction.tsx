import { useState, useRef, useEffect } from "react";
import Pageheader from "../../../components/common/pageheader/pageheader";
import axios from "axios";
import Slider from "react-slick";
import SuccessAlert from '../../../components/ui/alerts/SuccessAlert';
import "../../../assets/css/style.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const AddLoginInstruction = () => {
  const [instructions, setInstructions] = useState([]);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const sliderRef = useRef(null);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [fileDetails, setFileDetails] = useState<{ url: string, name: string }[]>([]);
  const [instructionToEdit, setInstructionToEdit] = useState<any>(null);
  const [error, setError] = useState<string>('');
  const [imageDescription, setImageDescription] = useState('');
  const [showAddInstructionForm, setShowAddInstructionForm] = useState(false);
  const [imageAddDescription, setImageAddDescription] = useState('');



  useEffect(() => {
    document.title = 'Instructions';

    if (showSuccessAlert) {
      const timer = setTimeout(() => {
        setShowSuccessAlert(false);
        window.location.reload();
      }, 3000);
      return () => clearTimeout(timer);
    }

    const fetchInstructions = async () => {
      try {
        const response = await axios.get(
          "/api/method/reward_management.api.login_instructions.get_instructions"
        );
        if (response && response.data && response.data.message && response.data.message.instructions) {
          setInstructions(response.data.message.instructions);
        } else {
          console.error("Failed to fetch instructions or no data available.");
        }
      } catch (error) {
        console.error("Error fetching instructions:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchInstructions();
  }, [showSuccessAlert]);

  const sliderSettings = {
    dots: true,
    infinite: true,
    pauseOnHover: true,
    arrows: false,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    afterChange: (current) => setCurrentSlideIndex(current),
  };

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
    setFileDetails((prevFiles) =>
        prevFiles.filter((_, index) => index !== indexToRemove)
    );
  };

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
      if (response && response.data.message && response.data.message.file_url) {
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

      const data = {
        selected_images: uploadedFileURLs,
        selected_descriptions: [imageDescription],
      };

      const response = await axios.post('/api/method/reward_management.api.login_instructions.add_update_instructions', data, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      });

      const result = response.data;

      if (result.message && result.message.status === 'success') {
        setShowSuccessAlert(true);
        setFileDetails([]);
        setImageDescription('');
      } else {
        alert("Error updating instructions: " + (result.message.message || "Unknown error."));
      }
    } catch (error) {
      console.error("Error during file upload or API call:", error);
      alert("An error occurred. Please try again.");
    }
  };

  const handleEditGuide = (instruction: any) => {
    setInstructionToEdit(instruction);
    setImageDescription(instruction.image_description);
    setFileDetails([{ url: instruction.guide_image, name: instruction.guide_image.split('/').pop() }]);
    setShowAddInstructionForm(false);

  }

  const handleCloseModal = () => {
    setInstructionToEdit(null);
    setShowAddInstructionForm(false);
    setImageDescription('');
    setFileDetails([]);
  };

  if (loading) {
    return <div className="text-center">Loading...</div>;
  }

  const handleAddNewGuide = () => {
    
    setInstructionToEdit(null);
    setShowAddInstructionForm(true);
  };

  const handleAddSubmit = async (event) => {
    console.log("first");
    event.preventDefault(); // Prevent default form submission
    const uploadedFileURLs = [];
  
    try {
      for (const fileDetail of fileDetails) {
        const fileBlob = await fetch(fileDetail.url).then(res => res.blob());
        const file = new File([fileBlob], fileDetail.name, { type: fileBlob.type });
        const fileURL = await uploadFile(file);
        if (fileURL) {
          uploadedFileURLs.push(fileURL);
        }
      }
  
      const data = {
        new_image_url: uploadedFileURLs,
        image_description: [imageAddDescription], // assuming `imageAddDescription` is the description for images
      };
  
      const response = await axios.post('/api/method/reward_management.api.login_instructions.add_new_instruction', data, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      });
  
      const result = response.data;
  
      if (result.message && result.message.status === 'success') {
        setShowSuccessAlert(true);
        setFileDetails([]); 
        setImageDescription(''); 
      } else {
        alert("Error updating instructions: " + (result.message.message || "Unknown error."));
      }
    } catch (error) {
      console.error("Error during file upload or API call:", error);
      alert("An error occurred. Please try again.");
    }
  };
  
  return (
    <>
      <Pageheader
        currentpage={"Login Instructions"}
        activepage={"/add-login-instructions"}
        activepagename="Login Instructions"
      />

      <div className="grid grid-cols-12 gap-x-6 p-6">
        {/* <div className="col-span-12 flex justify-between items-center">
          <h2 className="text-[var(--primaries)] text-xl font-semibold">Instructions</h2>
        </div> */}

        <div className="col-span-12 mt-6">
          <div className="bg-white rounded-lg shadow-lg p-6 ">
            <div className="col-span-12 flex justify-between items-center">
            <h3 className="text-center text-[var(--primaries)] text-lg font-semibold mb-4">
              Instructions Gallery
            </h3>
            <button
            onClick={handleAddNewGuide}
            className="ti-btn !py-1 !px-2 text-xs text-white !font-medium bg-[var(--primaries)] hover:bg-primary/20 hover:text-black"
          >
            Add New Instructions
          </button>
          </div>

            <div className="relative pb-10 p-10 mx-auto">
              <Slider {...sliderSettings} ref={sliderRef}>
                {instructions.map((instruction, index) => (
                  <div key={index} className={index === 0 ? "first-slide" : ""}>
                    <div className="pt-5 text-sm text-defaulttextcolor flex justify-end pb-5 mx-[10px] ">
                      <button onClick={() => handleEditGuide(instruction)} className="ti-btn !py-1 !px-2 text-xs text-white !font-medium bg-[var(--primaries)] hover:bg-primary/20 hover:text-black">Edit</button>
                    </div>
                    <img
                      src={`${window.origin}${instruction.guide_image}`}
                      alt={`Guide ${index + 1}`}
                      className="w-full h-[500px] rounded-md object-cover"
                    />
                    <div className="pt-5">
                      <p className="text-center mt-4">{instruction.image_description}</p>
                    </div>
                  </div>
                ))}
              </Slider>
            </div>
          </div>
        </div>
      </div>

      {showAddInstructionForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-lg  w-full max-w-lg">
            <div className="flex justify-between items-center border-b border-defaultborder pb-2 p-4">
              <h6 className="text-primary font-semibold">
                Add Instructions
              </h6>
              <button onClick={handleCloseModal} className="text-defaulttextcolor">
                <i className="ri-close-line text-2xl"></i>
              </button>
            </div>
            <form onSubmit={handleAddSubmit} className="mt-4">
              <div className="p-4">
              <div className="">
                <label htmlFor="file-upload" className="outline-none focus:outline-none focus:ring-0 no-outline focus:border-[#dadada] block text-sm text-defaulttextcolor font-semibold">
                  Instruction Images
                </label>
                <input
                  type="file"
                  multiple
                  id="file-upload"
                  className="mt-1 block w-full p-2 border border-[#dadada] rounded-md"
                  onChange={handleFileChange}
                />
                {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
              </div>

              <div className="grid grid-cols-3 gap-5 mt-4">
                {fileDetails.map((file, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={file.url}
                      alt={file.name}
                      className="w-full h-28 object-contain rounded-lg"
                    />
                    <button
                      onClick={() => handleRemoveImage(index)}
                      className="absolute top-[-10px] right-[-10px] bg-red-600 text-primary p-1 rounded-full opacity-0 group-hover:opacity-100 transition"
                    >
                       <i className="ri-close-line text-primary text-lg font-bold "></i>
                    </button>
                  </div>
                ))}
              </div>

              <div className="mt-4">
                <label
                  htmlFor="image-description"
                  className="block text-sm text-defaulttextcolor font-semibold"
                >
                  Image Description
                </label>
                <textarea
                  id="image-description"
                  className="outline-none focus:outline-none focus:ring-0 no-outline focus:border-[#dadada] mt-1 p-2 w-full border border-[#dadada] rounded-md"
                  value={imageAddDescription}
                  onChange={(e) => setImageAddDescription(e.target.value)}
                />
              </div>
              </div>

              <div className="mt-4 flex justify-end gap-2 border-t border-defaultborder p-4">
                <button
                  type="submit"
                  className="bg-primary text-white px-6 py-2 rounded-md"
                >
                  Add Instruction
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
      )}


      {instructionToEdit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-lg">
            <div className="flex justify-between items-center border-b pb-2 p-4">
              <h6 className="text-primary font-semibold">
                Edit Instructions
              </h6>
              <button onClick={handleCloseModal} className="text-defaulttextcolor">
                <i className="ri-close-line text-2xl"></i>
              </button>
            </div>
            <form onSubmit={handleSubmit} className="mt-4">
              <div className="p-4">
              <div>
                <label htmlFor="file-upload" className="block text-sm text-defaulttextcolor font-semibold">
                  Instruction Images
                </label>
                <input
                  type="file"
                  multiple
                  id="file-upload"
                  className="outline-none focus:outline-none focus:ring-0 no-outline focus:border-[#dadada] mt-1 block w-full p-2 border border-[#dadada] rounded-md"
                  onChange={handleFileChange}
                />
                {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
              </div>

              <div className="grid grid-cols-3 gap-5 mt-4">
                {fileDetails.map((file, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={file.url}
                      alt={file.name}
                      className="w-full h-28 object-contain rounded-lg"
                    />
                    <button
                      onClick={() => handleRemoveImage(index)}
                      className="absolute top-[-10px] right-[-10px] bg-red-600 text-primary p-1 rounded-full opacity-0 group-hover:opacity-100 transition"
                    >
                       <i className="ri-close-line text-primary text-lg font-bold "></i>
                    </button>
                  </div>
                ))}
              </div>

              <div className="mt-4">
                <label
                  htmlFor="image-description"
                  className="block text-sm text-defaulttextcolor font-semibold"
                >
                  Image Description
                </label>
                <textarea
                  id="image-description"
                  className="outline-none focus:outline-none focus:ring-0 no-outline focus:border-[#dadada] mt-1 p-2 w-full border border-[#dadada] rounded-md"
                  value={imageDescription}
                  onChange={(e) => setImageDescription(e.target.value)}
                />
              </div>
              </div>

              <div className="mt-4 flex justify-end gap-2 border-t border-defaultborder p-4">
                <button
                  type="submit"
                  className="bg-primary text-white px-6 py-2 rounded-md"
                >
                  Update Instruction
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
      )}

      {showSuccessAlert && <SuccessAlert 
      message={""} 
      onClose={function (): void {
        throw new Error("Function not implemented.");
      } } 
      onCancel={function (): void {
        throw new Error("Function not implemented.");
      } } />}
    </>
  );
};


export default AddLoginInstruction;
