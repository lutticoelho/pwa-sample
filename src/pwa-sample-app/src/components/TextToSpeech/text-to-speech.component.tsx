import React, { Component } from 'react';
import { Message } from 'components/Message/message.component';

type MessageProps = {
    message: string
}

export default class TextToSpeechComponent extends Component<{}, MessageProps> {

    constructor(props: any) {
        super(props);

        this.state = {
            message: ''
        }

        this.readOutLoud = this.readOutLoud.bind(this);
    }

    readOutLoud(message: string) {
        var speech = new SpeechSynthesisUtterance();

        // Set the text and voice attributes.
        speech.text = message;
        speech.volume = 1;
        speech.rate = 1;
        speech.pitch = 1;

        window.speechSynthesis.speak(speech);
    }

    onChangeInput(e: React.FormEvent<HTMLInputElement>) {
        this.setState({ message: e.currentTarget.value });
    }

    render() {

        if (!window.speechSynthesis) {
            return (<Message message='Your browser do not support Text To Speech.' />)
        }

        return (
            <div className="center-content">
                <input type="text" value={this.state.message} style={{position: "absolute", top: '30vh'}} onChange={this.onChangeInput.bind(this)} />
                <div className="button" onClick={() => this.readOutLoud(this.state.message)}>
                    <p>Say it</p>
                </div>
            </div>
        );

    }
}
