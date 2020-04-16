import React, { Component } from 'react';
import 'components/Camera/camera.css';
import DeviceSelectionComponent from './device-selection.component';
import { Message } from 'components/Message/message.component';

type CameraState = {
    mediaDevicesStatus: string,
    isCameraSupported: boolean,
    selectedCamera: string
};

export default class CameraComponent extends Component<{}, CameraState> {

    private videoRef: React.RefObject<HTMLVideoElement>;
    private canvasRef: React.RefObject<HTMLCanvasElement>;
    private currentStream?: MediaStream;
    private isStreamming: boolean = false;

    constructor(props: {}) {
        super(props);
        this.state = {
            mediaDevicesStatus: '',
            isCameraSupported: !!navigator.mediaDevices,
            selectedCamera: ''
        };

        this.videoRef = React.createRef();
        this.canvasRef = React.createRef();

        this.setMediaStream = this.setMediaStream.bind(this);
        this.handleCanPlay = this.handleCanPlay.bind(this);
        this.onChangeCamera = this.onChangeCamera.bind(this);
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
        this.startStreamming();            
    }

    componentWillUnmount() {
        if (typeof this.currentStream !== 'undefined') {
            this.stopStreamming();
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

    setMediaStream(stream: MediaStream) {
        if (stream && this.videoRef.current) {
            this.videoRef.current.srcObject = stream;
            this.currentStream = stream;
        }
    }

    startStreamming(constraints?: MediaStreamConstraints | undefined) {
        if (!constraints) {
            constraints = { video: true };
        }

        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
            // Without `{ audio: true }` since we only want video now
            navigator.mediaDevices.getUserMedia(constraints).then(this.setMediaStream).catch((error) => console.warn(JSON.stringify(error)));
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

    onChangeCamera(evt: React.FormEvent<HTMLSelectElement>) {
        if (typeof this.currentStream !== 'undefined') {
            this.stopStreamming();
        }

        const value = evt.currentTarget.value;
        const videoConstraints = {} as MediaTrackConstraints;

        if (value === '') {
            videoConstraints.facingMode = 'environment';
        } else {
            videoConstraints.deviceId = { exact: value };
        }

        const constraints = {
            video: videoConstraints
        } as MediaStreamConstraints;

        this.startStreamming(constraints);

        this.setState({
            ...this.state,
            selectedCamera: value
        });
    }

    handleCanPlay() {
        this.videoRef.current?.play();
    }

    onClickButton(evt: React.FormEvent<HTMLButtonElement>) {
        if (!this.canvasRef.current) {
            return;
        }

        const context = this.canvasRef.current.getContext("2d");
        if (!context) {
            return;
        }

        context.drawImage(this.videoRef.current as CanvasImageSource, 0, 0);
    }

    render() {

        if (!this.state.isCameraSupported) {
            return (<Message message='Your browser do not support geolocation api.' />)
        }

        if (this.state.mediaDevicesStatus !== 'granted') {
            switch (this.state.mediaDevicesStatus) {
                case 'denied':
                    return (<Message message='You have denied access to your camera api.' />);
                case 'prompt':
                    return (<Message message='Please allow us to access your camera api.' />);
                default:
                    return (<Message message='Loading...' />);
            }
        }

        return (
            <div className="full-view-port">
                <div className="">
                    <video
                        ref={this.videoRef}
                        onCanPlay={this.handleCanPlay}
                        autoPlay
                        playsInline
                        muted
                    />
                </div>
                <div className="camera-controls">
                    <DeviceSelectionComponent kind="videoinput" onChangeDevice={this.onChangeCamera} selected={this.state.selectedCamera} />
                    <button onClick={this.onClickButton.bind(this)}>snap photo</button>
                </div>
                <div className="">
                <canvas id="canvas" ref={this.canvasRef} width="640" height="480"></canvas>
                </div>
            </div>
        );
    }
}
