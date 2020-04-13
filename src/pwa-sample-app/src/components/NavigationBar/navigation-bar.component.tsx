import React from 'react';
import { Link } from 'react-router-dom';

type NavigationProps = {
    history: any
}

export const NavigationBar = (props: NavigationProps) =>
    <div className="navbar">
        <nav>
            <Link to="/" className={props.history.location.pathname === '/' ? "active" : ''}>Home</Link>
            <Link to="/geolocation" className={props.history.location.pathname === '/geolocation' ? "active" : ''}>Geolocation</Link>
            <Link to="/camera" className={props.history.location.pathname === '/camera' ? "active" : ''}>Camera</Link>
            <Link to="not-found" className={props.history.location.pathname === '/404' ? "active" : ''}>404</Link>
        </nav>
    </div>
