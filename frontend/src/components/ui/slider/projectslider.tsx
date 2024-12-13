import Slider from "react-slick";
import sliderimage from "../../../assets/images/reward_management/Frame 5.png";
import "../../../assets/css/pages/projectslider.css";
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
    // centerMode: true, 
    // focusOnSelect: true,
    autoplay: true,
    autoplaySpeed: 2000,
  };

  return (
    <div className="relative  mx-auto pb-4 mb-4">
      <Slider {...settings}>
        {images.map((image, index) => (
          <div key={index} className="px-2"> 
            <img
              src={image}
              alt={`Slider ${index + 1}`}
              className=" w-full lg:h-[450px] md:h[300px] sm:h-[200px] object-cover"
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
    sliderimage,
    sliderimage,
  ];

  return (
    <div>
      <ImageSlider images={images} />
    </div>
  );
};

export default SlideChangeProject;
