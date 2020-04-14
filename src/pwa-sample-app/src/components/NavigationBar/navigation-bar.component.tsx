import React from 'react';
import { NavLink } from 'react-router-dom';

type NavigationProps = {
    history: any
}

export const NavigationBar = (props: NavigationProps) =>
    <div className="navbar">
        <nav>
            <NavLink exact to="/" activeClassName="active">Home</NavLink>
            <NavLink to="/geolocation" activeClassName="active">Geolocation</NavLink>
            <NavLink to="/camera" activeClassName="active">Camera</NavLink>
            <NavLink to="/not-found" activeClassName="active">404</NavLink>
        </nav>
    </div>
