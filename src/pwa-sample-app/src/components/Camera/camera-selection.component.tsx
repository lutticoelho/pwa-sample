import React, { Component } from 'react';
import { Message } from 'components/Message/message.component';

type DeviceSelectionState = {
    devices: MediaDeviceInfo[],
    permissionStatus: string,
    isCameraSupported: boolean
}

type DeviceSelectionProps = {
    kind: string
}

export default class DeviceSelectionComponent extends Component<DeviceSelectionProps, DeviceSelectionState> {

    constructor(props: any) {
        super(props);

        this.state = {
            devices: [],
            permissionStatus: '',
            isCameraSupported: !!navigator.mediaDevices
        };
        this.getAvailableVideoDevices = this.getAvailableVideoDevices.bind(this);
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
                    permissionStatus: permissionStatus.state
                });
                permissionStatus.onchange = () => this.onChangePermissionStatus(permissionStatus);
            });
    }

    onChangePermissionStatus(permissionStatus: PermissionStatus) {
        this.setState({
            ...this.state,
            permissionStatus: permissionStatus.state
        });
    }

    getAvailableVideoDevices(mediaDevices: MediaDeviceInfo[]) {
        let devices: MediaDeviceInfo[] = [];
        mediaDevices.forEach(mediaDevice => {
            if (mediaDevice.kind !== this.props.kind) {
                return;
            }
            devices.push(mediaDevice);
        });
        this.setState({ devices: devices });
    }

    render() {
        if (!this.state.isCameraSupported) {
            return (<Message message='Your browser do not support geolocation api.' />)
        }

        switch (this.state.permissionStatus) {
            case 'granted':
                navigator.mediaDevices.enumerateDevices().then(this.getAvailableVideoDevices);
                const options = !this.state?.devices ? null : this.state.devices.map(i => <option key={i.deviceId} value={i.deviceId}>{i.label}</option>);
                return (<select id='mediaDevices'>{options}</select>);
            case 'denied':
                return (<span>You have denied access to your camera api.</span>);
            case 'prompted':
                return (<span>Please allow us to access your camera api.</span>);
            default:
                return (<span>Loading...</span>);
        }
    }
}