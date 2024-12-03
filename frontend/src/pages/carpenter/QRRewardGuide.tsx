import { useState, useEffect, Fragment } from "react";
import { Button, Card } from "@radix-ui/themes";
import { useNavigate } from 'react-router-dom';


import axios from "axios";
import SliderCard from "../../components/ui/slider/rewardslider"; // Import the new SliderCard component
import "../../assets/css/style.css";
import "../../assets/css/pages/qrrewardguide.css";

const MySwiper = () => {
  const [logo, setLogo] = useState(null);
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
            <Card className="p-0 box-shadow-md  border-defaultborder shadow-md rounded-[10px] bg-white">
              <div className="flex justify-center mb-8 bg-[#D9D9D9] p-8">
                <img src={logo} alt="logo" className="w-20" />
              </div>
              {/* Slider section */}
              <SliderCard /> {/* Use the SliderCard component here */}
              {/* Bottom Navigation Buttons */}
              <div className="flex justify-between mt-4 bg-[#D9D9D9] p-8 ">
                <Button
                  className="text-black p-0 bg-transparent underline"
                  onClick={() => navigate("/home")}
                >
                  Skip
                </Button>
                <Button
                  className="text-black p-0 bg-transparent underline"
                  onClick={() => navigate("/home")}
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

export default MySwiper;
