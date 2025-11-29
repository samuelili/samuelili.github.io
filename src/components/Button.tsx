import React, { ButtonHTMLAttributes } from 'react';

import '../styles/button.css';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    className?: string;
}

const Button: React.FC<ButtonProps> = ({ className = "", children, ...props }) => (
    <button className={"button " + className} {...props}>
        {children}
    </button>
)

export default Button;