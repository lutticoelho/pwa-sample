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
            <NavLink to="/microphone" activeClassName="active"><Icon name="mic" /></NavLink>
            <NavLink to="/text-to-speech" activeClassName="active"><Icon name="record_voice_over" /></NavLink>
            <NavLink to="/speech-recognition" activeClassName="active"><Icon name="settings_voice" /></NavLink>
            <NavLink to="/vibrate" activeClassName="active"><Icon name="vibration" /></NavLink>
            <NavLink to="/localstorage" activeClassName="active"><Icon name="storage" /></NavLink>
            <NavLink to="/lights" activeClassName="active"><Icon name="wb_sunny" /></NavLink>
        </nav>
    </div>
