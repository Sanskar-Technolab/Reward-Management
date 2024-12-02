import React, { useRef } from 'react';
import Slider from 'react-slick'; // Import react-slick carousel
import sliderimage from '../../../assets/images/reward_management/slider.png'; // Import the slider image
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';


const SliderCard = () => {
    const sliderRef = useRef(null); // Create a reference to control the slider
  

    // Slider settings
    const sliderSettings = {
        slidesToShow: 1,
        slidesToScroll: 1,
        infinite: true, // Enable infinite scrolling
        arrows: false, // Remove default arrows
        dots: true, // Enable default dots
        appendDots: dots => (
            <div style={{ marginTop: '20px' }}> {/* Adjust margin to move dots below paragraph */}
                <ul> {dots} </ul>
            </div>
        ),
        customPaging: i => <button className="slick-dot"></button>, // Optional: Custom dot styling
    };

    return (
        <section className="relative p-4 max-w-3xl mx-auto">
            {/* React-Slick Slider */}
            <Slider ref={sliderRef} {...sliderSettings}>
                {[1, 2, 3].map((slide, index) => (
                    <div key={index} className="slide-item">
                        <div className="slide-wrap flex flex-col items-center text-center">
                            {/* Image */}
                            <img
                                src={sliderimage}
                                alt={`Slider ${index + 1}`}
                                className="w-full max-h-64 object-cover rounded-lg"
                            />
                            {/* Description */}
                            <div className="text-center mt-4 px-4">
                                <p className="slide-text text-sm text-gray-700 leading-relaxed">
                                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. 
                                    Sit sed auctor libero morbi. Proin metus est ut auctor fermentum.
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
