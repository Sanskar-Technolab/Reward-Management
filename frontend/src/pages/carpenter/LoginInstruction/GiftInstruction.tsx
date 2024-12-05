import { useState, useEffect, Fragment } from "react";
import { Button, Card } from "@radix-ui/themes";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import SliderCard from "../../../components/ui/slider/rewardslider"; // Import the SliderCard component
import "../../../assets/css/style.css";
import "../../../assets/css/pages/qrrewardguide.css";
import SlideImage1 from "../../../assets/images/reward_management/Group 3.png";
import SlideImage2 from "../../../assets/images/reward_management/Group 4.png";
import SlideImage3 from "../../../assets/images/reward_management/Group 62.png";


const GiftInstruction = () => {
  const [logo, setLogo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [slides, setSlides] = useState([]); // Add state for slides
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

          // Example slides
          const slidesData = [
            {
              image: SlideImage1,
              description: "Lorem ipsum dolor sit amet consectetur. Sit sed auctor libero morbi. Consectetur proin metus est ut auctor fermentum. Lorem ipsum dolor sit amet consectetur. Sit sed auctor libero morbi. Consectetur proin metus est ut auctor fermentum.",
            },
            {
              image: SlideImage2,
              description: "Lorem ipsum dolor sit amet consectetur. Sit sed auctor libero morbi. Consectetur proin metus est ut auctor fermentum. Lorem ipsum dolor sit amet consectetur. Sit sed auctor libero morbi. Consectetur proin metus est ut auctor fermentum.",
            },
            {
              image: SlideImage3,
              description: "Lorem ipsum dolor sit amet consectetur. Sit sed auctor libero morbi. Consectetur proin metus est ut auctor fermentum. Lorem ipsum dolor sit amet consectetur. Sit sed auctor libero morbi. Consectetur proin metus est ut auctor fermentum.",
            },
          ];
          setSlides(slidesData);
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

  // Show a loading message or spinner while fetching data
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
              <div className="flex justify-center mb-8 bg-[#D9D9D9] p-8 border border-b-[#B3B3B3]">
                <img src={logo} alt="logo" className="w-20" />
              </div>
              {/* Slider section */}
              <SliderCard
                slides={slides} // Pass slides data
                sliderSettings={{
                  dots: true,
                  infinite: true,
                  slidesToShow: 1,
                  slidesToScroll: 1,
                }} // Optional: Custom slider settings
              />
              {/* Bottom Navigation Buttons */}
              <div className="flex justify-between mt-4 bg-[#D9D9D9] border border-t-[#B3B3B3] p-8">
                <Button
                  className="text-black p-0 bg-transparent underline"
                  onClick={() => navigate("/home")}
                >
                  Skip
                </Button>
                <Button
                  className="text-black p-0 bg-transparent underline"
                  onClick={() => navigate("/redeem-point-guide")}
                >
                  Next
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default GiftInstruction;
