import React from 'react'
import "./Button.css"
import { NavLink } from 'react-router-dom'

function Button({ btnContent, link, className, onCLick }) {
    return (
        <NavLink to={link} className={`mainButton ${className}`} onClick={onCLick}>
            <span className="button-content">{btnContent}</span>
        </NavLink>
    )
}

export default Button