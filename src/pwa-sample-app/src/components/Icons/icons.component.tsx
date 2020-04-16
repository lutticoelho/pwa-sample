import React from 'react';

type IconProps = {
    name: string,
    alt?: string,
    style?: React.CSSProperties
}

export const Icon = (props: IconProps & React.CSSProperties) =>
<span className="material-icons" style={props.style}>{props.name}</span>