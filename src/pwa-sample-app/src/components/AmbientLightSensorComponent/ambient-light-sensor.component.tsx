import React, { Component } from 'react';
import { Message } from 'components/Message/message.component';

type AmbientLightSensorState = {
    isSupported: boolean,
    illuminance: number,
    permissionStatus: string,
    bgColor: string
};

export default class AmbientLightSensorComponent extends Component<{}, AmbientLightSensorState> {

    constructor(props: any) {
        super(props);

        this.state = {
            isSupported: ("AmbientLightSensor" in window),
            illuminance: 0,
            permissionStatus: '',
            bgColor: '#000000'
        }

        this.onChangePermissionStatus = this.onChangePermissionStatus.bind(this);
        this.onUpdateDeviceLight = this.onUpdateDeviceLight.bind(this);
        this.update = this.update.bind(this);
    }

    componentDidMount() {
        if (!this.state.isSupported) {
            return;
        }

        try {
            navigator.permissions.query({ name: 'ambient-light-sensor' })
                .then(function (permissionStatus) {
                    console.log('ambient-light-sensor permission state is ', permissionStatus.state);
                    return permissionStatus;
                })
                .then(permissionStatus => {
                    this.setState({
                        ...this.state,
                        permissionStatus: permissionStatus.state
                    });
                    permissionStatus.onchange = () => this.onChangePermissionStatus(permissionStatus);
                });

            //TODO: REMOVE EVAL
            // eslint-disable-next-line no-eval
            var sensor = eval('new AmbientLightSensor()');
            sensor.addEventListener("reading", (event: any) => this.update(sensor.illuminance));
            sensor.start();

            if ("ondevicelight" in window) {
                window.addEventListener("devicelight", this.onUpdateDeviceLight);
            }

        } catch (e) {
            console.error(e);
        }
    }

    onUpdateDeviceLight(event: any) {
        this.update(event.value);
    }

    onChangePermissionStatus(permissionStatus: PermissionStatus) {
        this.setState({
            ...this.state,
            permissionStatus: permissionStatus.state
        });
    }

    update(illuminance: number) {
        const colorPart = Math.min(255, illuminance).toFixed(0);

        this.setState({
            illuminance,
            bgColor: `rgb(${colorPart},${colorPart},${colorPart})`
        });
    }

    render() {
        if (!this.state.isSupported) {
            return (<Message message='Your browser do not support AmbientLightSensor api.' />)
        }

        if (this.state.permissionStatus !== 'granted') {
            switch (this.state.permissionStatus) {
                case 'denied':
                    return (<Message message='You have denied access to your AmbientLightSensor api.' />);
                case 'prompt':
                    return (<Message message='Please allow us to access your AmbientLightSensor api.' />);
                default:
                    return (<Message message='Loading...' />);
            }
        }

        return (
            <div className="full-view-port" style={{ backgroundColor: this.state.bgColor }}>
                <Message message={`Ambient Light = ${this.state.illuminance} lux`} />
            </div>
        );
    }
}

