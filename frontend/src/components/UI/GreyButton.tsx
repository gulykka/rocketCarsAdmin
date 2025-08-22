import React from 'react';
import './UI.sass'

interface GreyButtonProps {
    children: React.ReactNode;
    className?: string
    onClick?: () => void
    disabled?: boolean
    title?: string
}

const GreyButton: React.FC<GreyButtonProps> = ({ children, className, onClick, disabled, title }) => {
    return (
        <button
            onClick={onClick}
            disabled={disabled}
            title={title}
            className={`grey_button ${className}`}>
            {children}
        </button>
    );
};

export default GreyButton;