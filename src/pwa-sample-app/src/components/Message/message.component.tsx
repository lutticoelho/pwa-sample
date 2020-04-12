import React from 'react';

type MessageProps = {
    message: string
}

export const Message = (props: MessageProps) =>
    <div className="App">
        <header className="App-header">
            <p>
                {props.message}
            </p>
        </header>
    </div>