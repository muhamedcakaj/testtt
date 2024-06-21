import React from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import HpLogo from '../img/HP.jpeg'
import Alienware from '../img/Alienware-.png';
import HyperX from '../img/Lenovo.png';

const PhotoSlider = () => {
    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 3000,
    };

    return (
        <>
            <h1 className="text-3xl font-extrabold mb-4 text-gray-800">Brendet më të kërkuara</h1>
            <div className="max-w-screen-md mx-auto p-4 mb-16"> {/* Add margin bottom */}
                <Slider {...settings}>
                    <div className="text-center">

                        <img
                            src={HpLogo}
                            alt="HP Logo"
                            className="w-full h-auto"
                        />
                    </div>
                    <div>
                        <img
                            src={HyperX}
                            alt="Dell Logo"
                            className="w-full h-auto"
                        />
                    </div>
                    <div>
                        <img
                            src={Alienware}
                            alt="Alienware Logo"
                            className="w-full h-auto"
                        />
                    </div>
                    {/* Add more images here */}
                </Slider>
                <style jsx global>{`
                .slick-dots {
                    bottom: 20px; /* Adjust the distance from the bottom */
                }
                .slick-dots li button::before {
                    font-size: 10px; /* Adjust the size of the dots */
                }
            `}</style>
            </div>
        </>
    );
};

export default PhotoSlider;