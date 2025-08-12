import React from 'react';
import {ICarPhoto} from "../interfaces";
import Slider from "react-slick";

interface PhotoSliderProps {
    images: ICarPhoto[]
    selectedIndex?: number
}

// Определите типы для пропсов стрелок
type ArrowProps = React.ComponentProps<'button'>;

const CustomPrevArrow: React.FC<ArrowProps> = (props) => {
    return (
        <button {...props} style={{ background: 'transparent', border: 'none', cursor: 'pointer' }}>
            <img src="arrow-left.png" alt="Previous" style={{ width: '50px', height: '50px'}} />
        </button>
    );
};

const CustomNextArrow: React.FC<ArrowProps> = (props) => {
    return (
        <button {...props} style={{ background: 'transparent', border: 'none', cursor: 'pointer' }}>
            <img src="arrow-right.png" alt="Next" style={{ width: '50px', height: '50px'}} />
        </button>
    );
};

const PhotoSlider: React.FC<PhotoSliderProps> = ({ images }) => {
    const settings = {
        dots: true,
        infinite: true,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: false,
        arrows: true,
        prevArrow: <CustomPrevArrow />,
        nextArrow: <CustomNextArrow />,
    };

    return (
        <Slider {...settings} className={'slider'}>
            {images.map((image, index) => (
                <div key={index}>
                    <img src={image.url} alt={`Slide ${index}`} style={{ width: '100%', height: 'auto' }} />
                </div>
            ))}
        </Slider>
    );
};

export default PhotoSlider;
