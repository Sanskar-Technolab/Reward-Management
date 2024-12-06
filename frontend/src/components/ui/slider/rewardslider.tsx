import { useRef } from 'react';
import Slider from 'react-slick'; 
// import 'slick-carousel/slick/slick.css';
// import 'slick-carousel/slick/slick-theme.css';

const SliderCard = ({
    slides = [],
    sliderSettings = {},
    containerClass = '',
    dotStyles = {},
    slideTextClass = '',
}) => {
    const sliderRef = useRef(null);

    // Default slider settings
    const defaultSettings = {
        slidesToShow: 1,
        slidesToScroll: 1,
        infinite: true,
        arrows: false,
        dots: true,
        appendDots: dots => (
            <div style={{ marginTop: '1px', ...dotStyles }}>
                <ul> {dots} </ul>
            </div>
        ),
        customPaging: _i => <button className="slick-dot"></button>,
        ...sliderSettings,
    };

    return (
        <section
            className={`relative pb-10 p-4 lg:max-w-[450px] md:max-w-[400px] sm:max-w-[350px] max-w-[250px] mx-auto ${containerClass}`}
        >
            {/* React-Slick Slider */}
            <Slider
                ref={sliderRef}
                {...defaultSettings}
                className="custom-slider" 
            >
                {slides.map((slide, index) => (
                    <div
                        key={index}
                        className="slide-item px-3" 
                    >
                        <div className="slide-wrap flex flex-col items-center text-center">
                            {/* Image */}
                            <img
                                src={slide.image}
                                alt={`Slider ${index + 1}`}
                                className="w-full max-h-64 object-cover rounded-[10px]"
                            />
                            {/* Description */}
                            <div className="text-center mt-4 px-4 ">
                                <p
                                    className={`slide-text text-defaultsize text-black ${slideTextClass}`}
                                >
                                    {slide.description}
                                </p>
                            </div>
                        </div>
                    </div>
                ))}
            </Slider>
        </section>
    );
};

export default SliderCard;
