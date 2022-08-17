import React from 'react';

import '../styles/button.css';

const Button = ({className, children, ...props}) => (
    <button className={"button " + className} {...props}>
        {children}
    </button>
)

export default Button;