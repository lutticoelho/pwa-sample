import React, { Component } from 'react';
import { Message } from 'components/Message/message.component';

type DeviceSelectionState = {
    devices: MediaDeviceInfo[],
    permissionStatus: string,
    isCameraSupported: boolean,
    selectedDevice: string
}

type DeviceSelectionProps = {
    kind: string,
    onChangeDevice: Function,
    selected: string
}

export default class DeviceSelectionComponent extends Component<DeviceSelectionProps, DeviceSelectionState> {

    constructor(props: any) {
        super(props);

        this.state = {
            devices: [{deviceId: '', label: 'default', groupId: '', kind: props.kind} as MediaDeviceInfo],
            permissionStatus: '',
            isCameraSupported: !!navigator.mediaDevices,
            selectedDevice: '',
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

        if (this.state.permissionStatus === permissionStatus.state) {
            return;
        }
        this.setState({
            ...this.state,
            permissionStatus: permissionStatus.state
        });
    }

    handleChange(evt: React.FormEvent<HTMLSelectElement>) {
        this.setState({ selectedDevice: evt.currentTarget.value });
    }

    getAvailableVideoDevices(mediaDevices: MediaDeviceInfo[]) {
        let devices: MediaDeviceInfo[] = [];
        mediaDevices.forEach(mediaDevice => {
            if (mediaDevice.kind !== this.props.kind || this.state.devices.map(d => d.deviceId).includes(mediaDevice.deviceId)) {
                return;
            }
            devices.push(mediaDevice);
        });

        if (devices.length === 0) {
            return;
        }

        this.setState({ devices: [...this.state.devices, ...devices] });
    }

    render() {
        if (!this.state.isCameraSupported) {
            return (<Message message='Your browser do not support geolocation api.' />)
        }

        switch (this.state.permissionStatus) {
            case 'granted':
                navigator.mediaDevices.enumerateDevices().then(this.getAvailableVideoDevices);
                const options = !this.state?.devices ? null : this.state.devices.map(i => <option key={i.deviceId} value={i.deviceId}>{i.label}</option>);
                return (<select id='mediaDevices' onChange={this.props.onChangeDevice.bind(this) || this.handleChange} value={this.state.selectedDevice || this.props.selected}>{options}</select>);
            case 'denied':
                return (<span>You have denied access to your camera api.</span>);
            case 'prompted':
                return (<span>Please allow us to access your camera api.</span>);
            default:
                return (<span>Loading...</span>);
        }
    }
}