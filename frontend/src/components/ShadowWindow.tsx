// ShadowWindow.tsx
import React, { FC, useEffect } from 'react';
import PhotoSlider from './PhotoSlider';
import ChangePassword from './ChangePassword';
import './components.sass';
import ModalPortal from "../ModalPortal";

interface ShadowWindowProps {
    onClose: () => void;
    imageSrc?: string[];
    selectedIndex?: number;

}

const ShadowWindow: FC<ShadowWindowProps> = ({ imageSrc, onClose, selectedIndex }) => {
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
        <ModalPortal> {/* ✅ Оборачиваем весь ShadowWindow */}
            <div className="overlay" onClick={onClose} />
            <div className="shadow_window_img_container">
                {imageSrc && imageSrc.length > 0 ? (
                    <>
                        <PhotoSlider images={imageSrc} selectedIndex={selectedIndex} />
                        <img
                            onClick={onClose}
                            className="cancel"
                            src="cancel.png"
                            alt="Закрыть"
                        />
                    </>
                ) : (
                    <div className="change_input_container">
                        <ChangePassword onClose={onClose}/>
                        <img
                            onClick={onClose}
                            className="cancel"
                            src="cancel.png"
                            alt="Закрыть"
                        />
                    </div>
                )}
            </div>
        </ModalPortal>
    );
};

export default ShadowWindow;