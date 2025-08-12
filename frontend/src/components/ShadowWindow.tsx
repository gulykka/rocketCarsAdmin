import React, {FC, useEffect} from 'react';
import PhotoSlider from "./PhotoSlider";
import {ICarPhoto} from "../interfaces";
import './components.sass'
import ChangePassword from "./ChangePassword";

interface ShadowWindowProps {
    onClose: () => void
    imageSrc?: ICarPhoto[]
    selectedIndex?: number
}

const ShadowWindow: FC<ShadowWindowProps> = ({imageSrc, onClose, selectedIndex}) => {
    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                onClose();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [onClose]);

    return (
        <>
            <div className="overlay" onClick={onClose}/>
            <div className="shadow_window_img_container">
                {imageSrc && imageSrc.length > 0  &&
                    <PhotoSlider
                        images={imageSrc}/>}
                {!imageSrc &&
                    <div className={'change_input_container'}>
                        <ChangePassword />
                        <img
                            onClick={onClose}
                            className={'cancel'}
                            src={'cancel.png'}/>
                    </div>
                }
            </div>
        </>
    );

};

export default ShadowWindow;