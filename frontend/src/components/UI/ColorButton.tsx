import React from 'react';

interface GreyButtonProps {
    children: React.ReactNode;
    onClick?: () => void
    className?: string
    disabled?: boolean
    title?: string
}


const ColorButton: React.FC<GreyButtonProps> = ({ children, onClick, disabled, title, className }) => {
    return (
        <button
            disabled={disabled}
            title={title}
            className={`color_button ${className}`}
            onClick={onClick}>
            {children}
        </button>
    );
};

export default ColorButton;