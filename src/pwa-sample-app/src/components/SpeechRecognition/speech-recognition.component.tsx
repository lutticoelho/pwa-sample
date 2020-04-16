import React, { Component } from 'react';
import { Message } from 'components/Message/message.component';

type SpeechRecognitionProps = {
    message: string,
    mediaDevicesStatus: string,
    isRecording: boolean
}

export default class SpeechRecognitionComponent extends Component<{}, SpeechRecognitionProps> {

    private isSupported: boolean;
    private speechRecognition: any;

    constructor(props: any) {
        super(props);

        this.state = {
            message: '',
            mediaDevicesStatus: '',
            isRecording: false
        }


        this.speechRecognition = eval('new webkitSpeechRecognition()');
        this.isSupported = !!this.speechRecognition;

        this.onEndRecognition = this.onEndRecognition.bind(this);
        this.start = this.start.bind(this);
        this.stop = this.stop.bind(this);
        this.onStop = this.onStop.bind(this);
        this.onClick = this.onClick.bind(this);
    }

    componentDidMount() {
        navigator.permissions.query({ name: 'microphone' })
            .then(function (permissionStatus) {
                console.log('microphone permission state is ', permissionStatus.state);
                return permissionStatus;
            })
            .then(permissionStatus => {
                this.setState({
                    ...this.state,
                    mediaDevicesStatus: permissionStatus.state
                });
                permissionStatus.onchange = () => this.onChangePermissionStatus(permissionStatus);
            });
    }

    onChangePermissionStatus(permissionStatus: PermissionStatus) {
        this.setState({
            ...this.state,
            mediaDevicesStatus: permissionStatus.state
        });
    }

    start() {
        this.speechRecognition.interimResults = true;
        this.speechRecognition.lang = "en-US";
        this.speechRecognition.continuous = true;

        this.setState({ isRecording: true }, () => this.speechRecognition.start());

        // This event happens when you talk in the microphone
        this.speechRecognition.onresult = this.onEndRecognition;
        this.speechRecognition.onend = this.onStop;
    };

    onStop() {
        this.setState({ isRecording: false });
    }

    stop() {
        this.speechRecognition.stop();
    }

    onEndRecognition(event: any) {
        for (let i = event.resultIndex; i < event.results.length; i++) {
            if (event.results[i].isFinal) {
                // Here you can get the string of what you told
                const content = event.results[i][0].transcript.trim();

                if (this.state.message !== content) {
                    this.setState({ message: content });
                    this.readOutLoud(content);
                }
            }
        }
    }

    onClick() {
        if (this.state.isRecording) {
            this.stop();
            return;
        }

        this.start();
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

        if (!this.isSupported) {
            return (<Message message='Your browser do not support Speech Recognition.' />)
        }

        if (this.state.mediaDevicesStatus !== 'granted') {
            switch (this.state.mediaDevicesStatus) {
                case 'denied':
                    return (<Message message='You have denied access to your microphone api.' />);
                case 'prompt':
                    return (<Message message='Please allow us to access your microphone api.' />);
                default:
                    return (<Message message='Loading...' />);
            }
        }

        return (
            <div className="center-content">
                <span style={{ position: "absolute", top: '20vh', color: '#fff' }} >{this.state.message ?? 'Say something to me'}</span>
                <div className="button" onClick={this.onClick}>
                    <p>{this.state.isRecording ? 'Stop' : 'Click and say something'}</p>
                </div>
            </div>
        );

    }
}
