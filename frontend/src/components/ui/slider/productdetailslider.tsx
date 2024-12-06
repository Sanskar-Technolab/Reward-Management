import React from "react";
import Slider from "react-slick";
import sliderimage from "../../../assets/images/reward_management/Frame 5.png";
import "../../../assets/css/pages/productdetailslider.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

function ImageSlider({ images }) {
  const settings = {
    dots: true,
    infinite: true,
    speed: 3000,
    slidesToShow: 1,
    slidesToScroll: 1,
    lazyLoad: true,
    arrows: false,
    centerMode: true, 
    focusOnSelect: true,
    autoplay: true,
    autoplaySpeed: 2000,
  };

  return (
    <div className="relative pt-4 mx-auto">
      <Slider {...settings}>
        {images.map((image, index) => (
          <div key={index} className="px-2"> 
            <img
              src={image}
              alt={`Slider ${index + 1}`}
              className=" w-full lg:h-[400px] md:h-[300px] sm:h-[200px] object-cover"
            />
          </div>
        ))}
      </Slider>
    </div>
  );
}

const SlideChangeProject = () => {
  const images = [
    sliderimage,
    "https://via.placeholder.com/800x400?text=Image+2",
    "https://via.placeholder.com/800x400?text=Image+3",
  ];

  return (
    <div>
      <ImageSlider images={images} />
    </div>
  );
};

export default SlideChangeProject;

// import React, { useRef } from 'react';
// import Slider from "react-slick";
// import "../../../assets/css/pages/productdetailslider.css";
// import "slick-carousel/slick/slick.css";
// import "slick-carousel/slick/slick-theme.css";

// const ProjectSlider = ({ slides, sliderSettings = {}, containerClass = '', dotStyles = {} }) => {
//   const sliderRef = useRef(null);

//   // Default slider settings
//   const defaultSettings = {
//       slidesToShow: 1,
//       slidesToScroll: 1,
//       infinite: true,
//       arrows: false,
//       dots: true,
//       appendDots: dots => (
//         <div style={{ marginTop: '10px', ...dotStyles }}>
//             <ul> {dots} </ul>
//         </div>
//     ),
//     customPaging: _i => <button className="slick-dot"></button>,
//     ...sliderSettings,
//   };

//   return (
//       <section className={`relative pb-10 p-4 mx-auto ${containerClass}`}>
//           {/* React-Slick Slider */}
//           <Slider ref={sliderRef} {...defaultSettings} className="custom-slider">
//               {slides.map((slide, index) => (
//                   <div key={index} className="slide-item px-3">
//                       <div className="slide-wrap flex flex-col items-center text-center">
//                           <img src={slide.image} alt={`Slider ${index + 1}`} className="w-full max-h-64 object-cover rounded-[10px]" />
//                       </div>
//                   </div>
//               ))}
//           </Slider>
//       </section>
//   );
// };

// export default ProjectSlider;
