import React from 'react';
import Slider from "react-slick";

interface PhotoSliderProps {
    images: string[]
    selectedIndex?: number
}

type ArrowProps = React.ComponentProps<'button'>;

const CustomPrevArrow: React.FC<ArrowProps> = (props) => {
    return (
        <button {...props} style={{ background: 'transparent', border: 'none', cursor: 'pointer', zIndex: 1 }}>
            <img src="arrow-left.png" alt="Previous" style={{ width: '50px', height: '50px'}} />
        </button>
    );
};

const CustomNextArrow: React.FC<ArrowProps> = (props) => {
    return (
        <button {...props} style={{ background: 'transparent', border: 'none', cursor: 'pointer', zIndex: 1 }}>
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
        adaptiveHeight: true, // Ключевая настройка для адаптации высоты
    };

    return (
        <Slider {...settings} className={'slider'}>
            {images.map((image, index) => (
                <div key={index} className="slide-container">
                    <img
                        src={image}
                        alt={`Slide ${index}`}
                        style={{
                            width: '100%',
                            maxHeight: '600px', // Максимальная высота для очень больших изображений
                            objectFit: 'contain' // Сохраняет пропорции изображения
                        }}
                    />
                </div>
            ))}
        </Slider>
    );
};

export default PhotoSlider;