import React, { useState, useRef, useEffect, Fragment } from "react";
import { Button, Card } from "@radix-ui/themes";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Slider from "react-slick";
import "../../../assets/css/style.css";
import "../../../assets/css/pages/qrrewardguide.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const MySwiper = () => {
  const [logo, setLogo] = useState(null);
  const [instructions, setInstructions] = useState([]);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const sliderRef = useRef(null); // To access the slider instance
  const navigate = useNavigate();

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
          const fullBannerImageURL = banner_image
            ? `${window.origin}${banner_image}`
            : "/assets/frappe/images/frappe-framework-logo.svg";
          setLogo(fullBannerImageURL);
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

  const isLastInstruction = currentSlideIndex === instructions.length - 1;

  const sliderSettings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    afterChange: (current) => setCurrentSlideIndex(current),
  };

  const handleNext = () => {
    if (sliderRef.current) {
      sliderRef.current.slickNext(); // Moves to the next slide
    }
  };

  // const handlePrevious = () => {
  //   if (sliderRef.current) {
  //     sliderRef.current.slickPrev(); // Moves to the previous slide
  //   }
  // };

  if (loading) {
    return <div>Loading...</div>;
  }

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
              <div className="relative pb-10 p-10 lg:max-w-[450px] md:max-w-[400px] sm:max-w-[350px] max-w-[250px] mx-auto">
                {/* Slider Section */}
                <Slider {...sliderSettings} ref={sliderRef}>
                  {instructions.map((instruction, index) => (
                    <div key={index}>
                      <img
                        src={`${window.origin}${instruction.image}`}
                        alt={instruction.instruction_name}
                        className="w-full"
                      />
                      <p className="text-center mt-4">{instruction.description}</p>
                    </div>
                  ))}
                </Slider>
              </div>

              {/* Bottom Navigation Buttons */}
              <div className="flex justify-between mt-16 bg-[#D9D9D9] border border-t-[#B3B3B3] p-8">
                {!isLastInstruction ? (
                  <Fragment>
                    <Button
                      className="text-black p-0 bg-transparent underline"
                      onClick={() => navigate("/")}
                    >
                      Skip
                    </Button>
                    <Button
                      className="text-black px-6 py-2 bg-transparent underline"
                      onClick={handleNext}
                    >
                      Next
                    </Button>
                  </Fragment>
                ) : (
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
