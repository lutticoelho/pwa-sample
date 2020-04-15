import React from 'react';

type IconProps = {
    name: string,
    alt?: string
}

export const Icon = (props: IconProps) =>
<span className="material-icons">{props.name}</span>