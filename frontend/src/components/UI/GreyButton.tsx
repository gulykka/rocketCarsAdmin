import React from 'react';
import './UI.sass'

interface GreyButtonProps {
    children: React.ReactNode;
    className?: string
}

const GreyButton: React.FC<GreyButtonProps> = ({ children, className }) => {
    return (
        <button className={`grey_button ${className}`}>
            {children}
        </button>
    );
};

export default GreyButton;