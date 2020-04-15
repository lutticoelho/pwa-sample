import React from 'react';
import { NavLink } from 'react-router-dom';

import { Icon } from 'components/Icons/icons.component';

type NavigationProps = {
    history: any
}

export const NavigationBar = (props: NavigationProps) =>
    <div className="navbar">
        <nav>
            <NavLink exact to="/" activeClassName="active"><Icon name="flag"/></NavLink>
            <NavLink to="/geolocation" activeClassName="active"><Icon name="place" /></NavLink>
            <NavLink to="/camera" activeClassName="active"><Icon name="camera_alt" /></NavLink>
            <NavLink to="/notfound" activeClassName="active"><Icon name="mic" /></NavLink>
            <NavLink to="/not-found" activeClassName="active"><Icon name="vibration" /></NavLink>
            <NavLink to="/localstorage" activeClassName="active"><Icon name="storage" /></NavLink>
            <NavLink to="/lights" activeClassName="active"><Icon name="wb_sunny" /></NavLink>
        </nav>
    </div>
