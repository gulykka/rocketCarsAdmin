import React from 'react';

interface GreyButtonProps {
    children: React.ReactNode;
    onClick?: () => void
    className?: string
}


const ColorButton: React.FC<GreyButtonProps> = ({ children, onClick, className }) => {
    return (
        <button className={`color_button ${className}`} onClick={onClick}>
            {children}
        </button>
    );
};

export default ColorButton;