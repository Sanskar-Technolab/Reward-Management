import "../../assets/css/header.css";
import "../../assets/css/style.css";
import { useState, useEffect } from "react";
import Location from '../../assets/images/reward_management/Frame (1).png';
import Contact from '../../assets/images/reward_management/Frame (3).png';
import Website from '../../assets/images/reward_management/Frame (4).png';
import Email from '../../assets/images/reward_management/Frame (2).png';
import axios from "axios";
const ContactUs = () => {
  const [logo, setLogo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [companyDetails, setCompanyDetails] = useState({
    address: "",
    email: "",
    website: "",
    contacts: [],
    about_company : "",
  });
  useEffect(() => {

    const fetchAddress = async () => {
      try {
        const response = await axios.get(
          "/api/method/reward_management.api.company_address.get_company_address"
        );
        if(response){
          console.log("address data",response);
        }
        if (response && response.data && response.data.message) {
          const { address, email, website, mobile_numbers ,about_company} = response.data.message;
          setCompanyDetails({
            address: address || "",
            email: email || "",
            website: website || "",
            contacts: mobile_numbers || [],
            about_company : about_company || "",
          });
        }
      } catch (error) {
        console.error("Error fetching company address:", error);
      }
    };
    const fetchWebsiteSettings = async () => {
      try {
        const response = await axios.get(
          "/api/method/reward_management.api.website_settings.get_website_settings"
        );
        // console.log('API Image Response:', response.data);

        // Check if the response is successful and contains the expected structure
        if (
          response &&
          response.data &&
          response.data.message &&
          response.data.message.status === "success"
        ) {
          const { banner_image } = response.data.message.data;

          // If banner_image exists, set it as the logo
          if (banner_image) {
            const fullBannerImageURL = `${window.origin}${banner_image}`;
            setLogo(fullBannerImageURL);
            // console.log('Banner Image Set:', fullBannerImageURL);
          } else {
            // console.log('No banner_image found, using default logo.');
            setLogo("/assets/frappe/images/frappe-framework-logo.svg");
          }
        } else {
          // console.error('API response was not successful:', response.data.message);
          setLogo("/assets/frappe/images/frappe-framework-logo.svg");
        }
      } catch (error) {
        console.error("Error fetching website settings:", error);
        setLogo("/assets/frappe/images/frappe-framework-logo.svg");
      } finally {
        setLoading(false);
      }
    };
    fetchAddress();
    fetchWebsiteSettings();
  }, []);
  if (loading) {
    return <div></div>; // Show loading message or spinner while fetching
  }
  return (
    <>
      <div className="">
        <div className="flex justify-center mb-8 mt-20">
          {/* <img src={desktoplogo} alt="logo" className="w-28" /> */}
          <img src={logo} alt="logo" className="" />
        </div>
        <div className=" flex justify-center">
            <p className="w-[500px] max-w-[500px] text-defaultsize text-black text-center">{companyDetails.about_company} </p>
        </div>
        <div className="flex justify-center  mt-12">
            <div className=" w-[500px] bg-[#F0F0F0]  border border-defaultborder rounded-[15px] shadow-md p-5">
                {/* location--- */}
                <div className="flex mt-2">
                <div className="mr-3"><img src={Location} alt="" /></div>
                <div className="text-black text-md">Location</div>
                </div>
                <div className="pl-8 text-defaultsize text-defaulttextcolor mt-2 max-w-[350px]">
                    {/* <p>Lorem ipsum dolor sit amet consectetur. - 365601</p> */}
                    <p>{companyDetails.address}</p>
                </div>
                <div className="my-3 mx-5">
                    <hr className=" border border-[#BBB7B766]"/>
                </div>
                {/* email------ */}
                <div className="flex mt-5">
                <div className="mr-3"><img src={Email} alt="" /></div>
                <div className="text-black text-md">Email</div>
                </div>
                <div className="pl-8 text-defaultsize text-defaulttextcolor mt-2 max-w-[350px]">
                    {/* <p>Info@Dekaa.com</p> */}
                    <p>{companyDetails.email}</p>
                </div>
                <div className="my-3 mx-5">
                    <hr className=" border border-[#BBB7B766]"/>
                </div>
                {/* Contact----- */}
                <div className="flex mt-5">
                <div className="mr-3"><img src={Contact} alt="" /></div>
                <div className="text-black text-md">Contact</div>
                </div>
                <div className="pl-8 text-defaultsize text-defaulttextcolor mt-2 max-w-[350px]">
                    {/* <p>+91 98765 43210</p>
                    <p>+91 98765 43210</p> */}
                     {companyDetails.contacts.length > 0 ? (
              companyDetails.contacts.map((contact, index) => (
                <p key={index}>{contact}</p>
              ))
            ) : (
              <p>No contact numbers available</p>
            )}
                </div>
                <div className="my-3 mx-5">
                    <hr className=" border border-[#BBB7B766]"/>
                </div>
                {/* Websites------- */}
                <div className="flex mt-5 ">
                <div className="mr-3"><img src={Website} alt="" /></div>
                <div className="text-black text-md">Website</div>
                </div>
                <div className="pl-8 text-defaultsize text-defaulttextcolor mt-2 max-w-[350px] mb-2">
                    {/* <p>www.dekaa.com</p> */}
                    <p>{companyDetails.website}</p>
                </div>
               
                
            </div>

        </div>
      </div>
    </>
  );
};
export default ContactUs;
