import '../../../assets/css/header.css';
import '../../../assets/css/style.css';
import Pageheader from '../../../components/common/pageheader/pageheader';
import ProjectSlider from "../../../components/ui/slider/productdetailslider";
import RewardImage from '../../../assets/images/reward_management/Frame.png';
import {
  
    Button,
  } from "@material-tailwind/react";

const ProductDetails = () => {
    return (
        <>
  <Pageheader 
                currentpage={"Product Details"} 
                activepage={"/products-details"} 
                mainpage={"/gift-products"} 
                activepagename='Products' 
                mainpagename='Product Details' 
            />
             <div className="grid grid-cols-12 gap-x-6 pb-10">
             <div className="xxl:col-span-12 xl:col-span-12 lg:col-span-12 col-span-12">
             <ProjectSlider /> 
             <div className='mt-5'>
             <div>
                    <p className="font-semibold text-[1.125rem] text-black dark:text-defaulttextcolor/70 ">
                    iPhone 16 (128GB)
                    </p>
                    <p className='text-defaultsize text-defaulttextcolor'>
                    Lorem ipsum dolor sit amet consectetur. Sit sed auctor libero morbi. Consectetur proin metus est ut auctor fermentum. 

                    </p>
                  </div>
                  <div className='mt-5'>
                  <p className="font-semibold text-[16px] text-black dark:text-defaulttextcolor/70 ">
                  Specification
                    </p>
                    <ul className='text-defaultsize text-defaulttextcolor list-disc pl-5 '>
                        <li>Lorem ipsum dolor sit amet consectetur.</li>
                        <li>Lorem ipsum dolor sit amet consectetur.</li>
                        <li>Lorem ipsum dolor sit amet consectetur.</li>
                        <li>Lorem ipsum dolor sit amet consectetur.</li>
                        <li>Lorem ipsum dolor sit amet consectetur.</li>
                        <li>Lorem ipsum dolor sit amet consectetur.</li>

                    </ul>

                  </div>
                  <div>
                    <p className="font-semibold text-[16px] text-black dark:text-defaulttextcolor/70 mt-5 ">
                    Details
                    </p>
                    <p className='text-defaultsize text-defaulttextcolor'>
                    Lorem ipsum dolor sit amet consectetur. Sit sed auctor libero morbi. Consectetur proin metus est ut auctor fermentum. 

                    </p>
                  </div>

                  <div className='flex mt-5 justify-between '>
                    <div className='flex justify-items-center items-center'>
                    <img
                src={RewardImage}
                className="mr-2 h-5 w-5"
                alt="reward-icon"
              />
               <p className='text-[25.9px] text-black'>5,500</p>
                    </div>
                    <Button
              className="border border-gray-500 rounded-[5px] text-white bg-black py-1 px-16 text-[14px] font-normal normal-case"
              
            >
              Redeem Now
            </Button>
                  </div>
             </div>
                </div>
                </div>

        </>)


}
export default ProductDetails;
