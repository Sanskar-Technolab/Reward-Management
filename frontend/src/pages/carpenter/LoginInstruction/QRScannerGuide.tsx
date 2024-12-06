import { useState, useEffect, Fragment } from "react";
import { Button, Card } from "@radix-ui/themes";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import SliderCard from "../../../components/ui/slider/rewardslider"; // Import the SliderCard component
import "../../../assets/css/style.css";
import "../../../assets/css/pages/qrrewardguide.css";

const MySwiper = () => {
  const [logo, setLogo] = useState(null);
  const [instructions, setInstructions] = useState([]);
  const [currentInstructionIndex, setCurrentInstructionIndex] = useState(0); // Track current instruction
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Fetch website settings
  useEffect(() => {
    const fetchWebsiteSettings = async () => {
      try {
        const response = await axios.get(
          "/api/method/reward_management.api.website_settings.get_website_settings"
        );

        if (
          response &&
          response.data &&
          response.data.message &&
          response.data.message.status === "success"
        ) {
          const { banner_image } = response.data.message.data;

          if (banner_image) {
            const fullBannerImageURL = `${window.origin}${banner_image}`;
            setLogo(fullBannerImageURL);
          } else {
            setLogo("/assets/frappe/images/frappe-framework-logo.svg");
          }

        } else {
          setLogo("/assets/frappe/images/frappe-framework-logo.svg");
        }
      } catch (error) {
        console.error("Error fetching website settings:", error);
        setLogo("/assets/frappe/images/frappe-framework-logo.svg");
      } finally {
        setLoading(false);
      }
    };

    fetchWebsiteSettings();
  }, []);

  // Fetch guide instructions
  useEffect(() => {
    const fetchInstructions = async () => {
      try {
        const response = await axios.get(
          "/api/method/reward_management.api.login_instructions.get_instructions"
        );

        if (
          response &&
          response.data &&
          response.data.message &&
          response.data.message.status === "success"
        ) {
          // Set instructions to response data
          setInstructions(response.data.message.data);
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
  }, []);

  // Show a loading message or spinner while fetching data
  if (loading) {
    return <div>Loading...</div>;
  }

  // Handle "Skip" button click
  const handleSkip = () => {
    setCurrentInstructionIndex((prevIndex) =>
      prevIndex < instructions.length - 1 ? prevIndex + 1 : prevIndex
    );
  };

  // Get the current instruction
  const currentInstruction = instructions[currentInstructionIndex];

  // Check if it's the last instruction
  const isLastInstruction = currentInstructionIndex === instructions.length - 1;

  return (
    <Fragment>
      <div className="h-[100vh] bg-[var(--body-bg)] flex items-center justify-center text-defaultsize text-defaulttextcolor">
        <div className="grid grid-cols-12 gap-4">
          <div className="xxl:col-span-4 xl:col-span-4 lg:col-span-4 md:col-span-3 sm:col-span-2"></div>
          <div className="xxl:col-span-4 xl:col-span-4 lg:col-span-4 md:col-span-6 sm:col-span-8 col-span-12">
            <Card className="p-0 box-shadow-md border-defaultborder shadow-md rounded-[10px] bg-white">
              <div className="flex justify-center mb-16 bg-[#D9D9D9] p-8 border border-b-[#B3B3B3]">
                <img src={logo} alt="logo" className="w-20" />
              </div>

              {/* Slider Section */}
              <SliderCard
                slides={currentInstruction.guide_image.map((img) => ({
                  image: `${window.origin}${img.guide_image}`,
                  description: img.image_description,
                }))}
                sliderSettings={{
                  dots: true,
                  infinite: true,
                  slidesToShow: 1,
                  slidesToScroll: 1,
                }}
              />

              {/* Bottom Navigation Buttons */}
              <div className="flex justify-between mt-16 bg-[#D9D9D9] border border-t-[#B3B3B3] p-8">
                {!isLastInstruction && (
                  <Fragment>
                    <Button
                      className="text-black p-0 bg-transparent underline"
                      onClick={() => navigate("/")}
                    >
                      Skip
                    </Button>
                    <Button
                      className="text-black p-0 bg-transparent underline"
                      onClick={handleSkip}
                    >
                      Next
                    </Button>
                  </Fragment>
                )}
                {isLastInstruction && (
                  <div className="flex justify-center w-full">
                    <Button
                      className="text-white px-10 py-2 bg-black"
                      onClick={() => navigate("/get-started")}
                    >
                      Get Started
                    </Button>
                  </div>
                )}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default MySwiper;
