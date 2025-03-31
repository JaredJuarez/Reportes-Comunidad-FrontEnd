import React from 'react';

const Button = ({ type, onClick, children, className }) => {
    return (
        <button
            type={type}
            onClick={onClick}
            className={`button ${className} inline-flex items-center justify-center`}
        >
            {children}
        </button>
    );
};

export default Button;