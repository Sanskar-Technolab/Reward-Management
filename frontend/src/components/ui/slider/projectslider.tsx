import React from "react";
import Slider from "react-slick";
import sliderimage from "../../../assets/images/reward_management/Frame 5.png";
import "../../../assets/css/pages/projectslider.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

function ImageSlider({ images }) {
  const settings = {
    dots: true,
    infinite: true,
    speed: 1000,
    slidesToShow: 1,
    slidesToScroll: 1,
    lazyLoad: true,
    arrows: false,
    centerMode: true, // To create space between the slides
    focusOnSelect: true,
    autoplay: true,
    autoplaySpeed: 2000,
  };

  return (
    <div className="relative p-4 mx-auto">
      <Slider {...settings}>
        {images.map((image, index) => (
          <div key={index} className="px-2"> {/* Added padding for gap */}
            <img
              src={image}
              alt={`Slider ${index + 1}`}
              className="rounded-lg w-full h-[400px] object-cover"
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
