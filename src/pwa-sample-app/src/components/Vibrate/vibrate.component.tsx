import React, { Component } from 'react';
import { Message } from 'components/Message/message.component';

export default class VibrateComponent extends Component<{}, {}> {

    randomVibrate(evt: any) {
        navigator.vibrate([100,30,100,30,100,30,200,30,200,30,200,30,100,30,100,30,100]);
        console.log('vibrate');
    }

    render() {
        if (!navigator.vibrate) {
            return (<Message message='Your browser do not support vibration.' />)
        }

        return (
            <div className="full-view-port">
                <div className="button" onClick={this.randomVibrate.bind(this)}>
                    <p>Click me</p>
                </div>
            </div>
        );
    }
}

