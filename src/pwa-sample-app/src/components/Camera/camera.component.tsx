import React, { Component } from 'react';
import 'components/Camera/camera.css';
import DeviceSelectionComponent from './camera-selection.component';
import { Message } from 'components/Message/message.component';

type CameraState = {
    mediaStream: MediaStream | null,
    mediaDevicesStatus: string,
    isCameraSupported: boolean
};

export default class CameraComponent extends Component<{}, CameraState> {

    private videoRef: React.RefObject<HTMLVideoElement>;
    private isStreamming: boolean = false;

    constructor(props: {}) {
        super(props);
        this.state = {
            mediaStream: null,
            mediaDevicesStatus: '',
            isCameraSupported: !!navigator.mediaDevices
        };

        this.videoRef = React.createRef();

        this.setMediaStreamIntoState = this.setMediaStreamIntoState.bind(this);
        this.handleCanPlay = this.handleCanPlay.bind(this);
    }

    componentDidMount() {
        navigator.permissions.query({ name: 'camera' })
            .then(function (permissionStatus) {
                console.log('camera permission state is ', permissionStatus.state);
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

        this.startStreasmming();
    }

    setMediaStreamIntoState(stream: MediaStream) {
        if (stream && this.videoRef.current && !this.videoRef.current.srcObject) {
            this.videoRef.current.srcObject = stream;
        }

        this.setState({
            ...this.state,
            mediaStream: stream
        });
    }

    startStreasmming() {
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
            // Without `{ audio: true }` since we only want video now
            navigator.mediaDevices.getUserMedia({ video: true }).then(this.setMediaStreamIntoState);
            this.isStreamming = true;
        }
    }

    handleCanPlay() {
        this.videoRef.current?.play();
    }

    render() {

        if (!this.state.isCameraSupported) {
            return (<Message message='Your browser do not support geolocation api.' />)
        }

        if (this.state.mediaDevicesStatus !== 'granted') {
            switch (this.state.mediaDevicesStatus) {
                case 'denied':
                    return (<Message message='You have denied access to your camera api.' />);
                case 'prompted':
                    return (<Message message='Please allow us to access your camera api.' />);
                default:
                    return (<Message message='Loading...' />);
            }
        }

        if(!this.isStreamming) {
            this.startStreasmming();
        }

        return (
            <div className="full-view-port">
                <video
                    ref={this.videoRef}
                    onCanPlay={this.handleCanPlay}
                    style={{ top: 0, left: 0, width: '100vw' }}
                    autoPlay
                    playsInline
                    muted
                />
                <DeviceSelectionComponent kind="camera" />
            </div>
        );
    }
}
