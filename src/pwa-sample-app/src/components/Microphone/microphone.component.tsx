import React, { Component } from 'react';
import DeviceSelectionComponent from 'components/Camera/device-selection.component';
import { Message } from 'components/Message/message.component';
import { MediaRecorder, IMediaRecorder } from 'extendable-media-recorder';


type MicrophoneState = {
    mediaDevicesStatus: string,
    isMicrophoneSupported: boolean,
    isRecording: boolean,
    selectedMicrophone: string
    recordedAudios: string[],
};

export default class MicrophoneComponent extends Component<{}, MicrophoneState> {

    private currentStream?: MediaStream;
    private isStreamming: boolean = false;
    private mediaRecorder: IMediaRecorder | undefined;
    private chunks: any[] = [];

    constructor(props: {}) {
        super(props);
        this.state = {
            mediaDevicesStatus: '',
            isMicrophoneSupported: !!navigator.mediaDevices,
            isRecording: false,
            selectedMicrophone: '',
            recordedAudios: []
        };

        this.setMediaStream = this.setMediaStream.bind(this);
        this.onChangeMicrophone = this.onChangeMicrophone.bind(this);
        this.onStop = this.onStop.bind(this);
        this.onDataAvailable = this.onDataAvailable.bind(this);
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

    componentWillUnmount() {
        if (typeof this.currentStream !== 'undefined') {
            this.stopStreamming();
        }

        if(!!this.mediaRecorder) {
            this.mediaRecorder.removeEventListener('stop', this.onStop);
        }
    }

    onChangePermissionStatus(permissionStatus: PermissionStatus) {
        this.setState({
            ...this.state,
            mediaDevicesStatus: permissionStatus.state
        });

        if (this.isStreamming) {
            return;
        }
        this.startStreamming();
    }

    async setMediaStream(stream: MediaStream) {

        if (stream) {
            this.currentStream = stream;
        }

        this.mediaRecorder = new MediaRecorder(stream); 
        this.mediaRecorder.addEventListener('stop', this.onStop);
        this.mediaRecorder.ondataavailable = this.onDataAvailable;
    }

    onStop(e: any) {
        console.log("data available after MediaRecorder.stop() called.");

        ;
        console.log("recorder stopped");

        
    }

    onDataAvailable(e: any) {
        this.chunks.push(e.data);
        console.log("data available called.");

        if (!this.mediaRecorder || this.mediaRecorder.state === 'recording') {
            return;
        }

        console.info("data available called after stop.");
        this.saveRecording();
    }

    saveRecording() {
        const blob = new Blob(this.chunks, { 'type': 'audio/oog; codecs=opus' });
        this.chunks = [];
        const audioURL = window.URL.createObjectURL(blob);
        this.setState({ recordedAudios: [...this.state.recordedAudios, audioURL] });
    }

    startRecording() {
        if (!this.mediaRecorder || this.mediaRecorder.state === 'recording') {
            return;
        }

        // Kick off the recording.
        this.mediaRecorder.start();
        this.setState({isRecording: true});
        console.log("start recording");
    }

    stopRecording() {
        if (!this.mediaRecorder || this.mediaRecorder.state !== 'recording') {
            return;
        }

        this.mediaRecorder?.stop();
        this.setState({isRecording: false});
        console.log("stop recording");
    }

    startStreamming() {
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
            navigator.mediaDevices.getUserMedia({ audio: true }).then(this.setMediaStream).catch((error) => console.warn(JSON.stringify(error)));
            this.isStreamming = true;
        }
    }

    stopStreamming() {
        this.currentStream?.getTracks().forEach(track => {
            track.stop();
        });

        this.currentStream = undefined;
        this.isStreamming = false;
    }

    onChangeMicrophone(evt: React.FormEvent<HTMLSelectElement>) {
        if (typeof this.currentStream !== 'undefined') {
            this.stopStreamming();
        }

        const value = evt.currentTarget.value;

        this.startStreamming();

        this.setState({
            ...this.state,
            selectedMicrophone: value
        });
    }

    renderAudios() {
        if (this.state.recordedAudios.length === 0) {
            return null;
        }

        const audioTracks = this.state.recordedAudios.map((track, index) =>
            <li key={index} className="audio-track">
                Recording {index + 1}
                <audio controls src={track}></audio>
            </li>);

        return (<ul className="audio-track-list">{audioTracks}</ul>);
    }

    render() {

        if (!this.state.isMicrophoneSupported) {
            return (<Message message='Your browser do not support microphone api.' />)
        }

        if (this.state.mediaDevicesStatus !== 'granted') {
            switch (this.state.mediaDevicesStatus) {
                case 'denied':
                    return (<Message message='You have denied access to your microphone api.' />);
                case 'prompted':
                    return (<Message message='Please allow us to access your microphone api.' />);
                default:
                    return (<Message message='Loading...' />);
            }
        }

        return (
            <div className="center-content">
                <div className="">
                    {this.renderAudios()}
                </div>
                <div className="bottom-form">
                    <DeviceSelectionComponent kind="audioinput" onChangeDevice={this.onChangeMicrophone} selected={this.state.selectedMicrophone} />
                    <button onClick={this.startRecording.bind(this)}>{this.state.isRecording ? 'Recording' : 'Record'}</button>
                    <button onClick={this.stopRecording.bind(this)}>{this.state.isRecording ? 'Stop' : '--'}</button>
                </div>
            </div>
        );
    }
}